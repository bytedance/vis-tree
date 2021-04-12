---
order: 3
group:
  title: 配置项
---

# 配置项

## 演示

<code src="./index.jsx" />

## 可配置项

| 名称                     | 描述                                                                                                        | 类型                                    | 默认值                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------- |
| `useVirtualRender`       | 是否使用虚拟渲染                                                                                            | `boolean`                               | `true`                       |
| `useAnimation`           | 是否使用动画<br/>**动画的渲染依赖于 `useVirtualRender`，如果 `useVirtualRender = false`，那么动画不会生效** | `boolean`                               | `true`                       |
| `useWheelScroll`         | 是否使用鼠标滚轮移动树                                                                                      | `boolean`                               | `true`                       |
| `defaultScrollInfo`      | 用来指定初始时移动某个节点到画布的某个位置                                                                  | `object`                                | ---                          |
| `defaultScrollInfo.key`  | 节点的标识符                                                                                                | `string` or `number`                    | ---                          |
| `defaultScrollInfo.top`  | 节点上边界到画布上边界的距离                                                                                | `string` or `number`                    | `"50% - nodeHeight * 50%"`   |
| `defaultScrollInfo.left` | 节点左边界到画布左边界的距离                                                                                | `string` or `number`                    | `"50% - nodeWidth * 50%"`    |
| `defaultExpandAll`       | 是否默认展开全部节点                                                                                        | `boolean`                               | `false`                      |
| `defaultExpandRoot`      | 是否默认展开根节点                                                                                          | `boolean`                               | `true`                       |
| `defaultExpandedKeys`    | 由默认展开的节点标识符组成的数组                                                                            | <code>Array<string &#124 number></code> | ---                          |
| `customKeyField`         | 节点标识符对应的属性名称                                                                                    | `string`                                | `"key"`                      |
| `customChildrenField`    | 节点子节点列表对应的属性名称                                                                                | `string`                                | `"children"`                 |
| `layoutStrategy`         | 布局策略                                                                                                    | `string`                                | `LAYOUT_STRATEGY.TOP_CENTER` |
| `nodeWidth`              | 节点宽度                                                                                                    | `number`                                | `60`                         |
| `nodeHeight`             | 节点高度                                                                                                    | `number`                                | `30`                         |
| `siblingInterval`        | 同胞节点的间距                                                                                              | `number`                                | `30`                         |
| `levelInterval`          | 不同层级的间距                                                                                              | `number`                                | `60`                         |
| `lineSize`               | 连接线宽度                                                                                                  | `number`                                | `1`                          |
| `lineColor`              | 连接线颜色                                                                                                  | `string`                                | `"black"`                    |
| `lineType`               | 连接线类型                                                                                                  | <code>"straight" &#124 "none"</code>    | `"straight"`                 |

## 特殊说明

### defaultScrollInfo

`defaultScrollInfo.top` 和 `defaultScrollInfo.left` 的值可以是数值或字符串：

- `100` 等价于 `100px`
- `30%` 等价于 `canvasSize * 30%`
- `30% + 100` 等价于 `canvasSize * 30% + 100px`

### layoutStrategy

目前共有 6 种布局策略，可以通过上面的演示查看不同布局策略的实际效果

```jsx | pure
import { LAYOUT_STRATEGY } from "@vis-tree/react";

// 默认值
LAYOUT_STRATEGY.TOP_CENTER;

LAYOUT_STRATEGY.BOTTOM_CENTER;

LAYOUT_STRATEGY.CENTER_LEFT;

LAYOUT_STRATEGY.CENTER_RIGHT;

LAYOUT_STRATEGY.TOP_LEFT_ALIGN_LEFT;

LAYOUT_STRATEGY.TOP_LEFT_ALIGN_TOP;
```
