import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto('https://lingyizhou.cargo.site/Page-4', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);

// Screenshot for visual debug
await page.screenshot({ path: '/tmp/cargo-debug.png', fullPage: true });

// Check what's in the DOM
const html = await page.content();
console.log('Page length:', html.length);

// Find all img-like patterns
const imgCount = (html.match(/<img/gi) || []).length;
const bgCount = (html.match(/background-image/gi) || []).length;
const freightCount = (html.match(/freight\.cargo\.site/gi) || []).length;
const dataImgCount = (html.match(/data-image/gi) || []).length;
const mediaSrcCount = (html.match(/data-src/gi) || []).length;

console.log('img tags:', imgCount);
console.log('background-image:', bgCount);
console.log('freight.cargo.site refs:', freightCount);
console.log('data-image attrs:', dataImgCount);
console.log('data-src attrs:', mediaSrcCount);

// Intercept network requests for images
const page2 = await browser.newPage();
const imageUrls = [];
page2.on('response', async (response) => {
  const contentType = response.headers()['content-type'] || '';
  if (contentType.startsWith('image/') || contentType.startsWith('video/')) {
    imageUrls.push({ url: response.url(), type: contentType, status: response.status() });
  }
});

await page2.goto('https://lingyizhou.cargo.site/Page-4', { waitUntil: 'networkidle', timeout: 30000 });
await page2.waitForTimeout(5000);

// Scroll to load lazy images
await page2.evaluate(async () => {
  for (let i = 0; i < document.body.scrollHeight; i += 300) {
    window.scrollTo(0, i);
    await new Promise(r => setTimeout(r, 300));
  }
});
await page2.waitForTimeout(3000);

console.log('\n--- Network image/video responses ---');
imageUrls.forEach(u => console.log(`  [${u.status}] ${u.type} ${u.url.substring(0, 120)}`));
console.log(`Total: ${imageUrls.length}`);

await browser.close();
