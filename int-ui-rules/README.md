# Int UI · rules-driven Tailwind HTML

`/workspace/int-ui-rules` is a **new** implementation, not a repair of `/workspace/int-ui-tailwind`. It consumes none of the rejected HTML. Target: Pixso `iPHNpHZoWc6Grn6DanoQDg`, _Getting started_ (`6222:73687`).

**Status: a reproducible extraction/generation/diff baseline for 13 Light variants, not a completed 1:1 conversion.** The source shadow's asymmetric native padding is included in the diff; Dialog is 0.010%, but nonzero. Current verified metrics are in [diff/report.md](diff/report.md); all 13 variants have a native-size comparison, including focused and shadow overflow. Visual differences are not filtered as antialias to inflate the score.

## Design-rule inventory

Pixso reports **no local variables** (`variables: {}`). The authoritative token input is thus the file's **668 shared styles**, plus measured component geometry—not invented spacing tokens. [tokens/inventory.json](tokens/inventory.json) records these counts and the geometry inventory.

- **603** color styles → `tokens/tokens.json`, `dist/tokens.css`, `dist/tailwind.theme.css`
- **36** text styles → font family/size/weight/line-height/letter-spacing tokens
- **20** effect styles → CSS box-shadow variables
- **11** components and **131** component sets → `source/component-catalog.json`
- **13 extracted variants**, with properties, dimensions and variant axes → `source/components/*.json`, `components/rules.json`, `tokens/manifest.json`
- Source style IDs (paint/text/effect) are preserved in each design node. Stable CSS names include a hash of the source style name, because same-color duplicates are _not_ always the same semantic token. Strokes resolve the actual node color; matching Light Gray/Grey values are linked to generated tokens. Exact style identity remains on each node for future complete ID→style mapping.
- Observed geometry: outer Button/Input row allocation `6px; content 28px`; checkbox padding `8px; 16px icon; 8px gap; 16px text`; toggle `53x20px`; Button min content width `48px, 12px horizontal, 6px vertical`; radii depend on source (`4px` controls, `3px` checkbox/toggle, `8px` Dialog); font `Inter 13px/16px 500` (Dialog title 600). These are extracted values, not a new generic design system.
- Exact original SVG path geometry is retained for complex checkbox/help glyphs and available _pure_ icons. Component containers and text geometry are generated with source node IDs and accessible labels. **No entire component is replaced by an exported PNG.**

## Commands

```bash
cd /workspace/int-ui-rules
npm install
npm run verify
# source glyph geometry is the default; INT_UI_VECTOR_TEXT=0 opts into native browser text
# native source-vector scenes for Dialog + indeterminate: default; INT_UI_NATIVE_SCENE=0 compares reconstructed DOM
# index.html is the gallery; previews/<component>.html is an isolated specimen
```

| Entry point            | Purpose                                                                   |
| ---------------------- | ------------------------------------------------------------------------- |
| `npm run tokens`       | Normalize source shared styles to JSON, CSS variables and Tailwind theme  |
| `npm run generate`     | Generate semantic partials, full selected-variant rules and preview pages |
| `npm run diff`         | Render each partial in isolated Chromium and compare against Pixso PNG    |
| `npm run check`        | Verify all CSS token names resolve and token paint is actually rebindable |
| `npm run build`        | Tokens → generated HTML → Tailwind utilities/theme                        |
| `npm run extract:help` | Print the read-only Pixso Plugin API extraction script used by this run   |

`extract-component.mjs` is an evaluator script, not a standalone Node importer. Pass its output to `user-Pixso.eval_script(file_key="iPHNpHZoWc6Grn6DanoQDg", script=...)` (read-only; no design mutations), save each root to `source/components/<id-with-dash>.json`, and run `npm run generate` again. For native vector extraction, `scripts/export-svg.mjs` defines async `exportSourceSvg()`; append its invocation and pass that complete script to `user-Pixso.eval_script(file_key="iPHNpHZoWc6Grn6DanoQDg", script=...)`, then save its return map as `source/svg.json`. It cannot run standalone in Node because the evaluator supplies the `pixso` global. No design mutation is performed. For screenshots use `get_export_image(guid=sourceNode, exportSettings={constraint:{type:1,value:1},imageType:1})`, saving PNGs under `reference`. `tokens/manifest.json` names each component's exact stable master node ID.

## Generate → diff → fix loop

