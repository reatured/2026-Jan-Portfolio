import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react"
import { useInView, useIsPresent, useReducedMotion } from "framer-motion"
import { orchiaHomepagePreviews as previews } from "@/lib/orchia"

const cards = Array.from({ length: 3 }, (_, loop) => previews.map((preview, index) => ({ ...preview, loop, index }))).flat()

/** Adapted from the official homepage's continuous, three-copy video scroller. */
export default function OrchiaVideoCarousel() {
  const viewport = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const positions = useRef<number[]>([])
  const nudgeTimer = useRef(0)
  const drag = useRef<{ id: number; x: number; y: number; left: number; moved: boolean } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [paused, setPaused] = useState(false)
  const [nudging, setNudging] = useState(false)
  const [allowReducedPlayback, setAllowReducedPlayback] = useState(false)
  const [failed, setFailed] = useState<number | null>(null)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const inView = useInView(viewport, { amount: 0.1 })
  const present = useIsPresent()
  const reduced = useReducedMotion()
  const enabled = inView && present && pageVisible
  const playbackPaused = paused || Boolean(reduced && !allowReducedPlayback)
  const running = enabled && !reduced && !paused && !hovered && !focused && !dragging && !nudging

  const loopWidth = useCallback(() => {
    const element = viewport.current
    const first = element?.querySelector<HTMLElement>('[data-card="0"]')
    const middle = element?.querySelector<HTMLElement>('[data-card="3"]')
    return first && middle ? middle.offsetLeft - first.offsetLeft : 0
  }, [])

  const normalize = useCallback(() => {
    const element = viewport.current
    const width = loopWidth()
    if (!element || !width || focused) return 0
    const change = element.scrollLeft < width * .5 ? width : element.scrollLeft > width * 1.5 ? -width : 0
    if (change) element.scrollLeft += change
    return change
  }, [focused, loopWidth])

  useEffect(() => () => window.clearTimeout(nudgeTimer.current), [])

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])

  useEffect(() => {
    const element = viewport.current
    if (!element) return
    const observer = new ResizeObserver(() => { element.scrollLeft = loopWidth() })
    observer.observe(element)
    return () => observer.disconnect()
  }, [loopWidth])

  useEffect(() => {
    const element = viewport.current
    if (!element) return
    let timer = 0
    const sync = () => {
      timer = 0
      const bounds = element.getBoundingClientRect()
      videoRefs.current.forEach((video, index) => {
        if (video && !video.paused) positions.current[index % previews.length] = video.currentTime
      })
      videoRefs.current.forEach((video, index) => {
        if (!video) return
        const rect = video.getBoundingClientRect()
        const visible = Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left) > 24
        const shouldPlay = enabled && visible && !playbackPaused
        if (!shouldPlay) {
          video.pause()
          return
        }
        if (!video.getAttribute("src")) video.src = cards[index]!.src
        video.muted = true
        const time = positions.current[index % previews.length]
        if (video.paused && time !== undefined && Number.isFinite(video.duration)) {
          video.currentTime = Math.min(time, Math.max(0, video.duration - .5))
        }
        void video.play().catch(() => {})
      })
    }
    const schedule = () => { if (!timer) timer = window.setTimeout(sync, 120) }
    sync()
    element.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.clearTimeout(timer)
      element.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      videoRefs.current.forEach(video => video?.pause())
    }
  }, [enabled, playbackPaused])

  useEffect(() => {
    const element = viewport.current
    if (!element || !running) return
    let frame = 0
    let previous = performance.now()
    let position = element.scrollLeft
    const advance = (now: number) => {
      position += 26 * Math.min((now - previous) / 1000, .05)
      previous = now
      element.scrollLeft = position
      position += normalize()
      frame = requestAnimationFrame(advance)
    }
    frame = requestAnimationFrame(advance)
    return () => cancelAnimationFrame(frame)
  }, [running, normalize])

  function nudge(direction: number) {
    const element = viewport.current
    const card = element?.querySelector<HTMLElement>("[data-card]")
    if (!element || !card) return
    setNudging(true)
    window.clearTimeout(nudgeTimer.current)
    nudgeTimer.current = window.setTimeout(() => setNudging(false), 500)
    element.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: reduced ? "instant" : "smooth" })
  }

  function beginDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button, a")) return
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, moved: false }
    setDragging(true)
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current
    if (!start || start.id !== event.pointerId) return
    const dx = event.clientX - start.x
    if (!start.moved && Math.abs(dx) < Math.max(5, Math.abs(event.clientY - start.y))) return
    start.moved = true
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.scrollLeft = start.left - dx
    start.left += normalize()
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    drag.current = null
    setDragging(false)
  }

  return (
    <div className="orchia-carousel" data-running={running} role="region" aria-label="Orchia video previews" aria-roledescription="carousel">
      <div ref={viewport} className="orchia-carousel-viewport" data-dragging={dragging} tabIndex={0}
        aria-label="Video carousel. Use left and right arrow keys to browse."
        onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true) }}
        onPointerLeave={() => { setHovered(false); if (!drag.current?.moved) { drag.current = null; setDragging(false) } }}
        onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}
        onFocusCapture={event => setFocused((event.target as HTMLElement).matches(":focus-visible"))}
        onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false) }}
        onKeyDown={event => {
          if (event.target === event.currentTarget && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault()
            nudge(event.key === "ArrowRight" ? 1 : -1)
          }
        }}>
        <div className="orchia-carousel-track">
          {cards.map((card, index) => <figure key={index} className="orchia-homepage-preview" data-card={index}
            aria-hidden={card.loop !== 1 ? true : undefined}>
            <div className="orchia-preview-media">
              <video ref={element => { videoRefs.current[index] = element }} poster={card.poster}
                width="720" height="1280" preload="none" muted playsInline loop
                aria-hidden="true" tabIndex={-1}
                onLoadedMetadata={event => {
                  const video = event.currentTarget
                  const time = positions.current[card.index] ?? 0
                  if (Number.isFinite(video.duration)) video.currentTime = Math.min(time, Math.max(0, video.duration - .5))
                }}
                onError={() => setFailed(index)} />
              {failed === index && <a className="orchia-preview-fallback" href={card.src} target="_blank" rel="noopener noreferrer">Open preview ↗</a>}
            </div>
            <figcaption>{card.title}</figcaption>
          </figure>)}
        </div>
      </div>
      <div className="orchia-carousel-controls">
        <button type="button" onClick={() => nudge(-1)} aria-label="Previous video">←</button>
        <button type="button" onClick={() => { setFocused(false); setAllowReducedPlayback(true); setPaused(!playbackPaused) }}
          aria-label={reduced ? playbackPaused ? "Play videos" : "Pause videos" : playbackPaused ? "Resume carousel" : "Pause carousel"}>
          {reduced ? playbackPaused ? "Play videos" : "Pause videos" : playbackPaused ? "Resume" : "Pause"}
        </button>
        <button type="button" onClick={() => nudge(1)} aria-label="Next video">→</button>
      </div>
    </div>
  )
}
