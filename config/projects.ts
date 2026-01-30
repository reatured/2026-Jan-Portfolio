import { Project } from '../types';

export const projects: Project[] = [
  // --- Current Projects ---
  {
    id: "28",
    slug: "real-time-3d-robot-hand-control",
    title: "Robot Hand Real-Time Teleoperation Interface",
    year: "2025",
    status: "Live",
    shortSubtitle: "Browser-based Hand Tracking for Robotic Hand Control",
    summary: "A real-time 3D visualization platform that uses webcam-based hand tracking to control robotic hand models entirely in the browser. Built with MediaPipe and Three.js, it tracks 21 hand keypoints via AI and maps them to 31 different robotic hand models with zero installation required.",
    categories: ["Full Stack Engineer", "XR Developer"],
    rolesOrSkills: ["Frontend", "Computer Vision", "3D Graphics"],
    techStack: [
      { category: "Frontend", skills: ["React 18", "Zustand"] },
      { category: "3D Graphics", skills: ["Three.js", "React Three Fiber", "React Three Drei", "URDF"] },
      { category: "Computer Vision", skills: ["MediaPipe Hands"] },
      { category: "UI & Build", skills: ["Radix UI", "Tailwind CSS", "GitHub Actions"] }
    ],
    featuredMedia: {
      type: "iframe",
      src: "https://robot-hand-simulation-broswer-sim-git-e8dec0-reatureds-projects.vercel.app/",
      alt: "Interactive Robot Hand Simulation",
      height: 800,
      allow: "camera"
    },
    mediaGallery: [],
    links: [
      { label: "Live Simulation", url: "https://robot-hand-simulation-broswer-sim-git-e8dec0-reatureds-projects.vercel.app/" }
    ],
    isFeatured: true,
    section: "Current Projects"
  },
  {
    id: "26",
    slug: "snapchat-turn-based-endless-runner",
    title: "Snapchat Glass Bridge Challenge",
    year: "2025",
    status: "Published",
    shortSubtitle: "Turn-Based Multiplayer Glass Bridge Game",
    summary: "A Squid Game-inspired endless runner built as a full async multiplayer game in Lens Studio. Features a custom game manager system for turn-based competition via Snapchat messages.",
    content: `
      <div class="space-y-12">
        <!-- Cover and Overview -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div class="md:col-span-4">
             <img src="https://picsum.photos/seed/P2550926977354854326052103578451/600/800" alt="Snapchat Glass Bridge" class="rounded-xl shadow-md w-full object-cover" />
          </div>
          <div class="md:col-span-8">
            <h1 class="text-3xl font-bold text-slate-900 mb-4">Snapchat Glass Bridge Challenge (2025)</h1>
            <p class="text-slate-600 mb-6 leading-relaxed">
              <b>Bridge Challenge</b> combines Squid Game's glass bridge with endless runner mechanics. Built as a full async multiplayer game in Lens Studio. My programming work set up a game manager system based on the newly released Turn Based Game feature in Lens Studio.
            </p>
            
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <b class="text-blue-800 block mb-2">Tech Stack:</b>
              <ul class="list-disc pl-5 space-y-1 text-sm text-slate-700">
                <li>Platform: <b>Lens Studio</b> (Snapchat AR)</li>
                <li>Language: <b>TypeScript</b> (ES2019)</li>
                <li>Architecture: Event-driven + Handler Pattern</li>
                <li>Character: <b>Bitmoji SDK</b> Integration</li>
                <li>Multiplayer: <b>Async</b> via Snapchat Messages</li>
              </ul>
            </div>
          </div>
        </div>

        <hr class="border-slate-200" />

        <!-- Game Concept -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
           <div class="md:col-span-4">
             <img src="https://picsum.photos/seed/W2550937483919302436211741090643/600/800" alt="Game Concept" class="rounded-xl shadow-md w-full object-cover" />
           </div>
           <div class="md:col-span-8">
             <h2 class="text-xl font-bold text-slate-900 mb-4">Core Challenges & Concepts</h2>
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                   <h3 class="font-bold text-slate-700 text-sm uppercase mb-2">Challenges</h3>
                   <ul class="list-disc pl-5 space-y-2 text-sm text-slate-600">
                     <li>Early async multiplayer games after Lens Studio released their Turn Based Game feature.</li>
                     <li>Async data handling through Snapchat message.</li>
                   </ul>
                </div>
                <div>
                   <h3 class="font-bold text-slate-700 text-sm uppercase mb-2">Concepts</h3>
                   <ul class="list-disc pl-5 space-y-2 text-sm text-slate-600">
                     <li>Inspired by Subway Surfer + Squid Game</li>
                     <li>Turn-based competition via messages</li>
                     <li>Cute 3D fantasy world with Bitmoji</li>
                     <li>2-3 minute gameplay sessions</li>
                   </ul>
                </div>
             </div>
             
             <div class="bg-slate-50 p-4 rounded-lg">
                <h3 class="font-bold text-slate-900 mb-2 text-sm">How the game works for 2 players</h3>
                <ol class="list-decimal pl-5 space-y-1 text-sm text-slate-600">
                  <li>Player 1 attempts the bridge challenge</li>
                  <li>Game tracks attempts until success</li>
                  <li>Share via Snapchat message</li>
                  <li>Player 2 faces same challenge</li>
                  <li>Winner = fewer attempts</li>
                </ol>
             </div>
           </div>
        </div>

        <hr class="border-slate-200" />

        <!-- Architecture Details -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
           <div class="md:col-span-8 md:order-last">
             <h2 class="text-xl font-bold text-slate-900 mb-4">System Design for Scalable Game Complexity</h2>
             
             <pre class="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono mb-4 overflow-x-auto">
TurnBasedGameManager/
├── TurnBasedHandler.ts    # Turn logic
├── LevelHandler.ts        # Platform gen
├── UIHandler.ts           # UI states
└── TurnBasedBlock.ts      # Collisions</pre>

             <h3 class="font-bold text-slate-800 text-base mb-2">The Handler Pattern</h3>
             <p class="text-slate-600 text-sm mb-4">
               The system employs a modular handler pattern where each handler owns a specific domain of game logic. This architecture separates concerns cleanly—<b>TurnBasedHandler</b> manages multiplayer turn logic without knowing how platforms generate, while <b>LevelHandler</b> creates levels without caring about UI states.
             </p>

             <h3 class="font-bold text-slate-800 text-base mb-2">Event-Driven Communication</h3>
             <p class="text-slate-600 text-sm">
               Instead of tightly coupled components, the system uses an event bus for all inter-handler communication and game stage transitions. This enables future creators to use this system for other games and allows scaling up to complex mechanics like transition animations.
             </p>
           </div>
           <div class="md:col-span-4">
              <img src="https://picsum.photos/seed/J2550938694376201808958808580947/600/800" alt="System Design" class="rounded-xl shadow-md w-full object-cover" />
           </div>
        </div>
        
        <hr class="border-slate-200" />

        <!-- Prototype Progress -->
        <div>
          <h2 class="text-xl font-bold text-slate-900 mb-6">Prototype Progress Recordings</h2>
          
          <!-- Row 1 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="overflow-hidden rounded-lg border border-slate-200">
               <img src="https://picsum.photos/seed/B2550949326895018454407264527187/400/600" class="w-full h-full object-cover" alt="Prototype Early" />
            </div>
            <div class="overflow-hidden rounded-lg border border-slate-200">
               <img src="https://picsum.photos/seed/K2550952921556695865966459282259/400/600" class="w-full h-full object-cover" alt="Prototype Gameplay" />
            </div>
            <div class="text-sm text-slate-600 p-2">
               <ul class="list-disc pl-4 space-y-2">
                 <li>Early prototype of the level in Lens Studio with generated endless platforms.</li>
                 <li>Each row has 2 blocks, with one that’s holding you and one that’s fake.</li>
               </ul>
               <p class="mt-4 text-slate-400 text-xs font-mono">2025-08-29</p>
               <div class="mt-2 rounded-lg overflow-hidden h-32">
                  <img src="https://picsum.photos/seed/S2550948386221751159662389420883/200/200" class="w-full h-full object-cover" alt="Detail" />
               </div>
            </div>
          </div>

          <!-- Row 2 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="overflow-hidden rounded-lg border border-slate-200">
               <img src="https://picsum.photos/seed/U2550954056105243375398721872723/400/600" class="w-full h-full object-cover" alt="Models Added" />
            </div>
            <div class="overflow-hidden rounded-lg border border-slate-200">
               <img src="https://picsum.photos/seed/X2550955972316124264199524639571/400/600" class="w-full h-full object-cover" alt="UI Added" />
            </div>
            <div class="text-sm text-slate-600 p-2">
               <ul class="list-disc pl-4 space-y-2">
                 <li>New game models added to the game</li>
                 <li>UI Added to show more information about the game</li>
                 <li>Relay information through Snapchat works for 2 players with data transferring successfully</li>
               </ul>
               <p class="mt-4 text-slate-400 text-xs font-mono">2025-09-03</p>
            </div>
          </div>

          <!-- Row 3 -->
           <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="overflow-hidden rounded-lg border border-slate-200">
               <img src="https://picsum.photos/seed/T2550959260761850052180162569043/400/600" class="w-full h-full object-cover" alt="Endless Version" />
            </div>
            <div class="overflow-hidden rounded-lg border border-slate-200">
               <img src="https://picsum.photos/seed/U2550962891616039336357497594707/400/600" class="w-full h-full object-cover" alt="Multiplayer" />
            </div>
            <div class="text-sm text-slate-600 p-2">
               <p class="font-bold mb-2">Endless Version</p>
               <p class="mb-4">Players unlock new levels with more rows when they reach the end.</p>
               <p class="font-bold mb-1">Cooperative Idea:</p>
               <p class="mb-2">The second player tries based on what the first player did, making it infinite levels.</p>
               <p class="font-bold mb-1">Competitive Idea:</p>
               <p>Compete with fewer tries for completing a level or the furthest level reached.</p>
            </div>
          </div>

        </div>
      </div>
    `,
    categories: ["XR Developer", "Game Developer"],
    rolesOrSkills: ["Lens Studio Developer", "System Design"],
    techStack: [
      { category: "Platform", skills: ["Lens Studio"] },
      { category: "Language", skills: ["TypeScript (ES2019)"] },
      { category: "System", skills: ["Handler Pattern", "Event-Driven"] },
      { category: "Features", skills: ["Bitmoji SDK", "Async Multiplayer"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/snapchat26/800/600",
      alt: "Snapchat Glass Bridge Challenge"
    },
    mediaGallery: [],
    links: [],
    isFeatured: true,
    section: "Current Projects"
  },

  // --- Most Recent ---
  {
    id: "29",
    slug: "gogreennext-modular-map-tiles",
    title: "GoGreenNext - Modular Map Tiles",
    year: "2025",
    status: "Completed",
    shortSubtitle: "3D Modeling for NYU Game Project",
    summary: "Created modular 3D map tiles for GoGreenNext, an NYU game project. Designed reusable tile assets in Blender to enable flexible level design and efficient world building. The modular system allows for quick assembly of diverse game environments while maintaining visual consistency.",
    categories: ["3D Designer"],
    rolesOrSkills: ["3D Artist", "Environment Design"],
    techStack: [
      { category: "Modeling", skills: ["Blender"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/green29/800/600",
      alt: "Modular Map Tiles"
    },
    mediaGallery: [],
    links: [],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "27",
    slug: "curaloop-ai-companion",
    title: "CuraLoop: AI Companion for Alzheimer's Care",
    year: "2025",
    status: "Hackathon",
    shortSubtitle: "1-day Humans & AI Hackathon project in Seattle",
    summary: "Through AI Chat + Game, the app monitors cognitive and game behavior to analyze and monitor the level of Alzheimer’s care needed for anyone.",
    content: `
      <div class="space-y-12">
        <!-- Overview Section -->
        <div>
          <h2 class="text-xl font-bold text-slate-900 mb-2">Project Overview</h2>
          <p class="text-slate-600 mb-4">
             Monitors cognitive health through AI conversations and gamified exercises to predict Alzheimer's care needs. Built with a <b>Human-in-the-Loop</b> model connecting patients, caregivers, and doctors for continuous, empathy-driven care.
          </p>
          <div class="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p class="text-sm text-blue-800 mb-2 font-bold">Hackathon Achievement</p>
            <p class="text-sm text-blue-700">Built in a 24-hour sprint at the Humans & AI Hackathon in Seattle (2025).</p>
          </div>
        </div>

        <hr class="border-slate-200" />

        <!-- Problem & Solution -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 class="text-xl font-bold text-slate-900 mb-4">The Problem</h2>
            <p class="text-slate-600 mb-4">
              Alzheimer's symptoms often progress silently between infrequent clinical visits. Current care models rely on <b>subjective, fragmented assessments</b>, which means cognitive decline often goes unnoticed until it becomes severe.
            </p>
            <ul class="list-disc pl-5 space-y-2 text-slate-600 text-sm">
              <li>Delayed interventions</li>
              <li>Missed opportunities for improving quality of life</li>
              <li>Increased strain on caregivers</li>
              <li>Lack of continuous monitoring data for doctors</li>
            </ul>
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-900 mb-4">The Solution</h2>
            <p class="text-slate-600 mb-4">
              CuraLoop introduces an <b>AI-powered daily companion</b> that continuously tracks, predicts, and supports a patient's cognitive and emotional well-being.
            </p>
            <p class="text-slate-600 mb-4">
              Through daily check-ins, gamified cognitive exercises, and natural language conversations, the platform captures <b>subtle behavioral, linguistic, and emotional signals</b>.
            </p>
            <p class="text-slate-600 text-sm">
              Our AI algorithms analyze these trends to detect potential deterioration, issuing alerts to doctors or caregivers to enable <b>proactive and early intervention</b>.
            </p>
          </div>
        </div>

        <hr class="border-slate-200" />

        <!-- Core Features -->
        <div>
          <h2 class="text-2xl font-bold text-slate-900 mb-8">Core Features</h2>
          
          <div class="space-y-12">
            <!-- Home Screen -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div class="md:col-span-4">
                 <img src="https://picsum.photos/seed/C2588102423948546591633135035219/600/800" alt="Home Screen" class="rounded-xl shadow-md w-full object-cover" />
              </div>
              <div class="md:col-span-8">
                <h3 class="text-lg font-bold text-slate-900 mb-2">🏠 Home Screen</h3>
                <p class="text-slate-600 mb-4 text-sm">The main interface where patients start their day. Features a clean, senior-friendly design with large buttons and clear navigation to daily check-ins, games, and chat functions.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-slate-50 p-3 rounded-lg">
                    <strong class="block text-xs uppercase text-slate-500 mb-1">Through Chatbot</strong>
                    <ul class="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>Quick access to daily check-in</li>
                      <li>24/7 chat companion entry</li>
                      <li>Progress tracking display</li>
                    </ul>
                  </div>
                  <div class="bg-slate-50 p-3 rounded-lg">
                    <strong class="block text-xs uppercase text-slate-500 mb-1">Through Game</strong>
                    <ul class="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      <li>Game library navigation</li>
                      <li>Game behavior recording</li>
                      <li>Cognitive exercises</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Companion -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
               <div class="md:col-span-4 md:order-last">
                 <img src="https://picsum.photos/seed/Q2588103917230926102495047902035/600/800" alt="Chat UI" class="rounded-xl shadow-md w-full object-cover" />
              </div>
              <div class="md:col-span-8">
                <h3 class="text-lg font-bold text-slate-900 mb-2">💬 24/7 AI Chat Companion</h3>
                <p class="text-slate-600 mb-4 text-sm">An empathetic AI assistant powered by Claude Sonnet that patients can converse with at any time. The system analyzes language patterns, emotional tone, and conversation coherence to identify confusion, depression, or behavioral changes.</p>
                <ul class="list-disc pl-5 space-y-1 text-sm text-slate-600">
                  <li>Natural language conversations</li>
                  <li>Emotional sentiment analysis</li>
                  <li>Memory recall prompts & gentle redirection</li>
                  <li>Real-time empathetic responses</li>
                </ul>
              </div>
            </div>

            <!-- Gamified Training -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div class="md:col-span-4">
                 <img src="https://picsum.photos/seed/R2588104121307255789943817429843/600/800" alt="Games UI" class="rounded-xl shadow-md w-full object-cover" />
              </div>
              <div class="md:col-span-8">
                <h3 class="text-lg font-bold text-slate-900 mb-2">🎮 Gamified Cognitive Training</h3>
                <p class="text-slate-600 mb-4 text-sm">AI-adaptive games designed to enhance memory, attention, and orientation while generating quantitative performance data. Games adjust difficulty based on patient performance to maintain engagement without frustration.</p>
                <ul class="list-disc pl-5 space-y-1 text-sm text-slate-600">
                  <li>Memory matching exercises</li>
                  <li>Pattern recognition challenges</li>
                  <li>Word recall & visual-spatial puzzles</li>
                </ul>
              </div>
            </div>
            
             <!-- Doctor Dashboard -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
               <div class="md:col-span-4 md:order-last">
                 <img src="https://picsum.photos/seed/T2588104261004448660146251817811/600/800" alt="Doctor Dashboard" class="rounded-xl shadow-md w-full object-cover" />
              </div>
              <div class="md:col-span-8">
                <h3 class="text-lg font-bold text-slate-900 mb-2">🩺 Doctor Dashboard</h3>
                <p class="text-slate-600 mb-4 text-sm">A comprehensive web dashboard for healthcare providers that displays patient cognitive trajectories, emotional trends, and detailed activity logs.</p>
                <ul class="list-disc pl-5 space-y-1 text-sm text-slate-600">
                  <li>Patient overview with key metrics</li>
                  <li>Cognitive performance trend charts</li>
                  <li>Alert review and approval system</li>
                  <li>Treatment plan modification tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <hr class="border-slate-200" />

        <!-- Workflow & Architecture -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div>
             <h2 class="text-xl font-bold text-slate-900 mb-4">AI + Human-in-the-Loop Workflow</h2>
             <ol class="list-decimal pl-5 space-y-2 text-sm text-slate-600">
               <li><b>User Interaction</b>: Patients engage with daily tasks.</li>
               <li><b>Data Logging</b>: Interactions are securely captured.</li>
               <li><b>AI Analysis</b>: Claude Sonnet & ML models identify trends.</li>
               <li><b>Risk Alert</b>: System flags concerning patterns.</li>
               <li><b>Expert Review</b>: Doctors review AI findings.</li>
               <li><b>Adjustment</b>: Treatment plans are updated.</li>
             </ol>
           </div>
           <div>
             <h2 class="text-xl font-bold text-slate-900 mb-4">System Architecture</h2>
             <div class="space-y-4">
               <div class="bg-slate-100 p-3 rounded text-xs font-mono text-slate-700">
                 <strong class="block mb-1 text-slate-900">Mobile Application (React Native)</strong>
                 Frontend/ <br/>
                 ├── Daily Check-in Module <br/>
                 ├── Game Engine <br/>
                 ├── Chat Interface <br/>
                 └── Offline Sync Handler
               </div>
               <div class="bg-slate-100 p-3 rounded text-xs font-mono text-slate-700">
                 <strong class="block mb-1 text-slate-900">Backend API (FastAPI)</strong>
                 Backend/ <br/>
                 ├── Data Analytics Engine <br/>
                 ├── ML Trend Analysis <br/>
                 └── Doctor Dashboard API
               </div>
             </div>
           </div>
        </div>

        <div class="bg-slate-900 text-slate-300 p-6 rounded-xl">
           <h3 class="text-white font-bold mb-3">24-Hour Development Challenges</h3>
           <div class="space-y-3 text-sm">
             <p><strong class="text-white">Real-time AI Analysis:</strong> Implemented streaming responses from Claude Sonnet API to eliminate lag.</p>
             <p><strong class="text-white">Trend Detection:</strong> Used statistical analysis with rolling averages for immediate insights within the hackathon timeframe.</p>
             <p><strong class="text-white">Human-in-the-Loop:</strong> Created a tiered alert system where minor changes are logged, but major anomalies trigger doctor review.</p>
           </div>
        </div>
      </div>
    `,
    categories: ["Full Stack Engineer"],
    rolesOrSkills: ["Full Stack", "AI Integration", "React Native"],
    techStack: [
      { category: "Frontend", skills: ["React Native", "TypeScript", "Expo"] },
      { category: "Backend", skills: ["FastAPI", "Python"] },
      { category: "AI/ML", skills: ["Claude Sonnet", "Trend Analysis"] },
      { category: "Deployment", skills: ["Vercel"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/curaloop27/800/600",
      alt: "CuraLoop App Interface"
    },
    mediaGallery: [],
    links: [
        { label: "Live Demo", url: "https://chatbot-app-three-beta.vercel.app/" },
        { label: "GitHub Repo", url: "https://github.com/reatured/Oct-4-Hackathon-2025-" }
    ],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "23",
    slug: "b612-soccer",
    title: "B612 Soccer",
    year: "2025",
    status: "Top 2% GMTK",
    shortSubtitle: "Ranked in the Top 2% out of 3,300+ entries in GMTK Game Jam 2025",
    summary: "A super fun local 2-player soccer game set on a tiny looping planet. Compete against a friend where shots can loop the entire world and lead to unexpected goals! Created as a solo developer for the GMTK Game Jam 2025 ('Loop' theme). Minimalist pencil-sketched art, unique circular physics, and quick chaotic rounds.",
    categories: ["Game Developer"],
    rolesOrSkills: ["Solo Developer", "Game Design"],
    techStack: [
      { category: "Engine", skills: ["Unity", "C#"] },
      { category: "Art", skills: ["Pencil sketch", "Photoshop"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/b612/800/600",
      alt: "B612 Soccer Gameplay"
    },
    mediaGallery: [],
    links: [],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "01",
    slug: "hardware-store-smart-search",
    title: "Hardware Store Smart Search",
    shortSubtitle: "Lead generation tool for hardware manufacturers",
    summary: "When I worked for a hardware manufacturer, we were looking for a better way to find targeted customers (hardware stores) to purchase our stock. We built a smart search tool to crawl Google Maps business data and help identify store leads around the world.",
    categories: ["Full Stack Engineer"],
    rolesOrSkills: ["Full Stack Developer"],
    techStack: [
      { category: "Frontend", skills: ["React", "JavaScript"] },
      { category: "Backend", skills: ["FastAPI", "Python"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/hardware01/800/600",
      alt: "Smart Search Dashboard"
    },
    mediaGallery: [],
    links: [
        { label: "Read more", url: "#" }
    ],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "02",
    slug: "ar-drawing-tool",
    title: "AR Drawing Tool",
    year: "2022",
    status: "Internship",
    shortSubtitle: "Procedural mesh generation with hand tracking",
    summary: "During my internship at Snapchat in 2022, I had this crazy idea nobody had done before. I integrated procedural mesh generation with hand tracking, enabling users to draw dynamically in 3D space.",
    categories: ["XR Developer"],
    rolesOrSkills: ["AR Engineer"],
    techStack: [
      { category: "Platform", skills: ["Lens Studio"] },
      { category: "Language", skills: ["JavaScript"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/ar02/800/600",
      alt: "AR Drawing in action"
    },
    mediaGallery: [],
    links: [
        { label: "Read more", url: "#" }
    ],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "16",
    slug: "ping-pong-game",
    title: "Ping Pong Game",
    shortSubtitle: "2D game with 3D illusion built from scratch",
    summary: "A complete 2D game that gives 3D illusion. An interactive automate enemy that you play against. Game Engine built from scratch using p5js to manage game asset, sound, levels and game controls.",
    categories: ["Game Developer"],
    rolesOrSkills: ["Game Engine Dev"],
    techStack: [
      { category: "Platform", skills: ["P5JS"] },
      { category: "Language", skills: ["JavaScript"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/pingpong16/800/600",
      alt: "Ping Pong Game"
    },
    mediaGallery: [],
    links: [
        { label: "Read more", url: "#" }
    ],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "17",
    slug: "no-job-too-small",
    title: "No Job Too Small",
    year: "2024",
    status: "Top 1% GMTK",
    shortSubtitle: "Ranked in the Top 1% out of 3,300+ entries in GMTK Game Jam 2024",
    summary: "Step into the absurdly large shoes of an oversized intern in a tiny 90s-style office. In this hilarious, physics-based game, your exaggerated scale turns mundane office tasks into chaotic challenges. Smash your way through the day or tiptoe to success—the choice is yours. No Job Too Small flips the theme 'Build to Scale' on its head.",
    categories: ["Game Developer"],
    rolesOrSkills: ["Unity Developer"],
    techStack: [
      { category: "Engine", skills: ["Unity", "C#", "HLSL"] },
      { category: "Modeling", skills: ["Blender"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/nojob17/800/600",
      alt: "No Job Too Small Gameplay"
    },
    mediaGallery: [],
    links: [],
    isFeatured: true,
    section: "Most Recent"
  },
  {
    id: "03",
    slug: "personal-schedule-assistant",
    title: "Personal Schedule Assistant",
    shortSubtitle: "Drag-and-drop schedule builder",
    summary: "A drag-and-drop schedule builder that supports offline editing and syncs automatically across devices. Designed for productivity addicts who want control over time and print-ready exports.",
    categories: ["Full Stack Engineer"],
    rolesOrSkills: ["Full Stack Developer"],
    techStack: [
      { category: "Frontend", skills: ["React", "@dnd-kit", "Tailwind"] },
      { category: "Backend", skills: ["FastAPI", "Supabase"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/schedule03/800/600",
      alt: "Schedule Assistant"
    },
    mediaGallery: [],
    links: [
        { label: "Read more", url: "#" }
    ],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "25",
    slug: "marvels-flerken-ar-filter",
    title: "Marvel's Flerken AR Filter",
    year: "2023",
    status: "Official Campaign",
    shortSubtitle: "Official AR Marketing Campaign for The Marvels Movie",
    summary: "An interactive AR filter that transforms cats into Flerkens for The Marvels movie campaign. Features real-time object detection and cross-platform deployment on TikTok and Regal Cinema app, achieving viral distribution and significant user engagement.",
    categories: ["XR Developer"],
    rolesOrSkills: ["AR Developer"],
    techStack: [
      { category: "Platform", skills: ["Lens Studio", "Effect House"] },
      { category: "Tech", skills: ["JavaScript", "HLSL", "Object Detection"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/marvel25/800/600",
      alt: "Flerken AR Filter"
    },
    mediaGallery: [],
    links: [
        { label: "Read more", url: "#" }
    ],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "04",
    slug: "3d-printed-hook",
    title: "3D Printed Hook",
    shortSubtitle: "Customized hooks for home hardware",
    summary: "A 3D modeling and printing project to create customized hooks for home hardware. Iterated through several prototypes using Fusion 360 and tested for real-world use.",
    categories: ["3D Designer"],
    rolesOrSkills: ["Product Design"],
    techStack: [
      { category: "Modeling", skills: ["Fusion 360"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/hook04/800/600",
      alt: "3D Printed Hook"
    },
    mediaGallery: [],
    links: [
        { label: "Read more", url: "#" }
    ],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "05",
    slug: "just-another-day",
    title: "Just Another Day",
    shortSubtitle: "Narrative-driven game with emotional arc",
    summary: "A Unity narrative-driven game project composed of five mini-games tied together through an emotional storyline. Designed to create an emotional arc that ends in catharsis.",
    categories: ["Game Developer", "3D Designer"],
    rolesOrSkills: ["Game Developer", "Storytelling"],
    techStack: [
      { category: "Engine", skills: ["Unity", "C#"] },
      { category: "Modeling", skills: ["Blender"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/day05/800/600",
      alt: "Just Another Day Game Art"
    },
    mediaGallery: [],
    links: [
        { label: "Read more", url: "#" }
    ],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "08",
    slug: "vr-experience-oculus-quest",
    title: "VR Experience on Oculus Quest",
    shortSubtitle: "Immersive object interaction game",
    summary: "An immersive game for Oculus Quest focusing on object interaction and spatial memory. Built using Unity’s XR framework and tested across headset configurations.",
    categories: ["XR Developer", "Game Developer"],
    rolesOrSkills: ["VR Developer"],
    techStack: [
      { category: "Engine", skills: ["Unity", "XR Framework"] },
      { category: "Platform", skills: ["Oculus Quest"] },
      { category: "Language", skills: ["C#"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/vr08/800/600",
      alt: "VR Gameplay"
    },
    mediaGallery: [],
    links: [
        { label: "Read more", url: "#" }
    ],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "10",
    slug: "creative-coding-experiments",
    title: "Creative Coding Experiments",
    shortSubtitle: "Generative art sketches using p5.js",
    summary: "This is a collection of my creative coding sketches built with p5.js. Each piece explores different generative or interactive ideas—from visual patterns to playful simulations. Experiments include procedural pattern generators, randomized grid-based art, and color palettes.",
    categories: ["Game Developer", "Full Stack Engineer"],
    rolesOrSkills: ["Creative Coder"],
    techStack: [
      { category: "Library", skills: ["p5.js"] },
      { category: "Language", skills: ["JavaScript"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/code10/800/600",
      alt: "Generative Art"
    },
    mediaGallery: [],
    links: [
        { label: "More sketches", url: "#" }
    ],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "09",
    slug: "3d-poster-design-landmarks",
    title: "3D Poster Design with Landmarks",
    shortSubtitle: "Visualizing cities with 3D landmarks",
    summary: "This poster series visualizes cities from around the world using 3D landmarks generated in Blender. Real-world data from Google Maps was imported in both realistic and stylized formats, each lit based on the local time of day using HDRIs and custom lighting.",
    categories: ["3D Designer"],
    rolesOrSkills: ["3D Artist"],
    techStack: [
      { category: "Modeling", skills: ["Blender"] },
      { category: "Data", skills: ["Google Maps API"] },
      { category: "Rendering", skills: ["HDRI", "Custom Lighting"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/poster09/800/600",
      alt: "3D Landmark Poster"
    },
    mediaGallery: [],
    links: [
        { label: "Read more", url: "#" }
    ],
    isFeatured: false,
    section: "Most Recent"
  },
  {
    id: "10b",
    slug: "3d-modeled-teddy-bear",
    title: "3D Modeled Teddy Bear",
    shortSubtitle: "Beginner sculpting exercise in Blender",
    summary: "A soft toy modeled entirely in Blender as a beginner’s sculpting exercise. This teddy bear project explored mesh shaping, subdivision modifiers, and basic material texturing in a fun and personal 3D workflow.",
    categories: ["3D Designer"],
    rolesOrSkills: ["3D Sculpting"],
    techStack: [
      { category: "Modeling", skills: ["Blender"] }
    ],
    featuredMedia: {
      type: "image",
      src: "https://picsum.photos/seed/teddy10/800/600",
      alt: "3D Teddy Bear"
    },
    mediaGallery: [],
    links: [
        { label: "Read more", url: "#" }
    ],
    isFeatured: false,
    section: "Most Recent"
  }
];