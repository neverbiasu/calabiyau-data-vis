# Calabiyau Data Vis (Strinova Command Center)
A modern, data-driven visualization dashboard for the game *Strinova* (Calabiyau), built with **Nuxt 4**, **TailwindCSS**, and **D3.js**.

## Features
- **Interactive Character Database**: Browse all characters (Superstringers) with their stats, roles, and factions.
- **Weapon Armory**: Detailed weapon statistics including damage, fire rate, and handling.
- **Data Visualization**: 
  - **Radar Charts** (D3.js) for visualizing character survival stats (HP, Armor, Mobility).
  - Role-Based Stat Estimation for incomplete data.
- **Modern UI/UX**:
  - Glassmorphism design system.
  - Smooth page transitions.
  - Responsive layout for all devices.
  - Optimized images with `@nuxt/image`.

## Tech Stack
- **Framework**: Nuxt 4 (Vue 3)
- **Styling**: TailwindCSS (v4) + Customized Design Tokens
- **Visualization**: D3.js
- **State Management**: Pinia
- **Data Source**: Hybrid (Scraped `data.json` + Mock Fallbacks)

## Setup

1. **Install Dependencies**:
   ```bash
   bun install
   ```

2. **Run Development Server**:
   ```bash
   bun run dev
   ```
   Access the app at `http://localhost:3000`.

## Project Structure
- `pages/`: Application routes (Home, Characters, Weapons).
- `components/`: Reusable UI components (RadarChart, etc.).
- `composables/`: Data fetching logic (`useStrinovaData`).
- `public/data.json`: The core dataset for the application.

## Credits
Data and imagery related to *Strinova* / *Calabiyau* are property of their respective owners. This is a fan-made fan project.
