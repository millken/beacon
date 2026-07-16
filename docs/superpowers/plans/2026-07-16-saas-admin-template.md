# SaaS Admin 起步模板 + Design Token 优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增一个满视口、纯 Beacon 调性的 SaaS Admin 控制台起步模板，并借构建过程对 `colors_and_type.css` 做一次全量 token 审计与优化（补缺口 + 纠异味），全程保持机器校验 gate = 0。

**Architecture:** 先做 token 层（先补/纠 token，让模板有东西可消费），每次改完立刻跑机器 gate 并做明暗双态组件回归；再在 `starting-points/` 下用单个自包含 HTML 文件按三视图（Dashboard / Members / Billing）分任务搭建，只消费 token + 现有组件，新模式一律页面内局部组合。最后同步文档并做整体验收。

**Tech Stack:** 纯 CSS 自定义属性（design token）+ 语义化 HTML + 内联 SVG 图表（无 JS 框架、无图表库）。校验：`tools/check-tokens.sh`（Python3 + bash）。

## Global Constraints

以下为项目级铁律，**每个任务都隐含遵守**，数值逐字取自规范与现有代码：

- **机器 gate**：改 `colors_and_type.css` 后 `bash tools/check-tokens.sh` 必须 **0 error**；R4 警告数不得增加。
- **四条铁律**：R1 组件 CSS 禁颜色字面量（`#hex`/`rgba()`）；R2 禁跨组件引用他组件接线 token；R3 「组件结构旋钮」（COMPONENT 段声明的名字）在组件 CSS 只可出现引用位 `var(--x)`、禁声明位；聚合器 `components/components.css` 纯 `@import` 零规则。
- **纯 Beacon**：暗色优先、高密度、硬边（半径上限 6px，单旋钮 `--radius`）、低彩中性基底、mono 优先；不引入舒适密度层、不引入 light-first 变体、不引入 iOS 式大圆角。
- **范围红线**：只改 `colors_and_type.css`（token 层）+ 新增 `starting-points/SaaS Admin — Console.html` + 文档同步文件。**不**新增 `components/css/*.css`、**不**改组件聚合器、**不**改 `presets.js`。新模式一律页面内局部组合。
- **模板约定**：单文件自包含；首行 `<!-- @startingPoint … -->` 注释；`<link rel="stylesheet" href="../styles.css" />`；`data-theme="dark"` 默认 + light/dark 切换。
- **审计原则**：审计发现的每一项，要么改，要么在 token 文件注释里写明「有意保留 + 原因」，不留悬而未决。

**当前 Beacon 色盘基线**（回归判断用，取自 `colors_and_type.css`）：
- dark：`--color-bg:#11151c` `--color-bg-subtle:#161b24` `--color-bg-surface:#1d2532`；`--color-text-dim:#677387`。
- light：`--color-bg:#fff` `--color-bg-subtle:#edf0f6` `--color-bg-surface:#e1e6ef`；`--color-text-dim:#5e6573`；light shadow 基色 rgb = `28,36,52`（slate）。
- 组件 demo 页与 `tokens.html` 的 `<body>` 背景 = `var(--background)` = `var(--color-bg)`。

**验证词汇表**（本项目「测试」的含义）：
- **机器 gate** = `bash tools/check-tokens.sh`，退出码 0 且 0 error。
- **状态断言** = 用 `grep` 确认 token 文件/模板处于预期文本状态（token 存在/被消费/无非法字面量）。
- **视觉回归** = 在浏览器打开目标页，明暗两态肉眼确认无回归/符合预期（在 subagent-driven 的任务间 review 检查点，由人工 reviewer 执行）。

---

## 文件结构

| 文件 | 职责 | 本计划动作 |
|---|---|---|
| `colors_and_type.css` | 全部 design token（唯一事实来源） | 修改：Task 1–3（surface 抬升 / 校正扫查 / 图表色） |
| `starting-points/SaaS Admin — Console.html` | 新起步模板（自包含，消费 token+组件，页面局部组合） | 新建：Task 4（外壳+Dashboard）→ 5（Members）→ 6（Billing） |
| `README.md` | 目录索引 + Token 分层说明 | 修改：Task 7 |
| `components/index.html` | 组件总览页脚注（起步模板链接） | 修改：Task 7 |
| `tokens.html` | Token 可视化参考页 | 修改：Task 7（新增 token 展示分区，若相关） |

