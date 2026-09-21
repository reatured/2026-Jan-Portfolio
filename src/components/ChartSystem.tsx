import { forwardRef, type KeyboardEventHandler, type ReactNode } from "react"

type ChartFrameProps = {
  eyebrow: string
  title: string
  summary: string
  caption?: ReactNode
  className?: string
  headingId?: string
  children: ReactNode
}

export function ChartFrame({ eyebrow, title, summary, caption, className, headingId, children }: ChartFrameProps) {
  return (
    <section className={["chart-system", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="chart-head">
        <span className="chart-eyebrow">{eyebrow}</span>
        <h4 className="chart-title" id={headingId}>{title}</h4>
        <p className="chart-summary">{summary}</p>
      </div>
      {children}
      {caption ? <p className="chart-caption">{caption}</p> : null}
    </section>
  )
}

type ChartCanvasProps = {
  children: ReactNode
  ariaLabel: string
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>
}

export const ChartCanvas = forwardRef<HTMLDivElement, ChartCanvasProps>(function ChartCanvas({ children, ariaLabel, onKeyDown }, ref) {
  return (
    <div ref={ref} className="chart-canvas" tabIndex={0} role="group" aria-label={ariaLabel} onKeyDown={onKeyDown}>
      <div className="chart-stage">{children}</div>
    </div>
  )
})

type SvgChartZoneProps = {
  id: string
  label: string
  meta?: string
  x: number
  y: number
  width: number
  height: number
  image?: string
}

export function SvgChartZone({ id, label, meta, x, y, width, height, image }: SvgChartZoneProps) {
  const imagePadding = 8
  const imageWidth = width - imagePadding * 2
  const imageHeight = Math.round(imageWidth * 9 / 16)
  return (
    <g key={id}>
      <rect className="chart-zone" x={x} y={y} width={width} height={height} rx="10" />
      {image ? (
        <image
          href={image}
          x={x + imagePadding}
          y={y + imagePadding}
          width={imageWidth}
          height={imageHeight}
          preserveAspectRatio="xMidYMid meet"
          clipPath={`url(#zone-clip-${id})`}
        />
      ) : null}
      <text className="chart-zone-label" x={x + 20} y={y + (image ? imageHeight + 42 : 30)}>{label}</text>
      {meta ? <text className="chart-zone-meta" x={x + 20} y={y + (image ? imageHeight + 60 : 48)}>{meta}</text> : null}
    </g>
  )
}

type SvgChartEdgeProps = {
  d: string
  kind?: string
  markerEnd?: string
  dim?: boolean
  label?: string
  labelX?: number
  labelY?: number
  labelAnchor?: "start" | "middle" | "end"
  labelRotate?: boolean
}

export function SvgChartEdge({ d, kind = "flow", markerEnd, dim, label, labelX = 0, labelY = 0, labelAnchor = "middle", labelRotate }: SvgChartEdgeProps) {
  return (
    <g data-dim={dim || undefined}>
      <path className="chart-edge" data-kind={kind} d={d} markerEnd={markerEnd} />
      {label ? (
        <text className="chart-edge-label" x={labelX} y={labelY} textAnchor={labelAnchor}
          transform={labelRotate ? `rotate(-90 ${labelX} ${labelY})` : undefined}>{label}</text>
      ) : null}
    </g>
  )
}

type SvgChartPort = {
  x: number
  y: number
}

type SvgChartNodeProps = {
  x: number
  y: number
  width: number
  height: number
  kicker: string
  title: string
  meta: string[]
  kind?: string
  dim?: boolean
  ariaLabel: string
  ports?: SvgChartPort[]
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onFocus?: () => void
  onBlur?: () => void
}

export function SvgChartNode({ x, y, width, height, kicker, title, meta, kind = "panel", dim, ariaLabel, ports, onMouseEnter, onMouseLeave, onFocus, onBlur }: SvgChartNodeProps) {
  const renderedPorts = ports ?? [{ x: 0, y: height / 2 }, { x: width, y: height / 2 }]

  return (
    <g className="chart-node" transform={`translate(${x} ${y})`} data-kind={kind} data-dim={dim || undefined}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onFocus={onFocus} onBlur={onBlur}
      tabIndex={0} role="button" aria-label={ariaLabel}>
      <rect className="chart-node-card" width={width} height={height} rx="6" />
      <text className="chart-node-kicker" x="18" y="22">{kicker}</text>
      <text className="chart-node-title" x="18" y="45">{title}</text>
      {meta.map((line, index) => (
        <text key={line} className="chart-node-meta" x="18" y={65 + index * 14}>{line}</text>
      ))}
      {renderedPorts.map(port => <circle key={`${port.x}-${port.y}`} className="chart-port" cx={port.x} cy={port.y} r="4" />)}
    </g>
  )
}
