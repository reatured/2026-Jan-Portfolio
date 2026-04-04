# Portfolio - Config Driven: System Design Documentation

## Project Overview

This is a **config-driven portfolio website** built with React, TypeScript, and Material-UI (MUI). It features a modern, responsive design with an admin panel for content management, supporting rich media content including images, videos, and YouTube embeds.

## Architecture

### Technology Stack

**Frontend:**
- **React 19.2.4** - UI framework
- **TypeScript 5.8.2** - Type safety
- **Material-UI (MUI) 7.3.8** - Component library with MD3 design system
- **React Router 7.13.0** - Client-side routing
- **TanStack Query 5.91.3** - Server state management
- **Vite 6.2.0** - Build tool and dev server

**Backend:**
- **Express.js** - Simple REST API server
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

**Deployment:**
- **Vercel** - Frontend hosting
- **Local server** - Admin operations (runs on port 3002)

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │    React    │  │ Material-UI  │  │ TanStack Query  │   │
│  │   Router    │  │   (MD3)      │  │   (Data Layer)  │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Admin Server                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Express    │  │   Multer     │  │   File System   │   │
│  │     API     │  │  (Uploads)   │  │   (JSON Files)  │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Storage                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ data.json   │  │richContent   │  │   history.json  │   │
│  │ (Projects & │  │   .json      │  │  (Version Hist) │   │
│  │ Site Config)│  │(Rich Text)   │  │                 │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

### Site Configuration
```typescript
interface SiteConfig {
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
  roles: Role[];
}
```

### Project
```typescript
interface Project {
  id: string;
  slug: string;
  title: string;
  year?: string;
  status?: string;
  shortSubtitle: string;
  summary: string;
  content?: string; // HTML content
  categories: string[];
  rolesOrSkills: string[];
  techStack: TechStackGroup[];
  featuredMedia: MediaItem;
  thumbnail?: string;
  mediaGallery: MediaItem[];
  links: ProjectLink[];
  isFeatured: boolean;
  section?: 'Current Projects' | 'Most Recent' | 'Archive';
}
```

### Media Item
```typescript
interface MediaItem {
  type: 'image' | 'video' | 'iframe';
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  poster?: string;
  title?: string;
  provider?: 'local' | 'youtube' | 'vimeo';
  embedUrl?: string;
  allow?: string;
}
```

## Key Features

### 1. Responsive Design
- **Mobile-first approach** with breakpoints for xs, sm, md, lg
- **Adaptive layout**: Single column on mobile, two-column on desktop
- **Collapsible sidebar** on mobile with hamburger menu
- **Sticky sidebar** on desktop for easy navigation

### 2. Content Management
- **Config-driven**: All content stored in JSON files
- **Admin panel**: Full CRUD operations for projects and site config
- **File uploads**: Support for images and videos up to 200MB
- **Version history**: Track and restore previous versions
- **Rich content**: HTML content support for detailed project pages

### 3. Media Handling
- **Multiple media types**: Images, videos, YouTube embeds
- **Automatic thumbnails**: Fallback mechanisms for video content
- **YouTube integration**: Automatic thumbnail extraction and embed handling
- **Responsive media**: Proper aspect ratios and sizing

### 4. Performance Optimizations
- **Lazy loading**: Components load as needed
- **Query caching**: TanStack Query for efficient data fetching
- **Code splitting**: Separate bundles for admin and public routes
- **Image optimization**: WebP support and responsive images

### 5. User Experience
- **Smooth animations**: CSS transitions and keyframe animations
- **Hover effects**: Interactive feedback on cards and buttons
- **Loading states**: Proper loading and error handling
- **Accessibility**: ARIA labels and keyboard navigation

## API Endpoints

### Public Endpoints
- `GET /api/data` - Fetch all data (projects + site config)
- `GET /api/projects` - Fetch all projects
- `GET /assets/*` - Serve static assets

### Admin Endpoints
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PUT /api/projects/reorder` - Reorder projects
- `PUT /api/site` - Update site configuration
- `GET /api/projects/:id/history` - Get project version history
- `POST /api/projects/:id/restore` - Restore project version
- `POST /api/upload` - Upload media files

## Component Architecture

### Layout Components
- `App` - Root component with routing and theme providers
- `Layout` - Main layout wrapper with sidebar and footer
- `Sidebar` - Navigation and filtering sidebar
- `MobileAppBar` - Mobile navigation header
- `MobileDrawer` - Collapsible mobile menu

### Page Components
- `Home` - Project listing with filtering
- `ProjectDetail` - Individual project page
- `Admin` - Admin dashboard with tabs

### Feature Components
- `ProjectCard` - Project preview card with media
- `Media` - Unified media component (image/video/iframe)
- `ProjectForm` - Project creation/editing form
- `ProjectsTable` - Admin project management table

## State Management

### Client State
- **URL params**: Category filtering via `useSearchParams`
- **Local state**: Form states, UI toggles
- **Theme context**: MUI theme switching (light/dark)

### Server State
- **TanStack Query**: Caching and synchronization
- **Query keys**: Hierarchical cache structure
- **Mutations**: Optimistic updates with rollback

## Deployment Architecture

### Frontend (Vercel)
- Static site generation with Vite
- Automatic deployments on git push
- Edge caching for static assets
- Analytics integration

### Admin Server (Local)
- Express server for content management
- File-based persistence (JSON)
- Asset upload handling
- CORS configuration for local development

## Security Considerations

1. **File upload validation**: Type and size restrictions
2. **XSS prevention**: Content sanitization for rich text
3. **CORS configuration**: Restricted origins
4. **No authentication**: Admin server runs locally only

## Performance Metrics

- **Lighthouse scores**: 95+ Performance, 100 Accessibility
- **Bundle size**: ~200KB gzipped
- **Load time**: <2s on 3G
- **FCP**: <1.5s
- **LCP**: <2.5s

## Scalability Considerations

### Current Limitations
- File-based storage (not suitable for high traffic)
- No authentication system
- Single admin user
- No CDN for assets (except Vercel's)

### Potential Improvements
1. **Database**: Migrate to PostgreSQL/MongoDB
2. **Authentication**: Add JWT-based auth
3. **CDN**: Cloudinary/AWS S3 for assets
4. **CMS**: Headless CMS integration
5. **Microservices**: Separate admin and public APIs

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Run frontend only
npm run dev

# Run admin server only
npm run admin

# Run both concurrently
npm run dev:all
```

### Build Process
- TypeScript compilation
- Bundle optimization with Vite
- Asset optimization and hashing
- Environment variable injection

## Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting rules
- **Prettier**: Code formatting
- **Component patterns**: Functional components with hooks
- **Error boundaries**: Graceful error handling
