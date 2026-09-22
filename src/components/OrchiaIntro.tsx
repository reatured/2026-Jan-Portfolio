import type { Project } from "@/lib/content"
import { orchiaShowcase } from "@/lib/orchia"

/** Orientation layer: what Orchia is and the scope I owned, in prose instead of two cards. */
export default function OrchiaIntro({ project }: { project: Project }) {
  return <section className="story-info-card orchia-intro" aria-label="About Orchia and my role">
    <p className="orchia-intro-lede">
      Orchia connects story planning, reference images, scene generation, and review in one video
      production workflow. Human feedback becomes the input for the next version, so a team can
      refine the story and its visual continuity across successive runs.
    </p>
    <p className="orchia-intro-role">
      {project.role ?? "Founder & Software Engineer"} — built and shipped the full-stack platform:
      the workflow editor operators drive, the agent runtime underneath it, and the media pipeline
      that delivers the finished cut.
    </p>
    <a className="orchia-intro-link" href={orchiaShowcase.homepage} target="_blank" rel="noopener noreferrer">
      Explore Orchia Studio<span className="sr-only"> (opens in a new tab)</span>
    </a>
  </section>
}
