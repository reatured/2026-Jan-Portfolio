# Portfolio Content Review & Proposed Updates

**Date:** 2026-03-19
**Reviewer:** Content Writer Agent
**Source Data:** `config/data.json` (17 projects) + Cargo site (`lingyizhou.cargo.site`) original content

---

## Part A: Clarifications Needed from User

### Missing or Uncertain Information

1. **Hardware Store Smart Search — year and status missing**
   - The Cargo page mentions a client ("James Hardware") and a PostgreSQL database. What year was this built? Is it still live? Should status be "Completed" or "Live"?

2. **Drag Task In — year and status missing**
   - When was this built? Is it still being developed or complete?

3. **No-Drill Curtain Hook — year and status missing**
   - When was this made? Is there an STL file available for download that should be linked?

4. **Just Another Day — year and status missing**
   - Cargo says "2022–2023 (Thesis project)". Should the year field be "2022–2023"? Was this a Parsons MFA thesis?

5. **VR Experience — year and status missing**
   - When was this Oculus Quest project built? Was it for a class at Parsons or Columbia?

6. **Creative Coding — year and status missing**
   - When were these sketches created? Are there live links to the p5.js editor sketches?

7. **3D Poster Design — year and status missing**
   - When was this series created?

8. **3D Teddy Bear — year and status missing**
   - When was this sculpting exercise done?

9. **Ping Pong Game — section placement**
   - Currently in "Most Recent" but it's from 2021. Should it be in "Archive"?

10. **Marvel's Flerken — missing links**
    - Are there public links to the TikTok filter or any social media posts showing the campaign? The Cargo page mentions Regal Cinema's TikTok channel.

11. **B612 Soccer — missing itch.io play link**
    - The GMTK jam page is linked, but is there a direct play link on itch.io (like `reatured.itch.io/b612-soccer`)?

12. **Robot Hand — GitHub repo link missing**
    - Is there a public GitHub repo for this project? Currently only has the live simulation and YouTube demo.

13. **Section assignments for older projects**
    - Several projects from 2021–2023 are in "Most Recent". Should any of these move to "Archive"? Candidates:
      - Ping Pong Game (2021)
      - Just Another Day (2022–2023)
      - VR Experience (year unknown)
      - Creative Coding (year unknown)
      - 3D Poster Design (year unknown)
      - 3D Teddy Bear (year unknown)

14. **No Job Too Small — full team of 7**
    - Cargo lists 7 team members. Should the team be credited in the content? Currently the content only says "LookAway Games."

15. **Hardware Store — tech stack is incomplete**
    - Cargo mentions PostgreSQL, SQLAlchemy, Leaflet, Railway, and Google Maps API. Current data.json only has React, JavaScript, FastAPI, Python. Should these be added?

16. **Ping Pong Game — "No game engine, no external libraries, no AI assistance"**
    - Cargo emphasizes this was built from scratch with zero libraries or AI. Should this be highlighted more prominently?

---

## Part B: Proposed Content Updates

---

### 1. Robot Hand Real-Time Teleoperation Interface

**Current issues:** Content is 1040 chars — very thin for the lead project. Reads like a feature list without storytelling. Missing context about dual control modes, GLB/GLTF support, and shadcn/ui.

**Proposed `content` HTML:**

```html
<div>
  <h2>Real-Time 3D Robot Hand Control</h2>
  <p>This project explores a question: can you control a robotic hand using nothing but a webcam and a browser? No drivers, no SDK installs, no hardware tethering — just open a URL and start moving your fingers.</p>
  <p>The platform uses <b>MediaPipe Hands</b> to track 21 keypoints on your hand via webcam, then maps those positions to joint angles on 3D robotic hand models rendered with <b>Three.js</b> and <b>React Three Fiber</b>. The mapping works across <b>31 different robotic hand models</b> loaded from URDF and GLB/GLTF files.</p>

  <h3>Two Control Modes</h3>
  <p>The interface offers dual control: <b>camera-based hand tracking</b> for natural gesture input, and <b>manual sliders</b> for precise joint-by-joint articulation. Users can switch between modes or combine them depending on the task.</p>

  <h3>How It Works</h3>
  <ol>
    <li>Webcam feed is processed by MediaPipe's AI model to extract 21 hand keypoints in real time</li>
    <li>Keypoint positions are converted into joint rotation angles</li>
    <li>Angles are applied to the currently selected robotic hand model via URDF joint mapping</li>
    <li>Three.js renders the result at interactive framerates — no server round-trip needed</li>
  </ol>

  <h3>Why Browser-Based?</h3>
  <p>Most robotic teleoperation systems require specialized hardware or native applications. By running entirely in the browser, this tool lowers the barrier to entry for robotics researchers, educators, and hobbyists. The zero-installation approach means anyone with a webcam can start experimenting immediately.</p>

  <h3>Technical Decisions</h3>
  <ul>
    <li><b>Zustand</b> for state management — lightweight and fast enough for real-time updates at 30+ FPS</li>
    <li><b>React Three Drei</b> for camera controls and scene helpers, keeping the 3D code declarative</li>
    <li><b>URDF parsing</b> to load standard robot description files directly, supporting a wide range of hand models without custom adapters</li>
    <li><b>GitHub Actions CI/CD</b> for automated deployment to Vercel on every push</li>
  </ul>
</div>
```

