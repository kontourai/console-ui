# @kontourai/console-kit

Kontour Console Kit is the shared presentation layer for Kontour console products. It ships framework-agnostic tokens plus class-driven React primitives that read the `--k-*` token contract.

## Layers

- `@kontourai/console-kit/tokens` exposes CSS custom properties for any renderer.
- `@kontourai/console-kit/react` exposes class-driven React primitives.
- `@kontourai/console-kit/elements` exposes light-DOM web-component wrappers for vanilla products.

Package docs:

- `docs/consumer-guide.md` covers React, custom elements, static HTML, theme classes, and vendored asset sync.
- `docs/release-readiness.md` records the release and adopter verification matrix.
- `docs/gallery.html` is the canonical static gallery for React/custom-element parity.

## Consuming Tokens

Import the full token layer:

```css
@import "@kontourai/console-kit/tokens";
```

Or import individual files:

```css
@import "@kontourai/console-kit/fonts.css";
@import "@kontourai/console-kit/tokens.css";
@import "@kontourai/console-kit/themes.css";
```

Apply one product theme class on a stable root element:

```html
<main class="theme-survey">...</main>
```

Available themes are `theme-console`, `theme-flow`, `theme-survey`, and `theme-surface`.

React consumers should import the primitive styles once:

```ts
import "@kontourai/console-kit/react/styles.css";
```

React primitives are exported from:

```ts
import { Badge, Button, Panel, StatusBadge, Topbar } from "@kontourai/console-kit/react";
```

Vanilla consumers should load the element module:

```html
<script type="module" src="./vendor/console-kit/dist/elements/elements/src/index.js"></script>
```

Then render the light-DOM custom elements:

```html
<k-badge value="verified"></k-badge>
<k-status-badge status="connected"></k-status-badge>
<k-button label="Accept" variant="positive"></k-button>
```

For static HTML consoles served without a bundler, add a local package dependency and copy the package CSS assets into the product's served asset tree during build or setup:

```json
{
  "devDependencies": {
    "@kontourai/console-kit": "file:../console-ui"
  }
}
```

```html
<link rel="stylesheet" href="./vendor/console-kit/tokens/index.css">
<link rel="stylesheet" href="./vendor/console-kit/react/styles.css">
```

Products should style components with `--k-*` variables and treat the product theme class as the product identity boundary. Domain status words map to the shared semantic scale: positive, caution, negative, active, and neutral.

## Checks

- `npm run check:tokens` verifies the token/theme contract and keeps React styles token-only.
- `npm run check:exports` builds and verifies package export targets, ESM output, declaration files, package naming, and framework-free element output.
- `npm run check:readiness` verifies release docs, gallery, package metadata, and adopter contract markers.
- `npm run check:pack` previews package contents with `npm pack --dry-run`.
- `npm run verify` runs all package readiness checks.
