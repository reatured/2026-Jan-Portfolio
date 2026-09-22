import type { Project } from "@/lib/content"
import { legacyProjects } from "@/lib/legacy-projects"
import { projectCaseStudies } from "@/lib/project-case-studies"
import ArchiveYouTube from "@/components/ArchiveYouTube"
import "./project-story-ribbon.css"
import "./realhand-project.css"

const study = projectCaseStudies["realhand-teleop"]!
const demo = legacyProjects["realhand-teleop"]!.media.find(item => item.type === "youtube")!

/** RealHand owns its page order: one demo video → build notes → a single prose block → facts. */
export default function RealHandProjectDetails({ project }: { project: Project }) {
  return <section className="project-story realhand-story" aria-label={`${project.title} project story`}>
    <figure className="story-demo">
      <div className="story-demo-stage"><ArchiveYouTube media={demo} autoPlay /></div>
      <figcaption>RealHand robot hand web demo <span>Live on realhand.com · camera hand tracking</span></figcaption>
    </figure>
    <div className="story-main">
      <section className="story-reading" data-layout="stacked" aria-label={`${project.title} technical overview`}>
        <div className="story-blocks">
          {study.features.map((feature, index) => <article key={feature.title} className="story-block" id={`realhand-story-${index}`}
            aria-labelledby={`realhand-story-heading-${index}`}>
            <div className="story-copy">
              <h4 id={`realhand-story-heading-${index}`}>{feature.title}</h4>
              <p className="story-contribution">{feature.contribution}</p>
              <div className="story-stack"><p className="story-stack-label">Built with</p><ul>{feature.stack.map(tool => <li key={tool}>{tool}</li>)}</ul></div>
            </div>
          </article>)}
        </div>
      </section>
      <section className="story-info-card realhand-intro" aria-label="About the demo and my role">
        <p className="realhand-intro-lede">{study.overview}</p>
        <p className="realhand-intro-role">{study.role} — {study.ownership}</p>
        {project.demoUrl && <a className="realhand-intro-link" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
          Try the live demo<span className="sr-only"> (opens in a new tab)</span>
        </a>}
      </section>
      <dl className="story-delivery realhand-delivery">{study.delivery.map(fact =>
        <div key={fact.label} className="story-info-card"><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
    </div>
  </section>
}
