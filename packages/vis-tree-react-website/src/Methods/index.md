---
order: 4
group:
  title: 方法
---

# 方法

## 演示

<code src="./index.jsx" >

---

- 当搜索一个节点时，会调用 `updateNodesExpanded` 和 `scrollIntoView`
- 当改变一个节点时，会调用 `getExpandedKeys`、`updateNodesExpanded` 或 `toggleNodeExpanded`

## 如何获取方法

通过 `ref` 绑定组件实例，然后就可以调用实例上的方法了

```jsx | pure
import React, { useRef } from 'react'
import VisTreeReact from "@vis-tree/react";

export default () => {
  const treeRef = useRef();

  // treeRef.current.xxx()

  return <VisTreeReact ref={treeRef}>
}
```

## 都有哪些方法

| 名称                  | 描述                                                                                                                  | 类型                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `scrollIntoView`      | 将给定节点移动到画布中的指定位置                                                                                      | `({ key, top, left }) => void`                                          |
| `getExpandedKeys`     | 获取 `expanded === true` 的节点的标识符组成的列表，通过 `containInvisible` 参数指定是否该列表是否包含那些不可见的节点 | <code>(containInvisible?: boolean) => Array<string &#124 number></code> |
| `toggleNodeExpanded`  | 切换一个节点的 `expanded` 状态                                                                                        | <code>(key: string &#124 number) => void</code>                         |
| `updateNodesExpanded` | 批量更新节点的 `expanded` 状态                                                                                        | `({ [identifier]: boolean }) => void`                                   |
