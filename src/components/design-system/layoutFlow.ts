import { Position } from "@xyflow/react"
import type { FlowNodeData, FlowNodeType, FlowHandleSpec } from "./FlowNode"
import type { FlowEdgeData, FlowEdgeType } from "./FlowEdge"

/** node spec for layoutFlow — position and anchors are computed */
export type FlowLayoutNode = {
  id: string
  data: Omit<FlowNodeData, "handles">
  /** pin to a column (0-based). default: longest-path depth from a root.
      pin side-branch nodes to their parent's column to stack them vertically. */
  column?: number
}

export type FlowLayoutEdge = {
  id?: string
  source: string
  target: string
  data?: FlowEdgeData
}

export type FlowLayoutOptions = {
  /** distance between column left edges. default 240 */
  columnPitch?: number
  /** distance between node centres in a vertical stack. default 150 */
  rowPitch?: number
  /** estimated node size, used for centring + bounding-box math */
  nodeSize?: { width: number; height: number }
  /** top-left offset of the bounding box. default {0,0} */
  origin?: { x: number; y: number }
  /** centre the bounding box inside this size (added after origin) */
  centerIn?: { width: number; height: number }
}

export type FlowLayoutResult = {
  nodes: FlowNodeType[]
  edges: FlowEdgeType[]
  width: number
  height: number
}

type Side = "l" | "r" | "t" | "b"

const SIDE_POSITION: Record<Side, Position> = {
  l: Position.Left,
  r: Position.Right,
  t: Position.Top,
  b: Position.Bottom,
}

