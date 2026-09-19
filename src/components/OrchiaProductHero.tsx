import { useId } from "react"
import OrchiaVideoCarousel from "@/components/OrchiaVideoCarousel"

export default function OrchiaProductHero() {
  const id = useId()
  return <section className="orchia-product-hero" aria-labelledby={id + "-heading"}>
    <div className="orchia-product-intro">
      <h3 id={id + "-heading"}>From brief to social video.</h3>
      <p>Agents research your brand, plan the story, and produce social videos from a website or brief.</p>
    </div>
    <OrchiaVideoCarousel />
  </section>
}
