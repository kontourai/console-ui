# Kontour Console Kit — Shared Context (read this first)

This document is the shared context for a multi-step initiative to build a cross-product
theming + component system for the Kontour console products. Each step plan
(`01-*.md`, `02-*.md`, `03-*.md`) assumes you have read this file.

You are a cold-start agent. Everything you need to know about the landscape is here.
Do not assume prior conversation context.

---

## Goal

Make the Kontour console UIs **look like one product family** while letting each
product keep **one unique brand color**, and make UI building blocks **as
interoperable as possible** across products that are built on different rendering
stacks (React vs vanilla TS vs static HTML).

The agreed shape (decided by the product owner):
- A **React core component library**, shipped as an **npm package**.
- Products are **mostly visually uniform**, differentiated by **one brand color** each.
- The shared layer is delivered in **three layers / entry points** so "interoperable"
  survives the React-vs-vanilla split:

```
@kontourai/console-kit
├─ /tokens   →  tokens.css + themes.css   (framework-agnostic CSS custom properties;
│                                           any product can <link> or @import them)
├─ /react    →  <Panel> <Badge> <StatusBadge> <Metric> <Progress> <Button> …
│                                           (the React core; seeded from kontour-console)
└─ /elements →  web-component wrappers      (optional, later; lets vanilla apps use the
                                             same primitives without a React rewrite)
```

The unifying trick: **components are className-driven and read only tokens.** The same
stylesheet skins a React `<Badge>` and a vanilla `<span class="badge tone-positive">`
identically. Products converge visually without all converging on React at once.

---

## The landscape (verified recon — June 2026)

All products live as sibling folders under `/Users/brian/dev/github/kontourai/`.
There is **no npm workspace / monorepo root** (no root `package.json`); each is its own
package with its own `node_modules` and lockfile. (Note: sibling packages already use
`file:` dependencies — e.g. kontour-console depends on `"@kontour/console-core":
"file:../console-core"` — so cross-folder `file:` deps work locally without a registry.)

| Product | Path | Package | Render stack | Theme today | Status vocabulary |
|---|---|---|---|---|---|
| **kontour-console** | `kontour-console/console-ui` | `@kontour/console-ui` (private) | **React 19 + Vite** | dark olive/lime | `--good / --warn / --bad` |
| **flow** | `flow/src/console-ui` | `@kontourai/flow` | vanilla TS + DOM | light paper/brown | `--pass / --block / --wait / --current` |
| **survey** | `survey/examples/review-workbench` | `@kontourai/survey` | vanilla TS template strings | dark "forensic" | `--verify / --hold / --reject` |
| **surface** | `surface/docs-site` | `@kontourai/surface` | static HTML + CSS | light/dark auto, serif | `--accent / --accent-2` |

Key facts:
- **Everyone already themes via `:root` CSS custom properties** — a token approach is
  already the de-facto lingua franca. The problem is each invented its own vocabulary.
- **kontour-console is the cleanest React seed.** Its primitives are tiny and purely
  presentational: `Panel` (13 lines), `Badge` (10), `StatusBadge` (5), `Metric` (8),
  `Progress` (4), `Empty` (3), `Rows` (89), `ProcessFlowDiagram` (93). `Badge` already
  maps domain words → a semantic tone scale (`good/bad/warn/neutral`) via regex — this
  is exactly the contract we are formalizing.
- **Two org scopes exist:** `@kontour/*` (console-core and the kontour-console app) and
  `@kontourai/*` (survey, flow, surface). The kit ships as **`@kontourai/console-kit`**
  (owner-confirmed), matching the survey/flow/surface family; the kontour-console app
  takes a cross-scope dependency on it.
- The package lives at the top-level **`console-kit/`** folder (`@kontourai/console-kit`).
  These plan files live in `console-kit/plans/`.

---

## The token contract (`--k-*`) — the heart of the system

This contract is authored in Step 1 and consumed by every later step. All values below
are **starting values**; tune for contrast (target WCAG AA for text on `--k-panel`).

