import { lazy, Suspense, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { projects, type Project } from "@/lib/content"
import { cn } from "@/lib/utils"
import { legacyProjectIndex } from "@/lib/legacy-project-index"
import OrchiaProjectDetails from "@/components/OrchiaProjectDetails"
import ArtlyProjectDetails from "@/components/ArtlyProjectDetails"
import ProjectHoverPreview from "@/components/ProjectHoverPreview"
import ProjectCaseStudy from "@/components/ProjectCaseStudy"
import { projectCaseStudies } from "@/lib/project-case-studies"
import { useProjectReading } from "@/lib/project-reading"

const ProjectArchiveDetails = lazy(() => import("@/components/ProjectArchiveDetails"))

function ProjectLabel({ project, number }: { project: Project; number: number }) {
  return (
    <>
      <span className="index-number" aria-hidden="true">{String(number).padStart(3, "0")}</span>
      <span className="index-copy">
        <span className="index-title">{project.title}</span>
        <span className="index-subtitle">{project.subtitle}</span>
      </span>
      <span className="index-year">{project.year}</span>
    </>
  )
}

function ProjectDetails({ project }: { project: Project }) {
  if (project.slug === "orchia") return <OrchiaProjectDetails project={project} />
  if (project.slug === "artly-deployment") return <ArtlyProjectDetails project={project} />
  if (legacyProjectIndex[project.slug]) return <div className="project-details project-import-shell">
    <Suspense fallback={<p className="project-import-loading" role="status">Loading project details…</p>}><ProjectArchiveDetails project={project} /></Suspense>
  </div>
  const study = projectCaseStudies[project.slug]
  return study ? <ProjectCaseStudy project={project} study={study} /> : null

}

export default function ProjectIndex() {
  const location = useLocation()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const indexRef = useRef<HTMLElement>(null)
  const params = new URLSearchParams(location.search)
  const selected = params.get("project")
  const projectYears = projects.flatMap(project => project.year === undefined ? [] : [project.year])
  const prepareToggle = useProjectReading(indexRef, selected, location.hash)

  const toggle = (slug: string) => {
    if (prepareToggle(slug) === "restore") return
    const next = new URLSearchParams(params)
    if (selected === slug) next.delete("project")
    else next.set("project", slug)
    navigate({ pathname: "/", search: next.toString(), hash: location.hash }, { preventScrollReset: true })
  }

  return (
    <section ref={indexRef} id="index" className="project-index" aria-labelledby="index-heading">
      <header className="index-heading">
        <h2 id="index-heading">Index</h2>
        <span className="index-spine" aria-hidden="true" />
        <p className="index-legend">
          <b>{projects.length} entries</b> · 4 flagship<br />
          Robotics · Graphics · Spatial · Product<br />
          {Math.min(...projectYears)} — {Math.max(...projectYears)} · Selected work
        </p>
      </header>

      <ol className="index-rows">
        {projects.map((project, i) => {
          const expanded = selected === project.slug
          const rowClass = cn("index-row", i % 5 === 0 && "beat", expanded && "is-open")
          const panelId = `project-details-${project.slug}`
          return (
            <li key={project.id} id={`project-${project.slug}`}>
              <button type="button" className={rowClass} onClick={() => toggle(project.slug)}
                data-preview-src={project.hoverImage ?? (project.flag ? `/${project.flag}.jpg` : undefined)}
                aria-expanded={expanded} aria-controls={panelId} id={`project-button-${project.slug}`}>
                <ProjectLabel project={project} number={i + 1} />
              </button>
              <div id={panelId} role="region" aria-labelledby={`project-button-${project.slug}`}
                aria-hidden={!expanded} inert={!expanded}>
                {/* Retain the outgoing panel while the next one opens in the same render. */}
                <AnimatePresence initial={false} mode="sync">
                  {expanded && (
                    <motion.div key={project.slug} className="project-panel-clip"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.46, ease: [0.32, 0.72, 0, 1] }}>
                      <div className="project-detail-scroll" role="group" aria-label={`${project.title} details`}>
                        <ProjectDetails project={project} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          )
        })}
      </ol>
      <ProjectHoverPreview indexRef={indexRef} resetKey={location.key} />
    </section>
  )
}
