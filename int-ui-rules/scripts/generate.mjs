/** Rules -> semantic HTML partials; no old conversion output is consumed.
 * Roots wrap measured primitive descendants. SVG is used only for exact source vectors. */
import fs from "node:fs";
import { generateDocs } from "./generate-docs.mjs";
import { esc as escapeHtml, hex, readAlertMaster, semanticAlertCss, textStyle, assertSemanticAlert, renderSemanticAlert } from "./semantic-alert.mjs";
const master = JSON.parse(fs.readFileSync("tokens/tokens.json", "utf8"));
const catalog = JSON.parse(fs.readFileSync("source/component-catalog.json"));
const sourceStyles = JSON.parse(
  fs.readFileSync("source/vector-and-styles.json", "utf8"),
);
master.paints = Object.fromEntries(
  sourceStyles.paintStyles.map((x) => [x.id, x]),
);
master.texts = Object.fromEntries(
  sourceStyles.textStyles.map((x) => [x.id, x]),
);
const vectors = Object.fromEntries(
  sourceStyles.vectors.filter((x) => x.svg).map((x) => [x.id, x.svg]),
);
for (const v of JSON.parse(
  fs.readFileSync("source/vectors-extra.json", "utf8"),
))
  if (v.svg) vectors[v.id] = v.svg;
const tokenForColor = {};
for (const theme of ["Light", "Dark"])
  for (const [name, value] of Object.entries(master.color))
    if (name.startsWith(theme + "/") && !name.includes("(Current)"))
      (tokenForColor[theme] ||= {})[String(value.value).toUpperCase()] = value.css;
let rootTheme = "Light";
const token = (color) => tokenForColor[rootTheme]?.[color] ? `var(${tokenForColor[rootTheme][color]})` : color;
const isDarkName = (name) => /^Theme\s*=\s*Dark(?:,|$)/.test(name || "");
const ids = fs
  .readdirSync("source/components")
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.slice(0, -5));
const rules = Object.fromEntries(
  ids.map((id) => [
    id,
    JSON.parse(fs.readFileSync(`source/components/${id}.json`, "utf8")),
  ]),
);
const sourceTextOutlines = Object.fromEntries(
  JSON.parse(fs.readFileSync("source/text-geometry.json", "utf8")).map((v) => [
    v.id,
    v,
  ]),
);
const sourceVectorExports = JSON.parse(
  fs.readFileSync("source/svg.json", "utf8"),
);
const nativeScene = process.env.INT_UI_NATIVE_SCENE === "1";
const vectorSceneRules = new Set([
  "7944:74792", "3894:82043", "3894:82033", "7944:74566", "7070:146044",
  "6517:82734", "7059:86469", "5767:82631",
  "7070:146270", "3590:81646",
  "3342:83343", "3346:81595", "46:11087", "7281:46903",
  "3595:83697", "55:9038", "56:8740", "71:11758", "5664:79159",
  "6222:73548", "3711:79011", "5875:79108", "1146:54209", "7278:46644",
  "7040:84853", "217:51357", "605:47011", "6551:84194", "7070:138481",
]);
const glyphMode = process.env.INT_UI_VECTOR_TEXT === "1";
const prompts = {
  checkbox: "Text",
  toggle: "",
  button: "Button",
  input: "Text",
  dialog: "Title",
};
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const rgba = (c) =>
  c
    ? `#${[c.r, c.g, c.b]
        .map((v) =>
          Math.round(v * 255)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")}`.toUpperCase()
    : "transparent";
const weight = (s) =>
  ({ Regular: 400, Medium: 500, "Semi Bold": 600, Bold: 700 })[s] || 400;
const paints = (p) =>
  p
    ?.filter((v) => v.visible !== false)
    .map((v) => (v.type === "SOLID" ? rgba(v.color) : null))
    .filter(Boolean)
    .at(-1) || "transparent";
