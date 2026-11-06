import fs from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "playwright";
for (const script of [
  "extract-component.mjs",
  "generate.mjs",
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
