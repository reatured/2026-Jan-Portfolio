// MUI Palette augmentation for MD3 tonal surface tokens
declare module '@mui/material/styles' {
  interface Palette {
    surfaceVariant: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
  }
  interface PaletteOptions {
    surfaceVariant?: string;
    secondaryContainer?: string;
    onSecondaryContainer?: string;
    tertiaryContainer?: string;
    onTertiaryContainer?: string;
  }
}

// Site Configuration Types
export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // Lucide icon name
}

export interface Role {
  title: string;
  details: string[];
}

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultOgImage: string;
  twitterHandle: string;
  email: string;
  jobTitle: string;
  location: string;
  bio: string;
  avatar: string;
  keywords: string[];
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  roles: Role[]; // Updated from string[] to Role[]
}

// Project Configuration Types
export type MediaType = 'image' | 'video' | 'iframe';
export type MediaLayout = 'content' | 'full-width' | 'hero';

export interface MediaItem {
  type: MediaType;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  poster?: string; // For videos
  title?: string;
  provider?: 'local' | 'youtube' | 'vimeo';
  embedUrl?: string;
  allow?: string; // Permissions policy for iframes
  label?: string;
  bleed?: 'contained' | 'full';
  layout?: MediaLayout; // Rendering intent for layout-aware media blocks
  presentation?: 'inline' | 'modal'; // Rendered in-page or launched in a modal
}

export interface ProjectLink {
  label: string;
  url: string;
  icon?: string;
}

export interface TechStackGroup {
  category: string;
  skills: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  year?: string;
  status?: string;
  shortSubtitle: string;
  summary: string;
  content?: string; // HTML content for rich project details
  categories: string[]; // Added for filtering
  rolesOrSkills: string[];
  techStack: TechStackGroup[];
  featuredMedia: MediaItem;
  thumbnail?: string; // Image URL shown on project cards when featuredMedia is video/iframe
  mediaGallery: MediaItem[];
  links: ProjectLink[];
  isFeatured: boolean;
  hidden?: boolean;
  section?: 'Current Projects' | 'Most Recent' | 'Archive';
}
