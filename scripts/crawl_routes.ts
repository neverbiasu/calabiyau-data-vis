
import { $ } from 'bun';
import * as cheerio from 'cheerio';
import fs from 'node:fs';

const BASE_URL = 'https://wiki.biligame.com';
const WIKI_ROOT = 'https://wiki.biligame.com/klbq';

// Load existing data to get character list
const existingData = JSON.parse(fs.readFileSync('./public/data.json', 'utf-8'));
const characters = existingData.characters;

const routes = {};

console.log(`Found ${characters.length} characters to scan...`);


for (const char of characters) {
    let charName = char.name; // Chinese name
    
    // Fix known name mismatches
    if (charName === '米雪儿李') charName = '米雪儿';

    const charUrl = `${WIKI_ROOT}/${encodeURIComponent(charName)}`;
    
    console.log(`Scanning ${charName} at ${charUrl}...`);
    
    try {
        const response = await fetch(charUrl);
        const html = await response.text();
        const $doc = cheerio.load(html);
        
        // Strategy: Look for the "角色武器" header and the following link
        // The structure from view_content_chunk was: ## 角色武器 \n - desc... \n [WeaponName](Link)
        
        // In HTML, it's likely an h2 with id="角色武器", followed by a div or p or ul
        // Let's look for a link that is NOT empty and usually is the first link after the header
        
        let weaponName = '';
        let weaponUrl = '';
        
        // Find the "角色武器" header
        const header = $doc('#角色武器').parent(); // h2
        
        // Iterate next siblings until we find a link or another header
        let next = header.next();
        let found = false;
        
        while (next.length && !found && next[0].tagName !== 'h2') {
             const link = next.find('a').first();
             if (link.length) {
                 weaponName = link.text().trim();
                 weaponUrl = link.attr('href');
                 if (weaponUrl && !weaponUrl.startsWith('http')) {
                     weaponUrl = BASE_URL + weaponUrl;
                 }
                 found = true;
             }
             next = next.next();
        }

        if (found) {
            console.log(`✅ ${charName} -> ${weaponName} (${weaponUrl})`);
            routes[charName] = {
                weaponName,
                weaponUrl,
                characterUrl: charUrl
            };
        } else {
            console.warn(`⚠️ Could not find weapon link for ${charName}`);
        }
        
        // Be nice to the server
        await new Promise(r => setTimeout(r, 500));

    } catch (e) {
        console.error(`❌ Error scanning ${charName}:`, e);
    }
}

// Save to routes.json
fs.writeFileSync('./scripts/routes.json', JSON.stringify(routes, null, 2));
console.log('Done! Saved routes to scripts/routes.json');
