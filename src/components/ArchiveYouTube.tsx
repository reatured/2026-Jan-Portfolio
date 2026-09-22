import { useEffect, useRef, useState } from "react"
import { useIsPresent, useReducedMotion } from "framer-motion"
import type { ArchiveMedia } from "@/lib/legacy-project-types"

/** Loads the iframe only while the clip is on screen, the tab is visible, and the panel is not exiting. */
export default function ArchiveYouTube({ media, autoPlay }: { media: ArchiveMedia; autoPlay: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const present = useIsPresent()
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  useEffect(() => {
    if (!root.current) return
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: .01 })
    observer.observe(root.current)
    const onVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility) }
  }, [])
  return <div ref={root} className="archive-youtube">
    {present && visible && pageVisible && <iframe src={`${media.src}?playsinline=1&rel=0&mute=1&autoplay=${autoPlay && !reduceMotion ? 1 : 0}`} title={media.caption}
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
  </div>
}
