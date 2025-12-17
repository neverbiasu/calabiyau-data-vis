
export interface Weapon {
  id: string;           // 武器英文名 (e.g. "investigator")
  name: string;         // 武器中文名 (e.g. "警探")
  character: string;    // 所属角色中文名 (e.g. "米雪儿")
  type: string;         // 武器类型中文 (e.g. "自动步枪")
  // Images
  imgs: {
    character: string;  // URL to Character Icon
    weapon: string;     // URL to Weapon Icon
  };

  // Stats from Theory Table (Quantitative)
  stats: {
    damage_head: number;
    damage_body: number;
    fire_rate: number;    // RPM
    mag_capacity: number;
    reload_time: number;  // Seconds (from Theory)
    range: number;        // Meters
  };

  // NEW: Damage Falloff Data (Distance -> Damage)
  damage_falloff?: {
      [distance: string]: {
          head: number;
          body: number;
          legs: number;
      }
  };

  // NEW: Body Part Multipliers
  body_part_multipliers?: {
      head: number;
      chest: number;
      legs: number;
  };

  // Stats from Filter Table (Qualitative/Scores 0-100)
  attributes: {
    aim_speed: number;    // 瞄准速度
    accuracy: number;     // 精准
    handling: number;     // 操控
    reload_speed: number; // 装填速度 (Score value, 0-100)
    charge_speed: number; // 蓄力速度 (0 if N/A)
    fire_mode: string;    // 开火模式 (e.g. "Auto")
    zoom_scale: string;   // 放大倍率 (e.g. "1.25X")
    move_speed: number;   // 移速变化
  };

  computed: {
    dps_body: number;
    dps_head: number;
    burst_damage: number;
    time_to_kill: number; // Against standard target
  };
  
  wikiUrl?: string; // Optional: Link to wiki
}

export interface Ability {
  name: string;
  type: 'Passive' | 'Active' | 'Ultimate' | 'Weapon';
  description: string;
  stats?: Record<string, string>; // e.g. { "Cooldown": "15s", "Cost": "120" }
  image?: string;
}

export interface Character {
  id: string;
  name: string;
  icon: string;
  wikiUrl?: string;
  faction?: string;
  role?: string;
  bio?: string;
  images?: {
    full?: string;
    portrait?: string;
  };
  stats?: {
    hp: number;
    armor: number;
    mobility: number;
  };
  abilities?: Ability[];
}

export interface RootData {
  last_updated: string;
  game_version: string;
  weapons: Weapon[];
  characters: Character[];
}
