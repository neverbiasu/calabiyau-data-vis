# Feature: Radar Chart (Spec Radar)

**Component**: `components/viz/RadarChart.vue`

## 1. Purpose
To provide a multi-dimensional profile of a weapon, helping players understand its "feel" beyond raw DPS (e.g. is it mobile? does it have range?).

## 2. Dimensions (Axes)
1. **Damage**: Normalized against Max Dmg (e.g. 100).
2. **Fire Rate**: Normalized against Max RPM (e.g. 1200).
3. **Capacity**: Normalized against Max Mag (e.g. 100).
4. **Mobility**: Inverse of Reload Time. Faster reload = Higher Mobility score.
5. **Range**: Normalized Effective Range.

## 3. Visual Style
- **Shape**: Polygon (Pentagon).
- **Grid**: 5 concentric levels indicating 20%, 40%, 60%, 80%, 100%.
- **Fill**: Semi-transparent Neon Cyan (`rgba(0, 240, 255, 0.5)`).

## 4. Comparison Mode
- When comparing two weapons, the second weapon renders as a "Glitch Red" (`#FF0055`) dashed polygon overlay.
- Intersection areas blend colors.
