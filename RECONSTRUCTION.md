# RECONSTRUCTION — Beacon 设计令牌体系还原说明

本目录的 Beacon design token 设计体系由两处素材还原而成。此文件记录**每个文件的来源、版本取舍、以及还原过程中做的调整**，以便追溯。

## 两处素材

| 素材 | 性质 | 提供了什么 |
|---|---|---|
| `codeberg.org/millken/zi/docs/design/` | 最终产出的源文件 | `colors_and_type.css`、`presets.js`、`styles.css`、`components/`（**最新、事实来源**）|
| `data-…-batch-0000/design_chats/*.json` | 导出的 Claude Agent 构建会话（16 个，含 `write_file` / `str_replace_edit` / `read_file` 工具调用）| 规范文档 `README.md`、`SKILL.md`、`tokens.html`、`theme-switch.js`——这些在 `zi/docs/design/` 中缺失 |

`zi/docs/design/` 只有令牌与组件的 CSS/JS，没有说明性文档；文档层通过**按时间戳回放会话中的文件写入 / 编辑操作**重建了最终态。

## 每个文件的来源与取舍

| 文件 | 来源 | 说明 |
|---|---|---|
| `colors_and_type.css` | zi（原样） | 规范化的 Beacon 令牌表，含 Semi 式功能色矩阵。比会话回放版更新（多出 `--control-selected-ring`、更细调的 `--btn-active-shadow`），故取 zi 版 |
| `presets.js` | zi（原样） | 14 套 preset + `applyPreset`。zi 版 35KB，比会话回放版（31KB）新 |
| `styles.css` | zi（原样） | 组件样式表，仅引用最终 `--color-*` 裸名令牌 |
| `components/` | zi（原样） | 18 个组件演示 HTML + `components.css`（0 处 `--zi-` 残留，确认为最终态）|
| `tokens.html` | 会话回放 | 可视化 Token 规范页，最终态：用 `--color-*` / `--radius-*` 裸名，`<link>` 到 `colors_and_type.css`、引用 `presets.js`。与 zi 令牌一致 |
| `README.md` | 会话回放 + 修订 | 基于回放出的最终 README，**修订了 Index 表**以匹配本目录实际内容（补 `theme-switch.js` / `RECONSTRUCTION.md`；移除未还原的 `preview/`、`screenshots/`）|
| `SKILL.md` | 会话回放（原样） | Agent Skill 描述符 `gui-tokens-semi-beacon` |
| `theme-switch.js` | 会话回放 + **令牌名移植** | 回放出的版本用的是**迁移前的旧令牌名**（`--bg-surface` / `--r-md` / `--accent` / `--mono-stack` 等），无法解析于最终令牌表。已逐一移植到最终名（`--color-bg-surface` / `--radius-md` / `--color-accent` / `--font-family-mono` …），并校验全部 15 个引用均存在于 `colors_and_type.css`。逻辑未改 |

## 体系的两次演进（还原中观察到）

1. **`zi` + `--zi-` 前缀时期**：早期 token 均带 `--zi-` 命名空间前缀（会话中可见其 normative 规范）。此阶段已被取代，未纳入还原。
2. **`Beacon` 重命名 + 去前缀 + Semi 功能色层**（最终态，本目录采用）：token 改用裸名（`--color-bg`），新增借鉴 Semi 的功能色交互态矩阵（`--color-primary-*`、`-light-*` 等），以 `color-mix` 从基础色派生。这是 `colors_and_type.css` / `presets.js` / `tokens.html` / `README.md` 所体现的现行体系。

## 已知不一致（原样保留，未"修复"）

- `colors_and_type.css` 的 `:root`（Beacon dark 默认）与 `presets.js` 的 `beacon.dark` 条目色值略有出入，例如 accent `#6aa1ef`（CSS，注为"软化后的蓝"）vs `#4d9bff`（presets.js），文本 `#dde4ee` vs `#e3e9f1`。这是两个产物自然漂移的结果：CSS 表内嵌一版更细调的默认，`presets.js` 是运行时 `applyPreset` 的事实来源。还原以忠实为准，两者均保留原值。

## 未还原项

- `preview/`（Design System 标签页的小预览卡）与 `screenshots/`（验证截图）：会话中存在但为次要资源 / 二进制截图，未纳入本次还原。
