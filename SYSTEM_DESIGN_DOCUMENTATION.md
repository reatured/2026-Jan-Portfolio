# Portfolio Project - System Design Documentation

## Project Overview

This is a **Config-Driven Portfolio Application** built with React, TypeScript, and Node.js/Express. It serves as a dynamic portfolio website for an XR & Game Developer, featuring a content management system for easy updates without code changes.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Portfolio UI  │  │   Admin Panel   │  │   Project Detail│ │ │
│  │   (Public)      │  │   (Private)     │  │   Pages         │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Express.js)                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Data API      │  │   File Upload   │  │   Version History│ │
│  │   (REST)        │  │   (Multer)      │  │   (Snapshots)   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   data.json     │  │richContent.json │  │  history.json   │
│   (Projects &   │  │   (HTML Content)│  │  (Versions)     │
│    Site Config) │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Technology Stack

#### Frontend
- **React 19.2.4** - UI framework with latest features
- **TypeScript 5.8.2** - Type safety and better developer experience
- **Material-UI (MUI) 7.3.8** - Component library following Material Design 3
- **React Router 7.13.0** - Client-side routing
- **TanStack Query 5.91.3** - Server state management and caching
- **Vite 6.2.0** - Build tool and dev server
- **Emotion** - CSS-in-JS styling (MUI's default styling engine)

#### Backend
- **Node.js with Express 4.21.0** - REST API server
- **Multer 1.4.5** - File upload handling for images/videos
- **CORS 2.8.5** - Cross-origin resource sharing
- **File-based persistence** - JSON files for data storage

#### Deployment & Analytics
- **Vercel** - Hosting platform with built-in CI/CD
- **Vercel Analytics** - Performance and visitor analytics

## Core Features

### 1. Portfolio Display (Public)
- Responsive grid layout for project cards
- Category-based filtering
- Project detail pages with rich media support
- Mobile-optimized with drawer navigation
- SEO optimization with meta tags

### 2. Content Management System (Admin)
- CRUD operations for projects
- Rich text content support
- Image/video upload with automatic optimization
- Project reordering via drag-and-drop
- Site configuration management
- Version history with restore functionality

### 3. Media Handling
- Support for images, videos, and embedded content (YouTube/Vimeo)
- Automatic thumbnail generation for videos
- File size limits (200MB for uploads)
- Organized asset storage in `/public/assets`

### 4. Data Architecture

#### Data Models

```typescript
// Site Configuration
interface SiteConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  // ... other SEO and personal info fields
  roles: Role[]; // Professional roles with details
}

// Project Structure
interface Project {
  id: string;
  slug: string;
  title: string;
  shortSubtitle: string;
  summary: string;
  content?: string; // Rich HTML content
  categories: string[];
  techStack: TechStackGroup[];
  featuredMedia: MediaItem;
  mediaGallery: MediaItem[];
  links: ProjectLink[];
  isFeatured: boolean;
  // ... additional metadata
}

// Media Types
interface MediaItem {
  type: 'image' | 'video' | 'iframe';
  src: string;
  provider?: 'local' | 'youtube' | 'vimeo';
  // ... media-specific properties
}
```

#### Data Flow

1. **Initial Load**: Frontend fetches data from `/api/data`
2. **Admin Updates**: Changes are saved to `data.json` with version snapshots
3. **Rich Content**: HTML content stored separately in `richContent.json`
4. **File Uploads**: Media files stored in `/public/assets` with unique filenames

### 5. Security Considerations

- **File Upload Validation**: Mimetype and size restrictions
- **CORS Configuration**: Limited to allowed origins
- **Input Validation**: Server-side validation for all API endpoints
- **Atomic Writes**: Prevents data corruption during updates

### 6. Performance Optimizations

- **Code Splitting**: React.lazy for route-based splitting
- **Image Optimization**: Next-gen formats (WebP) support
- **Caching Strategy**: TanStack Query for API response caching
- **Bundle Optimization**: Vite's tree-shaking and minification

## Development Workflow

### Local Development
```bash
# Frontend only
npm run dev

# Full stack (frontend + admin server)
npm run dev:all

# Admin server only
npm run admin
```

### Project Structure
```
src/
├── app/                    # Main application code
│   ├── pages/             # Route components
│   ├── theme.ts           # MUI theme configuration
│   └── App.tsx            # Root component with routing
├── features/              # Feature-based modules
│   ├── common/            # Shared components
│   └── projects/          # Project-specific components
├── infrastructure/        # External integrations
│   ├── api/              # API client setup
│   ├── state/            # Global state (React Query)
│   └── lib/              # Utility libraries
└── packages/             # Shared packages
    └── shared/           # Shared types and utilities

config/                   # Configuration files
├── data.json            # Primary data store
├── richContent.json     # Rich HTML content
└── projects.ts          # Data access layer

server/                  # Express backend
├── index.cjs           # Server entry point
└── history.json        # Version history storage
```

## Deployment Architecture

### Vercel Deployment
- **Frontend**: Deployed as static site
- **Serverless Functions**: Admin API converted to serverless
- **File Storage**: Vercel's static asset hosting
- **Environment Variables**: Secure API key management

### Build Process
1. TypeScript compilation
2. React build with Vite
3. Asset optimization and hashing
4. Static site generation
5. Deployment to CDN edges

## Scalability Considerations

### Current Limitations
- File-based storage (not suitable for high concurrency)
- No database (limited querying capabilities)
- Single admin user (no authentication system)

### Potential Improvements
1. **Database Migration**: Move to PostgreSQL/MongoDB
2. **Authentication**: Add JWT-based admin authentication
3. **CDN Integration**: Cloudinary/AWS S3 for media storage
4. **Caching Layer**: Redis for frequent API calls
5. **Microservices**: Separate admin and public APIs

## Monitoring & Analytics

- **Vercel Analytics**: Page views, Web Vitals, visitor data
- **Error Tracking**: Built-in error boundaries and logging
- **Performance Monitoring**: Core Web Vitals optimization
- **SEO Monitoring**: Meta tag optimization and sitemap generation

## Key Design Decisions

1. **Config-Driven Approach**: Enables non-technical content updates
2. **Material Design 3**: Modern, accessible UI system
3. **Type Safety**: Full TypeScript coverage for reliability
4. **Separation of Concerns**: Clear frontend/backend boundaries
5. **Version Control**: Built-in history for content management
6. **Mobile-First**: Responsive design with mobile considerations
7. **SEO Optimization**: Server-side rendering considerations for static build

## Future Roadmap

1. **Multi-language Support**: i18n implementation
2. **Advanced Search**: Full-text search capabilities
3. **Blog Integration**: Add blog functionality
4. **Contact Form**: Serverless contact functionality
5. **Project Categories**: Enhanced categorization system
6. **Dark Mode**: Theme switching capability
7. **PWA Features**: Offline support and app-like experience
