# zi · 移动端 App UI — Design Token 规范

> 版本 v0.1 草稿 · 桌面《工业级桌面 GUI》规范的**移动孪生**。
> 本文件是 **token 命名与架构的规范(normative spec)**;落地见 `mobile.css`(scope 在 `.mobile` 下)、视觉演示见 `mobile-design-system.html`。
> 与桌面 `tokens.md` 对照阅读。

---

## 0. 定位与继承关系

| 维度 | 桌面(工业级 GUI) | 移动(本规范) | 关系 |
|---|---|---|---|
| 输入 | 鼠标 + 键盘 | 触控 + 手势 | **重做** |
| 密度 | 极密(13px 正文,5px 内距) | 中等(17px 正文,≥44px 触控) | **放松** |
| 基底 | 逐级变深的灰 chrome | 通透白卡 + 浅灰分组底 | **重做** |
| 圆角 | 2–6px 锐角 | 8–22px 柔角 | **上调** |
| 字体 | 系统无衬线 + 等宽数据字 | 纯系统字体栈 | **简化** |
| 强调色 | radix blue `#1a6fe0` | **同色** | ✅ 继承 |
| 语义状态色 | success/warning/danger | **同值** | ✅ 继承 |
| accent 铁律 | 仅 selected/active/current 用蓝 | **照搬** | ✅ 继承 |
| token 分层 | primitive → semantic → component | **同心智** | ✅ 继承 |

> 一句话:**色彩语义与纪律照搬桌面,密度 / 触控 / 形状 / 交互全部为触屏重做。**

---

## 1. 命名语法

移动 token 统一加 `--m-` 前缀,与桌面 `--color-* / --space-*` 命名空间隔离,可在同一文档共存(本规范页就同时挂载了两套)。

```
--m-<category>[-<role>][-<variant>]
```

`category` ∈ `bg` `text` `accent` `separator` `border` `space` `radius` `touch` `row` `font` `shadow` `dur` `safe` `success` `warning` `danger`。

---

## 2. 三层架构(沿用桌面心智)

```
Tier 1 · Primitive   色板 / 刻度
        ↓
Tier 2 · Semantic    表面角色(--m-bg-*)、文本(--m-text-*)、强调(--m-accent-*)
        ↓
Tier 3 · Component   组件内部消费(.m-btn / .m-row / .m-sheet …)
```

深色模式接口已预留:`mobile.css` 顶部 token 块挂在 `.mobile` 上,深色版将以 `.mobile[data-m-theme="dark"]` 覆盖同名 token,组件 CSS 无需改动。

---

## 3. 颜色

### 3.1 表面 `--m-bg-*`(为移动重做 · 通透)
| Token | 值 | 角色 |
|---|---|---|
| `--m-bg-grouped` | `#f2f4f7` | **屏幕分组底**(卡片背后)|
| `--m-bg` | `#ffffff` | 卡片 / 行 / 输入框 / 内容面 |
| `--m-bg-secondary` | `#eceff4` | 分段轨 / chip / well |
| `--m-bg-tertiary` | `#e4e8ef` | 中性按下填充 |
| `--m-press` | `rgba(17,21,28,.05)` | 中性 press 叠加(行 / ghost)|
| `--m-scrim` | `rgba(17,21,28,.40)` | sheet / dialog 遮罩 |

> **与桌面的关键差异**:桌面用 `bg → subtle → surface → hover → active` 逐级变深做 chrome 层级;移动改为**白卡浮于浅灰分组底**,层级靠柔阴影 + 发丝线,而非更深的灰。

### 3.2 分隔 / 边框
`--m-separator` `#e6e9ef`(行内发丝) · `--m-border` `#d7dce4`(输入边) · `--m-border-strong` `#b9c0cc`。

### 3.3 文本 `--m-text-*`(对比目标同桌面)
`--m-text` `#11151c`(≥7:1) · `--m-text-secondary` `#59616f`(≥4.5:1) · `--m-text-tertiary` `#8b93a1`(≥3:1,占位/说明) · `--m-text-inverse` `#fff`。

