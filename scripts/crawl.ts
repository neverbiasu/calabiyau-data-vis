
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Valid Type Definitions based on updated data.d.ts
import type { Weapon, RootData, Character, Ability } from '../types/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URL_THEORY = 'https://wiki.biligame.com/klbq/%E4%B8%BB%E6%AD%A6%E5%99%A8%E7%90%86%E8%AE%BA%E6%95%B0%E6%8D%AE%E8%A1%A8';
const URL_FILTER = 'https://wiki.biligame.com/klbq/%E6%AD%A6%E5%99%A8%E7%AD%9B%E9%80%89';
const URL_WIKI_BASE = 'https://wiki.biligame.com/klbq/';

// Mappings
const CHAR_TO_ID: Record<string, string> = {
  '香奈美': 'kanami',
  '珐格兰丝': 'fragrans',
  '芙拉薇娅': 'flavia',
  '绯莎': 'fuchsia',
  '拉薇': 'lawine',
  '艾卡': 'eika',
  '明': 'ming',
  '忧雾': 'yugiri',
  '梅瑞狄斯': 'meredith',
  '米雪儿': 'michelle',
  '米雪儿·李': 'michelle',
  '米雪儿李': 'michelle',
  '蕾欧娜': 'leona',
  '奥黛丽': 'audrey',
  '奥黛丽·格罗夫': 'audrey',
  '奥黛丽格罗夫': 'audrey',
  '心夏': 'kokona', 
  '千代': 'chiyo',
  '令': 'reiichi', 
  '加拉蒂亚': 'galatea',
  '加拉蒂亚·利里': 'galatea',
  '加拉蒂亚利里': 'galatea',
  '玛德蕾娜': 'madalena', 
  '玛德蕾娜·利里': 'madalena', 
  '玛德蕾娜利里': 'madalena',
  '信': 'nobunaga', 
  '玛拉': 'mara',
  '星绘': 'celestia', 
  '白墨': 'baimo', 
  '伊薇特': 'yvette'
};

const FACTION_MAP: Record<string, string> = {
    '剪刀手': 'The Scissors',
    '乌尔比诺': 'Urbino',
    '欧泊': 'Opal',
    '普普勒': 'P.U.S' // Assuming P.U.S maps to this if found
};

function generateId(cnName: string): string {
  const clean = cnName.replace(/·/g, '').trim();
  if (CHAR_TO_ID[clean]) return CHAR_TO_ID[clean];
  return clean; 
}

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
        return 'unknown_' + Math.random().toString(36).substr(2, 5);
    }
    return id;
}

function mapType(cnType: string): string {
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

// --- Theory Data Fetcher ---
async function fetchTheoryData(): Promise<Record<string, Partial<Weapon>>> {
  console.log(`Fetching Theory Data from ${URL_THEORY}...`);
  const { data } = await axios.get(URL_THEORY, { headers: { 'User-Agent': 'Mozilla/5.0' } });
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
    
    if (cols.length >= 24) {
       const col0 = cols.eq(0);
       let rawName = col0.text().trim();
       if (!rawName) {
          const img = col0.find('img');
          const link = col0.find('a');
          rawName = img.attr('alt') || img.attr('title') || link.attr('title') || '';
          if (!rawName) {
            const href = link.attr('href');
            if (href) { // Decode URL for backup
                 try {
                   const decoded = decodeURIComponent(href);
                   const match = decoded.match(/文件:(.*?)头像/);
                   if (match) rawName = match[1];
                 } catch (e) {}
            }
          }
       }
       
       const fullText = cols.eq(0).text().trim();
       if (fullText.includes('：')) {
           [charName, weaponName] = fullText.split('：').map(s => s.trim());
       } else if (fullText.includes('\n')) {
           const parts = fullText.split('\n').map(s => s.trim()).filter(s => s);
           if (parts.length >= 2) {
               charName = parts[0];
               weaponName = parts[1];
           } else {
               charName = rawName.replace(/头像/g, '').replace(/\.png/g, '').replace(/·/g, '').replace(/ /g, '').trim();
           }
       } else {
           charName = rawName.replace(/头像/g, '').replace(/\.png/g, '').replace(/·/g, '').replace(/ /g, '').trim();
       }

       if (charName) { lastCharName = charName; offset = 0; } 
       else { charName = lastCharName; offset = 0; if (!charName) return; }
       
       // Image
       const imgTag = cols.eq(0).find('img');
       let charImgUrl = imgTag.attr('src') || '';
       if (charImgUrl && charImgUrl.includes('/thumb/')) {
           charImgUrl = charImgUrl.replace('/thumb', '');
           const parts = charImgUrl.split('/');
           parts.pop(); 
           charImgUrl = parts.join('/');
       }

       // Skip evolved/awakened rows
       const status = cols.eq(1 + offset).text().trim();
       if (status !== '无' && status !== '常规' && status !== '') {
          if (status.includes('-') || status.includes('三觉')) return;
       }

       const dmgBodyStr = cols.eq(2 + offset).text().trim();
       let baseDmg = parseFloat(dmgBodyStr.split('x')[0]) || 0;
       
       const headDmgStr = cols.eq(21 + offset).text().trim(); 
       const headDmg = cleanFloat(headDmgStr);
       const fireRate = cleanNum(cols.eq(9 + offset).text().trim());
       const mag = cleanNum(cols.eq(8 + offset).text().trim());
       
       const key = generateId(charName); 
       theoryMap[key] = {
         character: charName,
         name: weaponName,
         stats: {
           damage_body: baseDmg,
           damage_head: headDmg,
           fire_rate: fireRate,
           mag_capacity: mag,
           reload_time: 0, 
           range: 50, 
         },
         extra: { charImg: charImgUrl } as any
       };
    }
  });
  return theoryMap;
}

