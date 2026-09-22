import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react"
import { useReducedMotion } from "framer-motion"
import type { Project } from "@/lib/content"
import type { ArchiveMedia } from "@/lib/legacy-project-types"
import type { ProjectCaseStudyContent, ProjectFeature } from "@/lib/project-case-studies"
import { useVisibleVideo } from "@/lib/use-visible-video"
import "./project-story-ribbon.css"

function StoryVideo({ media }: { media: ArchiveMedia }) {
  const [failed, setFailed] = useState(false)
  const ref = useVisibleVideo(true, !failed)
  return failed ? <p className="story-media-error">This video could not load. <button type="button" onClick={() => setFailed(false)}>Retry video</button></p> :
    <video ref={ref} src={media.src} poster={media.thumbnail} width={media.width} height={media.height}
      controls playsInline muted loop={media.animated} preload="metadata" aria-label={media.caption} onError={() => setFailed(true)} />
}

function fitActiveSlide(rail: HTMLDivElement | null, index: number) {
  const slide = rail?.querySelectorAll<HTMLElement>(".story-slide")[index]
  if (rail && slide) rail.style.setProperty("--story-active-height", `${Math.ceil(slide.getBoundingClientRect().height)}px`)
}

function StoryFeatureCopy({ feature, headingId }: { feature: ProjectFeature; headingId: string }) {
  return <div className="story-copy">
    <h4 id={headingId}>{feature.title}</h4>
    <p className="story-contribution">{feature.contribution}</p>
    <div className="story-stack"><p className="story-stack-label">Built with</p><ul>{feature.stack.map(tool => <li key={tool}>{tool}</li>)}</ul></div>
  </div>
}

