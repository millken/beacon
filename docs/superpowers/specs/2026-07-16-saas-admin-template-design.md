# SaaS Admin 起步模板 + Design Token 优化 — 设计规范

- 日期：2026-07-16
- 状态：已批准，待实现
- 范围：新增一个 SaaS Admin 起步模板；构建过程中对 `colors_and_type.css` 做一次**全量审计 + 修复**（既补缺口，也纠已有异味）。

---

## 1. 背景与目标

Beacon 是桌面级工业设计系统（Semi 结构 × Beacon 色盘）：高密度、硬边（半径上限 6px）、低彩中性基底、mono 优先、暗色优先。当前仅有一个起步模板 `starting-points/Desktop App — Render Farm.html`（浮窗式桌面外壳）。

本任务新增 **SaaS Admin 控制台** 起步模板。它与桌面工具的关键差异——**满视口浏览器应用**（无浮窗外框）、以卡片网格 + 图表为主的信息架构——会从一个新方向压测 token 体系，这正是暴露 token 缺口的地方。因此本任务是「模板」与「token 优化」两件事的合并：

- **主目标**：交付一个可复用、纯 Beacon 调性的 SaaS Admin 起步模板。
- **并行目标**：借构建过程发现并优化 design token 的真实问题（缺口 + 异味），保持机器可校验 gate = 0。

### 决策记录（brainstorm 结论）

| 维度 | 决策 |
|---|---|
| 模板类型 | 组合式多视图 admin 外壳（Dashboard + Members 管理表 + Billing/设置） |
| 美学取向 | **纯 Beacon**（暗色优先、高密度、硬边、mono；token 工作只补真实缺口，不软化身份） |
| Token 范围 | Token 层为主 + 修既有异味；新模式**页面内局部组合**，不提升为组件 |
| 修复力度 | **全量审计 + 重构**（补缺口 + 纠正 text-3、card 抬升，并扫查其余不一致） |

---

## 2. 交付物

### 2.1 模板文件

`starting-points/SaaS Admin — Console.html`，单文件、自包含，严格沿用 Render Farm 的约定：

- 首行 `<!-- @startingPoint section="…" subtitle="…" viewport="…" -->` 注释，使其登记进起步模板索引。
- `<link rel="stylesheet" href="../styles.css" />`，只消费 token + 组件，页面专属组合写在本地 `<style>` 块。
- `data-theme="dark"` 默认，含 light/dark segmented 切换（复用 Render Farm 同款 `#themeSeg` 交互）。
- **与 Render Farm 的关键区别**：不套浮窗外框（`.window`）。`.shell` 直接铺满视口——这是一个满视口浏览器应用，也正是它触发「页面 vs 卡片表面」token 缺口的原因。

### 2.2 Token 文件改动

只改 `colors_and_type.css`（token 层）。**不**新增 `components/css/*.css` 组件文件，**不**改聚合器。若审计发现组件层为消费新 token 需微调，须逐一记录并保持 gate = 0。

---

## 3. 模板组合（多视图）

单个 `.shell`：`sidebar` + 顶部 `toolbar` + `.shell-main`。侧栏导航在 main 区切换三个视图，全部在同一文件内，用纯 CSS（`:target` 或极小内联 toggle，无框架）。

### 3.1 Dashboard 视图
- **KPI 行**：复用既有组件 `.stat-card`（indicator.css）+ `.spark`，4 张卡；大数字采用新 `--font-size-3xl`。
- **两张图表**：内联 SVG——① 趋势折线/面积图；② 分类柱状图。着色来自新 `--chart-*` 系列 token。
- **近期活动**：`.table-card` + `.table`。

### 3.2 Members 视图
- 过滤/搜索 `toolbar` + `.search-input`。
- `.table` 管理表：状态 `.tag`、行内动作按钮、分页。
- 行点开 `.drawer`（overlay 组件）看详情，含 `.field` 表单。

### 3.3 Billing 视图
- 套餐/定价卡（页面局部组合，纯 Beacon 卡片）。
- 用量行：`.progress` / `.meter`（indicator 组件）。
- 发票 `.table`。

覆盖组件：table、tag、field、toolbar、sidebar、overlay(drawer)、indicator(meter/progress/led/stat-card)、button、tabs、breadcrumb。

---

## 4. Token 优化明细

以下均**已对照实际文件核实**（行号为 `colors_and_type.css` 快照）。分两轨：新增（additive，零回归风险）与纠正（corrective，需重校验）。

### 4.1 新增 — 补能力缺口

**GAP-1 图表/可视化调色板（头号缺口）。**
现状：唯一 chart-ish token 是单色 sparkline（`indicator.css:48` → `--color-primary-light-active`），无任何分类/多系列色系。
方案（经 dataviz 实测修订）：新增 `--chart-1..6` + `--chart-grid`/`--chart-axis`。**初始设想（复用 accent/success/warning/danger 作前 4 系列）经 dataviz `validate_palette.js` 实测不达标**——状态色 green↔amber、red↔amber 在色盲甚至常色视觉下不可分（违反「状态色保留、不复用为系列」铁律）。经用户确认，改用 dataviz `references/palette.md` 已验证 8 序的前 6 色（blue/green/magenta/yellow/aqua/orange），dark+light 各自步进。
- 语义：这是**独立、固定的已验证分类色，有意与 preset 无关**（校验只对固定值成立）；仅用于图表 mark 内，UI chrome 仍纯 Beacon。`--chart-1` 属 accent 家族但 chroma 更高以过闸，不等同 `--color-accent`。
- 实测（Beacon 卡片表面 dark `#1d2532` / light `#ffffff`）：dark 全 PASS；light 全 PASS，contrast 对 magenta/yellow/aqua 给 WARN → 触发 relief 规则（图表带图例/直接标签 + 活动表兜底），合规。
- 消费纪律：图表 chrome/文字用文本 token，不用系列色写字；≥2 系列必有图例，标识不靠颜色单独承担。

