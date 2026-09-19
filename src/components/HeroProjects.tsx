import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react"
import { Link, useLocation } from "react-router-dom"
import { useReducedMotion } from "framer-motion"
import { heroProjects } from "@/lib/hero"
import { cn } from "@/lib/utils"

const hasHoverPreview = () => window.matchMedia("(width > 760px) and (hover: hover) and (pointer: fine)").matches
const expandedShare = .64
const compactShare = (1 - expandedShare) / (heroProjects.length - 1)
const imageAspectRatio = 16 / 9

export default function HeroProjects() {
  const [selected, setSelected] = useState<number | null>(null)
  const rail = useRef<HTMLDivElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const [mediaLayout, setMediaLayout] = useState<{
    trackWidth: number; height: number; cardWidth: number | null
  } | null>(null)
  const [motionReady, setMotionReady] = useState(false)
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    const container = rail.current
    const media = container?.querySelector<HTMLElement>(".hero-panel-media")
    if (!container || !media) return
    const measure = () => {
      const style = getComputedStyle(container)
      const trackWidth = container.getBoundingClientRect().width
        - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
        - parseFloat(style.columnGap) * (heroProjects.length - 1)
      const cardWidth = style.display === "flex" ? media.getBoundingClientRect().width : null
      const height = (cardWidth ?? trackWidth * expandedShare) / imageAspectRatio
      setMediaLayout(current => current?.trackWidth === trackWidth
        && current.height === height && current.cardWidth === cardWidth
        ? current : { trackWidth, height, cardWidth })
    }
    measure()
    // Size the image window from the expanded width, not the viewport height
    // or the animating columns. Hovering then never moves the Index below it.
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const measured = mediaLayout !== null
  useEffect(() => {
    if (!measured) return
    let nextFrame = 0
    const frame = requestAnimationFrame(() => {
      nextFrame = requestAnimationFrame(() => setMotionReady(true))
    })
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(nextFrame) }
  }, [measured])

  const previewPanel = (index: number, event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !hasHoverPreview()) return
    // React to pointer movement, not layout-generated pointerenter events.
    // Collapsing with Escape must not reopen a panel under a stationary mouse.
    setSelected(index)
  }

  const leavePreview = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && hasHoverPreview()) setSelected(null)
  }

  const revealMobileCard = (index: number) => {
    if (!window.matchMedia("(max-width: 760px)").matches) return
    const container = rail.current
    const panel = container?.children[index]
    if (!container || !(panel instanceof HTMLElement)) return
    // Scroll only the horizontal rail, so selecting a card never moves the page.
    container.scrollTo({
      left: container.scrollLeft + panel.getBoundingClientRect().left - container.getBoundingClientRect().left,
      behavior: reduceMotion ? "instant" : "smooth",
    })
  }

  const activate = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    // Mouse selection belongs entirely to panel hover. Keep native
    // keyboard activation and tap selection for the swipeable mobile layout.
    if (event.detail > 0 && hasHoverPreview()) return
    setSelected(current => current === index ? null : index)
    buttons.current[index]?.focus({ preventScroll: true })
    revealMobileCard(index)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && selected !== null) {
      event.preventDefault()
      buttons.current[selected]?.focus({ preventScroll: true })
      setSelected(null)
      return
    }
    const index = buttons.current.indexOf(event.target as HTMLButtonElement)
    if (index < 0 || event.altKey || event.ctrlKey || event.metaKey) return
    const targets: Record<string, number> = {
      ArrowRight: (index + 1) % heroProjects.length,
      ArrowLeft: (index + heroProjects.length - 1) % heroProjects.length,
      Home: 0,
      End: heroProjects.length - 1,
    }
    const next = targets[event.key]
    if (next === undefined) return
    event.preventDefault()
    buttons.current[next]?.focus({ preventScroll: true })
    revealMobileCard(next)
  }

  return (
    <section id="home" className="home-hero" aria-labelledby="hero-title" onKeyDown={onKeyDown}
      onPointerLeave={leavePreview} onPointerCancel={leavePreview}>
      <header className="hero-heading" onPointerEnter={leavePreview}>
        <h1 id="hero-title" className="site-container">Recent Projects</h1>
      </header>
      <div ref={rail} className="hero-accordion" role="group" aria-label="Featured projects"
        data-selected={selected === null ? undefined : heroProjects[selected]?.id}
        data-motion-ready={motionReady || undefined}
        style={{
          "--hero-media-height": `${mediaLayout?.height ?? 0}px`,
          "--hero-promotion-width": `${mediaLayout?.cardWidth ?? (mediaLayout?.trackWidth ?? 0) * expandedShare}px`,
          gridTemplateColumns: heroProjects.map((_, index) => (
            `${selected === null ? 1 / heroProjects.length : selected === index ? expandedShare : compactShare}fr`
          )).join(" "),
        } as CSSProperties}>
        {heroProjects.map((project, index) => {
          const expanded = selected === index
          const [imageWidth, imageHeight] = project.imageSize
          const mediaWidth = mediaLayout?.cardWidth ?? (mediaLayout?.trackWidth ?? 0)
            * (selected === null ? 1 / heroProjects.length : expanded ? expandedShare : compactShare)
          const height = mediaLayout?.height ?? 0
          const scale = Math.max(mediaWidth / imageWidth, height / imageHeight) * (expanded ? 1 : 1.12)
          const [focusX, focusY] = expanded ? [.5, .5] : project.focalPoint ?? [.5, .5]
          const x = (mediaWidth - imageWidth * scale) * focusX
          const y = (height - imageHeight * scale) * focusY
          const mediaId = `hero-preview-${project.id}`
          const titleId = `hero-toggle-${project.id}`
          const params = new URLSearchParams(location.search)
          params.set("project", project.id)
          const hash = `#project-${project.id}`
          return (
            <article key={project.id} className={cn("hero-panel", expanded && "is-expanded",
              selected !== null && !expanded && "is-compact")} aria-labelledby={titleId}
              style={{ zIndex: heroProjects.length - index }}
              onPointerMove={event => previewPanel(index, event)}>
              <div className="hero-panel-media" id={mediaId} role="region" aria-labelledby={titleId}>
                {/* One persistent image zooms out into the 16:9 window. Cover
                    absorbs small source-ratio differences without empty bars. */}
                <img className="hero-project-image" src={project.image}
                  alt={expanded ? project.imageAlt : ""} aria-hidden={!expanded}
                  width={imageWidth} height={imageHeight} decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  style={{ width: imageWidth, height: imageHeight, visibility: measured ? "visible" : "hidden",
                    transform: `translate(${x}px, ${y}px) scale(${scale})` }} />
                <span className="hero-image-veil" aria-hidden="true" />
                <div className="hero-promotion-copy" aria-hidden={!expanded} style={{
                  "--hero-copy-width": project.overlay.width,
                  "--hero-copy-bottom": `${project.overlay.bottom * 100}%`,
                } as CSSProperties}>
                  <p className="hero-promotion-title">{project.overlay.title}</p>
                  <p className="hero-promotion-subtitle">{project.overlay.subtitle}</p>
                </div>
                {!expanded && <button type="button" className="hero-image-trigger" tabIndex={-1}
                  aria-hidden="true" onClick={event => activate(index, event)} />}
              </div>
              <div className="hero-panel-footer">
                <h2>
                  <button ref={element => { buttons.current[index] = element }} type="button" id={titleId}
                    className="hero-panel-toggle" aria-expanded={expanded} aria-controls={mediaId}
                    onClick={event => activate(index, event)} onFocus={() => revealMobileCard(index)}>
                    <span>{expanded ? project.title : project.label}</span>
                    <span className="hero-panel-mark" aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                </h2>
                {expanded && <Link className="hero-project-link" to={{ pathname: "/", search: params.toString(), hash }}
                  preventScrollReset aria-label={`View project: ${project.title}`} onClick={event => {
                    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                    const row = document.getElementById(`project-button-${project.id}`)
                    if (location.hash === hash && new URLSearchParams(location.search).get("project") === project.id) {
                      event.preventDefault()
                      const navHeight = document.querySelector(".site-nav")?.getBoundingClientRect().height ?? 0
                      if (row) window.scrollTo({ top: window.scrollY + row.getBoundingClientRect().top - navHeight,
                        behavior: reduceMotion ? "instant" : "smooth" })
                    }
                    row?.focus({ preventScroll: true })
                  }}>View project</Link>}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
