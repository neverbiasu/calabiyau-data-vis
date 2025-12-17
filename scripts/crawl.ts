
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import type { Weapon, RootData, Character, Ability } from '../types/data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URL_THEORY = 'https://wiki.biligame.com/klbq/%E4%B8%BB%E6%AD%A6%E5%99%A8%E7%90%86%E8%AE%BA%E6%95%B0%E6%8D%AE%E8%A1%A8';
const URL_FILTER = 'https://wiki.biligame.com/klbq/%E6%AD%A6%E5%99%A8%E7%AD%9B%E9%80%89';
// The new authority on Character metadata
const URL_CHAR_SELECTION = 'https://wiki.biligame.com/klbq/%E8%B6%85%E5%BC%A6%E4%BD%93%E7%AD%9B%E9%80%89';
const URL_WIKI_BASE = 'https://wiki.biligame.com/klbq/';

// --- Maps for Translation ---
const FACTION_MAP: Record<string, string> = {
    '剪刀手': 'The Scissors',
    '乌尔比诺': 'Urbino',
    '欧泊': 'Opal',
    '普普勒': 'P.U.S',
    '晶源体': 'Crystal' // Possible extra faction
};

const ROLE_MAP: Record<string, string> = {
    '先锋': 'Initiator',
    '决斗': 'Duelist',
    '控场': 'Controller',
    '支援': 'Sentinel',
    '守护': 'Guardian',
    '搜查': 'Duelist' 
};

// Fallback ID mapping for clean IDs
const ID_MAP: Record<string, string> = {
    '香奈美': 'kanami',
    '心夏': 'kokona',
    '明': 'ming',
    '伊薇特': 'yvette',
    '芙拉薇娅': 'flavia',
    '珐格兰丝': 'fragrans',
    '米雪儿': 'michelle',
    '梅瑞狄斯': 'meredith',
    '艾卡': 'eika',
    '加拉蒂亚': 'galatea',
    '星绘': 'celestia',
    '奥黛丽': 'audrey',
    '绯莎': 'fuchsia',
    '信': 'nobunaga',
    '拉薇': 'lawine',
    '令': 'reiichi',
    '千代': 'chiyo',
    '玛德蕾娜': 'madalena',
    '白墨': 'baimo',
    '玛拉': 'mara',
    '蕾欧娜': 'leona',
    '忧雾': 'yowu',
    '加拉蒂亚利里': 'galatea', // Fix for source data typo
    // Crystal / Bosses
    '爆裂魔怪': 'explosive_monster',
    '刺镰魔怪': 'sickle_monster',
    '冥荆皇女': 'dark_thorn_princess',
    '血荆皇女': 'blood_thorn_princess',
    '莉莉丝': 'lilith'
};

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
  '鸣火': 'blazing_fire',
  '积层风暴': 'layered_storm'
};

interface SelectionMeta {
    cnName: string;
    factionCN: string;
    roleCN: string;
    factionEN: string;
    roleEN: string;
    iconUrl: string;
}

function generateId(cnName: string): string {
  const clean = cnName.replace(/·/g, '').trim();
  for (const [key, val] of Object.entries(ID_MAP)) {
      if (clean.includes(key) || key.includes(clean)) return val;
  }
  return clean; 
}

function getWeaponId(cnWeaponName: string): string {
    const id = WEAPON_CN_TO_EN[cnWeaponName];
    if (!id) {
        return 'unknown_' + Math.random().toString(36).substr(2, 5);
    }
    return id;
}


// --- Helper Functions ---
function cleanNum(val: string | undefined | null): number {
  if (!val) return 0;
  const match = val.match(/^(\d+)/);
  return match && match[1] ? parseInt(match[1], 10) : 0;
}

function cleanFloat(val: string | undefined | null): number {
  if (!val) return 0;
  const match = val.match(/^(\d+(\.\d+)?)/);
  return match && match[1] ? parseFloat(match[1]) : 0;
}

// ...

// (Deleted orphan block)



