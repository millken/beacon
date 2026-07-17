// zi · industrial desktop — theme presets (v2: tightened light modes, new themes)

// ── Shape: ONE radius knob drives the whole scale (shadcn-style).
//    Set --radius (e.g. 2px sharp / 8px rounded) and every corner re-derives.
const COMMON_SHAPE = {
  "--radius": "3px",                                  // ← the single knob
  "--radius-sm": "max(0px, calc(var(--radius) - 1px))",
  "--radius-md": "var(--radius)",
  "--radius-lg": "calc(var(--radius) + 1px)",
  "--radius-card": "calc(var(--radius) + 3px)",
  "--radius-full": "9999px",
  // input inner "well" shadow — the editable-affordance cue (themeable in one place)
  "--shadow-inset": "inset 0 1px 2px rgba(0,0,0,0.05)",
  // recessed track groove — slider / meter / vu / progress fill channels
  "--shadow-well": "inset 0 1px 2px rgba(0,0,0,0.5)",
  "--track-bg": "rgba(0,0,0,0.4)",
};

const COMMON_DENSITY = {
  "--control-pad-y": "5px",
  "--control-pad-x": "13px",
  "--control-pad-y-sm": "3px",
  "--control-pad-x-sm": "9px",
  "--control-pad-y-lg": "7px",
  "--control-pad-x-lg": "16px",
  "--input-pad-y": "4px",
  "--input-pad-x": "8px",
  // spacing scale (8px base @ --space-4)
  "--space-1": "2px",
  "--space-2": "4px",
  "--space-3": "6px",
  "--space-4": "8px",
  "--space-5": "12px",
  "--space-6": "16px",
  "--space-7": "24px",
};

// ── Tier-3 component structural knobs · DEFAULTS (see tokens.md §5).
//    Declared here (not only as a CSS var-fallback) so the baseline is a
//    GOVERNED token in the source, not a magic literal hidden in styles.css.
//    Applied to :root BEFORE the preset color block, so a preset MAY override
//    any of them (e.g. "--btn-shadow":"var(--shadow-card)" for shadowed skins).
//    Components still reference these via var(--token, fallback), so local
//    variants (.btn--ghost) and scoped style="--btn-shadow:…" overrides win
//    over this :root default exactly as before.
const COMMON_COMPONENT = {
  "--btn-shadow": "none",        // button elevation — flat by default
  "--btn-border-width": "1px",   // button border thickness
  "--btn-active-shadow": "inset 0 2px 3px -1px rgba(0,0,0,0.28)", // press L2: TOP edge depresses (inset). Ghost opts out → none (no surface)
};

const COMMON_FONT = {
  "--font-size-2xs": "11px",
  "--font-size-xs": "12px",
  "--font-size-sm": "12px",
  "--font-size-md": "13px",
  "--font-size-lg": "15px",
  "--font-size-xl": "18px",
  "--font-size-2xl": "24px",
  "--font-weight-medium": "500",
  "--font-weight-semibold": "600",
  "--font-family-sans": '"Segoe UI Variable Text","SF Pro Text","Noto Sans",Ubuntu,Cantarell,sans-serif',
  "--font-family-mono": '"Iosevka Term","JetBrains Mono","SF Mono","Cascadia Mono",Consolas,monospace',
};

