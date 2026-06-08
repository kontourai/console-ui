# Console Kit Consumer Guide

`@kontourai/console-kit` ships three layers:

- CSS tokens: `@kontourai/console-kit/tokens`
- React primitives: `@kontourai/console-kit/react`
- Light-DOM custom elements: `@kontourai/console-kit/elements`

## Theme Boundary

Apply exactly one product theme class on a stable root:

```html
<html class="theme-console">
```

Available product classes:

- `theme-console`
- `theme-flow`
- `theme-survey`
- `theme-surface`

Use `data-theme="light"` on the same root, or an ancestor, when a product needs the light token skin.

## React Consumer

Install locally while unpublished:

```json
{
  "dependencies": {
    "@kontourai/console-kit": "file:../../console-ui"
  }
}
```

Import tokens and primitive styles once:

```ts
import "@kontourai/console-kit/tokens.css";
import "@kontourai/console-kit/themes.css";
import "@kontourai/console-kit/react/styles.css";
```

Use primitives from the React entry:

```tsx
import { Badge, Button, Panel, StatusBadge, Topbar } from "@kontourai/console-kit/react";

export function Header() {
  return (
    <Topbar
      eyebrow="Console"
      title="Run Review"
      body="Package-backed primitives read the active --k-* theme."
      actions={<Button>Refresh</Button>}
    />
  );
}
```

## Custom Elements Consumer

Load CSS and the element module:

```html
<link rel="stylesheet" href="./vendor/console-kit/tokens/index.css">
<link rel="stylesheet" href="./vendor/console-kit/react/styles.css">
<script type="module" src="./vendor/console-kit/dist/elements/elements/src/index.js"></script>
```

Render light-DOM components:

```html
<k-badge value="verified"></k-badge>
<k-status-badge status="connected"></k-status-badge>
<k-button label="Accept" variant="positive"></k-button>
```

Custom elements emit the same class contracts as the React primitives, so the shared `react/styles.css` file styles both renderers.

## Static HTML Consumer

Static sites should not depend on symlinks at runtime. Copy package assets into the served tree during build and run a drift check in verification.

Required assets:

- `tokens/`
- `react/styles.css` if using primitives or custom elements
- `dist/elements/elements/src/` if using custom elements

Rules:

- Do not fork token files without a sync/drift check.
- Keep the product identity in a theme class, not in copied primitive CSS.
- Use `--k-*` tokens for local styles and derive product-specific aliases from `--k-*`.

## Tone Mapping

Product-specific domain words should map to the shared semantic scale:

- `positive`
- `caution`
- `negative`
- `active`
- `neutral`

Examples:

- Survey `verified` -> positive
- Flow `current` -> active
- Review `blocked` -> negative
- Queue `pending` -> caution or neutral, depending on product semantics

## Verification

Package consumers should run their own build/test command plus any asset drift check. The current cross-adopter command matrix lives in `docs/release-readiness.md`.
