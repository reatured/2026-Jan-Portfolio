export type ProjectFeature = {
  title: string
  contribution: string
  stack: string[]
}

export type ProjectCaseStudyContent = {
  access?: "internal"
  overview: string
  role: string
  ownership: string
  media?: { src: string; alt: string; caption: string; width: number; height: number }
  controlPath?: string[]
  features: ProjectFeature[]
  delivery: { label: string; value: string }[]
  link?: { label: string; href: string }
}

// Source mapping and claim boundaries: review/project-345-case-studies-20260910.md.
// The legacy realhand-teleop slug is the browser demo, not the hardware system.
export const projectCaseStudies: Partial<Record<string, ProjectCaseStudyContent>> = {
  // Artly ownership and stack mappings: the supplied resume, reproduced in content.ts.
  "artly-deployment": {
    access: "internal",
    overview: "An operator workspace for authoring, validating, and deploying robot motion, with revision tracking from editor to robot.",
    role: "Full Stack Software Engineer at Artly AI",
    ownership: "Designed and deployed the operator workflow.",
    features: [
      { title: "3D motion workspace", contribution: "Built the 3D editor and reusable operator controls; validated designs in Figma across desktop, phone, and iPad.", stack: ["React", "Three.js", "Figma"] },
      { title: "Automation authoring", contribution: "Built visual DAG editors and AI-assisted templates that adapt existing motion data into behavior trees for review.", stack: ["React Flow", "Custom DAGs", "AI-assisted authoring"] },
      { title: "Robot deployment", contribution: "Connected the editor to services, databases, and ROS; delivered validated motion updates with revision tracking.", stack: ["Python", "ROS", "Service integration"] },
      { title: "Production reliability", contribution: "Maintained AWS releases and CI/CD; added monitoring and improved editor loading and interaction responsiveness.", stack: ["AWS", "CI/CD", "Monitoring"] },
    ],
    delivery: [
      { label: "Users", value: "Nonengineering operators" },
      { label: "Workflow", value: "Author, validate, deploy" },
      { label: "Delivery", value: "Versioned robot motion updates" },
    ],
  },
  "realhand-teleop": {
    overview: "A browser demo that turns camera-tracked hand movement into articulated 3D robot motion.",
    role: "Software Engineer at RealHand",
    ownership: "Built and shipped the browser demo.",
    media: {
      src: "/flag-realhand.jpg", width: 1600, height: 900,
      alt: "RealHand browser demo showing camera hand landmarks, two articulated robot hands, and the model selector.",
      caption: "Shipped demo · Camera tracking & model selection",
    },
    features: [
      {
        title: "Camera control",
        contribution: "Integrated camera input and MediaPipe’s 21 hand landmarks to drive the interaction.",
        stack: ["MediaPipe Hands", "Camera input"],
      },
      {
        title: "Pose mapping",
        contribution: "Mapped tracked hand poses to the articulated joints of URDF robot hand models.",
        stack: ["URDF", "Kinematic mapping"],
      },
      {
        title: "Live 3D viewer",
        contribution: "Built the 3D viewer and connected 31 URDF hand models to the tracking pipeline.",
        stack: ["Three.js", "React Three Fiber"],
      },
      {
        title: "Web interface",
        contribution: "Built camera and model controls with shared scene state; shipped on the company website.",
        stack: ["React", "Zustand"],
      },
    ],
    delivery: [
      { label: "Published", value: "RealHand company website" },
      { label: "Model registry", value: "31 URDF hand models" },
      { label: "Interaction", value: "Camera-based hand tracking" },
    ],
  },
  teleoperation: {
    overview: "VR control of two robot arms and two dexterous hands, with calibration and live monitoring.",
    role: "Software Engineer at RealHand",
    ownership: "Led development, deployment, and the live CES 2026 showcase.",
    controlPath: ["VR, camera & glove inputs", "Shared pose & control interface", "Two arms + two dexterous hands"],
    features: [
      {
        title: "VR teleoperation",
        contribution: "Led integration and deployment of the two-arm, two-hand system, including its live CES 2026 demo.",
        stack: ["VR input", "Robot integration"],
      },
      {
        title: "Robot communication",
        contribution: "Built the Python backend connecting operator tools to physical robot hardware.",
        stack: ["Python", "Communication backend"],
      },
      {
        title: "Unified hand inputs",
        contribution: "Normalized poses and joint updates so camera and glove inputs share one interface for 3D and physical hands.",
        stack: ["Pose normalization", "Joint updates", "Camera & glove inputs"],
      },
      {
        title: "Calibration & feedback",
        contribution: "Prototyped a dashboard with the operations team for calibration, live state monitoring, and troubleshooting.",
        stack: ["Three.js", "State visualization", "Calibration tools"],
      },
    ],
    delivery: [
      { label: "Showcase", value: "CES 2026 · Live demonstration" },
      { label: "Hardware", value: "2 robot arms + 2 dexterous hands" },
      { label: "My scope", value: "Development through deployment" },
    ],
  },
  "ar-drawing": {
    overview: "An AR drawing Lens that turns hand gestures into textured 3D strokes, with a reusable mesh plugin.",
    role: "AR Engine Engineer Intern at Snap Inc.",
    ownership: "Built the drawing Lens, mesh plugin, and developer resources.",
    media: {
      src: "/flag-snap.jpg", width: 1600, height: 900,
      alt: "The original Snap AR Drawing Lens showing hand tracking and colorful procedural geometry in a real camera view.",
      caption: "Original drawing Lens · Snap, 2022",
    },
    features: [
      {
        title: "Gesture drawing",
        contribution: "Connected hand tracking and gesture detection to AR drawing; tested the Lens on Spectacles.",
        stack: ["Lens Studio", "Hand tracking", "Gesture detection"],
      },
      {
        title: "Runtime geometry",
        contribution: "Built procedural mesh generation that turns hand movement into vertices and connected 3D strokes.",
        stack: ["JavaScript", "MeshBuilder", "Procedural geometry"],
      },
      {
        title: "Stable textures",
        contribution: "Solved texture shifting as the mesh regenerates, keeping custom materials aligned through topology changes.",
        stack: ["Texture coordinates", "Mesh topology", "Materials"],
      },
      {
        title: "Creator tools",
        contribution: "Shipped a configurable mesh-library plugin; wrote the official guide, samples, tutorials, and code examples.",
        stack: ["JavaScript API", "Lens Studio plugin", "Developer documentation"],
      },
    ],
    delivery: [
      { label: "Released", value: "Official Lens Studio asset" },
      { label: "Developer resources", value: "Guide, sample projects & tutorials" },
      { label: "First month", value: "200K plays and views" },
    ],
    link: {
      label: "Read the official guide",
      href: "https://developers.snap.com/lens-studio/4.55.1/references/guides/lens-features/scene-set-up/3d/procedural-mesh",
    },
  },
}
