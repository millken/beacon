# zi · 工业级桌面 GUI — Design Token 规范

> 版本 v1.0 · 本文件是 **token 命名与架构的规范(normative spec)**，不是用法说明。
> 实现：`presets.js`(token 数据 + `applyPreset`)、`styles.css`(组件消费)。

---

## 0. 设计目标

1. **可预测**：给定一个用途，能按语法推断出 token 名，无需查表。
2. **可定制皮肤**：第三方只需覆盖「语义层」少量变量即可换肤，无需触碰组件 CSS。
3. **无命名冲突**：全部 token 带 `--zi-` 命名空间，不与宿主页面 / AntD / Radix 等的 `--accent`、`--border` 等裸变量碰撞。
4. **分层**：原始值 → 语义角色 → 组件，单向依赖，下层不反向引用上层。

---

## 1. 命名语法 (Naming Grammar)

```
--zi-<category>-<role>[-<variant>][-<state>]
```

| 段 | 必填 | 取值 | 说明 |
|---|---|---|---|
| `category` | ✓ | `color` `space` `size` `radius` `font` `shadow` `border` `z` `control` `input` | 大类（或组件名，如 `btn`）|
| `role` | ✓ | 见各类定义 | 语义角色 |
| `variant` | — | `subtle` `strong` `sm` `lg` … | 同角色的强弱 / 尺寸变体 |
| `state` | — | `hover` `active` `disabled` `focus` | 交互态 |

示例：`--zi-color-bg-surface`、`--zi-color-accent-hover`、`--zi-font-size-md`、`--zi-radius-card`、`--zi-btn-pad-x-sm`(组件层)。

> **规则**：state 永远放最后；variant 在 state 之前。禁止用缩写新造段(如 `--zi-bg1`)，category 必须拼全。

---

## 2. 三层架构 (Token Tiers)

```
Tier 1 · Primitive   原始调色板 / 刻度       —— 不直接被组件使用
        ↓ 引用
Tier 2 · Semantic    ├─ 角色层(§2.5)        —— 组件首选 API（前景配对）
                     └─ 底层阶梯(§3)         —— 皮肤填值入口；角色层引用它
        ↓ 引用
Tier 3 · Component   组件级别(§5)            —— 复杂组件的结构旋钮
```

- **换肤** = 替换 Tier 2 底层阶梯(§3)的值(`applyPreset` 做的就是这件事)；角色层(§2.5)自动跟随。
- **组件 CSS 优先引用角色层(§2.5)**，其次底层阶梯(§3) / 组件 token(§5)；禁止写死 Tier 1 具体色值或裸十六进制。

---

## 2.5 语义角色层 · 前景配对（shadcn-style，**推荐组件优先用**）

明度阶梯(`--color-bg-*`)解决「层级」，但不保证「文字色」。借鉴 shadcn：**每个表面角色都配一个 `-foreground`**，组件用配对的二元组，文字在任何底上都合法。角色层由 `applyPreset` 自动挂载，引用底层阶梯，**无需每套皮肤重写**。

| 表面角色 | 配对前景 | 映射 | 用途 |
|---|---|---|---|
| `--background` | `--foreground` | bg / text | 页面底 |
| `--card` | `--card-foreground` | bg / text | 卡片 |
| `--popover` | `--popover-foreground` | surface / text | 浮层 |
| `--primary` | `--primary-foreground` | accent / accent-fg | 主按钮 / 强调（另有 `--primary-hover`）|
| `--secondary` | `--secondary-foreground` | surface / text | 次按钮 |
| `--muted` | `--muted-foreground` | subtle / text-muted | 弱化区 / 占位 |
| `--subtle` | `--subtle-foreground` | hover surface / text | hover / 选中底 |
| `--destructive` | `--destructive-foreground` | danger / #fff | 危险动作（另有 `--destructive-hover`）|
| `--success` · `--warning` | — | 状态前景色 | 状态 |
| `--input` · `--ring` | — | border / accent | 输入边框 / 焦点环 |

> **铁律**：用了某个表面角色，文字就必须用它配对的 `-foreground`，不要再手挑 `--color-text-*`。
> 这样换肤 / 反色时配对关系自动成立，杜绝「深底深字」。

---

## 3. Tier 2 · 底层语义阶梯（换肤入口 · 每 preset × 明暗各一套）

> 角色层(§2.5)是组件首选 API；本节是它引用的底层阶梯，也是**皮肤作者真正要填的值**。

### 3.1 颜色 · 表面 `--zi-color-bg-*`
| Token | 角色 | 典型用途 |
|---|---|---|
| `--zi-color-bg` | 内容 / 数据层(最亮)| `<body>`、表格单元格、编辑区 |
| `--zi-color-bg-subtle` | chrome 一级 | 侧栏 / 工具栏 / 表头 |
| `--zi-color-bg-surface` | chrome 二级 / 浮起面 | 卡片 / 面板 / 按钮 / 输入框 |
| `--zi-color-bg-hover` | hover 态 | 列表项 / 按钮 hover |
| `--zi-color-bg-active` | selected / pressed | 选中行 / 按下 |
| `--zi-color-bg-inverse` | 反色底 | tooltip / toast |

