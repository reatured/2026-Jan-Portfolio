/* Teleop architecture graph — hierarchical model.
   Canvas → Sections → [Image, Title, Group] → Nodes.
   Sections are laid out left→right; every section's image shares one size
   and Y; titles share one Y; groups share one vertical center line.
   Edges are drawn between node anchor points declared in the model. */

export type AnchorSide = "left" | "right" | "top" | "bottom"

export type FlowNodeSpec = {
  id: string
  label: string
  detail?: string
  kind?: "hub" | "chip"
  size: { w: number; h: number }
  inputs?: AnchorSide[]
  outputs?: AnchorSide[]
}

export type FlowGroupSpec = {
  layout: "center" | "pairs"
  nodes: FlowNodeSpec[]
}

export type FlowSectionSpec = {
  id: string
  title: string
  subtitle: string
  image: string
  width: number
  group: FlowGroupSpec
}

export type FlowEdgeSpec = {
  from: string
  to: string
  fromAnchor: AnchorSide
  toAnchor: AnchorSide
  label?: string
  kind?: "flow" | "return"
  detail?: string[]
}

export type FlowCanvasSpec = {
  sections: FlowSectionSpec[]
  edges: FlowEdgeSpec[]
}

/* ── Layout constants ── */
export const SECTION_TOP = 0
export const SECTION_GAP = 40
export const IMG_MARGIN = 8
export const IMG_W = 344
export const IMG_H = Math.round(IMG_W * 9 / 16) // 194
export const HEADER_H = 253 // image margin + image + title + subtitle
export const GROUP_AREA_H = 320
export const SECTION_BOTTOM_PAD = 20
export const SECTION_H = HEADER_H + GROUP_AREA_H + SECTION_BOTTOM_PAD
export const GROUP_CENTER_Y = HEADER_H + GROUP_AREA_H / 2
const PAIR_COL_GAP = 80
const PAIR_ROW_GAP = 20

/* ── The model ── */
export const teleopCanvas: FlowCanvasSpec = {
  sections: [
    {
      id: "operator",
      title: "Operator side",
      subtitle: "VR, camera, and glove inputs",
      image: "/projects/teleop/operator-side.png",
      width: 360,
      group: {
        layout: "center",
        nodes: [
          { id: "vr", label: "Operator headset", detail: "Motion input and live video display",
            size: { w: 300, h: 100 }, outputs: ["right"], inputs: ["bottom"] },
        ],
      },
    },
    {
      id: "interface",
      title: "Integrated interface",
      subtitle: "Shared pose and control runtime",
      image: "/projects/teleop/integrated-interface-16x9.png",
      width: 360,
      group: {
        layout: "center",
        nodes: [
          { id: "interface", label: "Integrated Interface", detail: "Unified control layer", kind: "hub",
            size: { w: 240, h: 104 }, inputs: ["left"], outputs: ["right"] },
        ],
      },
    },
    {
      id: "remote",
      title: "Remote site",
      subtitle: "Drivers and physical hardware",
      image: "/projects/teleop/remote-site-16x9.png",
      width: 500,
      group: {
        layout: "pairs",
        nodes: [
          { id: "drv-arm",    label: "Arm Driver",      kind: "chip", size: { w: 150, h: 48 }, inputs: ["left"], outputs: ["right"] },
          { id: "arms",       label: "2 Robot Arms",                size: { w: 200, h: 84 }, inputs: ["left"] },
          { id: "drv-hand",   label: "Hand Driver",     kind: "chip", size: { w: 150, h: 48 }, inputs: ["left"], outputs: ["right"] },
          { id: "hands",      label: "2 Dexterous Hands",           size: { w: 200, h: 84 }, inputs: ["left"] },
          { id: "drv-gimbal", label: "Gimbal Driver",   kind: "chip", size: { w: 150, h: 48 }, inputs: ["left"], outputs: ["right"] },
          { id: "camera",     label: "Camera Gimbal", detail: "Head-tracked pan / tilt",
            size: { w: 200, h: 84 }, inputs: ["left"], outputs: ["bottom"] },
        ],
      },
    },
  ],
  edges: [
    { from: "vr", to: "interface", fromAnchor: "right", toAnchor: "left", label: "Pose data",
    detail: ["Gimbal coordinates · position & rotation", "Hand tracking · 20+ joint positions (no rotation)"] },
    { from: "interface", to: "drv-arm", fromAnchor: "right", toAnchor: "left" },
    { from: "interface", to: "drv-hand", fromAnchor: "right", toAnchor: "left" },
    { from: "interface", to: "drv-gimbal", fromAnchor: "right", toAnchor: "left" },
    { from: "drv-arm", to: "arms", fromAnchor: "right", toAnchor: "left" },
    { from: "drv-hand", to: "hands", fromAnchor: "right", toAnchor: "left" },
    { from: "drv-gimbal", to: "camera", fromAnchor: "right", toAnchor: "left" },
    { from: "camera", to: "vr", fromAnchor: "bottom", toAnchor: "bottom", kind: "return",
      label: "Video stream · direct to headset, initialized by the interface" },
  ],
}

