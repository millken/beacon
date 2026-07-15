# Beacon 组件 Token 设计规范 v2 — 设计文档

> 2026-07-15 · 已与用户逐节确认。目标：以 `showcase/design-system.html` 的组件集为准，
> 优化重构一套 components/ 组件 token 体系（规范 + 全量实现），作为后续唯一采用的新体系。

## 0. 目标与决策记录

| 决策点 | 结论 |
|---|---|
| 交付范围 | 规范文档 + token 层 CSS + **全量重构** components/ 实现 + 演示页同步重写 |
| 命名空间 | **裸名**（`--btn-bg`），与现行 `--color-*` 体系一致，不引入前缀 |
| 覆盖面 | **对齐 design-system.html 全部 22 个组件分区**，补齐 colorpicker / sidebar / shell 缺口 |
| 兼容性 | class API **可破坏**，18 个演示页 + starting-points 模板同步重写 |
| 架构 | **两级契约**（方案 C）：共享控件解剖层 + 分化点组件 token |
| 文件组织 | components.css 拆分为 `components/css/*.css`，聚合器纯 @import |

不做（YAGNI）：不引入构建工具/预处理器；不动 Tier 1/2（色盘、角色层、功能色矩阵）；不改 showcase/（历史展示系统只读）。

## 1. 分层架构

```
Tier 1  原始层    色盘阶梯/刻度                colors_and_type.css §6      （不动）
Tier 2  语义层    角色 §5 + 功能色矩阵 §5.5     colors_and_type.css         （不动）
Tier 3a 控件解剖层 全控件共享解剖 token          colors_and_type.css §2/§4   （扩充）
Tier 3b 组件层    每组件分化点 token            components/css/<组件>.css
```

单向依赖：3b → 3a → 2 → 1。换肤改 Tier-2 阶梯；调全站控件密度/手感改 Tier-3a；按组件定制走 Tier-3b 结构旋钮。

## 2. 命名语法

```
--<组件>-<部位?>-<属性>[-<状态>]
```

- 属性词汇表（封闭集）：`bg` `fg` `border` `radius` `shadow` `h` `w` `pad-x` `pad-y` `pad` `gap` `indent` `size`
- 状态永远最后：`-hover` `-active` `-selected` `-disabled`；部位在属性前：`--dialog-head-pad-y`、`--table-row-h`
- 禁止新造缩写段；组件段用全词（工业标准缩写豁免：`kbd` `led`）

## 3. Tier-3b 两种写法（各司其职，不得混用）

### 3.1 内部接线（variant API）

在组件**根选择器**声明默认值并接线到语义层；变体只改写 token，不重复属性规则。不是皮肤 API。

```css
.btn { --btn-bg: var(--secondary); background: var(--btn-bg); }
.btn--primary { --btn-bg: var(--color-primary); }
```

### 3.2 结构旋钮（skin API）

默认值**统一注册在 colors_and_type.css §4**（`:root`，受治理、可发现）；组件 CSS 中**只允许引用位** `var(--旋钮)`，**绝不在组件选择器声明**（局部声明会屏蔽皮肤的 `:root` 覆盖）。不写 fallback——§4 是单一事实来源。

```css
/* colors_and_type.css §4 */   :root { --table-row-h: 32px; }
/* components/css/table.css */ .table td { height: var(--table-row-h); }
/* 皮肤全局覆盖 */              :root { --table-row-h: 26px; }
/* 容器局部覆盖 */              <div style="--table-row-h: 26px">…</div>
```

## 4. Tier-3a 共享控件解剖层（colors_and_type.css）

| 组 | token | 值/映射 | 状态 |
|---|---|---|---|
| 高度 | `--control-h-sm / -md / -lg` | 24 / 28 / 34px | 已有 |
| 内边距 | `--control-pad-y/-x`（+ `-sm` `-lg` 档）| 5/13 · 3/9 · 7/16 | 已有 |
| 输入内边距 | `--input-pad-y/-x` | 4 / 8px | 已有 |
| 形状 | `--control-radius` | `var(--radius-sm)` | **新增** |
| 描边 | `--control-border-w` | 1px | **新增**（收编 `--btn-border-width`）|
| 焦点 | `--focus-ring` | 皮肤提供 | 已有 |
| 井/凹槽 | `--shadow-inset` `--shadow-well` `--track-bg` `--color-input-bg` | — | 已有 |
| 选中环 | `--control-selected-ring` | — | 已有 |

