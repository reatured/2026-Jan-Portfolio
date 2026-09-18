import type { Project } from "@/lib/content"
import { orchiaEngineering, orchiaShowcase } from "@/lib/orchia"
import OrchiaProductHero from "@/components/OrchiaProductHero"
import OrchiaEvidence from "@/components/OrchiaEvidence"
import ProjectStoryRibbon from "@/components/ProjectStoryRibbon"
import "./flagship-project-details.css"

const features = orchiaEngineering.map(item => ({
  title: item.title, contribution: item.detail, stack: item.stack.split(" · "),
}))

export default function OrchiaProjectDetails({ project }: { project: Project }) {
  return <ProjectStoryRibbon project={project} className="orchia-project-details orchia-story" study={{
    overview: "Agents research your brand, plan the story, and produce social videos from a website or brief.",
    role: project.role ?? "Founder & Software Engineer",
    ownership: "Built and shipped the full-stack video production platform.",
    features,
    delivery: [
      { label: "Input", value: "Website, story & references" },
      { label: "Production", value: "Parallel agent workflows" },
      { label: "Iteration", value: "Feedback & version history" },
    ],
    link: { label: "Explore Orchia Studio", href: orchiaShowcase.homepage },
  }} demo={<OrchiaProductHero />}>
    <OrchiaEvidence />
  </ProjectStoryRibbon>
}