async function fetchSelectionData(): Promise<Map<string, SelectionMeta>> {
    console.log(`Fetching Character Selection Data from ${URL_CHAR_SELECTION}...`);
    const { data } = await axios.get(URL_CHAR_SELECTION, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    
    const map = new Map<string, SelectionMeta>();
    
    // The table rows have class "divsort"
    $('tr.divsort').each((i, el) => {
        const factionCN = $(el).attr('data-param1') || 'Unknown';
        const roleCN = $(el).attr('data-param2') || 'Unknown';
        
        let cnName = $(el).find('.rolename a').text().trim();
        
        // Fix Galatea name
        if (cnName === '加拉蒂亚利里') cnName = '加拉蒂亚';

        if (!cnName) return;
        
        // Icon
        const img = $(el).find('.rolename img').attr('src');
        let iconUrl = '';
        if (img) {
            if (img.includes('/thumb/')) {
                iconUrl = img.replace('/thumb', '').split('/').slice(0, -1).join('/');
            } else {
                iconUrl = img;
            }
        }
        
        if (cnName) {
            map.set(cnName, {
                cnName,
                factionCN,
                roleCN,
                factionEN: FACTION_MAP[factionCN] || factionCN,
                roleEN: ROLE_MAP[roleCN] || roleCN,
                iconUrl
            });
        }
    });

    // Parse "Crystal" (晶源体) Faction - These are in navbox rows, not divsort
    $('td.navbox-group').each((i, el) => {
        const text = $(el).text().trim();
        if (text === '晶源体') {
             // Sibling td has the list
             const listTd = $(el).next('td.navbox-list');
             listTd.find('a').each((j, a) => {
                 const rawName = $(a).attr('title') || $(a).text().trim();
                 const cnName = rawName.replace(/·/g, '').trim();
                 
                 // Try to find icon? Usually these navboxes have small text links, maybe no icon in this specific view.
                 // But wait, the user showed: "爆裂魔怪头像.png" in their text.
                 // Let's assume for now we just get the name and standard URL. 
                 // We will rely on detail fetch for the icon if not found here.
                 
                 if (cnName) {
                     map.set(cnName, {
                        cnName,
                        factionCN: '晶源体',
                        roleCN: 'Boss',
                        factionEN: 'Crystal',
                        roleEN: 'Boss',
                        iconUrl: '' // Will fetch from detail
                     });
                 }
             });
        }
    });
    
    return map;
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
       if (!rawName) rawName = col0.find('img').attr('alt') || '';
       
       const fullText = cols.eq(0).text().trim();
       if (fullText.includes('：')) {
           [charName, weaponName] = fullText.split('：').map(s => s.trim()) as [string, string];
       } else {
           charName = rawName.replace(/头像/g, '').replace(/\.png/g, '').replace(/·/g, '').replace(/ /g, '').trim();
       }

       if (charName) { lastCharName = charName; offset = 0; } 
       else { charName = lastCharName; offset = 0; if (!charName) return; }
       
       const imgTag = cols.eq(0).find('img');
       let charImgUrl = imgTag.attr('src') || '';
       if (charImgUrl) {
           if (charImgUrl.includes('/thumb/')) {
               charImgUrl = charImgUrl.replace('/thumb', '').split('/').slice(0, -1).join('/');
           }
       }

       // Skip evolved/awakened rows
       const status = cols.eq(1 + offset).text().trim();
       if (status !== '无' && status !== '常规' && status !== '') {
          if (status.includes('-') || status.includes('三觉')) return;
       }

       const dmgBodyStr = cols.eq(2 + offset).text().trim();
       let baseDmg = parseFloat(dmgBodyStr.split('x')[0] || '0') || 0;
       
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
    let charName = rawName.includes('：') ? rawName.split('：')[0]?.trim() || '' : rawName.split('-')[0]?.trim() || '';
    let weaponName = rawName.includes('：') ? rawName.split('：')[1]?.trim() || '' : '';
    charName = charName.replace(/·/g, '').replace(/ /g, '').trim();
    
    const imgTag = cols.eq(0).find('img');
    let weaponImgUrl = imgTag.attr('src') || '';
    if (weaponImgUrl) {
       if (weaponImgUrl.includes('/thumb/')) {
          weaponImgUrl = weaponImgUrl.replace('/thumb', '').split('/').slice(0, -1).join('/');
       }
    }

    const key = generateId(charName);
    filterMap[key] = {
      characterCN: charName, // Added this field
      name: weaponName,
      type: cols.eq(1).text().trim(),
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

// --- Character Detail Fetcher (Only for Bio/Stats/Images) ---
// --- Character Detail Fetcher (Bio/Stats/Images/Abilities/Role) ---
const fetchCharacterDetails = async (charName: string) => {
    const url = `https://wiki.biligame.com/klbq/${encodeURIComponent(charName)}`;
    console.log(`Fetching Character Details for ${charName} from ${url}...`);
    
    try {
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(data);
        
        const details: Partial<Character> = {
            abilities: [],
            stats: { hp: 0, armor: 0, mobility: 0 },
            images: {},
            role: 'Unknown',
            bio: '',
        };

        // 1. Role Extraction
        // Strategy: Look for "定位" in any cell, check next cell
        $('td, th').each((i, el) => {
            const txt = $(el).text().trim();
            if (txt === '定位') {
                const sibling = $(el).next().text().trim();
                if (sibling) details.role = sibling;
            }
        });

        // Map Roles (CN -> EN)
        const roleMap: Record<string, string> = {
             '守护': 'Guardian',
             '决斗': 'Duelist',
             '控场': 'Controller',
             '支援': 'Support',
             '先锋': 'Initiator'
        };
        for (const [cn, en] of Object.entries(roleMap)) {
            if (details.role?.includes(cn)) details.role = en;
        }

        // Hardcoded Fallbacks for known issues
        const manualRoles: Record<string, string> = {
            '香奈美': 'Support', 
            '米雪儿': 'Guardian',
            '信': 'Guardian',
            '白墨': 'Duelist',
            '令': 'Duelist',
            '心夏': 'Support',
            '伊薇特': 'Initiator', // Bear summoner, often Initiator/Controller
        };
        if ((!details.role || details.role === 'Unknown') && manualRoles[charName]) {
            details.role = manualRoles[charName];
        }

        // 2. Bio Extraction
        // Try #角色简介 or #角色背景
        const bioHeader = $('#角色简介, #角色背景').parent();
        if (bioHeader.length) {
            let next = bioHeader.next();
            // Skip empty elements to find text
            let attempts = 0;
            while(next.length && attempts < 5) {
                 const txt = next.text().trim();
                 if (txt.length > 20) {
                     details.bio = txt;
                     break;
                 }
                 next = next.next();
                 attempts++;
            }
        }
        // Fallback Bio (First significant paragraph)
        if (!details.bio) {
            const descMatch = $('.mw-parser-output > p').filter((i, el) => {
                const txt = $(el).text().trim();
                return txt.length > 20 && !txt.includes('.playerBox') && !txt.includes('{');
            }).first();
            if (descMatch.length) details.bio = descMatch.text().trim();
        }
        if (details.bio) details.bio = details.bio.replace(/\[.*?\]/g, '').trim();

        // 3. Stats (Preserve)
        $('td').each((i, el) => {
             const text = $(el).text().trim();
             if (text === '生命值' || text === '生命') details.stats!.hp = cleanNum($(el).next().text().trim());
             if (text === '护甲') details.stats!.armor = cleanNum($(el).next().text().trim());
             if (text === '移速' || text === '移动速度') details.stats!.mobility = cleanNum($(el).next().text().trim());
        });

        // 4. Ability Extraction (Text-based searching)
        const getSkillContent = (key: string): { name: string, desc: string } | null => {
             let $header: any = null;
             // Search headers and table headers for the key
             $('h2, h3, h4, th, dt').each((i, el) => {
                 const txt = $(el).text().trim();
                 // Avoid "Group" headers or sidebar links
                 if (!$header && txt.includes(key) && !txt.includes('组') && !txt.includes('筛选')) { 
                     $header = $(el);
                 }
             });

             if (!$header) return null;
             
             const headerText = $header.text().trim();
             // e.g. "主动技能：Skill Name" or just "主动技能"
             let name = headerText;
             const parts = headerText.split(/：|:/);
             if (parts.length > 1) name = parts[1].trim();
             else name = name.replace(key, '').trim() || 'Ability';

             // Find Description
             let desc = '';
             
             // Determine "next" element based on element type
             let next = $header.next();
             if ($header.is('th')) {
                  // If it's a table header, look at next cell or row
                  next = $header.next('td');
                  if (!next.length) next = $header.parent().next('tr').find('td').first();
                  desc = next.text().trim();
             } else {
                 // If it's a standard header (h2/h3), look at siblings
                 // Handle cases where ID is inside the header (so $header is span or similar? No, strict selector used above)
                 // Just proceed to siblings.
                 let attempts = 0;
                 while(next.length && attempts < 5) {
                     const txt = next.text().trim();
                     // Heuristic: skip empty or purely technical lines
                     if (txt.length > 5 && !txt.startsWith('冷却') && !txt.includes('Tab')) { 
                         desc = txt;
                         // If it's a table (skills often in tables), extract relevant cell
                         if (next.is('table')) {
                             desc = next.find('td').last().text().trim(); // Last cell often contains desc
                         }
                         if (desc.length > 5) break; 
                     }
                     next = next.next();
                     attempts++;
                 }
             }
             
             return { 
                 name: name, 
                 desc: desc.replace(/\s+/g, ' ').substring(0, 400).trim()
             };
        };

        const active = getSkillContent('主动技能');
        if (active) details.abilities?.push({ name: active.name, type: 'Active', description: active.desc });
        
        const passive = getSkillContent('被动技能');
        if (passive) details.abilities?.push({ name: passive.name, type: 'Passive', description: passive.desc });

        const ult = getSkillContent('终极技能');
        if (ult) details.abilities?.push({ name: ult.name, type: 'Ultimate', description: ult.desc });


        // 5. Images (Preserve)
        const fashionImages = new Set<string>();
        if (charName === '莉莉丝') {
             $('img').each((i, el) => {
                  const src = $(el).attr('src') || '';
                  if (src.includes('.jpg') && src.includes('/images/klbq/')) fashionImages.add(src);
             });
        }
        $('img').each((i, el) => {
            const alt = $(el).attr('alt') || '';
            const src = $(el).attr('src') || '';
            if (alt.includes('立绘') && !src.includes('icon')) {
                 if (src) {
                      if (src.includes('/thumb/')) {
                          fashionImages.add(src.replace('/thumb', '').split('/').slice(0, -1).join('/'));
                      } else {
                          fashionImages.add(src);
                      }
                 }
            }
        });
        if (fashionImages.size > 0) details.images!.portrait = Array.from(fashionImages)[0];

        return details;

    } catch (e) {
    }
}


const MANUAL_IMAGES: Record<string, string> = {
    '米雪儿': 'https://patchwiki.biligame.com/images/klbq/b/b9/e9glc6xvnbs2zayhk0etd6hcx7xoa7f.png',
};

async function fetchWeaponDetails(weaponPageName: string): Promise<Partial<Weapon>> {
    const url = `https://wiki.biligame.com/klbq/${encodeURIComponent(weaponPageName)}`;
    console.log(`Fetching Weapon Details for ${weaponPageName} from ${url}...`);
    try {
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(data);
        const result: Partial<Weapon> = { 
            damage_falloff: {}, 
            body_part_multipliers: { head: 0, chest: 0, legs: 0 },
            stats: {} as any
        };

        // 1. Parse Basic Stats (Table with class 'klbqtable weapon-table')
        $('.klbqtable.weapon-table tr').each((i, el) => {
            const key = $(el).find('td').eq(0).text().trim();
            const val = $(el).find('td').eq(1).text().trim();
            if (key.includes('射速')) result.stats!.fire_rate = cleanNum(val);
            if (key.includes('弹匣')) result.stats!.mag_capacity = cleanNum(val);
        });

        // 2. Parse Damage Falloff (Table after '武器伤害')
        let damageTable: cheerio.Cheerio<any> | null = null;
        $('h1, h2, h3, h4').each((i, el) => {
            if ($(el).text().includes('武器伤害')) {
                let next = $(el).next();
                while(next.length && !next.is('table')) {
                    next = next.next();
                }
                if (next.is('table')) damageTable = next;
            }
        });

        if (damageTable) {
             const dists: string[] = [];
             // Headers are usually in the first row's TDs or THs, skipping the first one
             $(damageTable).find('tr').eq(0).children().each((i, el) => {
                 if (i > 0) dists.push($(el).text().trim());
             });
             
             $(damageTable).find('tr').each((i, row) => {
                 const part = $(row).children().eq(0).text().trim();
                 if (['头部', '上身', '下身'].includes(part)) {
                      $(row).children().each((j, cell) => {
                          if (j === 0) return; // Skip label
                          const val = cleanNum($(cell).text());
                          const dist = dists[j - 1]; 
                          if (dist) {
                              if (!result.damage_falloff![dist]) result.damage_falloff![dist] = { head: 0, body: 0, legs: 0 };
                              if (part === '头部') result.damage_falloff![dist].head = val;
                              if (part === '上身') result.damage_falloff![dist].body = val;
                              if (part === '下身') result.damage_falloff![dist].legs = val;
                          }
                      });
                 }
             });
        }

        // 3. Parse Multipliers (Table after '武器部位伤害系数')
        let multiTable: cheerio.Cheerio<any> | null = null;
        $('h1, h2, h3, h4').each((i, el) => {
            if ($(el).text().includes('武器部位伤害系数')) {
                let next = $(el).next();
                while(next.length && !next.is('table')) {
                    next = next.next();
                }
                if (next.is('table')) multiTable = next;
            }
        });

        if (multiTable) {
             let baseDmg = 0;
             // Iterate rows to handle TH/TD mixed structures correctly
             $(multiTable).find('tr').each((i, row) => {
                 $(row).children().each((j, cell) => {
                     const txt = $(cell).text().trim().replace('：', '');
                     const next = $(cell).next();
                     
                     if (next.length) {
                        const val = cleanFloat(next.text().trim());
                        
                        if (txt === '基础伤害') baseDmg = val;
                        if (txt === '头部') result.body_part_multipliers!.head = val;
                        if (['胸部', '上身'].includes(txt)) result.body_part_multipliers!.chest = val;
                        // Catch various leg descriptions
                        if (['下身', '腿部', '右小腿', '左小腿', '右大腿', '左大腿'].includes(txt)) {
                             if (!result.body_part_multipliers!.legs) result.body_part_multipliers!.legs = val;
                        }
                     }
                 });
             });

             if (result.stats) {
                 if (!result.stats.damage_body && baseDmg) result.stats.damage_body = baseDmg;
                 if (!result.stats.damage_head && baseDmg && result.body_part_multipliers!.head) {
                     result.stats.damage_head = Math.round(baseDmg * result.body_part_multipliers!.head);
                 }
             }
        }

        return result;
    } catch (e) { 
        console.warn(`Detail fetch warning for ${weaponPageName}:`, e);
        return {}; 
    }
}

async function main() {
  try {
    const selectionMap = await fetchSelectionData();
    const theoryData = await fetchTheoryData();
    const filterData = await fetchFilterData();
    
    const combinedvp: Weapon[] = [];
    const characters: Character[] = [];
    const processedChars = new Set<string>();

    // 1. Process Weapons & Link to Characters
    // Union of keys from both sources to ensure we capture all weapons
    const allCharIds = new Set([...Object.keys(theoryData), ...Object.keys(filterData)]);

    for (const charId of allCharIds) {
      const tData = theoryData[charId] || {};
      const fData = filterData[charId] || {};
      
      // If neither has meaningful data, skip
      if (!tData.name && !fData.name) continue;

      const finalWeaponName = fData.name || tData.name || 'Unknown Weapon';
      if (finalWeaponName === 'Unknown Weapon') continue;

      const weaponId = getWeaponId(finalWeaponName);
      const charCNOriginal = tData.character || (fData as any).characterCN || 'Unknown'; // This logic might need improvement if fData doesn't store char name directly

      // Need charCN to be correct. 
      // fData keys are generated IDs. We might need to recover CN name or store it in fData.
      // Let's update fetchFilterData to store charNameCN.
      
      // ... actually, let's fix fetchFilterData first to ensure it passes charName.
      // Assuming fData has it (I will add it in the next step or this one if I can).
      
      // Let's rely on the Selection Map for the canonical CN Name if we have the ID!
      // But ID_MAP matches CN -> ID.
      // We can search ID_MAP or use the name from data.
      
      let realCharCN = charCNOriginal;
      
      // Fix Names if it comes from dirty data
      if (realCharCN === '加拉蒂亚利里') realCharCN = '加拉蒂亚';
      if (realCharCN === '米雪儿李') realCharCN = '米雪儿';
      if (realCharCN === '玛德蕾娜利里') realCharCN = '玛德蕾娜';
      
      // Link to Selection Map Metadata
      let meta: SelectionMeta | undefined;
      // Try by CN Name
      if (selectionMap.has(realCharCN)) {
          meta = selectionMap.get(realCharCN);
      } else {
           // Fuzzy
           for (const [key, val] of selectionMap) {
               if (realCharCN.includes(key) || key.includes(realCharCN.replace(/·/g, ''))) {
                   meta = val;
                   break;
               }
           }
      }
      
      // Skip if still unknown char name (unlikely if we have an ID)
      if (realCharCN === 'Unknown') {
          // Try to recover from meta if by chance we have a match on ID? 
          // (Requires reverse ID lookup, maybe too complex for this block. Skip for now).
      }

      const weapon: Weapon = {
        id: weaponId.toLowerCase(),
        name: finalWeaponName,
        character: realCharCN, 
        type: fData.type || 'Unknown',
        imgs: {
            character: (tData as any).extra?.charImg || meta?.iconUrl || '',
            weapon: fData.extra?.weaponImg || ''
        },
        stats: { 
            damage_body: tData.stats?.damage_body || 0,
            damage_head: tData.stats?.damage_head || 0,
            fire_rate: tData.stats?.fire_rate || 0,
            mag_capacity: tData.stats?.mag_capacity || 0,
            reload_time: tData.stats?.reload_time || 2.0,
            range: 50 
        } as any,
        attributes: fData.attributes || {
          aim_speed: 0, accuracy: 0, handling: 0, reload_speed: 0, 
          charge_speed: 0, fire_mode: 'N/A', zoom_scale: '1x', move_speed: 0
        },
        computed: { dps_body: 0, dps_head: 0, burst_damage: 0, time_to_kill: 0 }
      };

      // --- Enhanced Detail Fetching ---
      if (finalWeaponName !== 'Unknown Weapon') {
          await new Promise(r => setTimeout(r, 100)); // Brief pause
          const detailStats = await fetchWeaponDetails(finalWeaponName);
          
          if (detailStats.damage_falloff) weapon.damage_falloff = detailStats.damage_falloff;
          if (detailStats.body_part_multipliers) weapon.body_part_multipliers = detailStats.body_part_multipliers;
          
          if (detailStats.stats) {
              // Prefer detail stats if available
              if (detailStats.stats.fire_rate) weapon.stats.fire_rate = detailStats.stats.fire_rate;
              if (detailStats.stats.mag_capacity) weapon.stats.mag_capacity = detailStats.stats.mag_capacity;
              
              // Only update damage if we found it in details (it might be missing there)
              if (detailStats.stats.damage_body) weapon.stats.damage_body = detailStats.stats.damage_body;
              if (detailStats.stats.damage_head) weapon.stats.damage_head = detailStats.stats.damage_head;
          }
      }
      
      const rps = weapon.stats.fire_rate / 60;
      weapon.computed.dps_body = Math.round(rps * weapon.stats.damage_body);
      weapon.computed.dps_head = Math.round(rps * weapon.stats.damage_head);
      weapon.computed.burst_damage = weapon.stats.mag_capacity * weapon.stats.damage_body;
      const shotsToKill = Math.ceil(200 / (weapon.stats.damage_body || 1)); // avoid div 0
      weapon.computed.time_to_kill = weapon.stats.fire_rate > 0 ? parseFloat(((shotsToKill - 1) * (60 / weapon.stats.fire_rate)).toFixed(3)) : 0;
      
      combinedvp.push(weapon);
      
      // Process Character if needed
      if (!processedChars.has(charId)) {
          processedChars.add(charId);
          
          const charBase: Character = {
              id: charId, 
              name: realCharCN, 
              icon: meta?.iconUrl || (tData as any).extra?.charImg || '',
              images: { portrait: '' },
              stats: { hp: 0, armor: 0, mobility: 0 },
              abilities: [],
              bio: '',
              role: meta?.roleEN || 'Unknown',
              faction: meta?.factionEN || 'Unknown' 
          };
          
          await new Promise(r => setTimeout(r, 200));
          const details = await fetchCharacterDetails(realCharCN);
          Object.assign(charBase, details); 
          
          if (meta) {
               charBase.role = meta.roleEN;
               charBase.faction = meta.factionEN;
               if (!charBase.icon && meta.iconUrl) charBase.icon = meta.iconUrl;
          }

          // Apply Manual Image Fallback
          if (MANUAL_IMAGES[realCharCN]) {
             if (!charBase.images) charBase.images = { portrait: '' };
             charBase.images.portrait = MANUAL_IMAGES[realCharCN];
          }

          if (!charBase.images?.portrait) charBase.images!.portrait = charBase.icon; 
          characters.push(charBase);
      }
    }
    
    // 2. Add Missing Characters found in Selection Map but not in Weapon Table
    for (const [cn, meta] of selectionMap) {
        const id = generateId(cn);
        if (!processedChars.has(id)) {
            console.log(`Adding missing/new character from Selection Map: ${cn} (${id})`);
            processedChars.add(id);
             const charBase: Character = {
                id: id,
                name: meta.cnName,
                icon: meta.iconUrl, 
                images: { portrait: '' },
                stats: { hp: 100, armor: 0, mobility: 0 },
                abilities: [],
                bio: '',
                role: meta.roleEN,
                faction: meta.factionEN
            };
            await new Promise(r => setTimeout(r, 200));
            const details = await fetchCharacterDetails(meta.cnName);
            Object.assign(charBase, details);
            
            // Re-affirm
            charBase.role = meta.roleEN;
            charBase.faction = meta.factionEN;

            if (!charBase.icon && charBase.images?.portrait) charBase.icon = charBase.images.portrait;
            characters.push(charBase);
        }
    }
    
    const root: RootData = {
      last_updated: new Date().toISOString(),
      game_version: '1.0',
      weapons: combinedvp,
      characters: characters
    };
    
    const outputPath = path.resolve(__dirname, '../public/data.json');
    fs.writeFileSync(outputPath, JSON.stringify(root, null, 2));
    console.log(`\nSuccess! Saved ${combinedvp.length} weapons and ${characters.length} characters to ${outputPath}`);
    
    // Validate some keys
    const galatea = characters.find(c => c.id === 'galatea');
    console.log('Galatea Verification:', galatea?.faction, galatea?.role);

  } catch (err: any) {
    console.error('Fatal Error:', err);
    process.exit(1);
  }
}

main();
