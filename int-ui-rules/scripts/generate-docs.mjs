/** Generate the documentation chrome from normalized tokens and verified partials.
 * Specimens stay in their isolated previews so doc CSS cannot alter their pixels. */
import fs from "node:fs";
import path from "node:path";

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);

export function generateDocs({ tokens, manifest, root }) {
  const inventory = JSON.parse(fs.readFileSync(path.join(root, "tokens/inventory.json"), "utf8"));
  const color = (name, fallback) => tokens.color[name]?.css ? `var(${tokens.color[name].css})` : fallback;
  const ink = color("Light/Grey/Grey 2", "#27282E");
  const muted = color("Light/Grey/Grey 6", "#6C707E");
  const blue = color("Light/Blue/Blue 4 (Primary)", "#3574F0");
  const line = color("Light/Grey/Grey 10", "#DFE1E5");
  const surface2 = color("Light/Grey/Grey 12", "#F7F8FA");
  const dark = color("Dark/Grey/Grey 2", "#2B2D30");
  const componentPages = [
    { slug: "button", title: "Button", description: "Buttons are used to initiate an action." },
    { slug: "input", title: "Input field", description: "Input fields are used to enter or edit text." },
    { slug: "checkbox", title: "Checkbox", description: "Checkbox is used to select zero or more items in a list." },
    { slug: "toggle", title: "Toggle", description: "Toggles are used to enable or disable a setting." },
    { slug: "dialog", title: "Dialog", description: "Dialogs focus attention on a task or decision." },
  ];
  const stubs = [
    { slug: "alert", title: "Alert" },
    { slug: "banner", title: "Banner" },
    { slug: "combo-box", title: "Combo box" },
  ];
  const navigation = [
    { slug: "overview", title: "Overview", href: "/" },
    { slug: "colors", title: "Colors", href: "/pages/colors.html" },
    { slug: "typography", title: "Typography", href: "/pages/typography.html" },
    { slug: "spacing", title: "Spacing", href: "/pages/spacing.html" },
    { slug: "components", title: "Components", href: "/pages/components.html" },
    ...componentPages.map((page) => ({ ...page, href: `/pages/${page.slug}.html` })),
    ...stubs.map((page) => ({ ...page, href: `/pages/${page.slug}.html` })),
  ];
  const stats = new Map();
  if (fs.existsSync(path.join(root, "diff/report.json"))) {
    for (const result of JSON.parse(fs.readFileSync(path.join(root, "diff/report.json"), "utf8")).results || []) {
      stats.set(result.name, result);
    }
  }


  function page(active, title, description, body, eyebrow = "Extracted design rules") {
    return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(description)}"><title>${esc(title)} · Int UI Kit</title>
<link rel="stylesheet" href="/dist/tokens.css"><link rel="stylesheet" href="/dist/tailwind.css">
<link rel="stylesheet" href="/public/site.css"><script src="/public/site.js" defer></script></head>
<body data-generated-doc="${esc(active)}"><header class="topbar"><a class="brand" href="/">Int UI Kit</a>
<button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
<nav id="site-nav" aria-label="Documentation">${navigation.map((item) => `<a${active === item.slug ? ' class="active" aria-current="page"' : ""} href="${item.href}">${esc(item.title)}</a>`).join("")}</nav></header>
<main class="doc">${body}</main><footer>Int UI Kit · Rule-generated documentation</footer></body></html>`;
  }
  function head(title, description, eyebrow) {
    return `<section class="page-head"><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1><p>${esc(description)}</p><a class="usage" href="#examples">When and how to use</a></section>`;
  }
  function frame(name, title = name) {
    if (!manifest[name]) return `<span class="unavailable">Not extracted</span>`;
    const item = manifest[name];
    // Dialog's rule root is 883x495, but its verified source scene intentionally exports at 963x575.
    const width = name === "dialog" ? 963 : item.width;
    const height = name === "dialog" ? 575 : item.height;
    return `<iframe class="specimen-frame" data-generated-partial="/components/${name}.html" src="/previews/${name}.html" width="${width}" height="${height}" title="${esc(title)}" loading="lazy" tabindex="-1"></iframe>`;
  }
  function specimenMeta(name) {
    const item = manifest[name];
    const diff = stats.get(name)?.diffPercent;
    return `<details class="provenance"><summary>Source and verification</summary><dl><dt>Source node</dt><dd><code>${esc(item.source)}</code></dd><dt>Selected variant</dt><dd>${Object.entries(item.selectedVariant).map(([key, value]) => `${esc(key)} = ${esc(value)}`).join(" · ")}</dd><dt>Generated partial</dt><dd><a href="/components/${name}.html"><code>components/${name}.html</code></a></dd><dt>Renderer</dt><dd>${esc(item.renderMode)}</dd><dt>Strict RGBA diff</dt><dd>${diff === undefined ? "Run npm run verify" : `${diff.toFixed(3)}%${diff === 0 ? " · pixel-identical" : ""}`}</dd></dl></details>`;
  }
  const states = ["Active", "Hovered", "Pressed", "Focused", "Disabled"];
  const primary = ["button-primary", "button-primary-hovered", "button-primary-pressed", "button-primary-focused"];
  const secondary = ["button-secondary"];
  function matrixRow(label, names) {
    return `<span class="label">${label}</span>${states.map((state, i) => names[i] ? `<figure class="state-cell">${frame(names[i], `${label} ${state}`)}<figcaption>${manifest[names[i]].source}</figcaption></figure>` : `<span class="unavailable">Not extracted</span>`).join("")}`;
  }
  const buttonBody = `${head("Button", componentPages[0].description)}<section class="showcase single" id="examples"><div class="sample-card"><div class="sample-light button-grid"><span></span>${states.map((state) => `<span class="caption">${state}</span>`).join("")}${matrixRow("Primary", primary)}${matrixRow("Secondary", secondary)}</div></div><p class="note"><strong>Coverage:</strong> Only extracted Light states are shown. Dark, Disabled and Secondary interaction states must come from new source extraction.</p><div class="details-grid">${[...primary, ...secondary].map(specimenMeta).join("")}</div></section>`;

  function simpleCasePage(config, groups, note) {
    const details = groups.flatMap((group) => group.names).map(specimenMeta).join("");
    return `${head(config.title, config.description)}<section class="showcase single" id="examples"><div class="case-grid">${groups.map((group) => `<section class="sample-card"><div class="sample-light"><h2>${esc(group.label)}</h2><p class="caption">${esc(group.caption)}</p><div class="specimen-stage">${frame(group.names[0], `${config.title} · ${group.label}`)}</div></div></section>`).join("")}</div><p class="note"><strong>Coverage:</strong> ${esc(note)}</p><div class="details-grid">${details}</div></section>`;
  }
  const inputBody = simpleCasePage(componentPages[1], [
    { label: "Active", caption: "Focus = Off", names: ["input"] },
    { label: "Focused", caption: "Focus = On", names: ["input-focused"] },
  ], "Light, Active, with Focus Off and On. Invalid, Disabled and Dark are not yet extracted.");
  const checkboxBody = simpleCasePage(componentPages[2], [
    { label: "Unchecked", caption: "Light · Active", names: ["checkbox-unchecked"] },
    { label: "Checked", caption: "Light · Active", names: ["checkbox"] },
    { label: "Indeterminate", caption: "Light · Active · source SVG scene", names: ["checkbox-indeterminate"] },
  ], "Three active Light types. Hovered, Focused, Invalid, Disabled and Dark are not yet extracted.");
  const toggleBody = simpleCasePage(componentPages[3], [
    { label: "Off", caption: "Light", names: ["toggle-off"] },
    { label: "On", caption: "Light", names: ["toggle-on"] },
  ], "Both extracted Light states. Dark is not yet extracted; specimens are intentionally non-interactive.");
  const dialogBody = `${head("Dialog", componentPages[4].description)}<section class="showcase single" id="examples"><div class="sample-card dialog-card"><div class="sample-light"><p class="caption">Light · complete 963 × 575 source-vector scene, including native shadow bounds</p><div class="specimen-stage wide">${frame("dialog", "Dialog · Light")}</div></div></div><p class="note"><strong>Rendering:</strong> The verified source-vector scene retains the original paths, compositing and shadow geometry. Dark and other dialog configurations are not yet extracted.</p>${specimenMeta("dialog")}</section>`;

  const colors = Object.entries(tokens.color).filter(([name]) => name.startsWith("Light/") && !name.includes("(Current)"));
  const families = Map.groupBy(colors, ([name]) => name.split("/")[1]);
  const foundationSwatches = Object.fromEntries(["Blue", "Green", "Red", "Yellow", "Orange", "Purple"].map((family) => [family, (families.get(family) || []).find(([name]) => /Primary\)?(#\d+)?$/.test(name)) || (families.get(family) || [])[0]]).filter(([, value]) => value));
  function colorCard([name, value]) {
    return `<article class="color-card"><span class="swatch" style="--sw:var(${value.css})"></span><strong>${esc(name.split("/").slice(2).join(" / "))}</strong><code>${esc(value.css)}</code><span class="color-value">${esc(value.value)}</span>${value.description ? `<p>${esc(value.description)}</p>` : ""}</article>`;
  }
  const colorsBody = `${head("Colors", `${colors.length} Light shared styles from the extracted Int UI source. No hardcoded palette or inferred Dark theme.`)}<section id="examples">${[...families].sort(([a], [b]) => a.localeCompare(b)).map(([family, values]) => `<details class="color-family" open><summary><h2>${esc(family)}</h2><span class="caption">${values.length} source styles</span></summary><div class="palette">${values.map(colorCard).join("")}</div></details>`).join("")}<p class="note"><strong>Source:</strong> <code>tokens/tokens.json → dist/tokens.css</code>. Swatches bind to generated CSS variables, not duplicate hex declarations.</p></section>`;
  const typeFamilies = Map.groupBy(Object.entries(tokens.typography), ([, style]) => style.fontFamily);
  const typographyBody = `${head("Typography", `${Object.keys(tokens.typography).length} shared text styles, rendered from the extracted font, weight, size, line height and letter spacing.`)}<section id="examples">${[...typeFamilies].map(([family, styles]) => `<article class="doc-panel type-section"><h2>${esc(family)}</h2><div class="type-table-wrap"><table class="type-table"><thead><tr><th>Style</th><th>Weight</th><th>Size / line height</th><th>Letter spacing</th></tr></thead><tbody>${styles.map(([name, style]) => `<tr><td>${esc(name)}</td><td><span class="type-sample" style="font-family:'${esc(style.fontFamily)}',sans-serif;font-size:${style.fontSize}px;font-weight:${style.fontWeight};line-height:${typeof style.lineHeight === "number" ? `${style.lineHeight * style.fontSize}px` : style.lineHeight};letter-spacing:${style.letterSpacing}">Intellij interface Aa</span><code>${esc(style.css)}</code></td><td>${style.fontWeight}</td><td>${style.fontSize} / ${esc(style.lineHeight)}</td><td>${esc(style.letterSpacing)}</td></tr>`).join("")}</tbody></table></div></article>`).join("")}<p class="note"><strong>Available font assets:</strong> Inter is bundled locally for faithful component previews. Other named families use the viewer's installed fallback; no font file is fabricated.</p></section>`;
  const geometry = inventory.geometry;
  const spacingBody = `${head("Spacing", "Observed gaps and padding in the 13 selected extracted component trees. These are not a newly invented universal spacing scale.")}<section class="spacing-demo" id="examples"><article class="doc-panel"><h2>Observed gaps</h2>${geometry.gap.map((value) => `<div class="measure"><strong>${value}</strong><i style="--measure:${value}px"></i><code>itemSpacing = ${value}px</code></div>`).join("")}<h2>Observed padding</h2>${geometry.padding.map((value) => `<div class="measure"><strong>${value}</strong><i style="--measure:${value}px"></i><code>padding = ${value}px</code></div>`).join("")}</article><article class="doc-panel"><h2>Provenance and limits</h2><p>Values come from <code>tokens/inventory.json</code>, collected from the source component trees.</p><p>${esc(geometry.note)}</p><p class="caption">Padding combines source paddingTop, paddingRight, paddingBottom and paddingLeft. Low values include source decoration; they are not all layout spacing recommendations.</p><h3>0px stays visible</h3><p>Zero-valued gaps and padding are retained as measured facts rather than removed from the inventory.</p></article></section>`;

  const catalogBody = `${head("Components", "The five components with selected rule-generated and pixel-verified Light specimens. No 30-component completion is claimed.")}<section class="catalog-grid" id="examples">${componentPages.map((page) => `<article class="catalog-item" id="${page.slug}"><h2>${esc(page.title)}</h2><p>${esc(page.description)}</p><div class="catalog-demo${page.slug === "dialog" ? " dialog-demo" : ""}">${frame({ button: "button-primary", input: "input", checkbox: "checkbox", toggle: "toggle-on", dialog: "dialog" }[page.slug], page.title)}</div><a href="/pages/${page.slug}.html">View extracted states</a></article>`).join("")}</section><p class="note">Alert, Banner and Combo box have explicit not-yet-extracted pages. Remaining library entries will appear after source extraction and verification.</p>`;
  const overviewBody = `<section class="hero"><p class="eyebrow">JetBrains interface library · Pixso source</p><h1>Int UI Kit</h1><p class="lead">A generated view of extracted design rules, shared tokens and pixel compared component specimens.</p></section><section class="overview-grid"><article class="panel intro-card"><div><p class="kicker">Foundations</p><h2>Design with shared rules</h2><p>Explore the actual shared colors and text styles, plus measured geometry from the selected components.</p></div><div class="swatches" aria-label="Extracted Light primary swatches">${Object.values(foundationSwatches).map(([, value]) => `<span style="--sw:var(${value.css})" title="${esc(value.value)}"></span>`).join("")}</div><div class="foundation-links"><a href="/pages/colors.html">${colors.length} Light color styles</a><a href="/pages/typography.html">${Object.keys(tokens.typography).length} text styles</a><a href="/pages/spacing.html">Measured geometry</a></div></article><article class="panel get-card"><p class="kicker">Reproduce the gallery</p><h2>Rules → generate → diff</h2><ol class="steps"><li><span>1</span><div><strong>Extract the source</strong><p>Keep geometry, styles, vectors and variant IDs.</p></div></li><li><span>2</span><div><strong>Generate tokens and specimens</strong><p><code>npm run generate</code> also emits this documentation site.</p></div></li><li><span>3</span><div><strong>Compare the exact pixels</strong><p><code>npm run verify</code> checks tokens and all 13 selected states.</p></div></li></ol><a href="/diff/report.md">Current diff report</a></article></section><section><div class="section-heading"><p class="kicker">Verified extraction</p><h2>Components</h2><p>Five components · ${Object.keys(manifest).length} selected Light variants</p></div><div class="component-links">${componentPages.map((page) => `<a href="/pages/${page.slug}.html"><strong>${esc(page.title)}</strong><small>${esc(page.description)}</small><span class="component-arrow" aria-hidden="true">↗</span></a>`).join("")}<a href="/pages/components.html"><strong>Component catalog</strong><small>See what is extracted and what remains.</small><span class="component-arrow" aria-hidden="true">↗</span></a></div></section>`;

  const pages = {
    "button.html": page("button", "Button", componentPages[0].description, buttonBody),
    "input.html": page("input", "Input field", componentPages[1].description, inputBody),
    "checkbox.html": page("checkbox", "Checkbox", componentPages[2].description, checkboxBody),
    "toggle.html": page("toggle", "Toggle", componentPages[3].description, toggleBody),
    "dialog.html": page("dialog", "Dialog", componentPages[4].description, dialogBody),
    "colors.html": page("colors", "Colors", "Generated Light shared styles", colorsBody),
    "typography.html": page("typography", "Typography", "Generated shared text styles", typographyBody),
    "spacing.html": page("spacing", "Spacing", "Observed component geometry", spacingBody),
    "components.html": page("components", "Components", "Extracted component catalog", catalogBody),
  };
  for (const stub of stubs) pages[`${stub.slug}.html`] = page(stub.slug, stub.title, `${stub.title} has not yet been extracted`, `${head(stub.title, `${stub.title} has not yet been extracted.`, "Future extraction")}<section class="doc-panel stub" id="examples"><h2>Not yet extracted</h2><p>This placeholder intentionally contains no illustrative or invented ${esc(stub.title.toLowerCase())} styles.</p><p>Next: extract the source node tree and references, generate a component partial, then add it to the manifest and pixel-diff loop.</p><a href="/pages/components.html">Return to extracted components</a></section>`);
  const out = path.join(root, "public");
  fs.mkdirSync(path.join(out, "pages"), { recursive: true });
  for (const file of fs.readdirSync(path.join(out, "pages"))) if (file.endsWith(".html")) fs.rmSync(path.join(out, "pages", file));
  for (const [name, html] of Object.entries(pages)) fs.writeFileSync(path.join(out, "pages", name), html);
  const overviewHtml = page("overview", "Overview", "Generated Int UI documentation", overviewBody);
  fs.writeFileSync(path.join(out, "index.html"), overviewHtml);
  fs.writeFileSync(path.join(root, "index.html"), overviewHtml);
  fs.writeFileSync(path.join(out, "site.js"), `const toggle = document.querySelector(".nav-toggle");\nconst nav = document.querySelector("#site-nav");\ntoggle?.addEventListener("click", () => {\n  const open = nav.classList.toggle("open");\n  toggle.setAttribute("aria-expanded", String(open));\n});\n`);
  fs.writeFileSync(path.join(out, "site.css"), siteCss({ ink, muted, blue, line, surface2, dark }));
  console.log(`Docs: Overview + ${Object.keys(pages).length} pages in public/ (${stubs.length} intentional stubs).`);
}