**任务依赖顺序**：Task 1 → 2 → 3（token 层，可独立 review）先行；Task 4 依赖 1–3 的新 token；4 → 5 → 6 同文件顺序追加；Task 7 收尾。

---

## Task 1: Surface 抬升契约（GAP-2 / GAP-3 / SMELL-3）

新增显示级字号与「页面↔卡片」表面语义，并让 `--card` 尊重两种主题各自的分层哲学（dark 靠填充抬升、light 靠内容平面 + 描边/阴影）。

**Files:**
- Modify: `colors_and_type.css`（SHAPE/FONT/ROLES/LADDER 各段 + light 块）

**Interfaces:**
- Produces（供 Task 4–6 与现有组件消费）：
  - `--font-size-3xl: 30px`（hero KPI 数字）
  - `--surface-page`（满视口应用的页面底色；dark=`--color-bg`，light=`--color-bg-subtle`）
  - `--surface-raised`（抬升卡片面；dark=`--color-bg-surface`，light=`--color-bg`）
  - `--card: var(--surface-raised)`（重指向，替换原 `var(--color-bg)`）

- [ ] **Step 1: 状态断言（改前）—— 确认 --card 现为 bg 且无 3xl/surface token**

Run:
```bash
cd /workspace/Codes/github.com/millken/beacon
grep -n "font-size-3xl\|surface-page\|surface-raised" colors_and_type.css; echo "exit=$?"
grep -n -- "--card:" colors_and_type.css
```
Expected：前一条 grep 无输出（token 尚不存在）；后一条显示 `--card: var(--color-bg);`。

- [ ] **Step 2: 追加 `--font-size-3xl`**

在 FONT 段 `--font-size-2xl: 24px;` 行之后新增一行：
```css
  --font-size-3xl: 30px;  /* hero KPI 数字（dashboard 指标）——超出 7 档正文体系的展示级 */
```

- [ ] **Step 3: 在 :root(dark) 定义 surface 语义并重指 --card**

在 ROLES 段，把 `--card: var(--color-bg);`（连同其后的 `--card-foreground`）替换为：
```css
  /* 表面抬升（满视口应用的页面↔卡片契约）——dark 靠填充抬升 */
  --surface-page:   var(--color-bg);          /* 页面底：最深 */
  --surface-raised: var(--color-bg-surface);  /* 抬升卡片：比页面高一阶（与 LADDER 注释「surface=卡片/面板」对齐） */
  --card:                   var(--surface-raised);
  --card-foreground:        var(--color-text);
```

- [ ] **Step 4: 在 [data-theme="light"] 块覆盖 surface（尊重 light 平面模型）**

在 light 块内（例如紧随 `--popover: var(--color-bg);` 之后）新增：
```css
  /* 表面抬升——light 平面模型：卡片留在内容平面(bg)，靠更灰的页面底 + 描边/阴影抬升 */
  --surface-page:   var(--color-bg-subtle);   /* 页面底：灰，令白卡片浮起 */
  --surface-raised: var(--color-bg);           /* 抬升卡片：留在白平面 */
```

- [ ] **Step 5: 机器 gate**

Run: `bash tools/check-tokens.sh`
Expected：末行 `== 0 error(s), N warning(s) ==`，退出码 0。（改的是 token 文件，组件层未动，error 必须为 0；warning 数与改前一致。）

- [ ] **Step 6: 状态断言（改后）**

Run:
```bash
grep -n "font-size-3xl\|surface-page\|surface-raised\|--card:" colors_and_type.css
```
Expected：`--font-size-3xl` 1 处；`--surface-page`/`--surface-raised` 各 2 处（dark + light）；`--card: var(--surface-raised);` 1 处。

- [ ] **Step 7: 视觉回归提示（reviewer 检查点）**

