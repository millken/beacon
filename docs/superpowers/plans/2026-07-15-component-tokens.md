# Beacon 组件 Token 体系 v2 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按 `docs/superpowers/specs/2026-07-15-component-tokens-design.md`（规范 v2），把 components/ 重构为「两级契约」组件 token 体系：Tier-3a 共享控件解剖层 + Tier-3b 分化点组件 token，24 个组件 CSS 文件 + 23 个演示页，机器可校验。

**Architecture:** 三级 @import 装配（styles.css → colors_and_type.css + components/components.css → components/css/*.css）。结构旋钮统一注册在 colors_and_type.css §4（`:root`，单一事实来源），组件 CSS 只有引用位；接线 token 在组件根选择器声明、变体一行改写。

**Tech Stack:** 纯 CSS（无构建工具）、静态 HTML 演示页、bash+python3 校验脚本。浏览器目检用任意本地 file:// 打开。

## Global Constraints（每个任务隐含遵守）

- 命名语法：`--<组件>-<部位?>-<属性>[-<状态>]`；属性词汇封闭集 `bg fg border radius shadow h w pad-x pad-y pad gap indent size`；状态永远最后；组件段全词（豁免 `kbd` `led`）
- 铁律 R1：组件 CSS 禁止十六进制/`rgb()` 字面量（`transparent`/`currentColor` 除外）
- 铁律 R2：组件 CSS 只可引用：自身 token、§4 注册旋钮（跨组件可用）、Tier-3a、Tier-2；禁止引用其他组件的接线 token
- 铁律 R3：§4 注册的旋钮不得出现在任何组件选择器的声明位
- 铁律 R4：用了表面角色必须配对 `-foreground`
- 结构旋钮**不写 fallback**（§4 是唯一默认值来源）
- class 命名 BEM-lite：`block--modifier`、`block-part`
- 改名映射（全局）：`.dt→.datagrid` `.tbl→.table` `.cb→.checkbox` `.sw→.switch` `.cmdk→.cmdp` `.split→.splitter` `.radio-ring→.radio` `.sb-*→.sidebar-*` `.acc-*→.accordion-*`
- 演示页保留 light/dark 切换（沿用现有页内 `data-theme` 切换按钮模式）
- 每个任务结束 `git add <涉及文件> && git commit`
- 视觉基准：`showcase/design-system.html`（只读参照，不改它）

---

### Task 1: Tier-3a 扩充 + §4 结构旋钮注册表（colors_and_type.css）

**Files:**
- Modify: `colors_and_type.css:35-49`（§2 DENSITY 末尾加 Tier-3a 新 token）
- Modify: `colors_and_type.css:72-76`（§4 整块替换为完整旋钮注册表）

**Interfaces:**
- Produces: 全部后续任务引用的旋钮名（见下方注册表，名字逐字使用）；Tier-3a 新增 `--control-radius` `--control-border-w`

- [ ] **Step 1: §2 DENSITY 块末尾（`--control-h-lg: 34px;` 行后）插入**

```css
  --control-radius: var(--radius-sm);   /* 控件统一圆角：按钮/输入/分段/标签共用 */
  --control-border-w: 1px;              /* 控件统一描边宽 */
```

- [ ] **Step 2: 用完整注册表替换 §4 块**

替换 `colors_and_type.css` 中从 `/* ===== 4) 组件 COMPONENT` 到 `--btn-active-shadow: …;` 行（含）的整块为：

```css
  /* ===== 4) 组件 COMPONENT —— 结构旋钮注册表（skin API · 唯一默认值来源）
     规则：组件 CSS 中只允许出现这些名字的「引用位」var(--x)，绝不允许声明位。
     皮肤在 :root 覆盖 = 全局生效；容器 style="--x: …" = 局部生效。 ===== */
  /* button */
  --btn-shadow: none;
  --btn-active-shadow: inset 0 1px 2px 0 rgba(0,0,0,0.15);
  --btn-radius: var(--control-radius);
  /* field */
  --field-radius: var(--control-radius);
  --field-shadow: var(--shadow-inset);
  /* selection */
  --switch-w: 34px;
  --switch-h: 18px;
  --slider-track-h: 4px;
  --segmented-gap: 2px;
  /* menu / combobox / cmdp（弹出选择族共用 menu 解剖） */
  --menu-item-h: 26px;
  --menu-pad: 4px;
  --menu-min-w: 160px;
  --cmdp-w: 560px;
  --cmdp-list-h: 280px;
  /* tag */
  --tag-radius: var(--control-radius);
  /* toolbar */
  --toolbar-h: 36px;
  --toolbar-gap: var(--space-2);
  --toolbar-bg: var(--color-bg-subtle);
  /* tabs */
  --tab-h: 32px;
  --tab-indicator-w: 2px;
  /* breadcrumb */
  --breadcrumb-gap: var(--space-2);
  /* tree */
  --tree-indent: 16px;
  --tree-row-h: 24px;
  /* table（标准表与 datagrid 共用） */
  --table-row-h: 32px;
  --table-head-h: 30px;
  --table-cell-pad-x: 10px;
  --table-zebra-bg: var(--color-bg-subtle);
  --datagrid-toolbar-h: var(--toolbar-h);
  /* splitter */
  --splitter-handle-size: 6px;
  --splitter-grip-color: var(--color-border-strong);
  /* overlay */
  --dialog-w: 440px;
  --dialog-pad: var(--space-6);
  --dialog-radius: var(--radius-lg);
  --drawer-w: 320px;
  --popover-min-w: 200px;
  /* colorpicker */
  --swatch-size: 18px;
  --swatch-gap: var(--space-2);
  --swatch-radius: var(--radius-sm);
  /* datepicker */
  --cal-cell-size: 28px;
  /* indicator */
  --led-size: 8px;
  --progress-h: 6px;
  --meter-h: 10px;
  /* feedback */
  --toast-w: 320px;
  /* code */
  --codeblock-pad: var(--space-5);
  --codeblock-bg: var(--color-bg);
  /* misc */
  --avatar-size-sm: 20px;
  --avatar-size-md: 28px;
  --avatar-size-lg: 40px;
  /* window / sidebar / shell */
  --titlebar-h: 38px;
  --win-btn-size: 12px;
  --sidebar-w: 220px;
  --sidebar-w-collapsed: 48px;
  --sidebar-item-h: 28px;
  --statusbar-h: 24px;
