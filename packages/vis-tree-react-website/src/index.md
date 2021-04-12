---
order: 0
group:
  title: 介绍
---

# 介绍

## 演示

<code src="./index.jsx" />

## 特性

- 支持用户使用自定义组件渲染节点和连接线
- 支持多种布局方式
- 支持动态插入/删除节点
- 支持虚拟渲染，节省性能开销
- 支持动画，动画过程中也会使用虚拟渲染

## 二次开发

核心逻辑全部封装在 `@vis-tree/core` 中，如果 `@vis-tree/react` 不能满足你的全部要求，你可以绕开它，自己基于 `@vis-tree/core` 实现一个树形可视化组件。

在实现过程中，只需保持如下 DOM 结构即可：

```html | pure
<div class="tree-canvas">
  <div class="tree-anchor">
    <div class="tree-node-wrapper">
      <div class="tree-node-content" />
      <div class="tree-node-head-line" />
      <div class="tree-node-tail-line" />
    </div>

    <div class="tree-junction-line" />

    <div class="tree-custom-line" />
  </div>
</div>
```

```css
.tree-canvas {
  position: relative;
  overflow: hidden;
  cursor: move;
}

.tree-anchor {
  position: absolute;
  top: 0;
  left: 0;
}

.tree-node-wrapper {
  position: absolute;
  cursor: auto;
}

.tree-node-content {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.tree-node-head-line,
.tree-node-tail-line,
.tree-junction-line,
.tree-custom-line {
  position: absolute;
  cursor: auto;
}
```
