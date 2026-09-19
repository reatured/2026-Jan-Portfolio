import type { Project } from "@/lib/content"
import type { ProjectCaseStudyContent } from "@/lib/project-case-studies"
import ProjectStoryRibbon from "./ProjectStoryRibbon"

/** The same reading template also serves projects without an archive gallery. */
export default function ProjectCaseStudy({ project, study }: {
  project: Project
  study: ProjectCaseStudyContent
}) {
  const demo = study.media ? <figure className="story-demo">
    <img src={study.media.src} alt={study.media.alt} width={study.media.width} height={study.media.height} loading="lazy" />
    <figcaption>{study.media.caption}</figcaption>
  </figure> : study.controlPath ? <ol className="story-control-path" aria-label="How the system works">
    {study.controlPath.map((step, index) => <li key={step}>
      <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>{step}</p>
    </li>)}
  </ol> : undefined
  return <ProjectStoryRibbon project={project} study={study} demo={demo} />
}