```css
/* tokens.css — base (dark default) */
:root {
  color-scheme: dark;

  /* structure */
  --k-bg: #0a0e13;
  --k-panel: #111824;
  --k-panel-raised: #16202d;
  --k-line: rgba(150, 180, 210, 0.12);
  --k-line-strong: rgba(150, 180, 210, 0.22);
  --k-shadow: 0 26px 60px -42px rgba(0, 0, 0, 0.95);

  /* text */
  --k-text: #eef3f8;
  --k-text-muted: #aebccb;
  --k-text-faint: #6f8095;

  /* brand — the ONE knob each product turns (set by a theme class; fallback here) */
  --k-brand: #5ce0c6;
  --k-brand-contrast: #06080b;   /* readable text/icon color on top of --k-brand */

  /* semantic status scale — unifies the three product vocabularies */
  --k-positive: #34d399;
  --k-caution:  #f3b14b;
  --k-negative: #ff6f6f;
  --k-neutral:  #6f8095;
  --k-active:   #7aa2ff;
  /* soft background companions (use color-mix; provide fallbacks if needed) */
  --k-positive-soft: color-mix(in oklab, var(--k-positive) 14%, transparent);
  --k-caution-soft:  color-mix(in oklab, var(--k-caution)  14%, transparent);
  --k-negative-soft: color-mix(in oklab, var(--k-negative) 14%, transparent);
  --k-active-soft:   color-mix(in oklab, var(--k-active)   14%, transparent);

  /* spacing scale */
  --k-space-1: 4px;  --k-space-2: 8px;  --k-space-3: 12px;
  --k-space-4: 16px; --k-space-5: 24px; --k-space-6: 32px;

  /* radius */
  --k-radius-sm: 9px;  --k-radius-md: 14px;

  /* type scale */
  --k-text-xs: 11px;  --k-text-sm: 12.5px; --k-text-md: 14px;
  --k-text-lg: 18px;  --k-text-xl: 22px;   --k-text-2xl: clamp(26px, 3.4vw, 38px);

  /* font families (shared for family resemblance; a theme MAY override) */
  --k-font-display: "Fraunces", Georgia, "Times New Roman", serif;
  --k-font-ui: "Hanken Grotesk", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --k-font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  /* motion */
  --k-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --k-dur: 0.16s;
}

/* tokens.css — light variant */
[data-theme="light"] {
  color-scheme: light;
  --k-bg: #f5f4ef;
  --k-panel: #ffffff;
  --k-panel-raised: #fbfaf7;
  --k-line: rgba(36, 40, 46, 0.12);
  --k-line-strong: rgba(36, 40, 46, 0.20);
  --k-shadow: 0 18px 50px -30px rgba(0, 0, 0, 0.25);
  --k-text: #202124;
  --k-text-muted: #5b626b;
  --k-text-faint: #8a909a;
  --k-brand-contrast: #ffffff;
  /* status hues stay the same family; darken slightly if AA fails on white */
}
```

```css
/* themes.css — per-product brand (the only meaningful divergence) */
.theme-survey  { --k-brand: #5ce0c6; }                       /* forensic mint */
.theme-console { --k-brand: #c9ff4a; --k-brand-contrast:#11120f; } /* console lime */
.theme-flow    { --k-brand: #2f88a6; }                       /* flow teal */
.theme-surface { --k-brand: #14a37a; }                       /* editorial green (dark-legible) */

/* If a product runs in light mode and its brand fails contrast, a theme may add:
   [data-theme="light"] .theme-surface { --k-brand: #0f6b52; } */
```

### Status-scale mapping (the biggest interoperability win)

Every product's domain status maps onto ONE semantic scale:

| Semantic token | survey | flow | kontour-console |
|---|---|---|---|
| `--k-positive` | verify | pass | good |
| `--k-caution`  | hold | wait | warn |
| `--k-negative` | reject | block | bad |
| `--k-active`   | in-review | current | — |
| `--k-neutral`  | pending | — | dim |

---

## Conventions for all steps

- **Decisions that are the owner's, not yours:** final package name/scope; whether to
  publish to a registry vs keep `file:` deps; dark-vs-light default per product; exact
  brand hex per product. Where a plan says "RECOMMENDED," use that default and note it in
  your handoff; do not block.
- **Do not** change a product's domain logic, data, or server code. This initiative is
  presentation only.
- **Each step ends with a short `HANDOFF.md`** (or a section appended to the step file)
  recording: what you changed, decisions/assumptions made, how you verified, and anything
  the next step depends on.
- **Verify visually** where a UI changed: run the product and screenshot before/after to
  confirm parity. (Vanilla examples load ES modules — serve over HTTP, e.g.
  `python3 -m http.server`; `file://` is blocked by CORS for module scripts.)
