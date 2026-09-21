import { useId, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { ChartCanvas, ChartFrame, SvgChartEdge, SvgChartNode, SvgChartZone } from "@/components/ChartSystem"
import { TELEOP_GRAPH_HEIGHT, TELEOP_GRAPH_WIDTH, TELEOP_NODE_HEIGHT, TELEOP_NODE_WIDTH, teleopEdgeLabel, teleopEdgePath, teleopEdges, teleopNodeX, teleopNodes, teleopZones } from "@/lib/teleop-architecture-graph"

const nodesById = new Map(teleopNodes.map(node => [node.id, node]))
const neighbours = new Map(teleopNodes.map(node => [node.id, new Set<string>()]))
for (const edge of teleopEdges) { neighbours.get(edge.from)!.add(edge.to); neighbours.get(edge.to)!.add(edge.from) }

export default function TeleopArchitectureGraph() {
  const [hover, setHover] = useState<string | null>(null)
  const reduced = useReducedMotion()
  const id = useId()
  const dimNode = (nodeId: string) => hover !== null && hover !== nodeId && !neighbours.get(hover)!.has(nodeId)
  const dimEdge = (from: string, to: string) => hover !== null && from !== hover && to !== hover
  return <ChartFrame className="teleop-graph" headingId={`${id}-heading`} eyebrow="Architecture map" title="Operator to remote robot" summary="Motion input, unified control, hardware drivers, and video return in one traceable system view." caption="The graph separates operator inputs from the shared control layer and the physical site. Hover or focus a node to isolate its direct connections.">
    <ChartCanvas ariaLabel="RealHand teleoperation architecture. Scroll sideways or use the left and right arrow keys to explore." onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); event.currentTarget.scrollBy({ left: event.key === "ArrowRight" ? 180 : -180, behavior: reduced ? "instant" : "smooth" }) }}>
      <svg viewBox={`0 0 ${TELEOP_GRAPH_WIDTH} ${TELEOP_GRAPH_HEIGHT}`} className="chart-svg" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>RealHand teleoperation architecture</title><desc id={`${id}-desc`}>Three zones show operator inputs, an integrated control interface, and remote robot hardware with telemetry and video returning to the operator.</desc>
        <defs>
          <marker id={`${id}-arrow`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="context-stroke" /></marker>
          {teleopZones.filter(z => z.image).map(zone => {
            const imgW = zone.width - 16
            const imgH = Math.round(imgW * 9 / 16)
            return (
              <clipPath key={zone.id} id={`zone-clip-${zone.id}`}>
                <rect x={zone.x + 8} y={zone.y + 8} width={imgW} height={imgH} rx="6" />
              </clipPath>
            )
          })}
        </defs>
        {teleopZones.map(zone => <SvgChartZone key={zone.id} {...zone} />)}
        {teleopEdges.map(edge => { const from = nodesById.get(edge.from)!; const to = nodesById.get(edge.to)!; const label = edge.label ? teleopEdgeLabel(from, to, edge) : undefined; return <SvgChartEdge key={`${edge.from}-${edge.to}`} d={teleopEdgePath(from, to, edge)} kind={edge.kind === "cloud" ? "cloud" : "flow"} markerEnd={`url(#${id}-arrow)`} dim={dimEdge(edge.from, edge.to)} label={edge.label} labelX={label?.x} labelY={label?.y} /> })}
        {teleopNodes.map(node => <SvgChartNode key={node.id} x={teleopNodeX(node)} y={node.y} width={TELEOP_NODE_WIDTH} height={TELEOP_NODE_HEIGHT} kicker={node.kicker} title={node.title} meta={node.meta} kind={node.kind ?? "panel"} dim={dimNode(node.id)} ariaLabel={node.title} onMouseEnter={() => setHover(node.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(node.id)} onBlur={() => setHover(null)} />)}
      </svg>
    </ChartCanvas>
  </ChartFrame>
}
