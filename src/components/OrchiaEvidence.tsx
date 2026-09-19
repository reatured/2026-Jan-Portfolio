import { useEffect, useId, useRef, useState } from "react"
import OrchiaWorkflowDemo from "@/components/OrchiaWorkflowDemo"
import OrchiaPerformance, { orchiaMetrics, type OrchiaMetric } from "@/components/OrchiaPerformance"

type Evidence = "workflow" | OrchiaMetric
const tabs: { key: Evidence; label: string }[] = [{ key: "workflow", label: "Workflow" }, ...orchiaMetrics]

/** One wide evidence canvas keeps the graph and complete analytics readable. */
export default function OrchiaEvidence() {
  const [active, setActive] = useState<Evidence>("workflow")
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const evidence = useRef<HTMLElement>(null)
  const scrollFrame = useRef(0)
  const id = useId()
  useEffect(() => () => cancelAnimationFrame(scrollFrame.current), [])
  function select(tab: Evidence) {
    setActive(tab)
    cancelAnimationFrame(scrollFrame.current)
    scrollFrame.current = requestAnimationFrame(() => {
      const section = evidence.current
      const content = section?.closest<HTMLElement>(".project-detail-scroll")
      if (!section || !content) return
      content.scrollTo({
        top: content.scrollTop + section.getBoundingClientRect().top - content.getBoundingClientRect().top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      })
    })
  }
  return (
    <section ref={evidence} className="orchia-evidence" aria-label="Workflow and results">
      <div className="orchia-evidence-tabs" role="tablist" aria-label="Explore the workflow and results">
        {tabs.map((tab, index) => <button key={tab.key} type="button" role="tab"
          ref={element => { buttons.current[index] = element }}
          id={`${id}-${tab.key}`} aria-selected={active === tab.key} aria-controls={`${id}-panel`}
          tabIndex={active === tab.key ? 0 : -1} onClick={() => select(tab.key)}
          onKeyDown={event => {
            const next = event.key === "ArrowRight" ? (index + 1) % tabs.length
              : event.key === "ArrowLeft" ? (index - 1 + tabs.length) % tabs.length
              : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : undefined
            if (next === undefined) return
            event.preventDefault()
            select(tabs[next]!.key)
            buttons.current[next]?.focus({ preventScroll: true })
          }}>{tab.label}</button>)}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${active}`}>
        {active === "workflow" ? <OrchiaWorkflowDemo /> : <OrchiaPerformance metric={active} />}
      </div>
    </section>
  )
}
