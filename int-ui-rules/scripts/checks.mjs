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

// Documentation structure is generated too; no hand-maintained docs or illustrative controls.
assert.ok(fs.existsSync("public/index.html"), "Missing generated Overview");
assert.deepEqual(fs.readdirSync("public/pages").filter((f) => f.endsWith(".html")).sort(), [
  "alert.html", "banner.html", "button.html", "checkbox.html", "colors.html",
  "combo-box.html", "components.html", "dialog.html", "input.html", "spacing.html",
  "toggle.html", "typography.html",
]);
const manifest = JSON.parse(fs.readFileSync("tokens/manifest.json", "utf8"));
const docs = ["public/index.html", ...fs.readdirSync("public/pages").filter((f) => f.endsWith(".html")).map((f) => `public/pages/${f}`)];
for (const file of docs) {
  const html = fs.readFileSync(file, "utf8");
  assert.ok(!html.includes("/workspace/ref-zip"), `${file}: depends on reference zip`);
  assert.ok(!/\bclass="(?:btn|check|combo|banner|alert|mini-)/.test(html), `${file}: contains reference illustrative controls`);
  const navEnd = html.indexOf("</nav>");
  for (const href of html.slice(0, navEnd).matchAll(/href="([^"#]+)"/g)) {
    if (href[1] === "/") continue;
    assert.ok(fs.existsSync(href[1].startsWith('/pages/') ? `public${href[1]}` : href[1].slice(1)), `${file}: broken nav target ${href[1]}`);
  }
}
for (const [name, item] of Object.entries(manifest)) {
  const preview = fs.readFileSync(`previews/${name}.html`, "utf8");
  assert.ok(preview.includes(fs.readFileSync(item.generated, "utf8")), `${name}: preview is not its generated partial`);
}
for (const [file, name] of [["public/pages/button.html", "button-primary"], ["public/pages/input.html", "input"], ["public/pages/checkbox.html", "checkbox"], ["public/pages/toggle.html", "toggle-on"], ["public/pages/dialog.html", "dialog"]]) {
  const html = fs.readFileSync(file, "utf8");
  assert.ok(html.includes(`src="/previews/${name}.html"`), `${file}: missing verified specimen`);
  assert.ok(html.includes(`data-generated-partial="/components/${name}.html"`), `${file}: missing generated source link`);
}
for (const file of ["public/pages/alert.html", "public/pages/banner.html", "public/pages/combo-box.html"])
  assert.ok(fs.readFileSync(file, "utf8").includes('Not yet extracted'), `${file}: missing explicit stub`);
for (const [name, value] of Object.entries(tokens.color).filter(([name]) => name.startsWith("Light/") && !name.includes("(Current)")))
  assert.ok(fs.readFileSync("public/pages/colors.html", "utf8").includes(`var(${value.css})`), `Missing source color ${name}`);
for (const style of Object.values(tokens.typography))
  assert.ok(fs.readFileSync("public/pages/typography.html", "utf8").includes(`font-size:${style.fontSize}px`), `Missing source text style ${style.css}`);
