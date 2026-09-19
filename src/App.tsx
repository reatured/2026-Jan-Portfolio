import { BrowserRouter } from "react-router-dom"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { MotionConfig } from "framer-motion"
import { PageShell } from "@/lib/motion"
import Home from "@/pages/Home"

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen flex flex-col">
          <a className="skip-link" href="#main-content">Skip to content</a>
          <div className="grid-paper fixed inset-0 z-[1] pointer-events-none" aria-hidden="true" />
          <Nav />
          <PageShell>
            <Home />
          </PageShell>
          <Footer />
        </div>
      </MotionConfig>
    </BrowserRouter>
  )
}
