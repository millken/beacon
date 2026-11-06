/** Generate the Int UI Kit documentation shell and its inline rule specimens.
 * Documentation chrome follows the reference information architecture. Every
 * component specimen is read from components/*.html; no demo component styles
 * are duplicated here. Isolated previews remain the pixel-diff render target.
 */
import fs from "node:fs";
import path from "node:path";

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);

export function generateDocs({ tokens, manifest, root }) {
  const inventory = JSON.parse(fs.readFileSync(path.join(root, "tokens/inventory.json"), "utf8"));
  const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
  const color = (name, fallback) => tokens.color[name]?.css ? `var(${tokens.color[name].css})` : fallback;
  const chrome = {
    bg: "#f4f4f5", surface: "#fff", ink: color("Light/Grey/Grey 2", "#27282E"),
    muted: color("Light/Grey/Grey 6", "#6C707E"),
    line: color("Light/Grey/Grey 10", "#DFE1E5"),
    blue: color("Light/Blue/Blue 4 (Primary)", "#3574F0"),
    green: color("Light/Green/Green 4 (Primary)", "#208A3C"),
    red: color("Light/Red/Red 4 (Primary)", "#D93C3E"),
    soft: color("Light/Grey/Grey 12", "#F7F8FA"),
    dark: color("Dark/Grey/Grey 2", "#2B2D30"),
  };
  const detailPages = [
    { slug: "alert", title: "Alert", thumb: "Alert", caption: "Modal decisions" },
    { slug: "banner", title: "Banner", thumb: "Banner", caption: "Context status" },
    { slug: "button", title: "Button", thumb: "Button", specimen: "button-primary", caption: "Trigger actions" },
    { slug: "checkbox", title: "Checkbox", thumb: "Checked", specimen: "checkbox", caption: "Select options" },
    { slug: "combo-box", title: "Combo box", thumb: "Combo box", caption: "Choose a value" },
  ];
  const library = [
    ...detailPages,
    { slug: "context-menu", title: "Context menu", caption: "Context commands" },
    { slug: "dialog", title: "Dialog", specimen: "dialog", caption: "Focused tasks" },
    { slug: "dropdown", title: "Dropdown", caption: "Fixed choices" },
    { slug: "group-header", title: "Group header", caption: "Separate content" },
    { slug: "input-field", title: "Input field", specimen: "input", caption: "Enter text" },
    { slug: "link", title: "Link", caption: "Navigate" },
    { slug: "loader", title: "Loader", caption: "Background work" },
    { slug: "notification", title: "Notification", caption: "System feedback" },
    { slug: "popup", title: "Popup", caption: "Temporary content" },
    { slug: "progress-bar", title: "Progress bar", caption: "Task completion" },
    { slug: "radio-button", title: "Radio button", caption: "Choose one" },
    { slug: "segmented-control", title: "Segmented control", caption: "Switch views" },
    { slug: "search", title: "Search", caption: "Find content" },
    { slug: "scrollbar", title: "Scrollbar", caption: "Navigate overflow" },
    { slug: "shortcut-code", title: "Shortcut & code", caption: "Technical notation" },
    { slug: "tab", title: "Tab", caption: "Switch documents" },
    { slug: "table", title: "Table", caption: "Structured data" },
    { slug: "toggle", title: "Toggle", specimen: "toggle-on", caption: "Enable a setting" },
    { slug: "toolbar", title: "Toolbar", caption: "Frequent actions" },
    { slug: "tooltip", title: "Tooltip", caption: "Brief explanation" },
    { slug: "tooltip-editor", title: "Tooltip: Editor", caption: "Code information" },
    { slug: "tooltip-got-it", title: "Tooltip: Got It", caption: "Feature education" },
    { slug: "tree", title: "Tree", caption: "Hierarchy" },
    { slug: "tool-window", title: "Tool window", caption: "Workspace panel" },
    { slug: "main-window", title: "Main window", caption: "Application shell" },
  ];
  const navigation = [
    ["overview", "Overview", "/"], ["colors", "Colors", "/pages/colors.html"],
    ["typography", "Typography", "/pages/typography.html"], ["spacing", "Spacing", "/pages/spacing.html"],
    ["components", "Components", "/pages/components.html"],
    ...detailPages.map(({ slug, title }) => [slug, title, `/pages/${slug}.html`]),
  ];

  function page(active, title, body) {
    return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(title)} · Int UI Kit documentation"><title>${esc(title)} · Int UI Kit</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3E%3Crect width=%2716%27 height=%2716%27 rx=%274%27 fill=%27%233574F0%27/%3E%3C/svg%3E"><link rel="stylesheet" href="/dist/tokens.css"><link rel="stylesheet" href="/dist/tailwind.css"><link rel="stylesheet" href="/site.css"><script src="/site.js" defer></script></head>
<body><header class="topbar"><a class="brand" href="/">Int UI Kit</a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
<nav id="site-nav" aria-label="Documentation">${navigation.map(([slug, label, href]) => `<a${active === slug ? ' class="active" aria-current="page"' : ""} href="${href}">${esc(label)}</a>`).join("")}</nav></header>
<main class="doc">${body}</main><footer>Int UI Kit · <a href="/pages/components.html">Component library</a></footer></body></html>`;
  }
  function head(title, description, eyebrow = "") {
    return `<section class="page-head">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}<h1>${esc(title)}</h1><p>${esc(description)}</p><a class="usage" href="#examples">When and how to use</a></section>`;
  }
  function inline(name, title = name, extra = "") {
    if (!manifest[name]) return `<span class="doc-pending-mark" aria-label="Not extracted yet">—</span>`;
    const item = manifest[name];
    const width = name === "dialog" ? 963 : item.width;
    const height = name === "dialog" ? 575 : item.height;
    const html = read(`components/${name}.html`);
    return `<span class="doc-specimen ${extra}" data-generated-partial="/components/${name}.html" style="--specimen-width:${width}px;--specimen-height:${height}px" role="group" aria-label="${esc(title)}">${html}</span>`;
  }
  function pending(label = "Not extracted yet") {
    return `<div class="doc-pending"><span class="doc-pending-icon" aria-hidden="true">—</span><strong>${esc(label)}</strong></div>`;
  }
  function overviewCard(item) {
    const href = detailPages.some(({ slug }) => slug === item.slug) ? `/pages/${item.slug}.html` : `/pages/components.html#${item.slug}`;
    return `<a class="doc-component-card" href="${href}">${item.specimen ? `<span class="doc-card-preview">${inline(item.specimen, item.title, "doc-card-specimen")}</span>` : `<span class="doc-card-preview doc-thumbnail-pending"><span aria-hidden="true">${esc(item.thumb || item.title)}</span><span class="doc-pending-tag">Not extracted yet</span></span>`}<strong>${esc(item.title)}</strong><small>${esc(item.caption)}</small><span class="doc-card-state">${item.specimen ? "Ready to explore ↗" : "Library preview · states pending"}</span></a>`;
  }
  function provenance(names) {
    return `<details class="provenance"><summary>Design sources and verification</summary><div>${names.map((name) => {
      const item = manifest[name];
      return `<p><strong>${esc(name)}</strong> · Pixso <code>${esc(item.source)}</code> · ${esc(item.renderMode)}<br><a href="/components/${name}.html">Generated HTML</a> · <a href="/previews/${name}.html">Isolated specimen</a></p>`;
    }).join("")}<p><code>npm run verify</code> checks the isolated component previews.</p></div></details>`;
  }
  function stateCell(name, label) {
    return `<div class="doc-state-cell">${name ? inline(name, label) : pending()}<span class="sr-only">${esc(label)}</span></div>`;
  }
  function matrix(columns, rows, className = "") {
    return `<div class="doc-matrix ${className}"><span></span>${columns.map((label) => `<span class="caption">${esc(label)}</span>`).join("")}${rows.map((row) => `<span class="label">${esc(row.label)}</span>${row.names.map((name, i) => stateCell(name, `${row.label} · ${columns[i]}`)).join("")}`).join("")}</div>`;
  }
  function themeZone(title, content, dark = false) {
    return `<section class="${dark ? "sample-dark" : "sample-light"}"><div class="doc-zone-head"><h2>${esc(title)}</h2>${dark ? '<span class="doc-pending-tag">Not extracted yet</span>' : '<span class="doc-ready-tag">Light · available</span>'}</div>${content}</section>`;
  }
  function unavailableMatrix(columns, rows) {
    return matrix(columns, rows.map((label) => ({ label, names: columns.map(() => null) })));
  }
  function usageSection(title, content, description = "") {
    return `<section class="subsection"><h2>${esc(title)}</h2>${description ? `<p>${esc(description)}</p>` : ""}${content}</section>`;
  }

  const foundationSwatches = ["Blue", "Green", "Red", "Yellow", "Orange", "Purple"].map((family) => {
    const entries = Object.entries(tokens.color).filter(([name]) => name.startsWith(`Light/${family}/`));
    return entries.find(([name]) => /Primary\)?(#\d+)?$/.test(name))?.[1] || entries[Math.floor(entries.length / 2)]?.[1];
  }).filter(Boolean);
  const overviewBody = `<section class="hero"><p class="eyebrow">JetBrains interface library</p><h1>Int UI Kit</h1><p class="lead">A practical foundation for building clear, compact interfaces for developer tools.</p></section>
<section class="overview-grid"><article class="panel intro-card"><div><p class="kicker">Foundations</p><h2>Design with shared rules</h2><p>Explore the colors, typography and spacing that keep every tool window and dialog consistent.</p></div><div><div class="swatches" aria-label="Brand color swatches">${foundationSwatches.map((v) => `<span style="--sw:var(${v.css})" title="${esc(v.value)}"></span>`).join("")}</div><div class="type-preview"><strong>Default</strong><strong>Default semibold</strong><code>Medium mono</code></div><div class="foundation-links"><a href="/pages/colors.html">Colors ↗</a><a href="/pages/typography.html">Typography ↗</a><a href="/pages/spacing.html">Spacing ↗</a></div></div></article>
<article class="panel get-card"><div><p class="kicker">How to use</p><h2>Start with the essentials</h2></div><ol class="steps"><li><span>1</span><div><strong>Explore the foundations</strong><p>Use shared colors, text styles and spacing.</p></div></li><li><span>2</span><div><strong>Browse the catalog</strong><p>Find a component and compare its available states.</p></div></li><li><span>3</span><div><strong>Use the generated HTML</strong><p>Open a component page for inline demos and source links.</p></div></li></ol></article></section>
<section><div class="section-heading"><p class="kicker">Library</p><h2>Components</h2><p>Explore the kit. Available components include inline design specimens; pending entries are marked.</p></div><div class="component-links component-catalog">${library.map(overviewCard).join("")}</div></section>`;

  function catalogCard(item) {
    return `<article class="catalog-item${item.specimen ? "" : " doc-catalog-pending"}" id="${item.slug}"><div><h2>${esc(item.title)}</h2><p>${esc(item.caption)}.</p></div><div class="catalog-demo">${item.specimen ? inline(item.specimen, item.title, "doc-catalog-specimen") : pending()}</div><footer class="doc-card-footer"><span>${item.specimen ? "Inline generated specimen" : "Not extracted yet"}</span>${item.specimen && detailPages.some(({ slug }) => slug === item.slug) ? `<a href="/pages/${item.slug}.html">View states ↗</a>` : `<a href="/pages/${({ dialog: "dialog", "input-field": "input", toggle: "toggle" })[item.slug] || "components"}.html"${item.specimen ? "" : ' aria-label="Library entry; no detail page yet"'}>${item.specimen ? "View states ↗" : "Library entry"}</a>`}</footer></article>`;
  }
  const catalogBody = `${head("Components", "Browse the Int UI component catalog. Five components have available Light specimens; the remaining entries are reserved for source extraction.", "Complete library")}<section class="catalog-grid">${library.map(catalogCard).join("")}</section>`;

  const buttonColumns = ["Active", "Hovered", "Pressed", "Focused", "Disabled"];
  const buttonNames = ["button-primary", "button-primary-hovered", "button-primary-pressed", "button-primary-focused"];
  const buttonBody = `${head("Button", "Buttons are used to initiate an action.")}<section class="showcase" id="examples"><div><div class="sample-card">${themeZone("Button states", matrix(buttonColumns, [{ label: "Primary", names: [...buttonNames, null] }, { label: "Secondary", names: ["button-secondary", null, null, null, null] }], "button-grid"))}${themeZone("Dark theme", unavailableMatrix(buttonColumns, ["Primary", "Secondary"]), true)}</div>${provenance([...buttonNames, "button-secondary"])}</div><article class="doc-panel">${usageSection("Default buttons", `<div class="doc-usage-stage"><div>${inline("button-secondary", "Secondary action")}${inline("button-primary", "Primary action")}</div></div>`, "Use a primary button for the main action and secondary buttons for supporting actions.")}${usageSection("Split button with options", `<div class="doc-usage-grid">${buttonColumns.map((state, i) => `<div><span class="caption">${esc(state)}</span>${stateCell(buttonNames[i] || null, `Split button · ${state}`)}</div>`).join("")}</div>`, "The split-button variant is reserved for extraction. The available primary states show its action side.")}${usageSection("Slim buttons", `<div class="doc-placeholder-row">${pending("Slim · Not extracted yet")}</div>`, "Slim buttons will appear here after their source states are available.")}</article></section>`;

  const checkboxColumns = ["Active", "Hovered", "Focused", "Invalid", "Disabled"];
  const checkboxRows = [
    { label: "Unchecked", names: ["checkbox-unchecked", null, null, null, null] },
    { label: "Checked", names: ["checkbox", null, null, null, null] },
    { label: "Indeterminate", names: ["checkbox-indeterminate", null, null, null, null] },
  ];
  const checkboxBody = `${head("Checkbox", "Checkbox is used when you need to select multiple items in a list. Users can select all, any, or none of the items.")}<section class="showcase" id="examples"><div><div class="sample-card">${themeZone("Checkbox states", matrix(checkboxColumns, checkboxRows, "checkbox-grid"))}${themeZone("Dark theme", unavailableMatrix(checkboxColumns, checkboxRows.map((r) => r.label)), true)}</div>${provenance(["checkbox-unchecked", "checkbox", "checkbox-indeterminate"])}</div><article class="doc-panel">${usageSection("Variations", `<div class="doc-option-stage">${checkboxRows.map((row) => `<div><span class="caption">${esc(row.label)}</span>${inline(row.names[0], `${row.label} checkbox`)}</div>`).join("")}</div>`, "Use a checkbox for independent options. Indeterminate communicates a mixed group selection.")}${usageSection("Checkbox group", `<div class="doc-demo-toggle" data-checkbox-demo><div class="doc-check-state">${inline("checkbox-unchecked", "Option A")}</div><div class="doc-check-state">${inline("checkbox", "Option B")}</div><div class="doc-check-state">${inline("checkbox-indeterminate", "Mixed group")}</div><button type="button" aria-pressed="false">Switch interactive example</button><p class="caption">The specimen is the source design; the adjacent label and switch control change only this usage demo.</p></div>`)}${usageSection("Nesting", `<div class="doc-placeholder-row">${pending("Nested group · Not extracted yet")}</div>`, "Nested examples will reuse source-generated checkbox states.")}</article></section>`;

  function simplePage({ title, description, names, mode }) {
    const cols = mode === "input" ? ["Active", "Focused", "Invalid", "Disabled"] : ["Off", "On", "Disabled"];
    const values = mode === "input" ? ["input", "input-focused", null, null] : ["toggle-off", "toggle-on", null];
    return `${head(title, description)}<section class="showcase" id="examples"><div><div class="sample-card">${themeZone(`${title} states`, `<div class="doc-control-matrix">${values.map((name, i) => `<div><span class="caption">${esc(cols[i])}</span>${stateCell(name, `${title} · ${cols[i]}`)}</div>`).join("")}</div>`)}${themeZone("Dark theme", `<div class="doc-control-matrix">${cols.map((label) => `<div><span class="caption">${esc(label)}</span>${pending()}</div>`).join("")}</div>`, true)}</div>${provenance(names)}</div><article class="doc-panel">${usageSection("When to use", mode === "input" ? `<div class="doc-usage-stage">${inline("input", "Input field")}</div><div class="doc-usage-stage">${inline("input-focused", "Focused input field")}</div>` : `<div class="doc-switch-demo" data-switch-demo><div class="doc-switch-off">${inline("toggle-off", "Off")}</div><div class="doc-switch-on">${inline("toggle-on", "On")}</div><button type="button" aria-pressed="false">Toggle setting</button></div>`, mode === "input" ? "Use an input field to enter or edit a single line of text." : "Use a toggle to enable or disable a single setting.")}${usageSection("More states", pending("Additional variants · Not extracted yet"), "Disabled, invalid and dark states will be added from source designs.")}</article></section>`;
  }
  const inputBody = simplePage({ title: "Input field", description: "Input fields are used to enter or edit text.", names: ["input", "input-focused"], mode: "input" });
  const toggleBody = simplePage({ title: "Toggle", description: "Toggles are used to enable or disable a setting.", names: ["toggle-off", "toggle-on"], mode: "toggle" });
  const dialogBody = `${head("Dialog", "Dialogs focus attention on a task or decision.")}<section class="showcase single" id="examples"><article class="doc-panel"><div class="doc-zone-head"><h2>Light dialog</h2><span class="doc-ready-tag">Available</span></div><div class="doc-dialog-stage">${inline("dialog", "Dialog · Light")}</div>${provenance(["dialog"])}</article><article class="doc-panel"><h2>When to use</h2><p>Use a dialog for focused setup, confirmation or a decision that needs the user’s attention.</p><h3>Dark theme</h3>${pending("Not extracted yet")}</article></section>`;

  function reservedPage(kind) {
    const configs = {
      alert: { title: "Alert", description: "An alert informs users about the status of user- or system-initiated operations.", headings: ["States", "Types", "Sizes"], states: ["Information", "Warning", "Error", "Confirmation"] },
      banner: { title: "Banner", description: "A banner notification informs the user about the state of a specific context.", headings: ["Default or inline banner", "Actions", "Close and settings"], states: ["Information", "Success", "Warning", "Error"] },
      "combo-box": { title: "Combo box", description: "A combo box combines a drop-down list and an input field, allowing the user to select a value from the list or enter a custom value.", headings: ["States", "Label and hint patterns", "Options"], states: ["Default", "Focused", "Validated", "Validated focused", "Disabled"] },
    };
    const c = configs[kind];
    const specMatrix = `<div class="sample-light"><div class="doc-zone-head"><h2>${c.headings[0]}</h2><span class="doc-pending-tag">Not extracted yet</span></div><div class="doc-reserved-states">${c.states.map((s) => `<div><span class="caption">${esc(s)}</span>${pending()}</div>`).join("")}</div></div><div class="sample-dark"><div class="doc-zone-head"><h2>Dark theme</h2></div>${pending()}</div>`;
    return `${head(c.title, c.description)}<section class="showcase" id="examples"><div class="sample-card">${specMatrix}</div><article class="doc-panel">${usageSection(c.headings[1], pending("Variants · Not extracted yet"), kind === "banner" ? "Actions and dismissal will be available after the source states are extracted." : "The page structure is ready for source-generated variants.")}${usageSection(c.headings[2], `<div class="doc-placeholder-row">${pending("Not extracted yet")}</div>`, "No illustrative component styles are substituted for the missing source design.")}</article></section>`;
  }

  const colorGroups = Map.groupBy(Object.entries(tokens.color).filter(([name]) => !name.startsWith("ARCHIVE/")), ([name]) => {
    const [space, family, ...rest] = name.split("/");
    if (["Light", "Dark", "Editor", "Light (Current)"].includes(space)) return `${space}/${family}`;
    return rest.length ? `${space}/${family}` : space;
  });
  function naturalColorName([name]) {
    const bits = name.split("/").at(-1).match(/\d+/g);
    return bits ? Number(bits[0]) : 1000;
  }
  function colorFamily([family, values]) {
    return `<section class="color-family"><h3>${esc(family.split("/").slice(-1)[0])}</h3><div>${[...values].sort((a,b) => naturalColorName(a)-naturalColorName(b) || a[0].localeCompare(b[0])).map(([name, value]) => `<div class="chip${1-(Number.parseInt(value.value.slice(1,3),16)*299+Number.parseInt(value.value.slice(3,5),16)*587+Number.parseInt(value.value.slice(5,7),16)*114)/255000 < .5 ? " light-ink" : ""}" style="--chip:var(${value.css})" title="${esc(name)} · ${esc(value.value)}${value.description ? ` · ${esc(value.description)}` : ""}"><span>${esc(name.split("/").slice(2).join(" / ") || name.split("/").at(-1))}</span><span>${esc(value.value)}</span></div>`).join("")}</div></section>`;
  }
  const colorSections = (groups, title, cls = "") => groups.length ? `<section class="doc-panel color-zone ${cls}"><h2>${esc(title)}</h2><p class="caption">Shared design tokens · select a swatch to copy its value</p><div class="palette">${groups.map(colorFamily).join("")}</div></section>` : "";
  const colorEntries = [...colorGroups];
  const colorsBody = `${head("Colors", "Core color ramps for light and dark themes. Each family supports UI states, hierarchy and accessible contrast.")}<div class="doc-color-sections">${colorSections(colorEntries.filter(([f]) => f.startsWith("Light/") && !f.startsWith("Light (Current)")), "Light theme")}${colorSections(colorEntries.filter(([f]) => f.startsWith("Editor/Light")), "Editor · Light", "editor-palette")}${colorSections(colorEntries.filter(([f]) => f.startsWith("Dark/") || f.startsWith("Editor/Dark")), "Dark theme", "dark-palette")}<details class="doc-panel additional-colors"><summary><h2>Additional source styles</h2></summary><div class="palette">${colorEntries.filter(([f]) => !/^(Light|Dark|Editor)\//.test(f)).map(colorFamily).join("")}</div></details></div>`;

  const typeGroups = Map.groupBy(Object.entries(tokens.typography), ([name, style]) => name.startsWith("Editor/") || style.fontFamily.includes("Mono") ? "Editor" : name.startsWith("UI") ? "UI" : "Additional styles");
  const typographyBody = `${head("Typography", "We use Inter for UI components and JetBrains Mono for code.")}<section class="type-columns" id="examples">${[...typeGroups].map(([group, styles], i) => `<article class="doc-panel${i > 1 ? " additional-type" : ""}"><h2>${esc(group)}</h2><p class="caption">Typeface: ${esc(styles[0][1].fontFamily)}</p><div class="type-table-wrap"><table class="type-table"><thead><tr><th>Style</th><th>Weight</th><th>Size / line height</th></tr></thead><tbody>${styles.map(([name, style]) => `<tr><td><span class="type-sample" style="font-family:'${esc(style.fontFamily)}',sans-serif;font-size:${Math.min(style.fontSize, 40)}px;font-weight:${style.fontWeight};line-height:${typeof style.lineHeight === "number" ? `${Math.min(style.lineHeight * Math.min(style.fontSize,40),72)}px` : style.lineHeight};letter-spacing:${style.letterSpacing}">${esc(name.split("/").at(-1))}</span><code>${esc(style.css)}</code></td><td>${esc(style.fontWeight)}</td><td>${style.fontSize} / ${esc(style.lineHeight)}</td></tr>`).join("")}</tbody></table></div></article>`).join("")}</section>`;

  const geometry = inventory.geometry;
  const spacingRows = [...new Set([...geometry.gap, ...geometry.padding])].filter((v) => Number.isInteger(v) && v > 0).sort((a,b) => a-b);
  const spacingBody = `${head("Spacing", "Shared gaps and padding create a predictable rhythm between related controls and content groups.")}<section class="spacing-demo" id="examples"><article class="doc-panel"><h2>Observed spacing</h2><p class="caption">Values from the component library</p>${spacingRows.map((value) => `<div class="measure"><strong>${value}</strong><i style="--w:${value*4}px"></i><span>${value}px</span></div>`).join("")}<p class="note">Gaps: ${geometry.gap.join(" · ")} px<br>Padding: ${geometry.padding.join(" · ")} px</p></article><article class="doc-panel"><h2>Using spacing</h2><p>Use smaller gaps for related items and larger gaps between content groups. These values are the available component measurements, not an invented universal scale.</p><div class="doc-spacing-guide"><span>Label</span><div class="doc-spacing-sample">${inline("input", "Input spacing example")}</div><div class="doc-spacing-actions">${inline("button-secondary", "Cancel")}${inline("button-primary", "OK")}</div></div><details class="provenance"><summary>Geometry notes</summary><p>${esc(geometry.note)}</p></details></article></section>`;

  const pages = {
    "button.html": page("button", "Button", buttonBody),
    "input.html": page("components", "Input field", inputBody),
    "checkbox.html": page("checkbox", "Checkbox", checkboxBody),
    "toggle.html": page("components", "Toggle", toggleBody),
    "dialog.html": page("components", "Dialog", dialogBody),
    "colors.html": page("colors", "Colors", colorsBody),
    "typography.html": page("typography", "Typography", typographyBody),
    "spacing.html": page("spacing", "Spacing", spacingBody),
    "components.html": page("components", "Components", catalogBody),
    "alert.html": page("alert", "Alert", reservedPage("alert")),
    "banner.html": page("banner", "Banner", reservedPage("banner")),
    "combo-box.html": page("combo-box", "Combo box", reservedPage("combo-box")),
  };
  const out = path.join(root, "public");
  fs.mkdirSync(path.join(out, "pages"), { recursive: true });
  for (const file of fs.readdirSync(path.join(out, "pages"))) if (file.endsWith(".html")) fs.rmSync(path.join(out, "pages", file));
  for (const [name, html] of Object.entries(pages)) fs.writeFileSync(path.join(out, "pages", name), html);
  const overviewHtml = page("overview", "Overview", overviewBody);
  fs.writeFileSync(path.join(out, "index.html"), overviewHtml);
  fs.writeFileSync(path.join(root, "index.html"), overviewHtml);
  fs.writeFileSync(path.join(out, "site.js"), siteJs);
  fs.writeFileSync(path.join(out, "site.css"), siteCss(chrome));
  console.log(`Docs: Overview + ${Object.keys(pages).length} pages; ${library.length} catalog entries; inline generated specimens.`);
}