**Other proposed changes:**
- `techStack`: Add `"shadcn/ui"` to "UI & Build" skills. Add `"GLB/GLTF"` to "3D Graphics" skills.
- `rolesOrSkills`: Add `"Robotics"` — this is a robotics project, not just a graphics demo.

---

### 2. B612 Soccer

**Current issues:** Content is decent at 2300 chars but missing key details from Cargo: the specific GMTK category rankings, the fact it was built in only 2 days (not the full 4-day jam), multi-ball chaos mechanic, 100-second matches, hand-drawn assets scanned with a printer.

**Proposed `content` HTML:**

```html
<div>
  <h2>A Soccer Game on a Tiny Planet</h2>
  <p>B612 Soccer is a local 2-player soccer game set on a looping spherical world, inspired by the asteroid from <em>The Little Prince</em>. Kicked balls don't stop at the edge — they orbit the entire planet, leading to unexpected ricochets and goals from behind.</p>
  <p>Created as a <b>solo entry for GMTK Game Jam 2025</b>, with only <b>2 days out of the 4-day jam</b> to design, build, illustrate, and submit the entire project.</p>

  <h3>GMTK 2025 Rankings</h3>
  <table>
    <thead>
      <tr><th>Category</th><th>Rank</th><th>Score</th></tr>
    </thead>
    <tbody>
      <tr><td><b>Overall</b></td><td><b>Top 2%</b> of 3,300+ entries</td><td>—</td></tr>
      <tr><td>Audio</td><td>#122</td><td>4.146</td></tr>
      <tr><td>Enjoyment</td><td>#158</td><td>4.195</td></tr>
      <tr><td>Artwork</td><td>#219</td><td>4.439</td></tr>
      <tr><td>Creativity</td><td>#238</td><td>4.341</td></tr>
      <tr><td>Narrative</td><td>#392</td><td>3.756</td></tr>
    </tbody>
  </table>

  <h3>Theme Interpretation: "Loop"</h3>
  <p>The interpretation was literal — the planet is small enough that physics wraps around it. The ball orbits continuously, players run 360 degrees around the surface, and the side-view perspective creates a unique polar physics system unlike any traditional soccer game.</p>

  <h3>Core Mechanics</h3>
  <ul>
    <li><b>360-degree movement</b> around the full planet surface</li>
    <li><b>Directional kicking</b> that adds momentum to the ball's orbit</li>
    <li><b>Multi-ball chaos</b> — up to 6 balls in play simultaneously</li>
    <li><b>100-second matches</b>, first to 10 goals wins</li>
    <li><b>Natural ball orbiting</b> with bounce and wrapping physics</li>
  </ul>

  <h3>Art & Audio</h3>
  <p>Every sprite, UI element, and background was <b>hand-drawn in pencil</b>, scanned with a printer, and processed in Photoshop. The minimalist black-and-white line art against a blue space backdrop gives the game a storybook aesthetic. Audio was composed and mixed during the jam.</p>

  <h3>Solo Development</h3>
  <p>Every aspect — game design, Unity programming, 2D illustration, audio production, and playtesting — was handled by one person in 48 hours. The constraint of working solo pushed creative problem-solving and forced ruthless prioritization of what made the game fun.</p>
</div>
```

**Other proposed changes:**
- `rolesOrSkills`: Change to `["Solo Developer", "Game Design", "2D Art", "Audio"]` — the solo nature means all roles were covered.

---

### 3. Hardware Store Smart Search

