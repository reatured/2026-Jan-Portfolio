/** Artly system graph, composed as three zones around the operator layer:
 * cloud (backend + database) on the left, the react-rviz-web 3D + data-visualization
 * workspace in the center, and the deployed robot fleet on the right. This is a logical
 * integration view: robot updates pass through Artly's existing Java backend APIs and
 * robot database after operator review and validation. Lingyi owned the editor/simulation
 * integration and delivery workflow, not the pre-existing company backend. */
export type ArchitectureNode = {
  id: string
  kicker: string
  title: string
  meta: string[]
  column: number
  y: number
  kind?: "hub" | "machine" | "external"
}
export type ArchitectureEdge = {
  from: string
  to: string
  label?: string
  kind?: "flow" | "cloud"
  fromPort?: Port
  toPort?: Port
}
type Port = "left" | "right" | "top" | "bottom"

export const architectureZones = [
  { id: "cloud", label: "Cloud", meta: "Existing company infrastructure", x: 16, y: 20, width: 272, height: 318 },
  { id: "workspace", label: "Workspace", meta: "Editor and simulation integration", x: 324, y: 20, width: 272, height: 318 },
  { id: "fleet", label: "Deployed fleet", meta: "Robot computer and store network", x: 632, y: 20, width: 272, height: 318 },
]

export const architectureNodes: ArchitectureNode[] = [
  { id: "keycloak", kicker: "Identity", title: "Keycloak", meta: ["Auth and permission gates"], column: 0, y: 92 },
  { id: "backend", kicker: "Company backend", title: "Java backend APIs", meta: ["Existing services + robot database"], column: 0, y: 218 },
  { id: "hub", kicker: "Runtime hub", title: "RobotContext", meta: ["Operator review and validation"], column: 1, y: 92, kind: "hub" },
  { id: "scene", kicker: "Visualization", title: "3D robot scene", meta: ["TypeScript · React · Three.js"], column: 1, y: 218 },
  { id: "r044", kicker: "Robot computer", title: "R-044 · Franka", meta: ["Validated updates · revision tracking"], column: 2, y: 92, kind: "machine" },
  { id: "store", kicker: "External boundary", title: "Store network", meta: ["Reference endpoint"], column: 2, y: 218, kind: "external" },
]

export const architectureEdges: ArchitectureEdge[] = [
  { from: "keycloak", to: "hub", label: "Auth" },
  { from: "backend", to: "hub", label: "Java APIs" },
  { from: "hub", to: "r044", label: "Via Java APIs" },
  { from: "hub", to: "scene", fromPort: "bottom", toPort: "top" },
  { from: "scene", to: "store", label: "Render" },
  { from: "r044", to: "store", kind: "cloud", fromPort: "bottom", toPort: "top" },
]

export const NODE_WIDTH = 232
export const NODE_HEIGHT = 82
export const GRAPH_WIDTH = 920
export const GRAPH_HEIGHT = 360
export const nodeX = (node: ArchitectureNode) => 36 + node.column * 308

type EdgePoints =
  | { vertical: true; x: number; y1: number; y2: number; loop: number }
  | { vertical: false; x1: number; x2: number; y1: number; y2: number }

function portPoint(node: ArchitectureNode, port: Port, fallback: Port): { x: number; y: number } {
  const x = nodeX(node)
  switch (port ?? fallback) {
    case "left": return { x, y: node.y + NODE_HEIGHT / 2 }
    case "right": return { x: x + NODE_WIDTH, y: node.y + NODE_HEIGHT / 2 }
    case "top": return { x: x + NODE_WIDTH / 2, y: node.y }
    case "bottom": return { x: x + NODE_WIDTH / 2, y: node.y + NODE_HEIGHT }
  }
}

function endpoints(from: ArchitectureNode, to: ArchitectureNode, edge: ArchitectureEdge): EdgePoints {
  const sameColumn = from.column === to.column
  const leftLoop = edge.fromPort === "left" && edge.toPort === "left"
  if (sameColumn && !edge.fromPort) {
    const x = nodeX(from) + NODE_WIDTH / 2
    const upward = to.y < from.y
    return { vertical: true, x, y1: upward ? from.y : from.y + NODE_HEIGHT, y2: upward ? to.y + NODE_HEIGHT : to.y, loop: 0 }
  }
  if (leftLoop) {
    const a = portPoint(from, "left", "left")
    const b = portPoint(to, "left", "left")
    return { vertical: true, x: a.x, y1: a.y, y2: b.y, loop: -34 }
  }
  const forward = to.column > from.column
  const a = portPoint(from, edge.fromPort ?? (forward ? "right" : "left"), forward ? "right" : "left")
  const b = portPoint(to, edge.toPort ?? (forward ? "left" : "right"), forward ? "left" : "right")
  return { vertical: false, x1: a.x, x2: b.x, y1: a.y, y2: b.y }
}

export function architectureEdgePath(from: ArchitectureNode, to: ArchitectureNode, edge: ArchitectureEdge) {
  const point = endpoints(from, to, edge)
  if (point.vertical) {
    const bow = point.x + point.loop
    return `M ${point.x} ${point.y1} C ${bow} ${point.y1}, ${bow} ${point.y2}, ${point.x} ${point.y2}`
  }
  const mid = point.x1 + (point.x2 - point.x1) / 2
  return `M ${point.x1} ${point.y1} C ${mid} ${point.y1}, ${mid} ${point.y2}, ${point.x2} ${point.y2}`
}

export function architectureEdgeLabel(from: ArchitectureNode, to: ArchitectureNode, edge: ArchitectureEdge) {
  const point = endpoints(from, to, edge)
  if (point.vertical) {
    const x = point.x + (point.loop ? point.loop - 6 : 8)
    const anchor = (point.loop ? "end" : "start") as "end" | "start"
    return { x, y: (point.y1 + point.y2) / 2 + 3, anchor, rotate: point.loop !== 0 }
  }
  const midX = (point.x1 + point.x2) / 2
  const midY = (point.y1 + point.y2) / 2
  // Narrow column gaps cannot hold a horizontal label without clipping a node.
  if (Math.abs(point.x2 - point.x1) < 80) return { x: midX - 4, y: midY, anchor: "middle" as const, rotate: true }
  return { x: midX, y: midY - 6, anchor: "middle" as const, rotate: false }
}