// --- Filter Data Fetcher ---
async function fetchFilterData(): Promise<Record<string, any>> {
  console.log(`Fetching Filter Data from ${URL_FILTER}...`);
  const { data } = await axios.get(URL_FILTER, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(data);
  const rows = $('.select-table').find('tr'); 
  const filterMap: Record<string, any> = {};

  rows.each((i, el) => {
    const cols = $(el).find('td');
    if (cols.length < 10) return; 

    const rawName = cols.eq(0).text().trim();
    let charName = rawName.includes('：') ? rawName.split('：')[0].trim() : rawName.split('-')[0].trim();
    let weaponName = rawName.includes('：') ? rawName.split('：')[1].trim() : '';
    charName = charName.replace(/·/g, '').replace(/ /g, '').trim();
    
    const imgTag = cols.eq(0).find('img');
    let weaponImgUrl = imgTag.attr('src') || '';
    if (weaponImgUrl && weaponImgUrl.includes('/thumb/')) {
       weaponImgUrl = weaponImgUrl.replace('/thumb', '');
       const parts = weaponImgUrl.split('/');
       parts.pop(); 
       weaponImgUrl = parts.join('/');
    }

    const key = generateId(charName);
    filterMap[key] = {
      name: weaponName,
      type: mapType(cols.eq(1).text().trim()),
      extra: { weaponImg: weaponImgUrl },
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
  return filterMap;
}

// --- Character Detail Fetcher ---
async function fetchCharacterDetails(charNameCN: string): Promise<Partial<Character>> {
    const url = URL_WIKI_BASE + encodeURIComponent(charNameCN);
    console.log(`Fetching Character Details for ${charNameCN} from ${url}...`);
    
    try {
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(data);
        
        const details: Partial<Character> = {
            abilities: [],
            stats: { hp: 0, armor: 0, mobility: 0 },
            images: {}
        };

        // 1. Faction & Role (Search in infobox or content)
        // Bilibili Wiki InfoBox
        $('.box-poke tr').each((i, el) => {
            const label = $(el).find('th').text().trim();
            const value = $(el).find('td').text().trim();
            
            if (label.includes('阵营')) {
                // Map CN faction to EN
                for (const [cn, en] of Object.entries(FACTION_MAP)) {
                    if (value.includes(cn)) details.faction = en;
                }
                if (!details.faction) details.faction = value;
            }
            if (label.includes('定位') || label.includes('职业')) {
                // Determine Role: Duelist, Sentinel, etc.
                // Map manually if possible
                if (value.includes('决斗')) details.role = 'Duelist';
                else if (value.includes('先锋')) details.role = 'Initiator';
                else if (value.includes('控场')) details.role = 'Controller';
                else if (value.includes('支援')) details.role = 'Sentinel';
                else details.role = value; // Fallback
            }
        });
        
        // 2. Intro / Bio
        // Usually the first paragraph after top headers, or in a specific quote box.
        // Let's try to grab the first substantial paragraph.
        const bioText = $('.mw-parser-output > p').first().text().trim();
        details.bio = bioText;

        // 3. Stats (HP, Armor)
        // Usually in a table or infobox. Need to search text for "生命值"/"护甲"
        // Sometimes represented as "生命值：200" in a table cell.
        $('td').each((i, el) => {
             const text = $(el).text().trim();
             if (text === '生命值' || text === '生命') {
                 const val = $(el).next().text().trim();
                 details.stats!.hp = cleanNum(val);
             }
             if (text === '护甲') {
                 const val = $(el).next().text().trim();
                 details.stats!.armor = cleanNum(val);
             }
             if (text === '移速' || text === '移动速度') {
                 const val = $(el).next().text().trim();
                 details.stats!.mobility = cleanNum(val);
             }
        });
        
        // If stats missing, use defaults
        if (details.stats!.hp === 0) details.stats!.hp = 100;

        // 4. Skills
        // Headers often are: 角色技能, then subtitles for each skill.
        // Let's look for "技能" section
        let skillSection = $('#角色技能').parent().nextUntil('h2');
        // This iterate logic depends on wiki structure.
        // A safer bet: Find elements with class related to skills, or headers.
        // B Wiki often uses tabs or tables for skills.
        
        // Simplified approach: scan for H3/H4 headers inside the skill area.
        // Or look for specific known skill boxes.
        
        // Mock fallback for now if scraping complex skill DOM starts failing
        // But let's try to find at least names.
        // $('.skill-box')?
        
        // 5. Images (Full Body)
        // Search for "角色时装" section
        // Images are often inside tabs.
        // We want the 'src' of the main image.
        const fashionImages = new Set<string>();
        $('img').each((i, el) => {
            const alt = $(el).attr('alt') || '';
            const src = $(el).attr('src') || '';
            if ((alt.includes('立绘') || alt.includes('模型')) && !src.includes('icon') && !src.includes('logo')) {
                 if (src && !src.includes('/thumb/')) fashionImages.add(src);
                 else if (src) {
                      const full = src.replace('/thumb', '').split('/').slice(0, -1).join('/');
                      fashionImages.add(full);
                 }
            }
        });
        
        // Pick the first likely high-res image as portrait
        if (fashionImages.size > 0) {
            details.images!.portrait = Array.from(fashionImages)[0];
        }

        return details;

    } catch (e) {
        console.warn(`Failed to fetch details for ${charNameCN}:`, e);
        return {};
    }
}


async function main() {
  try {
    const theoryData = await fetchTheoryData();
    const filterData = await fetchFilterData();
    
    const combinedvp: Weapon[] = [];
    const characters: Character[] = [];
    const processedChars = new Set<string>();

    for (const [charId, tData] of Object.entries(theoryData)) {
      if (!tData.stats) continue;
      
      const fData = filterData[charId] || {}; 
      const finalWeaponName = fData.name || tData.name || 'Unknown Weapon';
      const weaponId = getWeaponId(finalWeaponName);
      const charCN = tData.character || 'Unknown';

      const weapon: Weapon = {
        id: weaponId.toLowerCase(),
        name: finalWeaponName,
        character: charCN, 
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
        computed: { dps_body: 0, dps_head: 0, burst_damage: 0, time_to_kill: 0 }
      };
      
      const rps = weapon.stats.fire_rate / 60;
      weapon.computed.dps_body = Math.round(rps * weapon.stats.damage_body);
      weapon.computed.dps_head = Math.round(rps * weapon.stats.damage_head);
      weapon.computed.burst_damage = weapon.stats.mag_capacity * weapon.stats.damage_body;
      const shotsToKill = Math.ceil(200 / weapon.stats.damage_body);
      weapon.computed.time_to_kill = weapon.stats.fire_rate > 0 ? parseFloat(((shotsToKill - 1) * (60 / weapon.stats.fire_rate)).toFixed(3)) : 0;
      
      combinedvp.push(weapon);
      
      // Process Character if not done
      if (!processedChars.has(charId)) {
          processedChars.add(charId);
          
          // Initial basic data
          const charBase: Character = {
              id: charId, // e.g. 'kanami'
              name: charCN, // e.g. '香奈美'
              icon: (tData as any).extra?.charImg || '',
              images: { portrait: '' },
              stats: { hp: 0, armor: 0, mobility: 0 },
              abilities: [],
              bio: '',
              role: 'Unknown',
              faction: 'Unknown'
          };
          
          // Fetch Detailed Info
          // Add delay to be nice
          await new Promise(r => setTimeout(r, 500));
          const details = await fetchCharacterDetails(charCN);
          
          // Merge
          Object.assign(charBase, details);
          
          // Defaults if failed
          if (!charBase.images?.portrait) charBase.images!.portrait = charBase.icon; // Fallback
          
          characters.push(charBase);
      }
    }
    
    // Create Root
    const root: RootData = {
      last_updated: new Date().toISOString(),
      game_version: '1.0',
      weapons: combinedvp,
      characters: characters
    };
    
    const outputPath = path.resolve(__dirname, '../public/data.json');
    fs.writeFileSync(outputPath, JSON.stringify(root, null, 2));
    console.log(`\nSuccess! Saved ${combinedvp.length} weapons and ${characters.length} characters to ${outputPath}`);

  } catch (err: any) {
    console.error('Fatal Error:', err);
    process.exit(1);
  }
}

main();
