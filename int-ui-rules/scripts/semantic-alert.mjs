import fs from "node:fs";
/* Layer → semantic element mapping (the pilot for future component renderers):
 * COMPONENT → role=alertdialog window; Type → status-dot; Text frame →
 * window-body > alert-title > heading/body/checkline; Bottom → window-actions;
 * Buttons → real button.btn[.primary]; Help → accessible icon button.
 * Layout is ordinary flex/grid flow—never an x/y coordinate or SVG dialog shell.
 */
export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}
export const hex = (color) => !color ? "transparent" : `#${[color.r, color.g, color.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
const paint = (node) => node?.fills?.find((p) => p.visible !== false)?.color;
const stroke = (node) => node?.strokes?.find((p) => p.visible !== false)?.color;
export function styleToken(node, side, rules, tokens) {
  const id = node?.[side === "stroke" ? "strokeStyleId" : "fillStyleId"];
  const style = rules.paintStyles.find((s) => s.id === id);
  if (style && tokens.color[style.name]) return `var(${tokens.color[style.name].css})`;
  const color = side === "stroke" ? stroke(node) : paint(node);
  if (!color) return "transparent";
  const colorName = Object.keys(tokens.color).find((name) => tokens.color[name].value.toUpperCase() === hex(color));
  if (!colorName) throw new Error(`Alert ${side} paint must resolve to a source token: ${node?.id} ${hex(color)}`);
  return `var(${tokens.color[colorName].css})`;
}
export const weight = (node) => ({ Regular: 400, Medium: 500, "Semi Bold": 600, Bold: 700 })[node?.fontName?.style] || 400;
export const textStyle = (node, rules, tokens) => `font-family:${node.fontName.family},sans-serif;font-size:${node.fontSize}px;font-weight:${weight(node)};line-height:${node.lineHeight.value}px;letter-spacing:${node.letterSpacing?.value || 0}px;color:${styleToken(node, "fill", rules, tokens)}`;
export function walk(node) {
  return [node, ...(node.children || []).flatMap(walk)];
}
export function semanticAlertDemo({ title, body, status = "info", theme = "light", check = false, actions = ["Cancel", "OK"], micro = false, wide = false }, id = "alert-demo") {
  // Semantic reference examples; not additional Pixso-verified masters and not modal dialogs.
  const model = alertQuestionModels?.[theme];
  if (!model || !bannerStatusSources[theme]?.[status]) throw new Error(`Alert demo model is not configured: ${theme}/${status}`);
  const icon = status === "info" ? questionIcon(model, vectorsById, micro ? 20 : 28) : bannerStatusIcon(status, theme, micro ? 20 : 28);
  const sourceId = status === "info" ? model.status.id : bannerStatusSources[theme][status].id;
  return `<div class="window ${micro ? "micro-alert" : "alert"}${wide ? " wide" : ""}${theme === "dark" ? " dark" : ""}" data-alert-demo="${id}" role="group" aria-labelledby="${id}-title" aria-describedby="${id}-body"><div class="window-body"><div class="alert-title"><span class="status-dot ${status}" data-layer="status" data-pixso-id="${sourceId}" aria-label="${status === "info" ? "Information" : status === "warning" ? "Warning" : "Error"}">${icon}</span><div class="alert-content"><h3 id="${id}-title">${esc(title)}</h3><p id="${id}-body">${esc(body)}</p>${check ? `<label class="checkline"><input type="checkbox"> Do not ask again</label>` : ""}</div></div></div><div class="window-actions">${actions.map((label, index) => `<button class="btn${index === actions.length - 1 ? " primary" : ""}" type="button">${esc(label)}</button>`).join("")}</div></div>`;
}
export function readAlertMaster(master, rules, tokens) {
  const nodes = walk(master), find = (name) => nodes.find((node) => node.name === name && node.visible !== false);
  const content = master.children.find((node) => node.name === "Text");
  const title = content?.children.find((node) => node.type === "TEXT" && node.name !== "Body text");
  const body = content?.children.find((node) => node.name === "Body text");
  const checkbox = content?.children.find((node) => node.name === "Checkbox" && node.visible !== false);
  const status = find("Type");
  if (!title || !body) throw new Error(`Incomplete Alert content master: ${master.id}`);
  const statusColor = walk(status || {}).find((node) => node.type === "ELLIPSE" && node.visible !== false);
  const bottom = find("Bottom");
  if (!content || !checkbox || !status || !bottom) throw new Error(`Incomplete Alert layer set: ${master.id}`);
  const help = bottom?.children.find((node) => node.name === "Help" && node.visible !== false);
  const helpGlyph=walk(help||{}).find(n=>n.type==="INSTANCE");
  const helpVector=walk(helpGlyph||{}).find(n=>n.type==="VECTOR" && n.visible!==false);
  const helpInk=walk(helpGlyph||{}).find(n=>n.type==="ELLIPSE" && n.parentId===helpVector?.parentId);
  const buttons = bottom?.children.find((node) => node.name === "Buttons")?.children.filter((node) => node.name === "Button" && node.visible !== false).map((node) => ({
    label: walk(node).find((child) => child.type === "TEXT")?.characters || "Action",
    primary: walk(node).some((child) => child.type === "TEXT" && child.visible !== false && hex(paint(child)).toUpperCase() === "#FFFFFF"),
    color: styleToken(walk(node).find((child) => child.type === "TEXT"), "fill", rules, tokens),
    border: walk(node).some((child) => child.name === "Content" && child.strokes?.some((p) => p.visible !== false)) ? styleToken(walk(node).find((child) => child.name === "Content"), "stroke", rules, tokens) : "transparent",
    background: hex(paint(walk(node).find((child) => child.name === "Content"))) === "transparent" ? "transparent" : styleToken(walk(node).find((child) => child.name === "Content"), "fill", rules, tokens),
  })) || [];
  return { id: master.id, theme: /Theme\s*=\s*Dark/.test(master.name) ? "dark" : "light", width: master.width, height: master.height, title, body, checkbox, checkboxLabel: walk(checkbox || {}).find((node) => node.type === "TEXT"), status, statusColor, help, buttons,
    surface: styleToken(master, "fill", rules, tokens), border: styleToken(master, "stroke", rules, tokens),
    shadow: `var(${tokens.effect["Shadow / Dialog"]?.css || tokens.effect["Light/Shadow/Dialog"].css})`,
    info: styleToken(statusColor, "fill", rules, tokens),
    titleCss: textStyle(title, rules, tokens), bodyCss: textStyle(body, rules, tokens),
    checkboxCss: checkbox ? textStyle(walk(checkbox).find((node) => node.type === "TEXT"), rules, tokens) : "",
    checkboxBorder: checkbox ? styleToken(walk(checkbox).find((node) => node.type === "RECTANGLE"), "stroke", rules, tokens) : "",
    checkboxBackground: checkbox ? hex(paint(walk(checkbox).find((node) => node.type === "RECTANGLE"))) === "transparent" ? "transparent" : styleToken(walk(checkbox).find((node) => node.type === "RECTANGLE"), "fill", rules, tokens) : "",
    helpSurface: styleToken(walk(help||{}).find(n=>n.name==="Background"), "fill",rules,tokens),
    helpBorder: styleToken(walk(help||{}).find(n=>n.name==="Background"), "stroke",rules,tokens),
    actionsGap: find("Buttons")?.itemSpacing,
    helpVisible: Boolean(help),
    contentId: content.id, contentWidth: content.width, contentHeight: content.height,
    contentGap: content.itemSpacing, contentPadding: content.paddingTop,
    statusGap: content.x - (status.x + status.width),
    statusWidth: status.width, statusHeight: status.height,
    statusPadding: Math.max(0, status.y - content.y),
    actionsHeight: bottom.height,
    rootPadding: { top: master.paddingTop, right: master.paddingRight, bottom: master.height - (bottom.y + bottom.height), left: status.x },
    rootGap: bottom.y - (content.y + content.height), rootRadius: master.cornerRadius,
    onPrimary: styleToken(walk(find("Buttons")).find((node) => node.type === "TEXT" && hex(paint(node)) === "#FFFFFF"), "fill", rules, tokens),
    helpInk: helpInk ? styleToken(helpInk,"fill",rules,tokens) : "transparent",
    rootSource: `${master.id.replace(":", "-")}.json`,
  };
}
const vectorsById = new Map(JSON.parse(fs.readFileSync(new URL("../source/vectors-extra.json", import.meta.url), "utf8")).map(item => [item.id, item.svg]));
// Nest each source export as a complete SVG viewport: path-local transforms
// (matrix/rotate/etc.) and its viewBox must not be stripped or re-invented.
function sourcePaths(nodes, vectors) {
  return nodes.filter(node => node.type === "VECTOR" && node.visible !== false).map(node => {
    const svg = vectors.get(node.id);
    if (!svg?.match(/^\s*<svg\b[^>]*\bviewBox="[^"]+"/)) throw new Error(`Invalid source glyph viewport ${node.id}`);
    const nested = svg.trim().replace(/^<svg\b/, `<svg x="${node.x}" y="${node.y}" overflow="visible" data-source-vector-export="true" data-pixso-id="${node.id}"`)
      .replace(/\scustomFrame=/g, " data-source-frame=");
    return nested;
  }).join("");
}
function ellipseSvg(node, fill) {
  return `<ellipse cx="${node.x + node.width / 2}" cy="${node.y + node.height / 2}" rx="${node.width / 2}" ry="${node.height / 2}" fill="${fill}" data-pixso-id="${node.id}"/>`;
}
function questionIcon(model, vectors, size = model.statusWidth) {
  const background = walk(model.status).find(node => node.type === "ELLIPSE" && node.visible !== false);
  if (background?.id !== model.statusColor.id) throw new Error(`Alert ${model.id}: status must use its source questionDialog ellipse`);
  const glyphs = sourcePaths(walk(model.status), vectors);
  return `<svg viewBox="0 0 ${model.statusWidth} ${model.statusHeight}" width="${size}" height="${size}" fill="none" aria-hidden="true" data-layer="small-icon">${ellipseSvg(background, model.info)}${glyphs}</svg>`;
}
const bannerStatusIds = {
  light: { info: "11163-19910", error: "11163-20351", warning: "11163-69185" },
  dark: { info: "11163-69299", error: "11163-69571", warning: "11163-69649" },
};
const bannerStatusSources = {};
for (const [theme, statuses] of Object.entries(bannerStatusIds)) {
  bannerStatusSources[theme] = {};
  for (const [status, file] of Object.entries(statuses)) {
    const master = JSON.parse(fs.readFileSync(new URL(`../source/components/${file}.json`, import.meta.url), "utf8"));
    const nodes = walk(master);
    const source = nodes.find(node => node.name === `status / ${status}` && node.visible !== false);
    if (source?.width !== 16 || source.height !== 16 || !new RegExp(`^Theme=${theme === "dark" ? "Dark" : "Light"}(?:,|$)`).test(master.name)) throw new Error(`Unexpected Banner status source: ${file}`);
    bannerStatusSources[theme][status] = source;
  }
}
let alertQuestionModels;
export function configureAlertMasters(models) {
  if (models.length !== 2 || new Set(models.map(model => model.theme)).size !== 2) throw new Error("Both verified Alert questionDialog masters are required");
  alertQuestionModels = Object.fromEntries(models.map(model => [model.theme, model]));
}

// Use native Pixso SVG exports for measured Banner status geometry.
function bannerStatusIcon(status, theme, size) {
  const source = bannerStatusSources[theme]?.[status];
  if (!source || status === "info" || ![20, 28].includes(size)) throw new Error(`Unsupported Alert status icon: ${theme}/${status}/${size}`);
  // Native Pixso export contains the rounded polygon and the transformed stem;
  // the source bbox alone cannot describe those curves.
  const exported = fs.readFileSync(new URL(`../source/icons/alert-${theme}-${status}.svg`, import.meta.url), "utf8").trim();
  if (!/^<svg\b[^>]*viewBox="0 0 16 16"/.test(exported) || /<(?:image|foreignObject)\b/.test(exported)) throw new Error(`Invalid native status export ${source.id}`);
  const nested = exported.replace(/^<svg\b[^>]*>/, `<svg x="0" y="0" width="16" height="16" viewBox="0 0 16 16" overflow="visible" data-source-vector-export="true" aria-hidden="true" data-status-source="${source.id}">`);
  return `<svg viewBox="0 0 16 16" width="${size}" height="${size}" fill="none" aria-hidden="true" data-layer="small-icon" data-status-source="${source.id}">${nested}</svg>`;
}
export function assertSemanticAlert(html, file = "Alert") {
  if (/position\s*:\s*(?:absolute|fixed|sticky)/i.test(html)) throw new Error(`${file}: Alert must use flow/flex/grid layout only`);
  for (const marker of [...html.matchAll(/<svg\b[^>]*>/gi)].map(match => match[0])) if (!(/data-layer="small-icon"/.test(marker) || /<svg\b[^>]*\bdata-source-vector-export="true"/.test(marker)) || /data-stroke-align/i.test(marker)) throw new Error(`${file}: SVG shell forbidden; only small source glyph icons are allowed`);
  const statusDots = [...html.matchAll(/<span\b[^>]*class="status-dot\b[^>]*>([\s\S]*?)<\/span>/gi)];
  if (!statusDots.length) throw new Error(`${file}: missing status icon layer`);
  for (const [, content] of statusDots) {
    const icons = [...content.matchAll(/<svg\b[^>]*data-layer="small-icon"[^>]*>[\s\S]*?<\/svg>\s*$/gi)];
    if (icons.length !== 1 || content.replace(icons[0][0], "").trim()) throw new Error(`${file}: status-dot must contain exactly one SVG icon and no text/HTML glyph layer`);
  }
  for (const marker of ['role="alertdialog"', 'class="window-body"', 'class="alert-title"', 'class="status-dot info"', 'class="checkline"', 'class="window-actions"', 'class="btn primary"']) if (!html.includes(marker)) throw new Error(`${file}: missing semantic layer ${marker}`);
}
export function renderSemanticAlert({ model, key }) {
  const html=`<div class="window alert${model.theme === "dark" ? " dark" : ""}" role="alertdialog" aria-modal="true" aria-labelledby="${key}-title" aria-describedby="${key}-body" data-component="${key}" data-source-node="${model.id}" data-layer="dialog-chrome" data-pixso-id="${model.id}">
  <div class="window-body" data-layer="body">
    <div class="alert-title">
      <span class="status-dot info" data-layer="status" data-pixso-id="${model.status.id}" aria-label="Information">${questionIcon(model,vectorsById)}</span>
      <div class="alert-content" data-layer="content" data-source-node="${model.contentId}">
        <h3 id="${key}-title" data-layer="title" data-kind="TEXT" data-pixso-id="${model.title.id}" style="${model.titleCss}">${esc(model.title.characters)}</h3>
        <p id="${key}-body" data-layer="body-text" data-kind="TEXT" data-pixso-id="${model.body.id}" style="${model.bodyCss}">${esc(model.body.characters)}</p>
        <label class="checkline" data-layer="checkbox" data-kind="CHECKBOX" data-pixso-id="${model.checkbox.id}" data-pixso-width="${model.checkbox.width}" data-pixso-height="${model.checkbox.height}" style="${model.checkboxCss}"><input type="checkbox" data-kind="CHECKBOX" aria-label="${esc(model.checkboxLabel.characters)}"> ${esc(model.checkboxLabel.characters)}</label>
      </div>
    </div>
  </div>
  <div class="window-actions" data-layer="actions">
    ${model.helpVisible?`<button class="window-help" type="button" aria-label="Help" data-pixso-id="${model.help.id}">${helpIcon(model,vectorsById)}</button>`:""}
    ${model.buttons.map((button)=>`<button class="btn${button.primary?" primary":""}" type="button">${esc(button.label)}</button>`).join("")}
  </div>
