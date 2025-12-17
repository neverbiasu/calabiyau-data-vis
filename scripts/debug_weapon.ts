
import axios from 'axios';
import * as cheerio from 'cheerio';

async function main() {
    const url = 'https://wiki.biligame.com/klbq/%E5%AE%A1%E5%88%A4%E5%AE%98'; // 审判官
    console.log('Fetching', url);
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    
    // Find Multiplier Table
    let multiTable: any = null;
    $('h1, h2, h3, h4').each((i, el) => {
        if ($(el).text().includes('武器部位伤害系数')) {
            console.log('Found Header:', $(el).text());
            let next = $(el).next();
            while(next.length && !next.is('table')) {
                next = next.next();
            }
            if (next.is('table')) multiTable = next;
        }
    });

    if (multiTable) {
        console.log('Found Table.');
        $(multiTable).find('td').each((i, el) => {
            const txt = $(el).text().trim().replace('：', '');
            const nextEl = $(el).next('td');
            const valTxt = nextEl.text().trim();
            console.log(`Cell ${i}: Key="${txt}", NextVal="${valTxt}"`);
        });
    } else {
        console.log('Table NOT found.');
        // Dump headers found
        $('h1, h2, h3, h4').each((i, el) => console.log('Header:', $(el).text()));
    }
}

main();
