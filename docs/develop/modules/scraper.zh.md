# 后端模块: 爬虫 (Scraper)

**脚本路径**: `scripts/crawl.ts`
**职责**: 从外部 Wiki 源提取原始数据。

## 1. 数据源
- **目标**: Bilibili Wiki### 1.2 数据源 (Data Sources)
本模块现在整合了两个 Wiki 数据源：
1. **主武器理论数据表 (Theory)**:
   - URL: `https://wiki.biligame.com/klbq/主武器理论数据表`
   - **核心数据**: `伤害 (Head/Body)`, `射速 (RPM)`, `弹匣 (Mag)`, `射程 (Range)`, `TTK (Time To Kill)`
   - **挑战**: 角色名通常包含在图片 URL 中，需解析 `href` 或 `alt` 属性。

2. **武器筛选表 (Filter)**:
   - URL: `https://wiki.biligame.com/klbq/武器筛选`
   - **核心数据**: `精准 (Accuracy)`, `操控 (Handling)`, `瞄准速度 (Aim Speed)`, `移速 (Move Speed)` 等评分属性。
   - **挑战**: 数据为 0-100 的评分或定性描述 (e.g., "全自动")。

### 1.3 核心逻辑 (Core Logic)
1. **并行抓取**: 同时请求两个 URL。
2. **名称归一化**: 移除 `·` (间隔号), 空格, 和 `头像.png` 后缀，确保 `米雪儿·李` 和 `米雪儿` 能匹配。
3. **数据合并 (Merge)**:
   - 以 **归一化中文名** 作为 Key。
   - `Theory` 表提供定量战斗数值。
   - `Filter` 表提供定性手感属性。
4. **ID 生成**: 优先使用 `CHAR_TO_ID` 映射 (e.g. `芙拉薇娅` -> `flavia`)，确保 URL 友好。`lastCharacterName`。如果某行单元格数少于预期，假设第一列 (姓名) 是由上一行合并下来的。
   - **字段**: 提取伤害、射速、弹容等原始文本。

## 4. 错误与容错
- **网络故障**: 记录错误并退出 (原子性)。
- **畸形行**: 如果某行缺少 `Damage` 或 `Name` 则跳过，但继续处理其他行。