所有"控件类"组件（button / field / select / combobox / segmented / stepper…）的高度、边距、圆角、描边一律经由本层，禁止各自写死。

## 5. 引用铁律（机器可校验，tools/check-tokens.sh 落地）

1. 组件 CSS **禁止十六进制 / rgb() 字面量**（`transparent` / `currentColor` 除外）
2. 组件 CSS 只允许引用：自身组件 token、§4 注册的结构旋钮（全局 API，跨组件可引用——如 shell 网格引用 `--titlebar-h`）、Tier-3a、Tier-2（角色 / 功能色矩阵 / 阶梯）——**禁止引用其他组件的接线 token**（接线 token 是组件私有的）
3. §4 注册的结构旋钮**不得**出现在任何组件选择器声明位（只允许引用位）
4. 使用表面角色必须配对其 `-foreground`（延续现行铁律）

## 6. 组件族清单（22 分区 → 24 个组件文件）

| design-system 分区 | 文件 `components/css/` | 组件族（class API）| 现状 |
|---|---|---|---|
| buttons | `button.css` | `.btn`（`--primary/--soft/--danger/--ghost/--outline/--icon/--sm/--lg` + loading）`.icon-btn` | 重构 |
| forms | `field.css` | `.field .input .input--flat .num-input .search-input .token-input .select .dropzone` | 重构 |
| selection | `selection.css` | `.checkbox .radio .switch .segmented .choice .slider .rating .stepper` | 重构+改名 |
| combobox | `combobox.css` | `.combobox .listbox` | 补齐 |
| tags | `tag.css` | `.tag .chip .badge .pill .kbd` | 重构 |
| toolbar | `toolbar.css` | `.toolbar .toolbar-sep` | 重构 |
| tabs | `tabs.css` | `.tabs-list .tab .tab-panel` | 重构 |
| breadcrumb | `breadcrumb.css` | `.breadcrumb .pagination` | 重构 |
| tree | `tree.css` | `.tree .tree-row .tree-children` | 重构 |
| table | `table.css` | `.table`（标准表：`--zebra --compact`、cap/foot/card）`.datagrid`（工具栏/滚动区/状态栏/分页）| 重构+改名 |
| splitter | `splitter.css` | `.splitter .splitter--v .splitter-pane .splitter-handle .pane-header` | 重构+改名 |
| overlay | `overlay.css` | `.modal-overlay .dialog-stage .dialog-surface .dialog-head/-body/-desc/-actions/-icon/-x .drawer .popover .tooltip` | 重构 |
| （overlay 附属）| `menu.css` | `.menu .menu-item .menu-item--danger .menu-label .menu-sep`（被 combobox / cmdp 复用）| 重构 |
| cmdp | `cmdp.css` | `.cmdp .cmdp-input .cmdp-list .cmdp-item .cmdp-group` | 重构+改名 |
| colorpicker | `colorpicker.css` | `.colorpicker .swatches .swatch` | **新建** |
| datepicker | `datepicker.css` | `.calendar .cal-head .cal-nav .cal-grid` | 重构 |
| indicator | `indicator.css` | `.led .meter .gauge .ring .spinner .progress .stat-card` | 重构 |
| feedback | `feedback.css` | `.alert .note-banner .toast .toast-stack .timeline .skeleton` | 重构 |
| code | `code.css` | `.codeblock .kv` | 重构 |
| empty | `empty.css` | `.empty` | 重构 |
| window | `window.css` | `.titlebar .titlebar-traffic/-title/-meta .win-controls .win-btn` | 补齐 |
| sidebarmenu | `sidebar.css` | `.sidebar .sidebar-head/-brand/-body/-foot .sidebar-group .sidebar-item（-ico/-label/-badge）.sidebar-section-label .sidebar-collapse` | **新建** |
| shell | `shell.css` | `.shell`（titlebar+toolbar+sidebar+main+statusbar 布局网格）`.statusbar` | **新建** |
| （现库已有，保留）| `misc.css` | `.avatar .avatar-stack .divider .collapsible .accordion（acc-*→全词）.list .list-item` | 重构 |

