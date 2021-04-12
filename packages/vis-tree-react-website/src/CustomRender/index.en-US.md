---
order: 2
group:
  title: Custom rendering
---

# Custom rendering

## Node rendering

<code src="./RenderNode.jsx" />

The rendering of the node is achieved by passing the `renderNode()` method, which will receive an object as a parameter, which has the following properties:

- `node`: Current node
- `expanded`: `true` means the node is in the expanded state, `false` means the node is in the collapsed state. If the node has no children, then it must be `false`
- `parentNode`: The parent node of the current node. For the root node, this attribute is `undefined`

The return value of `renderNode()`, which is `<YourComponent />`, will be rendered in the following DOM structure:

```html
<!-- Its width and height are determined by options.nodeWidth and options.nodeHeight respectively -->
<div class="tree-node-wrapper">
  <div class="tree-node-content">
    <YourComponent />
  </div>
</div>
```

```css
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
```

## Rendering of connecting lines

<code src="./RenderLine.jsx" />

The rendering of the node is achieved by passing the `renderLine()` method, which will receive an object as a parameter, which has the following properties:

- `startNode`: Start node of the connecting line
- `stopNode`: End node of the connecting line
- `containerWidth`: The width of the rectangle with the connecting line as the diagonal
- `containerHeight`: The height of the rectangle with the connecting line as the diagonal
- `startPointCoordinate`: In the coordinate system formed by the rectangle with the connecting line as the diagonal, the coordinates of the starting point
- `stopPointCoordinate`: In the coordinate system formed by the rectangle with the connecting line as the diagonal, the coordinates of the end point

The return value of `renderLine()`, which is `<YourComponent />`, will be rendered in the following DOM structure:

```html
<!-- Its width and height are containerWidth and containerHeight respectively -->
<div class="tree-custom-line">
  <YourComponent />
</div>
```

```css
.tree-custom-line {
  position: absolute;
}
```
