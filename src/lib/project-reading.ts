import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from "react"

const alignmentDuration = 480
const scrollKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "])

/** Keep the selected project readable without taking over scrolling outside it. */
export function useProjectReading(
  indexRef: RefObject<HTMLElement | null>,
  selected: string | null,
  hash: string,
) {
  const frame = useRef(0)
  const pendingAlignment = useRef<HTMLElement | null>(null)
  const previous = useRef<{ selected: string | null; hash: string } | null>(null)
  const intent = useRef<{ slug: string; opening: boolean } | null>(null)

  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    if (indexRef.current) delete indexRef.current.dataset.aligning
  }, [indexRef])

  const cancelAlignment = useCallback(() => {
    stopAnimation()
    pendingAlignment.current = null
  }, [stopAnimation])

  const align = useCallback((item: HTMLElement, resetContent?: HTMLElement) => {
    cancelAlignment()
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
    pendingAlignment.current = item
    const startY = window.scrollY
    const contentStartY = resetContent?.scrollTop ?? 0
    const startTime = performance.now()
    const precedingItems = Array.from(item.parentElement?.children ?? []).slice(0,
      Array.from(item.parentElement?.children ?? []).indexOf(item))
    if (indexRef.current) indexRef.current.dataset.aligning = "true"

    const tick = (now: number) => {
      const progress = motionPreference.matches ? 1 : Math.min(1, (now - startTime) / alignmentDuration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const navHeight = document.querySelector(".site-nav")?.getBoundingClientRect().height ?? 0
      // Predict the final row position while preceding panels collapse, so the
      // page moves in one direction instead of chasing their changing heights.
      const closingHeight = precedingItems.reduce((height, previousItem) => (
        height + (previousItem.querySelector('[aria-hidden="true"] > .project-panel-clip')?.getBoundingClientRect().height ?? 0)
      ), 0)
      const target = window.scrollY + item.getBoundingClientRect().top - closingHeight - navHeight
      window.scrollTo({ top: startY + (Math.max(0, target) - startY) * eased, behavior: "instant" })
      resetContent?.scrollTo({ top: contentStartY * (1 - eased), behavior: "instant" })
      if (progress < 1) frame.current = requestAnimationFrame(tick)
      else cancelAlignment()
    }
    frame.current = requestAnimationFrame(tick)
  }, [cancelAlignment, indexRef])

  useEffect(() => {
    // A deliberate gesture or navigation always takes precedence over alignment.
    const onKey = (event: KeyboardEvent) => {
      if (scrollKeys.has(event.key) || event.key === "Tab") cancelAlignment()
    }
    window.addEventListener("wheel", cancelAlignment, { capture: true, passive: true })
    window.addEventListener("touchstart", cancelAlignment, { passive: true })
    window.addEventListener("pointerdown", cancelAlignment, { passive: true })
    window.addEventListener("keydown", onKey)
    return () => {
      stopAnimation()
      window.removeEventListener("wheel", cancelAlignment, true)
      window.removeEventListener("touchstart", cancelAlignment)
      window.removeEventListener("pointerdown", cancelAlignment)
      window.removeEventListener("keydown", onKey)
    }
  }, [cancelAlignment, stopAnimation])

  useLayoutEffect(() => {
    const index = indexRef.current
    if (!index) return
    const last = previous.current
    const clicked = intent.current
    previous.current = { selected, hash }
    intent.current = null
    const items = Array.from(index.querySelectorAll<HTMLElement>(".index-rows > li"))
    const item = items.find(element => element.id === `project-${selected}`)

    if (!item) {
      const closedItem = clicked && items.find(element => element.id === `project-${clicked.slug}`)
      if (closedItem && !clicked.opening) align(closedItem)
      else cancelAlignment()
      return stopAnimation
    }

    const button = item.querySelector<HTMLButtonElement>(".index-row")
    const content = item.querySelector<HTMLElement>(".project-detail-scroll")
    const details = content?.firstElementChild
    const nav = document.querySelector<HTMLElement>(".site-nav")
    if (!button || !content || !details || !nav) return

    const nextButtons = items.slice(items.indexOf(item) + 1, items.indexOf(item) + 4)
      .map(element => element.querySelector<HTMLElement>(".index-row"))
      .filter((element): element is HTMLElement => !!element)
    let lastWidth = window.innerWidth
    let lastHeight = window.visualViewport?.height ?? window.innerHeight
    let lastNavHeight = nav.getBoundingClientRect().height
    let atReadingStart = Math.abs(item.getBoundingClientRect().top - lastNavHeight) < 2

    const trackPosition = () => {
      // A resize can also fire scroll events. Keep the pre-resize reading state
      // until measure() has updated the viewport and re-established the offset.
      if (window.innerWidth !== lastWidth || (window.visualViewport?.height ?? window.innerHeight) !== lastHeight) return
      atReadingStart = Math.abs(item.getBoundingClientRect().top - nav.getBoundingClientRect().height) < 2
    }

    const measure = () => {
      const navHeight = nav.getBoundingClientRect().height
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight
      const viewportChanged = window.innerWidth !== lastWidth || viewportHeight !== lastHeight || navHeight !== lastNavHeight
      const followingHeight = nextButtons.reduce((height, next) => (
        height + next.getBoundingClientRect().height
        + parseFloat(getComputedStyle(next.parentElement!).borderTopWidth || "0")
      ), 0)
      const itemBorder = parseFloat(getComputedStyle(item).borderTopWidth || "0")
      // Very short landscape windows still get a usable reading area.
      const available = Math.max(120, Math.floor(
        viewportHeight - navHeight - button.getBoundingClientRect().height - followingHeight - itemBorder,
      ))
      const height = `${available}px`
      if (item.style.getPropertyValue("--project-detail-max-height") !== height) {
        item.style.setProperty("--project-detail-max-height", height)
      }
      const overflowing = content.scrollHeight > content.clientHeight + 1
      content.dataset.overflowing = String(overflowing)
      if (overflowing) content.tabIndex = 0
      else content.removeAttribute("tabindex")
      if (viewportChanged && atReadingStart && !frame.current) {
        window.scrollTo({ top: window.scrollY + item.getBoundingClientRect().top - navHeight, behavior: "instant" })
      }
      lastWidth = window.innerWidth
      lastHeight = viewportHeight
      lastNavHeight = navHeight
    }

    const wheelDistance = (event: WheelEvent) => event.deltaY
      * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? content.clientHeight : 1)

    const onContentWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.deltaY >= 0
        || Math.abs(event.deltaX) > Math.abs(event.deltaY)
        || content.dataset.overflowing !== "true" || content.scrollTop > 1) return
      // Explicitly hand off at the top, including within one trackpad gesture.
      // The lower boundary remains contained by the detail area's CSS.
      event.preventDefault()
      window.scrollBy({ top: wheelDistance(event), behavior: "instant" })
    }

    let touchY: number | null = null
    let touchX: number | null = null
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches.length === 1 ? event.touches[0]!.clientY : null
      touchX = event.touches.length === 1 ? event.touches[0]!.clientX : null
    }
    const onTouchMove = (event: TouchEvent) => {
      const nextY = event.touches.length === 1 ? event.touches[0]!.clientY : null
      const nextX = event.touches.length === 1 ? event.touches[0]!.clientX : null
      const delta = touchY !== null && nextY !== null ? touchY - nextY : 0
      const deltaX = touchX !== null && nextX !== null ? touchX - nextX : 0
      touchY = nextY
      touchX = nextX
      // Horizontal chapter/gallery swipes must not become page-scroll handoffs.
      if (event.defaultPrevented || Math.abs(deltaX) > Math.abs(delta) || delta >= 0 || content.scrollTop > 1 || content.dataset.overflowing !== "true") return
      if (event.cancelable) event.preventDefault()
      window.scrollBy({ top: delta, behavior: "instant" })
    }

    const onHeaderWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.deltaY <= 0
        || Math.abs(event.deltaX) > Math.abs(event.deltaY)
        || content.dataset.overflowing !== "true") return
      // Before the row reaches the navbar, retain the browser's normal page scroll.
      if (button.getBoundingClientRect().top > nav.getBoundingClientRect().bottom + 1) return
      event.preventDefault()
      content.scrollBy({ top: wheelDistance(event), behavior: "instant" })
    }

    const onContentKey = (event: KeyboardEvent) => {
      if (event.target !== content || content.dataset.overflowing !== "true"
        || event.altKey || event.ctrlKey || event.metaKey || !scrollKeys.has(event.key)) return
      const page = content.clientHeight * 0.85
      const amount: Record<string, number> = {
        ArrowDown: 40, ArrowUp: -40, PageDown: page, PageUp: -page,
        Home: -content.scrollHeight, End: content.scrollHeight, " ": event.shiftKey ? -page : page,
      }
      event.preventDefault()
      const delta = amount[event.key]!
      if (delta < 0 && content.scrollTop <= 1) {
        if (event.key === "Home") window.scrollTo({ top: 0, behavior: "instant" })
        else window.scrollBy({ top: delta, behavior: "instant" })
      } else content.scrollBy({ top: delta, behavior: "instant" })
    }

    measure()
    const observer = new ResizeObserver(measure)
    for (const element of [nav, button, content, details, ...nextButtons]) observer.observe(element)
    window.addEventListener("resize", measure)
    window.addEventListener("scroll", trackPosition, { passive: true })
    window.visualViewport?.addEventListener("resize", measure)
    button.addEventListener("wheel", onHeaderWheel, { passive: false })
    content.addEventListener("wheel", onContentWheel, { passive: false })
    content.addEventListener("touchstart", onTouchStart, { passive: true })
    content.addEventListener("touchmove", onTouchMove, { passive: false })
    content.addEventListener("keydown", onContentKey)

    const projectHash = `#project-${selected}`
    const readingHash = !hash || hash === "#index" || hash === projectHash
    const selectionChanged = !last || last.selected !== selected
    const resumeAlignment = pendingAlignment.current === item && last?.selected === selected && last?.hash === hash
    if (clicked?.opening || (selectionChanged && readingHash) || (hash === projectHash && last?.hash !== hash) || resumeAlignment) {
      align(item)
    } else cancelAlignment()

    return () => {
      // Stop the frame but retain the request across React's effect replay.
      // Real user input cancels the request as well.
      stopAnimation()
      observer.disconnect()
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", trackPosition)
      window.visualViewport?.removeEventListener("resize", measure)
      button.removeEventListener("wheel", onHeaderWheel)
      content.removeEventListener("wheel", onContentWheel)
      content.removeEventListener("touchstart", onTouchStart)
      content.removeEventListener("touchmove", onTouchMove)
      content.removeEventListener("keydown", onContentKey)
      // Retain this item's measured limit until its exit animation has finished.
    }
  }, [align, cancelAlignment, hash, indexRef, selected, stopAnimation])

  return (slug: string) => {
    if (slug === selected) {
      const item = indexRef.current?.querySelector<HTMLElement>(`#project-${slug}`)
      const content = item?.querySelector<HTMLElement>(".project-detail-scroll")
      const navHeight = document.querySelector(".site-nav")?.getBoundingClientRect().height ?? 0
      // Check the list item's original position: a sticky button can look aligned
      // even after the page has moved beyond the project's reading start.
      if (item && content && (Math.abs(item.getBoundingClientRect().top - navHeight) > 2 || content.scrollTop > 1)) {
        intent.current = null
        align(item, content)
        return "restore"
      }
    }
    intent.current = { slug, opening: slug !== selected }
    return "toggle"
  }
}
