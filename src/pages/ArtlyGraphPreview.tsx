import ArtlyArchitectureGraph from "@/components/ArtlyArchitectureGraph"
import "@/components/project-story-ribbon.css"
import "@/components/flagship-project-details.css"
import "./artly-graph-preview.css"

/** Standalone iteration surface for the Artly system graph, outside the one-page site. */
export default function ArtlyGraphPreview() {
  return (
    <main className="preview-page">
      <div className="preview-wrap">
        <p className="preview-eyebrow">Preview · not in navigation</p>
        <h1>Artly system graph</h1>
        <p className="preview-note">
          Iteration surface for the architecture graph. Once approved it renders inside the
          Artly Index panel; this route stays out of the menu and the sitemap.
        </p>
        <div className="project-story artly-story preview-story">
          <ArtlyArchitectureGraph />
        </div>
      </div>
    </main>
  )
}
