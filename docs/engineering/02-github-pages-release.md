# GitHub Pages 发布流程

## 分支职责

- `main` / `feature/*`：源码、文档、历史 `dist/` 包
- `gh-pages`：只放 GitHub Pages 站点文件

## 站点结构

- `/index.html`：当前稳定版单 HTML
- `/404.html`：与当前稳定版保持一致
- `/versions/starfall-vX.Y.Z.html`：稳定版历史文件
- `/versions.json`：稳定版索引

## 发布命令

- 使用当前 `version.json` 的版本发布：`npm run publish:pages`
- 指定某个已存在的打包版本发布：`npm run publish:pages -- 0.2.23`

## 发布要求

- 目标版本必须已经存在于 `dist/starfall-vX.Y.Z.html`
- 该命令会在本地维护 `gh-pages` 分支提交
- 推送到 GitHub：`git push origin gh-pages`

## 推荐流程

1. 在源码分支完成并验证稳定版打包
2. 执行 `npm run publish:pages -- <stable-version>`
3. 推送 `gh-pages`
4. 在 GitHub Pages 设置中选择 `gh-pages` 分支根目录作为发布源