**Current issues:** 1422 chars, thin. Missing the real-world business context (James Hardware client), PostgreSQL, SQLAlchemy, Leaflet, Railway, Google Maps API, streaming results, analytics dashboard.

**Proposed `content` HTML:**

```html
<div>
  <h2>Finding Hardware Store Leads Worldwide</h2>
  <p>While working for a hardware manufacturer, the sales team needed a scalable way to identify potential retail customers — hardware stores — across different markets. Manual searching on Google Maps was slow and produced duplicates. This tool automates the entire pipeline from search to outreach.</p>

  <h3>The Problem</h3>
  <p>Hardware manufacturers sell through retail stores, but finding the right stores in new markets is tedious. You search "hardware stores in Berlin," get results mixed with duplicates and irrelevant listings, and still need to research each one before making contact.</p>

  <h3>How It Works</h3>
  <ol>
    <li>Pin a location on the interactive map and select a search radius</li>
    <li>The backend geocodes the area and queries Google Places API</li>
    <li>Results stream live to the frontend with a progress indicator</li>
    <li>Automatic deduplication removes repeated listings (e.g., the same Home Depot showing up multiple times)</li>
    <li>Results are cached in PostgreSQL — repeat searches for the same area return instantly</li>
    <li>Perplexity API analyzes each store for relevance, contact info, and business context</li>
    <li>Generate cold outreach emails tailored to each store's profile</li>
  </ol>

  <h3>Evolution</h3>
  <ul>
    <li><b>v1.0</b> — Basic search with results displayed on a Leaflet map</li>
    <li><b>v3.0</b> — Full pipeline: streaming bulk search, AI-powered company analysis, deduplication, persistent caching, cold email generation, and analytics dashboard tracking most-searched cities</li>
  </ul>

  <h3>Real-World Impact</h3>
  <p>Built for actual business use — not a demo project. The tool replaced hours of manual Google Maps browsing with an automated workflow that surfaces qualified leads and drafts first-contact emails, letting the sales team focus on relationship building instead of data entry.</p>
</div>
```

**Other proposed changes:**
- `techStack`: Replace current with:
  ```json
  [
    {"category": "Frontend", "skills": ["React", "Leaflet", "JavaScript"]},
    {"category": "Backend", "skills": ["FastAPI", "Python", "SQLAlchemy"]},
    {"category": "Database", "skills": ["PostgreSQL"]},
    {"category": "APIs", "skills": ["Google Maps API", "Perplexity API"]},
    {"category": "Deployment", "skills": ["GitHub Pages", "Railway"]}
  ]
  ```
- Add `year` and `status` fields (needs user input for year).

---

### 4. AR Drawing Tool (Snap Inc. Internship)

**Current issues:** 1280 chars — far too thin for a Snap internship project with 200K+ plays. Missing key details: Snap Spectacles support, customizable stroke textures (paint/neon/ribbon/particle), gesture-based erasing/sculpting, the fact this was a first-of-its-kind feature.

**Proposed `content` HTML:**

```html
<div>
  <h2>Drawing in 3D Space with Your Hands</h2>
  <p>During my 2022 internship at Snap Inc., I developed an experimental AR experience that lets users draw in three-dimensional space using hand gestures alone — no controllers, no stylus, just hands tracked through the camera.</p>
  <p>This was a <b>first-of-its-kind feature</b> in Lens Studio. Nobody had combined procedural mesh generation with hand tracking for spatial drawing before. The idea was to turn the air around you into a canvas.</p>

  <h3>How It Works</h3>
  <p>The system tracks hand positions through Lens Studio's hand tracking API and generates stroke geometry in real time as <b>procedural meshes</b>. As your finger moves through space, the system constructs triangle strips along the trajectory, creating smooth 3D ribbons that exist in the AR scene.</p>

  <h3>Creative Tools</h3>
  <ul>
    <li><b>Customizable stroke textures</b> — swap materials at runtime to draw with paint, neon glow, ribbons, or particle effects without modifying the underlying code</li>
    <li><b>Gesture-based erasing</b> — switch tool modes with hand gestures to selectively remove strokes, effectively sculpting your drawing in space</li>
    <li><b>Multi-platform support</b> — works on both Lens Studio mobile AR and Snap Spectacles</li>
  </ul>

  <h3>Impact</h3>
  <ul>
    <li><b>200,000+ plays</b> in the first month after the AR filter was published</li>
    <li><b>Published official Lens Studio assets</b> that reduced setup time by 80% (from 1 week to less than 1 day) for other developers building similar experiences</li>
    <li><b>Authored official developer documentation</b> for Snap's procedural mesh feature, which continues to be referenced by the AR developer community</li>
  </ul>

  <h3>Legacy</h3>
  <p>The work informed Snap's official procedural mesh documentation and inspired future spatial drawing interactions on the platform. The published assets and guides continue to help AR developers build similar experiences on Snapchat.</p>
</div>
```

