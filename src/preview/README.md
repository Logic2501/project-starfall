# 资源动画预览模块

目标：为程序美术与后续 SVG 资源提供可快速核对的预览环境。

## 结构

- `animation-preview.js`：通用预览运行器（场景注册、播放/暂停、重置）
- `scenes/`：具体预览场景
- `main.js`：页面控制器
- `preview.css`：预览页样式

## 扩展约定

新增场景时，往 `scenes/` 添加文件并向 `Starfall.preview.scenes` push 一个对象：

- `id`：唯一标识
- `label`：UI 名称
- `create()`：构造场景状态
- `reset(state)`：可选重置
- `update(state, dt)`：可选帧更新
- `draw(state, ctx, canvas)`：必需绘制