```

注意：`--btn-border-width` 从注册表移除（被 Tier-3a `--control-border-w` 收编）。旧名暂由 components.css 引用，Task 3 迁移；本任务不动 components.css。为过渡期不断链，在注册表 button 组末尾**临时保留**一行 `--btn-border-width: var(--control-border-w);`，Task 3 完成后删除（Task 3 Step 5 负责）。

- [ ] **Step 3: 验证 —— token 表自身健康**

```bash
cd /workspace/Codes/github.com/millken/beacon
# 注册表条目数（54 旋钮 + 1 临时行 = 55）
sed -n '/===== 4) 组件 COMPONENT/,/===== 5)/p' colors_and_type.css | grep -cE '^\s*--[a-z]'
# 现有页面未破坏：浏览器打开 components/index.html 与 tokens.html 目检 light/dark
```
Expected: 55；页面渲染无异常（此时组件层尚未消费新旋钮，纯增量）。

- [ ] **Step 4: Commit**

```bash
git add colors_and_type.css && git commit -m "feat(tokens): Tier-3a 控件解剖层扩充 + §4 结构旋钮注册表"
```

---

### Task 2: 拆分骨架 + 聚合器 + 校验脚本 + 演示页模板

**Files:**
- Create: `components/css/`（24 文件，机械拆分，本任务不重构规则）
- Modify: `components/components.css`（→ 纯 @import 聚合器）
- Create: `tools/check-tokens.sh`
- Create: `components/_page-template.html`

**Interfaces:**
- Consumes: Task 1 的 §4 注册表（校验脚本从中提取旋钮清单）
- Produces: 拆分后的 24 文件（后续任务逐一重构）；`tools/check-tokens.sh [file...]`（无参=全量，退出码 0=零违例）；页面模板（后续演示页复制填充）

- [ ] **Step 1: 写拆分脚本并执行**（一次性脚本，不入库）

```bash
cd /workspace/Codes/github.com/millken/beacon && python3 - <<'PY'
import re,os
src=open('components/components.css').read()
# 族→文件 分派表（按首选择器前缀匹配，顺序即优先级）
ASSIGN=[
 (r'\.(btn|icon-btn)\b','button.css'),
 (r'\.(field|input|select|num-input|search-input|token-input|dropzone)\b','field.css'),
 (r'\.(cb|sw|choice|segmented|slider|rating|stepper|radio)\b','selection.css'),
 (r'\.(listbox|combobox)\b','combobox.css'),
 (r'\.(tag|chip|badge|pill|kbd)\b','tag.css'),
 (r'\.(toolbar)\b','toolbar.css'),
 (r'\.(tabs?-|tab)\b','tabs.css'),
 (r'\.(breadcrumb|pagination)\b','breadcrumb.css'),
 (r'\.(tree)\b','tree.css'),
 (r'\.(tbl|dt)\b','table.css'),
 (r'\.(split)\b','splitter.css'),
 (r'\.(modal-overlay|dialog|drawer|popover|tooltip)\b','overlay.css'),
 (r'\.(menu)\b','menu.css'),
 (r'\.(cmdk)\b','cmdp.css'),
 (r'\.(swatch)','colorpicker.css'),
 (r'\.(calendar|cal-)','datepicker.css'),
 (r'\.(led|meter|gauge|ring|spinner|progress|stat-card)\b','indicator.css'),
 (r'\.(alert|note-banner|toast|timeline|skeleton)\b','feedback.css'),
 (r'\.(codeblock|kv)\b','code.css'),
 (r'\.(empty)\b','empty.css'),
 (r'\.(win-|titlebar)','window.css'),
 (r'\.(sidebar|sb-)','sidebar.css'),
 (r'\.(shell|statusbar)\b','shell.css'),
]
DEFAULT='misc.css'
# 解析顶层块（注释附着到下一个规则）
blocks=[];i=0;buf=''
depth=0
while i<len(src):
    c=src[i]
    buf+=c
    if c=='{': depth+=1
    elif c=='}':
        depth-=1
        if depth==0: blocks.append(buf); buf=''
    i+=1
if buf.strip(): blocks.append(buf)
out={}
for b in blocks:
    m=re.search(r'([^{]*)\{', b)
    sel=m.group(1) if m else b
    tgt=DEFAULT
    for pat,f in ASSIGN:
        if re.search(pat,sel): tgt=f; break
    out.setdefault(tgt,[]).append(b)
os.makedirs('components/css',exist_ok=True)
FILES=['button.css','field.css','selection.css','combobox.css','tag.css','toolbar.css','tabs.css',
'breadcrumb.css','tree.css','table.css','splitter.css','overlay.css','menu.css','cmdp.css',
'colorpicker.css','datepicker.css','indicator.css','feedback.css','code.css','empty.css',
'window.css','sidebar.css','shell.css','misc.css']
for f in FILES:
    open('components/css/'+f,'w').write((''.join(out.get(f,[]))).strip()+'\n')
print({f:len(out.get(f,[])) for f in FILES})
PY
```
Expected: 打印各文件块数；`sidebar.css`/`shell.css`/`window.css` 可能为 0-2 块（缺口组件，后续任务新建内容）。

- [ ] **Step 2: 聚合器改写**——`components/components.css` 全文替换为：

```css
/* =====================================================================
   Beacon · components —— 聚合器（纯 @import，零规则）
   规范见 docs/superpowers/specs/2026-07-15-component-tokens-design.md
   ===================================================================== */
@import url('css/button.css');
@import url('css/field.css');
@import url('css/selection.css');
@import url('css/combobox.css');
@import url('css/tag.css');
@import url('css/toolbar.css');
@import url('css/tabs.css');
@import url('css/breadcrumb.css');
@import url('css/tree.css');
@import url('css/table.css');
@import url('css/splitter.css');
@import url('css/overlay.css');
@import url('css/menu.css');
@import url('css/cmdp.css');
@import url('css/colorpicker.css');
@import url('css/datepicker.css');
@import url('css/indicator.css');
@import url('css/feedback.css');
@import url('css/code.css');
@import url('css/empty.css');
@import url('css/window.css');
@import url('css/sidebar.css');
@import url('css/shell.css');
@import url('css/misc.css');
```

- [ ] **Step 3: 校验脚本** `tools/check-tokens.sh`（完整内容）：

```bash
#!/usr/bin/env bash
# check-tokens.sh [components/css/foo.css ...]   无参 = 全量
# 退出码: 0 = 零违例。铁律 R1/R2/R3 硬错误；R4 警告。
cd "$(dirname "$0")/.." || exit 1
python3 - "$@" <<'PY'
import re,sys,glob
files=sys.argv[1:] or sorted(glob.glob('components/css/*.css'))
tok=open('colors_and_type.css').read()
sec4=re.search(r'===== 4\) 组件 COMPONENT.*?(?==+ 5\) 语义)',tok,re.S).group(0)
knobs=set(re.findall(r'(--[a-z][a-z0-9-]*)\s*:',sec4))
globals_=set(re.findall(r'(--[a-z][a-z0-9-]*)\s*:',tok))
def strip(css): return re.sub(r'/\*.*?\*/', lambda m: '\n'*m.group(0).count('\n'), css, flags=re.S)
decl={f:set(re.findall(r'(--[a-z][a-z0-9-]*)\s*:',strip(open(f).read()))) for f in files}
allfiles=sorted(glob.glob('components/css/*.css'))
decl_all={f:set(re.findall(r'(--[a-z][a-z0-9-]*)\s*:',strip(open(f).read()))) for f in allfiles}
err=0;warn=0
for f in files:
    css=strip(open(f).read())
    for n,line in enumerate(css.split('\n'),1):
        # R1 字面量
        if re.search(r'#[0-9a-fA-F]{3,8}\b|rgba?\(',line):
            print(f'R1 {f}:{n}: 颜色字面量: {line.strip()[:80]}');err+=1
        # R3 旋钮声明位（行首或 { / ; 之后；var() 引用位不匹配）
        for m in re.finditer(r'(?:^|[{;])\s*(--[a-z][a-z0-9-]*)\s*:',line):
            if m.group(1) in knobs:
                print(f'R3 {f}:{n}: 旋钮 {m.group(1)} 出现在声明位');err+=1
    # R2 引用他组件接线 token
    refs=set(re.findall(r'var\((--[a-z][a-z0-9-]*)',css))
    mine=decl_all.get(f,set())
    for r in refs:
        if r in knobs or r in globals_ or r in mine: continue
        owner=[g for g in allfiles if g!=f and r in decl_all[g]]
        if owner: print(f'R2 {f}: 引用他组件接线 token {r}（属 {owner[0]}）');err+=1
        else: print(f'R2 {f}: 引用未知 token {r}');err+=1
    # R4 前景配对（警告）
    for blk in re.findall(r'\{[^}]*\}',css):
        for role in ('--primary','--destructive'):
            if f'background: var({role})' in blk and f'var({role}-foreground)' not in blk:
                print(f'R4 {f}: background:var({role}) 未配对 {role}-foreground（警告）');warn+=1
