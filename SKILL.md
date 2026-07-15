---
name: beacon-design-system
description: Use this skill to generate well-structured desktop-grade GUI interfaces and assets with the **Beacon** design system — a design-token + component library borrowing Semi Design's mature token architecture (functional color interaction-state matrix, semantic layering, one-switch theming) with Beacon's dense, hard-edged, mono-first, dark+light, radius-≤6px desktop-tool character. 59 components across 15 pages. For production or throwaway prototypes/mocks.
user-invocable: true
---

Read `README.md` first, then explore `colors_and_type.css` (all tokens as CSS variables), `tokens.html` (the visual spec reference), `presets.js` (14 color presets + applyPreset), and `preview/` (token cards).

This system = **Semi's structure × Beacon's skin**:
- **Structure (from Semi):** every semantic color expands to a full interaction-state matrix — `--color-primary` / `-hover` / `-active` / `-disabled` / `-light-default` / `-light-hover` (same for success/warning/danger). Text is 4-level (`--color-text` … `-dim`, aliased to Semi `text-0..3`). A shadcn-style ROLES layer (`--primary`, `--card`, `--muted`, `--subtle`, `--destructive`, `--ring`) sits on top.
- **Skin (from Beacon):** desktop-tool character. Single accent (radix-blue) for clickable focus only; state colors for semantics not decoration. Base font 13px; sans = system stack, mono = Iosevka/JetBrains for all numbers/code/paths (with `tabular-nums`). Single-knob `--radius` (3px, max 6px) — no iOS-style big rounding. 8px spacing base. White-first light via plane model; 6-level dark surfaces. Shadows only for overlays. 1px borders carry hierarchy.

Rules:
- Never hardcode hex — always reference tokens / roles so the UI re-skins from one place and light/dark just works (`<html data-theme="light|dark">`).
- Prefer the functional matrix for stateful elements (buttons, tags, status) and ROLES for surfaces.
- Hard edges, dense layout, mono numbers, LED dots + 1px dividers for status. No gradients, no emoji status, no blur.
- **Inputs default to a recessed well (fill + inset shadow) — it's affordance, not decoration:** the concave field vs convex button encodes "type here / click me". Keep it on content surfaces (`bg`/`card`). Only where the field sits on chrome whose tone equals the well (toolbar search, inline-edit cells) and the fill is redundant, use `.input--flat` — transparent at rest, the well *floats out* on focus. Pick by context, not globally.
- **Icon buttons MUST use `<svg>`, never text glyphs** (no `✕ / × / +` chars) — text glyphs get squished in narrow containers and render inconsistently across platforms. Use `<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>` with `stroke: currentColor`. The component layer already sizes svg inside `.dialog-x` / `.toast .t-x` / `.chip .x`.
- To switch palette beyond Beacon: load `presets.js` and call `applyPreset(key, theme)` (14 presets: beacon/chrome/antd/console/studio/workshop/iron/refinery/lab/mainframe/foundry/helix/atlas/reactor).
- **Component customization goes through §4 structural knobs** (`:root` global override, or container-scoped `style="--knob: …"` local override) — variants (`--primary`/`--sm`/…) change a component's private wiring tokens instead; any new component token must first be added to the component-tokens spec contract (`docs/superpowers/specs/2026-07-15-component-tokens-design.md` §7) and the §4 registry in `colors_and_type.css` before use.

If creating visual artifacts (slides, mocks, prototypes), copy `colors_and_type.css` out and build static HTML that `<link>`s it, then show the user. If working on production code, copy the tokens and apply these rules.

If invoked without guidance, ask what to build, ask a few questions, and act as an expert designer outputting HTML artifacts or production code.
