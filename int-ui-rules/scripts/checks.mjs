import fs from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "playwright";
for (const script of [
  "extract-component.mjs",
  "generate.mjs",
  "generate-docs.mjs",
  "normalize-tokens.mjs",
  "diff.mjs",
]) {
  const source = fs.readFileSync("scripts/" + script, "utf8");
  assert.ok(source.length > 100, `Missing generator ${script}`);
}
const tokens = JSON.parse(fs.readFileSync("tokens/tokens.json", "utf8"));
const css = fs.readFileSync("dist/tokens.css", "utf8");
assert.equal(Object.keys(tokens.color).length, 603);
for (const [name, v] of Object.entries(tokens.color))
  assert.ok(css.includes(`${v.css}: ${v.value};`), `Unresolved token ${name}`);
const used = new Set(
  fs.readFileSync("dist/tokens.css", "utf8").match(/--[\w-]+(?=:)/g),
);
for (const file of fs
  .readdirSync("components")
  .filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync("components/" + file, "utf8");
  assert.ok(!/\bfill:#fff(?:fff)?;?\b/i.test(html));
  for (const token of html.matchAll(/var\((--[\w-]+)\)/g))
    assert.ok(used.has(token[1]), `${file}: unresolved ${token[1]}`);
}
const b = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const p = await b.newPage();
await p.goto("file://" + process.cwd() + "/previews/button-secondary.html");
const initial = await p
  .locator('[data-pixso-id="7260:46059"]')
  .evaluate((e) => ({
    fill: getComputedStyle(e.querySelector("svg rect")).fill,
  }));
await p.locator('[data-pixso-id="7260:46059"]').evaluate((e) => {
  const rect = e.querySelector("svg rect");
  const variable = rect.getAttribute("fill").match(/var\((--[\w-]+)\)/)?.[1];
  if (!variable) throw new Error("Rect must retain a rebindable paint token");
  e.closest("body").style.setProperty(variable, "#123456");
});
const changed = await p
  .locator('[data-pixso-id="7260:46059"]')
  .evaluate((e) => ({
    fill: getComputedStyle(e.querySelector("svg rect")).fill,
  }));
assert.notDeepEqual(
  initial,
  changed,
  "RGB/token paint layer must be rebindable",
);
await b.close();
console.log(
  "PASS: 603 tokens unique and emitted; partial CSS vars resolve; secondary button token paint rebinds.",
);

// Documentation architecture and source specimens are generated together.
const manifest = JSON.parse(fs.readFileSync("tokens/manifest.json", "utf8"));
const docs = ["public/index.html", ...fs.readdirSync("public/pages").filter((f) => f.endsWith(".html")).map((f) => `public/pages/${f}`)];
for (const file of docs) {
  const html = fs.readFileSync(file, "utf8");
  assert.ok(!html.includes("/workspace/ref-zip"), `${file}: depends on reference zip`);
  assert.ok(!/\bclass="(?:btn|check|combo|banner|alert|mini-)/.test(html), `${file}: contains reference illustrative controls`);
  assert.ok(!html.includes("<iframe"), `${file}: primary demos must be inline`);
  assert.ok(!/Additional state pending|Dark · pending/.test(html), `${file}: pending state cells remain`);
  for(const value of [...html.matchAll(/data-generated-partial="\/components\/([^"/]+)\.html"/g)]) assert.ok(fs.existsSync(`components/${value[1]}.html`), `${file}: absent embedded variant ${value[1]}`);
  assert.ok(!html.includes("Additional state pending"));
  const navStart = html.indexOf('<nav id="site-nav"');
  const navEnd = html.indexOf("</nav>", navStart);
  for (const href of html.slice(navStart, navEnd).matchAll(/href="([^"#]+)"/g)) {
    if (["/", "/site.css", "/site.js"].includes(href[1])) continue;
    assert.ok(fs.existsSync(href[1].startsWith('/pages/') ? `public${href[1]}` : href[1].slice(1)), `${file}: broken nav target ${href[1]}`);
  }
}
const stateInventory = JSON.parse(fs.readFileSync("source/state-inventory.json", "utf8"));
const variants = Object.values(stateInventory).flatMap((family) => family.variants);
const docInventory = JSON.parse(fs.readFileSync("tokens/inventory.json", "utf8")).stateComponents;
assert.deepEqual(docInventory, stateInventory, "Docs use a different variant inventory");
for (const variant of variants) {
  assert.ok(manifest[variant.key], `${variant.key}: missing manifest source node`);
  assert.equal(manifest[variant.key].source, variant.id, `${variant.key}: wrong source node`);
  assert.ok(fs.existsSync(`reference/${variant.key}.png`), `${variant.key}: missing native PNG`);
}
const familyPages = {
  Button:"button", "Slim Button":"button", Checkbox:"checkbox", "Input Field":"input-field",
  Toggle:"toggle", Combobox:"combo-box", Dropdown:"dropdown", Link:"link",
  "Radio Button":"radio-button", Search:"search", Tab:"tab", "Segmented Control":"segmented-control",
  Banner:"banner", Alert:"alert", Dialog:"dialog",
};
const componentPage = (name, item) => `public/pages/${familyPages[item.variantSet?.name] || "components"}.html`;

for (const [name, item] of Object.entries(manifest)) {
  assert.equal(item.renderMode, "generated-dom", `${name}: whole-scene SVG must be strictly opt-in`);
  const partial = fs.readFileSync(item.generated, "utf8");
  assert.ok(!/role="img" aria-label="[^"]*(text|Text)/.test(partial), `${name}: text must remain real HTML`);
  assert.ok(fs.readFileSync(`previews/${name}.html`, "utf8").includes(partial), `${name}: preview is not its generated partial`);
  const sourceDoc = componentPage(name, item);
  if (item.aliasOf) {
    const target=manifest[item.aliasOf];
    assert.ok(fs.readFileSync(sourceDoc,"utf8").includes(fs.readFileSync(target.generated,"utf8")), `${name}: alias target missing from ${sourceDoc}`);
    continue;
  }
  assert.ok(fs.existsSync(sourceDoc), `${name}: missing detail page ${sourceDoc}`);
  assert.ok(fs.readFileSync(sourceDoc, "utf8").includes(partial), `${name}: ${sourceDoc} does not embed its generated partial`);
}
for (const name of ["button-primary", "input", "checkbox", "toggle-on", "dialog"]) {
  const item=manifest[name];
  const file=componentPage(name,item),html=fs.readFileSync(file,"utf8");
  assert.ok(html.includes(`data-generated-partial="/components/${name}.html"`), `${file}: missing generated source link`);
}
const overview = fs.readFileSync("public/index.html", "utf8");
assert.equal([...overview.matchAll(/class="doc-component-card"/g)].length, 30, "Overview must contain the full 30 entry library");
for (const [name, value] of Object.entries(tokens.color).filter(([name]) => name.startsWith("Light/") && !name.includes("(Current)")))
  assert.ok(fs.readFileSync("public/pages/colors.html", "utf8").includes(`var(${value.css})`), `Missing source color ${name}`);
for (const style of Object.values(tokens.typography))
  assert.ok(fs.readFileSync("public/pages/typography.html", "utf8").includes(`font-size:${Math.min(style.fontSize, 40)}px`), `Missing source text style ${style.css}`);
console.log(`PASS: ${variants.length} Light/Dark state masters mapped and embedded; no pending matrix cells.`);