# 聚合器纯净性
agg=strip(open('components/components.css').read())
for n,line in enumerate(agg.split('\n'),1):
    if line.strip() and not line.strip().startswith('@import'):
        print(f'AGG components.css:{n}: 聚合器含非 @import 内容');err+=1
print(f'== {err} error(s), {warn} warning(s) ==')
sys.exit(1 if err else 0)
PY
```

```bash
chmod +x tools/check-tokens.sh
```

- [ ] **Step 4: 基线校验（预期失败 = 现状违例可见）**

```bash
tools/check-tokens.sh; echo "exit=$?"
```
Expected: exit=1，报出未重构文件的 R1 字面量等（这是重构任务的 TODO 清单，记录数量即可）。聚合器 AGG 检查必须已为 0。

- [ ] **Step 5: 演示页模板** `components/_page-template.html`（完整内容）：

```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>__TITLE__ · Beacon GUI 组件</title>
<link rel="stylesheet" href="../colors_and_type.css" />
<link rel="stylesheet" href="components.css" />
<style>
  body { margin:0; padding:32px 40px 80px; background:var(--background); color:var(--foreground);
         font:400 var(--font-size-md)/var(--leading-normal) var(--font-family-sans); }
  .page-head { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
  .page-head h1 { font-size:var(--font-size-xl); margin:0; }
  .page-head .crumb { color:var(--color-text-dim); font-family:var(--font-family-mono); font-size:var(--font-size-xs); }
  .theme-toggle { margin-left:auto; }
  .demo-section { margin-top:28px; }
  .demo-section > h2 { font-size:var(--font-size-lg); border-bottom:1px solid var(--color-divider); padding-bottom:6px; }
  .demo-row { display:flex; flex-wrap:wrap; align-items:center; gap:12px; margin:14px 0; }
  .demo-note { color:var(--color-text-muted); font-size:var(--font-size-sm); max-width:70ch; }
</style>
</head>
<body>
<header class="page-head">
  <span class="crumb"><a href="index.html" style="color:inherit">components</a> / __SLUG__</span>
  <h1>__TITLE__</h1>
  <button class="btn btn--sm theme-toggle" onclick="
    var h=document.documentElement; h.dataset.theme=h.dataset.theme==='dark'?'light':'dark'">
    Light / Dark</button>
</header>
<!-- __SECTIONS__ ：每个组件形态一个 .demo-section（h2 + demo-row + demo-note） -->
</body>
</html>
```

- [ ] **Step 6: 视觉冒烟**：浏览器打开 `components/index.html`——拆分后（同文件内规则顺序未变）渲染应与拆分前一致；light/dark 均检查。

- [ ] **Step 7: Commit**

```bash
git add components/ tools/check-tokens.sh
git commit -m "refactor(components): 机械拆分 24 文件 + 纯 @import 聚合器 + check-tokens 校验脚本 + 页面模板"
```

---

### Task 3: button.css 重构 + buttons.html

**Files:**
- Modify: `components/css/button.css`
- Create: `components/buttons.html`（重写自 `components/button.html`）
- Delete: `components/button.html`
- Modify: `colors_and_type.css`（删除 Task 1 遗留的 `--btn-border-width` 临时行）

**Interfaces:**
- Consumes: §4 旋钮 `--btn-shadow --btn-active-shadow --btn-radius`；Tier-3a `--control-h-* --control-pad-* --control-radius --control-border-w`
- Produces: 接线 token `--btn-bg --btn-fg --btn-border --btn-bg-hover --btn-border-hover --btn-bg-active`（`.btn` 私有）；class API `.btn .btn--primary .btn--soft .btn--danger .btn--ghost .btn--outline .btn--icon .btn--sm .btn--lg .icon-btn`

- [ ] **Step 1: 校验现状（预期失败）**

```bash
tools/check-tokens.sh components/css/button.css; echo "exit=$?"
```
Expected: exit=1（R1 字面量若干）。

- [ ] **Step 2: 重构 `.btn` 根选择器 + 变体为接线模式**——button.css 头部改为：

```css
/* button —— 接线: --btn-bg/-fg/-border(+hover/active) · 旋钮: --btn-shadow/-active-shadow/-radius */
.btn {
  --btn-bg: var(--secondary);
  --btn-fg: var(--secondary-foreground);
  --btn-border: var(--color-border);
  --btn-bg-hover: var(--color-secondary-hover);
  --btn-border-hover: var(--color-border-strong);
  --btn-bg-active: var(--color-secondary-active);
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  height: var(--control-h-md);
  padding: var(--control-pad-y) var(--control-pad-x);
  background: var(--btn-bg); color: var(--btn-fg);
  border: var(--control-border-w) solid var(--btn-border);
  border-radius: var(--btn-radius);
  box-shadow: var(--btn-shadow);
  font: var(--font-weight-medium) var(--font-size-sm)/1 var(--font-family-sans);
  cursor: pointer; user-select: none;
  transition: background var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard);
}
.btn:hover  { background: var(--btn-bg-hover); border-color: var(--btn-border-hover); }
.btn:active { background: var(--btn-bg-active); box-shadow: var(--btn-active-shadow); }
.btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.btn:disabled { opacity: .55; cursor: not-allowed; }

.btn--primary { --btn-bg: var(--color-primary); --btn-fg: var(--primary-foreground);
  --btn-border: var(--color-primary); --btn-bg-hover: var(--color-primary-hover);
  --btn-border-hover: var(--color-primary-hover); --btn-bg-active: var(--color-primary-active); }
.btn--soft { --btn-bg: var(--color-primary-light-default); --btn-fg: var(--color-primary);
  --btn-border: transparent; --btn-bg-hover: var(--color-primary-light-hover);
  --btn-border-hover: transparent; --btn-bg-active: var(--color-primary-light-active); }
.btn--danger { --btn-bg: var(--destructive); --btn-fg: var(--destructive-foreground);
  --btn-border: var(--destructive); --btn-bg-hover: var(--destructive-hover);
  --btn-border-hover: var(--destructive-hover); --btn-bg-active: var(--color-danger-active); }
.btn--ghost { --btn-bg: transparent; --btn-border: transparent;
  --btn-bg-hover: var(--subtle); --btn-border-hover: transparent; --btn-bg-active: var(--color-bg-active); }