/** A native horizontal reading rail inside the existing project-detail scroller. */
export default function ProjectStoryRibbon({ project, study, media = [], demo, aside, links, className = "", storyLayout = "rail", children }: {
  project: Project
  study: ProjectCaseStudyContent
  media?: ArchiveMedia[]
  demo?: ReactNode
  aside?: ReactNode
  links?: { label: string; href: string }[]
  className?: string
  /** "rail" keeps the chapter carousel; "stacked" reads top to bottom with no section heading. */
  storyLayout?: "rail" | "stacked"
  children?: ReactNode
}) {
  const track = useRef<HTMLDivElement>(null)
  const navigation = useRef<HTMLElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const activeRef = useRef(0)
  const requested = useRef<number | null>(null)
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const frame = useRef(0)
  const [active, setActive] = useState(0)
  const [announcement, setAnnouncement] = useState("")
  const reduceMotion = useReducedMotion()
  const count = study.features.length
  const stacked = storyLayout === "stacked"
  const releaseFact = study.delivery.find(fact => fact.label === "Released")
  const resourceFact = study.delivery.find(fact => fact.label === "Developer resources")
  const delivery = releaseFact && resourceFact
    ? study.delivery.filter(fact => fact !== resourceFact)
    : study.delivery
  const projectLinks = study.access === "internal" ? [] : links ?? (project.demoUrl
    ? [{ href: project.demoUrl, label: "Try live demo" }]
    : study.link ? [study.link] : [])
  const contextLinks = releaseFact && resourceFact
    ? projectLinks.filter(link => link.href !== study.link?.href)
    : projectLinks
  const factColumns = delivery.length === 2 || delivery.length === 4 ? 2 : Math.min(delivery.length, 3)
  const items = () => Array.from(track.current?.querySelectorAll<HTMLElement>(".story-slide") ?? [])

  const mark = (index: number) => {
    if (activeRef.current === index) return
    activeRef.current = index
    fitActiveSlide(track.current, index)
    setActive(index)
  }
  const nearest = () => {
    const chapters = items()
    const left = track.current?.scrollLeft ?? 0
    const origin = chapters[0]?.offsetLeft ?? 0
    return chapters.reduce((best, chapter, index) =>
      Math.abs(chapter.offsetLeft - origin - left) < Math.abs(chapters[best]!.offsetLeft - origin - left) ? index : best, 0)
  }
  const select = (index: number, focus = false) => {
    const target = Math.max(0, Math.min(count - 1, index))
    const chapters = items()
    if (!chapters[target] || !track.current) return
    requested.current = target
    mark(target)
    if (focus) buttons.current[target]?.focus({ preventScroll: true })
    track.current.scrollTo({ left: chapters[target].offsetLeft - chapters[0]!.offsetLeft, behavior: reduceMotion ? "instant" : "smooth" })
    // Keep chapter navigation local, below the separate overview video.
    if (window.matchMedia("(max-width: 760px)").matches) {
      const reading = track.current.closest<HTMLElement>(".story-reading")
      const scroller = track.current.closest<HTMLElement>(".project-detail-scroll")
      if (reading && scroller) scroller.scrollTo({
        top: scroller.scrollTop + reading.getBoundingClientRect().top - scroller.getBoundingClientRect().top,
        behavior: reduceMotion ? "instant" : "smooth",
      })
    }
    setAnnouncement(`Chapter ${target + 1} of ${count}: ${study.features[target]!.title}.`)
  }
  const onKey = (event: KeyboardEvent, index: number, focus = false) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const target = event.key === "Home" ? 0 : event.key === "End" ? count - 1
      : event.key === "ArrowRight" ? index + 1 : event.key === "ArrowLeft" ? index - 1 : null
    if (target === null) return
    event.preventDefault()
    select(target, focus)
  }

  useLayoutEffect(() => {
    const rail = track.current
    if (!rail) return
    let previousLayout = ""
    const measure = () => {
      const chapters = Array.from(rail.querySelectorAll<HTMLElement>(".story-slide"))
      const last = chapters[chapters.length - 1]
      if (!last) return
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 0
      rail.style.setProperty("--story-end-space", `${Math.max(0, rail.clientWidth - last.offsetWidth - gap)}px`)
      fitActiveSlide(rail, activeRef.current)
      const layout = `${rail.clientWidth}:${gap}:${chapters.map(chapter => chapter.offsetWidth).join(",")}`
      // A phone slide changing height must not interrupt a horizontal swipe.
      if (layout !== previousLayout) {
        previousLayout = layout
        requested.current = null
        const chapter = chapters[activeRef.current]
        if (chapter) rail.scrollTo({ left: chapter.offsetLeft - chapters[0]!.offsetLeft, behavior: "instant" })
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(rail)
    rail.querySelectorAll(".story-slide").forEach(chapter => observer.observe(chapter))
    return () => { observer.disconnect(); clearTimeout(settle.current); cancelAnimationFrame(frame.current) }
  }, [count])

  useEffect(() => {
    const nav = navigation.current
    const button = buttons.current[active]
    if (!nav || !button) return
    const left = button.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft
    if (left < nav.scrollLeft || left + button.offsetWidth > nav.scrollLeft + nav.clientWidth) {
      nav.scrollTo({ left: left - 8, behavior: reduceMotion ? "instant" : "smooth" })
    }
  }, [active, reduceMotion])

  return <section className={`project-story ${className}`.trim()} aria-label={`${project.title} project story`}>
    {demo}
    <div className="story-layout" data-has-aside={Boolean(aside) || undefined}>
    {aside && <div className="story-aside">{aside}</div>}
    <div className="story-main">
    {count > 0 && (stacked ?
    <section className="story-reading" data-layout="stacked" aria-label={`${project.title} technical overview`}>
      <div className="story-blocks">
        {study.features.map((feature, index) => <article key={feature.title} className="story-block" id={`${project.slug}-story-${index}`}
          aria-labelledby={`${project.slug}-story-heading-${index}`}>
          <StoryFeatureCopy feature={feature} headingId={`${project.slug}-story-heading-${index}`} />
        </article>)}
      </div>
    </section>
    :
    <section className="story-reading" aria-labelledby={`${project.slug}-story-label`}>
    <header className="story-section-heading">
      <h3 id={`${project.slug}-story-label`}>What I built</h3>
      <div className="story-paging">
        <span aria-hidden="true">{active + 1} of {count}</span>
        <button type="button" aria-label="Previous chapter" disabled={active === 0} onClick={() => select(active - 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
        </button>
        <button type="button" aria-label="Next chapter" disabled={active === count - 1} onClick={() => select(active + 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
        </button>
      </div>
    </header>
    <div className="story-navigation">
      <nav ref={navigation} className="story-chapters" aria-label="Project chapters" style={{ "--story-chapter-count": count } as CSSProperties}>
        {study.features.map((feature, index) => <button key={feature.title} ref={element => { buttons.current[index] = element }}
          type="button" aria-pressed={active === index} aria-controls={`${project.slug}-story-${index}`}
          onClick={() => select(index)} onKeyDown={event => onKey(event, index, true)}>
          {feature.title}
        </button>)}
      </nav>
    </div>

    <div ref={track} className="story-track" tabIndex={0} role="region" aria-label="Project story. Scroll horizontally or use the left and right arrow keys."
      onKeyDown={event => { if (event.target === event.currentTarget) onKey(event, active) }}
      onPointerDown={() => { requested.current = null }} onWheel={() => { requested.current = null }}
      onFocusCapture={event => {
        const slide = event.target.closest<HTMLElement>(".story-slide")
        if (slide && Number(slide.dataset.chapter) !== activeRef.current) select(Number(slide.dataset.chapter))
      }}
      onScroll={() => {
        cancelAnimationFrame(frame.current)
        frame.current = requestAnimationFrame(() => { if (requested.current === null) mark(nearest()) })
        clearTimeout(settle.current)
        settle.current = setTimeout(() => { requested.current = null; mark(nearest()) }, 150)
      }}>
      {study.features.map((feature, index) => {
        const visual = media[index]
        const ratio = visual?.width && visual.height ? visual.width / visual.height : 16 / 9
        return <article key={feature.title} className="story-slide" id={`${project.slug}-story-${index}`} data-chapter={index}
          aria-labelledby={`${project.slug}-story-heading-${index}`} data-has-media={Boolean(visual) || undefined} data-portrait={ratio < 1 || undefined} style={{ "--story-ratio": ratio } as CSSProperties}>
          {visual && <figure className="story-media">
            <div className="story-media-frame">
              {visual.type === "video" ? <StoryVideo media={visual} /> : <img src={visual.src} width={visual.width} height={visual.height} alt={visual.caption} loading="lazy" />}
            </div>
            <figcaption>{visual.caption}</figcaption>
          </figure>}
          <StoryFeatureCopy feature={feature} headingId={`${project.slug}-story-heading-${index}`} />
        </article>
      })}
    </div>
    </section>)}

    <footer className="story-context" aria-label="Project context and outcomes">
      <div className="story-brief">
        <section className="story-info-card story-overview"><h3>About the project</h3><p>{study.overview}</p>
          {contextLinks.length > 0 && <div className="story-links">{contextLinks.map(link =>
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<span className="sr-only"> (opens in a new tab)</span></a>
          )}</div>}
        </section>
        <section className="story-info-card story-role"><h3>My role</h3><p>{study.role}</p>
          {study.ownership !== study.role && <p className="story-ownership">{study.ownership}</p>}
          {study.access === "internal" && <p className="story-access">Internal deployment tool</p>}
        </section>
      </div>
      {delivery.length > 0 && <dl className="story-delivery" data-count={delivery.length} style={{ "--story-fact-columns": factColumns } as CSSProperties}>{delivery.map(fact => {
        // Preserve the source claim while giving its leading outcome a clear hierarchy.
        const metric = fact.label === "First month" ? /^(\S+)\s+(.+)$/.exec(fact.value) : null
        const resources = fact === releaseFact ? resourceFact : undefined
        return <div key={fact.label} className="story-info-card" data-emphasis={Boolean(metric) || undefined}>
        <dt>{resources ? "Release & resources" : fact.label}</dt><dd>{metric ? <>{metric[1]} <span className="story-fact-detail">{metric[2]}</span></> : fact.value}
          {resources && <span className="story-resource-detail">{resources.value}</span>}
          {(resources || fact === resourceFact) && study.link && study.access !== "internal" &&
            <a href={study.link.href} target="_blank" rel="noopener noreferrer">{study.link.label}<span className="sr-only"> (opens in a new tab)</span></a>}
        </dd>
      </div>})}</dl>}
    </footer>
    </div>
    </div>
    {children}
    <p role="status" aria-live="polite" className="sr-only">{announcement}</p>
  </section>
}