/* ── Layout: derive absolute positions from the hierarchy ── */

export type LaidOutNode = FlowNodeSpec & { x: number; y: number; sectionId: string }
export type LaidOutSection = FlowSectionSpec & { x: number; y: number; height: number }
export type LaidOutCanvas = {
  width: number
  height: number
  sections: LaidOutSection[]
  nodes: LaidOutNode[]
}

export function layoutCanvas(spec: FlowCanvasSpec): LaidOutCanvas {
  const sections: LaidOutSection[] = []
  const nodes: LaidOutNode[] = []
  let x = 0
  for (const section of spec.sections) {
    sections.push({ ...section, x, y: SECTION_TOP, height: SECTION_H })
    const groupNodes = section.group.nodes
    if (section.group.layout === "pairs") {
      const colW = [0, 0] as [number, number]
      const rows: FlowNodeSpec[][] = []
      for (let i = 0; i < groupNodes.length; i += 2) rows.push(groupNodes.slice(i, i + 2))
      for (const row of rows) row.forEach((n, c) => { colW[c] = Math.max(colW[c]!, n.size.w) })
      const groupW = colW[0] + PAIR_COL_GAP + colW[1]
      const rowH = rows.map(row => Math.max(...row.map(n => n.size.h)))
      const groupH = rowH.reduce((a, b) => a + b, 0) + PAIR_ROW_GAP * (rows.length - 1)
      const gx = x + (section.width - groupW) / 2
      let gy = GROUP_CENTER_Y - groupH / 2
      rows.forEach((row, r) => {
        let nx = gx
        row.forEach((n, c) => {
          nodes.push({ ...n, sectionId: section.id, x: nx, y: gy + (rowH[r]! - n.size.h) / 2 })
          nx += colW[c]! + PAIR_COL_GAP
        })
        gy += rowH[r]! + PAIR_ROW_GAP
      })
    } else {
      const groupH = groupNodes.reduce((a, n) => a + n.size.h, 0) + PAIR_ROW_GAP * (groupNodes.length - 1)
      let gy = GROUP_CENTER_Y - groupH / 2
      for (const n of groupNodes) {
        nodes.push({ ...n, sectionId: section.id, x: x + (section.width - n.size.w) / 2, y: gy })
        gy += n.size.h + PAIR_ROW_GAP
      }
    }
    x += section.width + SECTION_GAP
  }
  return { width: x - SECTION_GAP, height: SECTION_H, sections, nodes }
}

export function anchorPoint(node: LaidOutNode, side: AnchorSide) {
  switch (side) {
    case "left": return { x: node.x, y: node.y + node.size.h / 2 }
    case "right": return { x: node.x + node.size.w, y: node.y + node.size.h / 2 }
    case "top": return { x: node.x + node.size.w / 2, y: node.y }
    case "bottom": return { x: node.x + node.size.w / 2, y: node.y + node.size.h }
  }
}