.btn--ghost:active { box-shadow: none; }
.btn--outline { --btn-bg: transparent; --btn-fg: var(--color-primary); --btn-border: var(--color-primary);
  --btn-bg-hover: var(--color-primary-light-default); --btn-border-hover: var(--color-primary); }
.btn--sm { height: var(--control-h-sm); padding: var(--control-pad-y-sm) var(--control-pad-x-sm); font-size: var(--font-size-2xs); }
.btn--lg { height: var(--control-h-lg); padding: var(--control-pad-y-lg) var(--control-pad-x-lg); font-size: var(--font-size-md); }
.btn--icon { width: var(--control-h-md); padding: 0; }
.btn--icon.btn--sm { width: var(--control-h-sm); }
.btn--icon.btn--lg { width: var(--control-h-lg); }
```

保留原文件中 loading（spinner）与 `.icon-btn` 规则，按替换规则清理：原 `var(--color-primary)` 等**作背景/边框/文字用途且属按钮语境**的引用一律改经接线 token；残余字面量按语义映射到 Tier-2（如 `rgba(0,0,0,.15)` 阴影类 → 已被 `--btn-active-shadow` 收编，删除本地定义）。

- [ ] **Step 3: 删除 colors_and_type.css 中临时行** `--btn-border-width: var(--control-border-w);`，并全库确认无残留引用：

```bash
grep -rn "btn-border-width" --include="*.css" --include="*.html" . | grep -v showcase/ | grep -v '.git'
```
Expected: 无输出。

- [ ] **Step 4: 校验通过**

```bash
tools/check-tokens.sh components/css/button.css; echo "exit=$?"
```
Expected: `== 0 error(s)…` exit=0。

- [ ] **Step 5: buttons.html**——复制 `_page-template.html`，`__TITLE__`=Buttons、`__SLUG__`=buttons，分区（沿用旧 button.html 的演示实例、替换新类名）：变体一览（default/primary/soft/danger/ghost/outline）、尺寸三档、icon-only、loading、禁用态、旋钮演示区（`<div style="--btn-radius: 0px">` 与 `--btn-shadow: var(--shadow-card)` 两个容器对比）。删除 `components/button.html`。

- [ ] **Step 6: 视觉目检** buttons.html light/dark；对照 `showcase/design-system.html#buttons`。

- [ ] **Step 7: Commit**

```bash
git add components/ colors_and_type.css && git commit -m "refactor(button): 接线+旋钮契约，buttons.html"
```

---

### Task 4: field.css 重构 + forms.html

**Files:**
- Modify: `components/css/field.css`
- Create: `components/forms.html`（合并重写自 `components/forms.html` + `components/input.html`）
- Delete: `components/input.html`

**Interfaces:**
- Consumes: 旋钮 `--field-radius --field-shadow`；Tier-3a `--input-pad-* --control-h-* --control-border-w`；Tier-2 `--color-input-bg --input`(border 角色) `--focus-ring`
- Produces: 接线 `--field-bg --field-border`（field 族私有）；class `.field .input .input--flat .num-input .search-input .token-input .select .dropzone`

- [ ] **Step 1: 校验现状（预期失败）** `tools/check-tokens.sh components/css/field.css`
- [ ] **Step 2: 重构头部**：

```css
/* field —— 接线: --field-bg/-border · 旋钮: --field-radius/-shadow */
.input, .select, .num-input, .search-input, .token-input {
  --field-bg: var(--color-input-bg);
  --field-border: var(--input);
  background: var(--field-bg);
  border: var(--control-border-w) solid var(--field-border);
  border-radius: var(--field-radius);
  box-shadow: var(--field-shadow);
  padding: var(--input-pad-y) var(--input-pad-x);
  color: var(--foreground);
  font: 400 var(--font-size-sm)/1.4 var(--font-family-sans);
}
.input:focus-visible, .select:focus-visible, .num-input:focus-within,
.search-input:focus-within, .token-input:focus-within {
  outline: none; box-shadow: var(--focus-ring); border-color: var(--ring);
}
.input--flat { --field-bg: transparent; --field-border: transparent; box-shadow: none; }
.input--flat:focus-visible { --field-bg: var(--color-input-bg); box-shadow: var(--field-shadow), var(--focus-ring); }
```

其余规则（`.field` 布局、num-input spinner、dropzone、token-input chip 区）按替换规则清理字面量与直连色（背景/边框经接线 token；尺寸经 Tier-3a）。
- [ ] **Step 3: 校验通过** exit=0
- [ ] **Step 4: forms.html**：模板填充，分区：text input（默认/flat/disabled/invalid）、select、num-input、search、token-input、dropzone、`.field` 表单布局组合、旋钮演示（`--field-radius:0` 容器）。删除 input.html。
- [ ] **Step 5: 目检 + Commit** `git commit -m "refactor(field): 接线+旋钮契约，forms.html 合并 input 页"`

---

### Task 5: selection.css 重构 + selection.html

**Files:**
- Modify: `components/css/selection.css`
- Create: `components/selection.html`（重写自 `components/choice.html`）
- Delete: `components/choice.html`

**Interfaces:**
- Consumes: 旋钮 `--switch-w --switch-h --slider-track-h --segmented-gap`；Tier-3a；Tier-2 `--control-selected-ring --shadow-well --track-bg`
- Produces: 接线 `--selection-checked-bg`（族共用，默认 `var(--color-primary)`）；class `.checkbox .radio .switch .segmented .choice .slider .rating .stepper`

- [ ] **Step 1: 校验现状（预期失败）**
- [ ] **Step 2: 重构**——改名 `.cb→.checkbox`、`.sw→.switch`、`.radio-ring→.radio`；族根接线：

```css
/* selection —— 接线: --selection-checked-bg · 旋钮: --switch-w/-h --slider-track-h --segmented-gap */
.checkbox, .radio, .switch, .segmented, .choice, .slider, .rating, .stepper {
  --selection-checked-bg: var(--color-primary);
}
.switch { width: var(--switch-w); height: var(--switch-h); }
.switch[data-on], .checkbox:checked, .checkbox[data-checked] { background: var(--selection-checked-bg); }
.slider { height: var(--slider-track-h); background: var(--track-bg); box-shadow: var(--shadow-well); }
.segmented { gap: var(--segmented-gap); }
```
（以上为契约骨架，与原规则合并时保留既有形态细节；checked/selected 一律经 `--selection-checked-bg`。）
- [ ] **Step 3: 校验通过**
- [ ] **Step 4: selection.html**：checkbox/radio/switch/segmented/choice 卡片选择/slider/rating/stepper 各一分区 + 旋钮演示（`--switch-w:44px` 容器）。删除 choice.html。
- [ ] **Step 5: 目检 + Commit** `git commit -m "refactor(selection): 契约+全词类名，selection.html"`

---

### Task 6: tag.css + toolbar.css + breadcrumb.css + 三个演示页

**Files:**
- Modify: `components/css/tag.css` `components/css/toolbar.css` `components/css/breadcrumb.css`
- Create: `components/tags.html` `components/toolbar.html` `components/breadcrumb.html`
- Modify: `components/nav.html` → Delete（其 breadcrumb/pagination/toolbar 内容迁入新页）；`components/misc.html` 中 chip 演示迁入 tags.html（misc.html 本身 Task 7 处理）

