# Rules-generated HTML vs Pixso

| Component | Size | Diff | Pixels | Status |
|---|---:|---:|---:|---|
| tree | 292×256 | 0.254% | 190/74752 | needs-fix |
| toolbar | 144×34 | 0% | 0/4896 | pixel-identical |
| table | 717×172 | 0.195% | 241/123324 | needs-fix |
| context-menu | 333×593 | 0.563% | 1112/197469 | needs-fix |
| tool-window | 360×191 | 0.048% | 33/68760 | needs-fix |
| group-header | 359×41 | 0.027% | 4/14719 | needs-fix |
| shortcut | 36×20 | 1.667% | 12/720 | needs-fix |
| main-window | 1596×1020 | 0.476% | 7741/1627920 | needs-fix |
| alert | 500×252 | 0.129% | 163/126000 | needs-fix |
| banner | 600×40 | 0.117% | 28/24000 | needs-fix |
| combobox | 224×40 | 0.435% | 39/8960 | needs-fix |
| link | 45×28 | 0% | 0/1260 | pixel-identical |
| radio-button | 52×32 | 0% | 0/1664 | pixel-identical |
| radio-button-off | 52×32 | 0.24% | 4/1664 | needs-fix |
| dropdown | 224×40 | 0.435% | 39/8960 | needs-fix |
| search | 224×40 | 0.19% | 17/8960 | needs-fix |
| slim-button | 72×36 | 1.389% | 36/2592 | needs-fix |
| segmented-control | 378×28 | 1.049% | 111/10584 | needs-fix |
| progress-bar | 305×16 | 0.082% | 4/4880 | needs-fix |
| loader | 16×16 | 0% | 0/256 | pixel-identical |
| notification | 400×158 | 0.155% | 98/63200 | needs-fix |
| tooltip | 175×56 | 0.184% | 18/9800 | needs-fix |
| tooltip-got-it | 312×162 | 0.198% | 100/50544 | needs-fix |
| tooltip-editor | 407×118 | 0.104% | 50/48026 | needs-fix |
| tab | 87×41 | 0.028% | 1/3567 | needs-fix |
| scrollbar | 100×15 | 0.533% | 8/1500 | needs-fix |
| code-sample | 110×20 | 0.409% | 9/2200 | needs-fix |
| button-secondary | 72×40 | 0.729% | 21/2880 | needs-fix |
| button-primary | 72×40 | 0.069% | 2/2880 | needs-fix |
| button-primary-hovered | 72×40 | 0.069% | 2/2880 | needs-fix |
| button-primary-pressed | 72×40 | 0.104% | 3/2880 | needs-fix |
| button-primary-focused | 78×40 | 0.096% | 3/3120 | needs-fix |
| input | 224×40 | 0.19% | 17/8960 | needs-fix |
| input-focused | 226×40 | 0.188% | 17/9040 | needs-fix |
| checkbox | 51×32 | 0.061% | 1/1632 | needs-fix |
| checkbox-unchecked | 51×32 | 0.061% | 1/1632 | needs-fix |
| checkbox-indeterminate | 51×32 | 0.061% | 1/1632 | needs-fix |
| toggle-on | 53×20 | 0.094% | 1/1060 | needs-fix |
| toggle-off | 53×20 | 0% | 0/1060 | pixel-identical |
| dialog | 963×575 | 0.01% | 57/553725 | needs-fix |

Pixelmatch threshold: 0.1, including antialias differences (`includeAA:true`). A 0% score is not claimed until all geometry, text, vectors and comparisons match. Render mode: see `tokens/manifest.json`; source-svg-scene preserves exact vector scenes in HTML, not screenshots. Dialog regions are sampling windows, not a nonoverlapping source-node census.

## Dialog regional audit

The full score includes the source shadow export; it is not silently removed. Additional crops separate body paint from shadow and title/icon/footer rules.

| Region | Diff | Pixels |
|---|---:|---:|
| body | 0.013% | 58/437085 |
| title | 0.104% | 12/11520 |
| header-left | 0.05% | 2/4000 |
| footer-right | 0% | 0/33330 |
| footer-left | 0% | 0/13200 |

## Remaining discrepancies (ranked by percent)

