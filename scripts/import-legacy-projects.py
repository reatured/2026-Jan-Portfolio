#!/usr/bin/env python3
"""Import reviewed legacy content and web-sized original media into the formal site.
Run from any directory. Requires Pillow and ffmpeg; not run during website builds.
"""
from pathlib import Path
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse
from PIL import Image, ImageOps
import hashlib, io, json, os, re, subprocess

SITE = Path(__file__).resolve().parents[1]
source_override = os.environ.get('PORTFOLIO_LEGACY_SOURCE')
source_candidates = [SITE.parent / '2026-Jan-Portfolio-source', SITE.parent / '2026-Jan-Portfolio']
OLD = Path(source_override).expanduser().resolve() if source_override else next(
    (path for path in source_candidates if (path / 'config/data.json').is_file()), source_candidates[0])
if not (OLD / 'config/data.json').is_file():
    raise SystemExit('January source files are missing. Set PORTFOLIO_LEGACY_SOURCE to a checkout of the original portfolio (b3137d9).')
OUT = SITE / 'public/projects/archive'
OUT.mkdir(parents=True, exist_ok=True)
CONFIG = json.loads((SITE / 'scripts/legacy-project-editorial.json').read_text())
EDITORIAL = CONFIG['EDITORIAL']
DATA = json.loads((OLD / 'config/data.json').read_text())['projects']
RICH = json.loads((OLD / 'config/richContent.json').read_text())

class Node:
    def __init__(self, tag='', attrs=None): self.tag, self.attrs, self.children = tag, dict(attrs or []), []
    def text(self): return re.sub(r'\s+', ' ', ' '.join(c.text() if isinstance(c,Node) else c for c in self.children)).strip()
    def find(self, tag):
        return [c for c in self.children if isinstance(c,Node) and c.tag == tag] + [n for c in self.children if isinstance(c,Node) for n in c.find(tag)]
class Tree(HTMLParser):
    def __init__(self, html): super().__init__(); self.root=Node(); self.stack=[self.root]; self.feed(html)
    def handle_starttag(self,t,a):
        n=Node(t,a);self.stack[-1].children.append(n)
        if t not in ('img','br','hr','input','source','meta','link'):self.stack.append(n)
    def handle_endtag(self,t):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==t: self.stack=self.stack[:i];break
    def handle_data(self,d): self.stack[-1].children.append(d)

def notes_for(p):
    if 'notes' in EDITORIAL[p['id']]: return EDITORIAL[p['id']]['notes']
    rich = p['content'] if p['id'] in CONFIG['DETAILED_CONTENT_IDS'] else RICH.get(p['id'],p['content'])
    result=[]
    for section in Tree(rich).root.find('section'):
        heads=section.find('h2');heading=heads[0].text() if heads else 'Project notes'
        # The compact overview already says this; keep substantive process and results.
        if heading in ('Overview','Takeaway','Tools','Tools and Stack'):continue
        entry=dict(heading=heading)
        paragraphs=[n.text() for n in section.find('p') if n.text()]
        items=[n.text() for n in section.find('li') if n.text()]
        for fact in section.find('div'):
            if fact.attrs.get('class')=='project-fact': items.append(fact.text())
        tables=section.find('table')
        if paragraphs:entry['paragraphs']=paragraphs
        if items:entry['items']=items
        if tables:
            rows=tables[0].find('tr')
            entry['table']=dict(headings=[x.text() for x in rows[0].find('th')],rows=[[x.text() for x in row.find('td')] for row in rows[1:]])
        if len(entry)>1:result.append(entry)
    return result

# Make assets content-addressed and deduplicate repeated gallery/cover references.
source_paths={}
for p in DATA:
    if p.get('hidden'):continue
    for m in [p['featuredMedia'],*p['mediaGallery']]:
        if m['src'].startswith('/') and not m['src'].endswith('.svg'):
            path=OLD/'public'/m['src'].lstrip('/')
            source_paths[m['src']]=(path, hashlib.sha256(path.read_bytes()).hexdigest()[:16])
assets={}
unique={digest:path for path,digest in source_paths.values()}