归属澄清：`.listbox` → combobox.css；`.kv` → code.css。

视觉基准：与 `showcase/design-system.html` 同名组件形态一致（硬边、内凹井、LED 圆点、grip 纹理、6px 分割把手等）。

## 7. 每组件 token 契约

通用规则：**接线 token** 只列组件确有变体分化的；**结构旋钮**只列有真实定制场景的（宁缺毋滥，可后补——加旋钮是非破坏演进）。下表为全量契约；实现时不得私自扩充命名。

### button.css
- 接线：`--btn-bg` `--btn-fg` `--btn-border` `--btn-bg-hover` `--btn-border-hover` `--btn-bg-active`
- 旋钮：`--btn-shadow: none` · `--btn-active-shadow: inset 0 1px 2px 0 rgba(0,0,0,0.15)` · `--btn-radius: var(--control-radius)`

### field.css
- 接线：`--field-bg`（input 默认 `var(--color-input-bg)`，flat 变体改 `transparent`）`--field-border`
- 旋钮：`--field-radius: var(--control-radius)` · `--field-shadow: var(--shadow-inset)`

### selection.css
- 接线：`--selection-checked-bg`（默认 `var(--color-primary)`）
- 旋钮：`--switch-w: 34px` · `--switch-h: 18px` · `--slider-track-h: 4px` · `--segmented-gap: 2px`

### combobox.css / menu.css / cmdp.css（弹出选择族，共享 menu 解剖）
- 接线：`--menu-item-fg`（danger 变体改写）
- 旋钮：`--menu-item-h: 26px` · `--menu-pad: 4px` · `--menu-min-w: 160px` · `--cmdp-w: 560px` · `--cmdp-list-h: 280px`

### tag.css
- 接线：`--tag-bg` `--tag-fg` `--tag-border`（primary/danger/accent 变体改写；badge/pill 同构复用）
- 旋钮：`--tag-radius: var(--control-radius)`

### toolbar.css
- 旋钮：`--toolbar-h: 36px` · `--toolbar-gap: var(--space-2)` · `--toolbar-bg: var(--color-bg-subtle)`

### tabs.css
- 接线：`--tab-fg` `--tab-fg-selected`
- 旋钮：`--tab-h: 32px` · `--tab-indicator-w: 2px`

### breadcrumb.css
- 旋钮：`--breadcrumb-gap: var(--space-2)`

### tree.css
- 旋钮：`--tree-indent: 16px` · `--tree-row-h: 24px`

### table.css（标准表与数据表共用旋钮组）
- 旋钮：`--table-row-h: 32px` · `--table-head-h: 30px` · `--table-cell-pad-x: 10px` · `--table-zebra-bg: var(--color-bg-subtle)` · `--datagrid-toolbar-h: var(--toolbar-h)`

### splitter.css
- 旋钮：`--splitter-handle-size: 6px` · `--splitter-grip-color: var(--color-border-strong)`

### overlay.css
- 接线：`--dialog-icon-color`（primary/warning/danger 变体改写）
- 旋钮：`--dialog-w: 440px` · `--dialog-pad: var(--space-6)` · `--dialog-radius: var(--radius-lg)` · `--drawer-w: 320px` · `--popover-min-w: 200px`

### colorpicker.css
- 旋钮：`--swatch-size: 18px` · `--swatch-gap: var(--space-2)` · `--swatch-radius: var(--radius-sm)`

### datepicker.css
- 旋钮：`--cal-cell-size: 28px`

### indicator.css
- 接线：`--indicator-color`（success/warning/danger/rec 变体改写；led/progress/meter/ring 共用）
- 旋钮：`--led-size: 8px` · `--progress-h: 6px` · `--meter-h: 10px`

