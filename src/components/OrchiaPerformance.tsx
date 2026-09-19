import { useEffect, useId, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"
import { FOLLOWER_START_DAY, FOLLOWER_TREND, SOCIAL_PERFORMANCE_VIDEOS as videos } from "@/lib/orchia-performance"
import { orchiaShowcase } from "@/lib/orchia"

export type OrchiaMetric = "followers" | "views" | "likesSaves" | "ca"
export const orchiaMetrics: { key: OrchiaMetric; label: string }[] = [
  { key: "followers", label: "Follower growth" }, { key: "views", label: "Views" },
  { key: "likesSaves", label: "Likes + saves" }, { key: "ca", label: "Completion" },
]
const numbers = new Intl.NumberFormat("en-US")
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
const publications = Array.from(videos.reduce((events, video) => {
  const day = Number(video.date.slice(-2))
  const event = events.get(day)
  events.set(day, event
    ? { ...event, count: event.count + 1, titles: [...event.titles, video.title] }
    : { day, count: 1, thumbnail: video.thumbnail, titles: [video.title] })
  return events
}, new Map<number, { day: number; count: number; thumbnail: string; titles: string[] }>()).values())
const configs = {
  views: { max: 1500000, ticks: [0, 500000, 1000000, 1500000], total: `${(videos.reduce((sum, video) => sum + video.views, 0) / 1000000).toFixed(2)}M`, label: "views across 10 videos" },
  likesSaves: { max: 7000, ticks: [0, 2000, 4000, 6000], total: numbers.format(videos.reduce((sum, video) => sum + video.likesSaves, 0)), label: "likes and saves across 10 videos" },
  ca: { max: 100, ticks: [0, 25, 50, 75, 100], total: `${(videos.reduce((sum, video) => sum + video.ca, 0) / videos.length).toFixed(1)}%`, label: "mean completion across 10 videos" },
}

export default function OrchiaPerformance({ metric }: { metric: OrchiaMetric }) {
  const [selected, setSelected] = useState(4)
  const [containerWidth, setContainerWidth] = useState(800)
  const container = useRef<HTMLDivElement>(null)
  const inView = useInView(container, { once: true, amount: 0.1 })
  const reducedMotion = useReducedMotion()
  const id = useId()
  // Keep every plotted value readable; small screens pan instead of dropping labels.
  const width = Math.max(containerWidth, metric === "followers" ? 1060 : 900)
  const left = 48
  const right = width - 24
  const top = 30
  const bottom = metric === "followers" ? 270 : 220
  const max = metric === "followers" ? 2000 : configs[metric].max
  const ticks = metric === "followers" ? [0, 500, 1000, 1500, 2000] : configs[metric].ticks
  const yFor = (value: number) => bottom - (value / max) * (bottom - top)
  const xFor = (index: number) => left + (index / (FOLLOWER_TREND.length - 1)) * (right - left)
  const points = FOLLOWER_TREND.map((value, index) => ({ x: xFor(index), y: yFor(value) }))
  // The original DataSection's midpoint Bézier interpolation, resized to this panel.
  const line = points.slice(1).reduce((path, point, index) => {
    const previous = points[index]!
    const mid = (previous.x + point.x) / 2
    return `${path} C ${mid} ${previous.y}, ${mid} ${point.y}, ${point.x} ${point.y}`
  }, `M ${points[0]!.x} ${points[0]!.y}`)
  const area = `${line} L ${right} ${bottom} L ${left} ${bottom} Z`
  const sample = videos[selected] ?? videos[0]!
  const slot = (right - left) / videos.length
  const barWidth = Math.min(58, slot * 0.62)
  const thumbnailWidth = Math.min(64, slot * .76)
  const thumbnailHeight = thumbnailWidth * 4 / 3
  const thumbnailY = bottom + 18
  const dateY = metric === "followers" ? bottom + 48 : thumbnailY + thumbnailHeight + 22
  const chartHeight = dateY + 20

  useEffect(() => {
    const element = container.current
    if (!element) return
    const observer = new ResizeObserver(() => setContainerWidth(element.clientWidth))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="orchia-project-section orchia-performance" aria-labelledby={`${id}-heading`}>
      <div className="orchia-results-heading">
      <div className="orchia-section-heading"><div><h4 id={`${id}-heading`}>From workflow to audience</h4><p>Orchia's own RedNote account · July 2026</p></div><span className="orchia-demo-label">Published August 1, 2026</span></div>
      <dl className="orchia-account-metrics">
        {orchiaShowcase.metrics.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
      </dl>
      </div>
      <div className="orchia-chart-summary" aria-live="polite">
        <strong>{metric === "followers" ? "220 → 1,615" : configs[metric].total}</strong>
        <span>{metric === "followers" ? "followers · July 6–30" : configs[metric].label}</span>
      </div>
      <div ref={container} className="orchia-chart" data-animate={inView && !reducedMotion} tabIndex={containerWidth < width ? 0 : undefined}
        role="group" aria-label={`${orchiaMetrics.find(item => item.key === metric)?.label} chart. All values are labeled. Scroll sideways to explore.`}>
        <svg key={metric} viewBox={`0 0 ${width} ${chartHeight}`} width={width} height={chartHeight} style={{ width, minWidth: width }}
          role={metric === "followers" ? "img" : "group"} aria-labelledby={`${id}-chart-title ${id}-chart-description`}>
          <title id={`${id}-chart-title`}>{orchiaMetrics.find(item => item.key === metric)?.label}, July 2026</title>
          <desc id={`${id}-chart-description`}>{metric === "followers" ? "Approximate account growth reconstructed from Orchia's published chart, from 220 to 1,615 followers. Thumbnails mark eight publication dates; badges identify days with two videos. This is not an exact daily analytics export." : "Ten published videos. Each bar has its video thumbnail and publication date. Select a bar or thumbnail to see its title and recorded metrics."}</desc>
          <defs><linearGradient id={`${id}-area`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-orange)" stopOpacity=".2" /><stop offset="100%" stopColor="var(--color-orange)" stopOpacity=".01" /></linearGradient></defs>
          {ticks.map(tick => <g key={tick} className="orchia-chart-axis">
            <line x1={left} x2={right} y1={yFor(tick)} y2={yFor(tick)} />
            <text x={left - 10} y={yFor(tick) + 4} textAnchor="end">{metric === "ca" ? `${tick}%` : compact.format(tick)}</text>
          </g>)}
          {metric === "followers" ? <>
            <path className="orchia-trend-area" d={area} fill={`url(#${id}-area)`} />
            <path className="orchia-trend-line" d={line} pathLength="1" />
            {FOLLOWER_TREND.map((value, index) => <g key={index}>
              <text className="orchia-chart-date" x={xFor(index)} y={dateY} textAnchor="middle">Jul {index + FOLLOWER_START_DAY}</text>
              <circle className="orchia-trend-point" cx={points[index]!.x} cy={points[index]!.y} r="3.5"><title>July {index + FOLLOWER_START_DAY}: approximately {numbers.format(value)} followers</title></circle>
              <text className="orchia-chart-value" x={points[index]!.x} y={points[index]!.y - 12} textAnchor="middle">{numbers.format(value)}</text>
            </g>)}
            {publications.map((publication, index) => {
              const point = points[publication.day - FOLLOWER_START_DAY]!
              const below = index % 2 === 0 || index === publications.length - 1
              // Leave space above the curve for all 25 numeric labels.
              const imageY = below ? 18 : -88
              return <g key={publication.day} className="orchia-publication" transform={`translate(${point.x} ${point.y})`}>
                <title>July {publication.day}: {publication.count} {publication.count === 1 ? "video" : "videos"} — {publication.titles.join("; ")}</title>
                <line className="orchia-publication-stem" x1="0" x2="0" y1={below ? 6 : -26} y2={below ? 18 : -42} />
                <image className="orchia-chart-thumbnail" href={publication.thumbnail} x="-17" y={imageY} width="34" height="46" preserveAspectRatio="xMidYMid slice" />
                <rect className="orchia-thumbnail-frame" x="-17" y={imageY} width="34" height="46" />
                {publication.count > 1 && <g className="orchia-publication-count" transform={`translate(14 ${imageY + 7})`}>
                  <circle r="9" /><text y="3" textAnchor="middle">{publication.count}</text>
                </g>}
              </g>
            })}
          </> : videos.map((video, index) => {
            const x = left + slot * index + (slot - barWidth) / 2
            const y = yFor(video[metric])
            const value = metric === "ca" ? `${video.ca}%` : numbers.format(video[metric])
            return <g key={video.title} role="button" tabIndex={0} aria-pressed={selected === index}
              aria-label={`July ${Number(video.date.slice(-2))}: ${video.title}. ${value} ${orchiaMetrics.find(item => item.key === metric)?.label}`}
              onClick={() => setSelected(index)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(index) } }}
              className="orchia-chart-bar" data-selected={selected === index}>
              <rect className="orchia-bar-hit" x={left + slot * index} y={top} width={slot} height={dateY - top + 10} />
              <rect className="orchia-bar-fill" x={x} y={y} width={barWidth} height={Math.max(1, bottom - y)} />
              <text className="orchia-chart-value" x={x + barWidth / 2} y={y - 10} textAnchor="middle">{value}</text>
              <image className="orchia-chart-thumbnail" href={video.thumbnail} x={x + barWidth / 2 - thumbnailWidth / 2} y={thumbnailY}
                width={thumbnailWidth} height={thumbnailHeight} preserveAspectRatio="xMidYMid slice" aria-hidden="true" />
              <rect className="orchia-thumbnail-frame" x={x + barWidth / 2 - thumbnailWidth / 2} y={thumbnailY} width={thumbnailWidth} height={thumbnailHeight} />
              <text className="orchia-chart-date" x={x + barWidth / 2} y={dateY} textAnchor="middle">Jul {Number(video.date.slice(-2))}</text>
            </g>
          })}
        </svg>
      </div>
      {containerWidth < width && <p className="orchia-chart-hint">Scroll sideways to see every date and value.</p>}
      <div className="orchia-results-footer">
      {metric !== "followers" && <div className="orchia-chart-sample" aria-live="polite">
        <img src={sample.thumbnail} alt="" width="48" height="64" loading="lazy" />
        <div><span>July {Number(sample.date.slice(-2))}, 2026</span><p>{sample.title}</p>
          <span>{numbers.format(sample.views)} views · {numbers.format(sample.likesSaves)} likes + saves · {sample.ca}% completion</span></div>
      </div>}
      <p className="orchia-source-note">{metric === "followers" ? "The growth curve is the approximate reconstruction used on the official site. " : "Individual video figures come from the ten records published on the official site; dates on the chart are in July. "}Account totals are the dated snapshot above. <a href={`${orchiaShowcase.source}#data`} target="_blank" rel="noopener noreferrer">View source data</a></p>
      </div>
    </section>
  )
}
