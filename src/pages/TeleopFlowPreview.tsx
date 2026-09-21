import TeleopReactFlowGraph from "@/components/TeleopReactFlowGraph"
import { layoutCanvas, teleopCanvas, IMG_W, IMG_H, GROUP_CENTER_Y } from "@/lib/teleop-flow-graph"

const laidOut = layoutCanvas(teleopCanvas)
const nodeById = new Map(laidOut.nodes.map(n => [n.id, n]))

function anchors(node: { inputs?: string[]; outputs?: string[] }) {
  const parts: string[] = []
  if (node.inputs?.length) parts.push(`in: ${node.inputs.join(", ")}`)
  if (node.outputs?.length) parts.push(`out: ${node.outputs.join(", ")}`)
  return parts.length ? ` · ${parts.join(" · ")}` : ""
}

export default function TeleopFlowPreview() {
  return (
    <div className="flow-preview">
      <aside className="flow-tree" aria-label="Graph hierarchy">
        <h2>Hierarchy</h2>
        <ul>
          <li>
            <strong>Canvas</strong> · teleop-architecture · {laidOut.width}×{laidOut.height}
            <ul>
              {teleopCanvas.sections.map(section => {
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
            <strong>Edges</strong> · {teleopCanvas.edges.length} · drawn between node anchors
            <ul>
              {teleopCanvas.edges.map((e, i) => (
                <li key={i}>
                  {e.from}.{e.fromAnchor} → {e.to}.{e.toAnchor}{e.label ? ` · "${e.label}"` : ""} · {e.kind ?? "flow"}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </aside>
      <main className="flow-canvas">
        <TeleopReactFlowGraph />
      </main>
    </div>
  )
}