**Other proposed changes:**
- `techStack`: Add `"Snap Spectacles"` to Platform skills.
- `rolesOrSkills`: Change to `["AR Engineer", "Technical Writer"]` — the documentation work was a significant deliverable.

---

### 5. Ping Pong Game

**Current issues:** 1118 chars. Missing the personal story (20 years of competitive play, pro leagues in China, Columbia championship). Missing the key technical achievement: built from scratch with NO game engine, no external libraries, no AI. Missing capsule collider details, mouse controls.

**Proposed `content` HTML:**

```html
<div>
  <h2>A Personal Project, 20 Years in the Making</h2>
  <p>I've played ping pong for over 20 years — nearly a decade competing in professional leagues in China, and later winning a championship at Columbia University. Building a digital version of the sport I love was both a technical challenge and a deeply personal project.</p>

  <h3>Built from Scratch</h3>
  <p>This game was built with <b>no game engine, no external libraries, and no AI assistance</b>. Everything — physics, collision detection, scene management, rendering, audio — is hand-written JavaScript running on p5.js's canvas API.</p>

  <h3>The 3D Illusion</h3>
  <p>The game presents a convincing 3D perspective of a ping pong table, but it runs entirely in 2D. The depth effect is achieved through a <b>custom 3D-to-2D projection system</b> — no WebGL, no Three.js, just math translating 3D coordinates to screen positions on a flat canvas.</p>

  <h3>Technical Highlights</h3>
  <ul>
    <li><b>Custom capsule collider</b> — the hitting zone is visualized as a capsule around the paddle. The ball only returns if it connects within this zone, creating a skill-based mechanic</li>
    <li><b>Unity-style scene manager</b> — I built a scene management system in pure p5.js inspired by how Unity handles game scenes, with clean transitions between menus, gameplay, and game-over states</li>
    <li><b>Modular class-based architecture</b> — refactored from initial prototype code into clean, separated modules for physics, rendering, input, and AI</li>
    <li><b>AI opponent</b> with adjustable difficulty that provides a genuine challenge</li>
  </ul>

  <h3>How to Play</h3>
  <p>Click to serve. Control your paddle with the mouse. The capsule visualization shows your hitting area — time your swings to connect with the ball as it crosses the net.</p>
</div>
```

---

### 6. No Job Too Small (GMTK 2024 — Top 1%)

**Current issues:** 1205 chars — way too thin for a Top 1% GMTK game. Missing the destruction meter mechanic ("Gentle Giant" to "Bull in a China Shop"), 7-person team breakdown, and Lingyi's specific role as Lead Programmer.

**Proposed `content` HTML:**

```html
<div>
  <h2>GMTK Game Jam 2024 — Top 1% of 3,300+ Entries</h2>
  <p>What if the problem isn't that you're too small for the job, but that you're way too big? <b>No Job Too Small</b> flips the GMTK 2024 theme "Build to Scale" on its head: instead of building things to scale, <em>you</em> are the scale problem.</p>

  <h3>The Concept</h3>
  <p>You play as a comically oversized intern navigating a cramped 90s-style office. Every mundane task — filing papers, making coffee, answering the phone — becomes a physics-based puzzle because you can barely fit through the doorways. Do you tiptoe carefully, or just smash through everything?</p>

  <h3>The Destruction Meter</h3>
  <p>The game tracks your behavior with a destruction meter, scoring your performance on a spectrum from <b>"Gentle Giant"</b> to <b>"Bull in a China Shop."</b> Both approaches are valid — you can complete every task through careful maneuvering or gleeful demolition.</p>

  <h3>Key Features</h3>
  <ul>
    <li><b>Physics-driven gameplay</b> — every object in the office reacts to your oversized body</li>
    <li><b>Multiple solution paths</b> — brute force and delicate precision are both valid strategies for every task</li>
    <li><b>90s office aesthetic</b> — low-poly retro-futuristic art style with nostalgic charm</li>
    <li><b>Custom shaders</b> written in HLSL for visual polish</li>
  </ul>

  <h3>Team & My Role</h3>
  <p>Developed under the <b>LookAway Games</b> team with 7 members. I served as <b>Lead Programmer</b>, responsible for core gameplay systems, physics interactions, and game architecture in Unity/C#.</p>
  <ul>
    <li>Aaron A — Sound Design</li>
    <li>Alice O — Motion Graphics & UX/UI</li>
    <li>Guy D — Programming</li>
    <li>Ilan S — Production & Game Design</li>
    <li>Jonathan W — Music Composition</li>
    <li>Kaiqi Y — Lead 3D Art</li>
    <li><b>Lingyi Z — Lead Programming</b></li>
  </ul>
</div>
```

