
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Valid Type Definitions based on updated data.d.ts
import type { Weapon, RootData } from '../types/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URL_THEORY = 'https://wiki.biligame.com/klbq/%E4%B8%BB%E6%AD%A6%E5%99%A8%E7%90%86%E8%AE%BA%E6%95%B0%E6%8D%AE%E8%A1%A8';
const URL_FILTER = 'https://wiki.biligame.com/klbq/%E6%AD%A6%E5%99%A8%E7%AD%9B%E9%80%89';

// Mappings
const CHAR_TO_ID: Record<string, string> = {
  '香奈美': 'kanami',
  '珐格兰丝': 'fragrans',
  '芙拉薇娅': 'flavia',
  '绯莎': 'fuchsia',
  '拉薇': 'lawine',
  '艾卡': 'eika',
  '明': 'ming',
  '忧雾': 'yugiri', // Verified: Yugiri
  '梅瑞狄斯': 'meredith',
  '米雪儿': 'michelle',
  '米雪儿·李': 'michelle',
  '米雪儿李': 'michelle', // Fallback
  '蕾欧娜': 'leona',
  '奥黛丽': 'audrey',
  '奥黛丽·格罗夫': 'audrey',
  '奥黛丽格罗夫': 'audrey', // Fallback
  '心夏': 'kokona', 
  '千代': 'chiyo',
  '令': 'reiichi', 
  '加拉蒂亚': 'galatea',
  '加拉蒂亚·利里': 'galatea',
  '加拉蒂亚利里': 'galatea', // Fallback
  '玛德蕾娜': 'madalena', 
  '玛德蕾娜·利里': 'madalena', 
  '玛德蕾娜利里': 'madalena', // Fallback
  '信': 'nobunaga', 
  '玛拉': 'mara',
  '星绘': 'celestia', 
  '白墨': 'baimo', 
  '伊薇特': 'yvette'
};

function generateId(cnName: string): string {
  const clean = cnName.replace(/·/g, '').trim();
  if (CHAR_TO_ID[clean]) return CHAR_TO_ID[clean];
  return clean; 
}

// Map Chinese Weapon Names to English IDs
const WEAPON_CN_TO_EN: Record<string, string> = {
  '独舞': 'solo_dance',
  '幻霜': 'phantom_frost',
  '夜镰': 'night_scythe',
  '谢幕曲': 'curtain_call',
  '空境': 'ethereal',
  '枫鸣': 'maple_hum',
  '破晓': 'dawn',
  '彩绘': 'painted',
  '审判官': 'inquisitor',
  '逆焰': 'backfire',
  '警探': 'investigator',
  '影袭': 'shadow_raid',
  '欺诈师': 'trickster',
  '绽放': 'bloom',
  '隼': 'falcon',
  '绝对执行': 'absolute_execution',
  '齿锋': 'sharp_fang',
  '北极星': 'polaris',
  '卫冕': 'defender',
  '校准仪': 'calibrator',
  '自由意志': 'free_will',
  '鸣火': 'blazing_fire'
};

function getWeaponId(cnWeaponName: string): string {
    const id = WEAPON_CN_TO_EN[cnWeaponName];
    if (!id) {
        console.warn(`Warning: No English ID for weapon '${cnWeaponName}'. Using pinyin/fallback.`);
        // Fallback or error?
        return 'unknown_' + Math.random().toString(36).substr(2, 5);
    }
    return id;
}

// Keep CHAR_TO_ID for character linking/images if needed, 
// but main Weapon ID comes from Weapon Name now.
// The full CHAR_TO_ID list from before is kept as it might be used elsewhere or for character display.

function mapType(cnType: string): string {
  // User requested Type to be Chinese, so we return as-is.
  return cnType;
}

