import { useRef } from "react"
import { meta } from "@/lib/content"
import { cn } from "@/lib/utils"
import { SectionLink, sections, useActiveSection } from "@/lib/navigation"

export default function Nav() {
  const headerRef = useRef<HTMLElement>(null)
  const active = useActiveSection(headerRef)
  return (
    <header ref={headerRef} className="site-nav sticky top-0 z-40 bg-cream border-b border-rule">
      <div className="site-container grid grid-cols-12 items-center min-h-14 gap-x-6 max-md:gap-y-2 max-md:py-3">
        <SectionLink section="home" className="col-span-3 max-md:col-span-12 flex items-center gap-[11px]">
          <span className="block w-[15px] h-[15px] bg-orange flex-none" aria-hidden="true" />
          <span className="font-display font-black text-[0.875rem] tracking-[-0.02em] uppercase">{meta.name}</span>
        </SectionLink>
        <nav aria-label="Main navigation" className="col-start-5 col-span-8 max-md:col-start-1 max-md:col-span-12 flex justify-end max-md:justify-start items-center flex-wrap gap-x-6 gap-y-2 max-md:gap-x-4 font-mono text-[0.656rem] tracking-[0.16em] uppercase text-mut">
          {sections.map(section => (
            <SectionLink key={section.id} section={section.id} aria-current={active === section.id ? "location" : undefined}
              className={cn(
                "relative pb-[3px] transition-colors",
                "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-orange after:transition-[width] after:duration-200 after:ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                active === section.id ? "after:w-full text-ink" : "after:w-0 hover:after:w-full hover:text-ink"
              )}>{section.label}</SectionLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
