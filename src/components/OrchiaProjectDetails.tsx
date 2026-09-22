import type { Project } from "@/lib/content"
import { orchiaEngineering } from "@/lib/orchia"
import OrchiaProductHero from "@/components/OrchiaProductHero"
import OrchiaEvidence from "@/components/OrchiaEvidence"
import OrchiaIntro from "@/components/OrchiaIntro"
import "./project-story-ribbon.css"
import "./flagship-project-details.css"
import "./orchia-project.css"

const features = orchiaEngineering.map(item => ({
  title: item.title, contribution: item.detail, stack: item.stack.split(" · "),
}))
const delivery = [
  { label: "Input", value: "Website, story & references" },
  { label: "Production", value: "Parallel agent workflows" },
  { label: "Iteration", value: "Feedback & version history" },
]

/** Orchia owns its page order: results sit right under the hero, build notes read top to bottom. */
export default function OrchiaProjectDetails({ project }: { project: Project }) {
  return <section className="project-story orchia-project-details orchia-story" aria-label={`${project.title} project story`}>
    <OrchiaProductHero />
    <OrchiaEvidence />
    <div className="story-main">
      <OrchiaIntro project={project} />
      <section className="story-reading" data-layout="stacked" aria-label={`${project.title} technical overview`}>
        <div className="story-blocks">
          {features.map((feature, index) => <article key={feature.title} className="story-block" id={`orchia-story-${index}`}
            aria-labelledby={`orchia-story-heading-${index}`}>
            <div className="story-copy">
              <h4 id={`orchia-story-heading-${index}`}>{feature.title}</h4>
              <p className="story-contribution">{feature.contribution}</p>
              <div className="story-stack"><p className="story-stack-label">Built with</p><ul>{feature.stack.map(tool => <li key={tool}>{tool}</li>)}</ul></div>
            </div>
          </article>)}
        </div>
      </section>
      <dl className="story-delivery orchia-delivery">{delivery.map(fact =>
        <div key={fact.label} className="story-info-card"><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
    </div>
  </section>
}
