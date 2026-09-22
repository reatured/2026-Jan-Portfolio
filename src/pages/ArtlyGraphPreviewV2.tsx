import ArtlyReactFlowGraph from "@/components/ArtlyReactFlowGraph"
import { layoutCanvas, IMG_W, IMG_H, GROUP_CENTER_Y } from "@/lib/teleop-flow-graph"
import { artlyCanvas } from "@/lib/artly-flow-graph"

const laidOut = layoutCanvas(artlyCanvas)
const nodeById = new Map(laidOut.nodes.map(n => [n.id, n]))

function anchors(node: { inputs?: string[]; outputs?: string[] }) {
  const parts: string[] = []
  if (node.inputs?.length) parts.push(`in: ${node.inputs.join(", ")}`)
  if (node.outputs?.length) parts.push(`out: ${node.outputs.join(", ")}`)
  return parts.length ? ` · ${parts.join(" · ")}` : ""
}

export default function ArtlyGraphPreviewV2() {
  return (
    <div className="flow-preview">
      <aside className="flow-tree" aria-label="Graph hierarchy">
        <h2>Hierarchy</h2>
        <p>
          V2 · React Flow, shared layout engine.<br />
          Section art not supplied yet — each header keeps its reserved {IMG_W}×{IMG_H} box.<br />
          <a href="/preview/artly-graph">V1 · hand-plotted SVG</a>
        </p>
        <ul>
          <li>
            <strong>Canvas</strong> · artly-architecture · {laidOut.width}×{laidOut.height}
            <ul>
              {artlyCanvas.sections.map(section => {
                const laid = laidOut.sections.find(s => s.id === section.id)!
                return (
                  <li key={section.id}>
                    <strong>Section</strong> · {section.title} · {section.width}×{laid.height} @ ({laid.x}, {laid.y})
                    <ul>
                      <li>Header group · image + title + subtitle · centered in section ({IMG_W}×{IMG_H})</li>
                      <li>
                        <strong>Group</strong> · layout: {section.group.layout} · {section.group.nodes.length} node{section.group.nodes.length > 1 ? "s" : ""} · center y = {Math.round(GROUP_CENTER_Y)}
                        <ul>
                          {section.group.nodes.map(n => {
                            const ln = nodeById.get(n.id)!
                            return (
                              <li key={n.id}>
                                Node · {n.label}{n.kind ? ` (${n.kind})` : ""} · {n.size.w}×{n.size.h} @ ({Math.round(ln.x)}, {Math.round(ln.y)}){anchors(n)}
                              </li>
                            )
                          })}
                        </ul>
                      </li>
                    </ul>
                  </li>
                )
              })}
            </ul>
          </li>
          <li>
            <strong>Edges</strong> · {artlyCanvas.edges.length} · drawn between node anchors
            <ul>
              {artlyCanvas.edges.map((e, i) => (
                <li key={i}>
                  {e.from}.{e.fromAnchor} → {e.to}.{e.toAnchor}{e.label ? ` · "${e.label}"` : ""} · {e.kind ?? "flow"}{e.detail ? ` · payload rows: ${e.detail.length}` : ""}
                  {e.detail && <ul>{e.detail.map(row => <li key={row}>{row}</li>)}</ul>}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </aside>
      <main className="flow-canvas">
        <ArtlyReactFlowGraph />
      </main>
    </div>
  )
}
