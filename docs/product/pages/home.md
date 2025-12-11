# Home Dashboard Page

**Path**: `/pages/index.vue`
**Role**: The landing page and central command center of the application.

## 1. Functional Overview
The Home Dashboard serves as the entry point for users to analyze the Strinova meta. It integrates:
- Global Navigation
- Data Filtering Controls
- Visualizations (Scatter Plot)
- Detailed Analysis (sidebar)

## 2. Layout Structure
The page uses a flexible layout optimized for Desktop viewport (1920x1080), adaptable to Mobile.

### 2.1 Header (Global Navigation)
- **Content**: 
  - Logo: "STRINOVA ANALYTICS"
  - Meta Info: Last Scraped Date (e.g. "Last update: 2023-10-27")
- **Interaction**: Static display.

### 2.2 Control Bar
- **Position**: Floating Overlay (Top-Left of the Chart area).
- **Controls**:
  - **Weapon Type Filter**: Dropdown to select specific classes (Rifle, Sniper, etc.).
  - **Global Search**: Input field to highlight specific weapons by name.

### 2.3 Main Visualization (Left Panel)
- **Component**: `ScatterPlot`.
- **Behavior**: occupies the majority of the screen space. Resizes dynamically with the window.

### 2.4 Details Panel (Right Sidebar)
- **Component**: Custom Sidebar (embedded in `index.vue`).
- **Behavior**:
  - Default State: Prompt user to select a weapon.
  - Active State: Shows `RadarChart` and numerical stats cards.
