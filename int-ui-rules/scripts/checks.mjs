import fs from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { assertSemanticAlert } from "./semantic-alert.mjs";
import { listenDocs } from "./serve-docs.mjs";
import { fileURLToPath } from "node:url";
if(process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.chdir(fileURLToPath(new URL("..",import.meta.url)));
for (const script of [
  "extract-component.mjs",
  "generate.mjs",
  "generate-docs.mjs",
  "normalize-tokens.mjs",
  "diff.mjs",
  "semantic-alert.mjs",
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
    if(/^--alert-/.test(token[1])) {
      if(!["alert.html","alert-dark.html"].includes(file))throw new Error(`${file}: semantic theme variables are scoped to Alert only`);
      const css=fs.readFileSync("public/site.css","utf8");
      assert.ok(new RegExp(`\\${token[1]}\\s*:`).test(css), `${file}: Alert scoped token is not supplied by its semantic theme`);
    } else assert.ok(used.has(token[1]), `${file}: unresolved ${token[1]}`);
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
  assert.ok(!html.includes('class="alert"'), `${file}: contains legacy Alert shell rather than .window`);
  if (/class="(?:btn|check|combo|banner|mini-)/.test(html)) assert.ok(html.includes('class="window '), `${file}: legacy illustrative controls outside semantic window`);
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
  const partial = fs.readFileSync(item.generated, "utf8");
  if (["alert","alert-dark"].includes(name)) {
    assertSemanticAlert(partial, item.generated);
    assert.ok(!/<svg(?![^>]*(?:data-layer="small-icon"|data-source-vector-export="true"))/i.test(partial), `${name}: no SVG dialog chrome; only small source glyph viewports`);
    assert.ok(!/(?:left|top)\s*:/i.test(partial), `${name}: no coordinate layout`);
    assert.ok(partial.includes("<h3") && partial.includes("<p") && partial.includes('type="checkbox"') && partial.includes("<button"), `${name}: semantic layer required`);
  }
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

// Browser-level policy: the containing preview chrome is allowed to be static,
// and every semantic Alert descendant must remain ordinary flex/grid flow.
for (const name of ["alert", "alert-dark"]) {
  const browser = await chromium.launch({ executablePath:"/usr/bin/google-chrome", headless:true, args:["--no-sandbox"] });
  const page = await browser.newPage({ viewport:{width:500,height:260} });
  await page.goto("file://" + process.cwd() + `/previews/${name}.html`);
  const layout = await page.locator(".window").evaluate(root => ({
    width:root.offsetWidth, height:root.offsetHeight, dialog:root.getAttribute("role"),
    layers:Boolean(root.querySelector(".window-body .alert-title .status-dot") && root.querySelector(".window-body h3") && root.querySelector(".window-body p") && root.querySelector(".checkline input[type=checkbox]") && root.querySelector(".window-actions button.btn.primary")),
    status:[...root.querySelectorAll(".status-dot")].every(slot=>slot.children.length===1&&slot.firstElementChild?.matches('svg[data-layer="small-icon"]')&&slot.textContent.trim()===""&&getComputedStyle(slot).backgroundColor==="rgba(0, 0, 0, 0)"&&getComputedStyle(slot).backgroundImage==="none"&&getComputedStyle(slot,"::before").content==="none"&&getComputedStyle(slot,"::after").content==="none"&&getComputedStyle(slot).color===getComputedStyle(root).color),
    svg:[...root.querySelectorAll("svg")].some(icon=>!(icon.closest(".status-dot")||icon.closest(".window-help"))||(!icon.hasAttribute("aria-hidden")&&!icon.closest("svg[aria-hidden]"))),
    flow:[root,...root.querySelectorAll("*")].every(el=>getComputedStyle(el).position === "static"),
  }));
  assert.equal(layout.width,420,`${name}: measured root width`);
  assert.equal(layout.height,172,`${name}: measured root height`);
  assert.equal(layout.dialog,"alertdialog");
  assert.ok(layout.layers && layout.status && layout.flow && !layout.svg,`${name}: semantic flow-only browser verification with SVG-only status icons`);
  await browser.close();
}
console.log("PASS: Alert masters browser-verified at 420×172; semantic layers and every descendant use static flow-only layout.");
const questionStatusIds = new Set(["alert", "alert-dark"].map(name => fs.readFileSync(`components/${name}.html`, "utf8").match(/class="status-dot info"[^>]*data-pixso-id="([^"]+)"/)?.[1]));
assert.equal(questionStatusIds.size, 2, "Both verified Alert Light/Dark status masters must be present");
const nativeStatusIcons = new Map([
  ["11163:20353", "light-error"], ["11163:69187", "light-warning"],
  ["11163:69573", "dark-error"], ["11163:69651", "dark-warning"],
]);
for(const [id, name] of nativeStatusIcons)
  assert.ok(fs.existsSync(`source/icons/alert-${name}.svg`), `${id}: missing native SVG export`);
await (async()=>{
  const browser=await chromium.launch({executablePath:"/usr/bin/google-chrome",headless:true,args:["--no-sandbox"]});
  const server = await listenDocs();
  const docsBaseUrl = `http://127.0.0.1:${server.address().port}`;
  try {
  for(const width of [1440,390]){
    const page=await browser.newPage({viewport:{width,height:900}});
    await page.goto(`${docsBaseUrl}/pages/alert.html`);
    const result=await page.evaluate((sourceChecks)=>{
      const validStatusSlot=(slot)=>slot.children.length===1&&slot.firstElementChild?.matches('svg[data-layer="small-icon"]')&&slot.textContent.trim()===""&&getComputedStyle(slot).backgroundColor==="rgba(0, 0, 0, 0)"&&getComputedStyle(slot).backgroundImage==="none"&&getComputedStyle(slot,"::before").content==="none"&&getComputedStyle(slot,"::after").content==="none";
      return {
        horizontalOverflow:document.documentElement.scrollWidth>innerWidth,
        badInfoSources:[...document.querySelectorAll('main [data-alert-demo] .status-dot.info')].filter(slot=>!sourceChecks.questionStatusIds.includes(slot.dataset.pixsoId)||!slot.querySelector('svg[data-source-vector-export="true"]')).map(slot=>slot.dataset.pixsoId),
        badStatusSources:[...document.querySelectorAll('main [data-alert-demo] .status-dot.error, main [data-alert-demo] .status-dot.warning')].filter(slot=>slot.dataset.pixsoId!==sourceChecks.nativeStatusIcons[slot.dataset.pixsoId]||!slot.querySelector(':scope > svg[data-layer="small-icon"] > svg[data-source-vector-export="true"][width="16"][height="16"][viewBox="0 0 16 16"]')).map(slot=>slot.dataset.pixsoId),
        alerts:[...document.querySelectorAll('main .window')].map(root=>({
          flow:[root,...root.querySelectorAll('*')].every(el=>getComputedStyle(el).position==='static'),
          overflow:root.scrollWidth>root.clientWidth,
          svg:[...root.querySelectorAll('svg')].some(icon=>!(icon.closest('.status-dot')||icon.closest('.window-help'))||(!icon.hasAttribute('aria-hidden')&&!icon.closest('svg[aria-hidden]'))),
          status:[...root.querySelectorAll('.status-dot')].every(validStatusSlot),
        })).filter(result=>!result.flow||result.overflow||result.svg||!result.status),
      };
    }, {
      questionStatusIds:[...questionStatusIds],
      nativeStatusIcons:Object.fromEntries([...nativeStatusIcons].map(([id])=>[id,id])),
    });
    assert.equal(result.horizontalOverflow,false,`Alert docs ${width}px viewport must not overflow`);
    assert.deepEqual(result.badInfoSources,[],`Alert info demos reuse verified questionDialog masters at ${width}px`);
    assert.deepEqual(result.badStatusSources,[],`Alert warning/error demos use native Pixso SVG viewports at ${width}px`);
    assert.deepEqual(result.alerts,[],`All Alert docs descendants use flow at ${width}px`);
    await page.close();
  }
  } finally { await new Promise(resolve => server.close(resolve)); await browser.close(); }
})();
console.log("PASS: Alert docs are responsive; status demos reuse verified masters/native SVG viewports; no CSS/HTML glyph layers or SVG shells.");
