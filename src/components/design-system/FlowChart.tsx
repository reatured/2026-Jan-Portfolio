import { type ReactNode } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react"
import FlowNode from "@/components/design-system/FlowNode"
import FlowEdge from "@/components/design-system/FlowEdge"
import type { FlowNodeType } from "@/components/design-system/FlowNode"
import type { FlowEdgeType } from "@/components/design-system/FlowEdge"

export type FlowChartProps = {
  initialNodes: Node[]
  initialEdges: Edge[]
  /** show entrance animations? */
  animate?: boolean
  /** fit view on mount */
  fitView?: boolean
  /** render edges only — nodes keep their layout + anchors but stay invisible */
  hideNodes?: boolean
  /** hide edge paths (nodes/anchors stay) */
  hideEdges?: boolean
  /** always show anchor dots where edges attach (default: hover-only) */
  showAnchors?: boolean
  /** show edge label pills. default true */
  showLabels?: boolean
  /** arrowheads at edge ends */
  showArrows?: boolean
  /** pan on drag + scroll zoom (default: off while animate is on) */
  panZoom?: boolean
  showBackground?: boolean
  showMiniMap?: boolean
  showControls?: boolean
  children?: ReactNode
  className?: string
}

const nodeTypes: NodeTypes = { "ds-node": FlowNode }
const edgeTypes: EdgeTypes = { "ds-edge": FlowEdge }

const defaultViewport = { x: 0, y: 0, zoom: 1 }

const arrowEnd = { type: MarkerType.ArrowClosed, width: 14, height: 14, color: "#ff6b1a" }

export default function FlowChart({
  initialNodes,
  initialEdges,
  animate = false,
  fitView = false,
  hideNodes = false,
  hideEdges = false,
  showAnchors = false,
  showLabels = true,
  showArrows = false,
  panZoom = false,
  showBackground = true,
  showMiniMap = true,
  showControls = true,
  children,
  className,
}: FlowChartProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes as FlowNodeType[])
  const [edges, , onEdgesChange] = useEdgesState(initialEdges as FlowEdgeType[])
  const displayEdges = showArrows ? edges.map(e => ({ ...e, markerEnd: arrowEnd })) : edges

  return (
    <div
      className={`ds-chart-surface ${className ?? ""}`}
      style={{ height: 480 }}
      data-hide-nodes={hideNodes || undefined}
      data-hide-edges={hideEdges || undefined}
      data-show-anchors={showAnchors || undefined}
      data-hide-labels={showLabels ? undefined : true}
    >
      <ReactFlow
        nodes={nodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={fitView}
        defaultViewport={defaultViewport}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={panZoom || !animate}
        zoomOnScroll={panZoom || !animate}
        proOptions={{ hideAttribution: true }}
      >
        {showBackground ? (
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="rgb(29 27 24 / 6%)" />
        ) : null}
        {showControls ? <Controls showZoom={false} showInteractive={false} /> : null}
        {showMiniMap ? (
          <MiniMap
            nodeStrokeWidth={2}
            pannable
            zoomable
            style={{ background: "rgb(248 245 239 / 92%)" }}
          />
        ) : null}
        {children}
      </ReactFlow>
    </div>
  )
}