> **明度梯度铁律**：浅色模式 `bg → subtle → surface → hover → active` 必须**逐级变深**；
> 暗色模式逐级变浅。`hover` 必须深于(暗色：浅于)所有 chrome 层，否则 hover 不可见。

### 3.2 颜色 · 边框 `--zi-color-border-*`
| Token | 用途 |
|---|---|
| `--zi-color-border` | 默认 1px 发丝边框 |
| `--zi-color-border-strong` | hover / outline / 强调边框 |
| `--zi-color-divider` | 行 / 列表弱分隔 |

### 3.3 颜色 · 文本 `--zi-color-text-*`
| Token | 对比目标 | 用途 |
|---|---|---|
| `--zi-color-text` | ≥ 7:1 | 主要文本 |
| `--zi-color-text-muted` | ≥ 4.5:1 | 次要文本 / 标签 |
| `--zi-color-text-dim` | ≥ 3:1 | 辅助 / 占位 / 单位 |
| `--zi-color-text-inverse` | ≥ 7:1 | 反色底文本 |

### 3.4 颜色 · 强调 `--zi-color-accent-*`
`--zi-color-accent` · `--zi-color-accent-hover` · `--zi-color-accent-fg`(accent 上的文字)

### 3.5 颜色 · 状态 `--zi-color-{success|warning|danger}`
`--zi-color-success` · `--zi-color-warning` · `--zi-color-danger` · `--zi-color-danger-hover`
> 状态色仅作前景或 1px 边框，不大面积填充。

### 3.6 效果 `--zi-shadow-*` / `--zi-focus-ring`
| Token | 用途 |
|---|---|
| `--zi-shadow-card` | 卡片 / 面板 |
| `--zi-shadow-pop` | 菜单 / 对话框 / 浮层(更深) |
| `--zi-focus-ring` | 键盘焦点 2px 环 |
> 格式 `<depth>, 0 0 0 1px <outline>`，双层：既给深度又在扁平底上勾轮廓。

---

## 4. Tier 1/共享 · 形状 / 密度 / 字体（全 preset 相同）

### 4.1 形状 `--zi-radius-*`
| Token | 值 | 用途 |
|---|---|---|
| `--zi-radius-sm` | 2px | tag / 按钮 / 输入 |
| `--zi-radius-md` | 3px | 面板 |
| `--zi-radius-lg` | 4px | 弹层 |
| `--zi-radius-card` | 6px | 大卡片 |

### 4.2 间距刻度 `--zi-space-*`（8 基准）
| Token | 值 | | Token | 值 |
|---|---|---|---|---|
| `--zi-space-1` | 2px | | `--zi-space-4` | 8px(基准 gap)|
| `--zi-space-2` | 4px | | `--zi-space-5` | 12px |
| `--zi-space-3` | 6px | | `--zi-space-6` | 16px |
| | | | `--zi-space-7` | 24px |

### 4.3 字号 `--zi-font-size-*` / 字重 / 字体栈
| Token | 值 |
|---|---|
| `--zi-font-size-xs` | 12px(图注 / 状态栏)|
| `--zi-font-size-sm` | 12px(小标签 / badge)|
| `--zi-font-size-md` | 13px(正文)|
| `--zi-font-size-lg` | 15px(二级标题)|
| `--zi-font-size-xl` | 18px(一级标题)|
| `--zi-font-size-2xl` | 24px(Hero)|
| `--zi-font-weight-medium` | 500 |
| `--zi-font-weight-semibold` | 600 |
| `--zi-font-family-sans` | "Segoe UI Variable Text", "SF Pro Text", "Noto Sans", … |
| `--zi-font-family-mono` | "Iosevka Term", "JetBrains Mono", "SF Mono", … |

### 4.4 密度 `--zi-control-*`（控件内边距）
| Token | 值 | Token | 值 |
|---|---|---|---|
| `--zi-control-pad-y` | 5px | `--zi-control-pad-x` | 13px |
| `--zi-control-pad-y-sm` | 3px | `--zi-control-pad-x-sm` | 9px |
| `--zi-control-pad-y-lg` | 7px | `--zi-control-pad-x-lg` | 16px |
| `--zi-input-pad-y` | 4px | `--zi-input-pad-x` | 8px |

---

## 5. Tier 3 · 组件 token（组件契约）

复杂组件把自身可定制的**结构属性**暴露为 `--zi-<component>-*` 组件 token，皮肤通过覆盖它们换样式而**不必碰组件 CSS**。两类写法，用途不同：

| 写法 | 用途 | 皮肤能否在 `:root` 覆盖 |
|---|---|---|
| 组件选择器内**声明** `--zi-btn-bg: …` | 内部接线 / 变体改写（`.btn--primary` 改 `--zi-btn-bg`）| 否（局部声明会压过继承）|
| 属性里**只引用 + fallback** `var(--zi-btn-shadow, none)` | 全局可换肤的结构旋钮 | ✅ 是（`:root` 设值会继承进来）|

