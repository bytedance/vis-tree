# `@vis-tree/core`

[![download](https://img.shields.io/npm/dt/@vis-tree/core)](https://www.npmjs.com/package/@vis-tree/core) [![npm](https://img.shields.io/npm/v/@vis-tree/core?color=blue)](https://www.npmjs.com/package/@vis-tree/core) [![types](https://img.shields.io/badge/types-typescript-blue)](https://www.npmjs.com/package/@vis-tree/core) [![license](https://img.shields.io/github/license/bytedance/vis-tree?color=blue)](https://github.com/bytedance/vis-tree/blob/main/LICENSE)

`@vis-tree/core` contains the main logic of tree data visualization, the layout strategy follows the idea of [A Node-Positioning Algorithm for General Trees](http://www.cs.unc.edu/techreports/89-034.pdf).

## Features

- Support users to use custom components to render nodes and connecting lines
- Support multiple layout methods
- Support dynamic insertion/removal of nodes
- Support virtual rendering, saving performance overhead
- Support animation, virtual rendering will also be used during animation

## Related NPM library

For React, you can use [`@vis-tree/react`](https://aadonkeyz.github.io/vis-tree-react/).

For Vue, you can use [`@vis-tree/vue`](https://aadonkeyz.github.io/vis-tree-vue/Introduction.html).

## Write your own component

`@vis-tree/core` is written in pure typescript, based on it, you can encapsulate a tree-data visualization component with any fontend framework. But you should maintain the following DOM structure:

```html
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
