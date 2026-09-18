import { useEffect, useRef, type RefObject } from "react"
import { createPortal } from "react-dom"

type PreviewImage = { src: string; width: number; height: number }

export default function ProjectHoverPreview({ indexRef, resetKey }: {
  indexRef: RefObject<HTMLElement | null>
  resetKey: string
}) {
  const previewRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const cache = useRef(new Map<string, Promise<PreviewImage | null>>())

  useEffect(() => {
    const index = indexRef.current
    const preview = previewRef.current
    const image = imageRef.current
    if (!index || !preview || !image) return

    const hover = window.matchMedia("(hover: hover) and (pointer: fine)")
    let currentRow: HTMLButtonElement | null = null
    let loaded: PreviewImage | null = null
    let request = 0
    let frame = 0
    let pointerX = 0
    let pointerY = 0
    let width = 0
    let height = 0
    let topEdge = 12

    const hide = () => {
      currentRow = null
      loaded = null
      request += 1
      cancelAnimationFrame(frame)
      frame = 0
      preview.dataset.visible = "false"
    }

    const place = () => {
      frame = 0
      if (!loaded || !currentRow) return
      const gap = 24
      const edge = 12
      // Flip beside the pointer at the right edge; keep the complete image on screen.
      const left = pointerX + gap + width <= window.innerWidth - edge
        ? pointerX + gap : pointerX - gap - width
      const top = Math.max(topEdge, Math.min(pointerY - height / 2, window.innerHeight - height - edge))
      preview.style.transform = `translate3d(${Math.max(edge, left)}px, ${top}px, 0)`
    }

    const load = (src: string) => {
      const existing = cache.current.get(src)
      if (existing) return existing
      const pending = new Promise<PreviewImage | null>(resolve => {
        const candidate = new Image()
        candidate.onload = async () => {
          await candidate.decode().catch(() => {})
          resolve({ src, width: candidate.naturalWidth, height: candidate.naturalHeight })
        }
        candidate.onerror = () => {
          cache.current.delete(src)
          resolve(null)
        }
        candidate.src = src
      })
      cache.current.set(src, pending)
      return pending
    }

    const follow = (event: PointerEvent) => {
      const row = event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>(".index-row[data-preview-src]") : null
      if (!hover.matches || event.pointerType !== "mouse" || event.buttons !== 0
        || !row || !index.contains(row) || row.getAttribute("aria-expanded") === "true"
        || index.hasAttribute("data-aligning")) {
        hide()
        return
      }
      pointerX = event.clientX
      pointerY = event.clientY
      if (currentRow === row) {
        if (!frame) frame = requestAnimationFrame(place)
        return
      }

      hide()
      currentRow = row
      const thisRequest = request
      void load(row.dataset.previewSrc!).then(asset => {
        // A late download must never resurrect a preview after leaving or switching rows.
        if (!asset || request !== thisRequest || currentRow !== row || !row.isConnected
          || row.getAttribute("aria-expanded") === "true") return
        loaded = asset
        topEdge = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 56) + 12
        const scale = Math.min(300 / asset.width, 210 / asset.height,
          (window.innerWidth - 24) / asset.width,
          Math.max(1, window.innerHeight - topEdge - 12) / asset.height)
        width = Math.round(asset.width * scale)
        height = Math.round(asset.height * scale)
        preview.style.width = `${width}px`
        preview.style.height = `${height}px`
        image.src = asset.src
        place()
        preview.dataset.visible = "true"
      })
    }

    const leave = (event: PointerEvent) => {
      if (!(event.relatedTarget instanceof Node) || !currentRow?.contains(event.relatedTarget)) hide()
    }

    index.addEventListener("pointerover", follow)
    index.addEventListener("pointermove", follow)
    index.addEventListener("pointerout", leave)
    window.addEventListener("scroll", hide, { capture: true, passive: true })
    window.addEventListener("pointerdown", hide, true)
    window.addEventListener("keydown", hide)
    window.addEventListener("blur", hide)
    window.addEventListener("resize", hide)
    hover.addEventListener("change", hide)
    return () => {
      hide()
      index.removeEventListener("pointerover", follow)
      index.removeEventListener("pointermove", follow)
      index.removeEventListener("pointerout", leave)
      window.removeEventListener("scroll", hide, true)
      window.removeEventListener("pointerdown", hide, true)
      window.removeEventListener("keydown", hide)
      window.removeEventListener("blur", hide)
      window.removeEventListener("resize", hide)
      hover.removeEventListener("change", hide)
    }
  }, [indexRef, resetKey])

  return createPortal(
    <div ref={previewRef} className="project-hover-preview" aria-hidden="true">
      <div className="project-hover-frame">
        <img ref={imageRef} alt="" decoding="async" draggable={false} />
      </div>
    </div>,
    document.body,
  )
}
