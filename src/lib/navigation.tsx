import { useEffect, useState, type ComponentProps, type RefObject } from "react"
import { Link, useLocation } from "react-router-dom"

export const sections = [
  { id: "home", label: "Home" },
  { id: "index", label: "Index" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const

export type SectionId = (typeof sections)[number]["id"]

export function scrollToSection(id: string, behavior: ScrollBehavior = "auto") {
  const target = document.getElementById(id)
  if (!target) return
  const header = document.querySelector(".site-nav")
  if (header) document.documentElement.style.setProperty("--nav-height", `${header.getBoundingClientRect().height}px`)
  if (id === "home") window.scrollTo({ top: 0, behavior })
  else target.scrollIntoView({ block: "start", behavior })
}

export function SectionLink({ section, onClick, ...props }: Omit<ComponentProps<typeof Link>, "to"> & { section: SectionId }) {
  const location = useLocation()
  return (
    <Link {...props} to={{ pathname: "/", search: location.search, hash: `#${section}` }} preventScrollReset
      onClick={event => {
        onClick?.(event)
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        // Re-clicking the current hash must work after the visitor has scrolled away.
        if (location.pathname === "/" && location.hash === `#${section}`) {
          event.preventDefault()
          scrollToSection(section)
        }
      }} />
  )
}

export function useActiveSection(headerRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState<SectionId>("home")
  const { hash } = useLocation()

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const update = () => {
      const headerHeight = header.getBoundingClientRect().height
      const height = `${headerHeight}px`
      if (document.documentElement.style.getPropertyValue("--nav-height") !== height) {
        document.documentElement.style.setProperty("--nav-height", height)
      }
      const position = headerHeight + 26
      let current: SectionId = "home"
      for (const section of sections) {
        if ((document.getElementById(section.id)?.getBoundingClientRect().top ?? Infinity) <= position) current = section.id
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = "contact"
        // Short end sections can share the last viewport. Honor a visible anchor the visitor selected.
        const requested = sections.find(section => `#${section.id}` === hash)
        const bounds = requested && document.getElementById(requested.id)?.getBoundingClientRect()
        if (requested && bounds && bounds.top >= headerHeight && bounds.bottom <= window.innerHeight + 2) current = requested.id
      }
      setActive(previous => previous === current ? previous : current)
    }
    const observer = new ResizeObserver(update)
    observer.observe(header)
    observer.observe(document.body)
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    update()
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      document.documentElement.style.removeProperty("--nav-height")
    }
  }, [headerRef, hash])

  return active
}
