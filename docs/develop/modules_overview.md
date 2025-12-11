# Module & Component Breakdown

## 1. Pages
### `pages/index.vue`
- **Role**: Main Container.
- **Logic**: 
  - Fetches data on Mount via Store.
  - Manages Layout (Header + Canvas + Sidebar).
  - Handles high-level events (e.g., resizing).
- **Dependencies**: `stores/data`, `viz/ScatterPlot`, `viz/RadarChart`.

## 2. Store
### `stores/data.ts` (Pinia)
- **State**:
  - `weapons`: Array<Weapon>
  - `selectedWeaponId`: string | null
  - `filterType`: string ('All' by default)
- **Getters**:
  - `filteredWeapons`: Returns array subset based on `filterType`.
  - `selectedWeapon`: Returns object or undefined.
  - `weaponTypes`: Returns unique list of types for Dropdown.
- **Actions**:
  - `fetchData()`: Async `fetch('/data.json')`.

## 3. Visualization Components (D3)
### `components/viz/ScatterPlot.vue`
- **Props**: `weapons` (Array), `selectedId` (String).
- **D3 Logic**:
  - `d3.scaleLinear` for X (RPM) and Y (Damage).
  - `d3.scaleSqrt` for Radius (Capacity).
  - `d3.zoom` enabled.
  - `enter/update/exit` pattern in `updateChart()`.
- **Events**: Emits `select(id)` on circle click.

### `components/viz/RadarChart.vue`
- **Props**: `weapon` (Object), `compareWeapon` (Object - Optional).
- **D3 Logic**:
  - `d3.lineRadial` for generating polygon paths.
  - Normalizes values (0-1) against hardcoded `MAX_VALUES`.
  - Renders 5 axes + Grid levels.

## 4. Shared/Utility
### `types/data.d.ts`
- Shared TypeScript interfaces to ensure consistency between Scraper and Frontend.
