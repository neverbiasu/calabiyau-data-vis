# Data Scraping Specification

## Overview
This document outlines the data sources and schema for the Strinova (Calabiyau) Command Center data pipeline.

## Sources
1.  **Weapon Theory Data**: `https://wiki.biligame.com/klbq/主武器理论数据表`
    *   **Purpose**: Base stats for weapons (Damage, Fire Rate, Mag Capacity).
2.  **Weapon Filter Data**: `https://wiki.biligame.com/klbq/武器筛选`
    *   **Purpose**: Qualitative attributes (Handling, Accuracy, Move Speed) and Weapon Icons.
3.  **Character Detail Pages**: `https://wiki.biligame.com/klbq/{Character_Name_CN}`
    *   **Purpose**: Character Bio, Role, Faction, Abilities, and Detail Images.
    *   **URL Pattern**: `https://wiki.biligame.com/klbq/` + `encodeURIComponent(ChineseName)`

## Data Schema

### 1. Character (New Fields)
Current mock data lacks these. We need to scrape:
*   **Role**: (e.g., Duelist/决斗, Initiator/先锋)
*   **Faction**: (e.g., The Scissors/剪刀手, Urbino/乌尔比诺)
*   **Bio**: A short description of the character.
*   **Images**:
    *   `icon`: (Already have)
    *   `portrait`: Full-body tachie (立绘) - Look for `模型正面` or high-res images in "Character Fashion" section.
*   **Abilities**: List of skills.
    *   `passive`: { name, description }
    *   `tactical`: { name, description, cd, duration }
    *   `ultimate`: { name, description, cost }
*   **Stats**:
    *   `hp`: Base Health (e.g. 200)
    *   `armor`: Base Armor (e.g. 75)
    *   `mobility`: Movement speed/score (e.g. 105)

### 2. Weapon (Enhancements)
*   **Recoil**: (Future) Image URL of recoil pattern.
*   **Damage Falloff**: (Future) Array of { range, damage }.

## Scraping Logic (Update Plan)
1.  **Phase 1 (Done)**: Fetch Weapons from Theory/Filter tables.
2.  **Phase 2 (Next)**:
    *   Iterate through unique characters identified in Weapon data.
    *   Construct Wiki URL for each.
    *   Fetch page HTML.
    *   Extract:
        *   **Stats Table**: Look for HP/Armor values.
        *   **Info Box**: Look for Role/Faction.
        *   **Skills**: Iterate through skill headers/boxes.
        *   **Images**: Parse the "Gallery" or "Fashion" tabs for clean transparent PNGs if possible.

## Mappings
*   **Faction**: Map Chinese names to English (e.g., `剪刀手` -> `The Scissors`).
*   **Role**: Map Chinese names to English (e.g., `决斗` -> `Duelist`).

## Output
*   `public/data.json`: Updated structure including the new fields.
