# Strict comparison notes

All scores are opaque-RGBA comparisons at source export scale 1, DPR 1, `pixelmatch threshold=0.1`, `includeAA=true`; the script does not suppress antialias pixels. Baselines are transparent Pixso exports in `reference`. `report.json` contains the source node IDs and per-component diagnostics.

## Text policy

Native HTML Inter is `Inter 13px/16px Medium / 500, letterSpacing=0` from source. A separate fetched local font did not reproduce the source's exact widths and rasterization. Exact match mode therefore uses `source/text-geometry.json`, read-only SVG exports of the **original nodes' glyph vector paths**, wrapped in the generated positioned DOM with `role=img aria-label` and an aria-hidden graphic. These are not whole-component images. Opt in with `INT_UI_VECTOR_TEXT=1 npm run verify` for the glyph-outline probe. **Native HTML text is now the default** (real `<span>` content, Inter 13px/16px Medium from extracted styles); the historical exact-match scores below used the opt-in glyph mode and whole-scene SVG and are kept only as a raster floor reference.

## Verified source-rule corrections

- A `CENTER` stroke is not rendered as an INSIDE CSS border: the 2px blue Input ring uses source rectangle dimensions with half stroke each side. This reduced focused Input from 13.186% to 0.188% (97/9040 reduced to 17/9040 with source glyph outlines).
- An INSIDE control stroke goes into one SVG rounded rect, not a duplicated CSS perimeter. Source geometry/colors, not new aliases, drive it. Default Input went from 1.920% baseline to 0.190%; Secondary Button from 9.861% to 0.729%.
- Source vector groups are preserved for checked/indeterminate/help glyphs; this is not a bitmap substitute for components. Toggle Off is exactly 0 differing pixels (0/1060).
- Measured default text vs. SVG paths was compared directly: glyph geometry reduced the majority of raster mismatch without manually stretching, tracking or translating labels.

## Dialog shadow export alignment

The source `radius=40`, `offsetY=8` drop-shadow native export is 963x575. Its panel is at `(40,32)`, not a vertically centered `(40,40)` y position. Earlier symmetric centering created thousands of false differences including phantom doubled title and footer positions. `scripts/diff.mjs` now derives top from the 40px horizontal bounds (575 - 495 - 8 - 40 = 32). No component or text was shifted. This reduced Dialog from **3.189% (17,659 pixels) to 0.154% (850 pixels)**. Title is 12 pixels and header-left 0; body 732, outer shadow 118. CSS box-shadow and Pixso shadow rasterization still differ, counted in full.

The **generated-DOM** Dialog's remaining body/title/header/footer/shadow crop values are historical diagnostics in report-notes.md, not the current native-scene score. All remaining source paint weight (including Dialog's 0.5px INSIDE outline) is preserved. Fractional-path/rounded-rect/inline-fragment combinations that did not improve the measured score were removed. The full Dialog has not been flattened to a bitmap. No global source-raster floor is inferred from a few surviving glyph discrepancies.

## Native vector scenes and remaining residuals

`source/svg.json` is exact root SVG data for all 13 selected Pixso nodes, produced by the read-only `exportAsync({format:"SVG"})` evaluator in `scripts/export-svg.mjs`. Generator mode accepts two original **editable vector scenes** in their semantic outer HTML wrappers: Dialog (`7070:146270`, native extent 963×575, origin 0,0) and indeterminate Checkbox (`3590:81646`, 51×32). They improve respectively **850→57 (0.154%→0.010%)** and **7→1 (0.429%→0.061%)**, proving the earlier 850 pixels were not a font floor. `sceneOrigin`/`renderMode` in the shared manifest control comparison. Do not double-pad the native shadow; that re-tests incorrect geometry.

The other 11 states stay generated DOM because a raw-source scene check did not improve them (for example Secondary 36 versus current 21; Input 31 versus current 17). Original source vectors, not loaded PNGs, are the scenes: `path`, `rect`, `clipPath` and `filter` remain in `components/<state>.html`. The two complete scene choices are explicitly alternatives to full HTML child reconstruction, not claims of fully compositional or production-interactive components.

## Honest remaining floor and source-data work

The 1–21 residual pixels per isolated control are mostly glyph/radius antialias **coverage** differences between Pixso PNG rasterization and Chromium SVG rasterization. They are counted, not filtered. They are not an assertion that Inter is unavailable or wrong. An experimental combined parent+glyph SVG produced 2/2880 for primary button, exactly the same as layered output. Do not claim a universal zero font-raster floor: Toggle Off proves exact match is possible, but other paths still differ.

Dialog full-canvas percent includes the exported shadow. `diff/dialog-body-diff.png` and `diff/dialog-region-*.png` break out body, title, traffic-light header and footer. Do not infer an unextracted close button or change shadow parameters just to resemble a baseline. Re-export/extract header instances if later evidence shows instance-resolution differences. Fractional mark CSS and SVG rounded rectangles were measured; SVG-only fractional replacement was not adopted globally. Current Dialog region scores are 58/437085 body, 12/11520 title, 2/4000 header-left, 0/33330 footer-right and 0/13200 footer-left. These windows overlap rather than partitioning the 57 overall pixels; the legacy footer-left 49/0.371% figure does not describe the current scene.

## Secondary / Input residual floor diagnostics

`npm run raster:floor` after the normal verifier compares the generated DOM, source-absolute glyphs, and independent native SVG roots under identical strict comparison. Current minima: Secondary **21px/0.729%** (source root worse at 36); Input **17px/0.190%** (source root worse at 31); focused Input **17px/0.188%** (whole source root also 17). Full reference comparisons count every residual. The focused-source-clip hybrid is excluded as a glyph isolation test; see `diff/raster-floor-probe.json`. These are minima measured in this run, not a universal zero-impossibility claim. No worse scene was adopted, no pixel offset was changed to seek coverage, and no PNG substitution was added.

These scores cover 13 Light variants only, not Dark or full Int UI.