**Interfaces:**
- Consumes: 旋钮 `--tag-radius --toolbar-h --toolbar-gap --toolbar-bg --breadcrumb-gap`
- Produces: 接线 `--tag-bg --tag-fg --tag-border`（tag/chip/badge/pill 同构共用）；class 不变（`.tag .chip .badge .pill .kbd .toolbar .toolbar-sep .breadcrumb .pagination`）

- [ ] **Step 1: 校验现状（预期失败）**（三文件）
- [ ] **Step 2: tag.css 接线**：

```css
/* tag 族 —— 接线: --tag-bg/-fg/-border · 旋钮: --tag-radius */
.tag, .chip, .badge, .pill {
  --tag-bg: var(--muted);
  --tag-fg: var(--muted-foreground);
  --tag-border: var(--color-border);
  background: var(--tag-bg); color: var(--tag-fg);
  border: var(--control-border-w) solid var(--tag-border);
  border-radius: var(--tag-radius);
}
.tag--primary, .badge--primary { --tag-bg: var(--color-primary-light-default); --tag-fg: var(--color-primary); --tag-border: transparent; }
.tag--danger, .badge--danger  { --tag-bg: var(--color-danger-light-default); --tag-fg: var(--color-danger); --tag-border: transparent; }
.badge--success { --tag-bg: var(--color-success-light-default); --tag-fg: var(--color-success); --tag-border: transparent; }
.badge--warning { --tag-bg: var(--color-warning-light-default); --tag-fg: var(--color-warning); --tag-border: transparent; }
.chip--accent   { --tag-bg: var(--color-primary-light-default); --tag-fg: var(--color-primary); }
.pill { border-radius: var(--radius-full); }
```
toolbar.css：`height: var(--toolbar-h); gap: var(--toolbar-gap); background: var(--toolbar-bg);`；breadcrumb.css：`gap: var(--breadcrumb-gap)`；其余按替换规则清理。`.kbd` 保持语义层直连（无接线需求）。
- [ ] **Step 3: 校验通过**（三文件 exit=0）
- [ ] **Step 4: 三个演示页**（模板填充；tags.html 含 tag/chip/badge/pill/kbd 全形态与变体；toolbar.html 含混排按钮/分隔/搜索的桌面工具栏实例；breadcrumb.html 含面包屑+分页）。删除 nav.html。
- [ ] **Step 5: 目检 + Commit** `git commit -m "refactor(tag/toolbar/breadcrumb): 契约化 + 三演示页，撤销 nav.html"`

---

### Task 7: tabs.css + tree.css + misc.css + 三个演示页

**Files:**
- Modify: `components/css/tabs.css` `components/css/tree.css` `components/css/misc.css`
- Create: `components/tabs.html`(重写) `components/tree.html`(重写) `components/misc.html`(重写：avatar/divider/collapsible/accordion/list)

**Interfaces:**
- Consumes: 旋钮 `--tab-h --tab-indicator-w --tree-indent --tree-row-h --avatar-size-sm/-md/-lg`
- Produces: 接线 `--tab-fg --tab-fg-selected`；class `.tabs-list .tab .tab-panel .tree .tree-row .tree-children .avatar .divider .collapsible .accordion-*`（`.acc-*` 改名）

- [ ] **Step 1: 校验现状（预期失败）**
- [ ] **Step 2: 重构**：

```css
/* tabs —— 接线: --tab-fg/-fg-selected · 旋钮: --tab-h --tab-indicator-w */
.tab { --tab-fg: var(--muted-foreground); --tab-fg-selected: var(--foreground);
  height: var(--tab-h); color: var(--tab-fg); }
.tab[aria-selected="true"], .tab.is-selected { color: var(--tab-fg-selected);
  box-shadow: inset 0 calc(-1 * var(--tab-indicator-w)) 0 var(--ring); }
/* tree —— 旋钮: --tree-indent --tree-row-h */
.tree-row { height: var(--tree-row-h); }
.tree-children { padding-left: var(--tree-indent); }
/* misc: avatar 尺寸经旋钮 */
.avatar { width: var(--avatar-size-md); height: var(--avatar-size-md); }
.avatar--sm { width: var(--avatar-size-sm); height: var(--avatar-size-sm); }
.avatar--lg { width: var(--avatar-size-lg); height: var(--avatar-size-lg); }
```
`.acc-item/.acc-trigger/.acc-chev/.acc-content → .accordion-item/-trigger/-chevron/-content`。
- [ ] **Step 3: 校验通过**（三文件）
- [ ] **Step 4: 三演示页**重写（tabs 含指示条/禁用/密集形态；tree 含展开/选中/拖长内容 + `--tree-row-h:20px` 密度演示；misc 含 avatar 三档/stack、divider、collapsible、accordion、list）。
- [ ] **Step 5: 目检 + Commit** `git commit -m "refactor(tabs/tree/misc): 契约化 + accordion 全词类名"`

---

### Task 8: table.css 重构（.tbl→.table .dt→.datagrid）+ table.html

**Files:**
- Modify: `components/css/table.css`
- Create: `components/table.html`（重写）

**Interfaces:**
- Consumes: 旋钮 `--table-row-h --table-head-h --table-cell-pad-x --table-zebra-bg --datagrid-toolbar-h`
- Produces: class `.table .table--zebra .table--compact .table-cap .table-card .table-foot .datagrid .datagrid-toolbar .datagrid-scroll .datagrid-status .datagrid-foot .datagrid-wrapper`

- [ ] **Step 1: 校验现状（预期失败）**
- [ ] **Step 2: 重构**——全量改名（`.tbl→.table`、`.tbl-*→.table-*`、`.dt→.datagrid`、`.dt-*→.datagrid-*`）；尺寸接旋钮：

```css
.table td, .datagrid td { height: var(--table-row-h); padding: 0 var(--table-cell-pad-x); }
.table th, .datagrid th { height: var(--table-head-h); padding: 0 var(--table-cell-pad-x); }
.table--zebra tbody tr:nth-child(2n) { background: var(--table-zebra-bg); }
.table--compact { --table-row-h: 26px; }  /* 变体改写旋钮？——否：R3 禁止。改为直接规则： */
```
**注意 R3**：`.table--compact` 不得声明 `--table-row-h`（旋钮禁止声明位）。紧凑变体直接写 `height` 规则：`.table--compact td { height: 26px; }` 违反 R1？26px 非颜色、合法。选中行/hover 经 `--subtle`/`--color-bg-active`。datagrid 工具栏 `height: var(--datagrid-toolbar-h)`。
- [ ] **Step 3: 校验通过**
- [ ] **Step 4: table.html**重写：标准表（默认/zebra/compact/带 cap+foot/卡片式）与 datagrid（工具栏+滚动+状态栏+分页，静态演示）两大分区 + 旋钮演示（`--table-row-h:24px` 容器）。
- [ ] **Step 5: 目检 + Commit** `git commit -m "refactor(table): .table/.datagrid 契约化改名"`

---

### Task 9: overlay.css + menu.css 重构 + overlay.html + menu 页归并

