---
order: 3
group:
  title: Options
---

# Options

## Demo

<code src="./index.jsx" />

## API

| Name                     | Description                                                                                                                                                       | Type                                    | Default                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------- |
| `useVirtualRender`       | Whether to use virtual rendering                                                                                                                                  | `boolean`                               | `true`                       |
| `useAnimation`           | Whether to use animation<br/>**The rendering of animation depends on `useVirtualRender`, if `useVirtualRender = false`, then the animation will not take effect** | `boolean`                               | `true`                       |
| `useWheelScroll`         | Whether to use the mouse wheel to move the tree                                                                                                                   | `boolean`                               | `true`                       |
| `defaultScrollInfo`      | Used to specify the initial movement of a node to a certain position on the canvas                                                                                | `object`                                | ---                          |
| `defaultScrollInfo.key`  | Node identifier                                                                                                                                                   | `string` or `number`                    | ---                          |
| `defaultScrollInfo.top`  | The distance from the upper boundary of the node to the upper boundary of the canvas                                                                              | `string` or `number`                    | `"50% - nodeHeight * 50%"`   |
| `defaultScrollInfo.left` | The distance from the left edge of the node to the left edge of the canvas                                                                                        | `string` or `number`                    | `"50% - nodeWidth * 50%"`    |
| `defaultExpandAll`       | Whether to expand all nodes by default                                                                                                                            | `boolean`                               | `false`                      |
| `defaultExpandRoot`      | Whether to expand the root node by default                                                                                                                        | `boolean`                               | `true`                       |
| `defaultExpandedKeys`    | An array of node identifiers expanded by default                                                                                                                  | <code>Array<string &#124 number></code> | ---                          |
| `customKeyField`         | The attribute name corresponding to the node identifier                                                                                                           | `string`                                | `"key"`                      |
| `customChildrenField`    | The attribute name corresponding to the node's child node list                                                                                                    | `string`                                | `"children"`                 |
| `layoutStrategy`         | Layout strategy                                                                                                                                                   | `string`                                | `LAYOUT_STRATEGY.TOP_CENTER` |
| `nodeWidth`              | Node width                                                                                                                                                        | `number`                                | `60`                         |
| `nodeHeight`             | Node height                                                                                                                                                       | `number`                                | `30`                         |
| `siblingInterval`        | Distance between sibling nodes                                                                                                                                    | `number`                                | `30`                         |
| `levelInterval`          | Different levels of spacing                                                                                                                                       | `number`                                | `60`                         |
| `lineSize`               | Connection line width                                                                                                                                             | `number`                                | `1`                          |
| `lineColor`              | Connection line color                                                                                                                                             | `string`                                | `"black"`                    |
| `lineType`               | Connection line type                                                                                                                                              | <code>"straight" &#124 "none"</code>    | `"straight"`                 |

## Special Instructions

### defaultScrollInfo

The values of `defaultScrollInfo.top` and `defaultScrollInfo.left` can be numeric or string:

- `100` is equivalent to `100px`
- `30%` is equivalent to `canvasSize * 30%`
- `30% + 100` is equivalent to `canvasSize * 30% + 100px`

### layoutStrategy

There are currently 6 layout strategies. You can check the actual effects of different layout strategies through the above demonstration

```jsx | pure
import { LAYOUT_STRATEGY } from "@vis-tree/react";

// default
LAYOUT_STRATEGY.TOP_CENTER;

LAYOUT_STRATEGY.BOTTOM_CENTER;

LAYOUT_STRATEGY.CENTER_LEFT;

LAYOUT_STRATEGY.CENTER_RIGHT;

LAYOUT_STRATEGY.TOP_LEFT_ALIGN_LEFT;

LAYOUT_STRATEGY.TOP_LEFT_ALIGN_TOP;
```
