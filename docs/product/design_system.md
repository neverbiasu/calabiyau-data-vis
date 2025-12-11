# UI/UX Design System

## 1. Visual Identity
- **Theme**: Cyberpunk / Tactical Sci-Fi.
- **Keywords**: High Contrast, Neon, Tech-heavy, Clean Lines, Glitch Effects.

## 2. Color Palette
The following Tailwind config values are enforced:

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-core` | `#08090D` | Main background (Do not use pure black #000). Deep Void. |
| `bg-panel` | `#12141C` | Cards, Sidebar, modals. Slightly lighter than core. |
| `primary` | `#00F0FF` | **Cyan**. Main Call-to-Action, Active States, Selected items. |
| `secondary` | `#FF0055` | **Glitch Red**. Comparisons, "Enemy" stats, High damage indicators. |
| `accent` | `#FFE600` | **Yellow**. Warnings, Highlights, Tooltips. |
| `text-main` | `#EAEAEA` | Primary reading text. |
| `text-muted` | `#6B7280` | Labels, axis ticks, disabled states. |
| `border-color` | `#2A2F3E` | Thin borders for panels. |

## 3. Typography
- **Headings**: `Orbitron` (Google Font). Sci-fi, blocky, distinct.
  - H1: 24px/Bold/Tracking-wide
  - H2: 18px/SemiBold
- **Body / Data**: `Rajdhani` (Google Font). Squared sans-serif, technical feel.
- **Numbers**: `Rajdhani` or `Monospace` variant. Tabular nums preferred for tables/comparisons.

## 4. Components
### 4.1 Buttons
- **Style**: Angular corners (clip-path), 1px border.
- **Hover**: Glow effect (`box-shadow: 0 0 10px rgba(0, 240, 255, 0.5)`).
- **Active**: Filled primary color, text black.

### 4.2 Charts
- **Scatter Plot**:
  - Dots: Hollow circles by default, filled on hover.
  - Grid: Dashed, very low opacity (`#2A2F3E`).
  - Text: `text-muted` size `10px`.
- **Radar Chart**:
  - Area: `fill-opacity: 0.5`.
  - Stroke: `2px`.
  - Grid: Concentric polygons (not circles).

## 5. Layout Patterns
- **Desktop**: 
  - Fixed Sidebar (Right) for Details.
  - Flex Main (Left) for Visualization.
  - Top Bar for Branding/Status.
- **Mobile**:
  - Vertical Stack.
  - Chart on top (Aspect locked).
  - Details below.
  - Sidebar becomes bottom drawer or simple scroll.

## 6. Interaction
- **Tooltip**: Follows mouse cursor, heavily styled (backdrop blur, border).
- **Selection**: Clicking a chart node "Pins" the details panel. Clicking background unpins.
