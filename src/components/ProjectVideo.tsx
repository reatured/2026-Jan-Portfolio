import { useState } from "react"
import { useVisibleVideo } from "@/lib/use-visible-video"

type ProjectVideoProps = {
  src: string
  poster?: string
  title: string
  caption?: string
  width?: number
  height?: number
  allowExternalPlayback?: boolean
}

export default function ProjectVideo({ src, poster, title, caption, width = 1920, height = 1080, allowExternalPlayback = true }: ProjectVideoProps) {
  const [failed, setFailed] = useState(false)
  const video = useVisibleVideo(true, !failed)

  return (
    <figure className="project-video-wrap">
      {failed ? (
        <div className="project-video-error" role="alert" style={{ aspectRatio: `${width} / ${height}` }}>
          <p>The video could not load.</p>
          <div>
            <button type="button" onClick={() => setFailed(false)}>Retry video</button>
            {allowExternalPlayback && <a href={src} target="_blank" rel="noopener noreferrer">Open video</a>}
          </div>
        </div>
      ) : (
        <video ref={video} className="project-video" src={src} poster={poster}
          width={width} height={height} style={{ aspectRatio: `${width} / ${height}` }} controls playsInline muted preload="metadata"
          aria-label={`${title} video`} onError={() => setFailed(true)} />
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
