# Cargo Migration Log

## Stage 1: Scraping
- **Source**: https://lingyizhou.cargo.site/
- **Projects found**: 17 (IDs: 28, 26, 29, 27, 23, 01, 02, 16, 17, 03, 25, 04, 05, 08, 10, 09, 10b)
- **Status**: All project detail pages scraped successfully

### Media Download Issue
- Cargo's CloudFront CDN returns 403 for direct image downloads
- Tried: curl with browser headers, Sec-Fetch headers, different URL patterns
- **Decision**: Will skip media downloads for now — logged as a manual task for the user
- **User action needed**: Manually download images from Cargo site or use browser dev tools to save them

## Skipped Tasks (Need User Input)
- [ ] Download images from Cargo CDN (blocked by CloudFront 403)

## Stage 2: Backend Data Review (2026-03-18)

**Reviewer**: Backend Review Agent

### Validation Summary
- **17 projects** validated against TypeScript types in `types.ts`
- **0 structural errors** found -- all required fields present and correctly typed
- **0 duplicate IDs or slugs**
- **0 broken local media references** (all `/assets/` paths resolve to existing files)
- **0 invalid link URLs**
- **All IDs are strings** (compatible with Express route param matching)
- **Site config** passes all required field checks including `roles` array with `title` and `details`

### API Compatibility (server/index.cjs)
- Top-level `data.json` structure has both `site` and `projects` keys as expected
- `withEffectiveProjectContent()` merges `richContent.json` correctly; inline `content` takes precedence
- Project lookup by `id` (string comparison) is compatible with all project IDs
- No field assumptions in the API that would break with current data

### Informational Notes (No Action Required)
1. **Redundant richContent entries**: Projects `26` and `27` have content both inline in `data.json` and in `richContent.json`. The inline content takes precedence per the API logic (`project.content || richContent[project.id]`). The richContent entries are effectively unused but harmless.
2. **HTML content tag balance**: 10 projects have minor tag count imbalances in their `content` HTML. Inspection shows these are caused by void/self-closing elements (`<br>`, `<img>`, `<hr>`) and are valid HTML -- not actual errors.
3. **Most media references are external** (Cargo CDN URLs, YouTube embeds, etc.). Only 4 files exist locally in `public/assets/`. This is expected given the CDN download issue from Stage 1.
4. **Section distribution**: 2 projects in "Current Projects", 15 in "Most Recent", 0 in "Archive".

### Fixes Applied
- None required. Data integrity is clean.

## Stage 3: Frontend Review (2026-03-18)

**Reviewer**: Frontend Review Agent

### Critical Issues Fixed

1. **YouTube videos rendered as `<video>` tags (7 items)** -- Projects 28, 01, 02, 17, 05, 08 all had media gallery items with `type: "video"` but YouTube URLs as `src`. `Media.tsx` renders `<video src="...">` for type=video, which silently fails for YouTube URLs (browser cannot decode them as video files). **Fix**: Changed all 7 items to `type: "iframe"` and set `src` to the `embedUrl` (e.g., `https://www.youtube.com/embed/...`). Added `height: 450` and default `allow` permissions to each.

2. **p5.js iframe missing height (Project 16)** -- The p5.js editor embed in `mediaGallery[0]` had no `height` value. Since `Media.tsx` used `height` directly for the container, this iframe would collapse to 0px. **Fix**: Set `height: 500` in data.json. Also added an `aspectRatio: '16/9'` fallback in `Media.tsx` for any future iframes missing an explicit height.

3. **OG image set to iframe URL (Project 28)** -- `ProjectDetail.tsx` passed `project.featuredMedia.src` directly to the `<Head>` component as the OG image. For project 28 (iframe featured media), this would set the OG image to a Vercel app URL instead of an actual image, breaking social media previews. **Fix**: Changed to only pass `featuredMedia.src` when `type === 'image'`, falling back to `siteConfig.defaultOgImage` otherwise.

### Files Modified
- `config/data.json` -- Fixed 7 YouTube media items (type video -> iframe) and 1 missing iframe height
- `components/project/Media.tsx` -- Added `aspectRatio: '16/9'` fallback for iframes without explicit height
- `pages/ProjectDetail.tsx` -- Fixed OG image to only use image-type featured media

### Validation Checks Passed (No Issues)
- All `featuredMedia` objects have required `type` and `src` fields
- Category filter in Sidebar matches categories used in projects (all 4 project categories exist in `site.roles`)
- `ProjectCard` handles missing `thumbnail` gracefully (falls back to featuredMedia image or defaultOgImage)
- Rich HTML `content` renders via `dangerouslySetInnerHTML` -- content is author-controlled (not user input), acceptable
- All component imports resolve correctly; no broken references
- Social icon mapping in Sidebar covers all icons used in data.json
- Theme uses consistent palette tokens; `shape.borderRadius` set globally

### Informational Notes / Suggestions
1. **Hardcoded colors in ProjectDetail.tsx** -- The right sidebar panels use hardcoded hex colors (e.g., `#dde5f0`, `#f4f6fb`, `#8fa8cc`, `#dce6f5`) instead of theme palette tokens. These will not adapt if a dark mode is ever added. Low priority since only light theme is currently used.
2. **Graphic Designer role has no projects** -- The "Graphic Designer" role appears in the Sidebar filter but no projects use this category, so clicking it shows "No projects found." Consider either adding projects with this category or removing the role.
3. **Placeholder images from picsum.photos** -- 14 of 17 projects use `picsum.photos` placeholder URLs for their featured media images. These are random stock photos and should be replaced with actual project screenshots.
4. **`defaultOgImage` is picsum.photos** -- The site default OG image (`https://picsum.photos/1200/630`) returns random images on each request, producing inconsistent social previews. Should be replaced with a stable branded image.
5. **Gallery caption bgcolor uses `grey.50`** -- In ProjectDetail.tsx line 118, the gallery caption background uses `grey.50` which would not adapt to dark mode. Minor concern since dark mode is not currently active on the portfolio side.