const siteJs = `const navToggle=document.querySelector(".nav-toggle"),nav=document.querySelector("#site-nav");
navToggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");navToggle.setAttribute("aria-expanded",String(open));});
// Thumbnails scale the original inline generated DOM, never substitute another component.
const fitDialog=()=>document.querySelectorAll(".doc-dialog-stage").forEach(stage=>stage.style.setProperty("--dialog-scale",String((stage.clientWidth-56)/963)));
new ResizeObserver(fitDialog).observe(document.documentElement);fitDialog();
document.querySelectorAll("[data-checkbox-demo]").forEach(demo=>{const b=demo.querySelector("button");b?.addEventListener("click",()=>{const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(on));demo.querySelectorAll(".doc-check-state").forEach((el,i)=>el.hidden=Boolean(on&&i!==1));b.textContent=on?"Show all source states":"Switch interactive example";});});
document.querySelectorAll("[data-switch-demo]").forEach(demo=>{const b=demo.querySelector("button");b?.addEventListener("click",()=>{const on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",String(on));demo.querySelector(".doc-switch-off").hidden=Boolean(on);demo.querySelector(".doc-switch-on").hidden=!on;});});
document.querySelectorAll(".chip").forEach(chip=>{chip.tabIndex=0;chip.setAttribute("role","button");const copy=()=>{const value=chip.querySelector("span:last-child")?.textContent;if(value&&navigator.clipboard)navigator.clipboard.writeText(value).catch(()=>{});chip.classList.add("copied");setTimeout(()=>chip.classList.remove("copied"),700);};chip.addEventListener("click",copy);chip.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();copy();}});});
`;

