# AGENTS.md

本文件供 **AI 编码助手** 与 **人类协作者** 使用；与各包 `README.md` 互补。更通用的 `AGENTS.md` 约定见 [agents.md](https://agents.md/)。若子目录另有 `AGENTS.md`，以**更靠近被改文件**的那份为准。

## 仓库结构

pnpm workspace，根包 **`@lark-extension/workspace`**。

| 包名                       | 目录             | 说明                     |
| -------------------------- | ---------------- | ------------------------ |
| `@lark-extension/starter`  | `apps/starter/`  | 飞书文档离线小组件模板   |
| `@lark-extension/markdown` | `apps/markdown/` | 云文档转 Markdown 小组件 |
| （预留）                   | `packages/*`     | 暂无子包时可忽略         |

子包内的路径说明若无特别注明，均相对于**该包根目录**。

## 命令（在仓库根执行）

| 脚本                                | 作用                                                            |
| ----------------------------------- | --------------------------------------------------------------- |
| `pnpm install`                      | 安装依赖                                                        |
| `pnpm format` / `pnpm format:check` | 全仓库 oxfmt 写入 / 仅检查（根 `.oxfmtrc.json`）                |
| `pnpm build`                        | 对所有含 `build` 脚本的 workspace 包执行 `vite build`           |
| `pnpm test`                         | 对各含 `test` 脚本的包执行 `tsc -b`（类型检查，**非**单测框架） |
| `pnpm verify`                       | 依次：`format:check` → `build` → `test`，适合提交或 CI          |

**单包执行**：在根目录用 `pnpm --filter "<包名>" run <脚本>`。包名须加引号，避免 zsh 等把 `@` 当成特殊字符。常用脚本：`start`、`build`、`preview`、`upload`（`upload` 会先 build 再调 `opdev`）。

## 环境与密钥

从各包下的 `.env.example` 复制为 `.env`，填写 `APP_ID`、`BLOCK_TYPE_ID`、`PROJECT_NAME` 等。勿提交 `.env` 或真实密钥；说明链接见各包 `.env.example` 注释。

## 代码约定（starter / markdown 及同栈扩展）

技术栈：**Vite + Solid + `@lark-opdev/block-docs-addon-api`**。

- **命名**：源码文件与目录优先 **kebab-case**。
- **组件**：功能块放在 `components/<功能名>/`，配 **`*.module.css`** 与按需的 `index.ts` 导出；组织方式与 **`@lark-extension/starter`** 保持一致，避免同一包内混用多种样式/目录习惯。
- **主题色**：用各包 `src/index.css` 里 `:root` 的 **`var(--color-*)`**，勿硬编码与主题冲突的色值。
- **Blockit**：只通过 **`src/lib/blockit-api.ts`** 的 **`getBlockitApi()`** 及该文件内已有封装访问平台；禁止在业务里 `new BlockitClient()` 或重复造入口。
- **格式化**：只用根目录 **oxfmt**；子包不单独加 Prettier/oxfmt 作为仓库级入口。
- **改动验收**：对应包能 `vite build`（或根目录带 `--filter` 的 `build`）；合并前建议跑 `pnpm verify`。

## 安全

勿在代码、日志、issue 中粘贴真实 `APP_ID`、token、内网地址。新增敏感文件或产物路径时，同步 `.gitignore`。
