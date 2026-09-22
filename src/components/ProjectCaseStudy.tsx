import type { Project } from "@/lib/content"
import type { ProjectCaseStudyContent } from "@/lib/project-case-studies"
import ProjectStoryRibbon from "./ProjectStoryRibbon"
import TeleopReactFlowGraph from "./TeleopReactFlowGraph"

/** The same reading template also serves projects without an archive gallery. */
export default function ProjectCaseStudy({ project, study }: {
  project: Project
  study: ProjectCaseStudyContent
}) {
  const demo = study.media || study.controlPath ? <>
    {study.media && <figure className="story-demo">
      <img src={study.media.src} alt={study.media.alt} width={study.media.width} height={study.media.height} loading="lazy" />
      <figcaption>{study.media.caption}</figcaption>
    </figure>}
    {study.controlPath && <TeleopReactFlowGraph />}
  </> : undefined
  return <ProjectStoryRibbon project={project} study={study} demo={demo} />
}
