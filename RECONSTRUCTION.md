# RECONSTRUCTION — Beacon 设计令牌体系还原说明

本仓库由两处素材还原：`codeberg.org/millken/zi/docs/design/`（本地文件快照）与 `data-…-batch-0000/design_chats/`（16 个导出的 Claude Agent 构建会话）。还原方法：**按时间戳回放会话中的 write_file / str_replace_edit / copy_files / delete_file 工具调用**，以 zi 快照做种子，用会话中 read_file 头部的「行数/字符数」做验收锚点。

## 两个工作区（会话聚类还原出的谱系）

导出会话跨 5月24日–6月23日，实际分属多个 Agent 工作区（用各会话的 `list_files()` 输出聚类确认）：

| 工作区 | 会话 | 产出 |
|---|---|---|
| **A · zi 工业桌面**（5月24日–6月7日）| `9411ae02, 8032b755, 846f32c1, 3ea020f8, 2570821e, 2cf094c9` | 单体 `styles.css`（3189 行）、`presets.js`（14 preset）、`design-system.html` 总览、5 个桌面 demo、`theme-switch.js`、`tokens.md`；6月7日新增移动端体系（`mobile-*`）与 compressor-mall 商城 demo |
| **B · Beacon Design System**（6月3日–6月7日）| `da796028, 1938f4b6, 175c495d, fc7b2a96, e32ee111, b4b0e54b` | 空目录起步、上传 A 的产物做种子；产出 `colors_and_type.css`、`tokens.html`、`components/`（18 组件 + `components.css`）、README/SKILL、`starting-points/`；6月6日把上传的单体 styles.css **替换为 837B 纯 @import 入口表**（token→组件→用法 三级装配）|
| 其他 | `3395cc4c`（Edge VPN 品牌）、`f4fd7b3f` / `ce040149`（Beacon Chat Mobile 应用）、`34bf2451`（盘语）| 独立产品项目（B 被打包为 Skill 后的下游使用者），不属于设计系统本体，未纳入 |

**仓库布局映射**：根目录 = 工作区 B 最终态（现行 Beacon 体系）；`showcase/` = 工作区 A 最终态（前代系统 + 项目展示，被 B 的 README 称为「团队现行 Beacon」的色值事实来源）。

## zi 快照的时点鉴定（用作回放种子）

`zi/docs/design/` 是一个**混合时点快照**，各文件行数与会话中 read_file 头部逐一对齐后确认：

| zi 文件 | 对齐时点 | 用法 |
|---|---|---|
| `styles.css`（3171 行）| 工作区 A · 6月3日 13:28 | 种子 + 回放其后 31 处编辑 → **3189 行，与 6月7日锚点完全一致** |
| `presets.js`（523 行）| 工作区 A · 6月3日 23:12 | 种子；6月3日夜–6月7日间无可回放编辑（见「已知缺失」）|
| `colors_and_type.css`（217 行）| 工作区 B · ≈6月5日 | 种子 + 回放 6月6日 `@kind` 注解编辑 → 与 6月18日锚点（221 行/10891 字符）吻合 |
| `components/`（含 `components.css` 716 行）| 工作区 B · ≈6月5日–6日 | 种子 + 回放 6月6日编辑（components.css → 717 行）|

## 锚点验收结果

| 文件 | 锚点（会话 read_file 头部）| 还原结果 |
|---|---|---|
| `showcase/styles.css` | 3189 行（6月7日）| **3189 行 ✓** |
| `colors_and_type.css` | 221 行 / 10891 字符（6月18日 Skill 副本）| 218 行 / 10578 字符（差 3 行 `@kind` 注解级别）|
| `components/components.css` | 720 行（6月6日 02:19，其后仍有编辑）| 717 行 |
| `showcase/design-system.html` | 2307 行（6月7日）| 2270 行（差 37 行，见下）|
| `showcase/presets.js` | 555 行 / 35898 字符（6月7日）| 524 行（= zi 快照，差 31 行，见下）|
| `showcase/tokens.md` | 365 行 / 13994 字符（6月7日）| 258 行（**部分还原**，见下）|
| `showcase/mobile-*` / `mall*` / `compressor-mall.html` | —（构建于 6月7日会话内，编辑零失败）| 完整 ✓ |

## 已知缺失（导出数据不完整所致，无法还原）

导出为 `batch-0000`（多批次导出的第一批），且其中 read_file 输出多数被截断至 200 字符、少量 write_file 内容被截断。具体缺失：

1. **一个 6月3日夜–6月7日之间的工作区 A 会话不在此批次**。它贡献了：`presets.js` +31 行（35126→35898 字符）、`design-system.html` +37 行、`tokens.md` 后半扩充（320→365 行）。相应文件还原到该会话之前的最后可证状态。
2. **`starting-points/Beacon Demo App.html`**（6月6日构建，约 30+ 次编辑）：初始写入不在此批次，仅存编辑记录，无法重建。
3. **`settings-compare/Settings Dialog — Beacon vs Qt.html`**（6月7日）：同上。
4. **`starting-points/render-farm-app.js` / `render-farm-data.js`**：同上。
5. **`showcase/tokens.md` 为部分还原**（258/365 行）：初始上传件的完整内容不在导出中，中途 11 处编辑因基线缺失未能命中。文中个别段落可能停留在较早措辞。
6. `preview/`、`screenshots/`、`audit/`：预览小卡与验证截图（二进制/次要），未纳入。

## 还原中的修正（非原样之处）

- `starting-points/Desktop App — Render Farm.html`：原会话中「换头」编辑（改为 `@startingPoint` 头 + 引用 `../styles.css`）因复制基线漂移未能精确命中，按该编辑的完整 new_string 以头部置换方式应用——内容即原编辑内容。
- `showcase/theme-switch.js`：会话最终版（6月2日）内部样式仍用迁移前旧变量名（`--bg-surface` / `--r-md` / `--mono-stack` 等），与最终 `presets.js` 挂载的 `--color-*` / `--radius-*` 名不匹配。已逐一移植为最终名，逻辑未改。