function style(n, parent, isText = false, isVector = false) {
  const textStyle = master.texts[n.textStyleId] || {},
    f = n.fontName?.family ? n.fontName : (textStyle.fontName || {});
  const fill = n.fills?.find((p) => p.visible !== false);
  const cPaint = fill?.color;
  const p = cPaint ? rgba(cPaint) : "transparent";
  const s = [
    "position:absolute",
    `left:${parent ? n.x : 0}px`,
    `top:${parent ? n.y : 0}px`,
    `width:${n.width}px`,
    `height:${n.height}px`,
  ];
  if (n.opacity !== 1) s.push(`opacity:${n.opacity ?? 1}`);
  const fillVisible = fill && (fill.opacity ?? 1) > 0;
  if (isText || (!isVector && fillVisible))
    s.push(`${isText ? "color" : "background-color"}:${token(p)}`);
  if (!isVector && fill && !fillVisible) s.push("background:transparent");
  if (!isVector && fill?.type && fill.type !== "SOLID" && fillVisible)
    s.push(`background-image:${cssGradient(fill)}`);
  const stroke = n.strokes?.find((v) => v.visible !== false && (v.opacity ?? 1) > 0);
  if (stroke) {
    const color = rgba(stroke.color?.color ?? stroke.color ?? null);
    const match = Object.entries(master.color).find(
      ([name, v]) =>
        v.value === color &&
        name.startsWith(rootTheme + "/") &&
        (name.toLowerCase().includes("gray") ||
          name.toLowerCase().includes("grey")),
    );
    // Keep blue/red semantic strokes exact too; this palette equality is measured, not guessed.
    const strokeDeclaration = `${n.strokeWeight ?? 1}px solid ${match?.[1]?.css ? `var(${match[1].css})` : token(color)}`;
    const weight = n.strokeWeight ?? 1;
    if (n.strokeAlign === "CENTER") {
      s.push("box-sizing:content-box", "margin:0");
    } else if (n.strokeAlign === "OUTSIDE") {
      s.push("box-sizing:content-box", `outline:${strokeDeclaration}`);
    } else {
      s.push("box-sizing:border-box", `border:${strokeDeclaration}`);
    }
  }
  if (n.type === "ELLIPSE") s.push("border-radius:50%");
  else if (n.cornerRadius) s.push(`border-radius:${n.cornerRadius}px`);
  else if (
    n.topLeftRadius ||
    n.topRightRadius ||
    n.bottomLeftRadius ||
    n.bottomRightRadius
  )
    s.push(
      `border-radius:${n.topLeftRadius || 0}px ${n.topRightRadius || 0}px ${n.bottomRightRadius || 0}px ${n.bottomLeftRadius || 0}px`,
    );
  if (n.clipsContent) s.push("overflow:hidden");
  for (const e of n.effects || [])
    if (e.visible !== false && e.type === "DROP_SHADOW")
      s.push(
        `box-shadow:${e.offset.x}px ${e.offset.y}px ${e.radius}px ${e.spread}px rgba(${Math.round(e.color.r * 255)},${Math.round(e.color.g * 255)},${Math.round(e.color.b * 255)},${e.color.a})`,
      );
  if (isText)
    s.push(
      `font-family:${f.family || "Inter"},sans-serif`,
      `font-size:${n.fontSize ?? textStyle.fontSize ?? 13}px`,
      `font-weight:${weight(f.style || "Medium")}`,
      `line-height:${n.lineHeight?.value ?? textStyle.lineHeight?.value ?? 16}px`,
      `letter-spacing:${n.letterSpacing?.value ?? 0}px`,
      "padding:0",
      "border:0",
      "background:transparent",
      "margin:0",
      "white-space:pre",
      "overflow:hidden",
    );
  return s.join(";");
}
function cssGradient(paint) {
  const list = paint.gradientStops || [];
  if (!list.length) return "none";
  const stops = list.map((stop) => `rgba(${Math.round(stop.color.r*255)},${Math.round(stop.color.g*255)},${Math.round(stop.color.b*255)},${stop.color.a ?? 1}) ${Math.round(stop.position*100)}%`).join(",");
  return `linear-gradient(180deg,${stops})`;
}
function vectorPaint(n) {
  const fill = n.fills?.find((p) => p.visible !== false && (p.opacity ?? 1) > 0);
  const stroke = n.strokes?.find((p) => p.visible !== false && (p.opacity ?? 1) > 0);
  const fillColor = fill?.type === "SOLID" ? rgba(fill.color) : null;
  const strokeColor = stroke?.type === "SOLID" ? rgba(stroke.color) : null;
  const shape = n.type === "ELLIPSE" ? "ellipse" : "rect";
  const dimensions = shape === "ellipse" ? `cx="${n.width/2}" cy="${n.height/2}" rx="${n.width/2}" ry="${n.height/2}"` : `width="${n.width}" height="${n.height}" rx="${n.cornerRadius || 0}"`;
  return `<svg width="${n.width}" height="${n.height}" viewBox="0 0 ${n.width} ${n.height}" xmlns="http://www.w3.org/2000/svg"><${shape} ${dimensions} fill="${fillColor || "none"}" stroke="${strokeColor || "none"}" stroke-width="${n.strokeWeight || 0}"/></svg>`;
}
function smallCompound(n) {
  if (!vectors[n.id] || !n.children?.length) return false;
  const descendants = [];
  function walk(node) { descendants.push(node); for (const child of node.children || []) walk(child); }
  walk(n);
  return ["FRAME", "INSTANCE"].includes(n.type) &&
    descendants.filter((node) => node.visible !== false).every((node) => node === n || !(node.fills||[]).some((p)=>p.visible!==false) || ["VECTOR","ELLIPSE","RECTANGLE"].includes(node.type));
}
function collectCoords(n, axis) { return [...(n.children || []).flatMap((child) => collectCoords(child,axis)),n[axis] || 0]; }
function render(n, parent = null) {
  if (n.visible === false || n.opacity === 0) return "";
  // Complex overlapping instance content stays as source SVG rather than fake checkmark rectangles.
  if (
    [
      "I7070:146280;7070:146213;7070:146172",
      "I7070:146280;7070:146213",
    ].includes(n.id)
  ) {
    return `<div data-pixso-id="${n.id}" data-kind="${n.type}" style="${style(n, parent, false, true)}">${vectors[n.id] || ""}</div>`;
  }
  if (smallCompound(n)) {
    const exportedInset = Number(vectors[n.id].match(/<rect id="(?:Checkbox|Radio)"[^>]*\bx="([\d.-]+)"/)?.[1] || 0);
    const minX = -exportedInset;
    const minY = minX;
    const raw = vectors[n.id];
    if (minX === 0 && minY === 0)
      return `<div data-pixso-id="${n.id}" data-kind="${n.type}" style="${style(n,parent,false,true)};overflow:visible">${raw.replace("customFrame=","data-source-frame=")}</div>`;
    // The source widget frame precedes its actual painted bounds. Preserving the
    // measured negative x/y accounts for the exported ring without moving the label.
    return `<div data-pixso-id="${n.id}" data-kind="${n.type}" style="${style(n,parent,false,true)};overflow:visible">${raw.replace("<svg ", `<svg style="position:absolute;left:${minX}px;top:${minY}px;overflow:visible" `).replace("customFrame=","data-source-frame=")}</div>`;
  }


  if (["VECTOR", "BOOLEAN_OPERATION"].includes(n.type)) {
    return `<span data-pixso-id="${n.id}" data-kind="${n.type}" style="${style(n, parent, false, true)}">${vectors[n.id] || vectorPaint(n)}</span>`;
  }
  if (glyphMode && n.type === "TEXT" && sourceTextOutlines[n.id]?.svg) {
    return `<span data-pixso-id="${n.id}" data-kind="TEXT" role="img" aria-label="${esc(n.characters)}" style="${style(n, parent, false, true)};line-height:0;overflow:visible"><span aria-hidden="true" style="display:block;width:${n.width}px;height:${n.height}px">${sourceTextOutlines[n.id].svg}</span></span>`;
  }
  const insideSvg =
    (n.type !== "ELLIPSE" || n.cornerRadius) &&
    n.strokeAlign === "INSIDE" &&
    n.strokes?.some((p) => p.visible !== false) &&
    n.cornerRadius
      ? `<svg data-stroke-align="INSIDE" width="${n.width}" height="${n.height}" viewBox="0 0 ${n.width} ${n.height}" style="position:absolute;left:0;top:0;overflow:visible"><rect x="${n.strokeWeight / 2}" y="${n.strokeWeight / 2}" width="${n.width - n.strokeWeight}" height="${n.height - n.strokeWeight}" rx="${n.cornerRadius - n.strokeWeight / 2}" fill="${token(paints(n.fills))}" stroke="${token(rgba(n.strokes.find((p) => p.visible !== false).color))}" stroke-width="${n.strokeWeight}"/></svg>`
      : "";
  const svg =
    n.strokeAlign === "CENTER" && n.strokes?.some((p) => p.visible !== false)
      ? `<svg data-stroke-align="CENTER" width="${n.width + n.strokeWeight}" height="${n.height + n.strokeWeight}" viewBox="0 0 ${n.width + n.strokeWeight} ${n.height + n.strokeWeight}" style="position:absolute;left:${-n.strokeWeight / 2}px;top:${-n.strokeWeight / 2}px;overflow:visible"><rect x="${n.strokeWeight / 2}" y="${n.strokeWeight / 2}" width="${n.width}" height="${n.height}" rx="${n.type === "ELLIPSE" ? (n.width+1)/2 : n.cornerRadius || 0}" fill="${token(paints(n.fills))}" stroke="${token(rgba(n.strokes.find((p) => p.visible !== false).color))}" stroke-width="${n.strokeWeight}"/></svg>`
      : "";
  const paintSvg = svg || insideSvg;
  if (paintSvg)
    return `<${n.type === "TEXT" ? "span" : "div"} data-pixso-id="${n.id}" data-kind="${n.type}" style="${style(n, parent, n.type === "TEXT")}${insideSvg ? ";background:transparent;border:0" : ""}">${paintSvg}${n.characters ? esc(n.characters) : ""}${(n.children || []).map((c) => render(c, n)).join("")}</${n.type === "TEXT" ? "span" : "div"}>`;
  return `<${n.type === "TEXT" ? "span" : "div"} data-pixso-id="${n.id}" data-kind="${n.type}" style="${style(n, parent, n.type === "TEXT")}">${n.characters ? esc(n.characters) : ""}${(n.children || []).map((c) => render(c, n)).join("")}</${n.type === "TEXT" ? "span" : "div"}>`;
}
for (const rule of Object.values(rules)) {
  (function normalizePaint(n) {
    for (const key of ["fills", "strokes"])
      if (n[key] === "mixed") n[key] = [];
    for (const child of n.children || []) normalizePaint(child);
  })(rule);
}

