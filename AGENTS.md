# AGENTS.md

本文件面向 AI 编码助手与协作者，提供仓库内的执行规范、命令入口与约束。  
通用规范参考 [AGENTS.md](https://agents.md/)；若子目录存在更近的 `AGENTS.md`，以更近文件为准。

## Project Overview

- Monorepo：`pnpm workspace`，根包为 `@lark-extension/workspace`
- 技术栈：`Vite + Solid + TypeScript + @lark-opdev/block-docs-addon-api`
- 当前应用：
  - `@lark-extension/starter` -> `apps/starter/`
  - `@lark-extension/markdown` -> `apps/markdown/`
- 预留扩展目录：`packages/*`

## Setup Commands

以下命令默认在仓库根目录执行：

- 安装依赖：`pnpm install`
- 格式化：`pnpm format`
- 检查格式：`pnpm format:check`
- 构建所有包：`pnpm build`
- 类型检查（仓库 `test`）：`pnpm test`
- CI 对齐检查：`pnpm verify`（`format:check -> build -> test`）

单包执行统一使用：

- `pnpm --filter "<包名>" run <script>`
- 常用脚本：`start`、`build`、`preview`、`upload`
- 注意：包名需加引号，避免 zsh 将 `@` 作为特殊字符处理

## Testing Instructions

- 本仓库 `test` 为 TypeScript 构建检查（`tsc -b`），不是单测框架
- 提交前至少保证受影响包可构建
- 合并前建议执行完整校验：`pnpm verify`
- 若改动涉及 workspace/路径/依赖，优先执行全仓校验而不是仅单包校验

## Code Style

- 文件与目录命名优先使用 `kebab-case`
- 组件组织：`components/<feature>/`，配套 `*.module.css` 与按需 `index.ts` 导出
- 主题色来自各包 `src/index.css` 的 `:root` 变量（`var(--color-*)`）
- 平台 API 访问统一通过 `src/lib/blockit-api.ts` 的 `getBlockitApi()` 封装
- 仓库级格式化工具仅使用根目录 `oxfmt`；不要新增并行格式化入口

## Environment & Secrets

- 从各包 `.env.example` 复制为本地 `.env` 后填写配置（如 `APP_ID`、`BLOCK_TYPE_ID`、`PROJECT_NAME`）
- 禁止提交任何真实密钥、token、内网地址或敏感配置
- 若新增敏感文件或产物路径，需同步更新 `.gitignore`

## PR & Commit Guidelines

- 提交信息建议遵循 Conventional Commits（如 `chore(...)`、`refactor(...)`、`fix(...)`）
- 一次提交聚焦一个主题，避免混入无关改动
- PR 描述至少包含：变更摘要、验证方式、风险/回滚点（如有）

## Agent Working Rules

- 先读上下文再改代码，优先遵循现有模式，避免无关重构
- 涉及结构性调整时，同步更新文档与配置（如 workspace、CI、格式化忽略路径）
- 回答与提交说明保持简洁、可执行、可验证
