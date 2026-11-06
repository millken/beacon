/** Rules -> semantic HTML partials; no old conversion output is consumed.
 * Roots wrap measured primitive descendants. SVG is used only for exact source vectors. */
import fs from "node:fs";
import { generateDocs } from "./generate-docs.mjs";
const master = JSON.parse(fs.readFileSync("tokens/tokens.json", "utf8"));
const catalog = JSON.parse(fs.readFileSync("source/component-catalog.json"));
const knownIds = new Set(
  JSON.parse(
    fs.readFileSync("source/component-catalog.json"),
  ).componentSets.flatMap((s) => [...Object.values(s.variantPropMap).flat()]),
);
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
const tokenForColor = Object.fromEntries(
  Object.entries(master.color)
    .filter(
      ([name]) => name.startsWith("Light/") && !name.includes("(Current)"),
    )
    .map(([name, v]) => [String(v.value).toUpperCase(), v.css]),
);
const token = (color) =>
  tokenForColor[color] ? `var(${tokenForColor[color]})` : color;
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
const nativeScene = process.env.INT_UI_NATIVE_SCENE !== "0";
const vectorSceneRules = new Set([
  "7944:74792", "3894:82043", "3894:82033", "7944:74566", "7070:146044",
  "6517:82734", "7059:86469", "5767:82631",
  "7070:146270", "3590:81646",
  "3342:83343", "3346:81595", "46:11087", "7281:46903",
  "3595:83697", "55:9038", "56:8740", "71:11758", "5664:79159",
  "6222:73548", "3711:79011", "5875:79108", "1146:54209", "7278:46644",
  "7040:84853", "217:51357", "605:47011", "6551:84194", "7070:138481",
]);
const glyphMode = process.env.INT_UI_VECTOR_TEXT !== "0";
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
    f = n.fontName || textStyle.fontName || {};
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
  if (isText || (!isVector && fill))
    s.push(`${isText ? "color" : "background-color"}:${token(p)}`);
  const stroke = n.strokes?.find((v) => v.visible !== false);
  if (stroke) {
    const color = rgba(stroke.color?.color ?? stroke.color ?? null);
    const match = Object.entries(master.color).find(
      ([name, v]) =>
        v.value === color &&
        name.startsWith("Light/") &&
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
      `font-size:${n.fontSize ?? textStyle.fontSize}px`,
      `font-weight:${weight(f.style)}`,
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
function render(n, parent = null) {
  if (n.visible === false || n.opacity === 0) return "";
  // Complex overlapping instance content stays as source SVG rather than fake checkmark rectangles.
  if (
    [
      "I7944:76537;7936:67415",
      "I7070:146280;7070:146213;7070:146172",
      "I7070:146280;7070:146213",
    ].includes(n.id)
  ) {
    return `<div data-pixso-id="${n.id}" data-kind="${n.type}" style="${style(n, parent, false, true)}">${vectors[n.id] || ""}</div>`;
  }
  if (["VECTOR", "BOOLEAN_OPERATION"].includes(n.type)) {
    return `<span data-pixso-id="${n.id}" data-kind="${n.type}" style="${style(n, parent, false, true)}">${vectors[n.id] || ""}</span>`;
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
      ? `<svg data-stroke-align="CENTER" width="${n.width + n.strokeWeight}" height="${n.height + n.strokeWeight}" viewBox="0 0 ${n.width + n.strokeWeight} ${n.height + n.strokeWeight}" style="position:absolute;left:${-n.strokeWeight / 2}px;top:${-n.strokeWeight / 2}px;overflow:visible"><rect x="${n.strokeWeight / 2}" y="${n.strokeWeight / 2}" width="${n.width}" height="${n.height}" rx="${n.cornerRadius || 0}" fill="${token(paints(n.fills))}" stroke="${token(rgba(n.strokes.find((p) => p.visible !== false).color))}" stroke-width="${n.strokeWeight}"/></svg>`
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
const refs = {
  tree:"5875:79108", toolbar:"1146:54209", table:"7278:46644", "context-menu":"7040:84853",
  "tool-window":"217:51357", "group-header":"605:47011", shortcut:"6551:84194", "main-window":"7070:138481",

  "alert": "3342:83343",
  "banner": "3346:81595",
  "combobox": "7944:74792",
  "link": "46:11087",
  "radio-button": "3894:82043",
  "radio-button-off": "3894:82033",
  "dropdown": "7944:74566",
  "search": "7070:146044",
  "slim-button": "6517:82734",
  "segmented-control": "7281:46903",
  "progress-bar": "7059:86469",
  "loader": "5767:82631",
  "notification": "3595:83697",
  "tooltip": "55:9038",
  "tooltip-got-it": "56:8740",
  "tooltip-editor": "71:11758",
  "tab": "5664:79159",
  "scrollbar": "6222:73548",
  "code-sample": "3711:79011",
  "button-secondary": "146:52058",
  "button-primary": "146:52068",
  "button-primary-hovered": "146:52071",
  "button-primary-pressed": "733:47034",
  "button-primary-focused": "146:52092",
  input: "7399:46819",
  "input-focused": "7399:46991",
  checkbox: "3590:81640",
  "checkbox-unchecked": "3590:81636",
  "checkbox-indeterminate": "3590:81646",
  "toggle-on": "5168:84067",
  "toggle-off": "5168:84071",
  dialog: "7070:146270",
};
const tokens = fs.readFileSync("dist/tokens.css", "utf8"),
  fonts = `@font-face{font-family:Inter;src:url('../tokens/Inter-Variable.ttf') format('truetype');font-weight:100 900;font-optical-sizing:auto}`;
const manifest = {};
const variantSets = Object.fromEntries(
  catalog.componentSets.map((s) => [
    s.id,
    { name: s.name, axes: s.variantPropMap },
  ]),
);
for (const file of fs.readdirSync("components"))
  if (file.endsWith(".html") || ["rules.json", "emitted.json"].includes(file))
    fs.rmSync("components/" + file);
componentLoop: for (const [key, guid] of Object.entries(refs)) {
  const n = rules[guid.replace(":", "-")];
  if (!n) {
    console.warn("Missing extraction", key, guid);
    continue;
  }
  const tag = "div";
  const type = key.startsWith("button")
    ? "button"
    : key.startsWith("input")
      ? "textbox"
      : key.startsWith("checkbox")
        ? "checkbox"
        : key.startsWith("toggle")
          ? "switch"
          : key === "dialog"
            ? "dialog"
            : null;
  const checked = key.startsWith("checkbox")
    ? !key.includes("unchecked")
    : key.startsWith("toggle")
      ? key.endsWith("-on")
      : null;
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
  const html = `<${tag} ${attrs} data-component="${key}" data-source-node="${guid}" class="relative" style="width:${n.width}px;height:${n.height}px;padding:0;appearance:none;border:0;background:transparent">${render(n)}</${tag}>`;
  const accessibleText = [];
  function collectText(node) {
    if (node.visible !== false && node.type === "TEXT")
      accessibleText.push(node.characters);
    for (const child of node.children || []) collectText(child);
  }
  collectText(n);
  const nativeVector = sourceVectorExports[guid]
    .replace("customFrame=", "data-source-frame=")
    .replace(
      'viewBox="0 0 ',
      `role="group" aria-label="${esc(accessibleText.join(", "))}" viewBox="0 0 `,
    );
  const vectorScene = vectorSceneRules.has(guid) && nativeScene;
  const sceneWidth = vectorScene ? Number(sourceVectorExports[guid].match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)?.[1]) : n.width;
  const sceneHeight = vectorScene ? Number(sourceVectorExports[guid].match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)?.[2]) : n.height;
  const finalHtml = vectorScene
    ? `<div ${attrs} data-component="${key}" data-source-node="${guid}" class="relative" style="width:${sceneWidth}px;height:${sceneHeight}px;padding:0;border:0;background:transparent">${nativeVector}</div>`
    : html;
  fs.writeFileSync(`components/${key}.html`, finalHtml);
  const selectedVariant = {};
  for (const part of n.name.split(",")) {
    const match = part.trim().match(/^(.+?)\s*=\s*(.+)$/);
    if (match) selectedVariant[match[1].replace(/^Theme$/, "Theme")] = match[2];
  }
  manifest[key] = {
    source: guid,
    renderMode:
      vectorSceneRules.has(guid) && nativeScene
        ? "source-svg-scene"
        : "generated-dom",
    sceneOrigin: vectorScene ? { x: 0, y: 0 } : null,
    sourceName: n.name,
    selectedVariant,
    width: vectorScene ? sceneWidth : n.width,
    height: vectorScene ? sceneHeight : n.height,
    variantSet: (() => {
      const set = catalog.componentSets.find((s) => s.id === n.parentId || s.id === guid || s.name === {
        button: "Button", "slim-button": "Slim Button", input: "Input Field",
        combobox:"Combobox", checkbox: "Checkbox", toggle: "Toggle", dialog: "Dialog",
        alert:"Alert", banner:"Banner", link:"Link", "radio-button":"Radio Button",
        "radio-button-off":"Radio Button", dropdown:"Dropdown", search:"Search",
        "segmented-control":"Segmented Control", "progress-bar":"Progress Bar", loader:"Loader",
        notification:"Notification", tooltip:"Tooltip / Tooltip", "tooltip-got-it":"Tooltip / Got It",
        "tooltip-editor":"Tooltip / Editor", tab:"Tab", scrollbar:"Scrollbar", tree:"Tree",
        toolbar:"Toolbar", table:"Table", "context-menu":"Popup / Context Menu",
        "tool-window":"Tool window", "group-header":"Header", shortcut:"Shortcut",
        "code-sample":"Code Sample", "main-window":"Main Window",
      }[key]);
      return set ? variantSets[set.id] : undefined;
    })(),
    generated: `components/${key}.html`,
  };
  const page = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>${key} · Int UI</title><link rel="stylesheet" href="../dist/tokens.css"><link rel="stylesheet" href="../dist/tailwind.css"><style>${fonts}html,body{margin:0;background:transparent}body{display:inline-block;padding:0;min-width:0}#specimen{position:relative;display:inline-block}</style></head><body><main id="specimen">${finalHtml}</main></body></html>`;
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
generateDocs({ tokens: master, manifest, root: process.cwd() });
// Tailwind is an additive utility layer; exact measurements stay tied to rule JSON.
fs.writeFileSync(
  "dist/tailwind.input.css",
  '@reference "tailwindcss";\n@reference "./tailwind.theme.css";\n@tailwind utilities;\n@source "../components/*.html";\n@source "../index.html";\n',
);
console.log(
  `Generated ${Object.keys(manifest).length} specimens from ${Object.keys(rules).length} extracted variants.`,
);
