import { meta } from "@/lib/content"

export default function About() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <h2 id="about-heading" className="resume-label">About</h2>
      <div className="about-copy">
        <p className="text-[1.15rem] font-medium text-ink-soft leading-relaxed max-w-[52ch]">
          {meta.headline}
        </p>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-mut max-w-[52ch]">
          I build the closed loop between what a machine <strong className="text-ink font-semibold">sees</strong> and what it <strong className="text-ink font-semibold">does</strong>.
          From Fusion 360 CAD to GLSL shaders to commercial AR lenses, the same person owns the whole chain.
        </p>
      </div>
    </section>
  )
}
