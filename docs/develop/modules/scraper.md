# Backend Module: Scraper (Crawler)

**Path**: `scripts/crawl.ts`
**Role**: Extracts raw data from the external Wiki source.

## 1. Data Source
- **Target**: Bilibili Wiki (Strinova/Calabiyau).
- **URLs**:
  - Weapons: `https://wiki.biligame.com/klbq/主武器理论数据表`
 ### 1.2 Data Sources
The module now integrates two Wiki sources:
1. **Main Weapon Theory Table**:
   - URL: `https://wiki.biligame.com/klbq/主武器理论数据表`
   - **Core Data**: `Damage (Head/Body)`, `Fire Rate (RPM)`, `Mag Capacity`, `Range`.
   - **Challenge**: Character names are often embedded in image URLs/Alt tags.

2. **Weapon Filter Table**:
   - URL: `https://wiki.biligame.com/klbq/武器筛选`
   - **Core Data**: `Accuracy`, `Handling`, `Aim Speed`, `Mobility` scores.

### 1.3 Core Logic
1. **Parallel Fetching**: Requests both URLs simultaneously.
2. **Name Normalization**: Removes dots `·`, spaces, and suffixes to match `Michelle Lee` with `Michelle`.
3. **Data Merging**:
   - Join Key: Normalized Chinese Name.
   - Combines quantitative combat stats (Theory) with qualitative attributes (Filter).
4. **ID Generation**: Uses `CHAR_TO_ID` map (e.g., `芙拉薇娅` -> `flavia`) for clean URLs.
4. **Extraction Strategy**:
   - **Rowspan**: Track `lastCharacterName`. If a row starts with fewer cells than expected, assume the first cell (Name) is merged from above.
   - **Fields**: Extract raw text for Damage, Fire Rate, Mag Capacity, etc.

## 4. Error Handling
- **Network Failures**: Log error and exit (Atomicity).
- **Malformed Rows**: Skip row if `Damage` or `Name` is missing, but continue processing others.