在浏览器明暗两态打开 `components/indicator.html`（含 `.stat-card`）、`components/table.html`（`.table-card`）、`components/misc.html`（`.list`）、`components/feedback.html`（`.alert`）、`starting-points/Desktop App — Render Farm.html`。
预期：**dark** 下卡片由与页面同色变为略抬升（`#11151c`→`#1d2532`，符合 LADDER 注释）；**light** 下卡片外观不变（`--surface-raised` light 仍 = bg = 白）。若 dark 抬升过强，可在注释记录并将 `--surface-raised` 调为 `color-mix(in oklab, var(--color-bg-surface) 60%, var(--color-bg))` 折中——但先按本值验收。

- [ ] **Step 8: Commit**

```bash
git add colors_and_type.css
git commit -m "feat(tokens): surface 抬升契约 + --font-size-3xl（GAP-2/3, SMELL-3）"
```

---

## Task 2: 校正扫查（SMELL-1 / SMELL-2 / SMELL-4）

修复 light 主题井/内凹阴影不适配的真实 bug，纠正 `--color-text-3` 的语义梯度断裂，并对审计扫查项逐一「修复或注释记为有意」。

**Files:**
- Modify: `colors_and_type.css`（SHAPE 段 light 覆盖 + FUNCTIONAL 段 text 梯度 + 若干注释）

**Interfaces:**
- Produces：`--color-text-3` 重指为真正的 faint/disabled 档（供占位符/禁用文本）；light 主题下 `--shadow-inset`/`--shadow-well`/`--track-bg` 有正确浅色取值。

- [ ] **Step 1: 状态断言（改前）**

Run:
```bash
cd /workspace/Codes/github.com/millken/beacon
grep -n "shadow-inset\|shadow-well\|track-bg" colors_and_type.css   # 应只在 :root(SHAPE) 出现，light 块无
grep -n -- "--color-text-3" colors_and_type.css                     # 应为 var(--color-text-inverse)
```
Expected：三个 shadow/track token 仅出现在 `:root` 的 SHAPE 段（31–33 行区），light 块内无；`--color-text-3: var(--color-text-inverse);`。

- [ ] **Step 2: SMELL-1 —— 在 light 块补井/内凹阴影浅色取值**

在 `[data-theme="light"]` 块内新增（沿用 light 既有 shadow 基色 `rgb(28,36,52)`，低 alpha）：
```css
  /* 井/内凹阴影 light 覆盖：暗模式用近黑，浅模式改蓝灰低 alpha，避免刺眼近黑内阴影 */
  --shadow-inset: inset 0 1px 2px rgba(28,36,52,0.06);
  --shadow-well:  inset 0 1px 2px rgba(28,36,52,0.12);
  --track-bg: rgba(28,36,52,0.08);
```

- [ ] **Step 3: SMELL-2 —— 重指 --color-text-3 为 faint/disabled 档**

将 FUNCTIONAL 段：
```css
  --color-text-3: var(--color-text-inverse);/* 反相 */
```
替换为：
```css
  --color-text-3: color-mix(in oklab, var(--color-text-dim) 60%, var(--color-bg)); /* 最弱：占位符/禁用（比 dim 更淡；明暗自动重算） */
  /* 注：色上文字请直接用 --color-text-inverse 本名（原 text-3 借用该值属语义错配，已纠正） */
```
（`color-mix` 引用 `--color-text-dim` 与 `--color-bg`，明暗主题下自动重算，无需在 light 块重复声明。）

- [ ] **Step 4: SMELL-4 —— 审计扫查项逐一定性（注释）**

在对应 token 处追加「有意保留」注释（不改值）：
1. `--color-info: var(--color-accent);` 行后补注释：
```css
  /* 有意：单 accent 体系下 info=primary=accent；info 语气差异由 --color-info-light-default 浅底承担，勿另立 info 主色 */
```
2. `--font-size-xs: 12px;` / `--font-size-sm: 12px;` 两行的注释统一为「同值不同义」提示（保留各自现有语义注释，追加一句）：在 `--font-size-sm` 注释末尾追加 `（与 xs 同值不同义：xs=辅助/状态栏，sm=标签/表头，勿合并）`。
3. `--radius-md` / `--radius-lg` 派生行后补注释：
```css
  /* 有意：md=面板、lg=弹层，差 1px 用于弹层比面板略柔一档；两者均被消费（table/overlay 等） */
```

