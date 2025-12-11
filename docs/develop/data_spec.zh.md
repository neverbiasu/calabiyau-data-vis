# 数据与接口定义 (Data & API Spec)

## 1. 数据源定义
- **文件路径**: `/public/data.json`
- **生成方式**: `scripts/crawl.ts` 离线生成
- **访问方式**: 前端通过 `GET /data.json` 获取

## 2. JSON Schema
产出的 JSON 必须严格遵循以下 TypeScript 接口定义：

### 2.1 根节点 (Root)

| 字段 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `last_updated` | `string` | ISO 8601 格式时间戳 | `"2023-10-27T10:00:00Z"` |
| `game_version` | `string` | 游戏版本号 | `"1.0"` |
| `weapons` | `Weapon[]` | 核心武器列表 | `[{ "id": "michelle", ... }]` |
| `characters` | `Character[]` | (预留) 角色列表，目前为空 | `[]` |

### 2.2 武器对象 (Weapon)

在卡拉彼丘 (Strinova) 中，**主武器与角色主要是一一绑定的** (除特殊模式外)。因此，为了简化数据模型，我们在 MVP 阶段将“角色”与“武器”视为同一实体的不同面。
- **ID 策略**: 使用武器的英文名作为主键 (e.g., `investigator`)。
- **解耦设计**: 虽然目前耦合，但数据结构上通过 `attributes` 分离了手感属性，未来若需解耦，只需将 `stats` 拆分即可。

#### 核心字段

| 字段 | 类型 | 来源 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | `string` | 生成 | 武器英文名 (小写), 如 `investigator` |
| `name` | `string` | 两个源 | 武器中文名, 如 `警探` |
| `character` | `string` | 生成 | 所属角色中文名, 如 `米雪儿` |
| `type` | `string` | 筛选表 | 武器类型 (中文), 如 `自动步枪` |
| `imgs` | `object` | 生成 | 图片资源对象 `{ character: url, weapon: url }` |

#### 数值对象 (Stats) - 来源：理论数据表

| 字段 | 类型 | 单位 | 说明 |
| :--- | :--- | :--- | :--- |
| `damage_head` | `number` | 伤害值 | 爆头/弱点伤害 |
| `damage_body` | `number` | 伤害值 | 躯干/基础伤害 |
| `fire_rate` | `number` | RPM | 射速 (Rounds Per Minute) |
| `mag_capacity`| `number` | 发 | 弹匣容量 |
| `reload_time` | `number` | 秒 | 换弹时间 (目前暂缺，默认 2.0s) |
| `range` | `number` | 米 | 有效射程 |

#### 属性评分 (Attributes) - 来源：武器筛选表

| 字段 | 类型 | 范围 | 说明 |
| :--- | :--- | :--- | :--- |
| `aim_speed` | `number` | 0-100 | 瞄准速度 |
| `accuracy` | `number` | 0-100 | 精准度 |
| `handling` | `number` | 0-100 | 操控性 |
| `reload_speed`| `number` | 0-100 | 装填速度评分 (非秒数) |
| `move_speed` | `number` | 0-100 | 移速变化 |
| `clean_zoom` | `string` | - | 放大倍率 (e.g. "1.25X") |

#### 计算属性 (Computed)

| 字段 | 类型 | 公式 | 说明 |
| :--- | :--- | :--- | :--- |
| `dps_body` | `number` | `(RPM/60) * BodyDmg` | 理论秒伤 (躯干) |
| `dps_head` | `number` | `(RPM/60) * HeadDmg` | 理论秒伤 (爆头) |
| `burst_damage`| `number` | `Mag * BodyDmg` | 弹匣理论总伤 |
| `time_to_kill`| `number` | `(Shots-1) * (60/RPM)` | 击杀标准靶 (200HP) 所需时间 |

## 3. ETL 逻辑细节 (Extract-Transform-Load)
必须同时抓取**两个数据源**并进行合并：
1. **理论数据表 (Theory)**: 提供 `damage`, `range`, `reload_time` (秒)。
2. **筛选表 (Filter)**: 提供 `accuracy`, `handling`, `aim_speed` 等评分数据。

**合并逻辑**:
- 以 **中文角色名** (Name) 为主键进行 Join。
- ID 生成规则：使用预定义的 `NAME_MAP` 将中文名转换为 **小写英文名** (e.g. `芙拉薇娅` -> `flavia`)。

### 3.3 验证 (Validate)
- 过滤掉 `damage_body` 为 0 的无效行。
- 过滤掉 `name` 为空的行。
- 确保 `id` 唯一。
