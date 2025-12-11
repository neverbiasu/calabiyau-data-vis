# 开发指南 (Development Guide)

## 1. 环境准备
确保本地已安装：
- **Node.js**: v18+ (推荐 v20 LTS)
- **npm**: v9+

## 2. 快速开始
### 2.1 安装依赖
```bash
npm install
```

### 2.2 运行开发服务器
```bash
npm run dev
```
访问 `http://localhost:3000` 即可看到实时预览。

### 2.3 更新数据
如果需要从 Wiki 抓取最新数据：
```bash
npx tsx scripts/crawl.ts
```
成功后，`public/data.json` 会被更新。请在提交代码前检查该文件的 Diff。

## 3. 目录开发指引
- **新增组件**: 请放入 `components/`。如果是通用的放入 `ui/`，如果是 D3 图表放入 `viz/`。
- **修改样式**: 
  - 优先使用 Tailwind Utility Class。
  - 全局样式修改 `app/assets/css/main.css`。
  - 色值修改 `tailwind.config.js`（**严禁**在代码中硬编码颜色 Hex 值，必须使用 `text-primary` 等语义类）。
- **状态管理**: 数据相关的逻辑请修改 `stores/data.ts`。

## 4. 构建与部署
### 4.1 本地构建测试
```bash
npm run build
node .output/server/index.mjs
```

### 4.2 部署建议
由于本项目是纯静态前端+静态JSON，推荐部署到 **Vercel**、**Netlify** 或 **GitHub Pages**。
- **构建命令**: `npm run build`
- **输出目录**: `.output/public` (对于 SSG/SPA 模式)

## 5. 常见问题 (FAQ)
- **Q: 图表不显示数据？**
  - A: 检查 `public/data.json` 是否为空。尝试运行爬虫脚本。
- **Q: 样式没生效？**
  - A: 确保使用了 `npm run dev` 启动，Tailwind 需要 JIT 编译。
- **Q: 爬虫报错 403/429？**
  - A: 可能是 Wiki 的反爬策略。尝试更换 IP 或在脚本中增加 `User-Agent` 头。
