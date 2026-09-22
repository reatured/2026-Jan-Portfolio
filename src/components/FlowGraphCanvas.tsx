import { useMemo, useState, type FC } from "react"
import {
  ReactFlow,
  Handle,
  Position,
  MarkerType,
  ReactFlowProvider,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  type NodeProps,
  type Node,
  type Edge,
  type EdgeProps,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  layoutCanvas,
  IMG_W,
  IMG_H,
  type AnchorSide,
  type FlowCanvasSpec,
  type LaidOutNode,
  type LaidOutSection,
} from "@/lib/teleop-flow-graph"

/* Spec-driven version of TeleopReactFlowGraph: same edge styling, node views, and layout
   engine, but the canvas comes in as a prop so any project can reuse it. */

/* ── Edge styles ── */
const ORANGE = { stroke: "#ff6b1a", strokeWidth: 1.8 }
const orangeArrow = { type: MarkerType.ArrowClosed, color: "#ff6b1a", width: 14, height: 14 }
// Feedback route: still dashed to read as a return, but darker, thicker, longer dashes for visibility.
const DASHED = { stroke: "#5f5f66", strokeWidth: 2.4, strokeDasharray: "9 5" }
const dashedArrow = { type: MarkerType.ArrowClosed, color: "#5f5f66", width: 16, height: 16 }

type FlowEdgeData = { label?: string; detail?: string[]; kind?: "flow" | "return" }

function FlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, markerEnd, style }: EdgeProps) {
  const d = (data ?? {}) as FlowEdgeData
  const isReturn = d.kind === "return"
  const [path, labelX, labelY] = isReturn
    ? getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, offset: 24, borderRadius: 8 })
    : getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  const [hover, setHover] = useState(false)
  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      {d.label && (
        <EdgeLabelRenderer>
          <div
            className="chart-edge-label"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div className={`chart-edge-chip${isReturn ? " is-return" : ""}`}>{d.label}</div>
            {hover && d.detail && (
              <div className="chart-edge-pop">
                <div className="chart-edge-pop-title">{d.label} — payload</div>
                <ul>{d.detail.map(row => <li key={row}>{row}</li>)}</ul>
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

const HANDLE_POSITION: Record<AnchorSide, Position> = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
}

/* ── Node views ── */

function SectionNode({ data }: NodeProps) {
  const section = data as unknown as LaidOutSection
  // Section art is supplied per project; until it lands the header keeps its reserved box.
  const [pending, setPending] = useState(false)
  return (
    <div className="chart-rf-zone">
      <div className="chart-rf-zone-header">
        <div className="chart-rf-zone-media" style={{ width: IMG_W }} data-pending={pending || undefined}>
          {pending
            ? <span className="chart-rf-zone-placeholder">Image pending · {IMG_W}×{IMG_H}</span>
            : <img src={section.image} alt="" width={IMG_W} height={IMG_H} loading="lazy" onError={() => setPending(true)} />}
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
const edgeTypes = { flow: FlowEdge }

/* ── Component ── */

function Flow({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.08 }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      minZoom={0.3}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
    />
  )
}

const FlowGraphCanvas: FC<{
  spec: FlowCanvasSpec
  title: string
  eyebrow?: string
  summary?: string
  className?: string
}> = ({ spec, title, eyebrow = "Architecture map", summary, className = "" }) => {
  const laidOut = useMemo(() => layoutCanvas(spec), [spec])

  const nodes = useMemo<Node[]>(() => [
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
  ], [laidOut])

  const edges = useMemo<Edge[]>(() => spec.edges.map((edge, i) => {
    const isReturn = edge.kind === "return"
    return {
      id: `e${i}-${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      sourceHandle: edge.fromAnchor,
      targetHandle: edge.toAnchor,
      type: "flow",
      data: { label: edge.label, detail: edge.detail, kind: edge.kind },
      style: isReturn ? DASHED : ORANGE,
      markerEnd: isReturn ? dashedArrow : orangeArrow,
    }
  }), [spec])

  return (
    <ReactFlowProvider>
      <div className={`chart-system ${className}`.trim()}>
        <div className="chart-head">
          <span className="chart-eyebrow">{eyebrow}</span>
          <h4 className="chart-title">{title}</h4>
          {summary && <p className="chart-summary">{summary}</p>}
        </div>
        <div className="chart-flow-shell" style={{ aspectRatio: `${laidOut.width} / ${laidOut.height}` }}>
          <Flow nodes={nodes} edges={edges} />
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default FlowGraphCanvas
