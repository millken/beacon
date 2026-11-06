/** Convert shared Pixso styles to a stable, documented CSS/Tailwind token set. */
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const styles = JSON.parse(
  fs.readFileSync("source/styles.raw.json", "utf8"),
).styles;
const catalog = JSON.parse(fs.readFileSync("source/component-catalog.json"));
const cssName = (s) =>
  s
    .toLowerCase()
    .replace(/\s*\(current\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const color = {},
  typography = {},
  effect = {};
for (const [key, val] of Object.entries(styles)) {
  const name = key.replace(/^\$style\//, "");
  if (val.type === "color" && typeof val.fillPaints === "string")
    color[name] = {
      css: "--" + cssName(name),
      value: val.fillPaints,
      description: val.desc || undefined,
    };
  if (val.type === "text")
    typography[name] = { css: "--" + cssName(name), ...val };
  if (val.type === "effect")
    effect[name] = { css: "--" + cssName(name), ...val };
}
const geometryRoots = fs
  .readdirSync("source/components")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync("source/components/" + f, "utf8")));
const geometryValues = {};
function collect(n) {
  for (const key of [
    "width",
    "height",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "itemSpacing",
    "cornerRadius",
    "strokeWeight",
  ])
    if (typeof n[key] === "number") {
      const bucket =
        key === "itemSpacing"
          ? "gap"
          : key === "strokeWeight"
            ? "stroke"
            : key.startsWith("padding")
              ? "padding"
              : key;
      (geometryValues[bucket] ??= new Set()).add(n[key]);
    }
  for (const c of n.children || []) collect(c);
}
for (const n of geometryRoots) collect(n);
const geometry = {
  width: Math.min(...(geometryValues.width || [0])),
  height: Math.min(...(geometryValues.height || [0])),
  gap: [...(geometryValues.gap || [])].sort((a, b) => a - b),
  padding: [...(geometryValues.padding || [])].sort((a, b) => a - b),
  radii: [...(geometryValues.cornerRadius || [])].sort((a, b) => a - b),
  strokeWeight: [...(geometryValues.stroke || [])].sort((a, b) => a - b),
  note: "These are observed component-tree values. They do not imply a universal spacing scale or a redesign.",
};
const exportJson = {
  sourceFile: "iPHNpHZoWc6Grn6DanoQDg",
  page: "6222:73687",
  sourceStyleCount: Object.keys(styles).length,
  color,
  typography,
  effect,
  generatedAt: new Date().toISOString(),
};
fs.writeFileSync("tokens/tokens.json", JSON.stringify(exportJson, null, 2));
let css = ":root{\n";
for (const x of Object.values(color)) css += `  ${x.css}: ${x.value};\n`;
for (const x of Object.values(effect))
  css += `  ${x.css}: ${x.effects?.map((e) => `${e.offset?.x || 0}px ${e.offset?.y || 0}px ${e.radius || 0}px ${e.spread || 0}px ${e.color}`).join(", ")};\n`;
for (const [name, x] of Object.entries(typography)) {
  css += `  ${x.css}-font-family: '${x.fontFamily}';\n  ${x.css}-font-size: ${x.fontSize}px;\n  ${x.css}-font-weight: ${x.fontWeight};\n  ${x.css}-line-height: ${parseFloat(x.lineHeight)}px;\n`;
}
css += "}\n";
fs.writeFileSync("dist/tokens.css", css);
fs.writeFileSync(
  "dist/tailwind.theme.css",
  `@theme {\n${Object.values(color)
    .map((x) => `  --color-${x.css.slice(2)}: var(${x.css});`)
    .join("\n")}\n}\n`,
);
fs.writeFileSync(
  "tokens/inventory.json",
  JSON.stringify(
    {
      file: exportJson.sourceFile,
      page: exportJson.page,
      components: catalog.components.length,
      componentSets: catalog.componentSets.length,
      variables: 0,
      extractedVariants: geometryRoots.length,
      geometry,
      styles: Object.keys(styles).length,
      textStyles: Object.keys(typography).length,
      colorStyles: Object.keys(color).length,
      effectStyles: Object.keys(effect).length,
      note: "Pixso has an empty Int UI Kit variable set. Tokens derive from the actual shared styles and resolved component paints, not invented token values.",
    },
    null,
    2,
  ),
);
console.log(
  `Tokens: ${Object.keys(color).length} color, ${Object.keys(typography).length} text, ${Object.keys(effect).length} effect.`,
);
