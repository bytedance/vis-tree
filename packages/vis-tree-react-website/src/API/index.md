---
order: 5
group:
  title: 接口
---

# 接口

| 名称       | 描述                                                  | 类型         | 默认值               |
| ---------- | ----------------------------------------------------- | ------------ | -------------------- |
| dataSource | 树的根节点                                            | `object`     | ---                  |
| scaleRatio | 缩放比例                                              | `number`     | `1`                  |
| options    | 配置项                                                | `object`     | 请参考**配置项**章节 |
| className  | `class`。必须通过 `className` 或 `style` 指定画布的高 | `string`     | ---                  |
| style      | `style`。必须通过 `className` 或 `style` 指定画布的高 | `object`     | ---                  |
| renderNode | 渲染自定义节点                                        | `React.node` | ---                  |
| renderLine | 渲染自定义连接线                                      | `React.node` | ---                  |
