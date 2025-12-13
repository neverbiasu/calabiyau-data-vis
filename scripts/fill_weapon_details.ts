
import { $ } from 'bun';
import * as cheerio from 'cheerio';
import fs from 'node:fs';

const BASE_URL = 'https://wiki.biligame.com';

const data = JSON.parse(fs.readFileSync('./public/data.json', 'utf-8'));

console.log('Filling missing weapon details...');

// Limit to only weapons with type "Unknown" (those we just added)
// OR iterate all to update recent values. Let's iterate all to be safe, but focus on filling.
const jobs = data.weapons; ///.filter(w => w.type === 'Unknown' || w.stats.damage_body === 0);

console.log(`Found ${jobs.length} weapons to verify/fill.`);

for (const weapon of jobs) {
    if (!weapon.wikiUrl) {
         console.warn(`Skipping ${weapon.name} (No Wiki URL)`);
         continue;
    }
    
    console.log(`Scraping weapon: ${weapon.name} at ${weapon.wikiUrl}...`);
    
    try {
        const resp = await fetch(weapon.wikiUrl);
        const html = await resp.text();
        const $doc = cheerio.load(html);
        
        // 1. Image
        // Usually in an infobox or first image
        // Try the one that looks like a weapon image (usually large, in a table)
        // Or specific selector: .wikitable img
        const img = $doc('.wikitable img').first().attr('src') || $doc('.resp-tabs-container img').first().attr('src');
        if (img && (!weapon.imgs || !weapon.imgs.weapon)) {
             if (!weapon.imgs) weapon.imgs = { character: '', weapon: '' };
             weapon.imgs.weapon = img.startsWith('http') ? img : img; 
        }

        // 2. Stats
        // Look for the "基本规格" table. It usually contains:
        // 伤害(身体/头部), 射速, 弹匣容量, 换弹时间, 射程
        // Values in the wiki might be formatted strings "25/37", "695", "30", "2.0s", "50m"
        
        // Let's find table cells th that contain specific keywords, then get the next td
        const statsMap = {
            '伤害': 'damage',
            '射速': 'fire_rate',
            '弹匣': 'mag_capacity',
            '换弹': 'reload_time',
            '射程': 'range',
            '类型': 'type' // Sometimes type is here
        };
        
        $doc('th').each((i, th) => {
            const label = $doc(th).text().trim();
            const value = $doc(th).next('td').text().trim();
            
            if (value) {
                if (label.includes('伤害')) {
                     // "25/37" -> body/head
                     const parts = value.split('/');
                     if (parts.length >= 2) {
                         weapon.stats.damage_body = parseInt(parts[0]);
                         weapon.stats.damage_head = parseInt(parts[1]);
                     } else {
                         weapon.stats.damage_body = parseInt(value);
                     }
                }
                else if (label.includes('射速')) {
                     weapon.stats.fire_rate = parseInt(value); // "695"
                }
                else if (label.includes('弹匣')) {
                     weapon.stats.mag_capacity = parseInt(value); // "30"
                }
                else if (label.includes('换弹')) {
                     weapon.stats.reload_time = parseFloat(value); // "2s" -> 2
                }
                else if (label.includes('射程')) {
                     weapon.stats.range = parseInt(value); // "50"
                }
                else if (label.includes('类型|武器类型')) {
                     // weapon.type = value; // Might need mapping
                }
            }
        });
        
        // Try to get Type from OG description or category if still Unknown
        if (weapon.type === 'Unknown') {
             // Basic heuristic: check page categories or description
             const desc = $doc('meta[name="description"]').attr('content') || '';
             if (desc.includes('突击步枪') || desc.includes('自动步枪')) weapon.type = '自动步枪';
             else if (desc.includes('冲锋枪')) weapon.type = '冲锋枪';
             else if (desc.includes('狙击')) weapon.type = '狙击枪';
             else if (desc.includes('霰弹') || desc.includes('喷子')) weapon.type = '霰弹枪';
             else if (desc.includes('机枪')) weapon.type = '轻机枪';
             else if (desc.includes('手枪')) weapon.type = '手枪';
        }

        console.log(`   -> Updated. Type: ${weapon.type}, Dmg: ${weapon.stats.damage_body}`);
        
        await new Promise(r => setTimeout(r, 200));

    } catch (e) {
        console.error(`Error scraping ${weapon.name}`, e);
    }
}

// Write back
fs.writeFileSync('./public/data.json', JSON.stringify(data, null, 2));
console.log('Done filling weapon details.');
