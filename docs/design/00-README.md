# Project Starfall 设计文档索引（v1）

本目录用于长期维护游戏机制设计，目标是“分块独立、低耦合、可增量更新”。

## 最高优先级规范

- `00-release-and-branch-policy.md`：单 HTML 打包分发、版本号规则、重大改动分支策略（强制遵守）

## 文档结构

- `01-product-positioning.md`：项目定位、核心玩法、非目标
- `02-core-loop-and-scoring.md`：单波/长期循环、胜负逻辑、资源结算
- `03-facilities-and-modes.md`：主炮塔、火箭发射台、模式库与协议
- `04-wave-target-map.md`：波次预告、目标系统、地图与适用矩阵
- `05-tech-tree.md`：科技树总览与四条分支
- `06-controls-ui-art.md`：操作输入、HUD/UI、程序生成美术规范
- `07-mvp-scope.md`：MVP 必做、暂缓项、实现优先级
- `08-version-summary.md`：当前定案骨架（快速对齐）
- `09-prototype-v0.2.md`：第一版极简原型开发说明（当前执行基线）
- `99-change-log.md`：追加式变更记录（避免信息丢失）

## 维护约定（建议）

1. 只改对应主题文件，避免跨文件复制粘贴。
2. 新增机制优先写入对应模块，再在 `08-version-summary.md` 更新摘要。
3. 重大调整只追加到 `99-change-log.md`，不要覆盖旧结论。
4. 若出现冲突，以最新日期的变更记录为准，再回填到各模块。

## 当前版本

- 版本：`v1`
- 状态：`可用于进入第一版极简原型开发（v0.2）`
- 更新时间：`2026-04-16`
