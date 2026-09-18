import HeroProjects from "@/components/HeroProjects"
import ProjectIndex from "@/components/ProjectIndex"
import ExperienceSection from "@/components/ExperienceSection"

export default function Home() {
  return (
    <>
      <HeroProjects />
      <div className="site-container home-content pb-[clamp(64px,9vh,112px)]">
        <ProjectIndex />
        <ExperienceSection />
      </div>
    </>
  )
}
