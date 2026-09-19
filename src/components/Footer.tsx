import { useEffect, useRef, useState } from "react"
import { EnvelopeClosedIcon, GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons"
import { meta } from "@/lib/content"

export default function Footer() {
  const [copyStatus, setCopyStatus] = useState("")
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(copyTimer.current), [])

  const copyEmail = async () => {
    clearTimeout(copyTimer.current)
    try {
      await navigator.clipboard.writeText(meta.email)
      setCopyStatus("Copied")
    } catch {
      setCopyStatus(`Email: ${meta.email}`)
    }
    copyTimer.current = setTimeout(() => setCopyStatus(""), 2400)
  }

  return (
    <footer id="contact" className="site-footer" aria-labelledby="footer-heading">
      <div className="site-container footer-grid">
        <div className="footer-intro">
          <h2 id="footer-heading"><a className="footer-mail" href={`mailto:${meta.email}`}>Say hello →</a></h2>
          <p>If you are hiring for real-time 3D, robotics, simulation, or developer platform roles, I would like to hear from you.</p>
        </div>
        <div className="footer-links">
          <nav className="footer-icons" aria-label="Contact links">
            <a href={`mailto:${meta.email}`} aria-label={`Email ${meta.email}`} title={meta.email}><EnvelopeClosedIcon aria-hidden="true" /></a>
            <a href={`https://${meta.github}`} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><GitHubLogoIcon aria-hidden="true" /></a>
            <a href={`https://${meta.linkedin}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><LinkedInLogoIcon aria-hidden="true" /></a>
          </nav>
          <div className="footer-copy"><button type="button" onClick={copyEmail}>Copy email</button><span role="status">{copyStatus}</span></div>
        </div>
        <div className="colophon">
          <span>Robotics · Graphics · Spatial · Product</span>
          <span className="colophon-copyright">© {new Date().getFullYear()} Lingyi Zhou</span>
        </div>
      </div>
    </footer>
  )
}