**Other proposed changes:**
- `rolesOrSkills`: Change to `["Lead Programmer", "Physics Systems"]` — more specific than "Unity Developer."

---

### 7. Drag Task In — Personal Schedule Assistant

**Current issues:** 911 chars — very thin. Missing user authentication, data backup/restore via JSON, the planned roadmap (JWT, PostgreSQL migration), and the context that this was a rapid prototyping exercise.

**Proposed `content` HTML:**

```html
<div>
  <h2>Built in Under 4 Hours</h2>
  <p>Drag Task In started as a challenge: could I build a fully functional, syncing schedule app in a single sitting? The answer was yes — the first version was designed and developed in under 4 hours.</p>

  <h3>The Idea</h3>
  <p>The goal was to create a tool that feels as natural as moving sticky notes on a desk. No complex menus, no configuration screens — just drag tasks where they belong and get on with your day.</p>

  <h3>Core Features</h3>
  <ul>
    <li><b>Drag-and-drop scheduling</b> — intuitive task placement using @dnd-kit with smooth animations</li>
    <li><b>Real-time sync</b> — changes propagate across devices automatically via Supabase</li>
    <li><b>Offline support</b> — works without internet and syncs seamlessly when reconnected</li>
    <li><b>User authentication</b> — email verification for secure, personalized schedules</li>
    <li><b>Data backup & restore</b> — export/import your schedule as JSON</li>
    <li><b>Print-ready layout</b> — generate clean views for physical planning</li>
  </ul>

  <h3>What I Learned</h3>
  <p>This project was a stepping stone toward building robust backends. The rapid prototype validated the UX concept, and the planned next iteration includes JWT-based authentication, PostgreSQL migration, and a fully scalable RESTful API for production use.</p>
</div>
```

---

### 8. Marvel's Flerken AR Filter

**Current issues:** 961 chars — far too thin for an official movie marketing campaign. Missing HLSL shader details, tentacle animation and particle effects, the fact it drove real marketing outcomes, cross-platform distribution strategy.

**Proposed `content` HTML:**

```html
<div>
  <h2>Official AR Campaign for The Marvels (2023)</h2>
  <p>During my time at Moviebill/Really AR, I developed an interactive AR filter for the theatrical release of <b>The Marvels</b>. The filter transforms real cats into Flerkens — the tentacle-sprouting alien creatures from the Marvel Cinematic Universe — using real-time object detection and custom visual effects.</p>

  <h3>How It Works</h3>
  <p>The filter uses <b>machine learning-based cat detection</b> to identify and track cats in the camera feed. Once detected, the system applies a Flerken transformation with dynamic visual effects: tentacle animations, particle systems, and Marvel-themed overlays — all rendered in real time using <b>custom HLSL shaders</b>.</p>

  <h3>Cross-Platform Distribution</h3>
  <p>The campaign required reaching audiences across multiple platforms, so the filter was built and deployed on two separate AR frameworks:</p>
  <ul>
    <li><b>TikTok</b> via Effect House — distributed through Regal Cinema's TikTok channel for social media reach</li>
    <li><b>Snapchat</b> via Lens Studio — integrated into the Regal Cinema app for in-theater promotion</li>
  </ul>

  <h3>Technical Challenges</h3>
  <ul>
    <li><b>Real-time cat detection</b> — accurate tracking that handles multiple cats, different breeds, and varying lighting conditions</li>
    <li><b>Performance optimization</b> — maintaining high-quality visual effects while running smoothly on mobile devices</li>
    <li><b>Cross-platform parity</b> — achieving consistent visual quality across Lens Studio and Effect House, which have different rendering pipelines</li>
  </ul>

  <h3>Impact</h3>
  <p>The filter was a core component of the studio's digital marketing push for The Marvels theatrical release. It demonstrated how AR technology can create memorable, shareable brand interactions that extend a movie's promotion beyond traditional advertising into organic social media engagement.</p>
</div>
```