const stateInventory = JSON.parse(fs.readFileSync("source/state-inventory.json","utf8"));
for (const family of Object.values(stateInventory)) {
  const set=catalog.componentSets.find(s=>s.id===family.id);
  if(set)family.variantPropMap=set.variantPropMap;
}
const refs = {
  tree:"5875:79108",toolbar:"1146:54209",table:"7278:46644","context-menu":"7040:84853",
  "tool-window":"217:51357","group-header":"605:47011",shortcut:"6551:84194","main-window":"7070:138481",
  "progress-bar":"7059:86469",loader:"5767:82631",notification:"3595:83697",tooltip:"55:9038",
  "tooltip-got-it":"56:8740","tooltip-editor":"71:11758",scrollbar:"6222:73548","code-sample":"3711:79011",
};
for (const family of Object.values(stateInventory)) for (const variant of family.variants) refs[variant.key]=variant.id;
const stateRefs = Object.fromEntries(Object.entries(stateInventory).flatMap(([familyName, family]) => family.variants.map((variant) => [variant.key,{...variant,family:stateInventory[familyName]?.name || familyName,familyId:family.id,sourceName:variant.name}])));
const alertMasters = ["3342:83343", "3346:80911"].map((id) => readAlertMaster(rules[id.replace(":", "-")], sourceStyles, master));
const tokens = fs.readFileSync("dist/tokens.css", "utf8"),
  fonts = `@font-face{font-family:Inter;src:url('../tokens/Inter-Variable.ttf') format('truetype');font-weight:100 900;font-optical-sizing:auto}`;
