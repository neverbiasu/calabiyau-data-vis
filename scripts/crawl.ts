
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
           [charName, weaponName] = fullText.split('：').map(s => s.trim());
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
const fetchCharacterDetails = async (charName: string) => {
    // Generate URL based on English ID to map back to CN URL?
    // Actually, we pass the CN Name directly to this function.
    const url = `https://wiki.biligame.com/klbq/${encodeURIComponent(charName)}`;
    console.log(`Fetching Character Details for ${charName} from ${url}...`);
    
    try {
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(data);
        
        const details: Partial<Character> = {
            abilities: [],
            stats: { hp: 0, armor: 0, mobility: 0 },
            images: {},
        };

        // Bio extraction
        const descMatch = $('.mw-parser-output > p').filter((i, el) => {
            const txt = $(el).text().trim();
            return txt.length > 20 && !txt.includes('.playerBox') && !txt.includes('{');
        }).first();
        if (descMatch.length) {
            details.bio = descMatch.text().trim();
        }

        // Stats (Dynamic)
        $('td').each((i, el) => {
             const text = $(el).text().trim();
             if (text === '生命值' || text === '生命') {
                 details.stats!.hp = cleanNum($(el).next().text().trim());
             }
             if (text === '护甲') {
                 details.stats!.armor = cleanNum($(el).next().text().trim());
             }
             if (text === '移速' || text === '移动速度') {
                 details.stats!.mobility = cleanNum($(el).next().text().trim());
             }
        });
        
        // Full Body Image
        const fashionImages = new Set<string>();
        
        // Special handling for Lilith (Boss) which might use different image structure / file types
        if (charName === '莉莉丝') {
             $('img').each((i, el) => {
                  const src = $(el).attr('src') || '';
                  // Lilith debug showed .jpg images that look like splash art
                  if (src.includes('.jpg') && src.includes('/images/klbq/')) {
                      fashionImages.add(src);
                  }
             });
        }



        $('img').each((i, el) => {
            const alt = $(el).attr('alt') || '';
            const src = $(el).attr('src') || '';
            
            // Strict filter: ONLY accept "Stand" / "Portrait" (立绘) images
            // Explicitly ignore "Model" (模型) to satisfy user preference
            if (alt.includes('立绘') && !src.includes('icon')) {
                 if (src) {
                      if (src.includes('/thumb/')) {
                          const full = src.replace('/thumb', '').split('/').slice(0, -1).join('/');
                          fashionImages.add(full);
                      } else {
                          fashionImages.add(src);
                      }
                 }
            }
        });
        if (fashionImages.size > 0) details.images!.portrait = Array.from(fashionImages)[0];
        
        // Default Stats
        if (!details.stats!.hp) details.stats!.hp = 100;

        return details;

    } catch (e) {
        console.warn(`Failed to fetch details for ${charName}:`, e);
        return {
            stats: { hp: 100, armor: 0, mobility: 0 },
            bio: 'Data unavailable.'
        };
    }
}


const MANUAL_IMAGES: Record<string, string> = {
    '米雪儿': 'https://patchwiki.biligame.com/images/klbq/b/b9/e9glc6xvnbs2zayhk0etd6hcx7xoa7f.png',
};

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
