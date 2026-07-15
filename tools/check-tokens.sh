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
def strip(css): return re.sub(r'/\*.*?\*/','',css,flags=re.S)
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
        # R3 旋钮声明位
        m=re.match(r'\s*(--[a-z][a-z0-9-]*)\s*:',line)
        if m and m.group(1) in knobs:
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
