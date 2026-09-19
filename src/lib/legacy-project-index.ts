// Lightweight Index metadata; full galleries and notes load on project opening.
export const legacyProjectIndex: Record<string, { title: string; subtitle: string; year: number | null; discipline: string; overview: string; role: string; stack: string; hoverImage: string | null }> = {
  "realhand-teleop": {
    "title": "Robot Hand Real-Time Teleoperation Interface",
    "subtitle": "Real-Time Teleoperation via Computer Vision and URDF Control",
    "year": 2025,
    "discipline": "robotics engineer / perception & cv engineer",
    "overview": "A browser demo that maps camera-tracked hand movement to 31 articulated robot hand models.",
    "role": "Software Engineer at RealHand",
    "stack": "",
    "hoverImage": "/flag-realhand.jpg"
  },
  "ar-drawing": {
    "title": "AR Drawing Tool",
    "subtitle": "Real-Time Hand Tracking to Procedural 3D Geometry Pipeline",
    "year": 2022,
    "discipline": "perception & cv engineer",
    "overview": "Hand gestures become textured 3D strokes on Spectacles, backed by a reusable procedural mesh plugin.",
    "role": "AR Engine Engineer Intern at Snap Inc.",
    "stack": "",
    "hoverImage": "/projects/archive/aad27f594d40b586-thumb.webp"
  },
  "glass-bridge": {
    "title": "Snapchat Glass Bridge Challenge",
    "subtitle": "A turn-based glass-bridge game played through Snapchat messages.",
    "year": 2025,
    "discipline": "xr developer / game developer",
    "overview": "A Squid Game-inspired, turn-based endless runner played asynchronously through Snapchat messages.",
    "role": "Lens Studio Developer · System Design",
    "stack": "Lens Studio · TypeScript ES2019 · Async multiplayer · Snapchat messaging · Handler pattern · Events · Bitmoji SDK",
    "hoverImage": "/projects/archive/74c63d38a9e5cfbb-thumb.webp"
  },
  "gogreennext": {
    "title": "GoGreenNext - Modular Map Tiles",
    "subtitle": "3D Modeling for NYU Game Project",
    "year": 2025,
    "discipline": "3d designer",
    "overview": "A reusable environment tile kit for an NYU game team, built for fast level assembly and consistent landscapes.",
    "role": "3D Artist · Environment Design",
    "stack": "Blender · Modular modeling · Grid layout · Edge matching · Environment art · UV mapping · Low-poly modeling",
    "hoverImage": "/projects/archive/592235028a1e8b86-thumb.webp"
  },
  "curaloop": {
    "title": "CuraLoop: AI Companion for Alzheimer's Care",
    "subtitle": "Real-Time AI Pipeline with Human-in-the-Loop Monitoring",
    "year": 2025,
    "discipline": "full stack engineer",
    "overview": "A one-day hackathon prototype using AI chat and games to surface behavioral trends for Alzheimer’s caregivers to review.",
    "role": "Full Stack / AI Integration · 3-person hackathon team",
    "stack": "React Native · TypeScript · Expo · FastAPI · Python · Claude Sonnet · Human-in-the-loop · Trend analysis · Vercel · Full stack integration",
    "hoverImage": "/projects/archive/2632a0f8911f118f-thumb.webp"
  },
  "b612": {
    "title": "B612 Soccer",
    "subtitle": "Minimalist 2-player soccer on a looping planet — solo-built in 48 hours for GMTK 2025 (Top 2%)",
    "year": 2025,
    "discipline": "game developer",
    "overview": "Two players kick a ball around a looping planet. A shot can orbit the world and return as an unexpected goal.",
    "role": "Solo Developer · Game Design · Illustration",
    "stack": "Unity · C# · Polar coordinates · Game state · Pencil sketch · Photoshop · Game design · Audio integration",
    "hoverImage": "/projects/archive/1b62ec9083c19032-thumb.webp"
  },
  "just-another-day": {
    "title": "Just Another Day",
    "subtitle": "Five mini-games, one emotional arc.",
    "year": null,
    "discipline": "game developer / 3d designer",
    "overview": "Five mini-games connected by an emotional storyline, designed to build toward a cathartic ending.",
    "role": "Game Developer · Storytelling",
    "stack": "Unity · C# · Narrative design · Game pacing · HLSL · Blender · itch.io · Game production",
    "hoverImage": "/projects/archive/207b25fa387bcafe-thumb.webp"
  },
  "hardware-store": {
    "title": "Hardware Store Smart Search",
    "subtitle": "Find hardware-store customers through searchable map data.",
    "year": null,
    "discipline": "full stack engineer",
    "overview": "A lead-generation tool for a hardware manufacturer, turning Google Maps business listings into a searchable list of potential store customers.",
    "role": "Full Stack Developer",
    "stack": "Python · Map data · React · JavaScript · Caching · Perplexity API · FastAPI",
    "hoverImage": "/projects/archive/98a9abdd53714d00-thumb.webp"
  },
  "ping-pong": {
    "title": "Ping Pong Game",
    "subtitle": "A custom p5.js game engine with a 3D illusion.",
    "year": 2021,
    "discipline": "game developer",
    "overview": "A p5.js ping-pong game with a custom engine, an automated opponent, and a 2D court that feels three-dimensional.",
    "role": "Game Engine Developer",
    "stack": "p5.js · JavaScript · Canvas drawing · Perspective math · Opponent logic · Game loop · Audio · Interaction design",
    "hoverImage": "/projects/archive/d0d18ec47c57e1b0-thumb.webp"
  },
  "no-job-too-small": {
    "title": "No Job Too Small",
    "subtitle": "An oversized intern turns a tiny office into a physics playground.",
    "year": 2024,
    "discipline": "game developer",
    "overview": "Play an oversized intern in a tiny 90s office, where ordinary tasks turn into physical comedy.",
    "role": "Lead Coder · LookAway Games",
    "stack": "Unity · C# · Unity physics · Game state · HLSL · Blender assets",
    "hoverImage": "/projects/archive/5a1a1354617ad71c-thumb.webp"
  },
  "drag-task": {
    "title": "Drag Task In - Personal Schedule Assistant",
    "subtitle": "Drag-and-drop schedule builder",
    "year": null,
    "discipline": "full stack engineer",
    "overview": "A drag-and-drop schedule builder with offline editing, cross-device sync, and a clean printable view.",
    "role": "Full Stack Developer",
    "stack": "React · @dnd-kit · Offline state · FastAPI · Supabase · Tailwind CSS · Print styles",
    "hoverImage": "/projects/archive/de475d8b43887fc3-thumb.webp"
  },
  "flerken": {
    "title": "Marvel’s Flerken AR Filter",
    "subtitle": "An official cat-detection effect for The Marvels.",
    "year": 2023,
    "discipline": "xr developer",
    "overview": "An official campaign effect for The Marvels: detect a cat in the camera feed and transform it into a Flerken.",
    "role": "AR Developer · Moviebill / Really AR",
    "stack": "Object detection · JavaScript · HLSL · Visual effects · Lens Studio · Effect House · AR interaction · Camera feedback",
    "hoverImage": "/projects/archive/2269d0ded11b276a-thumb.webp"
  },
  "curtain-hook": {
    "title": "No-Drill Curtain Hook",
    "subtitle": "Renter-Friendly Compression-Fit Curtain Solution",
    "year": 2024,
    "discipline": "robotics engineer / 3d & simulation designer",
    "overview": "A two-part curtain hook that locks into the ceiling–wall seam with compression, without drilling or adhesive.",
    "role": "Mechanical Design · CAD · Rapid Prototyping",
    "stack": "Physical inspection · Mechanical design · Fusion 360 · Parametric CAD · FDM printing · Tolerance testing · PLA",
    "hoverImage": "/projects/archive/eee41b6c85ec68be-thumb.webp"
  },
  "vr-quest": {
    "title": "VR Experience on Oculus Quest",
    "subtitle": "Spatial Object Manipulation and Embodied Interaction System",
    "year": null,
    "discipline": "spatial computing developer",
    "overview": "A Quest interaction demo combining six-degree-of-freedom object manipulation with spatial memory tasks.",
    "role": "XR Developer",
    "stack": "Unity · XR Interaction Toolkit · C# · Spatial interaction · Unity physics · Collision detection · Oculus Quest · Unity XR",
    "hoverImage": "/projects/archive/81d4229dee407180-thumb.webp"
  },
  "city-posters": {
    "title": "3D Poster Design with Landmarks",
    "subtitle": "Blender + Google Maps Data — City Landmarks at Local Time of Day",
    "year": 2024,
    "discipline": "3d & simulation designer",
    "overview": "A1 city posters that turn real map data into realistic and graphic 3D views, lit for each city’s local time of day.",
    "role": "3D Artist",
    "stack": "Google Maps API · Blender · 3D composition · HDRI · Custom lighting · A1 layout · Rendering",
    "hoverImage": "/projects/archive/f1b3ee87d42d35fb-thumb.webp"
  },
  "teddy-bear": {
    "title": "3D Modeled Teddy Bear",
    "subtitle": "Soft forms, subdivision, and fabric-like materials.",
    "year": 2023,
    "discipline": "3d & simulation designer",
    "overview": "A Blender character study focused on soft toy proportions, subdivision, and fabric-like shading.",
    "role": "3D Sculpting",
    "stack": "Blender · Proportional editing · Subdivision modifiers · Mesh topology · Blender materials · Shading · Lighting · Rendering",
    "hoverImage": "/projects/archive/6590baa5ee0463a0-thumb.webp"
  },
  "portfolio-website": {
    "title": "Portfolio Website",
    "subtitle": "The original portfolio and its content-editing system.",
    "year": 2025,
    "discipline": "full stack engineer / frontend developer",
    "overview": "The previous portfolio: a responsive, content-driven site with project discovery, rich media pages, and an editing interface.",
    "role": "Frontend Development · UI/UX Design",
    "stack": "React · TypeScript · React Router · Material UI · Emotion · Node.js · Express · Multer · WebGL2 · Vite · React Query",
    "hoverImage": "/projects/archive/182a12db379c62e7-thumb.webp"
  },
  "spaceman": {
    "title": "Spaceman Rescue",
    "subtitle": "Space-themed adventure with innovative gameplay mechanics",
    "year": 2025,
    "discipline": "3d designer / game developer",
    "overview": "A space-themed adventure connecting narrative, puzzles, and a 3D world built in Unity and Blender.",
    "role": "3D Modeling · Narrative Design · Unity Development",
    "stack": "Unity · C# · Narrative design · Game design · Blender · Level composition · Visual iteration",
    "hoverImage": "/projects/archive/e52dd2c77eac6285-thumb.webp"
  },
  "vr-magic": {
    "title": "VR Magic",
    "subtitle": "Hand Tracking and Gesture-Driven Spatial Interaction in VR",
    "year": 2025,
    "discipline": "xr developer / 3d designer",
    "overview": "A VR spellcasting experiment where hand gestures trigger visual effects and spatial sound.",
    "role": "VR Developer · Visual Effects",
    "stack": "Unity · C# · Hand tracking · Real-time VFX · Spatial audio · Event feedback · VR interaction · 3D modeling",
    "hoverImage": "/projects/archive/aaa266765af83164-thumb.webp"
  },
  "dragon-roaster": {
    "title": "Dragon Roaster",
    "subtitle": "Control a dragon’s fire with webcam body tracking.",
    "year": 2021,
    "discipline": "xr developer / 3d designer",
    "overview": "A PC game where webcam body tracking controls a dragon’s fire: roast the meat and avoid burning the watermelon.",
    "role": "Unity Developer · Motion-Based Interaction",
    "stack": "Unity · Webcam body tracking · C# · Pose-angle mapping · Game logic · Unity Barracuda · Code integration",
    "hoverImage": "/projects/archive/bcbd8d3ca0e808f2-thumb.webp"
  },
  "vr-chess": {
    "title": "VR Chess",
    "subtitle": "Controller-free hand tracking on a life-sized chessboard.",
    "year": 2021,
    "discipline": "xr developer / game developer",
    "overview": "An Oculus Quest chess prototype using controller-free hand gestures to grab and drop life-sized pieces in a virtual room.",
    "role": "VR Developer · Unity Developer",
    "stack": "Blender · Unity · Oculus Quest · Hand tracking · C# · VR interaction · Quest testing",
    "hoverImage": "/projects/archive/55cfccafcbc18f7e-thumb.webp"
  },
  "shaders": {
    "title": "My Shader Projects",
    "subtitle": "GPU Programming and Math-Driven Real-Time Rendering",
    "year": 2025,
    "discipline": "3d designer / game developer",
    "overview": "Eleven GLSL experiments in procedural patterns, signed-distance shapes, lighting, noise, and animation, running directly in a WebGL2 canvas.",
    "role": "Shader Programming · Graphics Development",
    "stack": "GLSL · ShaderToy · WebGL2 · JavaScript · GLSL uniforms · GPU rendering · IntersectionObserver · DPR cap 2",
    "hoverImage": null
  },
  "magic-wand": {
    "title": "Magic Wand · Cartoon Shader",
    "subtitle": "A custom toon material, from color ramps to outlines.",
    "year": 2024,
    "discipline": "3d & simulation designer",
    "overview": "A stylized Blender wand with a custom toon shader, stepped lighting, and an inverted-hull outline.",
    "role": "3D Modeling · Shader Development",
    "stack": "Blender nodes · Color ramps · Fresnel · Shader nodes · Inverted hull · Mesh normals · Eevee · Emission",
    "hoverImage": "/projects/archive/97c83a6ba6a938cc-thumb.webp"
  },
  "procedural-modeling": {
    "title": "Procedural Modeling in Blender",
    "subtitle": "One node graph, adjustable buildings and structures.",
    "year": 2024,
    "discipline": "3d & simulation designer",
    "overview": "Procedural buildings and abstract structures generated entirely through Blender Geometry Nodes.",
    "role": "Procedural Modeling · Generative Design",
    "stack": "Geometry Nodes · Curve extrusion · Instancing · Random fields · Math nodes · Noise fields · Group inputs · Parametric design",
    "hoverImage": "/projects/archive/bea44128b566a955-thumb.webp"
  },
  "chess-scene": {
    "title": "Chess Scene · VR Modeling",
    "subtitle": "Model on desktop, refine the scale from inside VR.",
    "year": 2021,
    "discipline": "3d & simulation designer / spatial computing developer",
    "overview": "A chess room modeled in Blender and reviewed inside Oculus Quest to refine human-scale proportions.",
    "role": "3D Modeling · VR Design",
    "stack": "Blender · Scene modeling · Oculus Quest · VR review · Scale validation · Spatial design · Design iteration",
    "hoverImage": "/projects/archive/66033bb4462b69ef-thumb.webp"
  },
  "bowling-scene": {
    "title": "Bowling Scene",
    "subtitle": "Material contrast, atmospheric light, and impact motion.",
    "year": 2023,
    "discipline": "3d & simulation designer",
    "overview": "A stylized bowling alley rendered around glossy lanes, warm overhead lights, and the energy of a strike.",
    "role": "3D Modeling · Lighting · Post-Processing",
    "stack": "Blender · Material nodes · Area lighting · Reflections · Eevee · Motion blur · Compositor · Bloom",
    "hoverImage": "/projects/archive/ede1434fd7f2f19a-thumb.webp"
  },
  "door-stop": {
    "title": "Door Stop · Functional 3D Design",
    "subtitle": "A parametric TPU wedge tested on real doors and floors.",
    "year": 2025,
    "discipline": "robotics engineer / 3d & simulation designer",
    "overview": "A custom TPU door stop designed around door gap, floor grip, and flexible compression.",
    "role": "Mechanical Design · CAD · 3D Printing",
    "stack": "Fusion 360 · Parametric CAD · TPU · Ribbed geometry · FDM printing · PrusaSlicer · Fit testing · Material testing",
    "hoverImage": "/projects/archive/4d2c5d7d38d28123-thumb.webp"
  }
}

export const appendedProjectSlugs = ["glass-bridge", "just-another-day", "ping-pong", "teddy-bear", "portfolio-website", "dragon-roaster", "vr-chess", "magic-wand", "procedural-modeling", "chess-scene", "bowling-scene", "door-stop"]
