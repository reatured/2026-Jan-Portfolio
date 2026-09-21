import { BrowserRouter, Route, Routes } from "react-router-dom"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { MotionConfig } from "framer-motion"
import { PageShell } from "@/lib/motion"
import Home from "@/pages/Home"
import ArtlyGraphPreview from "@/pages/ArtlyGraphPreview"
import DesignSystemPage from "@/pages/DesignSystemPage"
import DesignSystemV4Page from "@/pages/DesignSystemV4Page"
import TeleopArchitectureGraph from "@/components/TeleopArchitectureGraph"
import TeleopArchitectureDiagram from "@/components/TeleopArchitectureDiagram"
import TeleopFlowPreview from "@/pages/TeleopFlowPreview"

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <Routes>
          <Route path="/preview/artly-graph" element={<ArtlyGraphPreview />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/design-system-v4" element={<DesignSystemV4Page />} />
          <Route path="/preview/teleop-diagram" element={<TeleopArchitectureDiagram />} />
          <Route path="/preview/teleop-graph" element={<TeleopArchitectureGraph />} />
          <Route path="/preview/teleop-reactflow" element={<TeleopFlowPreview />} />
          <Route path="*" element={(
            <div className="min-h-screen flex flex-col">
              <a className="skip-link" href="#main-content">Skip to content</a>
              <div className="grid-paper fixed inset-0 z-[1] pointer-events-none" aria-hidden="true" />
              <Nav />
              <PageShell>
                <Home />
              </PageShell>
              <Footer />
            </div>
          )} />
        </Routes>
      </MotionConfig>
    </BrowserRouter>
  )
}
