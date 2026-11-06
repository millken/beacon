# Int UI · rules-driven Tailwind HTML

`/workspace/int-ui-rules` is a **new** implementation, not a repair of `/workspace/int-ui-tailwind`. It consumes none of the rejected HTML. Target: Pixso `iPHNpHZoWc6Grn6DanoQDg`, _Getting started_ (`6222:73687`).

**Rules-driven DOM state coverage: 172 variants (86 Light / 86 Dark), plus legacy catalog defaults. Current verification metrics are in [diff/state-coverage.md](diff/state-coverage.md) and [diff/report.md](diff/report.md).**

## Design-rule inventory


Pixso reports **no local variables** (`variables: {}`). The authoritative token input is thus the file's **668 shared styles**, plus measured component geometry—not invented spacing tokens. [tokens/inventory.json](tokens/inventory.json) records these counts and the geometry inventory.

- **603** color styles → `tokens/tokens.json`, `dist/tokens.css`, `dist/tailwind.theme.css`
- **36** text styles → font family/size/weight/line-height/letter-spacing tokens
- **20** effect styles → CSS box-shadow variables
- **11** components and **131** component sets → `source/component-catalog.json`
- **189 extracted trees, including 172 canonical state variants**, with properties, dimensions and variant axes → `source/components/*.json`, `components/rules.json`, `tokens/manifest.json`
- Source style IDs (paint/text/effect) are preserved in each design node. Stable CSS names include a hash of the source style name, because same-color duplicates are _not_ always the same semantic token. Strokes resolve the actual node color; matching Light Gray/Grey values are linked to generated tokens. Exact style identity remains on each node for future complete ID→style mapping.
- Observed geometry: outer Button/Input row allocation `6px; content 28px`; checkbox padding `8px; 16px icon; 8px gap; 16px text`; toggle `53x20px`; Button min content width `48px, 12px horizontal, 6px vertical`; radii depend on source (`4px` controls, `3px` checkbox/toggle, `8px` Dialog); font `Inter 13px/16px 500` (Dialog title 600). These are extracted values, not a new generic design system.
- Exact original SVG path geometry is retained for complex checkbox/help glyphs and available _pure_ icons. Component containers and text geometry are generated with source node IDs and accessible labels. **No entire component is replaced by an exported PNG.**

## Current coverage

- **172 measured state variants across 15 families (86 Light / 86 Dark) and 190 manifest entries** including aliases/legacy specimens. Family counts and strict pixel scores: [diff/state-coverage.md](diff/state-coverage.md), [diff/report.md](diff/report.md).
- Alert uses `renderMode: generated-semantic-dom`; other state variants and legacy defaults use `renderMode: generated-dom`; whole-scene SVG and vector text remain diagnostic opt-ins. No zip HTML, raster specimens or invented missing-variant styles are used.
- **Semantic Alert pilot:** extracted Pixso layers map to `window[role=alertdialog]` → `window-body` → `alert-title` (status, real heading, paragraph, labelled native checkbox) → `window-actions` (real buttons). The chrome is CSS flow/flex/grid—no absolute coordinates or SVG shell. Only the two leaf source glyph containers (status and Help) use inline SVG; their extracted paths are preserved. `scripts/semantic-alert.mjs` reads both extracted masters into the layer→semantic model; its CSS binds source paint and spacing; `npm run check` verifies actual browser layout. Apply this same rules → layer map → semantic DOM → browser/diff pattern to other components. Status/type/size reference demos are examples only and not claimed as extra verified masters.
- All available Light state axes and Dark counterparts are shown. No visible `Additional state pending` / `Not extracted yet` cells remain in the docs. Some families deliberately have fewer variants because their masters expose no further axis (Toggle Off/On; Search Active/Invalid × Focus; Alert and Dialog Theme only).
- The strict state mean is reproduced by `node scripts/summarize-states.mjs` from the current report (not a fixed historical score). The previous absolute-coordinate baseline was **5.393%**, with residual Radio/focus/invalid, text raster and composite/Dialog geometry differences. This does **not** mean pixel identity; every nonzero result is marked `needs-fix`. See [EXTRACTION-REPORT.md](EXTRACTION-REPORT.md) for current details.
- Manifest keys are unique for all primary/secondary Button states. The historical `button-focused` and `link` aliases retain measured metadata and reference baselines.

## Commands

```bash
cd /workspace/int-ui-rules
npm install
npm run verify
# native HTML text is the default; INT_UI_VECTOR_TEXT=1 opts back into source glyph outlines
# INT_UI_NATIVE_SCENE=1 re-enables whole-scene SVG only as a pixel-comparison probe
# generate every component, preview and documentation page
npm run generate
# preview the reference-shaped docs at http://localhost:3000 (or the printed URL)
npm run preview
# serve Overview at / plus shared dist/tokens/previews without copying assets
# previews/<component>.html remains an isolated pixel specimen
```

| Entry point            | Purpose                                                                   |
| ---------------------- | ------------------------------------------------------------------------- |
| `npm run tokens`       | Normalize source shared styles to JSON, CSS variables and Tailwind theme  |
| `npm run generate`     | Generate partials, rules, isolated previews, and the `public/` documentation site |
| `npm run docs`         | Alias for `npm run generate`; docs are not authored or diffed independently       |
| `npm run preview`      | Serve Overview, pages and shared generated assets at `http://127.0.0.1:3000` |
| `npm run diff`         | Render each partial in isolated Chromium and compare against Pixso PNG    |
| `npm run check`        | Verify all CSS token names resolve, token paint is actually rebindable, and semantic Alert layout (static browser flow) |
| `npm run build`        | Tokens → generated HTML → Tailwind utilities/theme                        |
| `npm run extract:help` | Print the read-only Pixso Plugin API extraction script used by this run   |

