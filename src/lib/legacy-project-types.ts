import type { ProjectCaseStudyContent } from "./project-case-studies"

export type ArchiveMedia = {
  type: "image" | "video" | "youtube" | "shader"
  src: string
  caption: string
  thumbnail?: string
  width?: number
  height?: number
  animated?: boolean
  sourceUrl?: string
}

export type ProjectNote = {
  heading: string
  paragraphs?: string[]
  items?: string[]
  table?: { headings: string[]; rows: string[][] }
}

export type LegacyProjectContent = {
  sourceId: string
  sourceSlug: string
  title: string
  year?: number
  subtitle: string
  discipline: string
  study: ProjectCaseStudyContent
  notes: ProjectNote[]
  media: ArchiveMedia[]
  links: { label: string; href: string }[]
}
