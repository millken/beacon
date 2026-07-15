# Beacon — GUI Design Tokens（Semi 结构 × Beacon 色盘）

一套桌面级专业工具的设计系统 **Beacon**——一层 **GUI 设计变量（Design Token）规范** + 一层组件库。设计取向是两件事的合并：

- **结构借鉴 Semi Design 的成熟 Token 体系** —— 基础元素与样式解耦、功能色展开为完整交互态矩阵（默认 / 悬浮 / 激活 / 禁用 + 浅版）、文本按层级语义化、语义角色（role + foreground）配对、一处变量驱动全站 + 一键明暗切换。
- **色盘与调性取自团队现行的「Beacon」桌面级系统** —— 高密度、硬边（半径上限 6px，单旋钮 `--radius`）、低彩中性基底、mono 优先、状态色服务于读取而非装饰、阴影只为弹层服务。对标 VS Code / JetBrains / DaVinci。

> 一句话：**Semi 的骨架，Beacon 的皮肤。**

---

## Index — 目录清单

| 文件 | 内容 |
|---|---|
| `README.md` | 本文档 |
| `SKILL.md` | Agent Skill 描述符（`gui-tokens-semi-beacon`）|
| `colors_and_type.css` | **全部 Token 的 CSS 变量**：形状 / 密度 / 排版 / 组件 / 语义角色 / **Semi 式功能色矩阵** / Beacon 色盘（light + dark）。默认 preset = Beacon |
| `tokens.html` | **GUI Token 规范页** —— 可视化全部 Token 的参考文档（左侧目录 + light/dark 切换 + Token 应用示例）。用浏览器打开即可浏览 |
| `presets.js` | 14 套 preset × light/dark 色值 + `applyPreset(key, theme)`（色值事实来源；默认采用 Beacon）|
| `theme-switch.js` | 悬浮的 preset / 明暗 / 圆角切换器，`presets.js` 之后引入即可 |
| `styles.css` | 完整组件样式表（Token 消费参考）|
| `components/` | 组件库（`*.html` 演示 + `components.css`）|
| `RECONSTRUCTION.md` | 本系统的还原来源与版本说明 |

---

## Token 分层（colors_and_type.css）

```
1) 形状 SHAPE       单旋钮 --radius (3px) 派生 sm/md/lg/card/full；--shadow-inset/well
2) 密度 DENSITY     --space-1..7（base --space-4 = 8px）+ 控件三档内边距 + 控件三档高度
3) 排版 FONT        双字体栈（sans = Segoe UI Variable/SF Pro；mono = JetBrains/Iosevka）· 7 档字号 · 三档字重
4) 组件 COMPONENT   --btn-shadow / -border-width / -active-shadow
5) 语义角色 ROLES   shadcn 式 --primary/-foreground · --card · --muted · --subtle · --destructive · --ring …
5.5) 功能色 FUNCTIONAL（★ Semi 结构）  primary/secondary/tertiary/info/success/warning/danger
     每个语义展开 默认/悬浮/激活/禁用 + 浅版(light)三态，用 color-mix 从 Beacon 基础色派生
6) 色盘 LADDER      6 级表面 / 4 级文本 / 3 级描边 / accent / 状态 —— :root = Beacon dark，[data-theme=light] = Beacon light
```

**功能色矩阵**是借鉴 Semi 最核心的部分：`--color-primary` / `-hover` / `-active` / `-disabled` / `-light-default` / `-light-hover` / `-light-active`，success / warning / danger 同构。值由 `color-mix` 从 Beacon 的 accent / success / warning / danger 派生，**明暗主题下自动重算**——结构是 Semi 的，颜色是 Beacon 的。

---

## Content Fundamentals — 文案与语气

- **语言**：中文为主，token 名 / 数值 / 技术术语保留英文小写 kebab-case，`--color-` / `--space-` / `--radius-` 等前缀。
- **语气**：客观、说明式、克制。陈述「是什么、用在哪」，不营销、不口语化。
- **数字**：始终带单位（`13px`、`8px`、`#4d9bff`），表格列与数值用 mono + `tabular-nums`。
- **Emoji**：不用作功能状态。状态靠 LED 圆点 + 颜色 + 文字承担。

---

## Visual Foundations — 视觉基调（Beacon）

