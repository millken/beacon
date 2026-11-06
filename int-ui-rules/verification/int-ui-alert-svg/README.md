# Alert SVG repair evidence

Source file: Pixso `iPHNpHZoWc6Grn6DanoQDg`. No design mutation was performed.

| Export | Exact source node |
|---|---|
| `source/icons/alert-light-error.svg` | `11163:20353` |
| `source/icons/alert-light-warning.svg` | `11163:69187` |
| `source/icons/alert-dark-error.svg` | `11163:69573` |
| `source/icons/alert-dark-warning.svg` | `11163:69651` |

Each SVG came from read-only `get_export_image`, with SVG format, constraint type 1 / value 1. Only non-visual `customFrame` names were renamed for nonstandard-HTML safety; clip IDs/namespaces were made unique per icon. Path data, transforms, fills, strokes, viewBox, geometry and sizing were not altered.

At a 64px comparison rendering, Light warning changed 1149/4096 pixels (28.052%); Light error changed 206/4096 (5.029%). These samples compare the defective composition with the repaired generator, not a claim of pixel identity to a Pixso master PNG. Verified Light master status before/after comparison changed 0/4096 pixels.

- `alert-light-warning-before.png` / `alert-light-warning-after.png`: old inferred polygon + bare paths versus real Pixso export.
- `alert-light-error-before.png` / `alert-light-error-after.png`: bare translated path versus real transformed stem.
- `alert-master-light-before.png` / `alert-master-light-after.png`: previously verified master retained exactly.

Run `npm run verify` from the unpacked project root for reproducible source checks, browser layout assertions and canonical pixel verification.