### feedback.css
- 接线：`--feedback-accent`（info/success/warning/danger 变体改写；alert/note-banner/toast 共用）
- 旋钮：`--toast-w: 320px`

### code.css
- 旋钮：`--codeblock-pad: var(--space-5)` · `--codeblock-bg: var(--color-bg)`

### empty.css / misc.css
- 旋钮：`--avatar-size-sm/-md/-lg: 20/28/40px`（empty 无旋钮，纯语义层消费）

### window.css
- 旋钮：`--titlebar-h: 38px` · `--win-btn-size: 12px`

### sidebar.css
- 接线：`--sidebar-item-fg`（selected 改写）
- 旋钮：`--sidebar-w: 220px` · `--sidebar-w-collapsed: 48px` · `--sidebar-item-h: 28px`

### shell.css
- 旋钮：`--statusbar-h: 24px`（titlebar/sidebar/toolbar 高宽复用各自组件旋钮——shell 只做网格装配，不新设尺寸）

> §4 注册表 = 上表全部**旋钮**的并集，按组件分组注释。

## 8. 文件装配（三级 @import，与根入口同构）

```
styles.css                    ① 入口（不动：@import ② ③）
 ├─ colors_and_type.css       ② token：Tier 1/2/3a + §4 组件旋钮注册表
 └─ components/components.css ③ 聚合器：纯 @import components/css/*.css（24 文件，零规则）
```

## 9. 类名规范化（全词化）

| 旧 | 新 | | 旧 | 新 |
|---|---|---|---|---|
| `.dt` | `.datagrid` | | `.cb` | `.checkbox` |
| `.tbl` | `.table` | | `.sw` | `.switch` |
| `.cmdk` | `.cmdp` | | `.radio-ring` | `.radio` |
| `.split` | `.splitter` | | `.sb-*` | `.sidebar-*` |
| `.acc-*` | `.accordion-*` | | `.cal-*` | 保留（date 上下文明确）|

BEM-lite 约定不变：`block--modifier`、`block-part`。

## 10. 演示页与校验

**演示页**：现有 18 页按新 class API 重写并对齐 22 分区；新增 4 页：`combobox.html` `colorpicker.html` `sidebar.html` `shell.html`；`index.html` 重建导航（22 分区分组）；`starting-points/Desktop App — Render Farm.html` 同步重写。每页保留 light/dark 切换。

**校验**：
1. `tools/check-tokens.sh`（grep 实现 §5 四条铁律 + §4 注册一致性：组件 CSS 中引用的 `--<组件>-*` 旋钮必须在 §4 注册，反之注册的旋钮必须被引用）
2. 聚合器纯净性：`components.css` 除注释外只含 `@import`
3. 浏览器逐页目检（light + dark 双态），视觉基准 = `showcase/design-system.html`
4. 演示页无死引用（href/src 解析检查）

**验收标准**：check-tokens.sh 零违例；22 分区全部有演示页且双主题正常；**颜色类变体**（`--primary/--soft/--danger/--outline/--ghost` 等）仅通过改写接线 token 实现（变体选择器内不得出现颜色属性规则）；尺寸类变体（`--sm/--lg`）通过 Tier-3a 档位 token 实现。

## 11. 迁移顺序（实现计划的骨架）

1. colors_and_type.css：扩充 Tier-3a + 建立 §4 旋钮注册表
2. 拆分骨架：components/css/ + 聚合器改造 + check-tokens.sh
3. 逐组件重构（按 §6 顺序：先 button/field/selection 等控件族 → 容器族 → 新建族）
4. 演示页重写 + index 重建 + starting-points 重写
5. 全量校验 + README/SKILL.md 中组件层描述同步更新

## 12. 风险与边界

- **旋钮上收 §4 后组件文件不再自包含**：接受——组件层本就声明依赖 token 闭包（styles.css 入口保证）
- **design-system.html 视觉基准使用旧 token 名**：只作视觉参照，不迁移其代码
- **showcase/ 与新体系并存**：showcase 只读封存，README 已标注前代系统
