/** Dated evidence and preview assets from orchia.studio/about-us. */
export const orchiaShowcase = {
  homepage: "https://orchia.studio/",
  source: "https://orchia.studio/about-us",
  workflowImage: "/projects/orchia/workflow-demo-20260910.jpg",
  growthImage: "/projects/orchia/follower-growth-july-2026.jpg",
  // Use the dated account panel, not the conflicting 5.6M+ prose claim.
  snapshot: "August 1, 2026",
  metrics: [
    { value: "3.3M", label: "Total views" },
    { value: "1,423", label: "New followers" },
    { value: "73.5%", label: "Active followers" },
  ],
}

/** Hero reel: published social previews, production cuts, and one cross-domain demo. */
export const orchiaHomepagePreviews = [
  { title: "One idea becomes a world", poster: "/projects/orchia/homepage-promotion.jpg", src: "https://media.lingyizhou.com/orchia-promotion-video-37-1-540p.mp4" },
  { title: "A story, made for social", poster: "/projects/orchia/production-july-14-frame.jpg", src: "https://media.lingyizhou.com/07-14-import-540p.mp4" },
  { title: "One night in the cactus court", poster: "/projects/orchia/homepage-plant-court.jpg", src: "https://media.lingyizhou.com/plant-court-540p.mp4" },
  { title: "Same world, another take", poster: "/projects/orchia/workflow-batch-1.jpg", src: "https://media.lingyizhou.com/batch-1-540p.mp4" },
  { title: "A story told in close-up", poster: "/projects/orchia/workflow-batch-2.jpg", src: "https://media.lingyizhou.com/batch-2-540p.mp4" },
  { title: "Beyond animation — a house tour", poster: "/projects/orchia/house-tour.jpg", src: "https://media.lingyizhou.com/house-tour-540p.mp4" },
  // Deferred until the blocked Vercel blob store is unblocked or the source file is recovered.
  // Original src (42.1 MB): https://tm9ilj7n5ftxczdh.public.blob.vercel-storage.com/company-site/videos/data/07-23-returned-with-99-doubles-8qEF700mxxZdc2MSqE46ZWQtqRooRN.mp4
  // { title: "A world that carries through", poster: "/projects/orchia/homepage-story.jpg", src: "" },
] as const

/** Scope confirmed by the existing portfolio experience and the product source. */
export const orchiaEngineering = [
  { title: "Visual workflow editor", stack: "TypeScript · React · Next.js · React Flow", detail: "Built the visual editor for creating workflows, inspecting agent inputs, and following each run." },
  { title: "Agent execution", stack: "Node.js · Typed DAGs · Zod", detail: "Connected specialist agents through typed inputs and outputs, parallel branches, and validated handoffs." },
  { title: "Durable runs", stack: "SQLite · Job queues · Versioned artifacts", detail: "Added persistent state, retries, and version history so feedback can guide the next production run." },
  { title: "Media pipeline", stack: "Model APIs · FFmpeg · FFprobe", detail: "Integrated image and video providers, tracked generation jobs, and assembled finished media." },
] as const
