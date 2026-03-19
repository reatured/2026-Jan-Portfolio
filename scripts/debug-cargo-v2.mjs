import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

const imageUrls = [];
page.on('response', async (response) => {
  const ct = response.headers()['content-type'] || '';
  if ((ct.startsWith('image/') || ct.startsWith('video/')) && response.url().includes('freight')) {
    imageUrls.push(response.url());
  }
});

// Method 1: Direct navigation
console.log('--- Method 1: Direct /Page-4 ---');
await page.goto('https://lingyizhou.cargo.site/Page-4', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);
console.log('freight images:', imageUrls.length);
console.log('Title:', await page.title());
await page.screenshot({ path: '/tmp/cargo-m1.png', fullPage: true });

// Method 2: Go to homepage first, then click to navigate
console.log('\n--- Method 2: Homepage then client-side nav ---');
imageUrls.length = 0;
const page2 = await context.newPage();
page2.on('response', async (response) => {
  const ct = response.headers()['content-type'] || '';
  if ((ct.startsWith('image/') || ct.startsWith('video/')) && response.url().includes('freight')) {
    imageUrls.push(response.url());
  }
});

await page2.goto('https://lingyizhou.cargo.site/', { waitUntil: 'networkidle', timeout: 30000 });
await page2.waitForTimeout(2000);
console.log('Homepage freight images:', imageUrls.length);

// Try clicking on a project link
try {
  // Look for any clickable element that might navigate to Page-4
  const links = await page2.$$('a[href*="Page-4"], a[rel="history"]');
  console.log(`Found ${links.length} history links`);

  // Try direct JS navigation like Cargo does
  await page2.evaluate(() => {
    // Cargo uses history pushState
    const evt = new CustomEvent('cargo:navigate', { detail: { url: '/Page-4' } });
    window.dispatchEvent(evt);
  });
  await page2.waitForTimeout(2000);

  // Try clicking the specific project
  const allLinks = await page2.$$eval('a', links => links.map(l => ({ href: l.href, text: l.textContent?.trim().substring(0, 50) })));
  console.log('All links:', allLinks.filter(l => l.href.includes('Page-') || l.text.includes('Hook') || l.text.includes('Curtain')));
} catch(e) {
  console.log('Nav error:', e.message);
}

// Method 3: Try the overview page which shows thumbnails
console.log('\n--- Method 3: Overview page ---');
imageUrls.length = 0;
const page3 = await context.newPage();
page3.on('response', async (response) => {
  const ct = response.headers()['content-type'] || '';
  if ((ct.startsWith('image/') || ct.startsWith('video/')) && response.url().includes('freight')) {
    imageUrls.push(response.url());
  }
});
await page3.goto('https://lingyizhou.cargo.site/overview', { waitUntil: 'networkidle', timeout: 30000 });
await page3.waitForTimeout(3000);

// Scroll the overview
await page3.evaluate(async () => {
  for (let i = 0; i < document.body.scrollHeight; i += 300) {
    window.scrollTo(0, i);
    await new Promise(r => setTimeout(r, 200));
  }
});
await page3.waitForTimeout(3000);

console.log('Overview freight images:', imageUrls.length);
imageUrls.forEach(u => console.log('  ', u.substring(0, 120)));
await page3.screenshot({ path: '/tmp/cargo-m3.png', fullPage: true });

await browser.close();
