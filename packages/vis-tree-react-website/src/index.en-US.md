---
order: 0
group:
  title: Introduction
---

# Introduction

## Demo

<code src="./index.jsx" />

## Feature

- Support users to use custom components to render nodes and connecting lines
- Support multiple layout methods
- Support dynamic insertion/removal of nodes
- Support virtual rendering, saving performance overhead
- Support animation, virtual rendering will also be used during animation

## Secondary development

The core logic is all encapsulated in `@vis-tree/core`. If `@vis-tree/react` cannot meet all your requirements, you can bypass it and implement a tree based on `@vis-tree/core` yourself Shape visualization component.

In the implementation process, you only need to maintain the following DOM structure:

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
