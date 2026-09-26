import type { FC } from "react"
import FlowGraphCanvas from "@/components/FlowGraphCanvas"
import { artlyCanvas } from "@/lib/artly-flow-graph"

const ArtlyReactFlowGraph: FC = () => (
  <FlowGraphCanvas spec={artlyCanvas} className="artly-flow-graph"
    title="Integrated robotic deployment system"
    summary="I built the editor and simulation integration with Artly AI's existing Java backend APIs and robot database. Motion updates reach live robots through those APIs after operator review and validation, with revision tracking." />
)

export default ArtlyReactFlowGraph