- [ ] **Step 5: 机器 gate**

Run: `bash tools/check-tokens.sh`
Expected：`== 0 error(s), N warning(s) ==`，退出码 0，warning 数不增。

- [ ] **Step 6: 状态断言（改后）**

Run:
```bash
grep -n "shadow-inset\|shadow-well\|track-bg" colors_and_type.css   # 现应 :root + light 各一组
grep -n -- "--color-text-3" colors_and_type.css                     # 现应为 color-mix(... text-dim ...)
```
Expected：三个 shadow/track token 现各出现 2 次（dark + light）；`--color-text-3` 为 `color-mix` 表达式。

- [ ] **Step 7: 视觉回归提示（reviewer 检查点）**

浏览器切到 **light** 主题打开 `components/forms.html`（`.input` 内凹井）、`components/indicator.html`（`.progress`/`.meter` 槽）。
预期：light 下输入/进度槽内阴影为柔和蓝灰，而非刺眼近黑；dark 主题这些控件外观不变。占位符/禁用文本若页面有用到 `--color-text-3`，应比 `--color-text-dim` 更淡。

- [ ] **Step 8: Commit**

```bash
git add colors_and_type.css
git commit -m "fix(tokens): light 井阴影适配 + text-3 梯度纠正 + 审计定性(SMELL-1/2/4)"
```

---

## Task 3: 图表可视化调色板（GAP-1）

新增一组克制、低彩、明暗双态可区分的分类图表色，供 Dashboard 的内联 SVG 图表消费。**本任务必须先调用 dataviz skill**。

**Files:**
- Modify: `colors_and_type.css`（LADDER 段 :root + light 块）

**Interfaces:**
- Produces：`--chart-1..6`（分类系列色）、`--chart-grid`（网格线）、`--chart-axis`（坐标轴/刻度文字）。供 Task 4 Dashboard 图表消费。

- [ ] **Step 1: 调用 dataviz skill**

调用 `dataviz` skill，阅读其 `references/palette.md` 与配色方法/校验器。用途：确认下方候选的 series-5（violet）、series-6（teal）与 series-1..4（accent/success/warning/danger）在暗底 `#11151c` 与亮底 `#fff` 上相邻可区分、且与低彩 Beacon 身份一致。若校验不达标，按 dataviz 指引调整 5/6 的取值（1..4 复用系统既有语义色，不改）。

- [ ] **Step 2: 状态断言（改前）**

Run:
```bash
cd /workspace/Codes/github.com/millken/beacon
grep -n "chart-" colors_and_type.css; echo "exit=$?"
```
Expected：无输出（尚无 chart token）。

- [ ] **Step 3: 在 :root(dark) 的 LADDER 段末尾（`--control-selected-ring` 行之后、`}` 之前）新增图表色**

```css
  /* 图表分类色 —— 1..4 复用系统语义色（随 preset/主题自动重算），5/6 为补充低彩色相；grid/axis 复用中性层 */
  --chart-1: var(--color-accent);
  --chart-2: var(--color-success);
  --chart-3: var(--color-warning);
  --chart-4: var(--color-danger);
  --chart-5: #a789e8;   /* 柔紫（dark）——经 dataviz 校验，可按需微调 */
  --chart-6: #4fb6c9;   /* 静青（dark）——经 dataviz 校验，可按需微调 */
  --chart-grid: var(--color-divider);
  --chart-axis: var(--color-text-dim);
```

- [ ] **Step 4: 在 [data-theme="light"] 块末尾覆盖 5/6（1..4 与 grid/axis 为 var 引用，自动随主题翻转，无需重声明）**

```css
  --chart-5: #7c53c9;   /* 柔紫（light）——白底需更深更饱和 */
  --chart-6: #1f8a9e;   /* 静青（light） */
```

- [ ] **Step 5: 机器 gate**

Run: `bash tools/check-tokens.sh`
Expected：`== 0 error(s), N warning(s) ==`，退出码 0。

- [ ] **Step 6: 状态断言（改后）**

Run: `grep -n "chart-" colors_and_type.css`
Expected：`--chart-1..6` + `--chart-grid` + `--chart-axis` 在 :root 出现一组；`--chart-5`/`--chart-6` 在 light 块再出现一次。