> **铁律**：凡是希望「皮肤能全局覆盖」的组件 token，组件里**只能用 `var(--token, 默认)` 引用，绝不能在组件选择器上声明默认值** —— 否则局部声明会屏蔽掉皮肤在 `:root` 的设置。

### 按钮契约（`.zi-btn` / `.btn`）
| Token | 默认 | 说明 |
|---|---|---|
| `--zi-btn-bg` / `-fg` / `-border` | 语义色 | 底/字/边色（变体内部改写）|
| `--zi-btn-bg-hover` / `-border-hover` / `-bg-active` | 语义色 | 交互态 |
| `--zi-btn-shadow` | `none` | **结构旋钮**：阴影 |
| `--zi-btn-border-width` | `1px` | **结构旋钮**：边框宽度 |

### 示例：新皮肤要「按钮带阴影」
皮肤无需改任何 CSS，只在 preset 里多写一个结构旋钮即可（`applyPreset` 会把它写到 `:root`，自动级联进所有 `.btn`）：

```js
const acme = {
  light: {
    /* …22 个语义色… */
    "--zi-btn-shadow": "var(--zi-shadow-card)",   // ← 全局给按钮加阴影
    "--zi-btn-border-width": "1px",
  },
  dark: { /* … */ },
};
```

只想给某个区域的按钮加阴影？在该容器上设 `style="--zi-btn-shadow: var(--zi-shadow-card)"` 即可，作用域自动限定。

---

## 6. 阴影 / 深度使用规范（扁平 + 功能性层级）

| 处理 | 适用 | 语义 |
|---|---|---|
| `--zi-shadow-pop` | 对话框 / 菜单 / 弹出 / 命令面板 / 抽屉 / toast | 浮于内容之上 |
| `inset 0 1px 3px …` 内凹 | input / textarea / num-input / combobox / tag-input | 可编辑、可输入 |
| 无阴影(纯平) | 按钮 / select / toggle-group / switch / 面板 / 工具栏 / 标签 | 静态控件 |

> 规则：**能打字的才内凹，纯选择 / 静态的扁平，浮层才投影。**

---

## 7. 定制皮肤 (Authoring a Skin)

一套皮肤 = 给 Tier 2 语义 token 提供 light / dark 两组值。最小骨架：

```js
const mySkin = {
  title: "Acme", tagline: "brand", useCase: "…",
  light: {
    "--zi-color-bg":"#ffffff", "--zi-color-bg-subtle":"…", "--zi-color-bg-surface":"…",
    "--zi-color-bg-hover":"…", "--zi-color-bg-active":"…", "--zi-color-bg-inverse":"…",
    "--zi-color-border":"…", "--zi-color-border-strong":"…", "--zi-color-divider":"…",
    "--zi-color-text":"…", "--zi-color-text-muted":"…", "--zi-color-text-dim":"…", "--zi-color-text-inverse":"…",
    "--zi-color-accent":"…", "--zi-color-accent-hover":"…", "--zi-color-accent-fg":"…",
    "--zi-color-success":"…", "--zi-color-warning":"…", "--zi-color-danger":"…", "--zi-color-danger-hover":"…",
    "--zi-shadow-card":"…", "--zi-shadow-pop":"…", "--zi-focus-ring":"…",
  },
  dark: { /* 同结构 */ },
};
applyPreset("acme", "light");
```

**皮肤作者只需提供以上语义色 token（约 23 个）× 2 模式**；形状 / 密度 / 字体 / 角色配对走全局共享，无需重复。
校验清单：① light 表面逐级变深、hover 深于 chrome；② 三级文本达对比目标；③ accent-fg 在 accent 上 ≥ 4.5:1。

---

## 8. 迁移记录（已完成 · v1.0）

代码仓库已于 v1.0 全量迁移至 `--zi-` 命名空间 —— `presets.js` / `styles.css` / `theme-switch.js` 及全部页面均使用规范名，裸命名已清除。下表为对照存档：

| 旧(裸名) | 新(规范) |
|---|---|
| `--bg-base / -subtle / -surface / -hover / -active / -inverse` | `--zi-color-bg[-*]` |
| `--border / -strong`, `--divider` | `--zi-color-border[-strong]`, `--zi-color-divider` |
| `--text / -muted / -dim / -inverse` | `--zi-color-text[-*]` |
| `--accent / -hover / -fg` | `--zi-color-accent[-*]` |
| `--success / --warning / --danger[-hover]` | `--zi-color-*` |
| `--r-sm/md/lg/card` | `--zi-radius-*` |
| `--f-xs…2xl`, `--fw-*` | `--zi-font-size-*`, `--zi-font-weight-*` |
| `--font-stack / --mono-stack` | `--zi-font-family-sans / -mono` |
| `--btn-p* / --input-p*`, `--gap` | `--zi-control-* / --zi-input-*`, `--zi-space-4` |
| `--shadow-card/pop`, `--focus-ring` | `--zi-shadow-*`, `--zi-focus-ring` |

> 命名迁移已全量完成并验证：组件 CSS 现统一引用角色层(§2.5)与无前缀结构化名，仓库内无残留裸名 / `--zi-` 前缀。
