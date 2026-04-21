# 第一版原型代码结构（v0.2）

## 目标

- 分文件模块化开发
- 每次可打包为单 HTML 分发文件
- 版本号使用 `x.y.z`
- 预留 SVG 美术资源结构

## 目录说明

- `src/core/`：循环、状态、事件、配置
- `src/entities/`：天体/碎块/炮弹/炮塔实体工厂
- `src/systems/`：波次、碰撞、碎裂、捕获、落地结算等系统
- `src/render/`：Canvas 渲染器与图层
- `src/ui/`：HUD、波后面板、科技壳、语言切换
- `src/data/`：波次参数、平衡参数、文案
- `src/assets/svg/`：SVG 资源预留（source/generated/runtime）
- `public/index.dev.html`：开发态入口（多脚本）
- `public/index.template.html`：分发模板（内联占位）
- `public/preview.dev.html`：动画预览开发入口
- `public/preview.template.html`：动画预览分发模板
- `scripts/bundle-single-html.mjs`：唯一打包脚本（自动 patch；可传入指定版本号）
- `scripts/publish-gh-pages.mjs`：将稳定版单 HTML 发布到 `gh-pages` 分支
- `version.json`：分发版本元数据
- `dist/`：分发产物目录

## 常用命令

- 自动 patch 升版并打包：`npm run bundle`
- 指定版本并打包：`npm run bundle -- 1.1.0`
- 发布当前稳定版到 `gh-pages`：`npm run publish:pages`

## 打包产物

- 版本文件：`dist/starfall-v<version>.html`

## 版本与分支协作建议

- 常规小改动：默认连续递增 patch。
- 重大改动：按规范开新分支开发，稳定后合并主分支。
- GitHub Pages：使用独立 `gh-pages` 分支承载稳定版站点。