- [ ] **Step 7: 备注 preset 限制（写入注释即可，无需改 presets.js）**

确认 Step 3 的注释已说明：`--chart-1..4` 为 `var()` 引用（随 14 套 preset 自动翻转），`--chart-5/6` 为 Beacon 固定色（非 Beacon preset 下回落到本 :root/light 值）。此为已知且有意的限制，符合「不改 presets.js」红线。

- [ ] **Step 8: Commit**

```bash
git add colors_and_type.css
git commit -m "feat(tokens): 图表分类调色板 --chart-1..6 + grid/axis（GAP-1, dataviz 校验）"
```

---

## Task 4: SaaS Admin 模板 —— 外壳 + Dashboard 视图

新建模板文件，搭 `.shell` 满视口外壳（sidebar + topbar + main）与三视图切换骨架，先实现 Dashboard（KPI 行 + 两张内联 SVG 图表 + 活动表）。

**Files:**
- Create: `starting-points/SaaS Admin — Console.html`

**Interfaces:**
- Consumes：Task 1 的 `--surface-page`/`--surface-raised`/`--card`/`--font-size-3xl`；Task 3 的 `--chart-*`；现有组件 `.shell`/`.sidebar`/`.toolbar`/`.stat-card`/`.spark`/`.table-card`/`.table`/`.tag`/`.btn`/`.segmented`/`.badge`。
- Produces：`.view`（页面局部：视图容器，`:target` 或默认显示切换）；`.kpi-row`、`.chart-card`、`.chartframe`（页面局部组合类，仅本文件内）。视图切换机制（`id` = `view-dashboard`/`view-members`/`view-billing`）供 Task 5/6 追加。

- [ ] **Step 1: 参考现有模板约定**

Read: `starting-points/Desktop App — Render Farm.html`（复用其 `@startingPoint` 头注释格式、`#themeSeg` 明暗切换 script、`.shell`/`.sidebar`/`.titlebar` 装配方式、`box-sizing`/字体基线的 `<style>` 样板）。**区别**：不套 `.window` 浮窗外框；`body` 背景用 `var(--surface-page)`；`.shell` 铺满视口。

- [ ] **Step 2: 写外壳骨架（头注释 + head + body + shell + sidebar nav + topbar + 三个空 .view）**

创建文件，包含：
- 首行：`<!-- @startingPoint section="App Shells" subtitle="满视口 SaaS 控制台 · 三视图(Dashboard/Members/Billing)切换 · 消费 surface 抬升 + chart 调色板" viewport="1280x800" -->`
- `<html lang="zh-CN" data-theme="dark">`，`<link rel="stylesheet" href="../styles.css" />`
- `<style>`：`*{box-sizing:border-box}` `html,body{height:100%;margin:0}` `body{background:var(--surface-page);color:var(--color-text);font-family:var(--font-family-sans);font-size:var(--font-size-md);font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased}` `.mono{font-family:var(--font-family-mono)}`；以及视图切换（默认显示 dashboard）：
```css
  .view { display: none; }
  .view:target { display: block; }
  /* 无 :target 时默认显示 dashboard */
  #view-dashboard { display: block; }
  #view-dashboard:target ~ * { }
  .view:target ~ #view-dashboard:not(:target) { display: none; }
```
> 注：纯 CSS `:target` 多视图易出边界问题。**采用更稳的做法**：三个视图都用 `.view`，默认 `display:none`；给 `<body>` 一个 `data-view="dashboard"` 属性，用 `body[data-view="dashboard"] #view-dashboard{display:block}` 等三条规则控制；侧栏项为 `<a href="#" onclick="document.body.dataset.view='members';return false">` 或极小内联脚本。选定后在文件内保持一致。
- `.shell`（现有组件，`display:grid` 装配）内含：`.sidebar`（品牌头 + `.sidebar-section-label` + 三个 `.sidebar-item`，点击切 `data-view`，当前项 `is-selected`）；顶部 `.toolbar`（`.breadcrumb` + `.sp` 弹簧 + `.search-input` + 用户 `.avatar`/主题 `#themeSeg`）；`.shell-main` 内放三个 `<section class="view" id="view-…">`。

