# Product Requirements Document (PRD)
**Project**: Strinova / Calabiyau Data Visualization Dashboard  
**Version**: 1.0  
**Status**: DRAFT  

## 1. Project Background
The goal is to build a web-based "Data Visualization War Room" (MVP) for the game *Strinova* (Calabiyau). It aims to provide players with a standardized, interactive, and visually immersive way to analyze weapon and character statistics, overcoming the limitations of static wiki tables.

## 2. Core Objectives
- **Standardization**: Convert unstructured Wiki data into a strict JSON schema.
- **Visualization**: Provide intuitive comparisons (Scatter Plots, Radar Charts) to reveal "The Meta".
- **Aesthetics**: Deliver a high-quality "Cyberpunk/Sci-Fi" UI consistent with the game's art style.
- **Availability**: Ensure data is accessible and the application is consistent relative to the game version.

## 3. Scope (MVP)
### 3.1 Included
- **Data Source**: Bilibili Wiki (Weapons, Characters).
- **Visualization**: 
  - Weapon Meta Scatter Plot (Fire Rate vs Damage).
  - Individual Spec Radar Chart (5 Dim: Dmg, RPM, Mag, Mobility, Range).
- **UI**: Main Dashboard Page with Filter and Search.
- **Platform**: Web (Desktop optimized, Mobile responsive).

### 3.2 Excluded (Future)
- Real-time game packet interception (Too risky/complex).
- User Accounts / Loadout Saving.
- Historical Season Data (Wiki lacks history currently).

## 4. Functional Requirements
### 4.1 Data Acquisition (Scraper)
- **Source**: `wiki.biligame.com/klbq`
- **Output**: `public/data.json`
- **Logic**:
  - Parse HTML Tables (`.klbqtable`).
  - Handle complex strings (e.g., "25(30)" -> base 25, buff 30).
  - Map Character Names to Weapon Types (e.g., Michelle -> Investigator).
  - Compute derived stats: `DPS`, `Burst Damage`.

### 4.2 Frontend Dashboard
- **Layout**: 
  - **Header**: Branding & Last Update time.
  - **Sidebar/Control**: Weapon Type Filter (All, Rifle, Sniper, etc.), Search Input.
  - **Main View**: Interactive Scatter Plot.
  - **Detail View**: Selected Weapon Info + Radar Chart.
- **Interactivity**:
  - Hovering a scatter point highlights it and shows a tooltip.
  - Clicking a point locks the selection and updates the Detail View.
  - Toggling "Compare Mode" (Nice to have) allows overlaying two weapons.

## 5. Non-Functional Requirements
- **Performance**: Dashboard should load < 2s. Filtering should be instant (< 100ms).
- **Reliability**: Scraper should handle network jitter and wiki format minor changes gracefully (or log errors clearly).
- **Design**: Strict adherence to "Cyberpunk" palette (Neon Cyan `00F0FF`, Dark Void `#08090D`).
