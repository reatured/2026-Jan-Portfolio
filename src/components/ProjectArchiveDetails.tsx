import { lazy, Suspense, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import { useReducedMotion } from "framer-motion"
import type { Project } from "@/lib/content"
import type { ArchiveMedia, ProjectNote } from "@/lib/legacy-project-types"
import { legacyProjects } from "@/lib/legacy-projects"
import { projectCaseStudies } from "@/lib/project-case-studies"
import { useVisibleVideo } from "@/lib/use-visible-video"
import ArchiveYouTube from "./ArchiveYouTube"
import RealHandProjectDetails from "./RealHandProjectDetails"
import ProjectStoryRibbon from "./ProjectStoryRibbon"
import "./project-archive.css"

const ShaderPreview = lazy(() => import("./ProjectShaderPreview"))
type MediaDimensions = (width: number, height: number) => void
const sourceRatio = (media?: ArchiveMedia) => media?.width && media.height ? media.width / media.height : 16 / 9
// These are byte-identical to the four clips reviewed in the Story Ribbon lab.
const snapStorySources = [
  { src: "/projects/archive/6b6225f555100cce.mp4", caption: "Hand gestures become a connected 3D stroke." },
  { src: "/projects/archive/ad88d5fe2790ac57.mp4", caption: "Procedural geometry follows the hand’s movement." },
  { src: "/projects/archive/b14c0745f28af628.mp4", caption: "Custom textures stay aligned as the mesh changes." },
  { src: "/projects/archive/4ec01710995a4032.mp4", caption: "Drawing and erasing with Snap Spectacles." },
]

function ArchiveNotes({ notes }: { notes: ProjectNote[] }) {
  return <div className="archive-notes">
    {notes.map(note => <section key={note.heading}>
      <h4>{note.heading}</h4>
      {note.paragraphs?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      {note.items && <ul>{note.items.map((item, i) => <li key={i}>{item}</li>)}</ul>}
      {note.table && <div className="archive-note-table"><table>
        <thead><tr>{note.table.headings.map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
        <tbody>{note.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody>
      </table></div>}
    </section>)}
  </div>
}
function motionFirst(media: ArchiveMedia[]) {
  const index = media.findIndex(item => item.type === "video" || item.type === "youtube")
  return index > 0 ? [media[index]!, ...media.slice(0, index), ...media.slice(index + 1)] : media
}

function ArchiveVideo({ media, onDimensions, autoPlay }: { media: ArchiveMedia; onDimensions: MediaDimensions; autoPlay: boolean }) {
  const [failed, setFailed] = useState(false)
  const ref = useVisibleVideo(autoPlay || Boolean(media.animated), !failed)
  return failed ? <p className="archive-media-error">This clip could not load. <button type="button" onClick={() => setFailed(false)}>Retry video</button></p> :
    <video ref={ref} src={media.src} poster={media.thumbnail} width={media.width} height={media.height}
      controls playsInline preload="metadata" muted loop={media.animated}
      onLoadedMetadata={event => onDimensions(event.currentTarget.videoWidth, event.currentTarget.videoHeight)}
      aria-label={media.caption} onError={() => setFailed(true)} />
}

function MediaGallery({ media, title, orientation, versions = false }: {
  media: ArchiveMedia[]; title: string; orientation: "landscape" | "portrait"; versions?: boolean
}) {
  const [selected, setSelected] = useState(0)
  const [measuredRatios, setMeasuredRatios] = useState<Record<string, number>>({})
  const current = media[selected]!
  const mediaRatio = measuredRatios[current.src] ?? sourceRatio(current)
  const onDimensions: MediaDimensions = (width, height) => {
    if (width <= 0 || height <= 0) return
    const ratio = width / height
    setMeasuredRatios(previous => Math.abs((previous[current.src] ?? sourceRatio(current)) - ratio) < .0001
      ? previous : { ...previous, [current.src]: ratio })
  }
  const strip = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  useLayoutEffect(() => {
    // Selection stays within this fixed media group; keep its thumbnail visible.
    const row = strip.current
    const item = row?.children[selected] as HTMLElement | undefined
    if (row && item) row.scrollTo({ left: item.offsetLeft - row.offsetLeft - row.clientWidth / 2 + item.clientWidth / 2, behavior: "instant" })
  }, [selected])
  const select = (index: number) => {
    const next = (index + media.length) % media.length
    setSelected(next)
    const gallery = root.current
    const scroller = gallery?.closest<HTMLElement>(".project-detail-scroll")
    if (!gallery || !scroller) return
    // A sticky portrait is already visible. Preserve the accompanying text position.
    if (orientation === "portrait" && getComputedStyle(gallery).position === "sticky") return
    const aside = gallery.closest<HTMLElement>(".story-aside")
    if (orientation === "portrait" && aside && getComputedStyle(aside).position === "sticky") return
    const reading = gallery.closest<HTMLElement>(".archive-reading")
    // Supplemental demos sit below the story. Keep their navigation local.
    const destination = aside ?? reading ?? (gallery.closest(".story-more") ? gallery : null)
    const top = destination ? scroller.scrollTop + destination.getBoundingClientRect().top - scroller.getBoundingClientRect().top : 0
    scroller.scrollTo({ top, behavior: reduceMotion ? "instant" : "smooth" })
  }
  return <section ref={root} className="archive-gallery" data-orientation={orientation} data-single={media.length === 1 || undefined} data-versions={versions || undefined}
    aria-label={`${title} ${orientation} media gallery`}>
    <div className="archive-media-stage" key={current.src} data-kind={current.type}
      data-portrait={mediaRatio < 1 || undefined}
      style={{ "--archive-media-ratio": mediaRatio } as CSSProperties}>
      {current.type === "image" && <img src={current.src} width={current.width} height={current.height} alt={current.caption}
        onLoad={event => onDimensions(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight)} />}
      {current.type === "video" && <ArchiveVideo media={current} onDimensions={onDimensions} autoPlay={selected === 0} />}
      {current.type === "youtube" && <ArchiveYouTube media={current} autoPlay={selected === 0} />}
      {current.type === "shader" && <Suspense fallback={<p>Loading shader…</p>}><ShaderPreview shaderId={current.src} /></Suspense>}
    </div>
    {!versions && <div className="archive-gallery-heading">
      <p><strong>{String(selected + 1).padStart(2, "0")}</strong> / {String(media.length).padStart(2, "0")} <span>{current.caption}</span></p>
      {media.length > 1 && <div className="archive-gallery-controls">
        <button type="button" aria-label="Previous media" onClick={() => select(selected - 1)}>←</button>
        <button type="button" aria-label="Next media" onClick={() => select(selected + 1)}>→</button>
      </div>}
    </div>}
    {media.length > 1 && <div ref={strip} className={`archive-media-strip${versions ? " archive-version-strip" : ""}`} role="group" aria-label={versions ? "Choose demo version" : `Choose ${orientation} media`}
      onKeyDown={event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
        event.preventDefault()
        const next = event.key === "Home" ? 0 : event.key === "End" ? media.length - 1 : (selected + (event.key === "ArrowRight" ? 1 : -1) + media.length) % media.length
        select(next)
        ;(strip.current?.children[next] as HTMLButtonElement | undefined)?.focus({ preventScroll: true })
      }}>
      {media.map((item, index) => <button key={item.src} type="button" aria-label={`${index + 1}. ${item.caption}`} aria-pressed={index === selected}
        tabIndex={index === selected ? 0 : -1} onClick={() => select(index)}>
        {versions ? <span>{item.caption}</span> : <>
          {item.thumbnail ? <img src={item.thumbnail} alt="" width="88" height="52" loading="lazy" /> : <span className="archive-media-kind">{item.type === "shader" ? "GLSL" : "Video"}</span>}
          <span className="archive-media-number">{String(index + 1).padStart(2, "0")}</span>
          {(item.type === "video" || item.type === "youtube") && <span className="archive-media-play" aria-hidden="true">▶</span>}
        </>}
      </button>)}
    </div>}
  </section>
}

export default function ProjectArchiveDetails({ project }: { project: Project }) {
  // Owns its page order like Orchia and Artly: one demo video, then stacked build notes.
  if (project.slug === "realhand-teleop") return <RealHandProjectDetails project={project} />
  const content = legacyProjects[project.slug]!
  const [moreOpen, setMoreOpen] = useState(false)
  const study = projectCaseStudies[project.slug] ?? content.study
  const isHardwareStore = project.slug === "hardware-store"
  const media: ArchiveMedia[] = isHardwareStore
    ? content.media.filter(item => item.type === "youtube" || item.type === "video").map((item, index) => ({ ...item, caption: index === 0 ? "V3 · Expanded workflow" : "V1 · Initial version" }))
    : content.media
  // Source dimensions determine permanent placement, never the selected slide.
  const landscape = motionFirst(media.filter(item => sourceRatio(item) >= 1))
  const portrait = motionFirst(media.filter(item => sourceRatio(item) < 1))
  const portraitRatio = portrait.length ? Math.max(...portrait.map(sourceRatio)) : 9 / 16
  // Videos are selected and played above; do not send readers away to watch them.
  const links = isHardwareStore ? [] : content.links.filter(link => !/(?:youtu\.be|youtube\.com|vimeo\.com|\.(?:mp4|webm|mov)(?:\?|$))/i.test(link.href))
  if (project.slug === "ar-drawing") {
    const demo = media.find(item => item.type === "youtube")
    const extraLandscape = landscape.filter(item => item !== demo)
    const storyMedia = snapStorySources.flatMap(source => {
      const item = media.find(item => item.src === source.src)
      return item ? [{ ...item, caption: source.caption }] : []
    })
    if (storyMedia.length === study.features.length) return <ProjectStoryRibbon project={project} study={study} media={storyMedia}
      demo={demo && <figure className="story-demo">
        <div className="story-demo-stage"><ArchiveYouTube media={demo} autoPlay /></div>
        <figcaption>AR Drawing Tool <span>Full demo · Snap Inc. internship</span></figcaption>
      </figure>}>
      <details className="story-more" onToggle={event => setMoreOpen(event.currentTarget.open)}>
        <summary>More demos &amp; project notes <span className="sr-only">({media.length - (demo ? 1 : 0)} additional media items)</span></summary>
        {moreOpen && <div className="project-archive-details">
          {extraLandscape.length > 0 && <MediaGallery media={extraLandscape} title={project.title} orientation="landscape" />}
          <div className="archive-reading" data-has-portrait={portrait.length > 0 || undefined}
            style={{ "--archive-portrait-ratio": portraitRatio } as CSSProperties}>
            {portrait.length > 0 && <MediaGallery media={portrait} title={project.title} orientation="portrait" />}
            <ArchiveNotes notes={content.notes} />
          </div>
        </div>}
      </details>
    </ProjectStoryRibbon>
  }
  return <ProjectStoryRibbon project={project} study={study} links={links} className="archive-project-story"
    demo={landscape.length > 0 && <MediaGallery media={landscape} title={project.title} orientation="landscape" versions={isHardwareStore} />}
    aside={portrait.length > 0 && <MediaGallery media={portrait} title={project.title} orientation="portrait" />}>
    {content.notes.length > 0 && <details className="story-more" onToggle={event => setMoreOpen(event.currentTarget.open)}>
      <summary>Project notes <span className="sr-only">({content.notes.length} sections)</span></summary>
      {moreOpen && <ArchiveNotes notes={content.notes} />}
    </details>}
  </ProjectStoryRibbon>
}