- [ ] **Step 3: 实现 Dashboard 视图内容**

在 `#view-dashboard` 内：
- `.kpi-row`（页面局部 `display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-5)`）放 4 张 `.stat-card`；每张 `.v` 覆盖为 `font-size:var(--font-size-3xl)`（局部 style 或本地类 `.kpi .v`），含 `.spark` 迷你条与升降 delta（升 `color:var(--color-success)`、降 `color:var(--color-danger)`）。
- 两张 `.chart-card`（本地类，`background:var(--card);border:1px solid var(--color-border);border-radius:var(--radius-card)`）：
  - 图 A 趋势面积/折线：内联 `<svg>`，折线 `stroke:var(--chart-1)`、面积 `fill` 用 `color-mix(in oklab, var(--chart-1) 18%, transparent)`、网格线 `stroke:var(--chart-grid)`、轴文字 `fill:var(--chart-axis)`。
  - 图 B 分类柱状：内联 `<svg>`，各柱 `fill:var(--chart-1..6)` 轮替，网格/轴同上。
- `.table-card` + `.table` 近期活动表：状态列用 `.tag`（success/warning/danger 变体），数值列 `.mono`。

- [ ] **Step 4: 状态断言 —— 模板消费新 token 且无违规硬编码色**

Run:
```bash
cd /workspace/Codes/github.com/millken/beacon
f="starting-points/SaaS Admin — Console.html"
grep -c "var(--chart-\|var(--surface-page)\|var(--font-size-3xl)\|var(--card)" "$f"   # 应 >0，证明消费了新 token
grep -nE "#[0-9a-fA-F]{3,8}\b" "$f" | grep -v "color-mix\|chart-5\|chart-6" || echo "无游离 hex 字面量"
```
Expected：第一条 > 0；第二条理想为 `无游离 hex 字面量`（页面色一律走 token；如确有必要的 page-chrome 字面量，须能逐一说明理由，参照 Render Farm 的窗体阴影惯例——但本模板无浮窗，原则上应为零）。

- [ ] **Step 5: 视觉验收（reviewer 检查点）**

浏览器打开该文件，明暗两态确认：满视口无横向滚动；卡片在页面上有抬升（dark）/靠描边+页面灰底浮起（light）；KPI 大数字用 3xl；两张图表系列色可区分且不刺眼；主题切换即时生效；侧栏切到 Members/Billing 时（尚未实现内容）主区为空但不报错。

- [ ] **Step 6: Commit**

```bash
git add "starting-points/SaaS Admin — Console.html"
git commit -m "feat(starting-points): SaaS Admin 外壳 + Dashboard 视图（消费 surface/chart/3xl token）"
```

---

## Task 5: Members 管理视图

在同一文件的 `#view-members` 内实现资源管理表：过滤/搜索工具条 + 数据表（状态 tag、行内动作、分页）+ 详情 drawer。

**Files:**
- Modify: `starting-points/SaaS Admin — Console.html`（填充 `#view-members`；如需 drawer 遮罩，追加页面局部样式）

**Interfaces:**
- Consumes：Task 4 的视图切换机制与外壳；现有组件 `.toolbar`/`.search-input`/`.table`/`.tag`/`.btn`/`.btn--sm`/`.btn--ghost`/`.drawer`/`.field`/`.badge`。
- Produces：`.pager`（页面局部分页条）；drawer 触发/关闭的内联交互（`data-open`/`data-close`，复用 Render Farm 同款极小脚本，如其有）。

- [ ] **Step 1: 复用 overlay 组件的 drawer 结构**

Read: `components/css/overlay.css` 中 `.drawer`/遮罩相关规则 + `components/overlay.html` 的 drawer 用法与开关交互，确保用其既定 class 与打开机制（不新造组件）。

- [ ] **Step 2: 实现 Members 视图内容**

