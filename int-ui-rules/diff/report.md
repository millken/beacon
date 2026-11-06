# Rules-generated HTML vs Pixso

| Component | Size | Diff | Pixels | Status |
|---|---:|---:|---:|---|
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

- **button-secondary:** 0.729% (21/2880); 21 label path pixels; source inside perimeter is unchanged. No invented font sizing, tracking or position.
- **input:** 0.19% (17/8960); 17 source-outline label pixels; perimeter corrected; strict AA is included.
- **input-focused:** 0.188% (17/9040); 17 source-outline label pixels; 2px CENTER focus ring corrected from 13.186% to 0.188% overall.
- **button-primary-pressed:** 0.104% (3/2880); Three label path pixels; no unverified paint change.
- **button-primary-focused:** 0.096% (3/3120); Three pixels in source outside-focus-ring coverage; primary label matches within two separately measured pixels.
- **toggle-on:** 0.094% (1/1060); One label path pixel; container and original vector match.
- **button-primary:** 0.069% (2/2880); Two label path pixels in Chromium vs the source PNG.
- **button-primary-hovered:** 0.069% (2/2880); Two label path pixels; unchanged active-state paint matches.
- **checkbox:** 0.061% (1/1632); One source-checked group glyph pixel.
- **checkbox-unchecked:** 0.061% (1/1632); One source-outline label pixel; original stroke geometry unchanged.
- **checkbox-indeterminate:** 0.061% (1/1632); One residual source-glyph raster pixel (1/1632) after preserving the native rounded-mark vector scene, improved from 7 pixels.
- **dialog:** 0.01% (57/553725); 57 pixels using the original source SVG scene, with all vector paths, clips and native shadow filter retained (not a PNG). Census includes 32 Cancel, 3 OK, 2 Help and 2 header-left pixels plus other path and edge/shadow coverage. Regional windows overlap, so their counts are not a sum. Strict AA remains enabled.

Target goal not met: on the strict comparison, Secondary remains 21px and Inputs 17px each. Current measured minima and applicable-representation caveat follow.

## Current measured source-raster floor

`npm run raster:floor` separates unchanged source glyphs from unchanged source-background compositing. All modes use the same transparent DPR-1 canvas and strict `threshold=0.1, includeAA=true`. These are the best yet measured pixel counts for these reference pairs, not a proof that every other renderer must be nonzero. Native whole-root SVG is not silently substituted where it is worse. Best minimum is the minimum of the applicable measurements. The focused ring has a different source clip/compositing context, so the mixed glyph experiment is N/A rather than a glyph-only assertion; its independent root still measures the same 17 pixels.

| State | Best source-absolute minimum | Target ≤0.1% | Generated DOM | Source-absolute glyph + generated perimeter | Untouched source SVG scene |
|---|---:|---:|---:|---:|---:|
| button-secondary | 21/2880 (0.729%) | ≤2px | 21 | 21 | 36 |
| input | 17/8960 (0.19%) | ≤8px | 17 | 17 | 31 |
| input-focused | 17/9040 (0.188%) | ≤9px | 17 | N/A | 17 |