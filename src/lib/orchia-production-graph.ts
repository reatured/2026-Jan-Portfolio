/** Condensed V13 reference/shot graph. Topology follows the supplied screenshot
 * and product workflow-v13/v13-2-definitions.ts; imagery is the homepage's demo. */
export type ProductionNode = { id: string; label: string[]; stage: number; column: number; y: number; image?: string }
export const productionStages = ["Context", "Story + references", "Reference images", "Reference registry", "Character Bible", "Shot prompts", "First frames", "Video generation", "Assembly", "Done"] as const
export const productionNodes: ProductionNode[] = [
  { id: "context", label: ["Context"], stage: 0, column: 0, y: 218 },
  { id: "reference-plan", label: ["Reference", "segmentation"], stage: 1, column: 1, y: 140 },
  { id: "story-plan", label: ["Story", "segmentation"], stage: 1, column: 1, y: 296 },
  { id: "characters", label: ["Characters"], stage: 2, column: 2, y: 62, image: "/projects/orchia/reference-characters.jpg" },
  { id: "world", label: ["Environment"], stage: 2, column: 2, y: 198, image: "/projects/orchia/reference-world.jpg" },
  { id: "mascot", label: ["Brand character"], stage: 2, column: 2, y: 334, image: "/projects/orchia/reference-mascot.png" },
  { id: "registry", label: ["Reference", "registry"], stage: 3, column: 3, y: 218 },
  { id: "bible", label: ["Character", "Bible"], stage: 4, column: 4, y: 218 },
  ...[1, 4, 6, 8].flatMap((shot, index): ProductionNode[] => {
    const cut = index + 1
    const y = 62 + index * 110
    return [
      { id: `prompt-${cut}`, label: [`Cut ${cut}`, "Video prompt"], stage: 5, column: 5, y },
      { id: `frame-${cut}`, label: [`Cut ${cut} · First frame`], stage: 6, column: 6, y, image: `/projects/orchia/workflow-shot-${shot}.jpg` },
      { id: `video-${cut}`, label: [`Cut ${cut}`, "Video request"], stage: 7, column: 7, y },
    ]
  }),
  { id: "assemble", label: ["Assemble"], stage: 8, column: 8, y: 218 },
  { id: "done", label: ["Done"], stage: 9, column: 9, y: 218 },
]
export const productionEdges: [string, string][] = [
  ["context", "reference-plan"], ["context", "story-plan"],
  ...["characters", "world", "mascot"].flatMap((id): [string, string][] => [["reference-plan", id], [id, "registry"]]),
  ["registry", "bible"], ["story-plan", "bible"],
  ...[1, 2, 3, 4].flatMap((cut): [string, string][] => [
    ["bible", `prompt-${cut}`], ["registry", `prompt-${cut}`],
    [`prompt-${cut}`, `frame-${cut}`], [`frame-${cut}`, `video-${cut}`],
    [`video-${cut}`, "assemble"],
  ]),
  ["assemble", "done"],
]
export const nodeX = (node: ProductionNode) => 20 + node.column * 184
export const nodeHeight = (node: ProductionNode) => node.image ? 100 : 78
export const NODE_WIDTH = 150
export const GRAPH_WIDTH = 1850
export const GRAPH_HEIGHT = 514

export function productionEdgePath(from: ProductionNode, to: ProductionNode) {
  const x1 = nodeX(from) + NODE_WIDTH
  const y1 = from.y + nodeHeight(from) / 2
  const x2 = nodeX(to)
  const y2 = to.y + nodeHeight(to) / 2
  const mid = x1 + (x2 - x1) / 2
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`
}
