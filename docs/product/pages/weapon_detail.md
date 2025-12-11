# Weapon Detail Page

**Context**: In MVP, this is a Panel/Sidebar. In future versions, it may be a standalone page `/weapon/[id]`.

## 1. Functional Overview
Provides a deep dive into a specific weapon's statistics, calculating theoretical performance ceiling and floor.

## 2. Information Definition
The detail view must display:
- **Identity**:
  - Name (e.g. "Law")
  - Type (e.g. "Investigator")
  - In-game Icon (if available)

- **Core Stats (Raw)**:
  - Damage (Body/Head)
  - Fire Rate (RPM)
  - Magazine Capacity
  - Reload Time

- **Derived Stats (Computed)**:
  - **DPS (Body)**: `(RPM / 60) * Damage_Body`
  - **DPS (Head)**: `(RPM / 60) * Damage_Head`
  - **Burst Damage**: `Damage_Body * Magazine_Capacity`
  - **TTK (Ref)**: Time to Kill against standard 200HP target (optional).

## 3. Visualization
- **Radar Chart**: Embedded 300x300px chart comparing the 5 key attributes against the average.

## 4. Interaction
- **Comparison**: A "Compare" toggle allows selecting a second weapon to overlay on the Radar Chart for direct A/B testing.
