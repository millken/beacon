# Light extraction batch · 2026-11-06

`npm run verify`: generated 40 specimens. 27 new Light specimens cover every one of the 30 catalog cards, including a second Radio state and Code Sample. The same 30 entries previously had visible `Not extracted yet` placeholders; none remain in generated docs.

All 13 original partials were compared byte-for-byte against their baseline after this batch; they are unchanged. Scores below use the unchanged strict Chrome vs Pixso PNG comparison (pixelmatch threshold 0.1, `includeAA:true`). Native exported SVG source geometry is kept in these new scene renderers; no PNG is embedded and no reference HTML is copied.

## New source specimens

| Specimen | Pixso node | Diff | Pixel count |
|---|---|---:|---:|
| tree | 5875:79108 | 0.254% | 190/74752 |
| toolbar | 1146:54209 | 0% | 0/4896 |
| table | 7278:46644 | 0.195% | 241/123324 |
| context-menu | 7040:84853 | 0.563% | 1112/197469 |
| tool-window | 217:51357 | 0.048% | 33/68760 |
| group-header | 605:47011 | 0.027% | 4/14719 |
| shortcut | 6551:84194 | 1.667% | 12/720 |
| main-window | 7070:138481 | 0.476% | 7741/1627920 |
| alert | 3342:83343 | 0.129% | 163/126000 |
| banner | 3346:81595 | 0.117% | 28/24000 |
| combobox | 7944:74792 | 0.435% | 39/8960 |
| link | 46:11087 | 0% | 0/1260 |
| radio-button | 3894:82043 | 0% | 0/1664 |
| radio-button-off | 3894:82033 | 0.24% | 4/1664 |
| dropdown | 7944:74566 | 0.435% | 39/8960 |
| search | 7070:146044 | 0.19% | 17/8960 |
| slim-button | 6517:82734 | 1.389% | 36/2592 |
| segmented-control | 7281:46903 | 1.049% | 111/10584 |
| progress-bar | 7059:86469 | 0.082% | 4/4880 |
| loader | 5767:82631 | 0% | 0/256 |
| notification | 3595:83697 | 0.155% | 98/63200 |
| tooltip | 55:9038 | 0.184% | 18/9800 |
| tooltip-got-it | 56:8740 | 0.198% | 100/50544 |
| tooltip-editor | 71:11758 | 0.104% | 50/48026 |
| tab | 5664:79159 | 0.028% | 1/3567 |
| scrollbar | 6222:73548 | 0.533% | 8/1500 |
| code-sample | 3711:79011 | 0.409% | 9/2200 |

## Original specimens (unchanged)

| Specimen | Diff | Pixel count |
|---|---:|---:|
| button-secondary | 0.729% | 21/2880 |
| button-primary | 0.069% | 2/2880 |
| button-primary-hovered | 0.069% | 2/2880 |
| button-primary-pressed | 0.104% | 3/2880 |
| button-primary-focused | 0.096% | 3/3120 |
| input | 0.19% | 17/8960 |
| input-focused | 0.188% | 17/9040 |
| checkbox | 0.061% | 1/1632 |
| checkbox-unchecked | 0.061% | 1/1632 |
| checkbox-indeterminate | 0.061% | 1/1632 |
| toggle-on | 0.094% | 1/1060 |
| toggle-off | 0% | 0/1060 |
| dialog | 0.01% | 57/553725 |

## Docs

- Overview + Components: all 30 entries contain inline measured Light specimens. Original scenes are scaled only inside thumbnails, not altered in their pixel-test partials.
- Alert, Banner and Combo box now display actual measured Light specimens and source links instead of placeholders.
- Button includes Slim Button; Radio adds its off state; Shortcut & code includes Shortcut and Code Sample. Tree, Toolbar, Table, Context menu, Tool window, Main window and Header/Group header now have actual scene previews.
- Generated docs no longer contain `Not extracted yet`. Remaining `pending` labels refer only to Dark, disabled and other additional states outside this batch.

## Backlog / residual differences

- Nonzero native-SVG raster differences remain and are not declared exact matches. They are chiefly glyph antialiasing and native SVG shadow/filter rasterization. Four new specimens are exact: Toolbar, Link, Radio-on and Loader. No tolerance was loosened and no mismatched region was cropped out.
- Dark variants, additional states and full multi-state detail matrices remain for a subsequent batch. They can use the same extraction and source-vector generation paths.
- Group header resolves to Pixso Header, Type=Label + Separator (605:47011), closest available kit equivalent.
- Reproduction: `node scripts/extract-component.mjs` prints the read-only eval function for all 40 source nodes; `node scripts/export-svg.mjs` prints the exact source SVG export function. Save the returned rule roots and SVG map under `source/components/` and `source/svg.json`, then `npm run verify`.
