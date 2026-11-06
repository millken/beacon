# Int UI — Tailwind CSS HTML

Faithful HTML conversion of the **Int UI Kit / Getting started** page imported from Figma into Pixso.

- **Pixso file:** `iPHNpHZoWc6Grn6DanoQDg`
- **Page:** `6222:73687` — Getting started
- **Source:** https://pixso.cn/app/design/iPHNpHZoWc6Grn6DanoQDg?icon_type=1&page-id=6222%3A73687
- **Implementation:** semantic HTML partials, local Tailwind CSS v4, exact vector assets and original guide bitmaps.

## Open

Open **`index.html`** directly in a browser. All icons and image assets are local; no server is required.

- Full page: `/workspace/int-ui-tailwind/index.html`
- Component preview index: `/workspace/int-ui-tailwind/previews/index.html`
- Component source partials: `/workspace/int-ui-tailwind/components/`
- Component inventory: `/workspace/int-ui-tailwind/inventory.json`

Or serve locally:

```sh
cd /workspace/int-ui-tailwind
npm run serve
# http://localhost:4173/
```

## Build

Node.js and dependencies are required only to rebuild. The delivered HTML/CSS/assets work without a build step.

```sh
cd /workspace/int-ui-tailwind
npm install
npm run build
npm run screenshot
node qa.mjs
```

The build runs `convert.mjs`, compiles `tailwind.css` to `dist/tailwind.css`, creates an embedded SVG symbol sprite, and generates standalone component previews. The SVG sprite is embedded once in each preview page, so direct `file://` opening works without network requests.

## Scope

This converts the requested **Getting started** page, not every component-variant page elsewhere in the Pixso file. It includes:

1. Int UI Kit title
2. How to use Figma library — `8151:76094`
3. Design basics — `8063:76782`
4. Components — `8028:90897`, 30 examples in a four-column grid

## Component map

| # | Component | HTML partial | Pixso node |
|---|---|---|---|
| 1 | Alert | `components/alert.html` | `8028:81782` |
| 2 | Banner | `components/banner.html` | `8028:81717` |
| 3 | Button | `components/button.html` | `8028:81747` |
| 4 | Checkbox | `components/checkbox.html` | `8028:81931` |
| 5 | Combo box | `components/combo-box.html` | `8028:82362` |
| 6 | Context menu | `components/context-menu.html` | `8028:81934` |
| 7 | Dialog | `components/dialog.html` | `8028:83753` |
| 8 | Dropdown | `components/dropdown.html` | `8028:81937` |
| 9 | Group header | `components/group-header.html` | `8028:82004` |
| 10 | Input field | `components/input-field.html` | `8028:83554` |
| 11 | Link | `components/link.html` | `8028:82007` |
| 12 | Loader | `components/loader.html` | `8028:83468` |
| 13 | Notification | `components/notification.html` | `8028:82010` |
| 14 | Popup | `components/popup.html` | `8028:82077` |
| 15 | Progress bar | `components/progress-bar.html` | `8073:77805` |
| 16 | Radio button | `components/radio-button.html` | `8028:82080` |
| 17 | Segmented control | `components/segmented-control.html` | `8028:82083` |
| 18 | Search | `components/search.html` | `8028:82150` |
| 19 | Scrollbar | `components/scrollbar.html` | `8028:82153` |
| 20 | Shortcut and code sample | `components/shortcut-and-code-sample.html` | `8028:82156` |
| 21 | Tab | `components/tab.html` | `8028:83848` |
| 22 | Table | `components/table.html` | `8028:83569` |
| 23 | Toggle | `components/toggle.html` | `8028:83557` |
| 24 | Toolbar | `components/toolbar.html` | `8028:83667` |
| 25 | Tooltip | `components/tooltip.html` | `8028:83652` |
| 26 | Tooltip: Editor | `components/tooltip-editor.html` | `8028:83655` |
| 27 | Tooltip: Got It | `components/tooltip-got-it.html` | `8028:83765` |
| 28 | Tree | `components/tree.html` | `8028:83750` |
| 29 | Tool window | `components/tool-window.html` | `8028:83862` |
| 30 | Main window | `components/main-window.html` | `8028:83860` |

Design basics contains **Colors**, **Typography**, **Spacing**, and **Icons in Figma Community** cards. The full component preview index is `previews/index.html`.

## Directory

```text
int-ui-tailwind/
├── index.html                 # Complete composed page; open directly
├── inventory.json             # Machine-readable component map
├── tailwind.css               # Tailwind v4 input and font theme
├── dist/tailwind.css           # Compiled, minified CSS
├── components/                 # 30 independent HTML component partials
├── previews/                   # Standalone browser previews + index
├── assets/
│   ├── icons/                 # Exact source SVG exports
│   ├── icons.svg              # Reusable SVG symbol definitions
│   └── images/                # Original guide screenshot bitmaps
├── screenshots/               # Pixso references and rendered HTML captures
├── source/                    # Pixso HTML/CSS JSON and export manifests
├── convert.mjs                # Source CSS/declaration → Tailwind conversion
├── inline-sprite.mjs           # SVG reference generation
├── build-previews.mjs          # Standalone component shell generation
├── preview.mjs / crop-preview.mjs / qa.mjs
├── server.mjs
└── package.json
```

## Fidelity and limitations

- Source colors, sizes, offsets, typography, border widths, radii, shadows, and component labels are mapped to Tailwind utilities or arbitrary values; no new visual theme was introduced.
- Most controls are static examples, matching the source overview page. They are not a production interactive UI library.
- Vector icons use inline SVG `<use>` references to a local embedded sprite. Original individual SVG files remain available under `assets/icons/`.
- The Figma usage guide contains screenshot illustrations in the source. Those seven bitmap assets are retained under `assets/images/`; the surrounding headings, text, links, layout and controls remain HTML.
- Inter and JetBrains Mono are loaded from Google Fonts when online, with local fallbacks. SF Pro Text uses Inter if unavailable. Browser/OS font rasterization may differ slightly from Pixso.
- The avatar's 30×30 circular mask is an equivalent inline SVG data URI for reliable offline browser rendering.

## Verification

`qa-report.json` records a Chromium check of the final page: 30 components, 166 SVG uses, zero missing SVG references, zero missing assets, zero page errors, and zero failed resource requests.

Source and HTML comparison images are under `screenshots/`:

- `source-8028-90897.png` / `html-components.png`
- `source-8063-76782.png` / `html-basics.png`
- `source-8151-76094.png` / `html-guide.png`
- `html-before-assets.png` — complete HTML page screenshot