def convert(pair):
    digest,path=pair;ext=path.suffix.lower();motion=ext in ('.gif','.mov','.mp4','.webm')
    target=OUT/(digest+('.mp4' if motion else '.webp'));thumb=OUT/(digest+'-thumb.webp')
    if motion:
        if not target.exists():
            subprocess.run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-i',str(path),'-map','0:v:0','-map','0:a?','-vf',"scale=w='min(1600,iw)':h='min(1600,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",'-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','-y',str(target)],check=True)
        info=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',str(target)]))['streams'][0]
        if not thumb.exists():
            frame=subprocess.check_output(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-i',str(target),'-frames:v','1','-vf',"scale=w='min(480,iw)':h='min(480,ih)':force_original_aspect_ratio=decrease",'-f','image2pipe','-c:v','png','pipe:1'])
            with Image.open(io.BytesIO(frame)) as im:im.convert('RGB').save(thumb,'WEBP',quality=80,method=6)
        w,h=info['width'],info['height']
    else:
        with Image.open(path) as im:
            im=ImageOps.exif_transpose(im).convert('RGB');im.thumbnail((2560,2560));w,h=im.size
            if not target.exists():im.save(target,'WEBP',quality=88,method=6)
            if not thumb.exists():im.thumbnail((480,480));im.save(thumb,'WEBP',quality=80,method=6)
    return digest,dict(type='video' if motion else 'image',src='/projects/archive/'+target.name,thumbnail='/projects/archive/'+thumb.name,width=w,height=h,**({'animated':True} if ext=='.gif' else {}))

with ThreadPoolExecutor(max_workers=4) as pool:
    for digest, asset in pool.map(convert,unique.items()):assets[digest]=asset

projects={};report=[]
for p in DATA:
    if p.get('hidden'):
        report.append(dict(sourceId=p['id'],title=p['title'],status='Kept hidden'));continue
    e=EDITORIAL[p['id']];slug=e['slug'];media=[];seen=set()
    links=[dict(label=re.sub(r'^[^\w]+','',l['label']),href=l['url']) for l in p.get('links',[])]
    if p['id']=='28':links=[dict(label='Try live demo',href='https://www.realhand.com/demo'),*links[1:]]
    if p['id']=='07':links=[] # Original Task-Trackers repository is unrelated to the portfolio source.
    for n,m in enumerate([p['featuredMedia'],*p['mediaGallery']]):
        src=m['src'];caption=m.get('label') or m.get('alt') or re.sub(r'[-_]',' ',Path(src).stem)
        if src in source_paths:
            asset=dict(assets[source_paths[src][1]])
        elif m['type']=='shader':
            asset=dict(type='shader',src=src,sourceUrl='https://www.shadertoy.com/view/'+src)
        elif 'youtube.com/embed/' in src or 'youtu.be/' in src:
            video_id=src.split('/embed/')[-1].split('?')[0] if '/embed/' in src else src.rsplit('/',1)[-1].split('?')[0]
            asset=dict(type='youtube',src='https://www.youtube-nocookie.com/embed/'+video_id,sourceUrl='https://www.youtube.com/watch?v='+video_id)
        else:continue # Duplicate placeholders and live apps belong in links, not camera-requesting embeds.
        if asset['src'] in seen:continue
        seen.add(asset['src'])
        if p['id']=='28':caption='RealHand browser hand demo'
        if 'wall-e_fire' in src:caption='Visual inspiration · WALL·E'
        if re.match(r'^[A-F0-9-]{25,}$',caption,re.I):caption=f"{p['title']} · gameplay clip {sum(x['type']=='video' for x in media)+1}"
        asset['caption']=caption;media.append(asset)
    cover=next((m for m in media if m.get('thumbnail')),None)
    if not cover and p['id']=='28':cover=dict(src='/flag-realhand.jpg',thumbnail='/flag-realhand.jpg',width=1600,height=900,caption='RealHand browser demo')
    for m in media:
        if m['type']=='youtube' and cover:m['thumbnail']=cover['thumbnail']
    if e.get('mediaOrder'):
        ranks={src:index for index,src in enumerate(e['mediaOrder'])}
        media.sort(key=lambda item:ranks.get(item['src'],len(ranks)))
    if p['id']=='24':links=[l for l in links if '/view/' not in l['href']] # Every study has its own source link in the gallery.
    study=dict(overview=e['overview'],role=e['role'],ownership=e['role'],features=e['features'],delivery=e['delivery'])
    if cover:study['media']=dict(src=cover.get('thumbnail',cover['src']),width=cover['width'],height=cover['height'],alt=e.get('title',p['title'])+' — original project image',caption=cover['caption'])
    project=dict(sourceId=p['id'],sourceSlug=p['slug'],title=e.get('title',p['title']),subtitle=e.get('subtitle',p['shortSubtitle']),discipline=' / '.join(p.get('categories',[])[:2]).lower(),study=study,notes=notes_for(p),media=media,links=links)
    if p.get('year') and str(p['year']).isdigit():project['year']=int(p['year'])
    projects[slug]=project
    report.append(dict(sourceId=p['id'],title=p['title'],target=slug,mediaCount=len(media),noteSections=len(project['notes']),status='Imported',detailSource=e.get('sourceNotes','config/data.json + config/richContent.json')))

(SITE/'src/lib/legacy-projects.ts').write_text('import type { LegacyProjectContent } from "./legacy-project-types"\n\n// Generated from the January portfolio by scripts/import-legacy-projects.py.\n// Editorial mappings and exclusions are recorded in scripts/legacy-project-editorial.json.\nexport const legacyProjects: Record<string, LegacyProjectContent> = '+json.dumps(projects,ensure_ascii=False,indent=2)+'\n')
index={slug:dict(title=p['title'],subtitle=p['subtitle'],year=p.get('year'),discipline=p['discipline'],overview=p['study']['overview'],role=p['study']['role'],stack=' · '.join(dict.fromkeys(t for f in p['study']['features'] for t in f['stack'])),hoverImage=p['study'].get('media',{}).get('src')) for slug,p in projects.items()}
(SITE/'src/lib/legacy-project-index.ts').write_text('// Lightweight Index metadata; full galleries and notes load on project opening.\nexport const legacyProjectIndex: Record<string, { title: string; subtitle: string; year: number | null; discipline: string; overview: string; role: string; stack: string; hoverImage: string | null }> = '+json.dumps(index,ensure_ascii=False,indent=2)+'\n\nexport const appendedProjectSlugs = '+json.dumps([EDITORIAL[i]['slug'] for i in CONFIG['APPENDED_IDS']])+'\n')
shader_data=json.loads((OLD/'src/features/projects/components/shaders/sources.json').read_text())
(SITE/'src/lib/legacy-shader-sources.ts').write_text('export default '+json.dumps(shader_data,ensure_ascii=False)+' as Record<string, { name: string; code: string }>\n')
review=SITE/'review/project-import-20260914';review.mkdir(exist_ok=True)
manifest=dict(source='2026-Jan-Portfolio/config/data.json + config/richContent.json',records=report,assets=[dict(source=src,**assets[digest]) for src,(_,digest) in source_paths.items()],sourceBytes=sum(path.stat().st_size for path in unique.values()),outputBytes=sum(p.stat().st_size for p in OUT.iterdir()),notes=['Hidden records remain hidden, including the duplicate No Job Too Small.', 'Generic imported technology lists are replaced with the project-specific narrative and, for the old portfolio and shaders, actual source code.', 'RealHand browser demo retains the current title and official demo URL; it is not the physical teleoperation project.', 'Orchia, Artly, and physical Teleoperation have no matching old record and retain their current source-backed content.', 'The unrelated Task-Trackers repository is not presented as the portfolio repository.', 'Placeholder SVGs and identical files are omitted; every distinct original project visual remains accessible.', 'Curtain-hook details use the newer two-part ceiling-seam design; older generic snap-fit writing is superseded.'])
(review/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(projects=len(projects),media=sum(len(p['media']) for p in projects.values()),uniqueLocalAssets=len(assets),sourceMB=round(manifest['sourceBytes']/1e6,1),outputMB=round(manifest['outputBytes']/1e6,1))))
