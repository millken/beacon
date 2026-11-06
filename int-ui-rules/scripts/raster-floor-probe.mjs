/**
 * Compares the already-generated DOM against unchanged original SVG geometry.
 * It never changes styles, glyph positions, source data, or comparison rules.
 * Run `npm run verify` before this probe to render the generated DOM baseline.
 */
import fs from "node:fs";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const states = [
  ["button-secondary", "button-secondary-active"],
  ["input", "input-active"],
  ["input-focused", "input-focused"],
];
const sources = JSON.parse(fs.readFileSync("source/svg.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync("tokens/manifest.json", "utf8"));
const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--force-device-scale-factor=1"],
});
const results = [];
for (const [key, referenceName] of states) {
  const reference = PNG.sync.read(
    fs.readFileSync(`reference/${referenceName}.png`),
  );
  const options = {
    threshold: 0.1,
    includeAA: true,
  };
  const baselineActual = PNG.sync.read(
    fs.readFileSync(`diff/${key}-actual.png`),
  );
  const baseline = pixelmatch(
    reference.data,
    baselineActual.data,
    null,
    reference.width,
    reference.height,
    options,
  );
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: { width: 1920, height: 1080 },
  });
  await page.goto("file://" + process.cwd() + "/index.html");
  await page.evaluate(() => {
    document.body.style.cssText = "margin:0;padding:0;background:transparent";
  });
  async function renderAndCompare(html, stageOrigin = 0) {
    await page.evaluate(
      ({ html, stageOrigin, width, height }) => {
        const stage = document.createElement("div");
        stage.id = "probe-stage";
        stage.style.cssText = `position:relative;display:inline-block;width:${width}px;height:${height}px;left:${stageOrigin}px;top:0`;
        stage.innerHTML = html;
        document.body.replaceChildren(stage);
      },
      { html, width: reference.width, height: reference.height },
    );
    const actual = PNG.sync.read(
      await page.screenshot({
        clip: { x: 0, y: 0, width: reference.width, height: reference.height },
        omitBackground: true,
      }),
    );
    return pixelmatch(
      reference.data,
      actual.data,
      null,
      reference.width,
      reference.height,
      options,
    );
  }
  // Native SVG has its own reference canvas; no offset is added. In particular,
  // focused Input's source viewBox includes its 1px perimeter on all sides.
  // The normal verifier places the sliced 224px DOM at that source 1px inset.
  const nativeSourceSvg = await renderAndCompare(sources[manifest[key].source]);
  // Take the source's absolute glyph without modifying its d/fill and surround
  // it with the unchanged generated background/perimeter. This separates glyph
  // rasterization from the source root's rounded-rect compositing.
  const glyph = sources[manifest[key].source].match(
    /<path id="Text"[\s\S]*?\/>/,
  )[0];
  await page.evaluate(
    ({ html, svg, glyph }) => {
      const stage = document.createElement("div");
      stage.id = "absolute-glyph-stage";
      stage.style.cssText = "position:relative;display:inline-block";
      stage.innerHTML = html;
      const el = stage.querySelector('[data-kind="TEXT"]');
      const [, , nativeWidth, nativeHeight] = svg
        .match(/viewBox="([^"]+)"/)[1]
        .split(" ")
        .map(Number);
      const width = nativeWidth;
      const height = nativeHeight;
      let x = -parseFloat(el.style.left),
        y = -parseFloat(el.style.top),
        q = el.parentElement;
      while (q && q !== stage) {
        x -= parseFloat(q.style.left) || 0;
        y -= parseFloat(q.style.top) || 0;
        q = q.parentElement;
      }
      const pathSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      pathSvg.setAttribute("viewBox", svg.match(/viewBox="([^"]+)"/)[1]);
      pathSvg.setAttribute("width", width);
      pathSvg.setAttribute("height", height);
      pathSvg.setAttribute("aria-hidden", "true");
      pathSvg.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${width}px;height:${height}px;overflow:visible;pointer-events:none`;
      pathSvg.innerHTML = glyph;
      el.querySelector("svg").replaceWith(pathSvg);
      document.body.replaceChildren(stage);
    },
    {
      html: fs.readFileSync(`components/${key}.html`, "utf8"),
      svg: sources[manifest[key].source],
      glyph,
    },
  );
  const absoluteHtml = await page.locator("#absolute-glyph-stage").innerHTML();
  const sourceAbsoluteGlyph =
    key === "input-focused"
      ? null // Avoid a different root-context/ring composite being misreported as a glyph-only test.
      : await renderAndCompare(absoluteHtml);
  await page.close();
  const record = {
    state: key,
    source: manifest[key].source,
    totalPixels: reference.width * reference.height,
    generatedDomPixels: baseline,
    sourceAbsoluteGlyphPixels: sourceAbsoluteGlyph,
    untouchedSourceSvgPixels: nativeSourceSvg,
    minimumPixels: Math.min(
      ...[baseline, sourceAbsoluteGlyph, nativeSourceSvg].filter(
        (value) => value !== null,
      ),
    ),
  };
  record.note =
    key === "input-focused"
      ? "The focused ring's different root clip/compositing context means its independent root SVG is the honest comparison; a separate hybrid result is intentionally not published."
      : null;
  record.minimumPercent = +(
    (record.minimumPixels / record.totalPixels) *
    100
  ).toFixed(3);
  results.push(record);
  console.log(key, JSON.stringify(record));
}
await browser.close();
fs.writeFileSync(
  "diff/raster-floor-probe.json",
  JSON.stringify(
    {
      renderer: "Chromium / Playwright",
      deviceScaleFactor: 1,
      pixelThreshold: 0.1,
      includeAA: true,
      results,
    },
    null,
    2,
  ),
);