**Files:**
- Modify: `components/css/overlay.css` `components/css/menu.css`
- Create: `components/overlay.html`（合并重写自 dialog.html + menu.html 的 popover/tooltip/drawer 部分）
- Delete: `components/dialog.html` `components/menu.html`（menu 演示并入 overlay.html 的 menu 分区）

**Interfaces:**
- Consumes: 旋钮 `--dialog-w --dialog-pad --dialog-radius --drawer-w --popover-min-w --menu-item-h --menu-pad --menu-min-w`；Tier-2 `--popover --popover-foreground --shadow-pop --color-overlay`
- Produces: 接线 `--dialog-icon-color`（primary/warning/danger 改写）、`--menu-item-fg`（danger 改写）；class 不变（dialog-* / drawer / popover / tooltip / modal-overlay / menu-*）

- [ ] **Step 1: 校验现状（预期失败）**
- [ ] **Step 2: 重构**：

```css
/* overlay —— 旋钮: --dialog-w/-pad/-radius --drawer-w --popover-min-w */
.dialog-surface { width: var(--dialog-w); max-width: calc(100vw - 48px);
  background: var(--popover); color: var(--popover-foreground);
  border: var(--control-border-w) solid var(--color-border);
  border-radius: var(--dialog-radius); box-shadow: var(--shadow-pop); }
.dialog-body { padding: var(--dialog-pad); }
.dialog-icon { --dialog-icon-color: var(--color-primary); color: var(--dialog-icon-color); }
.dialog-icon--warning { --dialog-icon-color: var(--color-warning); }
.dialog-icon--danger  { --dialog-icon-color: var(--color-danger); }
.modal-overlay { background: var(--color-overlay); }
.drawer { width: var(--drawer-w); }
.popover-panel { min-width: var(--popover-min-w); }
/* menu —— 接线: --menu-item-fg · 旋钮: --menu-item-h --menu-pad --menu-min-w */
.menu { min-width: var(--menu-min-w); padding: var(--menu-pad);
  background: var(--popover); box-shadow: var(--shadow-pop); }
.menu-item { --menu-item-fg: var(--popover-foreground);
  height: var(--menu-item-h); color: var(--menu-item-fg); }
.menu-item--danger { --menu-item-fg: var(--color-danger); }
```
- [ ] **Step 3: 校验通过**（两文件）
- [ ] **Step 4: overlay.html**：dialog（信息/确认/危险 + icon 变体）、drawer、popover、tooltip、menu（含分组/分隔/danger/禁用）、遮罩层级演示 + 旋钮演示（`--dialog-w:560px`）。删除 dialog.html、menu.html。
- [ ] **Step 5: 目检 + Commit** `git commit -m "refactor(overlay/menu): 契约化，dialog+menu 页归并 overlay.html"`

---

### Task 10: cmdp.css（.cmdk→.cmdp）+ combobox.css（新建）+ 两演示页

**Files:**
- Modify: `components/css/cmdp.css` `components/css/combobox.css`
- Create: `components/cmdp.html` `components/combobox.html`

**Interfaces:**
- Consumes: menu.css 的 §4 旋钮（`--menu-item-h --menu-pad --menu-min-w`）+ `--cmdp-w --cmdp-list-h`；field.css 模式（combobox 输入框与 `.input` 同构，但**不得引用** `--field-bg` 接线——用自身接线或 Tier-2）
- Produces: class `.cmdp .cmdp-input .cmdp-list .cmdp-item .cmdp-group .combobox .combobox-input .combobox-caret .listbox .listbox-item`

- [ ] **Step 1: 校验现状（预期失败；combobox.css 仅含拆分来的 .listbox 块）**
- [ ] **Step 2: cmdp.css**——`.cmdk*→.cmdp*` 全量改名；尺寸接旋钮：

```css
.cmdp { width: var(--cmdp-w); max-width: calc(100vw - 48px);
  background: var(--popover); border: var(--control-border-w) solid var(--color-border);
  border-radius: var(--dialog-radius); box-shadow: var(--shadow-pop); }
.cmdp-list { max-height: var(--cmdp-list-h); overflow-y: auto; padding: var(--menu-pad); }
.cmdp-item { height: var(--menu-item-h); }
.cmdp-item[aria-selected="true"] { background: var(--subtle); color: var(--subtle-foreground); }
```
- [ ] **Step 3: combobox.css 新建**（listbox 块并入）：

```css
/* combobox —— 输入 + 弹出 listbox；解剖复用 menu 旋钮 */
.combobox { position: relative; display: inline-flex; }
.combobox-input { background: var(--color-input-bg); border: var(--control-border-w) solid var(--input);
  border-radius: var(--field-radius); box-shadow: var(--shadow-inset);
  padding: var(--input-pad-y) var(--input-pad-x); padding-right: 26px;
  color: var(--foreground); font: 400 var(--font-size-sm)/1.4 var(--font-family-sans); }
.combobox-caret { position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  color: var(--color-text-dim); pointer-events: none; }
.combobox[data-open] .combobox-caret { color: var(--color-text); }
.listbox { min-width: var(--menu-min-w); padding: var(--menu-pad);
  background: var(--popover); color: var(--popover-foreground);
  border: var(--control-border-w) solid var(--color-border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-pop); }
.listbox-item { height: var(--menu-item-h); display: flex; align-items: center;
  padding: 0 var(--input-pad-x); border-radius: var(--radius-sm); cursor: pointer;
  font-size: var(--font-size-sm); }
.listbox-item:hover { background: var(--subtle); }
.listbox-item[aria-selected="true"] { background: var(--color-primary-light-default); color: var(--color-primary); }
```
- [ ] **Step 4: 校验通过**（两文件）
- [ ] **Step 5: 两演示页**：cmdp.html（静态展开的命令面板：输入、分组、选中项、kbd 快捷键列）；combobox.html（闭合/展开两态、多选带 chip、禁用）。
- [ ] **Step 6: 目检 + Commit** `git commit -m "feat(cmdp/combobox): .cmdp 改名 + combobox 组件补齐"`

---

### Task 11: indicator.css + feedback.css 重构 + 两演示页

**Files:**
- Modify: `components/css/indicator.css` `components/css/feedback.css`
- Create: `components/indicator.html`（重写自 progress.html + data.html 的 stat-card/led 部分）`components/feedback.html`（重写，吸收 toast.html、misc.html 的 skeleton）
- Delete: `components/progress.html` `components/toast.html`

**Interfaces:**
- Consumes: 旋钮 `--led-size --progress-h --meter-h --toast-w`；Tier-2 `--shadow-well --track-bg`
- Produces: 接线 `--indicator-color`（led/progress/meter/ring 族共用；success/warning/danger/rec 变体改写）、`--feedback-accent`（alert/note-banner/toast 共用；info/success/warning/danger 改写）

- [ ] **Step 1: 校验现状（预期失败）**
- [ ] **Step 2: indicator.css 接线**：

