# Design Brief: Robotics Engineer Portfolio Reframe

## 1. What Changed and Why

The portfolio content has been rewritten to position Lingyi Zhou as a **Robotics & Spatial Computing Engineer** rather than a general XR/game developer. This targets robotics engineering roles by reframing existing projects through the lens of robotics-relevant skills.

### Site-level changes
- **Title/Description**: Now reads "Robotics & Spatial Computing Engineer"
- **Job Title**: Changed from "Software Engineer @ Artly.ai" to "Robotics & XR Engineer"
- **Bio**: Each line now highlights robotics-adjacent skills (perception, hand tracking, real-time CV, spatial interaction)
- **Keywords**: Added robotics, teleoperation, URDF, computer vision, simulation, CAD, MediaPipe, etc.
- **Roles**: Restructured from XR/Game/3D/Full Stack/Graphic to: Robotics Engineer, Perception & CV Engineer, Spatial Computing Developer, Full Stack Engineer, 3D & Simulation Designer

### Project content changes
All project summaries, subtitles, rolesOrSkills, and categories were updated. Rich content (richContent.json) was rewritten for Tier 1 and Tier 2 projects with specific technical language around perception pipelines, kinematic mapping, URDF, physics simulation, and CAD prototyping.

---

## 2. Project Tiers and Visual Prominence

### Tier 1 -- Flagship (should be most visually prominent)
- **ID 28: Robot Hand Real-Time Teleoperation Interface** -- THE lead project. Full perception-to-actuation pipeline. Should be hero/featured with maximum visual weight.
- **ID 02: AR Drawing Tool** -- Real-time hand tracking to procedural geometry. Snap Inc. internship credibility.
- **ID 04: No-Drill Curtain Hook** -- Physical hardware. CAD + 3D printing. Shows "builds real things."

### Tier 2 -- Supporting narrative
- **ID 08: VR Experience on Oculus Quest** -- Spatial manipulation, pick-and-place.
- **ID 27: CuraLoop** -- AI pipeline, real-time data processing, human-in-the-loop.
- **ID 23: B612 Soccer** -- Custom physics engine, simulation skills. Top 2% ranking adds credibility.

### Tier 3 -- Light reframe (subtitle/summary only)
- **ID 19: VR Magic** -- Hand tracking, gesture recognition
- **ID 21: VR Chess** -- Spatial reasoning, 6-DOF manipulation
- **ID 25: Marvel's Flerken** -- Real-time object detection, production CV
- **ID 24: Shader Projects** -- GPU programming, math-driven rendering

---

## 3. Layout and Design Recommendations

### Hero / Header Section
- The hero should lead with the title "Robotics & Spatial Computing Engineer" prominently
- Consider a tagline like: "Building real-time perception, teleoperation, and simulation systems"
- The animated avatar/gif is fine, but if possible, show the Robot Hand project inline or as background
- Bio lines should be visible without scrolling -- they now carry robotics signal

### Featured Projects / Home Page
- **Project 28 (Robot Hand) should always be the first and largest card.** It has a YouTube embed and live simulation iframe -- both should be easy to access.
- Consider a "Featured Project" section that gives project 28 a full-width card or hero treatment, separate from the grid.
- Tier 1 projects (28, 02, 04) should appear before Tier 2 and 3.

### Sidebar / About Section
- The `roles` array now starts with "Robotics Engineer" -- this should be the most visually prominent role
- Consider adding a **"Core Skills"** section that pulls from the keywords or roles to display: Teleoperation, Computer Vision, URDF, CAD/3D Printing, Physics Simulation, Real-Time Systems
- Skills should feel like tags/badges, not a wall of text

### ProjectCard Component
- Cards for Tier 1 projects should visually distinguish themselves (larger, bordered, or badged as "Featured")
- The `rolesOrSkills` chips are now robotics-specific (e.g., "Teleoperation", "URDF", "Kinematic Mapping") -- make sure these render clearly as they carry a lot of signal for recruiters scanning quickly
- The `categories` field now uses the new role names (e.g., "Robotics Engineer", "Perception & CV Engineer") -- these should map to filter options if filtering exists

### ProjectDetail Page
- The richContent sections (Overview, Approach, Takeaway) have been rewritten with technical depth. The Approach section uses bullet lists -- ensure these render cleanly with good spacing.
- For project 28, the live simulation iframe and YouTube embed should both be prominently accessible, not buried in a gallery.

### General
- The overall color/design language doesn't need to change drastically, but consider a slightly more technical/engineering aesthetic vs. a creative portfolio look if feasible (clean lines, monospace accents, technical diagram style)
- Mobile: ensure the hero text and featured project are legible and the role chips don't wrap awkwardly on small screens

---

## 4. Specific Component Suggestions

### Home Page Header
- Primary: "Lingyi Zhou"
- Secondary: "Robotics & XR Engineer"
- Tertiary: Bio lines (now with robotics framing)

### Sidebar
- Lead with "Robotics Engineer" role
- Add a visual skills section with the top 6-8 keywords as badges
- Social links are fine as-is

### ProjectCard
- Show `rolesOrSkills` as colored chips/badges
- Tier 1 cards should be visually distinct (size, border, or "Featured" badge)
- `shortSubtitle` is now more technical -- ensure it doesn't get truncated on cards

### ProjectDetail
- Ensure richContent HTML renders bullet lists and paragraphs with good typography
- For project 28: consider a split layout with the live iframe on one side and the overview text on the other
