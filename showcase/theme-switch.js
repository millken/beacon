// zi · floating theme switcher — drop into any app page after presets.js
// Usage: <script src="theme-switch.js" data-default-preset="beacon" data-default-theme="light"></script>
// Persists per-page choice in localStorage; falls back to the data-* defaults.
(function () {
  const script = document.currentScript;
  const defPreset = script.getAttribute("data-default-preset") || "beacon";
  const defTheme  = script.getAttribute("data-default-theme")  || "dark";
  const pageKey   = "zi-theme:" + location.pathname.split("/").pop();

  const TITLES = {
    beacon:"Beacon", antd:"Antd", console:"Console", studio:"Studio", workshop:"Workshop",
    iron:"Iron", refinery:"Refinery", lab:"Lab", mainframe:"Mainframe",
    foundry:"Foundry", helix:"Helix", atlas:"Atlas", reactor:"Reactor", chrome:"Chrome",
  };
  const KEYS = (typeof PRESET_KEYS !== "undefined") ? PRESET_KEYS : Object.keys(TITLES);

  let preset = defPreset, theme = defTheme, radius = null;
  try {
    const saved = JSON.parse(localStorage.getItem(pageKey) || "null");
    if (saved && saved.preset) { preset = saved.preset; theme = saved.theme || defTheme; radius = saved.radius || null; }
  } catch (e) {}

  function persist() {
    try { localStorage.setItem(pageKey, JSON.stringify({ preset, theme, radius })); } catch (e) {}
  }
  function apply() {
    applyPreset(preset, theme);
    if (radius != null) document.documentElement.style.setProperty("--radius", radius);
    persist();
    syncUI();
  }

  // ── build UI ──
  const style = document.createElement("style");
  style.textContent = `
    .zi-themeswitch {
      position: fixed; right: 12px; bottom: 12px; z-index: 9999;
      display: flex; align-items: center; gap: 6px;
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border-strong);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-pop);
      padding: 4px;
      font-family: var(--font-family-mono);
      transform: translateY(0);
      transition: opacity 120ms ease, transform 120ms ease;
    }
    .zi-themeswitch[data-collapsed="true"] { transform: translateY(calc(100% + 14px)); opacity: 0; pointer-events: none; }
    .zi-ts-handle {
      position: fixed; right: 12px; bottom: 12px; z-index: 9998;
      width: 30px; height: 30px;
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border-strong);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-card);
      cursor: pointer; color: var(--color-text-muted);
    }
    .zi-ts-handle svg { width: 15px; height: 15px; stroke: currentColor; stroke-width: 1.6; fill: none; }
    .zi-ts-handle:hover { color: var(--color-text); border-color: var(--color-accent); }
    .zi-themeswitch select {
      appearance: none;
      background: var(--color-bg); color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 3px 22px 3px 8px;
      font-family: var(--font-family-mono); font-size: 11px;
      cursor: pointer; outline: none;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5'><polyline points='6 9 12 15 18 9'/></svg>");
      background-repeat: no-repeat; background-position: right 7px center;
    }
    .zi-themeswitch .zi-ts-modes { display: inline-flex; border: 1px solid var(--color-border); border-radius: var(--radius-sm); overflow: hidden; }
    .zi-themeswitch .zi-ts-modes button {
      appearance: none; border: none; background: transparent;
      color: var(--color-text-muted); cursor: pointer;
      font-family: var(--font-family-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;
      padding: 4px 8px; line-height: 1.4;
    }
    .zi-themeswitch .zi-ts-modes button[data-on="true"] { background: var(--color-accent); color: var(--color-accent-fg); }
    .zi-themeswitch .zi-ts-x {
      width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center;
      color: var(--color-text-dim); cursor: pointer; font-size: 13px; border-radius: var(--radius-sm);
    }
    .zi-themeswitch .zi-ts-x:hover { background: var(--color-bg-hover); color: var(--color-text); }
  `;
  document.head.appendChild(style);

  const bar = document.createElement("div");
  bar.className = "zi-themeswitch";
  bar.innerHTML = `
    <select class="zi-ts-preset" title="Preset">
      ${KEYS.map(k => `<option value="${k}">${TITLES[k] || k}</option>`).join("")}
    </select>
    <div class="zi-ts-modes">
      <button data-mode="light">Light</button>
      <button data-mode="dark">Dark</button>
    </div>
    <div class="zi-ts-modes zi-ts-radius" title="Corner radius">
      <button data-radius="0px" title="Sharp"><svg viewBox="0 0 16 16" width="15" height="15"><rect x="3" y="3" width="10" height="10" rx="0" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>
      <button data-radius="3px" title="Default"><svg viewBox="0 0 16 16" width="15" height="15"><rect x="3" y="3" width="10" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>
      <button data-radius="8px" title="Rounded"><svg viewBox="0 0 16 16" width="15" height="15"><rect x="3" y="3" width="10" height="10" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>
    </div>
    <span class="zi-ts-x" title="Hide">×</span>
  `;
  const handle = document.createElement("div");
  handle.className = "zi-ts-handle";
  handle.setAttribute("title", "Theme");
  handle.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.2" y1="19.8" x2="5.6" y2="18.4"/><line x1="18.4" y1="5.6" x2="19.8" y2="4.2"/></svg>`;

  const selEl = bar.querySelector(".zi-ts-preset");
  const modeBtns = bar.querySelectorAll(".zi-ts-modes:not(.zi-ts-radius) button");
  const radiusBtns = bar.querySelectorAll(".zi-ts-radius button");

  function syncUI() {
    selEl.value = preset;
    modeBtns.forEach(b => b.setAttribute("data-on", b.dataset.mode === theme ? "true" : "false"));
    const r = radius || "3px";
    radiusBtns.forEach(b => b.setAttribute("data-on", b.dataset.radius === r ? "true" : "false"));
  }

  selEl.addEventListener("change", () => { preset = selEl.value; apply(); });
  modeBtns.forEach(b => b.addEventListener("click", () => { theme = b.dataset.mode; apply(); }));
  radiusBtns.forEach(b => b.addEventListener("click", () => { radius = b.dataset.radius; apply(); }));

  let collapsed = false;
  function setCollapsed(v) {
    collapsed = v;
    bar.setAttribute("data-collapsed", v ? "true" : "false");
    handle.style.display = v ? "inline-flex" : "none";
    try { localStorage.setItem("zi-theme-collapsed", v ? "1" : "0"); } catch (e) {}
  }
  bar.querySelector(".zi-ts-x").addEventListener("click", () => setCollapsed(true));
  handle.addEventListener("click", () => setCollapsed(false));

  document.body.appendChild(bar);
  document.body.appendChild(handle);

  // initial apply (overrides the page's own applyPreset default)
  apply();
  setCollapsed((() => { try { return localStorage.getItem("zi-theme-collapsed") === "1"; } catch (e) { return false; } })());
})();