function siteCss(c) {
  return `@font-face{font-family:Inter;src:url('/tokens/Inter-Variable.ttf') format('truetype');font-weight:100 900;font-optical-sizing:auto}
/* Documentation architecture only. Component visuals come from inline generated partials. */
:root{--bg:${c.bg};--surface:${c.surface};--surface-2:${c.soft};--ink:${c.ink};--muted:${c.muted};--line:${c.line};--blue:${c.blue};--green:${c.green};--red:${c.red};--dark:${c.dark};--shadow:0 8px 24px #0000001a}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:13px/1.45 Inter,Arial,sans-serif}a{color:var(--blue);text-decoration:none}a:hover{text-decoration:underline}button,input,select{font:inherit}h1{margin:0;font-size:clamp(42px,6vw,72px);line-height:1.04;letter-spacing:-.045em}h2{margin:0 0 12px;font-size:22px;letter-spacing:-.02em}h3{margin:0 0 18px;font-size:16px}p{margin:0 0 12px}code{font:11px ui-monospace,SFMono-Regular,Consolas,monospace}.topbar{position:sticky;top:0;z-index:20;min-height:56px;display:flex;align-items:center;gap:24px;padding:0 32px;background:#fffffff0;border-bottom:1px solid var(--line);backdrop-filter:blur(16px)}.brand{color:var(--ink);font-size:16px;font-weight:700;white-space:nowrap}nav{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none}nav a{padding:8px 10px;border-radius:6px;color:#4b4d55;white-space:nowrap}nav a:hover,nav a.active{color:var(--ink);background:#e9eaec;text-decoration:none}.nav-toggle{display:none;margin-left:auto;border:1px solid var(--line);border-radius:6px;background:#fff;padding:6px 10px;cursor:pointer}.doc{width:min(1440px,calc(100% - 64px));margin:0 auto;padding:76px 0 120px}.hero{min-height:230px;max-width:720px}.eyebrow,.kicker{margin:0 0 10px;color:var(--blue);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.lead{margin-top:22px;color:#4d5058;font-size:18px;line-height:1.6}.panel,.doc-panel{background:var(--surface);border:1px solid var(--line);border-radius:12px}.overview-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:28px;margin-bottom:100px}.intro-card,.get-card{min-height:390px;padding:38px;display:flex;flex-direction:column;justify-content:space-between}.swatches{display:grid;grid-template-columns:repeat(6,36px);gap:10px;margin:28px 0}.swatches span{width:36px;aspect-ratio:1;border-radius:8px;background:var(--sw);box-shadow:inset 0 0 0 1px #00000014}.type-preview{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:24px 0;border-top:1px solid var(--line)}.foundation-links{display:flex;gap:20px}.steps{list-style:none;margin:8px 0 0;padding:0}.steps li{display:flex;gap:14px;padding:18px 0;border-top:1px solid var(--line)}.steps li>span{width:26px;height:26px;display:grid;place-items:center;flex:0 0 auto;border-radius:50%;background:var(--blue);color:#fff;font-weight:700}.steps p{margin:4px 0 0;color:var(--muted)}.section-heading{margin-bottom:26px}.section-heading>p:last-child{color:var(--muted)}.component-links{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px}.doc-component-card{min-width:0;min-height:198px;padding:20px;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;color:var(--ink);background:#fff;border:1px solid var(--line);border-radius:10px;transition:.18s ease}.doc-component-card:hover{transform:translateY(-3px);box-shadow:var(--shadow);border-color:#c7c9ce;text-decoration:none}.doc-component-card small{color:var(--muted)}.doc-card-preview{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:80px;margin-bottom:auto;overflow:hidden;pointer-events:none;background:var(--surface-2);border-radius:6px}.doc-card-preview .doc-specimen{flex:0 0 auto}.doc-card-specimen{transform:scale(var(--card-scale,.9));transform-origin:center}.doc-card-preview:has([data-component="dialog"]) .doc-card-specimen{--card-scale:.115}.doc-card-preview:has([data-component="input"]) .doc-card-specimen{--card-scale:.68}.doc-card-state{margin-top:5px;color:var(--muted);font-size:9px}.doc-thumbnail-pending{flex-direction:column;gap:9px;color:var(--muted);font-size:11px}.doc-pending-tag,.doc-ready-tag{display:inline-block;width:max-content;padding:3px 6px;color:var(--muted);font-size:9px;font-weight:500;line-height:1.3;background:#e9eaec;border-radius:3px;white-space:nowrap}.doc-ready-tag{color:#276a38;background:#e6f3e9}.sample-dark .doc-pending-tag{color:#c5c8d0;background:#41444b}.page-head{min-height:280px;max-width:700px}.page-head p:not(.eyebrow){max-width:580px;margin-top:24px;font-size:15px}.page-head .usage{display:inline-block;margin-top:0;font-size:13px}.showcase{min-width:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,.8fr);gap:64px;align-items:start}.showcase.single{grid-template-columns:minmax(0,1fr)}.sample-card{min-width:0;max-width:100%;overflow-x:auto;background:#fff;border:1px solid var(--line);border-radius:10px}.sample-light,.sample-dark{min-width:680px;padding:28px}.sample-dark{color:#f1f1f1;background:var(--dark)}.doc-zone-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:26px}.doc-zone-head h2{margin:0;font-size:14px}.doc-matrix{display:grid;grid-template-columns:100px repeat(5,minmax(86px,1fr));gap:22px 15px;align-items:center}.matrix .label,.caption,.label{color:var(--muted);font-size:11px}.sample-dark .label,.sample-dark .caption{color:#aaaeb8}.doc-state-cell{position:relative;min-width:72px;min-height:42px;display:flex;align-items:center;flex-direction:column;gap:5px}.doc-specimen{position:relative;display:inline-block;vertical-align:top;flex:0 0 auto;width:var(--specimen-width);height:var(--specimen-height);max-width:none;pointer-events:none}.doc-pending{display:flex;align-items:center;justify-content:center;gap:7px;min-width:75px;min-height:44px;padding:10px;color:var(--muted);text-align:center;background:var(--surface-2);border:1px dashed #cfd2d9;border-radius:5px}.doc-pending strong{font-size:10px;font-weight:400;line-height:1.35}.doc-pending-icon{font-size:19px;line-height:1}.sample-dark .doc-pending{color:#b7bbc4;background:#34363b;border-color:#53565f}.doc-pending-mark{color:var(--muted);font-size:22px}.doc-panel{padding:38px}.subsection+.subsection{margin-top:50px}.provenance{margin-top:16px;padding:12px 16px;background:#fff;border:1px solid var(--line);border-radius:7px}.provenance summary{color:var(--muted);cursor:pointer;font-size:11px}.provenance>div,.provenance>p{margin-top:15px}.provenance p{font-size:11px;color:var(--muted)}.doc-usage-stage{margin-top:20px;padding:24px;background:var(--surface-2);border-radius:7px}.doc-usage-stage+.doc-usage-stage{margin-top:12px}.doc-usage-stage>div,.doc-spacing-actions{display:flex;align-items:center;justify-content:flex-end;gap:12px}.doc-usage-grid{display:grid;grid-template-columns:repeat(5,minmax(75px,1fr));gap:10px;margin-top:20px;overflow-x:auto}.doc-usage-grid>div{display:flex;flex-direction:column;gap:10px}.doc-placeholder-row{margin-top:20px}.doc-placeholder-row .doc-pending{justify-content:flex-start;padding-left:20px}.doc-option-stage{margin-top:20px;display:grid;gap:16px}.doc-option-stage>div{display:flex;align-items:center;gap:18px}.doc-option-stage .caption{min-width:88px}.doc-demo-toggle{margin-top:20px;display:grid;gap:12px}.doc-demo-toggle button,.doc-switch-demo button{width:max-content;min-height:28px;padding:4px 10px;color:var(--blue);background:#fff;border:1px solid var(--line);border-radius:4px;cursor:pointer}.doc-demo-toggle [hidden],.doc-switch-demo [hidden]{display:none}.doc-check-state:has([aria-checked="mixed"]){visibility:visible}.doc-control-matrix{display:grid;grid-template-columns:repeat(4,minmax(130px,1fr));gap:16px}.doc-control-matrix>div{display:flex;flex-direction:column;align-items:flex-start;gap:20px}.doc-switch-demo{display:grid;gap:18px;margin-top:20px;padding:24px;background:var(--surface-2)}.doc-dialog-stage{width:100%;overflow:hidden;position:relative;background:var(--surface-2);border-radius:6px;aspect-ratio:963/575}.doc-dialog-stage>.doc-specimen{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(var(--dialog-scale,.65));transform-origin:center}.doc-reserved-states{display:grid;grid-template-columns:repeat(2,minmax(170px,1fr));gap:12px}.doc-reserved-states>div{display:grid;gap:9px}.catalog-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.catalog-item{min-width:0;scroll-margin-top:76px;min-height:250px;padding:24px;display:flex;flex-direction:column;background:#fff;border:1px solid var(--line);border-radius:10px}.catalog-item:target{border-color:var(--blue);box-shadow:0 0 0 2px #3574f022}.catalog-item h2{font-size:16px}.catalog-item>div>p{color:var(--muted)}.catalog-demo{position:relative;min-height:105px;margin-top:auto;padding:18px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--surface-2);border-radius:7px}.catalog-demo>.doc-pending{width:100%}.catalog-demo>.doc-specimen{transform:scale(var(--catalog-scale,1));transform-origin:center}.catalog-demo:has([data-component="dialog"]) .doc-specimen{--catalog-scale:.22;position:absolute}.catalog-demo:has([data-component="input"]) .doc-specimen{--catalog-scale:.7}.doc-card-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:12px;color:var(--muted);font-size:10px}.doc-card-footer a{font-size:11px;white-space:nowrap}.doc-color-sections{display:grid;gap:28px}.color-zone{min-width:0}.palette{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:26px;margin-top:26px}.color-family{display:grid;align-content:start;gap:6px;min-width:0}.color-family h3{margin-bottom:6px;overflow-wrap:anywhere}.chip{height:34px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 8px;overflow:hidden;color:#fff;background:var(--chip);border:1px solid #0000000f;border-radius:4px;font:9px ui-monospace,SFMono-Regular,monospace;cursor:pointer}.chip.light-ink{color:#19191c}.chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.chip span:last-child{flex:0 0 auto}.chip:hover{outline:2px solid var(--blue);outline-offset:1px}.chip.copied{outline:2px solid var(--green);outline-offset:2px}.dark-palette{color:#fff;background:var(--dark);border-color:var(--dark)}.dark-palette>.caption,.dark-palette .color-family h3{color:#d9dce3}.dark-palette .chip{border-color:#ffffff17}.editor-palette .palette{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}.additional-colors summary{cursor:pointer}.additional-colors summary h2{margin:0}.type-columns{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start}.type-columns .additional-type{grid-column:1/-1}.type-table-wrap{overflow-x:auto}.type-table{width:100%;border-collapse:collapse}.type-table th,.type-table td{padding:15px 10px;text-align:left;vertical-align:middle;border-bottom:1px solid var(--line)}.type-table th{color:var(--muted);font-size:11px;font-weight:500}.type-table td:nth-child(n+2){white-space:nowrap}.type-sample{display:block}.type-table code{display:block;margin-top:4px;color:var(--muted);font-size:9px;overflow-wrap:anywhere}.spacing-demo{display:grid;grid-template-columns:.65fr 1.35fr;gap:40px}.measure{display:flex;align-items:center;gap:15px;margin:25px 0}.measure i{display:block;width:var(--w);min-width:4px;height:3px;background:var(--blue)}.measure strong{min-width:24px;font-family:ui-monospace,monospace;text-align:right}.note{margin-top:30px;padding:14px;color:var(--muted);background:var(--surface-2);border:1px solid var(--line);border-radius:6px;font-size:11px}.doc-spacing-guide{display:grid;gap:24px;margin-top:34px;padding:28px;background:var(--surface-2);border:1px solid var(--line);border-radius:6px}.doc-spacing-sample .doc-specimen{max-width:none}footer:not(.doc-card-footer){padding:28px 32px;color:var(--muted);background:#fff;border-top:1px solid var(--line)}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}

.doc-dialog-stage{--dialog-scale:calc(1298/963)}.doc-dialog-stage>.doc-specimen{transform:translate(calc(-50% / var(--dialog-scale)),calc(-50% / var(--dialog-scale))) scale(var(--dialog-scale))}
.showcase>div{min-width:0}
@media(max-width:1200px){.doc-dialog-stage{--dialog-scale:calc(850/963)}.component-links{grid-template-columns:repeat(4,minmax(0,1fr))}.showcase{gap:32px}.showcase>div{min-width:0}.sample-card{max-width:100%}.doc-panel{padding:28px}.sample-light,.sample-dark{padding:24px}}
@media(max-width:1000px){.doc-dialog-stage{--dialog-scale:calc(650/963)}.overview-grid,.showcase,.spacing-demo,.type-columns{grid-template-columns:minmax(0,1fr)}.component-links{grid-template-columns:repeat(3,minmax(0,1fr))}.catalog-grid{grid-template-columns:1fr 1fr}.palette{grid-template-columns:repeat(3,1fr)}}
@media(max-width:720px){.doc-dialog-stage{--dialog-scale:calc(314/963)}.topbar{padding:0 18px;flex-wrap:wrap}.nav-toggle{display:block}nav{display:none;width:100%;padding:0 0 12px;flex-wrap:wrap}nav.open{display:flex}.doc{width:min(100% - 32px,1440px);padding-top:48px}.hero,.page-head{min-height:230px}.overview-grid{gap:16px;margin-bottom:64px}.intro-card,.get-card,.doc-panel,.sample-light,.sample-dark{padding:22px}.component-links{grid-template-columns:1fr 1fr}.catalog-grid{grid-template-columns:1fr}.doc-matrix{min-width:690px}.type-preview{grid-template-columns:1fr}.palette{grid-template-columns:1fr 1fr}.doc-control-matrix{min-width:520px}.doc-reserved-states{grid-template-columns:1fr 1fr}.doc-card-state{font-size:8px}}
@media(max-width:430px){.doc-dialog-stage{--dialog-scale:calc(314/963)}.component-links{gap:10px}.doc-component-card{padding:14px}.doc-card-footer{align-items:flex-start;flex-direction:column}}
`;
}