**GAP-2 大号 KPI 数字缺显示级字号。**
现状：最大字号 `--font-size-2xl: 24px`（Hero）；`.stat-card .v` 仅用 `--font-size-xl`(18px)。
方案：新增 `--font-size-3xl`（~30px），供 hero 指标数字使用；不改既有 7 档语义，只在顶部追加一档并更新 README/tokens.html 的字号说明。

**GAP-3 满视口应用的「页面↔卡片」抬升契约。**
现状：`--card: var(--color-bg)`（154 行）。浮窗场景下 window=bg 叠在 page=bg-subtle 上没问题；但满视口时页面本身就是 `bg`，卡片与页面同色，所有 `.stat-card`/`.table-card`/`.list`（均 `background: var(--card)`）只能靠 border 分隔。
方案：新增表面语义角色 `--surface-page` / `--surface-raised`，让卡片能在两种框架下都比其页面高一阶。见 4.2 SMELL-3 的联动改动。

### 4.2 纠正 — 全量审计修复

**SMELL-1 井/内凹阴影不随主题适配（真实 bug）。**
现状：`--shadow-inset` / `--shadow-well` / `--track-bg`（31–33 行）**只在 `:root`(dark) 声明**，硬编码 `rgba(0,0,0,0.4/0.5)`，light 块（263–291）**未覆盖**。消费者 `.progress` / `.meter` 用 `--track-bg`+`--shadow-well`，`.field` 用 `--shadow-inset`——light 主题下得到刺眼近黑内阴影。
方案：在 `[data-theme="light"]` 块补写这三个变量的浅色取值（低 alpha，色相偏蓝灰以贴合 light 的 shadow 体系）。

**SMELL-2 `--color-text-3` 打断文本梯度。**
现状：text-0/1/2 是递减显著度阶梯，而 `--color-text-3: var(--color-text-inverse)`（229 行）跳到「反相/色上文字」这条**另一个轴**，导致没有「比 dim 更弱」的 disabled/placeholder 文本档。
方案：将 `--color-text-3` 重指向真正的 faint/disabled 档（比 `--color-text-dim` 更弱的一步，明暗各给值）；为原「色上文字」用途保留显式别名（继续用 `--color-text-inverse` 本名，不再借 text-3 承担）。核查现有 text-3 消费者（当前组件层用的是 `--color-text-inverse` 本名，非 text-3，回归面小）。

**SMELL-3 卡片在满视口下不抬升（联动 GAP-3）。**
方案：让 `--card` 由 `--surface-raised` 派生，使卡片在浮窗与满视口两种框架下都比页面高一阶，同时不改变桌面浮窗观感（浮窗内 raised 与 bg 差值可调到极小或相等）。改动后须回归 `.stat-card`/`.table-card`/`.list`/`.alert` 四类消费者。

**SMELL-4 审计扫查项（逐一「修复」或「明确记为有意」）。**
- `--color-info: var(--color-accent)`（202 行）：单 accent 下 info 与 primary 同蓝，info 语义无差异。决策：默认记为**有意**（单 accent 体系），但评估是否给 info 一个可区分的浅底 `--color-info-light-default` 已足够；结论写入规范与注释。
- `--font-size-xs`(12px) 与 `--font-size-sm`(12px) 同值（61–62 行）：语义不同、值相同。决策：默认记为**有意语义别名**，在注释中显式说明「同值不同义，勿合并」。
- `--radius-lg` vs `--radius-md`（27–28 行，仅差 1px）：核查是否真被区分消费；若无差异则记为有意冗余或收敛。
- leading / 状态档缺口：核查是否缺 `--leading-loose` 或其它模板会用到的档；缺则补，不缺不动。

> 审计原则：每一项要么改，要么在 token 文件注释里写明「有意保留 + 原因」，不留悬而未决。

---

## 5. 验证与验收（非协商项）

按顺序执行，每步须有证据：

1. **机器校验**：每次改 `colors_and_type.css` 后跑 `bash tools/check-tokens.sh`，必须 **0 error**（R1/R2/R3 硬错误、R4 警告数不增）。
2. **组件回归**：在浏览器打开现有 23 个组件 demo 页 + `Desktop App — Render Farm.html`，**light 与 dark 两态**逐一确认无视觉回归（重点：input 井、progress/meter 槽、卡片、文本层级）。
3. **新模板验收**：`SaaS Admin — Console.html` 在 light 与 dark 两态均正确渲染；三视图切换正常；图表系列色在两态均可区分（对照 dataviz 校验）。
4. **文档同步**：README.md 的 Index 与 Token 分层说明、`tokens.html` 的相关分区、起步模板清单，随新 token 与新模板更新。

### 验收标准（Definition of Done）
- [ ] `starting-points/SaaS Admin — Console.html` 存在、自包含、满视口、三视图、明暗可切。
- [ ] 新 token（chart-*、font-size-3xl、surface-*、text-3 重指、light 井阴影）全部落地。
- [ ] SMELL-4 每项均已「修复」或「注释记为有意」。
- [ ] `check-tokens.sh` = 0 error。
- [ ] 23 组件页 + Render Farm 明暗两态无回归。
- [ ] README / tokens.html / 起步模板清单已同步。

---

## 6. 非目标（Out of Scope）

- 不新增组件 CSS 文件、不改组件聚合器（新模式一律页面局部组合）。
- 不引入「舒适」密度层或 light-first 变体（保持纯 Beacon）。
- 不引入 JS 图表库（图表用内联 SVG / CSS）。
- 不做与本模板无关的重构。
