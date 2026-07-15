# 工业级桌面 GUI — 设计系统约定

扁平、锐利、密集。1px 边框，2–6px 圆角，等宽字体提示。主色 `--primary`（蓝）是**强调色**，用得克制。

## 强调色（accent / --primary）使用铁律

> **只有当元素自身的 selected / checked / active / current 状态本来就是 accent 时，hover / press 上才允许出现 accent —— 此时 accent 是在“预览该元素自己的值”。
> 如果元素没有 accent 终态，则 hover / press 绝不能变 accent，必须用中性色。**

- ✅ 合法的 accent：focus ring、checkbox/radio/switch 选中、选中行/单元格/树节点、active 导航、分页/filter-chip 选中、today、列表高亮（menu / combobox / cmdp —— 统一的 listbox 约定）、语义 tag/badge/status/avatar。
- ❌ 曾经的 bug（均已修复，勿重犯）：outline button hover 边框变蓝、ghost button（尤其作 dialog 关闭图标）press 出现硬边框、accordion 标题 hover 变蓝、split-handle 拖动时整条变蓝、列宽 resize-handle hover 变蓝、codeblock copy 按钮 hover 变蓝、color swatch hover 边框变蓝。

## 中性 hover / press 约定

- 文字触发器（accordion / tab / 面包屑 / copy 等）hover → `--color-text`，可加 `--color-bg-hover` 底色，**不要**变 accent。
- 边框 hover 加强 → `--color-border-strong`（input / select / page-cell / icon-btn / swatch / resize-handle 统一用它）。
- 无静止边框的控件（ghost、toggle-group、tab、工具栏/表格 icon-btn）press 时**不得**凭空长出边框或 inset 凹陷阴影 —— 通过 `--btn-border-active` / `--btn-active-shadow` 设为 transparent/none 退出。
- 被动结构元素（分隔条、resize handle）拖动/press 时只做中性加深（`--color-bg-active` + `--color-border-strong`），靠 grip 点提亮表达“正在操作”。

## 按钮 token（styles.css）

`.btn` 用三层 token：`--btn-bg/-hover/-active`、`--btn-border/-border-hover/-border-active`、`--btn-shadow/--btn-active-shadow`。改某变体的状态色时改 token，别在状态规则里写死颜色。