```css
/* indicator —— 接线: --indicator-color · 旋钮: --led-size --progress-h --meter-h */
.led, .progress, .meter, .ring, .gauge { --indicator-color: var(--color-primary); }
.led { width: var(--led-size); height: var(--led-size); border-radius: var(--radius-full);
  background: var(--color-text-dim); }
.led--on   { background: var(--indicator-color); --indicator-color: var(--color-success); }
.led--warn { --indicator-color: var(--color-warning); background: var(--indicator-color); }
.led--rec  { --indicator-color: var(--color-danger); background: var(--indicator-color); }
.progress { height: var(--progress-h); background: var(--track-bg); box-shadow: var(--shadow-well); }
.progress > i { background: var(--indicator-color); }
.progress--success { --indicator-color: var(--color-success); }
.progress--warning { --indicator-color: var(--color-warning); }
.progress--danger  { --indicator-color: var(--color-danger); }
.meter { height: var(--meter-h); background: var(--track-bg); box-shadow: var(--shadow-well); }
```
- [ ] **Step 3: feedback.css 接线**：

```css
/* feedback —— 接线: --feedback-accent · 旋钮: --toast-w */
.alert, .note-banner, .toast { --feedback-accent: var(--color-primary); }
.alert { border-left: 2px solid var(--feedback-accent); }
.alert--success, .note-banner--success, .toast--success { --feedback-accent: var(--color-success); }
.alert--warning, .note-banner--warning, .toast--warning { --feedback-accent: var(--color-warning); }
.alert--danger,  .note-banner--danger,  .toast--danger  { --feedback-accent: var(--color-danger); }
.toast { width: var(--toast-w); background: var(--color-bg-inverse); color: var(--color-text-inverse); }
```
- [ ] **Step 4: 校验通过**（两文件）
- [ ] **Step 5: 两演示页**（indicator：led 全态/progress 全态含 indeterminate/meter/ring/spinner/gauge/stat-card；feedback：alert/note-banner/toast-stack/timeline/skeleton）。删除 progress.html、toast.html。
- [ ] **Step 6: 目检 + Commit** `git commit -m "refactor(indicator/feedback): 状态色接线契约"`

---

### Task 12: code.css + empty.css + datepicker.css + colorpicker.css + 四演示页

**Files:**
- Modify: `components/css/code.css` `components/css/empty.css` `components/css/datepicker.css` `components/css/colorpicker.css`
- Create: `components/code.html` `components/empty.html` `components/datepicker.html` `components/colorpicker.html`
- Delete: `components/data.html`（kv/codeblock 迁入 code.html；stat-card 已入 indicator.html）

**Interfaces:**
- Consumes: 旋钮 `--codeblock-pad --codeblock-bg --cal-cell-size --swatch-size --swatch-gap --swatch-radius`
- Produces: class `.codeblock .kv .empty .calendar .cal-head .cal-nav .cal-grid .colorpicker .swatches .swatch`

- [ ] **Step 1: 校验现状（预期失败）**
- [ ] **Step 2: 重构 code/empty/datepicker**：codeblock `padding: var(--codeblock-pad); background: var(--codeblock-bg); font-family: var(--font-family-mono);`；calendar 单元 `width/height: var(--cal-cell-size)`，选中日 `background: var(--color-primary); color: var(--primary-foreground)`；empty 纯语义层。
- [ ] **Step 3: colorpicker.css 补齐**（swatches 块并入）：

```css
/* colorpicker —— 旋钮: --swatch-size --swatch-gap --swatch-radius */
.swatches { display: flex; flex-wrap: wrap; gap: var(--swatch-gap); }
.swatch { width: var(--swatch-size); height: var(--swatch-size);
  border-radius: var(--swatch-radius);
  border: var(--control-border-w) solid var(--color-border);
  cursor: pointer; }
.swatch[aria-selected="true"] { box-shadow: 0 0 0 2px var(--ring); }
.colorpicker { display: inline-flex; flex-direction: column; gap: var(--space-4);
  padding: var(--space-4); background: var(--popover);
  border: var(--control-border-w) solid var(--color-border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-pop); }
.colorpicker-input { display: flex; gap: var(--space-2); align-items: center; }
```
swatch 演示色值写在 HTML 的 `style="background:#…"` 里（演示数据，不受 R1 约束——R1 只管 components/css/）。
- [ ] **Step 4: 校验通过**（四文件）
- [ ] **Step 5: 四演示页** + 删除 data.html。
- [ ] **Step 6: 目检 + Commit** `git commit -m "feat(code/empty/datepicker/colorpicker): 契约化 + colorpicker 补齐"`

---

### Task 13: window.css 补齐 + splitter.css + sidebar.css（新建）+ shell.css（新建）+ 四演示页

**Files:**
- Modify: `components/css/window.css` `components/css/splitter.css`
- Create: `components/css/sidebar.css` `components/css/shell.css`（Task 2 拆分产物为空/近空，写入全量内容）
- Create: `components/window.html`(重写) `components/splitter.html` `components/sidebar.html` `components/shell.html`

**Interfaces:**
- Consumes: 旋钮 `--titlebar-h --win-btn-size --splitter-handle-size --splitter-grip-color --sidebar-w --sidebar-w-collapsed --sidebar-item-h --statusbar-h`；跨组件旋钮（shell 网格引用 `--titlebar-h --sidebar-w --statusbar-h --toolbar-h`，R2 允许）
- Produces: 接线 `--sidebar-item-fg`；class `.titlebar .titlebar-traffic .titlebar-title .titlebar-meta .win-controls .win-btn .win-btn--close .win-btn--util .splitter .splitter--v .splitter-pane .splitter-handle .pane-header .sidebar .sidebar-head .sidebar-brand .sidebar-body .sidebar-foot .sidebar-group .sidebar-item .sidebar-item-ico .sidebar-item-label .sidebar-item-badge .sidebar-section-label .sidebar-collapse .shell .shell-main .statusbar`

- [ ] **Step 1: 校验现状（预期失败）**
- [ ] **Step 2: window.css**（win-controls 块并入，titlebar 参照 design-system.html#window 形态）：

```css
/* window —— 旋钮: --titlebar-h --win-btn-size */
.titlebar { display: flex; align-items: center; gap: var(--space-4);
  height: var(--titlebar-h); padding: 0 var(--space-5);
  background: var(--color-bg-subtle);
  border-bottom: var(--control-border-w) solid var(--color-border);
  user-select: none; }
.titlebar-title { font: var(--font-weight-medium) var(--font-size-sm)/1 var(--font-family-sans); }
.titlebar-meta { color: var(--color-text-dim); font: 400 var(--font-size-2xs)/1 var(--font-family-mono); }
.win-btn { width: var(--win-btn-size); height: var(--win-btn-size); border-radius: var(--radius-full); }
```
- [ ] **Step 3: splitter.css**（改名 `.split*→.splitter*`；grip 纹理经旋钮）：

```css
/* splitter —— 旋钮: --splitter-handle-size --splitter-grip-color */
.splitter { display: flex; }
.splitter--v { flex-direction: row; }
.splitter-pane { overflow: auto; min-width: 0; min-height: 0; }
.splitter-handle { flex: 0 0 var(--splitter-handle-size);
  background: var(--color-bg-subtle); cursor: col-resize; position: relative; }
.splitter-handle::after { content: ""; position: absolute; left: 50%; top: 50%;
  width: 2px; height: 18px; transform: translate(-50%, -50%);
  background: repeating-linear-gradient(to bottom,
    var(--splitter-grip-color) 0 2px, transparent 2px 5px); }
.splitter-handle:hover { background: var(--color-bg-hover); }
.splitter-handle:active { background: var(--color-bg-active); }
.pane-header { height: 26px; display: flex; align-items: center; padding: 0 var(--space-4);
  color: var(--color-text-dim); font: var(--font-weight-medium) var(--font-size-2xs)/1 var(--font-family-mono);
  text-transform: uppercase; letter-spacing: .06em; }
```
- [ ] **Step 4: sidebar.css**（参照 design-system.html#sidebarmenu，`.sb-*→.sidebar-*`）：

