export type TeleopNode = { id: string; kicker: string; title: string; meta: string[]; column: number; y: number; kind?: "hub" | "machine" | "external" }
export type TeleopEdge = { from: string; to: string; label?: string; kind?: "flow" | "cloud"; fromPort?: "left" | "right" | "top" | "bottom"; toPort?: "left" | "right" | "top" | "bottom" }

export const TELEOP_GRAPH_WIDTH = 920
export const TELEOP_GRAPH_HEIGHT = 440
export const TELEOP_NODE_WIDTH = 232
export const TELEOP_NODE_HEIGHT = 82
export const teleopZones = [
  { id: "operator", label: "Operator side", meta: "VR, camera, and glove inputs", x: 16, y: 20, width: 272, height: 400, image: "/projects/teleop/operator-side.png" },
  { id: "interface", label: "Integrated interface", meta: "Shared pose and control runtime", x: 324, y: 20, width: 272, height: 400, image: "/projects/teleop/integrated-interface.png" },
  { id: "remote", label: "Remote site", meta: "Drivers and physical hardware", x: 632, y: 20, width: 272, height: 400, image: "/projects/teleop/remote-site.png" },
]
export const teleopNodes: TeleopNode[] = [
  { id: "inputs", kicker: "Inputs", title: "VR + camera + glove", meta: ["Operator motion and hand pose"], column: 0, y: 220 },
  { id: "headset", kicker: "Feedback", title: "VR headset", meta: ["Live video display"], column: 0, y: 320 },
  { id: "control", kicker: "Control layer", title: "Unified control interface", meta: ["Pose mapping and calibration"], column: 1, y: 220, kind: "hub" },
  { id: "state", kicker: "Monitoring", title: "Live robot state", meta: ["Joint updates and diagnostics"], column: 1, y: 320 },
  { id: "drivers", kicker: "Drivers", title: "Arm + hand drivers", meta: ["Normalized commands"], column: 2, y: 220 },
  { id: "hardware", kicker: "Physical system", title: "2 arms + 2 hands", meta: ["Camera gimbal feedback"], column: 2, y: 320, kind: "machine" },
]
export const teleopEdges: TeleopEdge[] = [
  { from: "inputs", to: "control", label: "Pose" },
  { from: "control", to: "drivers", label: "Commands" },
  { from: "control", to: "state", fromPort: "bottom", toPort: "top" },
  { from: "drivers", to: "hardware", fromPort: "bottom", toPort: "top" },
  { from: "hardware", to: "state", label: "Telemetry", kind: "cloud", fromPort: "left", toPort: "right" },
  { from: "state", to: "headset", label: "Video + state", kind: "cloud", fromPort: "left", toPort: "right" },
]
export const teleopNodeX = (node: TeleopNode) => 36 + node.column * 308
type Point = { x: number; y: number }
function portPoint(node: TeleopNode, port: NonNullable<TeleopEdge["fromPort"]>): Point {
  const x = teleopNodeX(node)
  if (port === "left") return { x, y: node.y + TELEOP_NODE_HEIGHT / 2 }
  if (port === "top") return { x: x + TELEOP_NODE_WIDTH / 2, y: node.y }
  if (port === "bottom") return { x: x + TELEOP_NODE_WIDTH / 2, y: node.y + TELEOP_NODE_HEIGHT }
  return { x: x + TELEOP_NODE_WIDTH, y: node.y + TELEOP_NODE_HEIGHT / 2 }
}
export function teleopEdgePath(from: TeleopNode, to: TeleopNode, edge: TeleopEdge) {
  if (from.column === to.column && !edge.fromPort) {
    const x = teleopNodeX(from) + TELEOP_NODE_WIDTH / 2
    return `M ${x} ${from.y + TELEOP_NODE_HEIGHT} C ${x} ${from.y + TELEOP_NODE_HEIGHT + 24}, ${x} ${to.y - 24}, ${x} ${to.y}`
  }
  const forward = to.column > from.column
  const a = portPoint(from, edge.fromPort ?? (forward ? "right" : "left"))
  const b = portPoint(to, edge.toPort ?? (forward ? "left" : "right"))
  const mid = a.x + (b.x - a.x) / 2
  return `M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`
}
export function teleopEdgeLabel(from: TeleopNode, to: TeleopNode, edge: TeleopEdge) {
  const a = portPoint(from, edge.fromPort ?? (to.column > from.column ? "right" : "left"))
  const b = portPoint(to, edge.toPort ?? (to.column > from.column ? "left" : "right"))
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 6 }
}
