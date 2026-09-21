import { memo } from "react"
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"

/** one anchor per connection — produced by layoutFlow, rendered by FlowNode */
export type FlowHandleSpec = {
  id: string
  type: "source" | "target"
  /** side of the node the anchor sits on */
  position: Position
  /** 0–1 fraction along that side (0.5 = centred) */
  at: number
}

export type FlowNodeData = {
  kicker: string
  title: string
  meta?: string
  /** node variant: standard (default), hub (dark), machine (warm), external (dashed) */
  kind?: "hub" | "machine" | "external"
  /** animation delay in ms */
  delay?: number
  /** explicit anchors, one per connection. omit for the legacy fixed 8-handle node */
  handles?: FlowHandleSpec[]
}

export type FlowNodeType = Node<FlowNodeData, "ds-node">

function FlowNode({ data, selected }: NodeProps<FlowNodeType>) {
  const kind = data.kind ?? "standard"
  const kindAttr = kind === "standard" ? undefined : kind

  /* 4-directional handles: each side has both a target (input) and source (output).
     Offsetting by 30% left/right of centre so they don't overlap. */
  const handleStyle = (offset: number): React.CSSProperties => ({
    position: "absolute",
    left: `${50 + offset}%`,
  })

  return (
    <div
      className={["ds-node", data.delay != null ? "ds-anim-node" : ""].filter(Boolean).join(" ")}
      data-kind={kindAttr}
      style={{
        borderColor: selected ? "var(--cn-route, #ff6b1a)" : undefined,
        boxShadow: selected ? "0 0 0 2px rgb(255 107 26 / 24%)" : undefined,
        animationDelay: data.delay != null ? `${data.delay}ms` : undefined,
      }}
    >
      {data.handles ? (
        /* dynamic anchors: exactly one handle per connection, spread along its side */
        data.handles.map(h => (
          <Handle
            key={h.id}
            id={h.id}
            className="ds-handle"
            type={h.type}
            position={h.position}
            style={
              h.position === Position.Left || h.position === Position.Right
                ? { top: `${h.at * 100}%` }
                : { left: `${h.at * 100}%` }
            }
          />
        ))
      ) : (
        <>
          {/* top: target left, source right */}
          <Handle className="ds-handle" type="target" position={Position.Top} id="top-t" style={handleStyle(-14)} />
          <Handle className="ds-handle" type="source" position={Position.Top} id="top-s" style={handleStyle(14)} />

          {/* right: target top, source bottom */}
          <Handle className="ds-handle" type="target" position={Position.Right} id="right-t" style={{ position:"absolute", top:"32%" }} />
          <Handle className="ds-handle" type="source" position={Position.Right} id="right-s" style={{ position:"absolute", top:"68%" }} />

          {/* bottom: source left, target right */}
          <Handle className="ds-handle" type="source" position={Position.Bottom} id="bottom-s" style={handleStyle(-14)} />
          <Handle className="ds-handle" type="target" position={Position.Bottom} id="bottom-t" style={handleStyle(14)} />

          {/* left: target top, source bottom */}
          <Handle className="ds-handle" type="target" position={Position.Left} id="left-t" style={{ position:"absolute", top:"32%" }} />
          <Handle className="ds-handle" type="source" position={Position.Left} id="left-s" style={{ position:"absolute", top:"68%" }} />
        </>
      )}

      <div className="ds-node-kicker">{data.kicker}</div>
      <div className="ds-node-title">{data.title}</div>
      {data.meta ? <div className="ds-node-meta">{data.meta}</div> : null}
    </div>
  )
}

export default memo(FlowNode)