import { BaseEdge, getBezierPath, EdgeLabelRenderer, type EdgeProps, type Edge } from "@xyflow/react"

export type FlowEdgeData = {
  label?: string
  /** "callout" = dashed, "boundary" = faint grey */
  kind?: "callout" | "boundary"
  delay?: number
}

export type FlowEdgeType = Edge<FlowEdgeData, "ds-edge">

function FlowEdge({
  id,
  sourceX, sourceY,
  targetX, targetY,
  sourcePosition, targetPosition,
  data,
  markerEnd,
}: EdgeProps<FlowEdgeType>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  })

  const edgeLen = Math.hypot(targetX - sourceX, targetY - sourceY)

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        className={["ds-edge-path", data?.delay != null ? "ds-anim-edge" : ""].filter(Boolean).join(" ")}
        data-kind={data?.kind}
        style={{
          ["--edge-len" as string]: `${edgeLen}`,
          animationDelay: data?.delay != null ? `${data.delay}ms` : undefined,
        }}
      />
      {data?.label ? (
        <EdgeLabelRenderer>
          <div
            className="ds-edge-label"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  )
}

export default FlowEdge