export function layoutFlow(
  nodeSpecs: FlowLayoutNode[],
  edgeSpecs: FlowLayoutEdge[],
  options: FlowLayoutOptions = {},
): FlowLayoutResult {
  const columnPitch = options.columnPitch ?? 240
  const rowPitch = options.rowPitch ?? 150
  const nodeW = options.nodeSize?.width ?? 170
  const nodeH = options.nodeSize?.height ?? 76

  const ids = nodeSpecs.map(n => n.id)
  const specById = new Map(nodeSpecs.map(n => [n.id, n]))
  const incoming = new Map<string, FlowLayoutEdge[]>(ids.map(id => [id, []]))
  const outgoing = new Map<string, FlowLayoutEdge[]>(ids.map(id => [id, []]))
  const edges = edgeSpecs.filter(e => specById.has(e.source) && specById.has(e.target))
  for (const e of edges) {
    incoming.get(e.target)!.push(e)
    outgoing.get(e.source)!.push(e)
  }

  /* ---- columns: longest-path depth, honouring explicit pins ---- */
  const depthMemo = new Map<string, number>()
  const visiting = new Set<string>()
  const depthOf = (id: string): number => {
    const memo = depthMemo.get(id)
    if (memo != null) return memo
    if (visiting.has(id)) return 0
    visiting.add(id)
    const ins = incoming.get(id) ?? []
    const d = ins.length === 0 ? 0 : Math.max(...ins.map(e => depthOf(e.source) + 1))
    visiting.delete(id)
    depthMemo.set(id, d)
    return d
  }
  let maxDepth = 0
  for (const id of ids) maxDepth = Math.max(maxDepth, depthOf(id))
  const columnOf = (id: string): number => {
    const spec = specById.get(id)!
    if (spec.column != null) return spec.column
    const connected = incoming.get(id)!.length + outgoing.get(id)!.length > 0
    return connected ? depthOf(id) : maxDepth
  }

  const columns = new Map<number, string[]>()
  for (const id of ids) {
    const col = columnOf(id)
    if (!columns.has(col)) columns.set(col, [])
    columns.get(col)!.push(id)
  }
  const sortedCols = [...columns.keys()].sort((a, b) => a - b)
  /* pins can skip raw depth values — compress to occupied-column ranks */
  const colRank = new Map(sortedCols.map((c, i) => [c, i]))
  const rankOf = (id: string) => colRank.get(columnOf(id))!

  /* ---- y centres: forward barycentre per column.
     a node's ideal centre is the mean of its sources' centres, so a vertical
     group of sources ends up centred on its shared target. ---- */
  const centerY = new Map<string, number>()
  for (const col of sortedCols) {
    const members = columns.get(col)!
    if (col === sortedCols[0]) {
      members.forEach((id, i) => centerY.set(id, (i - (members.length - 1) / 2) * rowPitch))
      continue
    }
    const barycentre = (id: string): number | undefined => {
      const placed = incoming.get(id)!.filter(e => centerY.has(e.source))
      if (placed.length === 0) return undefined
      return placed.reduce((s, e) => s + centerY.get(e.source)!, 0) / placed.length
    }
    const pending = [...members]
    let prev: number | undefined
    while (pending.length > 0) {
      const ready = pending.filter(id =>
        incoming.get(id)!.every(e => columnOf(e.source) !== col || centerY.has(e.source)))
      const pool = ready.length > 0 ? ready : pending
      let pick = pool[0]!
      let pickBary = barycentre(pick) ?? Number.POSITIVE_INFINITY
      for (const id of pool) {
        const b = barycentre(id) ?? Number.POSITIVE_INFINITY
        if (b < pickBary) {
          pick = id
          pickBary = b
        }
      }
      const ideal = Number.isFinite(pickBary) ? pickBary : prev != null ? prev + rowPitch : 0
      const y = prev != null ? Math.max(ideal, prev + rowPitch) : ideal
      centerY.set(pick, y)
      prev = y
      pending.splice(pending.indexOf(pick), 1)
    }
  }

  /* ---- normalize bounding box to origin / centerIn ---- */
  const centres = [...centerY.values()]
  const minCentre = Math.min(...centres)
  const maxCentre = Math.max(...centres)
  const width = (sortedCols.length - 1) * columnPitch + nodeW
  const height = maxCentre - minCentre + nodeH
  let offsetX = options.origin?.x ?? 0
  let offsetY = options.origin?.y ?? 0
  if (options.centerIn) {
    offsetX += Math.max(0, (options.centerIn.width - width) / 2)
    offsetY += Math.max(0, (options.centerIn.height - height) / 2)
  }

  /* ---- anchors: one per connection, spread evenly along their side ---- */
  type Draft = { edgeIndex: number; role: "s" | "t"; coord: number }
  const drafts = new Map<string, Map<Side, Draft[]>>()
  const draft = (nodeId: string, side: Side, d: Draft) => {
    if (!drafts.has(nodeId)) drafts.set(nodeId, new Map())
    const sides = drafts.get(nodeId)!
    if (!sides.has(side)) sides.set(side, [])
    sides.get(side)!.push(d)
  }
  const srcSide: Side[] = []
  const tgtSide: Side[] = []

  edges.forEach((e, i) => {
    const sc = columnOf(e.source)
    const tc = columnOf(e.target)
    let ss: Side
    let ts: Side
    if (tc > sc) {
      ss = "r"; ts = "l"
    } else if (tc < sc) {
      ss = "l"; ts = "r"
    } else {
      const sy = centerY.get(e.source)!
      const ty = centerY.get(e.target)!
      if (sy <= ty) { ss = "b"; ts = "t" } else { ss = "t"; ts = "b" }
    }
    srcSide[i] = ss
    tgtSide[i] = ts
    const along = (side: Side, nodeId: string) =>
      side === "l" || side === "r" ? centerY.get(nodeId)! : rankOf(nodeId) * columnPitch
    draft(e.source, ss, { edgeIndex: i, role: "s", coord: along(ss, e.target) })
    draft(e.target, ts, { edgeIndex: i, role: "t", coord: along(ts, e.source) })
  })

  const handlesByNode = new Map<string, FlowHandleSpec[]>()
  const srcHandle: string[] = []
  const tgtHandle: string[] = []
  for (const [nodeId, sides] of drafts) {
    const list: FlowHandleSpec[] = []
    for (const [side, ds] of sides) {
      ds.sort((a, b) => a.coord - b.coord || a.edgeIndex - b.edgeIndex)
      ds.forEach((d, i) => {
        const id = `${side}${d.role}-${i}`
        list.push({
          id,
          type: d.role === "s" ? "source" : "target",
          position: SIDE_POSITION[side],
          at: (i + 1) / (ds.length + 1),
        })
        if (d.role === "s") srcHandle[d.edgeIndex] = id
        else tgtHandle[d.edgeIndex] = id
      })
    }
    handlesByNode.set(nodeId, list)
  }

  const nodes: FlowNodeType[] = nodeSpecs.map(spec => ({
    id: spec.id,
    type: "ds-node",
    position: {
      x: offsetX + rankOf(spec.id) * columnPitch,
      y: offsetY + centerY.get(spec.id)! - minCentre,
    },
    data: { ...spec.data, handles: handlesByNode.get(spec.id) ?? [] },
  }))
  const laidEdges: FlowEdgeType[] = edges.map((e, i) => ({
    id: e.id ?? `${e.source}->${e.target}:${i}`,
    source: e.source,
    target: e.target,
    sourceHandle: srcHandle[i],
    targetHandle: tgtHandle[i],
    type: "ds-edge",
    data: e.data,
  }))

  return { nodes, edges: laidEdges, width, height }
}