1. Extract fields that influence rendering: sizes, child x/y, auto-layout and padding, fills/strokes, `strokeAlign`, radii, effects, fonts and content. Keep source node IDs in HTML for auditing.
2. Resolve fills, strokes and typography into generated CSS variables. Semantic HTML gets a `role`; these are non-interactive design specimens (`tabindex=-1`). Never infer Dark values by inverting Light.
3. Generate independent HTML partials with Tailwind utilities such as `relative`, but exact sizes from measured geometry. Tailwind theme is generated from the same normalized tokens.
4. Render each component alone in headless Chrome at DPR 1 with Inter available locally. CSS/fonts still come from the generated token layer.
5. Export the same Pixso node at scale 1. Compare RGBA pixels with `pixelmatch threshold=0.1, includeAA=true`. Compare against transparent originals. Canvas padding represents focused/Dialog native export bounds (`78px` focused Button, `226px` focused Input, `963x575px` Dialog).
6. Inspect `diff/<name>-actual.png`, `diff/<name>-diff.png` and `diff/report.json`; update extraction/generator rather than hand-patching the HTML; rerun `npm run verify`. Keep `.mjs` probes only when they are reproducible diagnostics with declared output.

Structural evidence is in [diff/structural-report.json](diff/structural-report.json): source-node id, actual offsets/width/height, font selection, geometry mismatches. Primitive source and DOM counts differ when source vector geometry is intact: an SVG's path descendants do not have matching HTML divs. This is intentional, not a claim of structural pixel equality.

## Current work / remaining gaps

- **Typography:** native HTML text uses source Inter Medium 500, 13/16px, letter-spacing 0; no manual stretch/tracking. Exact-match mode embeds the source SVG glyph paths with accessible labels (not bitmap text). `INT_UI_VECTOR_TEXT=0 npm run verify` retains native text, with larger differences. See [diff/README.md](diff/README.md).
- **Source perimeters:** focused Input's `2px CENTER` ring now uses half stroke outside/inside source geometry. Its strict mismatch improved from **13.186% to 0.188%**. The remaining 17 pixels are counted glyph coverage, not silently excluded AA.
- **Buttons:** Secondary and default Input duplicate CSS perimeter paint was removed in favor of source rounded-rect SVG. Secondary is **0.729%**, active primary **0.069%**; no claim of native-font raster parity is made.
- **Dialog:** measured shadow bounds are `(40,32,883,495)` inside a `963×575` export. Correcting alignment reduced generated DOM from 3.189% to 0.154%. The original source **vector** scene preserves the exact instance paths, filter, compositing and clip context and further reduces strict mismatch to **0.010% (57/553725)**. Full-canvas and regional differences remain reported; no close control is invented.
- **Native vector scene provenance:** `source/svg.json` stores all 13 original root exports. A measured opt-in list chooses only Dialog and indeterminate Checkbox as `source-svg-scene`; their semantic outer wrappers retain source IDs and accessible labels. The other 11 keep the better-or-equal generated DOM geometry—whole-root SVG was not assumed to improve every state. `tokens/manifest.json` records this split. This tradeoff preserves exact source vectors rather than reconstructing every Dialog child as HTML.
- **Vectors:** complex checkbox/help glyphs use source SVGs; source native SVG scenes retain all `path`, `rect`, `clipPath` and `filter` definitions. No screenshot flattening or rasterization is used. Opt out with `INT_UI_NATIVE_SCENE=0 npm run verify`. Source-vector scenes do not claim production interactions or full token-layer rebindability of every nested primitive.
- **Scope:** 13 selected Light variants of Button, Input, Checkbox, Toggle and Dialog. Not yet Dark, all other components/states, the entire landing page, or production form interactions/state toggling. No branch/commit is created by this work.

## Important file map

```
source/                     raw variables, styles, catalog, vector/glyph data, measured trees
source/svg.json             13 original root SVG exports (source-svg-scene provenance)
scripts/export-svg.mjs      read-only Pixso evaluator source-SVG exporter
tokens/tokens.json          normalized color/text/effect inputs
tokens/manifest.json        generated component ↔ source master ↔ variant axis map
components/<name>.html      generated partials (never edit as the source of truth)
components/rules.json       machine-readable selected component rules
previews/<name>.html        independently loadable specimens
dist/tokens.css             variable layer
dist/tailwind.theme.css     Tailwind color-variable bridge
reference/                  source native-scale transparent PNG baselines
components/rules.json       full extracted properties (fills, strokes, effects, layout)
diff/report.json            reproducible pixel and structure metrics
```

No original design is modified by the pipeline. No external account write is needed by default; the Pixso reads execute in the user's existing authorized connector.
