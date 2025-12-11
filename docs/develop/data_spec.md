# Data Specification

## 1. Output Schema
The scraper generates a single `data.json` file. 

### 1.1 Root Object

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `last_updated` | `string` | ISO 8601 Timestamp | `"2023-10-27T10:00:00Z"` |
| `game_version` | `string` | Game Version | `"1.0"` |
| `weapons` | `Weapon[]` | List of Weapons | `[{ "id": "michelle", ... }]` |
| `characters` | `Character[]` | (Reserved) Character List | `[]` |

### 1.2 Weapon Object

In Strinova (Calabiyau), **Main Weapons are intrinsically bound to Characters** (except in special modes). Therefore, for the MVP, we model the "Character" and "Weapon" as a unified entity.
- **ID Strategy**: Uses the **Weapon's English Name** as the primary key (e.g., `investigator`).
- **Decoupling**: While coupled now, the schema separates `stats` (Weapon) from `attributes` (Character handling), allowing for future decoupling if needed.

#### Core Fields

| Field | Type | Source | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Generated | Weapon Unique ID (English), e.g., `investigator` |
| `name` | `string` | Both | Weapon Chinese Name, e.g., `警探` |
| `character` | `string` | Derived | Character Chinese Name, e.g., `米雪儿` |
| `type` | `string` | Filter Table | Weapon Type (Chinese), e.g., `自动步枪` |
| `imgs` | `object` | Scraped | Image URLs `{ character: url, weapon: url }` |

#### Combat Stats (from Theory Table)

| Field | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `damage_head` | `number` | Dmg | Headshot/Crit Damage |
| `damage_body` | `number` | Dmg | Body/Base Damage |
| `fire_rate` | `number` | RPM | Rounds Per Minute |
| `mag_capacity`| `number` | Rounds | Magazine Size |
| `reload_time` | `number` | Sec | Reload Time (Default 2.0s if missing) |
| `range` | `number` | Meters | Effective Range |

#### Handling Attributes (from Filter Table)

| Field | Type | Range | Description |
| :--- | :--- | :--- | :--- |
| `aim_speed` | `number` | 0-100 | Aiming Speed Score |
| `accuracy` | `number` | 0-100 | Accuracy Score |
| `handling` | `number` | 0-100 | Handling/Control Score |
| `reload_speed`| `number` | 0-100 | Reload Speed Score (Qualitative) |
| `move_speed` | `number` | 0-100 | Mobility Score |
| `clean_zoom` | `string` | - | Zoom Factor (e.g. "1.25X") |

#### Computed Metrics

| Field | Type | Formula | Description |
| :--- | :--- | :--- | :--- |
| `dps_body` | `number` | `(RPM/60) * BodyDmg` | Theoretical DPS (Body) |
| `dps_head` | `number` | `(RPM/60) * HeadDmg` | Theoretical DPS (Head) |
| `burst_damage`| `number` | `Mag * BodyDmg` | Total Damage per Magazine |
| `time_to_kill`| `number` | `(Shots-1) * (60/RPM)` | Time to kill standard 200HP target |

## 2. ETL Logic (Scraper)
### 2.1 Extraction
- **Target**: `https://wiki.biligame.com/klbq/主武器理论数据表`
- **Selector**: `.klbqtable tbody tr` (Iterate rows)
- **Row Handling**:
  - The table uses `rowspan` for the "Character Name" column. 
  - The scraper tracks `lastCharacterName` to fill implicitly merged cells.
  - Filters: Rows where "State" column is NOT "无" (Base) are currently skipped (e.g. Upgrade +1, +2).

### 2.2 Transformation
- **Normalization**:
  - `damage_body`: Parsed from "10m" column. if "12x8" (Shotgun), parses as `12`.
  - `range`: Fixed or parsed from headers.
  - `type`: Looked up via `TYPE_MAP` const in script.
- **ID Generation**:
  - Uses `ID_MAP` for clean English IDs. 
  - Fallback: `id` + auto-generated string (avoided if possible).

### 2.3 Validation
- Rows with `damage_body === 0` are discarded.
- Rows with missing names are discarded.
- JSON validity check before write.