function siteCss({ ink, muted, blue, line, surface2, dark }) {
  return `@font-face{font-family:Inter;src:url('/tokens/Inter-Variable.ttf') format('truetype');font-weight:100 900;font-optical-sizing:auto}
/* Documentation chrome only. Rule specimens run in isolated previews, never under this stylesheet. */
:root{--doc-bg:${surface2};--doc-surface:#fff;--doc-surface-2:${surface2};--doc-ink:${ink};--doc-muted:${muted};--doc-line:${line};--doc-blue:${blue};--doc-dark:${dark};--doc-shadow:0 8px 24px #0000001a}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--doc-bg);color:var(--doc-ink);font:13px/1.45 Inter,Arial,sans-serif}a{color:var(--doc-blue);text-decoration:none}a:hover{text-decoration:underline}code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:11px;overflow-wrap:anywhere}button,input,select{font:inherit}h1{margin:0;font-size:clamp(42px,6vw,72px);line-height:1.04;letter-spacing:-.045em}h2{margin:0 0 12px;font-size:22px;letter-spacing:-.02em}h3{font-size:16px}p{margin:0 0 12px}.topbar{position:sticky;top:0;z-index:20;min-height:56px;display:flex;align-items:center;gap:24px;padding:0 32px;background:#fffffff0;border-bottom:1px solid var(--doc-line);backdrop-filter:blur(16px)}.brand{color:var(--doc-ink);font-size:16px;font-weight:700;white-space:nowrap}nav{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none}nav a{padding:8px 10px;border-radius:6px;color:var(--doc-muted);white-space:nowrap}nav a:hover,nav a.active{color:var(--doc-ink);background:var(--doc-surface-2);text-decoration:none}.nav-toggle{display:none;margin-left:auto;border:1px solid var(--doc-line);border-radius:6px;background:#fff;padding:6px 10px}.doc{width:min(1440px,calc(100% - 64px));margin:0 auto;padding:76px 0 120px}.hero{min-height:230px;max-width:720px}.eyebrow,.kicker{margin:0 0 10px;color:var(--doc-blue);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.lead{margin-top:22px;color:var(--doc-muted);font-size:18px;line-height:1.6}.panel,.doc-panel{background:var(--doc-surface);border:1px solid var(--doc-line);border-radius:12px}.overview-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:28px;margin-bottom:100px}.intro-card,.get-card{min-height:390px;padding:38px;display:flex;flex-direction:column;justify-content:space-between}.swatches{display:grid;grid-template-columns:repeat(6,36px);gap:10px;margin:28px 0}.swatches span{width:36px;aspect-ratio:1;border-radius:8px;background:var(--sw);box-shadow:inset 0 0 0 1px #00000014}.foundation-links{display:flex;flex-wrap:wrap;gap:16px;padding-top:24px;border-top:1px solid var(--doc-line)}.steps{list-style:none;margin:8px 0 20px;padding:0}.steps li{display:flex;gap:14px;padding:18px 0;border-top:1px solid var(--doc-line)}.steps li>span{width:26px;height:26px;display:grid;place-items:center;flex:0 0 auto;border-radius:50%;background:var(--doc-blue);color:#fff;font-weight:700}.steps p{margin:4px 0 0;color:var(--doc-muted)}.section-heading{margin-bottom:26px}.component-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.component-links a{position:relative;min-height:160px;padding:24px;display:flex;flex-direction:column;justify-content:flex-end;gap:7px;color:var(--doc-ink);background:#fff;border:1px solid var(--doc-line);border-radius:10px;transition:.18s ease}.component-links a:hover{transform:translateY(-3px);box-shadow:var(--doc-shadow);text-decoration:none}.component-links small{color:var(--doc-muted)}.component-arrow{position:absolute;top:24px;right:24px;color:var(--doc-blue);font-size:22px}.page-head{min-height:280px;max-width:760px}.page-head p:not(.eyebrow){margin-top:24px;font-size:15px;color:var(--doc-muted)}.page-head .usage{display:inline-block;margin-top:0;font-size:13px}.showcase{display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,.8fr);gap:64px;align-items:start}.showcase.single{grid-template-columns:1fr;gap:24px}.sample-card{overflow-x:auto;background:#fff;border:1px solid var(--doc-line);border-radius:10px}.sample-light{padding:36px}.button-grid{display:grid;grid-template-columns:90px repeat(5,minmax(100px,1fr));gap:22px 24px;align-items:center;min-width:740px}.label,.caption{color:var(--doc-muted);font-size:11px}.state-cell{margin:0;min-height:64px}.state-cell figcaption{margin-top:4px;color:var(--doc-muted);font:9px ui-monospace,monospace}.specimen-frame{display:block;max-width:none;border:0;background:transparent;vertical-align:top}.unavailable{align-self:center;color:var(--doc-muted);font-size:11px;font-style:italic}.doc-panel{padding:38px}.note{margin:0;padding:14px;background:var(--doc-surface-2);border:1px solid var(--doc-line);border-radius:6px}.case-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;align-items:start}.case-grid h2{font-size:16px}.specimen-stage{margin-top:28px;min-height:50px;overflow:auto}.specimen-stage.wide{width:883px;max-width:100%}.dialog-card .sample-light{min-width:1015px}.dialog-card .caption{min-width:900px}.details-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:12px}.provenance{padding:16px;background:#fff;border:1px solid var(--doc-line);border-radius:8px}.provenance summary{color:var(--doc-blue);cursor:pointer}.provenance dl{display:grid;grid-template-columns:minmax(80px,auto) 1fr;gap:8px;margin-bottom:0}.provenance dt{color:var(--doc-muted)}.provenance dd{margin:0;overflow-wrap:anywhere}.color-family{margin-bottom:16px;padding:24px;background:#fff;border:1px solid var(--doc-line);border-radius:10px}.color-family summary{display:flex;align-items:center;justify-content:space-between;cursor:pointer}.color-family summary h2{margin:0;font-size:18px}.palette{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;margin-top:24px}.color-card{display:grid;grid-template-columns:1fr auto;gap:6px;padding:12px;border:1px solid var(--doc-line);border-radius:7px;min-width:0}.color-card strong{font-size:12px;overflow-wrap:anywhere}.color-card code{grid-column:1 / -1;color:var(--doc-muted)}.color-card .swatch{grid-column:1 / -1;height:48px;background:var(--sw);border:1px solid #0000000f;border-radius:4px}.color-value{font:11px ui-monospace,monospace;color:var(--doc-muted)}.color-card p{grid-column:1 / -1;color:var(--doc-muted);font-size:11px}.type-section+.type-section{margin-top:24px}.type-table-wrap{overflow-x:auto}.type-table{width:100%;border-collapse:collapse}.type-table th,.type-table td{padding:15px 10px;text-align:left;vertical-align:middle;border-bottom:1px solid var(--doc-line)}.type-table th{color:var(--doc-muted);font-size:11px;font-weight:500}.type-table td:first-child{min-width:160px}.type-table td:nth-child(2){min-width:230px}.type-sample{display:block}.type-table code{color:var(--doc-muted)}.spacing-demo{display:grid;grid-template-columns:1.35fr .65fr;gap:40px}.measure{display:grid;grid-template-columns:28px minmax(0,1fr) 160px;align-items:center;gap:15px;margin:20px 0}.measure i{display:block;width:var(--measure);height:3px;min-height:3px;background:var(--doc-blue)}.measure strong{font-family:ui-monospace,monospace;text-align:right}.catalog-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-bottom:24px}.catalog-item{min-height:240px;padding:24px;display:flex;flex-direction:column;background:#fff;border:1px solid var(--doc-line);border-radius:10px}.catalog-item h2{font-size:16px}.catalog-item>p{color:var(--doc-muted)}.catalog-demo{min-height:90px;margin:16px 0 auto;padding:18px;display:flex;align-items:center;overflow:auto;background:var(--doc-surface-2);border-radius:7px}.catalog-demo.dialog-demo{max-height:180px}.stub{max-width:760px}footer{padding:28px 32px;color:var(--doc-muted);background:#fff;border-top:1px solid var(--doc-line)}
@media(max-width:1000px){.overview-grid,.showcase,.spacing-demo{grid-template-columns:1fr}.catalog-grid{grid-template-columns:1fr 1fr}.component-links{grid-template-columns:1fr 1fr}.dialog-card .sample-light{min-width:900px}}
@media(max-width:720px){.topbar{padding:0 18px;flex-wrap:wrap}.nav-toggle{display:block}nav{display:none;width:100%;padding:0 0 12px;flex-wrap:wrap}nav.open{display:flex}.doc{width:min(100% - 32px,1440px);padding-top:48px}.hero,.page-head{min-height:230px}.overview-grid{gap:16px;margin-bottom:64px}.intro-card,.get-card,.doc-panel,.sample-light{padding:22px}.component-links,.catalog-grid{grid-template-columns:1fr}.details-grid{grid-template-columns:1fr}.measure{grid-template-columns:24px 1fr}.measure code{grid-column:2}.provenance dl{grid-template-columns:1fr}.provenance dt{margin-top:8px}.dialog-card .sample-light{min-width:900px}}
`;
}
