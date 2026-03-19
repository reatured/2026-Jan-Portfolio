/**
 * Finish Migration: Convert Cargo-specific HTML and fix remaining placeholders
 *
 * 1. Convert CuraLoop's <column-set>, <column-unit>, <media-item> → standard HTML
 * 2. Download YouTube thumbnails for projects with no local images
 * 3. Fix defaultOgImage placeholder
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const dataPath = join(ROOT, 'config', 'data.json');
const ASSETS_DIR = join(ROOT, 'public', 'assets');

const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const mediaMap = JSON.parse(readFileSync(join(ROOT, 'public', 'assets', 'cargo-import', 'media-map.json'), 'utf8'));

// ── 1. Convert CuraLoop Cargo HTML ──────────────────────────────────────────

const CURA_DIR = '/assets/cargo-import/curaloop-ai-companion-for-alzheimer-s-care-2025';
const hashToPath = {
  'R2588098577212111412832917447507': `${CURA_DIR}/1.png`,
  'C2588102423948546591633135035219': `${CURA_DIR}/iPhone-14-Pro-Max.png`,
  'Q2588103917230926102495047902035': `${CURA_DIR}/iPhone-14-Pro-Max-1.png`,
  'R2588104121307255789943817429843': `${CURA_DIR}/2.png`,
  'T2588104261004448660146251817811': `${CURA_DIR}/1.png`,
};

function convertCargoHtml(html) {
  // Replace <media-item ... hash="HASH"> with <img src="local_path">
  html = html.replace(
    /<media-item[^>]*hash="([^"]+)"[^>]*><\/media-item>/g,
    (match, hash) => {
      const path = hashToPath[hash];
      if (path) {
        return `<img src="${path}" alt="" style="width:100%;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);" />`;
      }
      return match;
    }
  );

  // Also handle self-closing media-items
  html = html.replace(
    /<media-item[^>]*hash="([^"]+)"[^>]*>/g,
    (match, hash) => {
      const path = hashToPath[hash];
      if (path) {
        return `<img src="${path}" alt="" style="width:100%;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);" />`;
      }
      return match;
    }
  );

  // Convert <column-set gutter="X" ... mobile-stack="true"> → <div style="display:grid;...">
  // column-set with column-units that have span attributes
  // Strategy: convert to CSS grid with 12-column system

  // First pass: extract column-unit spans and convert structure
  // Replace <column-set ...> with <div style="display:grid;grid-template-columns:repeat(12,1fr);gap:2rem;">
  html = html.replace(
    /<column-set[^>]*gutter="([^"]*)"[^>]*>/g,
    (match, gutter) => {
      return `<div style="display:grid;grid-template-columns:repeat(12,1fr);gap:${gutter || '2rem'};">`;
    }
  );
  html = html.replace(/<\/column-set>/g, '</div>');

  // Replace <column-unit ... span="N"> with <div style="grid-column: span N;">
  html = html.replace(
    /<column-unit[^>]*span="(\d+)"[^>]*>/g,
    (match, span) => {
      return `<div style="grid-column:span ${span};">`;
    }
  );

  // column-unit without span (full width)
  html = html.replace(
    /<column-unit[^>]*>/g,
    '<div style="grid-column:span 12;">'
  );
  html = html.replace(/<\/column-unit>/g, '</div>');

  // Clean up any remaining &nbsp; that Cargo inserts
  html = html.replace(/&nbsp; &nbsp;/g, '');

  return html;
}

const curaloop = data.projects.find(p => p.id === '27');
if (curaloop) {
  curaloop.content = convertCargoHtml(curaloop.content);
  console.log('✓ CuraLoop content converted from Cargo HTML to standard HTML');
}

// ── 2. Download YouTube thumbnails for placeholder projects ─────────────────

const YT_THUMBNAILS = {
  '01': { videoId: 'rr9zS1zC-ok', filename: 'hardware-store-yt-thumb.jpg' },
  '17': { videoId: 'zskrUChpBL0', filename: 'no-job-too-small-yt-thumb.jpg' },
  '08': { videoId: 'lpLAXMpaFw4', filename: 'vr-oculus-yt-thumb.jpg' },
};

// Project 16 (Ping Pong) has no YouTube — use the scraped overview thumbnail
// The media map has some overview images we can check
const THUMB_DIR = join(ASSETS_DIR, 'thumbnails');
if (!existsSync(THUMB_DIR)) mkdirSync(THUMB_DIR, { recursive: true });

for (const [projectId, info] of Object.entries(YT_THUMBNAILS)) {
  const filepath = join(THUMB_DIR, info.filename);

  if (existsSync(filepath)) {
    console.log(`  SKIP ${info.filename} (exists)`);
  } else {
    // Try maxresdefault first, then hqdefault
    const urls = [
      `https://img.youtube.com/vi/${info.videoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${info.videoId}/hqdefault.jpg`,
    ];

    let downloaded = false;
    for (const url of urls) {
      try {
        execSync(`curl -sS -L -o "${filepath}" --max-time 15 "${url}"`, { stdio: 'pipe' });
        const stat = execSync(`stat -f%z "${filepath}"`, { encoding: 'utf8' }).trim();
        const size = parseInt(stat);
        // maxresdefault returns a small placeholder if not available
        if (size > 5000) {
          console.log(`  OK ${Math.round(size/1024)}KB ${info.filename}`);
          downloaded = true;
          break;
        }
        execSync(`rm -f "${filepath}"`, { stdio: 'pipe' });
      } catch {
        try { execSync(`rm -f "${filepath}"`, { stdio: 'pipe' }); } catch {}
      }
    }

    if (!downloaded) {
      console.log(`  FAIL ${info.filename}`);
    }
  }

  // Update data.json
  const project = data.projects.find(p => p.id === projectId);
  if (project && existsSync(filepath)) {
    project.featuredMedia = {
      type: 'image',
      src: `/assets/thumbnails/${info.filename}`,
      alt: project.title,
    };
    // Set as thumbnail too for when featuredMedia is overridden
    project.thumbnail = `/assets/thumbnails/${info.filename}`;
    console.log(`  Updated project ${projectId} featured → /assets/thumbnails/${info.filename}`);
  }
}

// For project 16 (Ping Pong) — use the FPP_Table_Tennis_Game gif from the media map
// Hash W2477226728279704712455349789523 → FPP_Table_Tennis_Game_cropped.gif
const pingPong = data.projects.find(p => p.id === '16');
if (pingPong) {
  const ppHash = 'W2477226728279704712455349789523';
  const ppInfo = mediaMap[ppHash];
  if (ppInfo) {
    // Download this specific file
    const ppFilename = 'ping-pong-thumb.gif';
    const ppFilepath = join(THUMB_DIR, ppFilename);
    if (!existsSync(ppFilepath)) {
      const url = `https://freight.cargo.site/t/original/i/${ppHash}/${encodeURIComponent(ppInfo.name)}`;
      try {
        execSync(`curl -sS -L -o "${ppFilepath}" -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' -H 'Referer: https://lingyizhou.cargo.site/' --max-time 30 "${url}"`, { stdio: 'pipe' });
        const stat = execSync(`stat -f%z "${ppFilepath}"`, { encoding: 'utf8' }).trim();
        const size = parseInt(stat);
        const head = execSync(`head -c 50 "${ppFilepath}"`, { encoding: 'utf8' });
        if (size > 100 && !head.includes('<!DOCTYPE')) {
          console.log(`  OK ${Math.round(size/1024)}KB ${ppFilename}`);
        } else {
          execSync(`rm -f "${ppFilepath}"`, { stdio: 'pipe' });
          console.log(`  FAIL ${ppFilename} (HTML error)`);
        }
      } catch {
        console.log(`  FAIL ${ppFilename} (download error)`);
      }
    }

    if (existsSync(ppFilepath)) {
      pingPong.featuredMedia = {
        type: 'image',
        src: `/assets/thumbnails/${ppFilename}`,
        alt: 'Ping Pong Game',
      };
      pingPong.thumbnail = `/assets/thumbnails/${ppFilename}`;
      console.log('  Updated project 16 featured → ping-pong-thumb.gif');
    }
  }
}

// ── 3. Fix defaultOgImage ───────────────────────────────────────────────────

// Use the spectacles GIF that's already the avatar, or the first good project image
if (data.site.defaultOgImage.includes('picsum.photos')) {
  data.site.defaultOgImage = '/assets/spectacles-1771906913985.gif';
  console.log('✓ Fixed defaultOgImage → spectacles GIF');
}

// ── Save ─────────────────────────────────────────────────────────────────────

writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('\n✓ Migration complete! data.json updated.');
