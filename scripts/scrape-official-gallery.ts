import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const OUTPUT_FILE = path.resolve(process.cwd(), 'public/data/gallery-images.json');
const TARGET_URL = 'https://klbq.idreamsky.com/media?type=gallery';

async function scrapeGallery() {
  console.log('Starting Official Gallery Scraper...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {

    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000); // Initial wait for page to settle

    // Simplified approach: Just load the page and scroll to trigger all lazy loads
    // The gallery usually loads a default category. We will grab everything we see.
    
    // Scroll repeatedly
    console.log('Scrolling to trigger lazy loading...');
    for (let i = 0; i < 10; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await page.waitForTimeout(1000);
    }

    // Explicitly wait for at least one gallery image
    try {
        await page.waitForSelector('img[src*="klbq-website-cdn"]', { timeout: 15000 });
    } catch (e) {
        console.log('Timeout waiting for specific CDN images, grabbing all images anyway...');
    }

    const imageUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src => src && src.includes('klbq-website-cdn.idreamsky.com/klbq-admin/prod/images/'))
        .filter((v, i, a) => a.indexOf(v) === i); // Deduplicate
    });

    console.log(`Found ${imageUrls.length} images.`);

    // Map to structure
    const structuredData = imageUrls.map(url => ({
        url,
        type: 'official-gallery',
        title: 'Gallery Image', // Placeholder
        fetchedAt: new Date().toISOString()
    }));

    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(structuredData, null, 2));
    console.log(`Saved data to ${OUTPUT_FILE}`);

    // Generate Markdown Preview
    const MD_FILE = path.resolve(process.cwd(), 'docs/gallery-preview.md');
    let mdContent = '# Official Gallery Preview\n\n';
    mdContent += `> Generated at ${new Date().toISOString()}\n\n`;
    mdContent += `Total Images: ${structuredData.length}\n\n---\n\n`;

    structuredData.forEach((item, index) => {
        mdContent += `### Image ${index + 1}\n\n`;
        mdContent += `![](${item.url})\n\n`;
        mdContent += `**URL**: \`${item.url}\`\n\n`;
        mdContent += `---\n\n`;
    });

    await fs.mkdir(path.dirname(MD_FILE), { recursive: true });
    await fs.writeFile(MD_FILE, mdContent);
    console.log(`Saved markdown preview to ${MD_FILE}`);

  } catch (error) {
    console.error('Error scraping gallery:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

scrapeGallery();
