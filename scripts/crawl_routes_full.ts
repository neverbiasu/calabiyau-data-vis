
import { $ } from 'bun';
import * as cheerio from 'cheerio';
import fs from 'node:fs';

const BASE_URL = 'https://wiki.biligame.com';
const FACTION_URL = 'https://wiki.biligame.com/klbq/%E8%A7%92%E8%89%B2%E9%98%B5%E8%90%A5';

console.log(`Scanning Faction Page at ${FACTION_URL}...`);

const routes = {};
const allCharacters = [];

try {
    const response = await fetch(FACTION_URL);
    const html = await response.text();
    const $doc = cheerio.load(html);

    // The page structure has H2 for Faction, then H3 "阵营角色", then a list of links.
    // Let's find all headers with "阵营角色" text, then get the following links.
    
    // Note: The HTML structure from view_content_chunk showed headers.
    // We can look for siblings of h3:contains('阵营角色')
    
    $doc('h3').each((i, el) => {
        const text = $doc(el).text().trim();
        if (text === '阵营角色') {
            // The content is usually in the next sibling, possibly a <p> or <div> or <ul>
            let next = $doc(el).next();
            // Iterate until next header
            while (next.length && !next.is('h2') && !next.is('h3')) {
                const links = next.find('a');
                links.each((j, link) => {
                     const name = $doc(link).text().trim();
                     const href = $doc(link).attr('href');
                     if (name && href && !allCharacters.find(c => c.name === name)) {
                         allCharacters.push({
                             name,
                             url: href.startsWith('http') ? href : BASE_URL + href
                         });
                     }
                });
                next = next.next();
            }
        }
    });

    console.log(`Found ${allCharacters.length} unique characters.`);
    
    // Now scan each character for their weapon
    for (const char of allCharacters) {
        console.log(`Scanning ${char.name}...`);
        
        try {
            const resp = await fetch(char.url);
            const cHtml = await resp.text();
            const $c = cheerio.load(cHtml);
            
            let weaponName = '';
            let weaponUrl = '';
            
            // Find "角色武器" header
            // Try different selectors as wiki structure might vary
            const weaponHeader = $c('#角色武器').parent(); // usually H2 containing the span id
            
            if (weaponHeader.length) {
                let next = weaponHeader.next();
                let found = false;
                let safety = 0;
                while (next.length && !found && next[0].tagName !== 'h2' && safety < 10) {
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
                     safety++;
                }
            }

            if (weaponName) {
                console.log(`  -> Weapon: ${weaponName} (${weaponUrl})`);
                routes[char.name] = {
                    weaponName,
                    weaponUrl,
                    characterUrl: char.url
                };
            } else {
                console.warn(`  -> No weapon found for ${char.name}`);
                // Still add the character route even if weapon is missing
                routes[char.name] = {
                    characterUrl: char.url,
                    weaponName: null,
                    weaponUrl: null
                };
            }
            
            await new Promise(r => setTimeout(r, 200)); // Be nice
            
        } catch (e) {
            console.error(`Error scanning ${char.name}`, e);
        }
    }

} catch (e) {
    console.error('Main error:', e);
}

// Save routes
fs.writeFileSync('./scripts/routes.json', JSON.stringify(routes, null, 2));
console.log('Saved COMPLETE routes to scripts/routes.json');