- **shortcut:** 1.667% (12/720); See source node and diff image.
- **slim-button:** 1.389% (36/2592); See source node and diff image.
- **segmented-control:** 1.049% (111/10584); See source node and diff image.
- **button-secondary:** 0.729% (21/2880); 21 label path pixels; source inside perimeter is unchanged. No invented font sizing, tracking or position.
- **context-menu:** 0.563% (1112/197469); See source node and diff image.
- **scrollbar:** 0.533% (8/1500); See source node and diff image.
- **main-window:** 0.476% (7741/1627920); See source node and diff image.
- **combobox:** 0.435% (39/8960); See source node and diff image.
- **dropdown:** 0.435% (39/8960); See source node and diff image.
- **code-sample:** 0.409% (9/2200); See source node and diff image.
- **tree:** 0.254% (190/74752); See source node and diff image.
- **radio-button-off:** 0.24% (4/1664); See source node and diff image.
- **tooltip-got-it:** 0.198% (100/50544); See source node and diff image.
- **table:** 0.195% (241/123324); See source node and diff image.
- **search:** 0.19% (17/8960); See source node and diff image.
- **input:** 0.19% (17/8960); 17 source-outline label pixels; perimeter corrected; strict AA is included.
- **input-focused:** 0.188% (17/9040); 17 source-outline label pixels; 2px CENTER focus ring corrected from 13.186% to 0.188% overall.
- **tooltip:** 0.184% (18/9800); See source node and diff image.
- **notification:** 0.155% (98/63200); See source node and diff image.
- **alert:** 0.129% (163/126000); See source node and diff image.
- **banner:** 0.117% (28/24000); See source node and diff image.
- **tooltip-editor:** 0.104% (50/48026); See source node and diff image.
- **button-primary-pressed:** 0.104% (3/2880); Three label path pixels; no unverified paint change.
- **button-primary-focused:** 0.096% (3/3120); Three pixels in source outside-focus-ring coverage; primary label matches within two separately measured pixels.
- **toggle-on:** 0.094% (1/1060); One label path pixel; container and original vector match.
- **progress-bar:** 0.082% (4/4880); See source node and diff image.
- **button-primary:** 0.069% (2/2880); Two label path pixels in Chromium vs the source PNG.
- **button-primary-hovered:** 0.069% (2/2880); Two label path pixels; unchanged active-state paint matches.
- **checkbox:** 0.061% (1/1632); One source-checked group glyph pixel.
- **checkbox-unchecked:** 0.061% (1/1632); One source-outline label pixel; original stroke geometry unchanged.
- **checkbox-indeterminate:** 0.061% (1/1632); One residual source-glyph raster pixel (1/1632) after preserving the native rounded-mark vector scene, improved from 7 pixels.
- **tool-window:** 0.048% (33/68760); See source node and diff image.
- **tab:** 0.028% (1/3567); See source node and diff image.
- **group-header:** 0.027% (4/14719); See source node and diff image.
- **dialog:** 0.01% (57/553725); 57 pixels using the original source SVG scene, with all vector paths, clips and native shadow filter retained (not a PNG). Census includes 32 Cancel, 3 OK, 2 Help and 2 header-left pixels plus other path and edge/shadow coverage. Regional windows overlap, so their counts are not a sum. Strict AA remains enabled.

Target goal not met: on the strict comparison, Secondary remains 21px and Inputs 17px each. Current measured minima and applicable-representation caveat follow.

## Current measured source-raster floor

`npm run raster:floor` separates unchanged source glyphs from unchanged source-background compositing. All modes use the same transparent DPR-1 canvas and strict `threshold=0.1, includeAA=true`. These are the best yet measured pixel counts for these reference pairs, not a proof that every other renderer must be nonzero. Native whole-root SVG is not silently substituted where it is worse. Best minimum is the minimum of the applicable measurements. The focused ring has a different source clip/compositing context, so the mixed glyph experiment is N/A rather than a glyph-only assertion; its independent root still measures the same 17 pixels.

| State | Best source-absolute minimum | Target ≤0.1% | Generated DOM | Source-absolute glyph + generated perimeter | Untouched source SVG scene |
|---|---:|---:|---:|---:|---:|
| button-secondary | 21/2880 (0.729%) | ≤2px | 21 | 21 | 36 |
| input | 17/8960 (0.19%) | ≤8px | 17 | 17 | 31 |
| input-focused | 17/9040 (0.188%) | ≤9px | 17 | N/A | 17 |