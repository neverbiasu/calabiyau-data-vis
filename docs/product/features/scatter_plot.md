# Feature: Scatter Plot (The Meta)

**Component**: `components/viz/ScatterPlot.vue`

## 1. Purpose
To visualize the "Meta" distribution. In shooter games, the trade-off between **Fire Rate** and **Damage** defines the weapon archetype. A scatter plot is the perfect tool to reveal "outliers" (weapons that are statistically superior).

## 2. Axis Definition
- **X-Axis**: Fire Rate (RPM). Linear Scale.
- **Y-Axis**: Body Damage. Linear Scale.
- **Z-Axis (Radius)**: Magazine Capacity. Sqrt Scale (Area proportional to value).
- **Color**: Weapon Archetype (Categorical).

## 3. Interaction Design
- **Zoom/Pan**: Users can zoom in to crowded areas (e.g., the 600-800 RPM cluster) using D3 Zoom behavior.
- **Hover**: 
  - Target circle stroke turns white (`#FFFFFF`).
  - Tooltip appears with Name, DPS, and exact Dmg/RPM values.
- **Click**:
  - Target circle stroke turns Neon Cyan (`#00F0FF`) and thickens.
  - Emits global `selected` event.
  - Other circles fade to `opacity: 0.3`.

## 4. Technical Constraints
- Must handle overlapping points (solution: partial transparency or force simulation - MVP uses simple transparency).
- Must resize responsively.