### 3.4 强调 `--m-accent-*`(**继承桌面**)
`--m-accent` `#1a6fe0` · `--m-accent-press` `#1561c8` · `--m-accent-fg` `#fff` · `--m-accent-tint`(选中行底,`mix(accent 10%, #fff)`)· `--m-accent-tint-press`(16%)。

### 3.5 状态(**继承桌面**)
`--m-success` `#1a7a3e` · `--m-warning` `#b06200` · `--m-danger` `#c41c1c` · `--m-danger-press` `#a51515`。仅作前景 / 色条 / 图标,不大面积填充。

---

## 4. 排版 · 纯系统字体栈

```
--m-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, …
```

| Token | 值 / 字重 | 用途 |
|---|---|---|
| `--m-text-2xs` | 11 | Tab 标签 / 角标 / overline |
| `--m-text-xs` | 13 | 说明 / 行内值 |
| `--m-text-sm` | 15 | 副标题 / 按钮-sm |
| `--m-text-md` | **17** | **正文 Body · 默认** |
| `--m-text-lg` | 20 | Sheet 标题 |
| `--m-text-xl` | 24 | 屏幕标题 |
| `--m-text-2xl` | 32 | 大标题 |

字重 400 / 500 / 600 / 700。**可读下限铁律**:移动正文 17px(高于桌面 13px),避免 iOS 输入聚焦缩放,且强光/远观可读。数字按需 `font-variant-numeric: tabular-nums` 等宽对齐——不再单引一支等宽数据字。

---

## 5. 间距 · 4px 基准
`--m-space-1..8` = 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40。`--m-gutter: 16px` = 屏幕水平边距 + 基准 gap(= `--m-space-4`)。分组列表块间距 22px;行垂直内距 10px(行高靠 `--m-row` 56 兜底)。

---

## 6. 形状 · 柔角
`--m-radius: 12px`(基准)。sm 8(chip)· md 12(按钮/输入)· lg/card 16(卡片)· sheet 22(抽屉顶角)· full 9999(开关/FAB/pill)。整体比桌面上调一档。

---

## 7. 触控目标与安全区(移动最大增量)

| Token | 值 | 用途 |
|---|---|---|
| `--m-touch-min` | **44px** | 命中区绝对下限(WCAG / Apple / Material 共识)|
| `--m-touch` | 48px | 舒适默认(按钮 / 输入 / 分段)|
| `--m-touch-lg` | 56px | 主 CTA / 列表行 |
| `--m-row` | 56px | 列表行 min-height |
| `--m-safe-top` / `--m-safe-bottom` | `env(safe-area-inset-*)` | 刘海 / 手势条避让 |

> **铁律**:视觉元素可小,但**透明命中热区 ≥44px**;相邻热区间隔 ≥8px。导航栏顶距、Tab 栏与 sheet 底距都叠加 `env(safe-area-inset-*)`。

---

## 8. 阴影 · 柔而稀
`--m-shadow-card`(卡片,几乎贴地)· `--m-shadow-pop`(菜单/snackbar)· `--m-shadow-sheet`(抽屉,向上投)· `--m-shadow-fab`(含 accent 色晕)。桌面靠 1px 硬边 + 内陷;移动靠柔阴影 + 发丝线,且**克制**——只有真正浮起的浮层 / FAB / sheet 才投影。

---

## 9. 交互态契约 · hover→press 迁移

> 触屏**没有 hover**。桌面《tokens.md §5.1》的三种 idiom 迁移如下。

| 桌面(鼠标) | 移动(触控) | 实现 |
|---|---|---|
| hover 中性加深 | — 取消 | 静止态即最终态 |
| hover 边框加强 | **press** | 按下中性加深(`--m-press` / `--m-bg-tertiary`)|
| `:active` inset 下沉 | **`scale(0.97)`** | 按钮/卡片轻微缩放替代下沉阴影 |
| keyboard focus ring | 仅输入聚焦 | 焦点环只在文本框激活(键盘弹起)时出现 |
| selected = accent | **selected = accent** | 不变,铁律照搬 |

