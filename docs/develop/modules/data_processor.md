# Backend Module: Data Processor (ETL)

**Context**: Integrated within `scripts/crawl.ts`.
**Role**: Cleans, transforms, and validates the raw data before saving.

## 1. Transformation Logic

### 1.1 Type Mapping
Maps Chinese Names to English Weapon Types/Classes + English IDs.
- **Source**: `TYPE_MAP` constant.
- **Example**: `米雪儿` (Michelle) → `Investigator` (Type), `michelle` (ID).

### 1.2 Numerical Parsing
- **Buff Notation**: Handles strings like `25(30)`.
  - Logic: Regex `^(\d+)` extracts `25`. The parenthesized value is currently ignored (MVP).
- **Shotgun Notation**: Handles strings like `12x8`.
  - Logic: Parses Base Damage as `12`. Stores `pellets: 8`.
  - Burst Calculation: $12 \times 8 \times Mag = Total Burst$.

### 1.3 Computed Stats
- **DPS (Body)**: $\frac{RPM}{60} \times Damage_{body}$.
- **DPS (Head)**: $\frac{RPM}{60} \times Damage_{head}$.

## 2. Validation
Before saving `data.json`:
1. Count records.
2. Check for `null` IDs.
3. Ensure numerical fields are valid numbers (not `NaN`).

## 3. Output
Writes to standard out (Logs) and file system (`public/data.json`).
