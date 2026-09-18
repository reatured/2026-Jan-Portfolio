/** Connection geometry reused from the company website WorkflowGraph.tsx. */
import type { WorkflowNodeSpec } from "./orchia-workflow"

const DEFAULT_NODE_WIDTH = 176
const DEFAULT_NODE_HEIGHT = 82

function nodeWidth(node: WorkflowNodeSpec) {
  return node.width ?? DEFAULT_NODE_WIDTH
}

function nodeHeight(node: WorkflowNodeSpec) {
  return node.height ?? DEFAULT_NODE_HEIGHT
}

export function edgePath(source: WorkflowNodeSpec, target: WorkflowNodeSpec) {
  const sourceWidth = nodeWidth(source)
  const sourceHeight = nodeHeight(source)
  const targetWidth = nodeWidth(target)
  const targetHeight = nodeHeight(target)
  const sourceCenterX = source.x + sourceWidth / 2
  const sourceCenterY = source.y + sourceHeight / 2
  const targetCenterX = target.x + targetWidth / 2
  const targetCenterY = target.y + targetHeight / 2

  if (target.x >= source.x + sourceWidth + 20) {
    const startX = source.x + sourceWidth
    const endX = target.x
    const controlX = startX + (endX - startX) / 2
    return `M ${startX} ${sourceCenterY} C ${controlX} ${sourceCenterY}, ${controlX} ${targetCenterY}, ${endX} ${targetCenterY}`
  }

  if (source.x >= target.x + targetWidth + 20) {
    const startX = source.x
    const endX = target.x + targetWidth
    const controlX = endX + (startX - endX) / 2
    return `M ${startX} ${sourceCenterY} C ${controlX} ${sourceCenterY}, ${controlX} ${targetCenterY}, ${endX} ${targetCenterY}`
  }

  const startY = source.y + sourceHeight
  const endY = target.y
  const controlY = startY + (endY - startY) / 2
  return `M ${sourceCenterX} ${startY} C ${sourceCenterX} ${controlY}, ${targetCenterX} ${controlY}, ${targetCenterX} ${endY}`
}