**Other proposed changes:**
- `rolesOrSkills`: Change to `["AR Developer", "Shader Developer"]` — HLSL shader work was a key part.

---

### 9. No-Drill Curtain Hook

**Current issues:** 1125 chars, generic. Missing the origin story (sticky hooks kept failing), the observation about the ceiling-wall seam, the compression-based load distribution, and the fact it's been holding up in real use.

**Proposed `content` HTML:**

```html
<div>
  <h2>A Renter's Frustration, Solved</h2>
  <p>In a rental apartment, you can't drill holes. Sticky hooks keep falling. But I noticed something: there's a tight seam between the ceiling and the wall — and if a hook could grip that seam, it wouldn't need adhesive or screws at all.</p>

  <h3>The Design</h3>
  <p>The hook is a <b>two-part modular system</b>. The first piece slides into the ceiling-wall seam and grips through compression. The second piece attaches to the first and provides the hanging point. The design distributes load through the seam rather than relying on adhesion, which is why sticky hooks fail under curtain weight.</p>

  <h3>Prototyping Process</h3>
  <ol>
    <li>Measured standard ceiling-wall gap dimensions across multiple rooms</li>
    <li>Modeled initial design in Fusion 360 with parametric dimensions</li>
    <li>3D printed first prototype in PLA and tested grip strength</li>
    <li>Iterated through several versions — adjusting wall thickness for durability, grip angle for easier installation, and hook geometry for different curtain rod sizes</li>
    <li>Final version: thick PLA walls, snap-together assembly, no tools required</li>
  </ol>

  <h3>Result</h3>
  <p>The hook has held up perfectly since installation — supporting standard curtain weight with zero wall damage. A practical example of combining close observation, 3D modeling, and rapid prototyping to solve everyday problems in renter-friendly ways.</p>
</div>
```

**Other proposed changes:**
- `rolesOrSkills`: Change to `["Product Design", "3D Printing"]`.
- Add `"3D Printing"` and `"PLA"` to techStack under a "Fabrication" category.

---

### 10. Just Another Day

**Current issues:** 1030 chars, thin. Missing the thesis project context, the stitching mechanic description (drag-and-sew with rope physics and vertex manipulation), the emotional narrative theme ("routine, memory, and the quiet unraveling of the self"), and the fact it was developed entirely solo.

**Proposed `content` HTML:**

```html
<div>
  <h2>A Game About Routine, Memory, and Letting Go</h2>
  <p><em>"A narrative-driven indie game about routine, memory, and the quiet unraveling of the self."</em></p>
  <p>Just Another Day is a thesis project composed of <b>five symbolic mini-games</b> that together tell an emotional story. Each mini-game represents a different emotional state in a daily routine, and the progression reveals a narrative that builds toward catharsis through subtle mechanical shifts.</p>

  <h3>The Stitching Mechanic</h3>
  <p>A recurring gameplay element ties the five segments together: a <b>drag-and-sew system</b> where players repair tears in 3D objects. The mechanic uses custom rope physics and real-time vertex manipulation — you literally stitch broken things back together. It works as both a gameplay tool and an emotional metaphor for mending wounds.</p>
  <ul>
    <li><b>Real-time vertex dragging</b> to guide the stitch path</li>
    <li><b>Auto-tightening rope physics</b> that simulate thread tension</li>
    <li><b>Progressive repair</b> — objects become whole again as you sew</li>
  </ul>

  <h3>Visual Design</h3>
  <p>Custom <b>HLSL shaders</b> drive the visual tone of each segment, shifting color palettes and post-processing effects to reflect the emotional state of each mini-game. Scene transitions maintain emotional continuity rather than using hard cuts.</p>

  <h3>Development</h3>
  <p>Developed entirely solo over 2022–2023 as a thesis project. Every aspect — game design, Unity programming, 3D modeling in Blender, shader development, and narrative design — was handled end-to-end by one person.</p>
</div>
```

**Other proposed changes:**
- `year`: Set to `"2022–2023"` (needs user confirmation).
- `status`: Set to `"Thesis Project"`.
- `rolesOrSkills`: Change to `["Solo Developer", "Narrative Design", "Shader Dev"]`.
- Add `"HLSL"` to techStack Engine skills.

---

### 11. VR Experience on Oculus Quest

**Current issues:** 1064 chars, generic. Missing layered audio triggers, context-sensitive narration, analytics integration for tracking user navigation, and the design challenge of balancing mobile VR performance with immersion.

