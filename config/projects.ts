import type { Project } from '../types';
import dataJson from './data.json';

// Rich HTML content for projects — kept in TypeScript for safety.
// Admin-saved content in data.json takes priority if non-empty.
const richContent: Record<string, string> = {
  "26": `
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
                 <li>Each row has 2 blocks, with one that's holding you and one that's fake.</li>
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
  "27": `
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
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div class="md:col-span-4">
                 <img src="https://picsum.photos/seed/C2588102423948546591633135035219/600/800" alt="Home Screen" class="rounded-xl shadow-md w-full object-cover" />
              </div>
              <div class="md:col-span-8">
                <h3 class="text-lg font-bold text-slate-900 mb-2">Home Screen</h3>
                <p class="text-slate-600 mb-4 text-sm">The main interface where patients start their day. Features a clean, senior-friendly design with large buttons and clear navigation to daily check-ins, games, and chat functions.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
               <div class="md:col-span-4 md:order-last">
                 <img src="https://picsum.photos/seed/Q2588103917230926102495047902035/600/800" alt="Chat UI" class="rounded-xl shadow-md w-full object-cover" />
              </div>
              <div class="md:col-span-8">
                <h3 class="text-lg font-bold text-slate-900 mb-2">24/7 AI Chat Companion</h3>
                <p class="text-slate-600 mb-4 text-sm">An empathetic AI assistant powered by Claude Sonnet that patients can converse with at any time.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div class="md:col-span-4">
                 <img src="https://picsum.photos/seed/R2588104121307255789943817429843/600/800" alt="Games UI" class="rounded-xl shadow-md w-full object-cover" />
              </div>
              <div class="md:col-span-8">
                <h3 class="text-lg font-bold text-slate-900 mb-2">Gamified Cognitive Training</h3>
                <p class="text-slate-600 mb-4 text-sm">AI-adaptive games designed to enhance memory, attention, and orientation while generating quantitative performance data.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
               <div class="md:col-span-4 md:order-last">
                 <img src="https://picsum.photos/seed/T2588104261004448660146251817811/600/800" alt="Doctor Dashboard" class="rounded-xl shadow-md w-full object-cover" />
              </div>
              <div class="md:col-span-8">
                <h3 class="text-lg font-bold text-slate-900 mb-2">Doctor Dashboard</h3>
                <p class="text-slate-600 mb-4 text-sm">A comprehensive web dashboard for healthcare providers that displays patient cognitive trajectories and detailed activity logs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
};

export const projects: Project[] = (dataJson.projects as unknown as Project[]).map((p) => ({
  ...p,
  content: p.content || richContent[p.id] || undefined,
}));