### 9.1 强调色铁律 · 移动落位(继承 CLAUDE.md)

> **只有元素自身的 selected / checked / active / current 终态本就是 accent 时,press 才允许出现 accent(此时是预览自身值)。否则 press 一律中性。**

- ✅ 合法 accent:开关 ON、checkbox/radio 选中、**选中列表行**(tint 底 + 蓝标题 + 勾)、当前 Tab(蓝图标+标签)、选中 filter chip、输入聚焦环、主按钮(填充蓝→press 深蓝)、链接 / 文字按钮。
- ❌ 禁止 accent:普通列表行 press(应中性灰)、outline / 中性按钮 press 出现蓝边或蓝底、**分段控件选中段变蓝**(应为白色浮起药丸,等价桌面 toggle-group 的中性选中)、未选中 Tab、sheet 抓手、普通图标 press。

### 9.2 手势约定
`tap`(主交互)· `swipe-down`(关 sheet / 下拉刷新)· `swipe-row`(行左滑操作,删除=danger)· `edge-back`(左缘右滑返回)· `long-press`(上下文菜单 / 多选 / 拖拽)。

### 9.3 反馈约定
press 100–120ms 即时视觉响应;关键确认(开关 / 删除 / 长按)配轻 haptic;异步结果用 snackbar 非阻断,破坏性操作用 sheet 二次确认。

---

## 10. 组件清单(v0.1 已覆盖)

**核心**:按钮(primary/secondary/outline/neutral/text/danger · lg/md/sm · icon)、输入(text/search/textarea · 聚焦/错误)、分组列表行(图标/值/副标/开关/选中/danger)、选择(switch/checkbox/radio/segmented/chip)。
**移动专属**:导航栏(标准/大标题)、底部 Tab 栏(角标/毛玻璃)、底部抽屉 Sheet(抓手/遮罩/破坏性确认)、FAB、Toast/Snackbar、状态 tag。
**通用补充(compressor-mall dogfood 毕业)**:`.m-imgslot` 图片占位、`.m-stepper` 数量步进器(终态非 accent → press 中性)、`.m-actionbar` 粘底操作栏(底部用 `--m-inset-bottom`)、`.m-empty` 空态。

### 10.1 Dogfood 发现(用商城 App 压测)

用本规范搭了一个完整工业压缩机商城 App,真实场景暴露并已修复:

1. **App 缺陷 · 双底栏**:带粘底操作栏的 push 详情页没盖住主 Tab 栏 → 两条底栏堆叠。**层叠铁律**:带操作栏的 push 屏必须覆盖整个 `.app-shell`(含 Tab 栏),`position:absolute; inset:0; z-index:40`;状态栏与手势条在 shell 外恒可见。
2. **App 缺陷 · 分段误用**:把「筛选」动作塞进了分段控件轨道 —— 违反 §9 分段=排他视图切换。拆出为独立 outline 筛选按钮。
3. **规范缺口**:图片占位 / 步进器 / 粘底操作栏 / 空态四个通用模式缺失 → 毕业进 `mobile.css`(见上)。
4. **色彩体系**:价格需独立强调色,不能用 accent 蓝(非选择)或 danger 红(非错误)→ 引入**领域语义色** `--c-price`(借桌面 refinery 安全橙)。说明:领域色独立于四个核心语义槽(accent/success/warning/danger),按需在 App 层扩展,不污染系统语义。
5. 领域专属件(商品卡/价格/参数表/订单卡/公司头/类目两栏)留在 App 的 `mall.css`,不上升为通用规范。

---

## 11. 路线图(待补)

1. **深色模式铺色** —— 填 `.mobile[data-m-theme="dark"]` 的 token 值(接口已留)。
2. 列表行**左滑操作** / 下拉刷新 / 空态 / 骨架屏。
3. **日期/时间选择器**、数字 / 搜索键盘配套。
4. 把 token 落成 `applyPreset` 式**可换肤**结构,与桌面共用 preset 引擎。
5. 无障碍:动态字号(Dynamic Type)、VoiceOver/TalkBack 标注、对比度校验清单。