- **色彩**：单一 accent（Beacon dark = `#4d9bff` / light = `#1a6fe0`）承载所有可点击焦点；大面积低彩中性基底；状态色（绿/橙/红）仅用于语义读取。暗色优先。
- **字体**：sans = Segoe UI Variable Text / SF Pro Text（系统栈）；mono = JetBrains Mono / Iosevka Term，用于代码、数值、路径、token 名。基准 13px，字重 400 / 500 / 600。
- **圆角**：硬边。单旋钮 `--radius`（默认 3px）派生整套，上限 6px。**绝不 iOS 式大圆角**。
- **间距**：8px 基（`--space-4`），紧凑。控件高度 24 / 28 / 34（sm/md/lg），内边距独立 token。
- **背景**：纯色分层，**无渐变 / 无纹理 / 无毛玻璃**。暗色用 6 级背景区分层级；浅色用「平面模型」（抬升容器共用内容平面，靠 shadow + 强描边抬升，故 `--popover` 在 light 下改写为 `bg`）。
- **阴影**：只为弹层服务。`--shadow-card`（卡片）/ `--shadow-pop`（菜单·对话框）= 投影 + 1px 描边组合；`--shadow-inset` 暗示可编辑输入；`--focus-ring` 为 accent 聚焦环。
- **描边**：1px 实线是层级主要分隔手段，分 `border` / `border-strong` / `divider` 三档。
- **悬浮 / 激活**：强调元素加深一阶（hover/active）；中性元素叠加 `bg-hover` / `bg-active`。无放大、无弹跳。
- **图像气质**：冷、干净、无颗粒。

---

## Iconography — 图标

本规范聚焦 Token 层，未内置图标资源。状态用 LED 圆点（实色小圆）+ 颜色 + mono 文字表达；`styles.css` 内含若干内联 stroke SVG（窗口控件、菜单箭头等）可参考。若需图标系统，建议接入线性、1.5px stroke、24px 基准的 CDN 集（如 Tabler / Lucide）并随 `currentColor` 取色——与桌面工具的硬边线性气质一致。**不用 emoji / Unicode 字符作功能图标。**

> **⚠ 铁律 · 图标按钮必须用 SVG，禁止文字字符。** 任何 icon button（dialog/toast 的关闭键、chip 的移除键、window 控件、toolbar 图标等）一律用 `<svg>` 线性图标，**绝不**用 `✕ / × / ✖ / +` 等文字字形。原因：文字字形在窄容器里会被行高/字距挤压成「一坨」，跨平台字体渲染也不一致；SVG 用 `viewBox` + `stroke: currentColor` 才能精确居中、随主题取色、不被挤压。组件层已为 `.dialog-x` / `.toast .t-x` / `.chip .x` 提供了 svg 尺寸规则（`width/height` + `stroke-width` + `pointer-events:none`），直接放 `<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>` 即可。

---

## 用法 Usage

```html
<link rel="stylesheet" href="colors_and_type.css" />
<!-- 默认 Beacon dark；切换 <html data-theme="light"> 即换肤 -->
<style>
  .btn-primary {
    background: var(--color-primary);
    color: var(--color-accent-fg);
    height: var(--control-h-md);
    padding: var(--control-pad-y) var(--control-pad-x);
    border-radius: var(--radius-sm);
  }
  .btn-primary:hover    { background: var(--color-primary-hover); }
  .btn-primary:disabled { background: var(--color-primary-disabled); }
  .tag-soft  { background: var(--color-primary-light-default); color: var(--color-primary); }
  .panel { background: var(--card); border: 1px solid var(--color-border); box-shadow: var(--shadow-card); border-radius: var(--radius-md); }
</style>
```

切换到其余 13 套 preset，引入 `presets.js` 并调用 `applyPreset('chrome', 'dark')`；或直接引入切换器：

```html
<script src="presets.js"></script>
<script src="theme-switch.js" data-default-preset="beacon" data-default-theme="dark"></script>
```

14 套 preset：`beacon` / `chrome` / `antd` / `console` / `studio` / `workshop` / `iron` / `refinery` / `lab` / `mainframe` / `foundry` / `helix` / `atlas` / `reactor`。

---

## 定制皮肤 Authoring a Skin

一套皮肤 = 给底层语义阶梯提供 light / dark 两组值（约 23 个色值 token × 2 模式）。形状 / 密度 / 字体 / 角色配对走全局共享（`presets.js` 里的 `COMMON_*`），无需重复。校验清单：① light 表面 `bg → subtle → surface → hover → active` 逐级变深、hover 深于 chrome（暗色逐级变浅）；② 三级文本达对比目标（text ≥ 7:1、muted ≥ 4.5:1、dim ≥ 3:1）；③ `accent-fg` 在 `accent` 上 ≥ 4.5:1。

---

## Caveats & 已知项

- **功能色矩阵为派生值**：`-hover/-active/-disabled/-light-*` 由 `color-mix` 从 Beacon 基础色生成，非逐一手调。如需精确控制，可在 `colors_and_type.css` 覆盖具体变量。
- **info / secondary / tertiary**：Beacon 是单 accent 体系，故 `info` 复用 primary，`secondary`/`tertiary` 映射到中性表面/文本态——保留 Semi 命名以便迁移。
- **`colors_and_type.css` 的 `:root` 与 `presets.js` 的 `beacon` 条目存在细微色值差异**（如 dark accent `#6aa1ef` vs `#4d9bff`）：CSS 表内嵌的是一版更细调的 Beacon 默认值，`presets.js` 是 `applyPreset` 的运行时事实来源。两者都保留原样，详见 `RECONSTRUCTION.md`。
- **字体**：sans 为系统字体栈（Segoe UI Variable / SF Pro），无需引入；mono 经 Google Fonts 加载 JetBrains Mono 作跨平台回退。