</div>`;
  assertSemanticAlert(html,`components/${key}.html`);
  return html;
}
function helpIcon(model,vectors) {
  const helpIconInstance=walk(model.help).find(n=>n.type==="INSTANCE");
  const dot=walk(helpIconInstance).find(n=>n.type==="ELLIPSE" && n.parentId===walk(helpIconInstance).find(child=>child.type==="VECTOR")?.parentId);
  const glyphs=sourcePaths(walk(helpIconInstance),vectors);
  return `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" data-layer="small-icon"><ellipse cx="${dot.x+dot.width/2}" cy="${dot.y+dot.height/2}" rx="${dot.width/2}" ry="${dot.height/2}" fill="${model.helpInk}" data-pixso-id="${dot.id}"/>${glyphs}</svg>`;
}
export function semanticAlertCss(tokens, masters) {
  if (masters.length !== 2 || new Set(masters.map(m => m.theme)).size !== 2) throw new Error("Both extracted Light and Dark Alert masters are required");
  const themes = masters.map(m => [
    `--alert-${m.theme}-surface:${m.surface}`,
    `--alert-${m.theme}-border:${m.border}`,
    `--alert-${m.theme}-ink:${m.buttons[0].color}`,
    `--alert-${m.theme}-button-border:${m.buttons[0].border}`,
    `--alert-${m.theme}-button-bg:${m.buttons[0].background}`,
    `--alert-${m.theme}-on-primary:${m.onPrimary}`,
    `--alert-${m.theme}-info:${m.info}`,
    `--alert-${m.theme}-primary:${m.buttons.at(-1).background}`,
    `--alert-${m.theme}-checkbox-border:${m.checkboxBorder}`,
    `--alert-${m.theme}-checkbox-bg:${m.checkboxBackground}`,
    `--alert-${m.theme}-help-bg:${m.helpSurface}`,`--alert-${m.theme}-help-border:${m.helpBorder}`,
  ].join(";")).join(";");
  const geometry = m => ({
    width: m.width,
    border: 1,
    strokeAlign: "INSIDE",
    padding: [m.rootPadding.top, m.rootPadding.right, m.rootPadding.bottom, m.rootPadding.left],
    gap: m.rootGap,
    contentHeight: m.contentHeight,
    contentGap: m.contentGap,
    status: m.statusWidth,
    statusHeight: m.statusHeight,
    statusPadding: m.statusPadding,
    statusGap: m.statusGap,
    actionsHeight: m.actionsHeight,
    actionsGap: m.actionsGap,
    radius: m.rootRadius,
  });
  const light = geometry(masters[0]);
  for (const master of masters.slice(1))
    for (const [key, value] of Object.entries(light))
      if (JSON.stringify(geometry(master)[key]) !== JSON.stringify(value)) throw new Error(`Alert ${master.id} ${key}: measure a per-theme value instead of inventing a shared metric`);
  const tokensCss = `${themes};--alert-shadow:${masters[0].shadow}`;
  const metricsCss = `
.window {
  width: min(${light.width}px, 100%);
  padding: ${light.padding.map(v => v - light.border).join("px ")}px;
  gap: ${light.gap}px;
  border: ${light.border}px solid var(--alert-border);
  border-radius: ${light.radius}px;
}
.doc-semantic-specimen .window, #specimen > .window { width: ${light.width}px; max-width: 100%; }
.doc-semantic-specimen { width: 100%; max-width: 100%; }
.window-body { padding: ${masters[0].contentPadding}px 0; }
.alert-title { gap: ${light.statusGap}px; min-height: ${light.contentHeight}px; }
.alert-content { gap: ${light.contentGap}px; }
.status-dot { flex-basis: ${light.status}px; width: ${light.status}px; height: ${light.statusHeight}px; margin-top: ${light.statusPadding}px; }
.window-actions { gap: ${light.actionsGap}px; min-height: ${light.actionsHeight}px; }`;
  const template = fs.readFileSync(new URL("./semantic-alert.css", import.meta.url), "utf8");
  const css = template.replace("/* SOURCE_TOKENS */", tokensCss).replace("/* SOURCE_METRICS */", metricsCss);
  if (/\/\* SOURCE_/.test(css)) throw new Error("Every extracted Alert template value must be emitted");
  return css;
}