在 `#view-members` 内：
- 过滤条：`.toolbar`（非浮窗版，`border-bottom` 分隔）含 `.search-input`、状态 `.segmented`（All/Active/Invited/Suspended）、右侧 `.btn.btn--primary`「Invite member」。
- `.table-card` > `.table`：列 = 复选框 / 成员（`.avatar` + 名 + 邮箱 mono）/ 角色 / 状态 `.tag` / 最近活跃（mono）/ 行末 `.btn--icon.btn--ghost` 动作。行可点开 drawer。
- `.pager`（本地：`display:flex;justify-content:space-between;align-items:center;padding:var(--space-3) var(--space-4);color:var(--color-text-muted);font-size:var(--font-size-xs)`）含页码 `.btn--sm` 组。
- `.drawer`：成员详情，含 `.field` 表单（姓名/角色 select/状态 switch）与底部 `.btn.btn--primary` + `.btn`。

- [ ] **Step 3: 状态断言**

Run:
```bash
f="starting-points/SaaS Admin — Console.html"
grep -c "view-members\|drawer\|pager" "$f"
grep -nE "#[0-9a-fA-F]{3,8}\b" "$f" | grep -v "color-mix\|chart-5\|chart-6" || echo "无游离 hex 字面量"
```
Expected：第一条 > 0；第二条 `无游离 hex 字面量`。

- [ ] **Step 4: 视觉验收（reviewer 检查点）**

浏览器明暗两态：切到 Members 视图，表格密度符合 Beacon（行高、zebra）；状态 tag 语义色正确；点击行打开 drawer、可关闭；分页条对齐；无横向滚动。

- [ ] **Step 5: Commit**

```bash
git add "starting-points/SaaS Admin — Console.html"
git commit -m "feat(starting-points): SaaS Admin Members 管理视图（表格+drawer+分页）"
```

---

## Task 6: Billing / 设置视图

在 `#view-billing` 内实现：套餐/定价卡 + 用量 meter/progress 行 + 发票表。

**Files:**
- Modify: `starting-points/SaaS Admin — Console.html`（填充 `#view-billing`）

**Interfaces:**
- Consumes：外壳与视图机制；现有组件 `.progress`/`.progress-row`/`.meter`/`.table`/`.tag`/`.btn`/`.badge`/`.led`。
- Produces：`.plan-grid`/`.plan-card`（页面局部定价卡）；`.usage-row`（用量行封装，内含 `.progress-row`）。

- [ ] **Step 1: 复用 indicator 组件的 progress/meter**

Read: `components/css/indicator.css` 的 `.progress`/`.progress-row`/`.meter` 与 `components/indicator.html` 用法，确保用既定 class 与变体（`--success`/`--warning`/`--danger`），不新造。

- [ ] **Step 2: 实现 Billing 视图内容**

在 `#view-billing` 内：
- `.plan-grid`（本地 `display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-5)`）三张 `.plan-card`（本地：`background:var(--card);border:1px solid var(--color-border);border-radius:var(--radius-card);padding:var(--space-6)`），当前套餐卡加 `border-color:var(--color-accent)` + `.badge`「Current」；价格用 `--font-size-3xl` + mono；特性列表 + 底部 `.btn.btn--primary`/`.btn`。
- 用量区 `.chart-card`/`.table-card` 包 `.progress-row` 若干（Seats / API calls / Storage），接近上限的用 `.progress--warning`；再放一条分段 `.meter` 示例（本月配额）。
- 发票 `.table-card` > `.table`：日期(mono) / 金额(mono) / 状态 `.tag`（Paid=success / Due=warning）/ 下载 `.btn--icon.btn--ghost`。

- [ ] **Step 3: 状态断言**

Run:
```bash
f="starting-points/SaaS Admin — Console.html"
grep -c "view-billing\|plan-card\|progress-row\|meter" "$f"
grep -nE "#[0-9a-fA-F]{3,8}\b" "$f" | grep -v "color-mix\|chart-5\|chart-6" || echo "无游离 hex 字面量"
```
Expected：第一条 > 0；第二条 `无游离 hex 字面量`。

- [ ] **Step 4: 视觉验收（reviewer 检查点）**

浏览器明暗两态：切到 Billing；定价卡当前套餐高亮；用量条接近上限显警告色；发票表状态色正确；用 3xl 的价格数字与 KPI 一致；无横向滚动。三视图整体切换连贯。

- [ ] **Step 5: Commit**

