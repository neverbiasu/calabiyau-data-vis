
import fs from 'node:fs';

const DATA_PATH = './public/data.json';
const ROUTES_PATH = './scripts/routes.json';

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const routes = JSON.parse(fs.readFileSync(ROUTES_PATH, 'utf-8'));

console.log('Enriching data with routes...');

let matchCount = 0;

// Enrich Characters
const existingCharNames = new Set(data.characters.map(c => c.name));
Object.keys(routes).forEach(charName => {
    // 1. Update/Add Character
    if (!existingCharNames.has(charName)) {
        console.log(`Adding new character: ${charName}`);
        data.characters.push({
            id: generateId(charName),
            name: charName,
            icon: "", // Will need to scrape this later or get from route if we stored it
            wikiUrl: routes[charName].characterUrl
        });
    } else {
        // Enforce Wiki URL update
        const char = data.characters.find(c => c.name === charName);
        if (char) char.wikiUrl = routes[charName].characterUrl;
    }

    // 2. Update/Add Weapon
    const route = routes[charName];
    if (route && route.weaponName) {
        const existingWeapon = data.weapons.find(w => w.name === route.weaponName);
        if (!existingWeapon) {
            console.log(`Adding new weapon placeholder: ${route.weaponName} (${charName})`);
            data.weapons.push({
                id: generateId(route.weaponName),
                name: route.weaponName,
                character: charName,
                type: "Unknown", // Placeholder
                stats: {
                    damage_body: 0,
                    damage_head: 0,
                    fire_rate: 0,
                    mag_capacity: 0,
                    reload_time: 0,
                    range: 0
                },
                attributes: {},
                computed: {},
                wikiUrl: route.weaponUrl
            });
        } else {
            existingWeapon.wikiUrl = route.weaponUrl;
        }
    }
});

function generateId(zhName: string): string {
    // fast pinyin fallback or hash? 
    // For now simple reliable id, later we can add pinyin lib
    // Actually, let's keep it simple: 
    return 'id_' + Buffer.from(zhName).toString('hex').slice(0, 8);
}

// Save back
fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
console.log(`Enrichment complete. Updated ${DATA_PATH}`);