`extract-component.mjs` is an evaluator script, not a standalone Node importer. Pass its output to `user-Pixso.eval_script(file_key="iPHNpHZoWc6Grn6DanoQDg", script=...)` (read-only; no design mutations), save each root to `source/components/<id-with-dash>.json`, and run `npm run generate` again. For native vector extraction, `scripts/export-svg.mjs` defines async `exportSourceSvg()`; append its invocation and pass that complete script to `user-Pixso.eval_script(file_key="iPHNpHZoWc6Grn6DanoQDg", script=...)`, then save its return map as `source/svg.json`. It cannot run standalone in Node because the evaluator supplies the `pixso` global. No design mutation is performed. For screenshots use `get_export_image(guid=sourceNode, exportSettings={constraint:{type:1,value:1},imageType:1})`, saving PNGs under `reference`. `tokens/manifest.json` names each component's exact stable master node ID.

## Generated documentation

`public/` and root `index.html` contain the generated static site: top navigation, five-column 30-entry component overview, foundations, component catalog and 18 state/detail/foundation pages. It embeds the same `components/*.html` partials used by isolated tests. Every canonical state master maps to its exact node ID and matching native PNG.

- Primary/Secondary and Slim Button cover all five states in Light/Dark.
- Checkbox (Unchecked/Checked/Indeterminate) and Radio (Off/On) cover Active/Hovered/Focused/Invalid/Disabled in Light/Dark.
- Input, Combo, Dropdown and Search cover their measured state/Focus axes; Link Default/Dropdown/External cover Default/Hovered/Disabled; Tab and Segmented cover source-defined selected/focus/Other axes; Banner covers four types × Inline.
- Dark source styles are actual extracted Dark styles, never inverted Light; source-measured SVG focus-ring insets and stroke overflow are supported without moving labels.
- The full state list is [diff/state-coverage.md](diff/state-coverage.md). `npm run check` verifies every node, generated DOM mode, embedded demos and absence of visible pending cells. Browser-preview CSS is served by `npm run preview`, not a basic root-level `python -m http.server /public` shortcut.

## Generate → diff → fix loop

1. Extract fields that influence rendering: sizes, child x/y, auto-layout and padding, fills/strokes, `strokeAlign`, radii, effects, fonts and content. Keep source node IDs in HTML for auditing.
2. Resolve fills, strokes and typography into generated CSS variables. Semantic HTML gets a `role`; these are non-interactive design specimens (`tabindex=-1`). Never infer Dark values by inverting Light.
3. Generate independent HTML partials with Tailwind utilities such as `relative`, but exact sizes from measured geometry. New semantic layer renderers use native HTML flex/grid instead of coordinate dumps; Tailwind theme is generated from the same normalized tokens.
4. Render each component alone in headless Chrome at DPR 1 with Inter available locally. CSS/fonts still come from the generated token layer.
5. Export the same Pixso node at scale 1. Compare RGBA pixels with `pixelmatch threshold=0.1, includeAA=true`. Compare against transparent originals. Canvas padding represents focused/Dialog native export bounds (`78px` focused Button, `226px` focused Input, `963x575px` Dialog).
6. Inspect `diff/<name>-actual.png`, `diff/<name>-diff.png` and `diff/report.json`; update extraction/generator rather than hand-patching the HTML; rerun `npm run verify`. Keep `.mjs` probes only when they are reproducible diagnostics with declared output.

Structural evidence is in [diff/structural-report.json](diff/structural-report.json): source-node id, actual offsets/width/height, font selection, geometry mismatches. Primitive source and DOM counts differ when source vector geometry is intact: an SVG's path descendants do not have matching HTML divs. This is intentional, not a claim of structural pixel equality.

## Current work / remaining gaps

- Text is real HTML (Inter, source sizes), no glyph outline substitution by default.
- All current state pixels are in `diff/report.`; no exact-match claim is made for nonzero scores. Highest residuals include focused/invalid Radio and some unfocused Light invalid field rings. Line-separator geometry for Dialog is reported explicitly.
- Older catalog specimens remain but their DOM reconstruction may differ from Pixso (e.g. Toolbar); they are not new state coverage.
- The Pixso masters expose no Disabled Toggle, Disabled Search, or Alert/Banner interaction-state axes; absence is documented, not fabricated.
- `.mjs` probes retained in the package are reproducible; root exported Pixso SVG images and obsolete historical log scores are visibly marked historical.

## Important file map

```
source/                     raw variables, styles, catalog, vector/glyph data, measured trees
source/svg.json             original root SVG exports (opt-in pixel probe only)
scripts/export-svg.mjs      read-only Pixso evaluator source-SVG exporter
scripts/generate-docs.mjs   generated reference-style Overview, foundations, catalogs and component pages
index.html                  generated Overview at the repository root
public/index.html           same generated Overview for conventional doc-site hosting
public/site.css             token-bound doc chrome; excluded from isolated specimen pages
public/site.js              navigation, compact token copying and usage-demo controls
public/pages/*.html         generated complete state matrices, catalog and foundation pages
tokens/tokens.json          normalized color/text/effect inputs
tokens/manifest.json        generated component ↔ source master ↔ variant axis map
components/<name>.html      generated partials (never edit as the source of truth)
components/rules.json       machine-readable selected component rules
previews/<name>.html        independently loadable isolated pixel-diff specimens
dist/tokens.css             variable layer
dist/tailwind.theme.css     Tailwind color-variable bridge
reference/                  source native-scale transparent PNG baselines
components/rules.json       full extracted properties (fills, strokes, effects, layout)
diff/report.json            reproducible pixel and structure metrics
```

No original design is modified by the pipeline. No external account write is needed by default; the Pixso reads execute in the user's existing authorized connector.
