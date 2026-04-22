# UX 文档

## 主题设计

主题配色对齐飞书官方小组件，支持随系统深浅色自动切换（`prefers-color-scheme`）。

### 实现方式

- 使用 CSS 自定义属性（变量）定义颜色，在 `src/index.css` 的 `:root` 中声明。
- 深色主题通过 `@media (prefers-color-scheme: dark)` 覆盖同名变量。
- 组件与页面通过 `var(--color-*)` 引用，无需手写两套样式。

### 颜色变量

变量在 `src/index.css` 中按语义分组排序：**背景 → 文字 → 边框 → 主色 → 组件 → 图标**。具体取值见该文件。

| 变量名                        | 用途                   |
| ----------------------------- | ---------------------- |
| `--color-bg`                  | 主背景、默认按钮背景   |
| `--color-bg-secondary`        | 卡片、区块等次级背景   |
| `--color-bg-hover`            | 悬停背景               |
| `--color-text`                | 主文字、标题           |
| `--color-text-secondary`      | 次要/说明文字          |
| `--color-text-on-primary`     | 主按钮上的文字（反色） |
| `--color-border`              | 边框、分割线           |
| `--color-primary`             | 主色、主按钮、强调     |
| `--color-primary-hover`       | 主色悬停               |
| `--color-button-secondary-bg` | 次要按钮背景           |
| `--color-icon`                | 图标默认色             |
| `--color-icon-outline`        | 图标描边/辅助色        |

### 使用示例

```css
.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.caption {
  color: var(--color-text-secondary);
}
```
