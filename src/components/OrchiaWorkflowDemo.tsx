import { useEffect, useId, useRef, useState } from "react"
import { useInView, useIsPresent, useReducedMotion } from "framer-motion"
import {
  GRAPH_HEIGHT, GRAPH_WIDTH, NODE_WIDTH, nodeHeight, nodeX,
  productionEdgePath, productionEdges, productionNodes, productionStages,
} from "@/lib/orchia-production-graph"

const byId = new Map(productionNodes.map(node => [node.id, node]))

export default function OrchiaWorkflowDemo() {
  const [step, setStep] = useState(-1)
  const [playing, setPlaying] = useState(true)
  const [manual, setManual] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [fitted, setFitted] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const canvas = useRef<HTMLDivElement>(null)
  const inView = useInView(canvas, { amount: 0.05 })
  const present = useIsPresent()
  const reduced = useReducedMotion()
  const id = useId()
  const total = productionStages.length
  const visibleStep = reduced && !manual ? total : step
  const finished = visibleStep >= total
  const running = playing && inView && pageVisible && present && !reduced && !finished
  const status = (stage: number) => visibleStep > stage ? "done" : visibleStep === stage ? "running" : "ready"

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => setStep(value => value + 1), step < 0 ? 450 : 1000)
    return () => window.clearTimeout(timer)
  }, [running, step])

  function togglePlayback() {
    if (reduced) {
      setManual(true)
      setStep(finished ? 0 : visibleStep + 1)
      setPlaying(false)
    } else if (finished) {
      setStep(-1)
      setPlaying(true)
    } else setPlaying(value => !value)
  }

  function fit() {
    setFitted(true)
    setZoom(1)
    canvas.current?.scrollTo({ left: 0, behavior: "instant" })
  }

  return (
    <section className="orchia-workflow-demo" data-step={visibleStep} data-running={running} aria-labelledby={`${id}-heading`}>
      <div className="orchia-section-heading">
        <div><h4 id={`${id}-heading`}>One workflow. Parallel production.</h4><p>Shared references keep every shot connected.</p></div>
        <a className="orchia-screenshot-link" href="/projects/orchia/production-workflow-reference.png" target="_blank" rel="noopener noreferrer">View full workflow ↗</a>
      </div>
      <div className="orchia-demo-controls">
        <span role="status">{finished ? "Production complete" : `${Math.max(0, visibleStep + 1)} / ${total} · ${productionStages[visibleStep] ?? "Ready to run"}`}</span>
        <button type="button" onClick={togglePlayback}>{reduced ? finished ? "Restart demo" : "Next step" : finished ? "Replay" : playing ? "Pause" : "Play"}</button>
        <div className="orchia-graph-zoom" role="group" aria-label="Workflow zoom">
          <button type="button" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => { setFitted(false); setZoom(value => Math.max(1, value - .5)) }}>−</button>
          <button type="button" onClick={fit} aria-label="Fit workflow">Fit</button>
          <button type="button" aria-label="Zoom in" disabled={zoom >= 2} onClick={() => { setFitted(false); setZoom(value => Math.min(2, value + .5)) }}>+</button>
        </div>
      </div>
      <div ref={canvas} className="orchia-horizontal-canvas" tabIndex={0} role="group" aria-label="Horizontal workflow. Scroll sideways or use left and right arrow keys to explore."
        onKeyDown={event => { if (event.target === event.currentTarget && (event.key === "ArrowLeft" || event.key === "ArrowRight")) { event.preventDefault(); event.currentTarget.scrollBy({ left: event.key === "ArrowRight" ? 180 : -180, behavior: reduced ? "instant" : "smooth" }) } }}>
        <div className="orchia-horizontal-stage" style={{ width: `${zoom * 100}%`, minWidth: fitted ? undefined : `${zoom * 1100}px` }}>
          <svg viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`} className="orchia-horizontal-graph" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
            <title id={`${id}-title`}>Orchia's reference and shot production workflow</title>
            <desc id={`${id}-desc`}>A condensed four-cut example. Context branches into reference and story segmentation. Generated references enter a shared registry and Character Bible. Each cut runs left to right through a video prompt, a first frame, and a video request, then converges into assembly.</desc>
            <defs>
              <marker id={`${id}-arrow`} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0L5 2.5L0 5Z" fill="context-stroke" /></marker>
            </defs>
            <rect className="orchia-reference-group" x="372" y="20" width="182" height="458" rx="5" />
            <text className="orchia-graph-group-label" x="386" y="43">Shared references</text>
            {[0, 1, 2, 3].map(cut => <g key={cut}>
              <rect className="orchia-shot-group" x="928" y={50 + cut * 110} width="552" height="105" rx="5" />
              <text className="orchia-graph-cut-label" x="936" y={67 + cut * 110}>{String(cut + 1).padStart(2, "0")}</text>
            </g>)}
            {productionEdges.map(([from, to]) => {
              const source = byId.get(from)!, target = byId.get(to)!
              return <path key={`${from}-${to}`} d={productionEdgePath(source, target)}
                className="orchia-production-edge" data-status={status(target.stage)} markerEnd={`url(#${id}-arrow)`} />
            })}
            {productionNodes.map(node => {
              const nodeStatus = status(node.stage)
              return <g key={node.id} transform={`translate(${nodeX(node)} ${node.y})`} className="orchia-production-node" data-node={node.id} data-status={nodeStatus}>
                <rect width={NODE_WIDTH} height={nodeHeight(node)} rx="4" />
                <circle cx="12" cy="13" r="3" />
                <text className="orchia-production-status" x="22" y="17">{nodeStatus === "done" ? "Complete" : nodeStatus === "running" ? "Running" : "Ready"}</text>
                {node.label.map((line, index) => <text key={line} className="orchia-production-title" x="10" y={node.image ? 37 : 41 + index * 21}>{line}</text>)}
                {node.image && <image href={node.image} x="10" y="46" width="130" height="46" preserveAspectRatio="xMidYMid slice" />}
                {node.column > 0 && <circle className="orchia-node-port" cx="0" cy={nodeHeight(node) / 2} r="3.5" />}
                {node.column < 9 && <circle className="orchia-node-port" cx={NODE_WIDTH} cy={nodeHeight(node) / 2} r="3.5" />}
              </g>
            })}
          </svg>
        </div>
      </div>
      <p className="orchia-workflow-caption">Four-shot demo · Scroll sideways to explore. Feedback carries into the next version.</p>
    </section>
  )
}
