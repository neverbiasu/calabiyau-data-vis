
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.resolve(__dirname, '../docs/WIKI_DATA_CATALOG.md');

const BASE_URL = 'https://wiki.biligame.com';
const WIKI_HOME = '/klbq/';

// Categories to explore
// We mix "Category" pages and "List" pages because the wiki is inconsistent
const CATEGORIES = [
    { 
        name: 'Characters', 
        url: '/klbq/超弦体筛选', 
        type: 'list', 
        selector: '.divsort .rolename a', // Specific to the screening table
        sampleLimit: 3 
    },
    { 
        name: 'Weapons', 
        url: '/klbq/武器筛选', 
        type: 'list', 
        selector: '.select-table tr td:first-child a', // Specific to weapon table
        sampleLimit: 3 
    },
    { 
        name: 'Maps', 
        url: '/klbq/分类:地图', 
        type: 'category', 
        sampleLimit: 2 
    },
    { 
        name: 'Game Modes', 
        url: '/klbq/分类:玩法', 
        type: 'category', 
        sampleLimit: 2 
    }
];

interface DataField {
    name: string;
    example: string;
    description?: string;
}

interface CategorySummary {
    name: string;
    count: number;
    pages: string[];
    availableFields: DataField[];
}

async function fetchPage(url: string) {
    try {
        const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
        const { data } = await axios.get(fullUrl, { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36' } 
        });
        return cheerio.load(data);
    } catch (e: any) {
        console.warn(`Failed to fetch ${url}: ${e.message}`);
        return null;
    }
}

async function catalogCategory(cat: { name: string, url: string, type: string, selector?: string, sampleLimit: number }): Promise<CategorySummary> {
    console.log(`Cataloging ${cat.name} (${cat.type})...`);
    const $ = await fetchPage(cat.url);
    if (!$) return { name: cat.name, count: 0, pages: [], availableFields: [] };

    const links = new Set<string>();

    if (cat.type === 'category') {
        // MediaWiki Category Page selector
        $('#mw-pages .mw-category-group a').each((i, el) => {
            const href = $(el).attr('href');
            if (href) links.add(href);
        });
    } else if (cat.type === 'list' && cat.selector) {
        // Custom List Page selector
        $(cat.selector).each((i, el) => {
            const href = $(el).attr('href');
            if (href && !href.includes('action=edit') && 
                !href.includes('文件:') && !href.includes('File:') && 
                !href.includes('%E6%96%87%E4%BB%B6:') // URL encoded '文件:'
            ) {
                links.add(href);
            }
        });
    }

    const uniqueLinks = Array.from(links);
    console.log(`Found ${uniqueLinks.length} pages in ${cat.name}.`);

    // Sample a few pages to detect fields
    const fields: DataField[] = [];
    const knownFields = new Set<string>();

    const samples = uniqueLinks.slice(0, cat.sampleLimit);
    for (const link of samples) {
        console.log(`  Inspecting sample: ${link}`);
        const $page = await fetchPage(link);
        if (!$page) continue;

        // 1. Detect Tables (wikitable)
        $page('table.wikitable').each((i, tbl) => {
            // Try to find headers
            $page(tbl).find('th').each((j, th) => {
                const header = $page(th).text().trim();
                if (header && !knownFields.has(header)) {
                    knownFields.add(header);
                    // Try to find an example value in the first row
                    const example = $page(tbl).find('tr').eq(1).find('td').eq(j).text().trim().substring(0, 50);
                    fields.push({
                         name: `Table: ${header}`,
                         example: example || '(Empty)'
                    });
                }
            });
        });

        // 2. Detect InfoBox (usually .infobox or .kldata-infobox)
        // Also check generic tables that look like infoboxes (th followed by td)
        $page('.kldata-infobox tr, table.infobox tr').each((i, tr) => {
            const label = $page(tr).find('th').text().trim();
            const value = $page(tr).find('td').text().trim();
            if (label && value && !knownFields.has(label)) {
                knownFields.add(label);
                fields.push({
                    name: `Infobox: ${label}`,
                    example: value.substring(0, 50)
                });
            }
        });
        
        // 3. Detect Headers (Sections)
        $page('h2, h3').each((i, h) => {
            const title = $page(h).find('.mw-headline').text().trim();
            if (title && !knownFields.has(`Section: ${title}`)) {
                 knownFields.add(`Section: ${title}`);
                 
                 // Extract content snippet from following elements
                 let content = 'N/A';
                 let next = $page(h).next();
                 let attempts = 0;
                 
                 while(next.length && attempts < 5) {
                     // Stop if we hit another header
                     if (next.is('h2, h3, h4')) break;
                     
                     const text = next.text().trim();
                     // Only use if it has meaningful text length and isn't just whitespace
                     if (text.length > 2) {
                         content = text.substring(0, 100).replace(/\s+/g, ' ') + (text.length > 100 ? '...' : '');
                         break;
                     }
                     next = next.next();
                     attempts++;
                 }

                 fields.push({
                     name: `Section: ${title}`,
                     example: content
                 });
            }
        });
    }

    return {
        name: cat.name,
        count: uniqueLinks.length,
        pages: uniqueLinks,
        availableFields: fields
    };
}

async function main() {
    const results: CategorySummary[] = [];

    for (const cat of CATEGORIES) {
        results.push(await catalogCategory(cat));
    }

    // Generate Markdown
    let md = `# Wiki Data Integration Catalog\n\n`;
    md += `> Automatically generated on ${new Date().toISOString()}\n\n`;
    md += `This document outlines all available data sources discovered on the official Wiki. Select the data points you wish to integrate into the visualization dashboard.\n\n`;

    // Summary Table
    md += `## Overview\n\n`;
    md += `| Category | Pages Found | Status |\n`;
    md += `|----------|-------------|--------|\n`;
    results.forEach(r => {
        md += `| **${r.name}** | ${r.count} | ${r.count > 0 ? '✅ Available' : '❌ Not Found'} |\n`;
    });
    md += `\n---\n\n`;

    // Details
    results.forEach(r => {
        if (r.count === 0) return;
        md += `## ${r.name} Data Points\n`;
        md += `**Total Entities**: ${r.count}\n\n`;
        
        md += `### Available Fields (Detected from Samples)\n`;
        md += `| Field Name | Example Value |\n`;
        md += `|------------|---------------|\n`;
        r.availableFields.forEach(f => {
            md += `| ${f.name} | ${f.example.replace(/\n/g, ' ')} |\n`;
        });
        md += `\n`;
        
        md += `<details>\n<summary>View All Pages</summary>\n\n`;
        r.pages.forEach(p => {
             const name = decodeURIComponent(p.replace('/klbq/', ''));
             md += `- [${name}](${BASE_URL}${p})\n`;
        });
        md += `\n</details>\n\n`;
    });

    fs.writeFileSync(OUTPUT_FILE, md);
    console.log(`Catalog saved to ${OUTPUT_FILE}`);
}

main();
