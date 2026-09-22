import type { Project } from "@/lib/content"
import { artlyDemoVideo } from "@/lib/hero"
import { projectCaseStudies } from "@/lib/project-case-studies"
import ProjectVideo from "@/components/ProjectVideo"
import ProjectStoryRibbon from "@/components/ProjectStoryRibbon"
import "./flagship-project-details.css"

export default function ArtlyProjectDetails({ project }: { project: Project }) {
  return (
    <ProjectStoryRibbon project={project} study={projectCaseStudies["artly-deployment"]!} className="artly-story" storyLayout="stacked"
      demo={<ProjectVideo src={artlyDemoVideo} title={project.title} caption={project.videoCaption} allowExternalPlayback={false} />} />
  )
}
