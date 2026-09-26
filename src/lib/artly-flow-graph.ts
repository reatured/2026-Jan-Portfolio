/* Artly architecture graph, V2. The same three-zone topology as the SVG original in
   ./artly-architecture-graph, re-expressed in the shared flow-canvas model so it renders
   through the reusable React Flow component and inherits the teleop layout constants
   (section header image + title + subtitle, one shared group center line).
   Section images are placeholders until the real screenshots land in public/projects/artly/.
   The deployment edge is a logical workflow through Artly's existing Java backend APIs,
   after operator review and validation; it does not represent a direct browser-to-robot connection. */

import type { FlowCanvasSpec } from "@/lib/teleop-flow-graph"

export const artlyCanvas: FlowCanvasSpec = {
  sections: [
    {
      id: "cloud",
      title: "Cloud services",
      subtitle: "Existing company infrastructure",
      image: "/projects/artly/cloud-services-16x9.png",
      width: 360,
      group: {
        layout: "center",
        nodes: [
          { id: "keycloak", label: "Keycloak", detail: "Identity · auth and permission gates",
            size: { w: 300, h: 100 }, outputs: ["right"] },
          { id: "backend", label: "Java backend APIs", detail: "Existing company services + robot database",
            size: { w: 300, h: 100 }, outputs: ["right"] },
        ],
      },
    },
    {
      id: "workspace",
      title: "Operator workspace",
      subtitle: "Editor and simulation integration",
      image: "/projects/artly/operator-workspace-16x9.png",
      width: 360,
      group: {
        layout: "center",
        nodes: [
          { id: "hub", label: "RobotContext", detail: "Operator review and validation", kind: "hub",
            size: { w: 300, h: 100 }, inputs: ["left"], outputs: ["right", "bottom"] },
          { id: "scene", label: "3D robot scene", detail: "TypeScript · React · Three.js",
            size: { w: 300, h: 100 }, inputs: ["top"], outputs: ["right"] },
        ],
      },
    },
    {
      id: "fleet",
      title: "Deployed fleet",
      subtitle: "Robot computer and store network",
      image: "/projects/artly/deployed-fleet-16x9.png",
      width: 360,
      group: {
        layout: "center",
        nodes: [
          { id: "r044", label: "R-044 · Franka", detail: "Validated updates · revision tracking",
            size: { w: 300, h: 100 }, inputs: ["left"], outputs: ["bottom"] },
          { id: "store", label: "Store network", detail: "External boundary · reference endpoint",
            size: { w: 300, h: 100 }, inputs: ["left", "top"] },
        ],
      },
    },
  ],
  edges: [
    { from: "keycloak", to: "hub", fromAnchor: "right", toAnchor: "left", label: "Auth" },
    { from: "backend", to: "hub", fromAnchor: "right", toAnchor: "left", label: "Java APIs" },
    { from: "hub", to: "scene", fromAnchor: "bottom", toAnchor: "top" },
    { from: "hub", to: "r044", fromAnchor: "right", toAnchor: "left", label: "Via Java APIs" },
    { from: "scene", to: "store", fromAnchor: "right", toAnchor: "left", label: "Render" },
    { from: "r044", to: "store", fromAnchor: "bottom", toAnchor: "top", kind: "return" },
  ],
}
