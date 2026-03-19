/**
 * Cargo Portfolio Scraper v9
 *
 * Strategy:
 * 1. Visit each project page and extract __PRELOADED_STATE__ from script tags
 *    (contains complete media hash→filename mapping per page)
 * 2. Also extract from window.store.getState() as backup
 * 3. Also intercept network API responses that return page data with media
 * 4. Download media via curl using real filenames
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const ASSETS_DIR = join(ROOT, 'public', 'assets', 'cargo-import');
const OUTPUT_FILE = join(ROOT, 'config', 'scraped_projects.json');
const BASE_URL = 'https://lingyizhou.cargo.site';

if (!existsSync(ASSETS_DIR)) mkdirSync(ASSETS_DIR, { recursive: true });

// ── Download via curl ────────────────────────────────────────────────────────

function curlDownload(url, filepath) {
  try {
    execSync(`curl -sS -L -o "${filepath}" -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' -H 'Referer: ${BASE_URL}/' --max-time 30 "${url}"`, { stdio: 'pipe' });
    const stat = execSync(`stat -f%z "${filepath}"`, { encoding: 'utf8' }).trim();
    const size = parseInt(stat);
    if (size === 0) {
      execSync(`rm -f "${filepath}"`, { stdio: 'pipe' });
      return false;
    }
    // Detect HTML error pages
    const head = execSync(`head -c 100 "${filepath}"`, { encoding: 'utf8' });
    if (head.includes('<!DOCTYPE') || head.includes('<html') || head.includes('<HTML')) {
      execSync(`rm -f "${filepath}"`, { stdio: 'pipe' });
      return false;
    }
    return size;
  } catch {
    try { execSync(`rm -f "${filepath}"`, { stdio: 'pipe' }); } catch {}
    return false;
  }
}

// ── Slow scroll ──────────────────────────────────────────────────────────────

async function fullScroll(page) {
  await page.evaluate(async () => {
    const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 5000);
    for (let i = 0; i < h; i += 150) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 200));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2000);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Cargo Portfolio Scraper v9 ===\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
  });

  // Global media map: hash → { name, mime_type, ... }
  const globalMediaMap = {};

  // ── Step 1: Load homepage, find project links ─────────────────────────────

  console.log('[1/4] Loading homepage...');
  const page = await context.newPage();

  // Intercept API responses that contain media data
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/') || url.includes('cargo.site/_/')) {
      try {
        const ct = response.headers()['content-type'] || '';
        if (ct.includes('json') && response.status() === 200) {
          const body = await response.json();
          extractMediaFromJson(body, globalMediaMap);
        }
      } catch {}
    }
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  await fullScroll(page);

  // Extract __PRELOADED_STATE__ from homepage
  extractPreloadedState(await page.content(), globalMediaMap);
  console.log(`  Media map after homepage: ${Object.keys(globalMediaMap).length}`);

  const projectLinks = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('a[rel="history"]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('Page-')) {
        const h = a.querySelector('h1, h2, h3');
        links.push({ path: href, title: h?.textContent?.trim() || '' });
      }
    });
    return links;
  });
  console.log(`  Found ${projectLinks.length} project links\n`);

  // ── Step 2: Visit each project page ───────────────────────────────────────

  console.log('[2/4] Scraping project pages...\n');
  const allProjects = [];

  for (const link of projectLinks) {
    console.log(`  ${link.path}...`);

    try {
      await page.goto(`${BASE_URL}/${link.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      await fullScroll(page);

      // Extract __PRELOADED_STATE__ from this page's HTML
      const html = await page.content();
      extractPreloadedState(html, globalMediaMap);

      // Also extract from live store
      const storeMediaForPage = await page.evaluate(() => {
        const result = {};
        try {
          const state = window.store?.getState();
          const pages = state?.pages?.byId || {};
          for (const pageData of Object.values(pages)) {
            for (const item of (pageData?.media || [])) {
              if (item.hash && item.name) {
                result[item.hash] = {
                  name: item.name,
                  mime_type: item.mime_type || '',
                  file_type: item.file_type || '',
                  is_video: item.is_video || false,
                  is_url: item.is_url || false,
                  width: item.width || 0,
                  height: item.height || 0,
                };
              }
            }
          }
        } catch {}
        return result;
      });
      Object.assign(globalMediaMap, storeMediaForPage);

      // Extract project content from DOM
      const data = await page.evaluate((pageId) => {
        const result = {
          pageId,
          title: '',
          subtitle: '',
          bodyHtml: '',
          bodyText: '',
          year: '',
          categories: [],
          links: [],
          mediaHashes: [],
          iframeEmbeds: [],
        };

        const h1 = document.querySelector('#page_content h1') || document.querySelector('h1');
        result.title = h1?.textContent?.trim() || '';
        const yearMatch = result.title.match(/\((\d{4})\)/);
        if (yearMatch) result.year = yearMatch[1];

        const content = document.querySelector('#page_content') || document.querySelector('main');
        if (content) {
          const clone = content.cloneNode(true);
          clone.querySelectorAll('nav, header, footer').forEach(el => el.remove());
          result.bodyHtml = clone.innerHTML;
          result.bodyText = clone.textContent?.trim().substring(0, 3000) || '';
        }

        const seenHash = new Set();
        document.querySelectorAll('media-item').forEach(mi => {
          const hash = mi.getAttribute('hash');
          if (hash && !seenHash.has(hash)) {
            seenHash.add(hash);
            result.mediaHashes.push({
              hash,
              name: mi.getAttribute('name') || null,
              isVideo: mi.getAttribute('autoplay') === 'true' || mi.hasAttribute('video'),
            });
          }
        });

        document.querySelectorAll('iframe').forEach(iframe => {
          const src = iframe.src || iframe.getAttribute('data-src');
          if (src) result.iframeEmbeds.push({ src, width: iframe.width, height: iframe.height });
        });

        document.querySelectorAll('a[href]').forEach(a => {
          if (a.href.startsWith('http') && !a.href.includes('cargo.site')) {
            result.links.push({ label: a.textContent?.trim().substring(0, 100) || '', url: a.href });
          }
        });

        return result;
      }, link.path);

      data.slug = slugify(data.title || link.path);
      allProjects.push(data);

      const mapSize = Object.keys(globalMediaMap).length;
      console.log(`    "${data.title}" | DOM: ${data.mediaHashes.length} | Map: ${mapSize}`);

    } catch (err) {
      console.log(`    ERROR: ${err.message}`);
      allProjects.push({
        pageId: link.path, slug: slugify(link.title || link.path),
        error: err.message, mediaHashes: [], links: [], iframeEmbeds: [],
      });
    }
  }

  await page.close();
  await browser.close();

  const totalInMap = Object.keys(globalMediaMap).length;
  console.log(`\n  Total media with filenames: ${totalInMap}`);

  // ── Step 3: Download all media ────────────────────────────────────────────

  console.log('\n[3/4] Downloading media via curl...\n');

  const manifest = {};
  let downloaded = 0, failed = 0, skipped = 0, skipUrl = 0, skipSvg = 0;
  const seenHashes = new Set();

  for (const project of allProjects) {
    if (!project.mediaHashes?.length) continue;

    for (const media of project.mediaHashes) {
      if (seenHashes.has(media.hash)) continue;
      seenHashes.add(media.hash);

      const slug = project.slug;
      const item = globalMediaMap[media.hash];

      // Skip URL-type media (embeds)
      if (item?.is_url || item?.mime_type === 'text/uri-list') {
        skipUrl++;
        continue;
      }

      // Skip SVGs (they're placeholders in Cargo)
      if (item?.mime_type === 'image/svg+xml' || item?.file_type === 'svg') {
        skipSvg++;
        continue;
      }

      const realName = item?.name;
      if (!realName) {
        console.log(`  MISS ${slug}/${media.hash}`);
        failed++;
        continue;
      }

      const filename = sanitize(realName);
      const isVideo = item?.is_video || media.isVideo;
      const dir = join(ASSETS_DIR, slug);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      const filepath = join(dir, filename);

      // Skip if already exists and valid
      if (existsSync(filepath)) {
        try {
          const stat = execSync(`stat -f%z "${filepath}"`, { encoding: 'utf8' }).trim();
          const sz = parseInt(stat);
          const head = execSync(`head -c 100 "${filepath}"`, { encoding: 'utf8' });
          if (sz > 100 && !head.includes('<!DOCTYPE')) {
            skipped++;
            if (!manifest[slug]) manifest[slug] = [];
            manifest[slug].push({ hash: media.hash, localPath: `/assets/cargo-import/${slug}/${filename}`, isVideo, fileSize: sz });
            continue;
          }
        } catch {}
      }

      const encodedName = encodeURIComponent(realName);
      const urls = [
        `https://freight.cargo.site/t/original/i/${media.hash}/${encodedName}`,
        `https://freight.cargo.site/w/1500/i/${media.hash}/${encodedName}`,
        `https://freight.cargo.site/w/1000/i/${media.hash}/${encodedName}`,
      ];

      let size = false;
      for (const url of urls) {
        size = curlDownload(url, filepath);
        if (size) break;
      }

      if (size) {
        console.log(`  OK   ${Math.round(size/1024)}KB  ${slug}/${filename}`);
        downloaded++;
        if (!manifest[slug]) manifest[slug] = [];
        manifest[slug].push({ hash: media.hash, localPath: `/assets/cargo-import/${slug}/${filename}`, isVideo, fileSize: size });
      } else {
        console.log(`  FAIL ${slug}/${filename}`);
        failed++;
      }
    }
  }

  // Save outputs
  writeFileSync(join(ASSETS_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  writeFileSync(OUTPUT_FILE, JSON.stringify(allProjects, null, 2));
  writeFileSync(join(ASSETS_DIR, 'media-map.json'), JSON.stringify(globalMediaMap, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log(`Projects scraped:  ${allProjects.length}`);
  console.log(`Media mapped:      ${totalInMap}`);
  console.log(`Media downloaded:  ${downloaded}`);
  console.log(`Media cached:      ${skipped}`);
  console.log(`Media embeds:      ${skipUrl}`);
  console.log(`Media SVGs:        ${skipSvg}`);
  console.log(`Media failed:      ${failed}`);
  console.log('='.repeat(50));
}

// ── Extract media from __PRELOADED_STATE__ in HTML ──────────────────────────

function extractPreloadedState(html, mediaMap) {
  const match = html.match(/window\.__PRELOADED_STATE__\s*=\s*({.+?});\s*<\/script>/s);
  if (!match) return;
  try {
    const state = JSON.parse(match[1]);
    const pages = state?.pages?.byId || {};
    for (const pageData of Object.values(pages)) {
      for (const item of (pageData?.media || [])) {
        if (item.hash && item.name) {
          mediaMap[item.hash] = {
            name: item.name,
            mime_type: item.mime_type || '',
            file_type: item.file_type || '',
            is_video: item.is_video || false,
            is_url: item.is_url || false,
            width: item.width || 0,
            height: item.height || 0,
          };
        }
      }
    }
  } catch (e) {
    // JSON parse can fail if state is malformed
  }
}

// ── Extract media from API JSON responses ───────────────────────────────────

function extractMediaFromJson(obj, mediaMap) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    for (const item of obj) extractMediaFromJson(item, mediaMap);
    return;
  }
  // If this object looks like a media item
  if (obj.hash && obj.name && (obj.mime_type || obj.file_type)) {
    mediaMap[obj.hash] = {
      name: obj.name,
      mime_type: obj.mime_type || '',
      file_type: obj.file_type || '',
      is_video: obj.is_video || false,
      is_url: obj.is_url || false,
      width: obj.width || 0,
      height: obj.height || 0,
    };
  }
  for (const val of Object.values(obj)) {
    if (val && typeof val === 'object') extractMediaFromJson(val, mediaMap);
  }
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'untitled';
}

function sanitize(name) {
  let clean = decodeURIComponent(name).replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!extname(clean)) clean += '.jpg';
  return clean;
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
