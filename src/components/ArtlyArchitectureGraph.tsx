import { useId, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { ChartCanvas, ChartFrame, SvgChartEdge, SvgChartNode, SvgChartZone } from "@/components/ChartSystem"
import {
  GRAPH_HEIGHT, GRAPH_WIDTH, NODE_HEIGHT, NODE_WIDTH,
  architectureEdgeLabel, architectureEdgePath, architectureEdges, architectureNodes, architectureZones, nodeX,
} from "@/lib/artly-architecture-graph"

const byId = new Map(architectureNodes.map(node => [node.id, node]))
const neighbours = new Map(architectureNodes.map(node => [node.id, new Set<string>()]))
for (const edge of architectureEdges) {
  neighbours.get(edge.from)!.add(edge.to)
  neighbours.get(edge.to)!.add(edge.from)
}

export default function ArtlyArchitectureGraph() {
  const [hover, setHover] = useState<string | null>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const id = useId()

  const dimNode = (nodeId: string) => hover !== null && hover !== nodeId && !neighbours.get(hover)!.has(nodeId)
  const dimEdge = (from: string, to: string) => hover !== null && from !== hover && to !== hover

  return (
    <ChartFrame className="artly-graph" headingId={`${id}-heading`} eyebrow="Architecture map" title="Cloud to deployed robot"
      summary="Editor and simulation integration with Artly AI's existing Java backend APIs and robot database."
      caption="My contribution covers the editor, simulation integration, and revision-tracked delivery workflow. Motion updates reach live robots through the existing backend after operator review and validation.">
      <ChartCanvas ref={canvas} ariaLabel="Artly system graph. Scroll sideways or use left and right arrow keys to explore."
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
          event.preventDefault()
          event.currentTarget.scrollBy({ left: event.key === "ArrowRight" ? 180 : -180, behavior: reduced ? "instant" : "smooth" })
        }}>
        <svg viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`} className="chart-svg" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
          <title id={`${id}-title`}>Artly system architecture in three zones</title>
          <desc id={`${id}-desc`}>Artly AI's existing Java backend APIs and robot database connect to the TypeScript, React, and Three.js editor. The deployment route passes through those existing APIs after operator review and validation, with revision tracking. Lingyi's contribution is the editor, simulation integration, and delivery workflow.</desc>
          <defs>
            <marker id={`${id}-arrow`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="context-stroke" /></marker>
          </defs>
          {architectureZones.map(zone => <SvgChartZone key={zone.id} {...zone} />)}
          {architectureEdges.map(edge => {
            const source = byId.get(edge.from)!, target = byId.get(edge.to)!
            const label = architectureEdgeLabel(source, target, edge)
            return <SvgChartEdge key={`${edge.from}-${edge.to}`} d={architectureEdgePath(source, target, edge)} kind={edge.kind ?? "flow"}
              markerEnd={`url(#${id}-arrow)`} dim={dimEdge(edge.from, edge.to)} label={edge.label}
              labelX={label.x} labelY={label.y} labelAnchor={label.anchor} labelRotate={label.rotate} />
          })}
          {architectureNodes.map(node => <SvgChartNode key={node.id} x={nodeX(node)} y={node.y} width={NODE_WIDTH} height={NODE_HEIGHT}
            kicker={node.kicker} title={node.title} meta={node.meta} kind={node.kind ?? "panel"} dim={dimNode(node.id)} ariaLabel={node.title}
            onMouseEnter={() => setHover(node.id)} onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(node.id)} onBlur={() => setHover(null)} />)}
        </svg>
      </ChartCanvas>
    </ChartFrame>
  )
}