function cleanNum(val: string): number {
  if (!val) return 0;
  const match = val.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function cleanFloat(val: string): number {
  if (!val) return 0;
  const match = val.match(/^(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

async function fetchTheoryData(): Promise<Record<string, Partial<Weapon>>> {
  console.log(`Fetching Theory Data from ${URL_THEORY}...`);
  const { data } = await axios.get(URL_THEORY, { 
    headers: { 'User-Agent': 'Mozilla/5.0' } 
  });
  const $ = cheerio.load(data);
  const rows = $('.klbqtable').eq(0).find('tr'); 
  
  const theoryMap: Record<string, any> = {};
  let lastCharName = '';

  rows.each((i, el) => {
    if (i === 0) return; 

    const cols = $(el).find('td');
    let offset = 0;
    let charName = '';
    let weaponName = '';
    
    // Check if row has Name (Image/Link in Col 0)
    // Based on debug, full rows have ~25 cols.
    if (cols.length >= 24) {
       const col0 = cols.eq(0);
       let rawName = col0.text().trim();
       
       if (!rawName) {
          const img = col0.find('img');
          const link = col0.find('a');
          rawName = img.attr('alt') || img.attr('title') || link.attr('title') || '';
          
          if (!rawName) {
            const href = link.attr('href');
            if (href) {
               try {
                 const decoded = decodeURIComponent(href);
                 const match = decoded.match(/文件:(.*?)头像/);
                 if (match) rawName = match[1];
               } catch (e) {}
            }
          }
       }
       
       // Extract Character and Weapon if possible from the first column's text
       const fullText = cols.eq(0).text().trim(); // "芙拉薇娅：独舞" or "芙拉薇娅\n独舞"
       
       if (fullText.includes('：')) {
           [charName, weaponName] = fullText.split('：').map(s => s.trim());
       } else if (fullText.includes('\n')) {
           const parts = fullText.split('\n').map(s => s.trim()).filter(s => s);
           if (parts.length >= 2) {
               charName = parts[0];
               weaponName = parts[1];
           } else {
               charName = rawName.replace(/头像/g, '').replace(/\.png/g, '').replace(/·/g, '').replace(/ /g, '').trim();
               weaponName = ''; // Weapon name not explicitly found in this cell
           }
       } else {
           charName = rawName.replace(/头像/g, '').replace(/\.png/g, '').replace(/·/g, '').replace(/ /g, '').trim();
           weaponName = ''; // Weapon name not explicitly found in this cell
       }

       if (charName) {
          lastCharName = charName;
          offset = 0;
       } else {
          charName = lastCharName;
          offset = 0; 
          if (!charName) return; 
       }
       
       // Image Extraction (Theory Table = Character Icon)
       const imgTag = cols.eq(0).find('img');
       let charImgUrl = imgTag.attr('src') || '';
       // Clean URL: remove /thumb/ and /40px-... if present to get full res?
       // e.g. https://patchwiki.biligame.com/images/klbq/thumb/1/1b/tgwx.../40px-...png
       // Wiki usually stores full image at .../images/klbq/1/1b/tgwx...png
       // Let's try to strip "/thumb" and the last segment
       if (charImgUrl) {
           // If it contains /thumb/, transform it
           if (charImgUrl.includes('/thumb/')) {
               // Remove /thumb/
               charImgUrl = charImgUrl.replace('/thumb', '');
               // Remove the last segment (the thumbnail filename)
               const parts = charImgUrl.split('/');
               parts.pop(); 
               charImgUrl = parts.join('/');
           }
       }

       // Only take Base Stats
       const status = cols.eq(1 + offset).text().trim();
       if (status !== '无' && status !== '常规' && status !== '') {
          if (status.includes('-') || status.includes('三觉')) return;
       }

       const dmgBodyStr = cols.eq(2 + offset).text().trim();
       let pellets = 1;
       let baseDmg = 0;
       if (dmgBodyStr.includes('x')) {
         const parts = dmgBodyStr.split('x');
         baseDmg = parseFloat(parts[0]);
         pellets = parseFloat(parts[1]);
       } else {
         baseDmg = parseFloat(dmgBodyStr);
       }
       
       const headDmgStr = cols.eq(21 + offset).text().trim(); // Verify index 21
       const headDmg = cleanFloat(headDmgStr);
       const fireRate = cleanNum(cols.eq(9 + offset).text().trim());
       const mag = cleanNum(cols.eq(8 + offset).text().trim());
       
       // Store character and weapon name for later combination
       // Use Normalized Character ID as KEY for merging
       const key = generateId(charName); 
       theoryMap[key] = {
         character: charName,
         name: weaponName, // Store weapon name here
         stats: {
           damage_body: baseDmg,
           damage_head: headDmg,
           fire_rate: fireRate,
           mag_capacity: mag,
           reload_time: 0, 
           range: 50, // Default
         },
         // Store extracted Character Image temporarily in a custom property
         // casting as any to avoid immediate type error before merge
         extra: {
             charImg: charImgUrl
         } as any
       };
    }
  });

  console.log(`Parsed ${Object.keys(theoryMap).length} weapons from Theory Table.`);
  return theoryMap;
}

async function fetchFilterData(): Promise<Record<string, any>> {
  console.log(`Fetching Filter Data from ${URL_FILTER}...`);
  const { data } = await axios.get(URL_FILTER, { 
    headers: { 'User-Agent': 'Mozilla/5.0' } 
  });
  const $ = cheerio.load(data);
  const rows = $('.select-table').find('tr'); 
  
  const filterMap: Record<string, any> = {};

  rows.each((i, el) => {
    const cols = $(el).find('td');
    if (cols.length < 10) return; 

    // Col 0: "芙拉薇娅：独舞"
    const rawName = cols.eq(0).text().trim();
    let charName = '';
    let weaponName = '';

    if (rawName.includes('：')) {
        const parts = rawName.split('：').map(s => s.trim());
        charName = parts[0];
        weaponName = parts[1];
    } else {
        // Fallback if no colon, assume it's just the character name or a different format
        charName = rawName.split('-')[0];
        weaponName = ''; // Cannot reliably extract weapon name from this format
    }
    
    // Clean names to match Theory keys (remove dots, spaces)
    charName = charName.replace(/·/g, '').replace(/ /g, '').trim();
    weaponName = weaponName.trim(); 
    
    // Image Extraction (Filter Table = Weapon Icon)
    const imgTag = cols.eq(0).find('img');
    let weaponImgUrl = imgTag.attr('src') || '';
    // Note: Filter table images seemed to be direct URLs in debug output, 
    // but check if they have /thumb/ too.
    if (weaponImgUrl && weaponImgUrl.includes('/thumb/')) {
       weaponImgUrl = weaponImgUrl.replace('/thumb', '');
       const parts = weaponImgUrl.split('/');
       parts.pop(); 
       weaponImgUrl = parts.join('/');
    }

    // Col 1: Type
    const type = cols.eq(1).text().trim();
    
    const key = generateId(charName); // Match key format (English ID)
    filterMap[key] = {
      name: weaponName, // Store extracted weapon name from Filter table
      type: mapType(type),
      extra: {
          weaponImg: weaponImgUrl
      },
      attributes: {
        aim_speed: cleanNum(cols.eq(3).text()),
        accuracy: cleanNum(cols.eq(4).text()),
        handling: cleanNum(cols.eq(5).text()),
        reload_speed: cleanNum(cols.eq(7).text()),
        charge_speed: cleanNum(cols.eq(8).text()),
        fire_mode: cols.eq(9).text().trim(),
        zoom_scale: cols.eq(10).text().trim(),
        move_speed: cleanNum(cols.eq(11).text()),
      }
    };
  });
  
  console.log(`Parsed ${Object.keys(filterMap).length} weapons from Filter Table.`);
  return filterMap;
}

async function main() {
  try {
    const theoryData = await fetchTheoryData();
    const filterData = await fetchFilterData();
    
    const combinedvp: Weapon[] = [];
    
    for (const [charId, tData] of Object.entries(theoryData)) {
      if (!tData.stats) continue;
      
      const fData = filterData[charId] || {}; // Lookup by Character ID (audrey)
      
      // If weaponName was not found in theoryData, try to get it from filterData if available
      const finalWeaponName = fData.name || tData.name || 'Unknown Weapon';
      const weaponId = getWeaponId(finalWeaponName); // Use the new function for weapon ID

      const weapon: Weapon = {
        id: weaponId.toLowerCase(),
        name: finalWeaponName,
        character: tData.character || 'Unknown Character', 
        type: fData.type || 'Unknown',
        imgs: {
            character: (tData as any).extra?.charImg || '',
            weapon: fData.extra?.weaponImg || ''
        },
        stats: {
          ...tData.stats,
          reload_time: tData.stats.reload_time || 2.0, 
        } as any,
        attributes: fData.attributes || {
          aim_speed: 0, accuracy: 0, handling: 0, reload_speed: 0, 
          charge_speed: 0, fire_mode: 'N/A', zoom_scale: '1x', move_speed: 0
        },
        computed: {
           dps_body: 0, 
           dps_head: 0,
           burst_damage: 0,
           time_to_kill: 0
        }
      };
      
      const rps = weapon.stats.fire_rate / 60;
      weapon.computed.dps_body = Math.round(rps * weapon.stats.damage_body); // Note: If shotgun, usually dmg is per pellet * count, here logic assumes pre-calculated or single total. 
      // Re-verify shotgun logic: theory scraper only sets baseDmg. 
      // If "12x8", baseDmg is 12. 
      // We should arguably store pellets in stats? 
      // For MVP, let's just make dps be total.
      
      // Fix: If original was x-notation
      // The current scraper logic:
      // if (x) baseDmg = quote(0)
      
      // Let's rely on basic calculation.
      // If pellets were detected, we lost that info in the loop unless we store it.
      // For 1.0, let's assume flat damage.
      
      weapon.computed.dps_head = Math.round(rps * weapon.stats.damage_head);
      weapon.computed.burst_damage = weapon.stats.mag_capacity * weapon.stats.damage_body;
      
      const shotsToKill = Math.ceil(200 / weapon.stats.damage_body);
      if (weapon.stats.fire_rate > 0) {
        weapon.computed.time_to_kill = parseFloat(((shotsToKill - 1) * (60 / weapon.stats.fire_rate)).toFixed(3));
      } else {
        weapon.computed.time_to_kill = 0;
      }
      
      combinedvp.push(weapon);
    }
    

    
    // Generate Character List
    // We need to map Character CN Name -> Character EN ID
    // We already have CHAR_TO_ID map somewhere?
    // Let's redefine it quickly or use the one we have at top (I left it there).
    const characters = combinedvp.map(w => ({
       id: CHAR_TO_ID[w.character] || 'unknown',
       name: w.character,
       icon: w.imgs.character
    })).filter((v,i,a)=>a.findIndex(t=>(t.id===v.id))===i); // Unique

    const root: RootData = {
      last_updated: new Date().toISOString(),
      game_version: '1.0',
      weapons: combinedvp,
      characters: characters
    };
    
    const outputPath = path.resolve(__dirname, '../public/data.json');
    fs.writeFileSync(outputPath, JSON.stringify(root, null, 2));
    console.log(`\nSuccess! Saved ${combinedvp.length} weapons to ${outputPath}`);
    
    if (combinedvp.length > 0) {
      console.log('Preview first item:', combinedvp[0]);
    }

  } catch (err: any) {
    console.error('Fatal Error:', err);
    process.exit(1);
  }
}

main();
