import { useEffect, useRef } from "react"
import { useIsPresent, useReducedMotion } from "framer-motion"

/** Keep inline project playback inside the visible, open reading panel. */
export function useVisibleVideo(autoPlay: boolean, enabled = true) {
  const ref = useRef<HTMLVideoElement>(null)
  const present = useIsPresent()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video || !enabled) return
    let visible = false
    let resume = autoPlay && !reduceMotion
    let visibilityPause = false

    const pause = () => {
      if (video.paused) return
      visibilityPause = true
      video.pause()
    }
    const sync = () => {
      if (!present || !visible || document.hidden) pause()
      else if (resume && !video.ended) void video.play().catch(() => {})
    }
    const onPlay = () => {
      resume = true
      if (!present || !visible || document.hidden) pause()
    }
    const onPause = () => {
      if (visibilityPause) visibilityPause = false
      else resume = false // A reader's Pause remains in force after scrolling.
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .1)
      sync()
    }, { threshold: [0, .1] })
    observer.observe(video)
    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)
    document.addEventListener("visibilitychange", sync)
    return () => {
      observer.disconnect()
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
      document.removeEventListener("visibilitychange", sync)
      video.pause()
    }
  }, [autoPlay, enabled, present, reduceMotion])

  return ref
}
