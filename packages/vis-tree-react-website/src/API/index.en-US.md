---
order: 5
group:
  title: API
---

# API

| Name       | Description                                                                   | Type         | Default                             |
| ---------- | ----------------------------------------------------------------------------- | ------------ | ----------------------------------- |
| dataSource | root node of the tree                                                         | `object`     | ---                                 |
| scaleRatio | scaling ratio                                                                 | `number`     | `1`                                 |
| options    | Configurations                                                                | `object`     | Please refer to **Options** chapter |
| className  | `class`. The height of the canvas must be specified by `className` or `style` | `string`     | ---                                 |
| style      | `style`. The height of the canvas must be specified by `className` or `style` | `object`     | ---                                 |
| renderNode | Render custom nodes                                                           | `React.node` | ---                                 |
| renderLine | Render custom connection lines                                                | `React.node` | ---                                 |
