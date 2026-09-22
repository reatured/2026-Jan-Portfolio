import type { FC } from "react"
import FlowGraphCanvas from "@/components/FlowGraphCanvas"
import { artlyCanvas } from "@/lib/artly-flow-graph"

const ArtlyReactFlowGraph: FC = () => (
  <FlowGraphCanvas spec={artlyCanvas} className="artly-flow-graph"
    title="Integrated robotic deployment system" />
)

export default ArtlyReactFlowGraph