**Proposed `content` HTML:**

```html
<div>
  <h2>Spatial Storytelling in VR</h2>
  <p>An immersive VR experience built for Oculus Quest that explores how interactive design can enhance emotional storytelling in virtual environments. Players navigate room-scale spaces, discover narrative elements through exploration, and interact with the world using hand controllers.</p>

  <h3>Design Approach</h3>
  <p>The core challenge was balancing <b>mobile VR performance constraints</b> with immersive design goals. Standalone Quest hardware has strict polygon, texture, and draw-call budgets — every visual decision had to serve both aesthetics and performance.</p>

  <h3>Key Features</h3>
  <ul>
    <li><b>Room-scale navigation</b> with both teleportation and smooth locomotion options for different comfort levels</li>
    <li><b>Interactive objects</b> — pick up, examine, and use items to progress through the narrative</li>
    <li><b>Layered audio triggers</b> — environmental sounds respond to player actions and position, creating spatial audio storytelling</li>
    <li><b>Context-sensitive narration</b> — visual and audio cues guide exploration through non-linear paths</li>
    <li><b>Analytics integration</b> — built-in tracking system monitors user navigation patterns through the experience</li>
  </ul>

  <h3>Technical Optimization</h3>
  <p>Optimized for standalone Quest performance: baked lighting where possible, LOD management for 3D assets, draw-call batching, and careful texture atlas usage to maintain visual quality within mobile GPU constraints.</p>
</div>
```

---

### 12. Creative Coding Experiments

**Current issues:** 865 chars — very thin and generic. No specific sketches are named or described.

**Proposed `content` HTML:**

```html
<div>
  <h2>Generative Art with p5.js</h2>
  <p>A collection of creative coding sketches exploring the intersection of code and visual expression. Each piece is a self-contained experiment — an idea explored from concept to finished visual in a single session.</p>

  <h3>Sketch Categories</h3>
  <ul>
    <li><b>Procedural pattern generators</b> — algorithmic visual patterns built on mathematical foundations, where small parameter changes produce dramatically different outputs</li>
    <li><b>Randomized grid art</b> — grid-based compositions that use controlled randomness to create unique variations on every run</li>
    <li><b>Color palette explorations</b> — experiments in color theory and harmony, generating palettes programmatically and applying them to geometric forms</li>
    <li><b>Rotation animations</b> — motion studies using trigonometric functions to create hypnotic, looping visual rhythms</li>
  </ul>

  <h3>Approach</h3>
  <p>The focus is on rapid experimentation over polish. Each sketch starts with a question — "what happens if I rotate every nth element?" or "can I make a grid feel organic?" — and the coding session becomes the answer. All sketches run in the browser via p5.js.</p>
</div>
```

---

### 13. 3D Poster Design with Landmarks

**Current issues:** 1065 chars, thin. Missing the atmospheric storytelling concept, the data visualization angle, and the fact these are high-resolution poster prints.

**Proposed `content` HTML:**

```html
<div>
  <h2>Cities Rendered in Light and Geometry</h2>
  <p>This poster series visualizes cities from around the world by importing real geographic data from Google Maps into Blender and rendering iconic landmarks in two distinct styles — photorealistic and graphically stylized.</p>

  <h3>The Concept</h3>
  <p>Each poster captures a city at a specific <b>time of day</b>. The lighting isn't arbitrary — it's matched to the local hour, using HDRIs and custom light rigs to reproduce the quality of morning, noon, or evening light at that latitude. The result is an atmospheric portrait of a place and a moment.</p>

  <h3>Dual Rendering Approach</h3>
  <ul>
    <li><b>Photorealistic pass</b> — detailed textures, accurate building geometry, and physically-based materials that ground the scene in reality</li>
    <li><b>Stylized pass</b> — simplified forms, flat colors, and graphic compositions that distill each city to its visual essence</li>
  </ul>

  <h3>Workflow</h3>
  <ol>
    <li>Extract building footprints and landmark positions from Google Maps API</li>
    <li>Import geographic data into Blender as base geometry</li>
    <li>Model and texture key landmarks with architectural detail</li>
    <li>Set up HDRI environment lighting matched to local time of day</li>
    <li>Add supplementary lights to highlight architectural features</li>
    <li>Render in both realistic and stylized passes</li>
    <li>Compose final high-resolution poster layouts for print</li>
  </ol>

  <h3>Cities Featured</h3>
  <p>The series includes Cologne, New York, Macau, San Francisco, and others — each chosen for distinctive architectural landmarks that translate well into both rendering styles.</p>
</div>
```

