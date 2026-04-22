# 飞书文档离线小组件模板

用于搭建飞书文档离线小组件的**模板项目**：**Vite 7**、**SolidJS**、`vite-plugin-solid` 与 **@lark-opdev/block-docs-addon-api**。内置「实时统计当前文档正文字数」示例，可按需改写业务与 UI。

## 环境变量

复制 `.env.example` 为 `.env`，填写 `APP_ID`、`BLOCK_TYPE_ID`、`PROJECT_NAME` 等。

## 脚本

| 命令               | 说明                                                      |
| ------------------ | --------------------------------------------------------- |
| `pnpm install`     | 安装依赖                                                  |
| `pnpm run start`   | 本地开发（端口 5173，development 下 `base` 为 `/block/`） |
| `pnpm run build`   | 生产构建 → `dist/`                                        |
| `pnpm run preview` | 预览构建结果                                              |
| `pnpm run upload`  | `build` 后 `opdev upload ./dist`                          |
