import { motion } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, type ReactNode } from "react"
import { scrollToSection } from "@/lib/navigation"

export function PageShell({ children }: { children: ReactNode }) {
  const loc = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    // Previously shared page URLs now open the matching section of the one-page site.
    if (loc.pathname !== "/") {
      const legacy: Record<string, string> = { "/projects": "index", "/experience": "experience", "/about": "home", "/contact": "contact" }
      const project = new URLSearchParams(window.location.search).get("project")
      const anchor = loc.pathname === "/projects" && project ? `project-${project}` : legacy[loc.pathname] ?? "home"
      navigate({ pathname: "/", search: window.location.search, hash: `#${anchor}` }, { replace: true, preventScrollReset: true })
      return
    }
    if (loc.hash === "#about") {
      navigate({ pathname: "/", search: window.location.search, hash: "#home" }, { replace: true, preventScrollReset: true })
      return
    }
    scrollToSection(loc.hash.slice(1) || "home")
  }, [loc.pathname, loc.hash, navigate])

  return (
    <main id="main-content" tabIndex={-1} className="relative z-[2] flex-1">
      {children}
    </main>
  )
}

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 0.9, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.9, 0.25, 1] } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
