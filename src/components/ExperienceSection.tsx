import { capabilities, experiences } from "@/lib/content"

function yearRange(label: string) {
  const dates = label.match(/\b(?:19|20)\d{2}\b|Present/g) ?? []
  return [...new Set(dates)].join(" — ")
}

export default function ExperienceSection() {
  return (
    <section id="experience" className="experience-section" aria-labelledby="experience-heading">
      <div className="experience-history">
        <h2 id="experience-heading" className="resume-label">Experience</h2>
        {experiences.map(experience => (
          <article className="experience-item" key={`${experience.org}-${experience.title}`}>
            <h3>{experience.title} at {experience.org}</h3>
            <div className="experience-meta">
              <span className="experience-date">{yearRange(experience.label)}</span>
              <span className="experience-location">{experience.location}</span>
            </div>
            <ul className="experience-details">
              {experience.details.map(detail => <li key={detail}>{detail}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <aside className="experience-capabilities" aria-labelledby="capabilities-heading">
        <h2 id="capabilities-heading" className="resume-label">Capabilities</h2>
        {capabilities.map(capability => (
          <div className="capability-item" key={capability.group}>
            <h3>{capability.group}</h3>
            <p>{capability.items}</p>
          </div>
        ))}
      </aside>
    </section>
  )
}
