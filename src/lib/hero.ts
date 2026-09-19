export type HeroProject = {
  id: string
  label: string
  title: string
  image: string
  imageSize: [width: number, height: number]
  imageAlt: string
  focalPoint?: [x: number, y: number]
  overlay: {
    title: string
    subtitle: string
    /** Fractions of the expanded image width and height. */
    width: number
    bottom: number
  }
}

export const artlyDemoVideo = "https://ljdplova5l98mtgc.public.blob.vercel-storage.com/projects/artly-deployment/demo-2026-09-11-v15.mp4"

export const heroProjects: HeroProject[] = [
  {
    id: "artly-deployment",
    label: "Artly Coffee",
    title: "Artly Coffee, WebRviz System",
    image: "/hero-artly-clean-v1.png",
    imageSize: [1672, 941],
    imageAlt: "Artly Coffee robot deployment system on a laptop beside a coffee-making robot — promotional image.",
    focalPoint: [.62, .5],
    overlay: { title: "Robot Deployment System", subtitle: "for Artly Coffee", width: .28, bottom: .08 },
  },
  { id: "orchia", label: "Orchia Studio", title: "Orchia Studio", image: "/hero-orchia-clean-v1.png",
    imageSize: [1659, 948], focalPoint: [.54, .5],
    overlay: { title: "Orchia Studio", subtitle: "From story to video", width: .56, bottom: .055 },
    imageAlt: "Orchia Studio promotional concept: connected story, director, visual, audio, and editor agents produce a finished social video." },
  { id: "realhand-teleop", label: "RealHand", title: "RealHand · Robot Hand Web Demo", image: "/hero-realhand-clean-v1.png",
    imageSize: [1672, 941], focalPoint: [.66, .5],
    overlay: { title: "RealHand", subtitle: "Robot Hand Web Demo", width: .34, bottom: .15 },
    imageAlt: "RealHand promotional concept: a webcam tracks a raised hand and mirrors its pose with a 3D robot hand in the browser." },
  { id: "ar-drawing", label: "Snap AR", title: "Snap AR Drawing Tool", image: "/hero-snap-clean-v1.png",
    imageSize: [1672, 941], focalPoint: [.45, .5],
    overlay: { title: "Snap AR", subtitle: "Draw in the air", width: .44, bottom: .075 },
    imageAlt: "Snap AR promotional concept: a person in AR glasses draws an orange and teal ribbon in the air." },
]
