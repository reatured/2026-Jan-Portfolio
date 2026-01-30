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

export interface MediaItem {
  type: MediaType;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  poster?: string; // For videos
  title?: string;
  provider?: 'local' | 'youtube' | 'vimeo';
  embedUrl?: string;
  allow?: string; // Permissions policy for iframes
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
  mediaGallery: MediaItem[];
  links: ProjectLink[];
  isFeatured: boolean;
  section?: 'Current Projects' | 'Most Recent' | 'Archive';
}