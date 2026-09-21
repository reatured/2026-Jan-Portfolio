import { useMemo, useState } from "react"
import { ReactFlowProvider, type Node, type Edge } from "@xyflow/react"
import { FlowChart } from "@/components/design-system"
import type { FlowNodeData } from "@/components/design-system/FlowNode"
import type { FlowEdgeData } from "@/components/design-system/FlowEdge"
import "@/design-system.css"

/* ============================================================
   Design tokens data
   ============================================================ */
const tokens = [
  { name: "page", hex: "#f8f5ef", role: "warm editorial ground" },
  { name: "paper", hex: "#fffdf9", role: "primary card surface" },
  { name: "inset", hex: "#f5f5f7", role: "project and graph wells" },
  { name: "accent", hex: "#ff6b1a", role: "selection and active paths" },
  { name: "ink", hex: "#1d1b18", role: "primary text and dark hub" },
  { name: "body", hex: "#514d47", role: "reading copy" },
  { name: "muted", hex: "#75716a", role: "secondary metadata" },
  { name: "line", hex: "#ded8cf", role: "warm hairline rules" },
]

/* ============================================================
   Motion demo graph: 4 nodes + 4 edges with staggered entrance
   ============================================================ */
function makeMotionNodes(animate: boolean): Node[] {
  const nodes: Node<FlowNodeData>[] = [
    {
      id: "a",
      type: "ds-node",
      position: { x: 40, y: 130 },
      data: { kicker: "input", title: "brief", meta: "ready", delay: animate ? 80 : undefined },
    },
    {
      id: "b",
      type: "ds-node",
      position: { x: 260, y: 130 },
      data: { kicker: "runtime", title: "planner", meta: "builds route", kind: "hub", delay: animate ? 360 : undefined },
    },
    {
      id: "c",
      type: "ds-node",
      position: { x: 480, y: 130 },
      data: { kicker: "output", title: "render", meta: "in progress", kind: "machine", delay: animate ? 660 : undefined },
    },
    {
      id: "d",
      type: "ds-node",
      position: { x: 260, y: 280 },
      data: { kicker: "external", title: "handoff", meta: "reference endpoint", kind: "external", delay: animate ? 960 : undefined },
    },
  ]
  return nodes
}

function makeMotionEdges(animate: boolean): Edge<FlowEdgeData>[] {
  const edges: Edge<FlowEdgeData>[] = [
    { id: "ab", source: "a", target: "b", sourceHandle: "right-s", targetHandle: "left-t", type: "ds-edge", data: { delay: animate ? 520 : undefined } },
    { id: "bc", source: "b", target: "c", sourceHandle: "right-s", targetHandle: "left-t", type: "ds-edge", data: { delay: animate ? 820 : undefined } },
    { id: "bd", source: "b", target: "d", sourceHandle: "bottom-s", targetHandle: "top-t", type: "ds-edge", data: { delay: animate ? 1120 : undefined } },
    { id: "dc", source: "d", target: "c", sourceHandle: "right-s", targetHandle: "left-t", type: "ds-edge", data: { kind: "callout", delay: animate ? 1320 : undefined } },
  ]
  return edges
}

/* ============================================================
   Architecture demo: 3-zone cloud-to-robot diagram
   ============================================================ */
function makeArchNodes(): Node<FlowNodeData>[] {
  const nodes: Node<FlowNodeData>[] = [
    {
      id: "keycloak", type: "ds-node",
      position: { x: 30, y: 80 },
      data: { kicker: "identity", title: "keycloak", meta: "auth and permissions" },
    },
    {
      id: "backend", type: "ds-node",
      position: { x: 30, y: 230 },
      data: { kicker: "service", title: "robot service", meta: "tasks and telemetry" },
    },
    {
      id: "hub", type: "ds-node",
      position: { x: 310, y: 80 },
      data: { kicker: "runtime hub", title: "robot context", meta: "pose and joint state", kind: "hub" },
    },
    {
      id: "scene", type: "ds-node",
      position: { x: 310, y: 230 },
      data: { kicker: "visualization", title: "robot scene", meta: "model and overlays" },
    },
    {
      id: "r044", type: "ds-node",
      position: { x: 590, y: 80 },
      data: { kicker: "robot computer", title: "store robot", meta: "deployment target", kind: "machine" },
    },
    {
      id: "store", type: "ds-node",
      position: { x: 590, y: 230 },
      data: { kicker: "boundary", title: "store network", meta: "reference endpoint", kind: "external" },
    },
  ]
  return nodes
}