const manifest = {};
const variantSets = Object.fromEntries(
  catalog.componentSets.map((s) => [
    s.id,
    { name: s.name, axes: s.variantPropMap },
  ]),
);
refs.link = refs["link-light-default-default"];
stateRefs.link = stateRefs["link-light-default-default"];
refs["button-focused"] = refs["button-light-primary-focused"];
stateRefs["button-focused"] = stateRefs["button-light-primary-focused"];
for (const file of fs.readdirSync("components"))
  if (file.endsWith(".html") || ["rules.json", "emitted.json"].includes(file))
    fs.rmSync("components/" + file);
componentLoop: for (const [key, guid] of Object.entries(refs)) {
  const n = rules[guid.replace(":", "-")];
  if (!n) {
    console.warn("Missing extraction", key, guid);
    continue;
  }
  rootTheme = isDarkName(n.name) ? "Dark" : "Light";
  const semanticAlert = alertMasters.find((m, index) => (key === "alert" && index === 0) || (key === "alert-dark" && index === 1));
  const tag = "div";
  const type = key.startsWith("button") ? "button"
    : key.startsWith("input") ? "textbox" : key.startsWith("checkbox") ? "checkbox"
    : key.startsWith("toggle") ? "switch" : key.startsWith("radio-button") ? "radio"
    : /^(combobox|dropdown|search)(-|$)/.test(key) ? "combobox"
    : key.startsWith("dialog") ? "dialog" : null;
  const checked = key.startsWith("checkbox")
    ? key.includes("indeterminate") ? "mixed" : !key.includes("unchecked")
    : key.startsWith("toggle")
      ? key === "toggle-on" || key.endsWith("dark-on")
      : key.startsWith("radio-button") ? !(key === "radio-button-off" || key.includes("-off-"))
      : key.startsWith("button") ? false : null;
  const centerStroke = (node) => {
    const paint = node.strokes?.find((p) => p.visible !== false);
    if (!paint) return "";
    const color = rgba(paint.color.color),
      w = node.strokeWeight,
      r = node.cornerRadius || 0,
      half = w / 2,
      width = node.width + w,
      height = node.height + w;
    return `<svg data-stroke-align="CENTER" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="position:absolute;left:${-half}px;top:${-half}px;overflow:visible;pointer-events:none"><rect x="${half}" y="${half}" width="${node.width}" height="${node.height}" rx="${r}" fill="${token(paints(node.fills))}" stroke="${token(color)}" stroke-width="${w}"/></svg>`;
  };
  const attrs = type
    ? `role="${type}" aria-label="${key === "dialog" ? "Title" : prompts[key.split("-")[0]] || "Design specimen"}" tabindex="-1" ${checked === null ? "" : `aria-checked="${checked}"`}`
    : "";
  const html = semanticAlert ? "" : `<${tag} ${attrs} data-component="${key}" data-source-node="${guid}" class="relative" style="width:${n.width}px;height:${n.height}px;padding:0;appearance:none;border:0;background:transparent">${render(n)}</${tag}>`;
  const accessibleText = [];
  function collectText(node) {
    if (node.visible !== false && node.type === "TEXT")
      accessibleText.push(node.characters);
    for (const child of node.children || []) collectText(child);
  }
  collectText(n);
  const nativeVector = semanticAlert ? null : sourceVectorExports[guid];
  const nativeSceneSvg = nativeVector
    ?.replace("customFrame=", "data-source-frame=")
    .replace(
      'viewBox="0 0 ',
      `role="group" aria-label="${esc(accessibleText.join(", "))}" viewBox="0 0 `,
    );
  const vectorScene = vectorSceneRules.has(guid) && nativeScene;
  const sceneWidth = vectorScene ? Number(nativeVector?.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)?.[1]) : n.width;
  const sceneHeight = vectorScene ? Number(nativeVector?.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)?.[2]) : n.height;
  const semanticHtml = semanticAlert ? renderSemanticAlert({model:semanticAlert,key}) : "";
  const finalHtml = semanticAlert ? semanticHtml : vectorScene
    ? `<div ${attrs} data-component="${key}" data-source-node="${guid}" class="relative" style="width:${sceneWidth}px;height:${sceneHeight}px;padding:0;border:0;background:transparent">${nativeSceneSvg}</div>`
    : html;
  fs.writeFileSync(`components/${key}.html`, finalHtml);
  const selectedVariant = { ...(stateRefs[key]?.properties || {}) };
  manifest[key] = {
    ...(key === "link" || key === "button-focused" ? { aliasOf: key === "link" ? "link-light-default-default" : "button-light-primary-focused" } : {}),
    source: guid,
    renderMode: semanticAlert ? "generated-semantic-dom" : vectorSceneRules.has(guid) && nativeScene
        ? "source-svg-scene"
        : "generated-dom",
    sceneOrigin: vectorScene ? { x: 0, y: 0 } : null,
    sourceName: n.name,
    selectedVariant,
    width: vectorScene ? sceneWidth : n.width,
    height: vectorScene ? sceneHeight : n.height,
    variantSet: (() => {
      const family = stateRefs[key]?.family;
      const set = catalog.componentSets.find((s) => s.id===stateRefs[key]?.familyId || s.name===family || s.name===({tree:"Tree",toolbar:"Toolbar",table:"Table","context-menu":"Popup / Context Menu","tool-window":"Tool window","group-header":"Header",shortcut:"Shortcut","main-window":"Main Window","progress-bar":"Progress Bar",loader:"Loader",notification:"Notification",tooltip:"Tooltip / Tooltip","tooltip-got-it":"Tooltip / Got It","tooltip-editor":"Tooltip / Editor",scrollbar:"Scrollbar","code-sample":"Code Sample"}[key]));
      return set ? {name:set.name,axes:set.variantPropMap} : undefined;
    })(),
    generated: `components/${key}.html`,
  };
  const page = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>${key} · Int UI</title><link rel="stylesheet" href="../dist/tokens.css"><link rel="stylesheet" href="../dist/tailwind.css"><style>${fonts}html,body{margin:0;background:transparent}body{display:inline-block;padding:0;min-width:0}#specimen{display:inline-block;max-width:100%}${semanticAlert ? semanticAlertCss(master, alertMasters) : ""}</style></head><body><main id="specimen">${finalHtml}</main></body></html>`;
  fs.mkdirSync("previews", { recursive: true });
  fs.writeFileSync(`previews/${key}.html`, page);
}
fs.writeFileSync("tokens/manifest.json", JSON.stringify(manifest, null, 2));
fs.writeFileSync(
  "components/rules.json",
  JSON.stringify(
    Object.fromEntries(Object.values(rules).map((n) => [n.id, n])),
    null,
    2,
  ),
);
fs.writeFileSync("dist/component-preview.css", `${fonts}`);
// Overview is emitted at both index.html and public/index.html.
// Pixel tests load the isolated specimen preview itself as their asset host.
const semanticDocs = ["alert", "alert-dark"].flatMap((key) => [[`components/${key}.html`, readFile(`components/${key}.html`)], [`previews/${key}.html`, readFile(`previews/${key}.html`)]]);
function readFile(file) { return fs.readFileSync(file, "utf8"); }
generateDocs({ tokens: master, manifest, root: process.cwd(), semanticAlertCss, alertMasters });
semanticDocs.push(["public/pages/alert.html", readFile("public/pages/alert.html")]);
for (const [file, html] of semanticDocs) assertSemanticAlert(html, file);
console.log("PASS: Alert Light and Dark are semantic flex/grid DOM, with no absolute positioning or SVG chrome.");
// Tailwind is an additive utility layer; exact measurements stay tied to rule JSON.
fs.writeFileSync(
  "dist/tailwind.input.css",
  '@reference "tailwindcss";\n@reference "./tailwind.theme.css";\n@tailwind utilities;\n@source "../components/*.html";\n@source "../index.html";\n',
);
console.log(
  `Generated ${Object.keys(manifest).length} specimens from ${Object.keys(rules).length} extracted variants.`,
);
