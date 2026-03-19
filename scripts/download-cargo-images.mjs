/**
 * Cargo Image Downloader v3
 *
 * Uses Playwright network interception to capture image URLs as they load,
 * then downloads them via the authenticated browser context.
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const ASSETS_DIR = join(ROOT, 'public', 'assets', 'cargo-import');

const BASE_URL = 'https://lingyizhou.cargo.site';

const PROJECT_PAGES = [
  { slug: 'robot-hand', path: '/Page-28' },
  { slug: 'snapchat-glass-bridge', path: '/Page-26' },
  { slug: 'gogreennext', path: '/Page-29' },
  { slug: 'curaloop', path: '/Page-27' },
  { slug: 'b612-soccer', path: '/Page-23' },
  { slug: 'hardware-store', path: '/Page-1' },
  { slug: 'ar-drawing', path: '/Page-2' },
  { slug: 'ping-pong', path: '/Page-16' },
  { slug: 'no-job-too-small', path: '/Page-17' },
  { slug: 'schedule-assistant', path: '/Page-3' },
  { slug: 'flerken-ar', path: '/Page-25' },
  { slug: 'curtain-hook', path: '/Page-4' },
  { slug: 'just-another-day', path: '/Page-5' },
  { slug: 'vr-oculus', path: '/Page-8' },
  { slug: 'creative-coding', path: '/Page-10' },
  { slug: '3d-poster', path: '/Page-9' },
];

const EXT_MAP = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/quicktime': '.mov',
};

if (!existsSync(ASSETS_DIR)) mkdirSync(ASSETS_DIR, { recursive: true });

async function collectUrls(context, url, label) {
  const captured = [];
  const page = await context.newPage();

  page.on('response', (response) => {
    const ct = response.headers()['content-type'] || '';
    const rUrl = response.url();
    if (rUrl.includes('freight.cargo.site') &&
        (ct.startsWith('image/') || ct.startsWith('video/')) &&
        response.status() === 200) {
      captured.push({ url: rUrl, contentType: ct });
    }
  });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Scroll to trigger lazy loading
  await page.evaluate(async () => {
    for (let i = 0; i < document.body.scrollHeight; i += 300) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 200));
    }
  });
  await page.waitForTimeout(2000);

  console.log(`  ${label}: ${captured.length} media responses`);
  await page.close();
  return captured;
}

async function downloadFile(context, url, filepath) {
  const page = await context.newPage();
  try {
    const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    if (!response || response.status() !== 200) {
      await page.close();
      return false;
    }
    const body = await response.body();
    writeFileSync(filepath, body);
    await page.close();
    return body.length;
  } catch (e) {
    await page.close();
    return false;
  }
}

async function main() {
  console.log('🚀 Cargo Image Downloader v3\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  });

  // Step 1: Visit homepage to establish session
  console.log('📡 Establishing session...');
  const sessionPage = await context.newPage();
  await sessionPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sessionPage.waitForTimeout(2000);
  await sessionPage.close();
  console.log('✓ Session ready\n');

  // Step 2: Collect all media URLs from overview + each project page
  const allMedia = {}; // slug -> [{url, contentType}]

  // Overview page for thumbnails
  console.log('📄 Scanning overview page...');
  const overviewMedia = await collectUrls(context, `${BASE_URL}/overview`, 'overview');

  // Each project page
  for (const project of PROJECT_PAGES) {
    console.log(`📄 Scanning ${project.slug}...`);
    const media = await collectUrls(context, `${BASE_URL}${project.path}`, project.slug);
    allMedia[project.slug] = media;
  }

  // Step 3: Deduplicate URLs globally, build download list
  const seenUrls = new Set();
  const downloadQueue = []; // {slug, url, hiResUrl, contentType}

  // Add overview thumbnails (assign to closest project by examining URL)
  for (const item of overviewMedia) {
    const hiRes = item.url.replace(/\/w\/\d+\//, '/t/original/');
    if (!seenUrls.has(hiRes)) {
      seenUrls.add(hiRes);
      downloadQueue.push({ slug: '_thumbnails', ...item, hiResUrl: hiRes });
    }
  }

  // Add per-project media
  for (const [slug, items] of Object.entries(allMedia)) {
    for (const item of items) {
      const hiRes = item.url.replace(/\/w\/\d+\//, '/t/original/');
      if (!seenUrls.has(hiRes)) {
        seenUrls.add(hiRes);
        downloadQueue.push({ slug, ...item, hiResUrl: hiRes });
      }
    }
  }

  console.log(`\n📥 Downloading ${downloadQueue.length} unique media files...\n`);

  // Step 4: Download all files
  const manifest = {};
  let downloaded = 0;
  let failed = 0;

  for (const item of downloadQueue) {
    const dir = join(ASSETS_DIR, item.slug);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    // Extract filename from URL
    const urlPath = new URL(item.url).pathname;
    const parts = urlPath.split('/');
    let filename = parts[parts.length - 1] || `media-${downloaded}`;
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Ensure extension
    const ext = EXT_MAP[item.contentType] || extname(filename) || '.bin';
    if (!filename.endsWith(ext)) filename = filename + ext;

    const filepath = join(dir, filename);

    // Try hi-res first, fall back to original URL
    let size = await downloadFile(context, item.hiResUrl, filepath);
    if (!size) {
      size = await downloadFile(context, item.url, filepath);
    }

    if (size) {
      const kb = Math.round(size / 1024);
      console.log(`  ✓ ${kb}KB → ${item.slug}/${filename}`);
      downloaded++;

      if (!manifest[item.slug]) manifest[item.slug] = [];
      manifest[item.slug].push({
        originalUrl: item.url,
        hiResUrl: item.hiResUrl,
        localPath: `public/assets/cargo-import/${item.slug}/${filename}`,
        contentType: item.contentType,
      });
    } else {
      console.log(`  ✗ Failed → ${item.slug}/${filename}`);
      failed++;
    }
  }

  // Save manifest
  writeFileSync(join(ASSETS_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

  await browser.close();

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Downloaded: ${downloaded} | Failed: ${failed}`);
  console.log(`📋 Manifest: public/assets/cargo-import/manifest.json`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