function makeArchEdges(): Edge<FlowEdgeData>[] {
  const edges: Edge<FlowEdgeData>[] = [
    { id: "keycloak-hub", source: "keycloak", target: "hub", sourceHandle: "right-s", targetHandle: "left-t", type: "ds-edge" },
    { id: "backend-hub", source: "backend", target: "hub", sourceHandle: "right-s", targetHandle: "left-t", type: "ds-edge", data: { label: "tasks + telemetry" } },
    { id: "hub-r044", source: "hub", target: "r044", sourceHandle: "right-s", targetHandle: "left-t", type: "ds-edge", data: { label: "deploy" } },
    { id: "hub-scene", source: "hub", target: "scene", sourceHandle: "bottom-s", targetHandle: "top-t", type: "ds-edge" },
    { id: "scene-r044", source: "scene", target: "r044", sourceHandle: "right-s", targetHandle: "bottom-t", type: "ds-edge", data: { kind: "boundary" } },
  ]
  return edges
}

/* ============================================================
   Page
   ============================================================ */
export default function DesignSystemPage() {
  const [motionKey, setMotionKey] = useState(0)

  const motionNodes = useMemo(() => makeMotionNodes(true), [motionKey])
  const motionEdges = useMemo(() => makeMotionEdges(true), [motionKey])
  const archNodes = useMemo(() => makeArchNodes(), [])
  const archEdges = useMemo(() => makeArchEdges(), [])

  return (
    <div style={{ background: "linear-gradient(180deg, #fbf7f1 0%, #f8f5ef 44%, #f4f2ee 100%)", minHeight: "100vh", color: "#1d1b18", fontFamily: '"Archivo", sans-serif' }}>
      {/* ======== TOKENS ======== */}
      <section className="ds-section ds-page">
        <div className="ds-section-head">
          <h2>design tokens</h2>
          <p>eight semantic surface roles replace the old poster / project split. the palette keeps the portfolio warmth, but surfaces cool slightly for dense project content.</p>
        </div>
        <div className="ds-swatch-grid">
          {tokens.map(t => (
            <div className="ds-swatch" key={t.name}>
              <div className="ds-swatch-color" style={{ background: t.hex }} />
              <div className="ds-swatch-body">
                <b>{t.name}</b>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======== COMPONENTS ======== */}
      <section className="ds-section ds-page">
        <div className="ds-section-head">
          <h2>component library</h2>
          <p>every reusable part shares the same paper, line, radius, focus, and motion behavior. each has one job and reads as part of the same family.</p>
        </div>

        <div className="ds-comp-grid">
          {/* buttons */}
          <article className="ds-comp-card">
            <h3>buttons</h3>
            <p>primary actions use orange only when they are the main next step. quiet actions stay in the background. all targets are 44px minimum.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button className="ds-btn ds-btn--primary" type="button">open project</button>
              <button className="ds-btn ds-btn--quiet" type="button">view notes</button>
              <button className="ds-btn ds-btn--icon" type="button" aria-label="expand">↗</button>
            </div>
          </article>

          {/* segmented control */}
          <article className="ds-comp-card">
            <h3>segmented control</h3>
            <p>peer views inside one panel. the active segment floats on paper, consistent with story chapters and chart filters.</p>
            <div className="ds-segment-group" role="group" aria-label="demo view">
              <button type="button" aria-pressed="true">overview</button>
              <button type="button" aria-pressed="false">system</button>
              <button type="button" aria-pressed="false">media</button>
            </div>
          </article>

          {/* input */}
          <article className="ds-comp-card">
            <h3>input field</h3>
            <p>small readable label, paper surface, orange focus ring consistent with every other interactive element.</p>
            <label style={{ display: "block", marginBottom: 6, color: "#75716a", fontSize: 12, fontFamily: "system-ui, sans-serif" }}>filter projects</label>
            <input className="ds-input" defaultValue="robotics" />
          </article>

          {/* metrics */}
          <article className="ds-comp-card">
            <h3>metrics</h3>
            <p>small numbers in paper cells. their role is proof, not decoration.</p>
            <div className="ds-metric-row">
              <div><b>30</b><span>projects</span></div>
              <div><b>159</b><span>media items</span></div>
              <div><b>4</b><span>focus areas</span></div>
              <div><b>12</b><span>skills</span></div>
            </div>
          </article>

          {/* timeline */}
          <article className="ds-comp-card">
            <h3>timeline</h3>
            <p>use for process notes, milestones, or build progress. dots mean sequence, not decoration.</p>
            <ul className="ds-timeline">
              <li><i /><span><b>map the system</b><span>name the real surfaces and states before adding styling.</span></span></li>
              <li><i /><span><b>wire the component</b><span>connect it to shared tokens before adding variants.</span></span></li>
              <li><i /><span><b>validate behavior</b><span>check focus, reduced motion, and narrow screens.</span></span></li>
            </ul>
          </article>

          {/* status note */}
          <article className="ds-comp-card">
            <h3>status note</h3>
            <p>quiet tinted note for explanation. guides without interrupting the page.</p>
            <div className="ds-notice">this system has one accent, so status should also use words, shape, and placement instead of relying on color alone.</div>
          </article>
        </div>
      </section>

      {/* ======== MOTION DEMO with React Flow ======== */}
      <section className="ds-section ds-page">
        <div className="ds-section-head">
          <h2>chart motion</h2>
          <div>
            <span className="ds-eyebrow">built with @xyflow/react</span>
            <p>nodes enter in a short sequence, edges draw after their endpoints appear. the bezier handles auto-route — no manual coordinate math. replay the animation to see the staggered entrance.</p>
            <button
              className="ds-btn ds-btn--primary"
              style={{ marginTop: 14 }}
              onClick={() => setMotionKey(k => k + 1)}
            >
              replay animation
            </button>
          </div>
        </div>

        <ReactFlowProvider key={motionKey}>
          <FlowChart
            initialNodes={motionNodes}
            initialEdges={motionEdges}
            animate
          />
        </ReactFlowProvider>

        {/* sequence notes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginTop: 18 }}>
          {[
            { seq: "01", title: "orient", body: "the starting node enters first, anchoring the reader before any edge appears." },
            { seq: "02", title: "connect", body: "edges draw only after both related surfaces are visible, following the natural left-to-right flow." },
            { seq: "03", title: "annotate", body: "notes enter last, with a small pop, because they explain rather than define the structure." },
          ].map(n => (
            <div key={n.seq} style={{ padding: "12px 16px", border: "1px solid #ded8cf", borderRadius: 10, background: "rgb(255 253 249 / 86%)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ display: "inline-grid", placeItems: "center", width: 20, height: 20, borderRadius: "50%", background: "#ff6b1a", color: "#1d1b18", fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, fontWeight: 600 }}>{n.seq}</span>
                <b style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.03em", color: "#75716a" }}>{n.title}</b>
              </div>
              <p style={{ margin: 0, color: "#514d47", fontSize: 13, lineHeight: 1.55 }}>{n.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, padding: "12px 16px", border: "1px solid #ded8cf", borderRadius: 9, background: "rgb(248 245 239 / 78%)" }}>
          <b style={{ display: "block", marginBottom: 8, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "#75716a" }}>timing</b>
          <span style={{ display: "block", color: "#514d47", fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, lineHeight: 1.85 }}>
            80–140 ms  between nodes<br />
            420–720 ms  per pop<br />
            no looping  unless the chart is explicitly live
          </span>
        </div>
      </section>

      {/* ======== ARCHITECTURE DIAGRAM with React Flow ======== */}
      <section className="ds-section ds-page">
        <div className="ds-section-head">
          <h2>architecture diagram</h2>
          <div>
            <span className="ds-eyebrow">same components, different layout</span>
            <p>the cloud-to-robot system rebuilt with the same <code>.ds-node</code> and <code>.ds-edge</code> components. three zones, six nodes, five edges — identical component classes, completely different story.</p>
          </div>
        </div>

        <div className="ds-chart-frame">
          <div className="ds-chart-head">
            <span className="ds-chart-eyebrow">architecture map</span>
            <h3 className="ds-chart-title">cloud to deployed robot</h3>
            <p className="ds-chart-summary">identity, robot data, operator controls, and store endpoints in one traceable view.</p>
          </div>
          <ReactFlowProvider>
            <FlowChart
              initialNodes={archNodes}
              initialEdges={archEdges}
              fitView
            />
          </ReactFlowProvider>
          <p className="ds-chart-caption">one component system, one node language, one edge vocabulary.</p>
        </div>
      </section>

      {/* ======== MOTION PRIMITIVES ======== */}
      <section className="ds-section ds-page">
        <div className="ds-section-head">
          <h2>motion primitives</h2>
          <p>three animation primitives cover every chart interaction. apply them via CSS classes — no JavaScript animation library needed. all respect <code>prefers-reduced-motion</code>.</p>
        </div>

        <div className="ds-comp-grid">
          <article className="ds-comp-card">
            <h3>node pop</h3>
            <p><code>.ds-anim-node</code> — spring-based scale+translate entrance. set <code>--delay</code> in ms. 720ms duration, slight overshoot.</p>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: "#6e6e73", lineHeight: 1.8 }}>
              @keyframes ds-node-pop {"{"}<br />
              &nbsp;&nbsp;0%  &#123; opacity:0; scale:0.86; translateY:16px &#125;<br />
              &nbsp;&nbsp;58% &#123; opacity:1; scale:1.045; translateY:-2px &#125;<br />
              &nbsp;&nbsp;100%&#123; opacity:1; scale:1; translateY:0 &#125;<br />
              {"}"}
            </div>
          </article>

          <article className="ds-comp-card">
            <h3>edge draw</h3>
            <p><code>.ds-anim-edge</code> — stroke-dashoffset reveals the bezier path over time. set <code>--edge-len</code> to the path length.</p>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: "#6e6e73", lineHeight: 1.8 }}>
              @keyframes ds-edge-draw {"{"}<br />
              &nbsp;&nbsp;from &#123; stroke-dashoffset: var(--edge-len) &#125;<br />
              &nbsp;&nbsp;to &nbsp;&nbsp;&#123; stroke-dashoffset: 0 &#125;<br />
              {"}"}
            </div>
          </article>

          <article className="ds-comp-card">
            <h3>fade up</h3>
            <p><code>.ds-anim-fade</code> — simple opacity+translateY for labels, captions, and notes. 560ms ease, no bounce.</p>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: "#6e6e73", lineHeight: 1.8 }}>
              @keyframes ds-fade-up {"{"}<br />
              &nbsp;&nbsp;from &#123; opacity:0; translateY:14px &#125;<br />
              &nbsp;&nbsp;to &nbsp;&nbsp;&#123; opacity:1; translateY:0 &#125;<br />
              {"}"}
            </div>
          </article>
        </div>

        <div className="ds-notice" style={{ marginTop: 18 }}>
          all motion primitives are gated behind <code>@media (prefers-reduced-motion: no-preference)</code>. when reduced motion is active, elements appear immediately at their final position — no animation, no delay.
        </div>
      </section>

      {/* ======== USAGE ======== */}
      <section className="ds-section ds-page" style={{ paddingBottom: 80 }}>
        <div className="ds-section-head">
          <h2>how to use</h2>
          <p>import <code>src/design-system.css</code> once in your app. then use the component classes anywhere — they compose with Tailwind and respect the existing design tokens.</p>
        </div>
        <div style={{ padding: 24, border: "1px solid #ded8cf", borderRadius: 12, background: "rgb(255 253 249 / 86%)", fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, lineHeight: 1.9, whiteSpace: "pre", overflowX: "auto", color: "#1d1b18" }}>
{`// 1. Import the stylesheet (once, in main.tsx or App.tsx)
import "@/design-system.css"

// 2. Use React Flow components
import { ReactFlowProvider } from "@xyflow/react"
import { FlowChart } from "@/components/design-system"
import type { FlowNodeData } from "@/components/design-system/FlowNode"
import type { FlowEdgeData } from "@/components/design-system/FlowEdge"

// 3. Define your graph as typed data
const nodes: Node<FlowNodeData>[] = [
  { id: "a", type: "ds-node", position: {x:0,y:0},
    data: { kicker:"input", title:"brief", meta:"ready" }},
]
const edges: Edge<FlowEdgeData>[] = [
  { id: "ab", source:"a", target:"b", type:"ds-edge",
    sourceHandle:"right", targetHandle:"left" },
]

// 4. Render — handles auto-route
<ReactFlowProvider>
  <FlowChart initialNodes={nodes} initialEdges={edges} />
</ReactFlowProvider>`}
        </div>
      </section>
    </div>
  )
}