---

### 14. 3D Modeled Teddy Bear

**Current issues:** 618 chars — the thinnest content in the portfolio. Reads like a tooltip, not a project page.

**Proposed `content` HTML:**

```html
<div>
  <h2>A Sculpting Exercise in Softness</h2>
  <p>This teddy bear was modeled entirely in Blender as a personal exercise in organic sculpting — learning to create soft, rounded forms that feel tactile and approachable, even in a digital medium.</p>

  <h3>Modeling Approach</h3>
  <ul>
    <li><b>Primitive shapes as starting points</b> — the body, limbs, and head began as basic spheres and cylinders, shaped through proportional editing</li>
    <li><b>Subdivision surfaces</b> for smooth, rounded topology that reads as soft and plush</li>
    <li><b>Sculpt mode refinement</b> — Blender's sculpt tools for adding subtle surface detail like seam lines and fabric compression</li>
  </ul>

  <h3>Material & Shading</h3>
  <p>A basic fabric shader simulates plush textile appearance — the goal was to make the model look like something you could pick up and squeeze, not just a smooth 3D shape. The shader uses subsurface scattering and a fine noise texture to approximate woven fabric at render scale.</p>

  <h3>Takeaway</h3>
  <p>A small project, but an important one for developing comfort with organic modeling workflows. The skills practiced here — proportional editing, subdivision control, fabric shading — carry directly into character modeling and product visualization work.</p>
</div>
```

---

## Part C: Projects That Are Already Good

### 1. Snapchat Glass Bridge Challenge
**Status:** Already excellent at ~8,600 chars. Rich content with prototype progress recordings, system architecture diagrams, code samples, and development timeline. The inline layout with images is well-structured. The only concern is excessive inline styles that could conflict with the `.prose` CSS class, but this is a CSS issue, not a content issue.

**No content changes recommended.**

### 2. GoGreenNext - Modular Map Tiles
**Status:** Already thorough at ~10,700 chars. Comprehensive coverage of design goals, tile categories, workflow, and a large inline gallery. The content structure mirrors the Cargo page well.

**No content changes recommended.**

### 3. CuraLoop: AI Companion for Alzheimer's Care
**Status:** Already the most detailed at ~11,700 chars. Covers the problem/solution, core features with app screenshots, AI workflow, system architecture, and development challenges. Well-organized hackathon project writeup.

**No content changes recommended.**

---

## Summary Statistics

| Project | Current Chars | Status | Action |
|---------|--------------|--------|--------|
| Robot Hand | ~1,040 | Thin | **Rewrite** — add dual control modes, browser-first rationale |
| Snapchat Glass Bridge | ~8,650 | Good | No changes |
| GoGreenNext | ~10,690 | Good | No changes |
| CuraLoop | ~11,700 | Good | No changes |
| B612 Soccer | ~2,300 | Decent | **Enhance** — add GMTK rankings, multi-ball, 2-day constraint |
| Hardware Store | ~1,420 | Thin | **Rewrite** — add PostgreSQL, Leaflet, streaming, real-world context |
| AR Drawing Tool | ~1,280 | Thin | **Rewrite** — add Spectacles, stroke textures, erasing, legacy |
| Ping Pong Game | ~1,120 | Thin | **Rewrite** — add personal story, no-engine constraint |
| No Job Too Small | ~1,200 | Thin | **Rewrite** — add destruction meter, team credits |
| Drag Task In | ~910 | Thin | **Rewrite** — add auth, backup, roadmap |
| Marvel's Flerken | ~960 | Thin | **Rewrite** — add shader details, cross-platform strategy |
| No-Drill Hook | ~1,125 | Thin | **Rewrite** — add origin story, compression design |
| Just Another Day | ~1,030 | Thin | **Rewrite** — add stitching mechanic, thesis context |
| VR Experience | ~1,060 | Thin | **Rewrite** — add audio triggers, analytics, optimization |
| Creative Coding | ~865 | Very thin | **Rewrite** — expand sketch descriptions |
| 3D Poster Design | ~1,065 | Thin | **Rewrite** — add atmosphere concept, cities list |
| 3D Teddy Bear | ~618 | Very thin | **Rewrite** — add modeling approach, shader details |

**14 projects need content updates. 3 projects are already in good shape.**