```css
/* sidebar —— 接线: --sidebar-item-fg · 旋钮: --sidebar-w/-w-collapsed --sidebar-item-h */
.sidebar { display: flex; flex-direction: column; width: var(--sidebar-w);
  background: var(--color-bg-subtle);
  border-right: var(--control-border-w) solid var(--color-border); }
.sidebar[data-collapsed] { width: var(--sidebar-w-collapsed); }
.sidebar-head, .sidebar-foot { padding: var(--space-4) var(--space-5); }
.sidebar-body { flex: 1; overflow-y: auto; padding: var(--space-2); }
.sidebar-section-label { padding: var(--space-4) var(--space-4) var(--space-2);
  color: var(--color-text-dim); font: var(--font-weight-medium) var(--font-size-2xs)/1 var(--font-family-mono);
  text-transform: uppercase; letter-spacing: .08em; }
.sidebar-item { --sidebar-item-fg: var(--muted-foreground);
  display: flex; align-items: center; gap: var(--space-3);
  height: var(--sidebar-item-h); padding: 0 var(--space-4);
  color: var(--sidebar-item-fg); border-radius: var(--radius-sm);
  font-size: var(--font-size-sm); cursor: pointer; }
.sidebar-item:hover { background: var(--subtle); }
.sidebar-item[aria-current], .sidebar-item.is-selected { --sidebar-item-fg: var(--foreground);
  background: var(--color-bg-active); }
.sidebar-item-badge { margin-left: auto; }
```
- [ ] **Step 5: shell.css**：

```css
/* shell —— 装配网格；只引用 §4 注册旋钮（R2 合法），不新设尺寸 */
.shell { display: grid; height: 100%;
  grid-template-rows: var(--titlebar-h) var(--toolbar-h) 1fr var(--statusbar-h);
  grid-template-columns: var(--sidebar-w) 1fr;
  grid-template-areas: "titlebar titlebar" "toolbar toolbar" "sidebar main" "statusbar statusbar";
  background: var(--background); color: var(--foreground); }
.shell > .titlebar { grid-area: titlebar; }
.shell > .toolbar { grid-area: toolbar; }
.shell > .sidebar { grid-area: sidebar; }
.shell > .shell-main { grid-area: main; overflow: auto; background: var(--color-bg); }
.shell > .statusbar { grid-area: statusbar; }
.statusbar { display: flex; align-items: center; gap: var(--space-5);
  height: var(--statusbar-h); padding: 0 var(--space-5);
  background: var(--color-bg-subtle);
  border-top: var(--control-border-w) solid var(--color-border);
  color: var(--color-text-muted); font: 400 var(--font-size-2xs)/1 var(--font-family-mono); }
```
- [ ] **Step 6: 校验通过**（四文件 exit=0）
- [ ] **Step 7: 四演示页**：window.html（titlebar 两平台形态 + win-controls）；splitter.html（垂直/水平/嵌套，视觉基准 design-system#splitter：6px 把手 + 2×18 grip）；sidebar.html（完整侧栏：brand/分组/选中/badge/折叠两态）；shell.html（完整应用外壳组装：titlebar+toolbar+sidebar+main(datagrid)+statusbar，即 starting-points 的骨架）。
- [ ] **Step 8: 目检 + Commit** `git commit -m "feat(window/splitter/sidebar/shell): 缺口组件补齐，22 分区对齐完成"`

---

### Task 14: index.html 重建 + starting-points 重写 + 全量验收 + 文档同步

**Files:**
- Create: `components/index.html`（重写：22 分区分组导航 + 每页缩略入口）
- Modify: `starting-points/Desktop App — Render Farm.html`（按新 class API 重写：`.shell` 组装 + `.datagrid` + 新类名）
- Modify: `README.md`（Index 表 components 行、Usage 组件层说明）、`SKILL.md`（组件规则段同步新契约）
- Delete: 已迁移旧页残留（核对：button/input/choice/nav/dialog/menu/progress/toast/data 均已删）

**Interfaces:**
- Consumes: 全部 24 文件的最终 class API 与 §4 旋钮

- [ ] **Step 1: index.html 重建**——模板填充：按 design-system 22 分区顺序分组列出 23 页（22 分区 + misc），每项 = 链接 + 一行组件族摘要；头部放规范要点（两级契约 + 4 条铁律一句话版 + `tools/check-tokens.sh` 用法）。
- [ ] **Step 2: starting-points 重写**——用 `.shell` 网格重组页面骨架，数据区用 `.datagrid`，所有旧类名替换（对照 Global Constraints 改名映射表）。
- [ ] **Step 3: 全量校验**

```bash
tools/check-tokens.sh; echo "exit=$?"
# 死链检查
cd /workspace/Codes/github.com/millken/beacon && for f in components/*.html "starting-points/Desktop App — Render Farm.html"; do d=$(dirname "$f"); grep -oE '(href|src)="[^"#]+\.(css|js|html)"' "$f" | sed -E 's/^[a-z]+="//; s/"$//' | while read -r r; do [ -f "$d/$r" ] || echo "BROKEN: $f -> $r"; done; done
# 旧类名残留扫描（应零输出）
grep -rnE '\.(dt|tbl|cmdk|cb|sw)\b|class="[^"]*\b(dt|tbl|cmdk|cb|sw)\b' components/ starting-points/ --include="*.html" --include="*.css" | grep -v datagrid
```
Expected: check-tokens exit=0；无 BROKEN；无旧类名残留。
- [ ] **Step 4: 浏览器全量目检**：index → 23 页逐页 light/dark；starting-points 页；对照 showcase/design-system.html 各分区。
- [ ] **Step 5: README/SKILL 同步**：README Index 表 `components/` 行改为「24 组件文件 + 23 演示页，两级契约（规范：docs/superpowers/specs/…）」；SKILL.md Rules 段补一条「组件定制走 §4 结构旋钮（:root 全局 / 容器局部），变体走接线 token；新增 token 须先入规范契约表」。
- [ ] **Step 6: Commit**

```bash
git add components/ starting-points/ README.md SKILL.md
git commit -m "feat(components): v2 组件 token 体系收官——index 重建、starting-points 重写、全量校验零违例"
```

---

## 计划自检记录

- 规范覆盖：§1-§5（Task 1/2）、§6 全部 24 文件（Task 3-13）、§7 契约逐条落在对应任务 Produces/代码中、§8（Task 2）、§9 改名（Global Constraints + Task 5/7/8/10/13）、§10 演示页与校验（各任务 + Task 14）、§11 顺序即任务序
- `.table--compact` 与 R3 的冲突已在 Task 8 内解决（变体写直接规则，不声明旋钮）
- 类型/命名一致性：接线与旋钮名与 Task 1 注册表逐字一致；`--btn-border-width` 过渡与删除闭环（Task 1 ↔ Task 3）
