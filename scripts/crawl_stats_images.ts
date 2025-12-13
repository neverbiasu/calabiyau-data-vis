
import { $ } from 'bun';
import * as cheerio from 'cheerio';
import fs from 'node:fs';

const TARGET_URL = 'https://wiki.biligame.com/klbq/%E4%B8%BB%E6%AD%A6%E5%99%A8%E7%90%86%E8%AE%BA%E6%95%B0%E6%8D%AE%E8%A1%A8';

console.log(`Fetching Weapon Theory Table from ${TARGET_URL}...`);

try {
    const response = await fetch(TARGET_URL);
    const html = await response.text();
    const $doc = cheerio.load(html);

    // Strategy: Find the "S12-S13 赛季" header, and look for "数据总览（图片版）"
    // The markdown says: ## S12-S13 赛季 \n ... \n - 数据总览（图片版）
    // In HTML this is likely an <h2> followed by a <ul> or <p> links.
    // However, since it says "(图片版)", the link might point to a File page OR show the image directly.
    
    // Let's find all tabs or sections.
    const images = [];

    // Find the header for S12-S13
    const header = $doc('h2').filter((i, el) => $doc(el).text().includes('S12-S13 赛季'));
    
    if (header.length) {
        console.log('Found S12-S13 Header');
        // Look at the siblings until the next h2
        let next = header.next();
        let safety = 0;
        while (next.length && next[0].tagName !== 'h2' && safety < 20) {
            console.log(`Sibling tag: ${next[0].tagName}, Text substring: ${$doc(next).text().substring(0, 50).replace(/\n/g, '')}`);
            
            // Check for links text "图片版"
            const links = next.find('a');
            links.each((i, link) => {
                const text = $doc(link).text();
                const href = $doc(link).attr('href');
                console.log(`  - Link found: ${text} (${href})`);
                
                if (text.includes('图片版') || text.includes('数据总览') || text.includes('TTK') || (href && href.includes('%E6%96%87%E4%BB%B6'))) {
                     console.log(`    MATCH!`);
                     
                     let title = text.trim();
                     if (!title) {
                         // Fallback: extract from href or use sibling text
                         title = decodeURIComponent(href.split('/').pop() || 'image').replace(/_/g, ' ');
                     }
                     
                     images.push({
                         title: title,
                         pageUrl: href.startsWith('http') ? href : `https://wiki.biligame.com${href}`
                     });
                }
            });
            next = next.next();
            safety++;
        }
    } else {
        console.warn('Could not find S12-S13 header');
    }

    // If these are "File:" pages, we need to visit them to get the actual image URL.
    // Let's optimize: Visit each found page and grab the #file img src.
    
    const finalImages = [];
    
    for (const imgEntry of images) {
        console.log(`Resolving image for ${imgEntry.title}...`);
        try {
            const resp = await fetch(imgEntry.pageUrl);
            const subHtml = await resp.text();
            const $sub = cheerio.load(subHtml);
            
            // On a File page, the image is usually usually in <div class="fullMedia"> <a href="...">
            // or just #file > a
            
            const fileLink = $sub('.fullMedia a').attr('href') || $sub('#file a').attr('href');
            
            if (fileLink) {
                const absoluteUrl = fileLink.startsWith('http') ? fileLink : `https:${fileLink}`;
                console.log(`   -> Resolved: ${absoluteUrl}`);
                finalImages.push({
                    title: imgEntry.title,
                    sourceUrl: absoluteUrl,
                    localPath: `assets/raw_data/${imgEntry.title.replace(/\//g, '_')}.png`
                });
            }
        } catch (e) {
            console.error(`Failed to resolve ${imgEntry.pageUrl}`, e);
        }
    }

    // Save metadata
    fs.writeFileSync('./scripts/stats_images.json', JSON.stringify(finalImages, null, 2));
    console.log('Saved stats_images.json');
    
    // Download images
    for (const img of finalImages) {
        console.log(`Downloading ${img.title}...`);
        const resp = await fetch(img.sourceUrl);
        const buffer = await resp.arrayBuffer();
        
        // Ensure dir exists
        fs.mkdirSync('assets/raw_data', { recursive: true });
        
        fs.writeFileSync(img.localPath, Buffer.from(buffer));
        console.log(`   -> Saved to ${img.localPath}`);
    }

} catch (e) {
    console.error('Main error:', e);
}