```bash
git add "starting-points/SaaS Admin — Console.html"
git commit -m "feat(starting-points): SaaS Admin Billing 视图（套餐卡+用量 meter+发票表）"
```

---

## Task 7: 文档同步 + 整体验收

把新 token 与新模板写入索引/参考文档，并做一次跨全库的最终验证。

**Files:**
- Modify: `README.md`（Index 表 + Token 分层说明）
- Modify: `components/index.html`（页脚起步模板链接）
- Modify: `tokens.html`（新增 token 的展示分区，若结构允许）

**Interfaces:** 无（纯文档）。

- [ ] **Step 1: 更新 README.md**

- Index 表 `starting-points/` 行：追加 `+ SaaS Admin — Console.html（满视口 SaaS 控制台，三视图）`。
- Token 分层小节：在 SHAPE/FONT/LADDER 说明处补 `--font-size-3xl`、`--surface-page/-raised`、`--chart-1..6/grid/axis`、以及 text-3/light 井阴影的校正说明各一句。

- [ ] **Step 2: 更新 components/index.html 页脚**

在第 225 行附近的「起步模板」链接后追加指向 `../starting-points/SaaS Admin — Console.html` 的链接。

- [ ] **Step 3: 更新 tokens.html（如可行）**

在 tokens.html 相应分区（字号 / 色盘）新增对 `--font-size-3xl`、`--surface-*`、`--chart-*` 的可视化展示条目，沿用该页既有的展示条目样式（只消费 token，不硬编码）。若该页结构不便扩展，在其顶部 changelog/说明处以文字列明新增 token 即可。

- [ ] **Step 4: 最终机器 gate（全量）**

Run: `bash tools/check-tokens.sh`
Expected：`== 0 error(s), N warning(s) ==`，退出码 0。

- [ ] **Step 5: 最终视觉回归清单（reviewer 检查点）**

浏览器逐一确认（明暗两态）：
- `starting-points/SaaS Admin — Console.html` 三视图全部正确、可切换、无横向滚动。
- `starting-points/Desktop App — Render Farm.html` 无回归。
- 抽查 `components/` 下 indicator / table / forms / feedback / misc 五页无回归（重点：卡片抬升、light 井阴影、text 层级）。

- [ ] **Step 6: Commit**

```bash
git add README.md components/index.html tokens.html
git commit -m "docs: 同步 SaaS Admin 模板与新 token（chart/surface/3xl/text-3/light 井阴影）"
```

---

## Self-Review（作者自查记录）

**Spec 覆盖核对：**
- 交付物：模板文件 → Task 4–6；token 只改 `colors_and_type.css` → Task 1–3；不新增组件 → 全程红线。✅
- GAP-1 图表色 → Task 3；GAP-2 3xl → Task 1；GAP-3 surface → Task 1。✅
- SMELL-1 light 井阴影 → Task 2；SMELL-2 text-3 → Task 2；SMELL-3 card 抬升 → Task 1；SMELL-4 审计定性 → Task 2。✅
- 多视图（Dashboard/Members/Billing）→ Task 4/5/6。✅
- 验证（gate=0 / 组件回归 / 模板双态 / 文档同步）→ 每任务的 gate+状态断言+reviewer 检查点，Task 7 汇总。✅
- 非目标（不改 presets.js / 不加密度层 / 无 JS 图表库 / 不提升组件）→ Global Constraints 红线 + Task 3 Step 7 备注。✅

**占位符扫查：** 无 TBD/TODO；每个改动步骤含具体 CSS/HTML 内容或精确命令与预期。图表 5/6 色给了具体候选值 + dataviz 校验兜底，非占位。✅

**类型/命名一致性：** `--surface-page`/`--surface-raised`/`--card`/`--font-size-3xl`/`--chart-1..6`/`--chart-grid`/`--chart-axis` 在 Task 1/3 定义、Task 4–6 消费，名称全程一致；视图 id `view-dashboard/members/billing` 在 Task 4 定义、5/6 复用一致。✅

**已知取舍（非阻断）：** Task 4 Step 2 的多视图切换在纯 CSS `:target` 与 `body[data-view]` 间给了取舍并选定后者为稳妥默认；执行时保持文件内一致即可。
