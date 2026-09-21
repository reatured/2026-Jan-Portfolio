import { type FC } from "react"
import {
  ReactFlow,
  Handle,
  Position,
  MarkerType,
  ReactFlowProvider,
  type NodeProps,
  type Node,
  type Edge,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  layoutCanvas,
  teleopCanvas,
  IMG_W,
  IMG_H,
  type AnchorSide,
  type LaidOutNode,
  type LaidOutSection,
} from "@/lib/teleop-flow-graph"

/* ── Edge styles ── */
const ORANGE = { stroke: "#ff6b1a", strokeWidth: 1.8 }
const orangeArrow = { type: MarkerType.ArrowClosed, color: "#ff6b1a", width: 14, height: 14 }
const DASHED = { stroke: "#8e8e93", strokeWidth: 1.8, strokeDasharray: "5 5" }
const dashedArrow = { type: MarkerType.ArrowClosed, color: "#8e8e93", width: 14, height: 14 }
const labelBg = { fill: "#ffffff" }
const labelStyle = { fontSize: 11, fill: "#646469" }

const HANDLE_POSITION: Record<AnchorSide, Position> = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
}

/* ── Node views ── */

function SectionNode({ data }: NodeProps) {
  const section = data as unknown as LaidOutSection
  return (
    <div className="chart-rf-zone">
      <div className="chart-rf-zone-header">
        <div className="chart-rf-zone-media" style={{ width: IMG_W }}>
          <img src={section.image} alt="" width={IMG_W} height={IMG_H} loading="lazy" />
        </div>
        <div className="chart-rf-zone-label">{section.title}</div>
        <div className="chart-rf-zone-meta">{section.subtitle}</div>
      </div>
    </div>
  )
}

function GraphNode({ data }: NodeProps) {
  const node = data as unknown as LaidOutNode
  return (
    <div className={`chart-rf-node${node.kind === "hub" ? " is-hub" : ""}${node.kind === "chip" ? " is-chip" : ""}`}>
      {node.inputs?.map(side => (
        <Handle key={`in-${side}`} id={side} type="target" position={HANDLE_POSITION[side]} />
      ))}
      {node.outputs?.map(side => (
        <Handle key={`out-${side}`} id={side} type="source" position={HANDLE_POSITION[side]} />
      ))}
      <div className="chart-rf-label">{node.label}</div>
      {node.detail && <div className="chart-rf-detail">{node.detail}</div>}
    </div>
  )
}

const nodeTypes = { section: SectionNode, node: GraphNode }

/* ── Derive React Flow elements from the laid-out hierarchy ── */

const laidOut = layoutCanvas(teleopCanvas)

const flowNodes: Node[] = [
  ...laidOut.sections.map((section): Node => ({
    id: `section-${section.id}`,
    type: "section",
    position: { x: section.x, y: section.y },
    style: { width: section.width, height: section.height },
    data: section,
    draggable: false,
    selectable: false,
    zIndex: -1,
  })),
  ...laidOut.nodes.map((node): Node => ({
    id: node.id,
    type: "node",
    position: { x: node.x, y: node.y },
    style: { width: node.size.w, height: node.size.h },
    data: node,
    draggable: false,
  })),
]

const flowEdges: Edge[] = teleopCanvas.edges.map((edge, i) => {
  const isReturn = edge.kind === "return"
  return {
    id: `e${i}-${edge.from}-${edge.to}`,
    source: edge.from,
    target: edge.to,
    sourceHandle: edge.fromAnchor,
    targetHandle: edge.toAnchor,
    type: isReturn ? "smoothstep" : "default",
    label: edge.label,
    style: isReturn ? DASHED : ORANGE,
    markerEnd: isReturn ? dashedArrow : orangeArrow,
    labelStyle,
    labelBgStyle: labelBg,
    labelBgPadding: [5, 7],
    labelBgBorderRadius: 4,
  }
})

/* ── Component ── */

function Flow() {
  return (
    <ReactFlow
      nodes={flowNodes}
      edges={flowEdges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.08 }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag
      zoomOnScroll={false}
      zoomOnPinch={false}
      preventScrolling={false}
      minZoom={0.3}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
    />
  )
}

const TeleopReactFlowGraph: FC = () => {
  return (
    <ReactFlowProvider>
      <div className="chart-system teleop-graph">
        <div className="chart-head">
          <span className="chart-eyebrow">Architecture map</span>
          <h4 className="chart-title">Operator to remote robot</h4>
          <p className="chart-summary">
            Motion input, unified control, hardware drivers, and video return in one traceable system view.
          </p>
        </div>
        <div className="chart-flow-shell" style={{ height: laidOut.height + 90 }}>
          <Flow />
        </div>
        <p className="chart-caption">
          The graph separates operator inputs from the shared control layer and the physical site.
        </p>
      </div>
    </ReactFlowProvider>
  )
}

export default TeleopReactFlowGraph