const PRESETS = {
  // ─── BEACON · general-purpose radix blue ─────────────────
  beacon: {
    title: "Beacon",
    tagline: "radix-blue",
    desc: "// general-purpose desktop — radix blue accent on cool neutral surfaces",
    useCase: "通用桌面应用 / 管理后台 / 工具",
    light: {
      "--color-bg":"#ffffff","--color-bg-subtle":"#edf0f6","--color-bg-surface":"#e1e6ef","--color-bg-hover":"#d2dae7","--color-bg-active":"#c0cbda","--color-bg-inverse":"#11151c",
      "--color-border":"#d3d9e3","--color-border-strong":"#959eb0","--color-divider":"#e7ebf2",
      "--color-text":"#11151c","--color-text-muted":"#49515f","--color-text-dim":"#6c7484","--color-text-inverse":"#ffffff",
      "--color-accent":"#1a6fe0","--color-accent-hover":"#1561c8","--color-accent-fg":"#ffffff",
      "--color-success":"#1a7a3e","--color-warning":"#b06200","--color-danger":"#c41c1c","--color-danger-hover":"#a51515",
      /* PLANE MODEL (light): raised containers share the white content plane;
         elevation is carried by shadow + strong border, not a greyer fill.
         Overrides COMMON_ROLES' --popover (which = surface, kept for dark). */
      "--popover":"var(--color-bg)",
      "--shadow-card":"0 4px 14px rgba(10,30,80,0.12), 0 0 0 1px rgba(10,30,80,0.07)",
      "--shadow-pop":"0 6px 20px rgba(10,30,80,0.16), 0 0 0 1px rgba(10,30,80,0.09)",
      "--focus-ring":"0 0 0 2px rgba(26,111,224,0.45)",
    },
    dark: {
      "--color-bg":"#11151c","--color-bg-subtle":"#161b24","--color-bg-surface":"#1d2532","--color-bg-hover":"#263040","--color-bg-active":"#32404f","--color-bg-inverse":"#e6ebf2",
      "--color-border":"#2a3340","--color-border-strong":"#414d5e","--color-divider":"#1e2530",
      "--color-text":"#e3e9f1","--color-text-muted":"#98a3b4","--color-text-dim":"#677387","--color-text-inverse":"#11151c",
      "--color-accent":"#4d9bff","--color-accent-hover":"#6cabff","--color-accent-fg":"#06101e",
      "--color-success":"#3ecf83","--color-warning":"#f5b53d","--color-danger":"#ff6b6b","--color-danger-hover":"#ff8585",
      "--shadow-card":"0 6px 20px rgba(0,6,20,0.55), 0 0 0 1px rgba(0,6,20,0.65)",
      "--shadow-pop":"0 8px 28px rgba(0,6,20,0.65), 0 0 0 1px rgba(0,6,20,0.72)",
      "--focus-ring":"0 0 0 2px rgba(77,155,255,0.50)",
    },
  },

  // ─── CHROME · Chrome DevTools · google blue ──────────────
  // Anchored on user-extracted DevTools light values: toolbar #edf2fa,
  // border #d3e3fd, code surface #f3f6fc. Cooler & bluer than Beacon —
  // a side-by-side foil to validate the neutral temperature.
  chrome: {
    title: "Chrome",
    tagline: "DevTools · google blue",
    desc: "// Chrome DevTools — cool blue-tinted neutrals, google blue accent",
    useCase: "调试工具 / 开发者面板 / Web 控制台",
    light: {
      "--color-bg":"#ffffff","--color-bg-subtle":"#edf2fa","--color-bg-surface":"#e3ebf7","--color-bg-hover":"#d6e2f4","--color-bg-active":"#c4d5ee","--color-bg-inverse":"#202124",
      "--color-border":"#d3e3fd","--color-border-strong":"#9bb4d8","--color-divider":"#e8eef9",
      "--color-text":"#1f2329","--color-text-muted":"#5a6675","--color-text-dim":"#828c9b","--color-text-inverse":"#ffffff",
      "--color-accent":"#1a73e8","--color-accent-hover":"#1765cc","--color-accent-fg":"#ffffff",
      "--color-success":"#1e8e3e","--color-warning":"#e37400","--color-danger":"#d93025","--color-danger-hover":"#c5221f",
      "--popover":"var(--color-bg)",
      "--shadow-card":"0 1px 2px rgba(60,64,67,0.12), 0 2px 8px rgba(60,64,67,0.10)",
      "--shadow-pop":"0 2px 6px rgba(60,64,67,0.16), 0 8px 24px rgba(60,64,67,0.12)",
      "--focus-ring":"0 0 0 2px rgba(26,115,232,0.40)",
    },
    dark: {
      "--color-bg":"#1c1d20","--color-bg-subtle":"#232528","--color-bg-surface":"#2a2c31","--color-bg-hover":"#34373d","--color-bg-active":"#40444b","--color-bg-inverse":"#e8eaed",
      "--color-border":"#3c4043","--color-border-strong":"#5f6368","--color-divider":"#2c2e33",
      "--color-text":"#e3e6ea","--color-text-muted":"#9aa0a6","--color-text-dim":"#6b7077","--color-text-inverse":"#1c1d20",
      "--color-accent":"#8ab4f8","--color-accent-hover":"#aecbfa","--color-accent-fg":"#062e6f",
      "--color-success":"#81c995","--color-warning":"#fdd663","--color-danger":"#f28b82","--color-danger-hover":"#f6aea9",
      "--shadow-card":"0 1px 2px rgba(0,0,0,0.50), 0 2px 8px rgba(0,0,0,0.40)",
      "--shadow-pop":"0 6px 16px rgba(0,0,0,0.55), 0 9px 28px rgba(0,0,0,0.45)",
      "--focus-ring":"0 0 0 2px rgba(138,180,248,0.45)",
    },
  },

  // ─── ANTD · Ant Design 5 · daybreak blue ─────────────────
  antd: {
    title: "Antd",
    tagline: "Ant Design · blue",
    desc: "// Ant Design 5 — daybreak blue accent, neutral grays, enterprise console",
    useCase: "中后台 / 企业应用 / 表单密集型",
    light: {
      "--color-bg":"#ffffff","--color-bg-subtle":"#fafafa","--color-bg-surface":"#f0f0f0","--color-bg-hover":"#e8e8e8","--color-bg-active":"#dcdcdc","--color-bg-inverse":"#1f1f1f",
      "--color-border":"#d9d9d9","--color-border-strong":"#bfbfbf","--color-divider":"#f0f0f0",
      "--color-text":"#1f1f1f","--color-text-muted":"#595959","--color-text-dim":"#8c8c8c","--color-text-inverse":"#ffffff",
      "--color-accent":"#1677ff","--color-accent-hover":"#4096ff","--color-accent-fg":"#ffffff",
      "--color-success":"#52c41a","--color-warning":"#faad14","--color-danger":"#ff4d4f","--color-danger-hover":"#d9363e",
      "--shadow-card":"0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
      "--shadow-pop":"0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05)",
      "--focus-ring":"0 0 0 2px rgba(22,119,255,0.18)",
    },
    dark: {
      "--color-bg":"#141414","--color-bg-subtle":"#1d1d1d","--color-bg-surface":"#262626","--color-bg-hover":"#303030","--color-bg-active":"#3a3a3a","--color-bg-inverse":"#e6e6e6",
      "--color-border":"#424242","--color-border-strong":"#5a5a5a","--color-divider":"#303030",
      "--color-text":"#dcdcdc","--color-text-muted":"#a6a6a6","--color-text-dim":"#737373","--color-text-inverse":"#141414",
      "--color-accent":"#1668dc","--color-accent-hover":"#3c89e8","--color-accent-fg":"#ffffff",
      "--color-success":"#49aa19","--color-warning":"#d89614","--color-danger":"#dc4446","--color-danger-hover":"#e84749",
      "--shadow-card":"0 1px 2px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.45)",
      "--shadow-pop":"0 6px 16px rgba(0,0,0,0.55), 0 9px 28px 8px rgba(0,0,0,0.45)",
      "--focus-ring":"0 0 0 2px rgba(22,104,220,0.35)",
    },
  },

  // ─── CONSOLE · DAW / mixing desk · amber ─────────────────
  console: {
    title: "Console",
    tagline: "DAW · amber",
    desc: "// DAW-style — warm amber on charcoal, transport-ready",
    useCase: "音频工作站 / 录音控台 / 媒体制作",
    light: {
      "--color-bg":"#f2f0ea","--color-bg-subtle":"#e9e6dd","--color-bg-surface":"#ddd9cc","--color-bg-hover":"#cfcabb","--color-bg-active":"#b3ad9d","--color-bg-inverse":"#1d1c19",
      "--color-border":"#b9b09c","--color-border-strong":"#7c7561","--color-divider":"#cec8b9",
      "--color-text":"#1d1c19","--color-text-muted":"#4a4738","--color-text-dim":"#7d7763","--color-text-inverse":"#f2f0ea",
      "--color-accent":"#b85d0e","--color-accent-hover":"#9c4d08","--color-accent-fg":"#ffffff",
      "--color-success":"#3a7242","--color-warning":"#a06b00","--color-danger":"#a8463a","--color-danger-hover":"#8e3a30",
      "--shadow-card":"0 4px 12px rgba(40,30,10,0.18), 0 0 0 1px rgba(40,30,10,0.10)",
      "--shadow-pop":"0 6px 18px rgba(40,30,10,0.22), 0 0 0 1px rgba(40,30,10,0.12)",
      "--focus-ring":"0 0 0 2px rgba(184,93,14,0.45)",
    },
    dark: {
      "--color-bg":"#1c1c1f","--color-bg-subtle":"#212125","--color-bg-surface":"#2a2a2e","--color-bg-hover":"#33333a","--color-bg-active":"#3d3d44","--color-bg-inverse":"#eaeaec",
      "--color-border":"#3a3a40","--color-border-strong":"#52525a","--color-divider":"#2e2e34",
      "--color-text":"#eaeaec","--color-text-muted":"#8a8a93","--color-text-dim":"#5a5a63","--color-text-inverse":"#1c1c1f",
      "--color-accent":"#e08423","--color-accent-hover":"#ea9438","--color-accent-fg":"#1c1408",
      "--color-success":"#52b25c","--color-warning":"#dca54a","--color-danger":"#cc5848","--color-danger-hover":"#d76b5c",
      "--shadow-card":"0 6px 16px rgba(0,0,0,0.50), 0 0 0 1px rgba(0,0,0,0.75)",
      "--shadow-pop":"0 8px 24px rgba(0,0,0,0.60), 0 0 0 1px rgba(0,0,0,0.80)",
      "--focus-ring":"0 0 0 2px rgba(224,132,35,0.45)",
    },
  },

  // ─── STUDIO · NLE / 3D · cyan ─────────────────────────────
  studio: {
    title: "Studio",
    tagline: "NLE · cyan",
    desc: "// NLE / 3D — neutral graphite, cyan accent, color-pick friendly",
    useCase: "非线编 / 3D 动画 / 调色合成",
    light: {
      "--color-bg":"#edeef0","--color-bg-subtle":"#e1e3e6","--color-bg-surface":"#d4d7da","--color-bg-hover":"#c4c8cd","--color-bg-active":"#aaaeb4","--color-bg-inverse":"#1c1f22",
      "--color-border":"#aeb3b9","--color-border-strong":"#787e85","--color-divider":"#c5c8cc",
      "--color-text":"#1c1f22","--color-text-muted":"#4a4f55","--color-text-dim":"#7c8088","--color-text-inverse":"#edeef0",
      "--color-accent":"#0a7480","--color-accent-hover":"#08616b","--color-accent-fg":"#ffffff",
      "--color-success":"#357d4a","--color-warning":"#9c6b14","--color-danger":"#a8443a","--color-danger-hover":"#8e3a30",
      "--shadow-card":"0 4px 12px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.09)",
      "--shadow-pop":"0 6px 18px rgba(0,0,0,0.20), 0 0 0 1px rgba(0,0,0,0.11)",
      "--focus-ring":"0 0 0 2px rgba(10,116,128,0.45)",
    },
    dark: {
      "--color-bg":"#1c1f22","--color-bg-subtle":"#21252a","--color-bg-surface":"#282c31","--color-bg-hover":"#32363c","--color-bg-active":"#3c4148","--color-bg-inverse":"#e6e8eb",
      "--color-border":"#3a3f46","--color-border-strong":"#525860","--color-divider":"#2c3036",
      "--color-text":"#e6e8eb","--color-text-muted":"#888d93","--color-text-dim":"#585e64","--color-text-inverse":"#1c1f22",
      "--color-accent":"#3fb6c4","--color-accent-hover":"#55c4d1","--color-accent-fg":"#0d1416",
      "--color-success":"#5cb16a","--color-warning":"#d8a447","--color-danger":"#c66258","--color-danger-hover":"#d4756b",
      "--shadow-card":"0 6px 16px rgba(0,0,0,0.50), 0 0 0 1px rgba(0,0,0,0.70)",
      "--shadow-pop":"0 8px 24px rgba(0,0,0,0.58), 0 0 0 1px rgba(0,0,0,0.75)",
      "--focus-ring":"0 0 0 2px rgba(63,182,196,0.50)",
    },
  },

  // ─── WORKSHOP · IDE / code · sage ─────────────────────────
  workshop: {
    title: "Workshop",
    tagline: "IDE · sage",
    desc: "// IDE-density — neutral with subtle green warmth, sage accent",
    useCase: "代码编辑器 / 终端 / 长时编码",
    light: {
      "--color-bg":"#eff1ed","--color-bg-subtle":"#e4e7e0","--color-bg-surface":"#d6dacf","--color-bg-hover":"#c7ccc0","--color-bg-active":"#aeb4a5","--color-bg-inverse":"#1c1f1a",
      "--color-border":"#b3b9aa","--color-border-strong":"#7c8275","--color-divider":"#cad0bf",
      "--color-text":"#1c1f1a","--color-text-muted":"#4a4f42","--color-text-dim":"#7c8273","--color-text-inverse":"#eff1ed",
      "--color-accent":"#456e42","--color-accent-hover":"#385934","--color-accent-fg":"#ffffff",
      "--color-success":"#456e42","--color-warning":"#a06b14","--color-danger":"#a8463a","--color-danger-hover":"#8e3a30",
      "--shadow-card":"0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.09)",
      "--shadow-pop":"0 6px 18px rgba(0,0,0,0.19), 0 0 0 1px rgba(0,0,0,0.11)",
      "--focus-ring":"0 0 0 2px rgba(69,110,66,0.45)",
    },
    dark: {
      "--color-bg":"#21221e","--color-bg-subtle":"#262723","--color-bg-surface":"#2e2f2a","--color-bg-hover":"#383934","--color-bg-active":"#454640","--color-bg-inverse":"#e7e8e2",
      "--color-border":"#3d3e38","--color-border-strong":"#55564f","--color-divider":"#33342f",
      "--color-text":"#e7e8e2","--color-text-muted":"#8a8c84","--color-text-dim":"#5a5c55","--color-text-inverse":"#21221e",
      "--color-accent":"#94b46b","--color-accent-hover":"#a5c47c","--color-accent-fg":"#1d1f19",
      "--color-success":"#75b070","--color-warning":"#d4a44a","--color-danger":"#c45a4a","--color-danger-hover":"#d36a5a",
      "--shadow-card":"0 6px 16px rgba(0,0,0,0.50), 0 0 0 1px rgba(0,0,0,0.70)",
      "--shadow-pop":"0 8px 24px rgba(0,0,0,0.58), 0 0 0 1px rgba(0,0,0,0.75)",
      "--focus-ring":"0 0 0 2px rgba(148,180,107,0.50)",
    },
  },

  // ─── IRON · CAD / drafting · steel ───────────────────────
  iron: {
    title: "Iron",
    tagline: "CAD · steel",
    desc: "// CAD / drafting — blue-cooled steel, restrained accent",
    useCase: "CAD 制图 / 工程建模 / BIM",
    light: {
      "--color-bg":"#ebedf0","--color-bg-subtle":"#dde0e5","--color-bg-surface":"#cfd3da","--color-bg-hover":"#bfc4cc","--color-bg-active":"#a5abb4","--color-bg-inverse":"#1a1d22",
      "--color-border":"#a8aeb7","--color-border-strong":"#737983","--color-divider":"#c0c5cd",
      "--color-text":"#1a1d22","--color-text-muted":"#454a52","--color-text-dim":"#787f88","--color-text-inverse":"#ebedf0",
      "--color-accent":"#24528f","--color-accent-hover":"#1c4378","--color-accent-fg":"#ffffff",
      "--color-success":"#2d7a3f","--color-warning":"#9c6b14","--color-danger":"#a8463a","--color-danger-hover":"#8e3a30",
      "--shadow-card":"0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.09)",
      "--shadow-pop":"0 6px 18px rgba(0,0,0,0.19), 0 0 0 1px rgba(0,0,0,0.11)",
      "--focus-ring":"0 0 0 2px rgba(36,82,143,0.45)",
    },
    dark: {
      "--color-bg":"#1a1d22","--color-bg-subtle":"#1f2329","--color-bg-surface":"#262a31","--color-bg-hover":"#30353e","--color-bg-active":"#3c424c","--color-bg-inverse":"#e2e5ea",
      "--color-border":"#363c46","--color-border-strong":"#4e5560","--color-divider":"#2a2f37",
      "--color-text":"#e2e5ea","--color-text-muted":"#838893","--color-text-dim":"#535864","--color-text-inverse":"#1a1d22",
      "--color-accent":"#6da0e3","--color-accent-hover":"#82b0ea","--color-accent-fg":"#0d1220",
      "--color-success":"#5cb16a","--color-warning":"#d4a44a","--color-danger":"#c45a4a","--color-danger-hover":"#d36a5a",
      "--shadow-card":"0 6px 16px rgba(0,0,0,0.50), 0 0 0 1px rgba(0,0,0,0.70)",
      "--shadow-pop":"0 8px 24px rgba(0,0,0,0.58), 0 0 0 1px rgba(0,0,0,0.75)",
      "--focus-ring":"0 0 0 2px rgba(109,160,227,0.50)",
    },
  },

  // ─── REFINERY · SCADA / control · safety orange ──────────
  refinery: {
    title: "Refinery",
    tagline: "SCADA · safety orange",
    desc: "// SCADA / control room — black steel, safety orange alerts",
    useCase: "工业控制 / SCADA / 重型设备监测",
    light: {
      "--color-bg":"#e8e8e8","--color-bg-subtle":"#dcdcdc","--color-bg-surface":"#cdcdcd","--color-bg-hover":"#bcbcbc","--color-bg-active":"#a3a3a3","--color-bg-inverse":"#0d0d0d",
      "--color-border":"#a4a4a4","--color-border-strong":"#727272","--color-divider":"#bcbcbc",
      "--color-text":"#0d0d0d","--color-text-muted":"#3d3d3d","--color-text-dim":"#727272","--color-text-inverse":"#e8e8e8",
      "--color-accent":"#cc4a00","--color-accent-hover":"#b03e00","--color-accent-fg":"#ffffff",
      "--color-success":"#1f7a3a","--color-warning":"#a06b00","--color-danger":"#a82518","--color-danger-hover":"#8e1f14",
      "--shadow-card":"0 4px 12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.10)",
      "--shadow-pop":"0 6px 18px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.12)",
      "--focus-ring":"0 0 0 2px rgba(204,74,0,0.45)",
    },
    dark: {
      "--color-bg":"#141414","--color-bg-subtle":"#1a1a1a","--color-bg-surface":"#212121","--color-bg-hover":"#2a2a2a","--color-bg-active":"#363636","--color-bg-inverse":"#e8e8e8",
      "--color-border":"#2d2d2d","--color-border-strong":"#454545","--color-divider":"#202020",
      "--color-text":"#e8e8e8","--color-text-muted":"#8c8c8c","--color-text-dim":"#5a5a5a","--color-text-inverse":"#141414",
      "--color-accent":"#ff6a14","--color-accent-hover":"#ff7e2e","--color-accent-fg":"#0a0a0a",
      "--color-success":"#3fb35a","--color-warning":"#e3a83a","--color-danger":"#e54430","--color-danger-hover":"#ed5b48",
      "--shadow-card":"0 6px 16px rgba(0,0,0,0.60), 0 0 0 1px rgba(0,0,0,0.80)",
      "--shadow-pop":"0 8px 24px rgba(0,0,0,0.70), 0 0 0 1px rgba(0,0,0,0.85)",
      "--focus-ring":"0 0 0 2px rgba(255,106,20,0.50)",
    },
  },

  // ─── LAB · oscilloscope · phosphor ────────────────────────
  lab: {
    title: "Lab",
    tagline: "Scope · phosphor",
    desc: "// oscilloscope-inspired — phosphor green on near-black, high contrast values",
    useCase: "示波器 / 实验仪表 / 数据采集",
    light: {
      "--color-bg":"#eff1ec","--color-bg-subtle":"#e3e7e0","--color-bg-surface":"#d4d9d2","--color-bg-hover":"#c4cbc1","--color-bg-active":"#a8b0a5","--color-bg-inverse":"#0d130e",
      "--color-border":"#a8b0a5","--color-border-strong":"#787f76","--color-divider":"#c4cbc1",
      "--color-text":"#0d130e","--color-text-muted":"#3d4a3f","--color-text-dim":"#787f76","--color-text-inverse":"#eff1ec",
      "--color-accent":"#1a7022","--color-accent-hover":"#12591a","--color-accent-fg":"#ffffff",
      "--color-success":"#1a7022","--color-warning":"#9c6b14","--color-danger":"#a8463a","--color-danger-hover":"#8e3a30",
      "--shadow-card":"0 4px 12px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.09)",
      "--shadow-pop":"0 6px 18px rgba(0,0,0,0.20), 0 0 0 1px rgba(0,0,0,0.11)",
      "--focus-ring":"0 0 0 2px rgba(26,112,34,0.45)",
    },
    dark: {
      "--color-bg":"#0d130e","--color-bg-subtle":"#121912","--color-bg-surface":"#181f18","--color-bg-hover":"#222a22","--color-bg-active":"#2d362d","--color-bg-inverse":"#e6f0e6",
      "--color-border":"#27302a","--color-border-strong":"#3d473f","--color-divider":"#1c241c",
      "--color-text":"#cfe2cf","--color-text-muted":"#7a937a","--color-text-dim":"#4d614e","--color-text-inverse":"#0d130e",
      "--color-accent":"#5bf08a","--color-accent-hover":"#76f49d","--color-accent-fg":"#06120a",
      "--color-success":"#5bf08a","--color-warning":"#e3c93a","--color-danger":"#f0584d","--color-danger-hover":"#f47169",
      "--shadow-card":"0 6px 16px rgba(0,6,0,0.60), 0 0 0 1px rgba(0,6,0,0.80)",
      "--shadow-pop":"0 8px 24px rgba(0,6,0,0.70), 0 0 0 1px rgba(0,6,0,0.85)",
      "--focus-ring":"0 0 0 2px rgba(91,240,138,0.50)",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // NEW PRESETS (v2)
  // ═══════════════════════════════════════════════════════════

  // ─── MAINFRAME · IBM 3270 / TN3270 terminal ───────────────
  mainframe: {
    title: "Mainframe",
    tagline: "TN3270 · phosphor amber",
    desc: "// terminal-emulator nostalgia — amber phosphor on black, IBM 3270 lineage",
    useCase: "终端模拟器 / mainframe 客户端 / 日志查看器",
    light: {
      "--color-bg":"#f0e8d8","--color-bg-subtle":"#e5dcc6","--color-bg-surface":"#d8cdb3","--color-bg-hover":"#c9bd9d","--color-bg-active":"#ada082","--color-bg-inverse":"#1a1408",
      "--color-border":"#b5a988","--color-border-strong":"#7d735a","--color-divider":"#cabe9f",
      "--color-text":"#1a1408","--color-text-muted":"#4e442e","--color-text-dim":"#7d735a","--color-text-inverse":"#f0e8d8",
      "--color-accent":"#9c5800","--color-accent-hover":"#854a00","--color-accent-fg":"#ffffff",
      "--color-success":"#5a6f1a","--color-warning":"#a06b00","--color-danger":"#9c3320","--color-danger-hover":"#822818",
      "--shadow-card":"0 4px 12px rgba(40,30,5,0.18), 0 0 0 1px rgba(40,30,5,0.10)",
      "--shadow-pop":"0 6px 18px rgba(40,30,5,0.22), 0 0 0 1px rgba(40,30,5,0.12)",
      "--focus-ring":"0 0 0 2px rgba(156,88,0,0.45)",
    },
    dark: {
      "--color-bg":"#0a0805","--color-bg-subtle":"#100c07","--color-bg-surface":"#16110a","--color-bg-hover":"#1f190e","--color-bg-active":"#2a2113","--color-bg-inverse":"#f0e2c2",
      "--color-border":"#251c10","--color-border-strong":"#3a2e1a","--color-divider":"#1a1409",
      "--color-text":"#f0c878","--color-text-muted":"#a08550","--color-text-dim":"#5a4830","--color-text-inverse":"#0a0805",
      "--color-accent":"#ffb84a","--color-accent-hover":"#ffc560","--color-accent-fg":"#0a0805",
      "--color-success":"#9adb52","--color-warning":"#ffe156","--color-danger":"#ff5f3e","--color-danger-hover":"#ff7556",
      "--shadow-card":"0 6px 16px rgba(0,0,0,0.70), 0 0 0 1px rgba(0,0,0,0.85)",
      "--shadow-pop":"0 8px 24px rgba(0,0,0,0.80), 0 0 0 1px rgba(0,0,0,0.90)",
      "--focus-ring":"0 0 0 2px rgba(255,184,74,0.50)",
    },
  },

  // ─── FOUNDRY · heavy industry · molten / carbon ───────────
  foundry: {
    title: "Foundry",
    tagline: "molten · carbon",
    desc: "// foundry / heavy industry — carbon black with molten copper accent",
    useCase: "重工 / 冶金监测 / 焊接车间",
    light: {
      "--color-bg":"#ecebe7","--color-bg-subtle":"#e0dedb","--color-bg-surface":"#d1cfca","--color-bg-hover":"#c0bdb6","--color-bg-active":"#a39f97","--color-bg-inverse":"#161310",
      "--color-border":"#a8a59c","--color-border-strong":"#76726a","--color-divider":"#bdbab2",
      "--color-text":"#161310","--color-text-muted":"#42403a","--color-text-dim":"#76726a","--color-text-inverse":"#ecebe7",
      "--color-accent":"#9c3a0e","--color-accent-hover":"#83300a","--color-accent-fg":"#ffffff",
      "--color-success":"#3a7242","--color-warning":"#a06b14","--color-danger":"#a8423a","--color-danger-hover":"#8e3830",
      "--shadow-card":"0 4px 12px rgba(20,15,10,0.18), 0 0 0 1px rgba(20,15,10,0.10)",
      "--shadow-pop":"0 6px 18px rgba(20,15,10,0.22), 0 0 0 1px rgba(20,15,10,0.12)",
      "--focus-ring":"0 0 0 2px rgba(156,58,14,0.45)",
    },
    dark: {
      "--color-bg":"#161310","--color-bg-subtle":"#1c1816","--color-bg-surface":"#231e1b","--color-bg-hover":"#2d2722","--color-bg-active":"#39322c","--color-bg-inverse":"#ebe4dd",
      "--color-border":"#322a25","--color-border-strong":"#4a3f37","--color-divider":"#251f1b",
      "--color-text":"#ebe4dd","--color-text-muted":"#8a7e72","--color-text-dim":"#5a5048","--color-text-inverse":"#161310",
      "--color-accent":"#e87a3b","--color-accent-hover":"#f08a4f","--color-accent-fg":"#170d05",
      "--color-success":"#65b06f","--color-warning":"#e3a83a","--color-danger":"#e85a4a","--color-danger-hover":"#ef6e60",
      "--shadow-card":"0 6px 16px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,0,0,0.82)",
      "--shadow-pop":"0 8px 24px rgba(0,0,0,0.72), 0 0 0 1px rgba(0,0,0,0.85)",
      "--focus-ring":"0 0 0 2px rgba(232,122,59,0.50)",
    },
  },

  // ─── HELIX · bio / chem / lab · teal + magenta ────────────
  helix: {
    title: "Helix",
    tagline: "biotech · teal",
    desc: "// bio / chem — deep teal surfaces with magenta highlight, scientific UI",
    useCase: "实验室信息系统 / 生信工作流 / 病理影像",
    light: {
      "--color-bg":"#f1f4f4","--color-bg-subtle":"#e3e9ea","--color-bg-surface":"#d3dcdd","--color-bg-hover":"#c2cdcf","--color-bg-active":"#a4b2b5","--color-bg-inverse":"#0d1718",
      "--color-border":"#a8b4b6","--color-border-strong":"#727e80","--color-divider":"#c2cdcf",
      "--color-text":"#0d1718","--color-text-muted":"#3d484a","--color-text-dim":"#727e80","--color-text-inverse":"#f1f4f4",
      "--color-accent":"#0a6a72","--color-accent-hover":"#085860","--color-accent-fg":"#ffffff",
      "--color-success":"#3a7a4a","--color-warning":"#a06b14","--color-danger":"#a8443a","--color-danger-hover":"#8e3a30",
      "--shadow-card":"0 4px 12px rgba(0,15,18,0.16), 0 0 0 1px rgba(0,15,18,0.09)",
      "--shadow-pop":"0 6px 18px rgba(0,15,18,0.20), 0 0 0 1px rgba(0,15,18,0.11)",
      "--focus-ring":"0 0 0 2px rgba(10,106,114,0.45)",
    },
    dark: {
      "--color-bg":"#0d1718","--color-bg-subtle":"#121e1f","--color-bg-surface":"#172627","--color-bg-hover":"#1f3132","--color-bg-active":"#293d3f","--color-bg-inverse":"#dfecec",
      "--color-border":"#243537","--color-border-strong":"#3a4d4f","--color-divider":"#1c2a2b",
      "--color-text":"#dfecec","--color-text-muted":"#85969a","--color-text-dim":"#576668","--color-text-inverse":"#0d1718",
      "--color-accent":"#48c8d4","--color-accent-hover":"#5fd0db","--color-accent-fg":"#06181a",
      "--color-success":"#5dc97a","--color-warning":"#dfb049","--color-danger":"#e85a8a","--color-danger-hover":"#ec719a",
      "--shadow-card":"0 6px 16px rgba(0,10,12,0.60), 0 0 0 1px rgba(0,10,12,0.78)",
      "--shadow-pop":"0 8px 24px rgba(0,10,12,0.70), 0 0 0 1px rgba(0,10,12,0.82)",
      "--focus-ring":"0 0 0 2px rgba(72,200,212,0.50)",
    },
  },

  // ─── ATLAS · maps / GIS · navy + amber ────────────────────
  atlas: {
    title: "Atlas",
    tagline: "GIS · navy + amber",
    desc: "// navigation / cartography — deep navy surface with amber compass-rose accent",
    useCase: "地理信息 / 海运调度 / 物流地图",
    light: {
      "--color-bg":"#f0eee5","--color-bg-subtle":"#e3e1d6","--color-bg-surface":"#d4d2c4","--color-bg-hover":"#c3c1b3","--color-bg-active":"#a8a698","--color-bg-inverse":"#0a1428",
      "--color-border":"#aaa896","--color-border-strong":"#72705f","--color-divider":"#c3c1b3",
      "--color-text":"#0a1428","--color-text-muted":"#3d4254","--color-text-dim":"#72705f","--color-text-inverse":"#f0eee5",
      "--color-accent":"#0e3870","--color-accent-hover":"#0a2c5c","--color-accent-fg":"#ffffff",
      "--color-success":"#3a7242","--color-warning":"#a06b14","--color-danger":"#a8423a","--color-danger-hover":"#8e3830",
      "--shadow-card":"0 4px 12px rgba(10,20,40,0.18), 0 0 0 1px rgba(10,20,40,0.10)",
      "--shadow-pop":"0 6px 18px rgba(10,20,40,0.22), 0 0 0 1px rgba(10,20,40,0.12)",
      "--focus-ring":"0 0 0 2px rgba(14,56,112,0.45)",
    },
    dark: {
      "--color-bg":"#0a1428","--color-bg-subtle":"#0f1a32","--color-bg-surface":"#15233e","--color-bg-hover":"#1d2e4c","--color-bg-active":"#283b5e","--color-bg-inverse":"#e3e8f0",
      "--color-border":"#22324e","--color-border-strong":"#3a4768","--color-divider":"#1a2842",
      "--color-text":"#e3e8f0","--color-text-muted":"#8a93a8","--color-text-dim":"#5a6480","--color-text-inverse":"#0a1428",
      "--color-accent":"#f5a623","--color-accent-hover":"#f7b340","--color-accent-fg":"#1a1408",
      "--color-success":"#5cc4a0","--color-warning":"#f5a623","--color-danger":"#e85a4a","--color-danger-hover":"#ed7060",
      "--shadow-card":"0 6px 16px rgba(0,5,20,0.65), 0 0 0 1px rgba(0,5,20,0.80)",
      "--shadow-pop":"0 8px 24px rgba(0,5,20,0.72), 0 0 0 1px rgba(0,5,20,0.85)",
      "--focus-ring":"0 0 0 2px rgba(245,166,35,0.50)",
    },
  },

  // ─── REACTOR · safety / nuclear control · sodium yellow ───
  reactor: {
    title: "Reactor",
    tagline: "safety · sodium",
    desc: "// nuclear / safety — warm gray with sodium-lamp yellow + safety red",
    useCase: "安全控制 / 应急指挥 / 核电监测",
    light: {
      "--color-bg":"#ecebe6","--color-bg-subtle":"#dfdeda","--color-bg-surface":"#d0cfc9","--color-bg-hover":"#bdbcb5","--color-bg-active":"#a0a098","--color-bg-inverse":"#1a1812",
      "--color-border":"#a8a89c","--color-border-strong":"#727268","--color-divider":"#bdbcb5",
      "--color-text":"#1a1812","--color-text-muted":"#42413a","--color-text-dim":"#727268","--color-text-inverse":"#ecebe6",
      "--color-accent":"#a86d00","--color-accent-hover":"#8e5b00","--color-accent-fg":"#ffffff",
      "--color-success":"#3a7242","--color-warning":"#a86d00","--color-danger":"#b8281c","--color-danger-hover":"#9c2116",
      "--shadow-card":"0 4px 12px rgba(25,20,10,0.18), 0 0 0 1px rgba(25,20,10,0.10)",
      "--shadow-pop":"0 6px 18px rgba(25,20,10,0.22), 0 0 0 1px rgba(25,20,10,0.12)",
      "--focus-ring":"0 0 0 2px rgba(168,109,0,0.45)",
    },
    dark: {
      "--color-bg":"#1a1812","--color-bg-subtle":"#201d16","--color-bg-surface":"#28241c","--color-bg-hover":"#332e23","--color-bg-active":"#40392b","--color-bg-inverse":"#ece8da",
      "--color-border":"#36312a","--color-border-strong":"#4e483d","--color-divider":"#2a2620",
      "--color-text":"#ece8da","--color-text-muted":"#928a76","--color-text-dim":"#5e5848","--color-text-inverse":"#1a1812",
      "--color-accent":"#ffcc1f","--color-accent-hover":"#ffd640","--color-accent-fg":"#1a1408",
      "--color-success":"#5fb56e","--color-warning":"#ffcc1f","--color-danger":"#ff4a2a","--color-danger-hover":"#ff6048",
      "--shadow-card":"0 6px 16px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,0,0,0.80)",
      "--shadow-pop":"0 8px 24px rgba(0,0,0,0.72), 0 0 0 1px rgba(0,0,0,0.85)",
      "--focus-ring":"0 0 0 2px rgba(255,204,31,0.50)",
    },
  },
};

const PRESET_KEYS = ["beacon","chrome","antd","console","studio","workshop","iron","refinery","lab","mainframe","foundry","helix","atlas","reactor"];

// ── Semantic ROLES (shadcn-style): every surface role is paired with a
//    -foreground so text on it is always legal. These reference the ladder
//    via var(), so one static map serves all presets × both modes.
//    Components should prefer these role tokens over raw ladder steps.
const COMMON_ROLES = {
  "--background":            "var(--color-bg)",
  "--foreground":            "var(--color-text)",
  // 表面抬升（满视口应用的页面↔卡片契约）——dark 默认，light 由 COMMON_ROLES_LIGHT 覆盖。
  // 与 colors_and_type.css 的 :root / [data-theme=light] 结构对齐。
  "--surface-page":          "var(--color-bg)",          // 页面底：dark 最深
  "--surface-raised":        "var(--color-bg-surface)",  // 抬升卡片：dark 比页面高一阶
  "--card":                  "var(--surface-raised)",
  "--card-foreground":       "var(--color-text)",
  "--popover":               "var(--color-bg-surface)",
  "--popover-foreground":    "var(--color-text)",
  "--primary":               "var(--color-accent)",
  "--primary-foreground":    "var(--color-accent-fg)",
  "--primary-hover":         "var(--color-accent-hover)",
  "--secondary":             "var(--color-bg-surface)",
  "--secondary-foreground":  "var(--color-text)",
  "--muted":                 "var(--color-bg-subtle)",
  "--muted-foreground":      "var(--color-text-muted)",
  "--subtle":                "var(--color-bg-hover)",      // hover/selected surface
  "--subtle-foreground":     "var(--color-text)",
  "--destructive":           "var(--color-danger)",
  "--destructive-foreground":"#ffffff",
  "--destructive-hover":     "var(--color-danger-hover)",
  "--success":               "var(--color-success)",
  "--warning":               "var(--color-warning)",
  "--border-role":           "var(--color-border)",
  "--input":                 "var(--color-border)",
  "--ring":                  "var(--color-accent)",
};

// light 平面模型覆盖（对齐 colors_and_type.css 的 [data-theme=light]）：卡片留在内容平面(bg)，
// 靠更灰的页面底 + 描边/阴影抬升。对所有 preset 的 light 模式统一生效。
const COMMON_ROLES_LIGHT = {
  "--surface-page":   "var(--color-bg-subtle)",  // 页面底：灰，令 light 卡片浮起
  "--surface-raised": "var(--color-bg)",          // 抬升卡片：留在白平面（--card 随之解析为 bg）
};

function applyPreset(key, theme) {
  const p = PRESETS[key];
  const colors = theme === "light" ? p.light : p.dark;
  const rootEl = document.documentElement;
  // Suppress transitions during the swap: without this, any element that
  // transitions a var()-backed property (e.g. .btn background) keeps its
  // stale resolved value until the next interaction — a Chromium quirk.
  rootEl.classList.add("__theme-switching");
  const root = rootEl.style;
  // NOTE: colors apply AFTER COMMON_ROLES so a preset MAY override a semantic
  // role for itself (e.g. beacon light remaps --popover to the white content
  // plane). Role + color key sets are otherwise disjoint, so order is safe.
  // light 时追加 COMMON_ROLES_LIGHT（在 colors 之后），令 --surface-* 走平面模型；
  // dark 时 COMMON_ROLES 的默认值即正确，无需覆盖。
  const sets = theme === "light"
    ? [COMMON_SHAPE, COMMON_DENSITY, COMMON_FONT, COMMON_COMPONENT, COMMON_ROLES, colors, COMMON_ROLES_LIGHT]
    : [COMMON_SHAPE, COMMON_DENSITY, COMMON_FONT, COMMON_COMPONENT, COMMON_ROLES, colors];
  for (const obj of sets) {
    for (const [k,v] of Object.entries(obj)) root.setProperty(k, v);
  }
  rootEl.setAttribute("data-preset", key);
  rootEl.setAttribute("data-theme", theme);
  void rootEl.offsetWidth; // force reflow so new values resolve immediately
  requestAnimationFrame(() => rootEl.classList.remove("__theme-switching"));
}
