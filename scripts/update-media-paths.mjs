/**
 * Update data.json to replace placeholder images with locally downloaded assets.
 *
 * Maps:
 * - data.json project IDs → Cargo page IDs → manifest slugs
 * - Replaces picsum.photos URLs in featuredMedia, mediaGallery, and content HTML
 * - Populates empty mediaGallery arrays with downloaded images
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const dataPath = join(ROOT, 'config', 'data.json');
const manifestPath = join(ROOT, 'public', 'assets', 'cargo-import', 'manifest.json');
const mediaMapPath = join(ROOT, 'public', 'assets', 'cargo-import', 'media-map.json');

const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const mediaMap = JSON.parse(readFileSync(mediaMapPath, 'utf8'));

// ── Mapping: data.json project ID → manifest slug ───────────────────────────

const ID_TO_SLUG = {
  '28': 'robot-hand-real-time-teleoperation-interface-2025',
  '26': 'snapchat-glass-bridge-challenge-2025',
  '29': 'gogreennext-modular-map-tiles-2024',
  '27': 'curaloop-ai-companion-for-alzheimer-s-care-2025',
  '23': 'b612-soccer-2025',
  '01': 'hardware-store-search-tool',
  '02': 'ar-drawing-research-project-at-snap-inc',
  '17': 'page-17',
  '03': 'page-3',
  '25': 'marvel-s-flerken-ar-filter-commercial-ar-campaign',
  '04': 'page-4',
  '05': 'page-5',
  '08': 'page-8',
  '10': 'page-10',
  '09': 'page-9',
  '16': null, // Ping pong — no scraped media
  '10b': 'page-10', // Teddy bear shares Page-10 with creative coding
};

// ── Build hash → local path lookup ──────────────────────────────────────────

const hashToLocal = {};
for (const [slug, items] of Object.entries(manifest)) {
  for (const item of items) {
    hashToLocal[item.hash] = item.localPath;
  }
}

// ── Helper: detect image vs video ───────────────────────────────────────────

function getMediaType(path) {
  const ext = path.split('.').pop().toLowerCase();
  if (['mp4', 'mov', 'webm'].includes(ext)) return 'video';
  return 'image';
}

// ── Process each project ────────────────────────────────────────────────────

let updated = 0;
let featuredUpdated = 0;
let galleryUpdated = 0;
let contentUpdated = 0;

for (const project of data.projects) {
  const slug = ID_TO_SLUG[project.id];
  if (!slug) continue;

  const items = manifest[slug] || [];
  if (items.length === 0) continue;

  // Separate images and videos
  const images = items.filter(i => !i.isVideo && getMediaType(i.localPath) === 'image');
  const videos = items.filter(i => i.isVideo || getMediaType(i.localPath) === 'video');

  // ── Update featuredMedia ────────────────────────────────────────────────

  const currentFeatured = project.featuredMedia;
  const isPicsum = currentFeatured?.src?.includes('picsum.photos');
  const isPlaceholder = isPicsum || !currentFeatured?.src || currentFeatured?.src === '';

  if (isPlaceholder && currentFeatured?.type !== 'iframe') {
    const featured = images[0];
    if (featured) {
      project.featuredMedia = {
        type: getMediaType(featured.localPath),
        src: featured.localPath,
        alt: project.title,
      };
      featuredUpdated++;
      console.log(`  Featured: ${project.id} "${project.title}" → ${featured.localPath}`);
    }
  }

  // ── Update mediaGallery (only if empty) ─────────────────────────────────

  if (project.mediaGallery.length === 0 && items.length > 0) {
    const startIdx = isPlaceholder ? 1 : 0;
    const galleryItems = [];

    for (let i = startIdx; i < images.length; i++) {
      galleryItems.push({
        type: getMediaType(images[i].localPath),
        src: images[i].localPath,
        alt: `${project.title} - Image ${i + 1}`,
      });
    }

    for (const vid of videos) {
      galleryItems.push({
        type: 'video',
        src: vid.localPath,
        alt: `${project.title} - Video`,
      });
    }

    if (galleryItems.length > 0) {
      const existingEmbeds = project.mediaGallery.filter(m => m.type === 'iframe');
      project.mediaGallery = [...existingEmbeds, ...galleryItems];
      galleryUpdated++;
      console.log(`  Gallery: ${project.id} "${project.title}" → ${galleryItems.length} items`);
    }
  }

  // ── Update content HTML: replace picsum URLs with local paths ───────────

  if (project.content) {
    let content = project.content;
    let changed = false;

    // Replace picsum.photos/seed/HASH URLs
    content = content.replace(
      /https:\/\/picsum\.photos\/seed\/([A-Z]\d{30,})\/([\d]+(?:\/[\d]+)?)/g,
      (match, hash) => {
        const local = hashToLocal[hash];
        if (local) {
          changed = true;
          return local;
        }
        return match;
      }
    );

    // Also replace cargo freight URLs
    content = content.replace(
      /https:\/\/freight\.cargo\.site\/[^"'\s]+\/i\/([A-Z]\d{30,})\/[^"'\s]+/g,
      (match, hash) => {
        const local = hashToLocal[hash];
        if (local) {
          changed = true;
          return local;
        }
        return match;
      }
    );

    if (changed) {
      project.content = content;
      contentUpdated++;
      console.log(`  Content: ${project.id} "${project.title}" — HTML updated`);
    }
  }

  updated++;
}

// ── Save ─────────────────────────────────────────────────────────────────────

// Backup first
writeFileSync(dataPath + '.bak3', readFileSync(dataPath));
writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log('\n=== Media Path Update Complete ===');
console.log(`Projects processed: ${updated}`);
console.log(`Featured images updated: ${featuredUpdated}`);
console.log(`Media galleries populated: ${galleryUpdated}`);
console.log(`Content HTML updated: ${contentUpdated}`);
console.log(`Total hash→local mappings: ${Object.keys(hashToLocal).length}`);
