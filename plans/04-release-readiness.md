# Step 4: Release Readiness + Documentation Hardening

## Intent

Step 4 makes `@kontourai/console-kit` reviewable as a package boundary. It does not expand the component set.

The goal is to keep the token, React, and custom-element contracts stable across current adopters while making release checks and consumer docs explicit enough for a future registry or workspace distribution decision.

## Scope

- Add release/readiness checks to `console-ui`.
- Document package consumption for tokens, React, custom elements, static HTML, and vendored assets.
- Add one canonical gallery that renders React and custom-element parity together.
- Keep adopter contract checks visible for:
  - `kontour-console/console-ui`
  - `flow`
  - `survey`
  - `surface`

## Known Release Blocker

Survey token adoption is a known release blocker. The current Survey worktree keeps its review workbench validator and local stylesheet, but the vendored Console Kit token sync path is not stable in the filesystem during this pass. Do not declare a full cross-adopter release until Survey has a committed, drift-checked token consumption path.

## Out of Scope

- New primitives.
- Registry publish automation.
- Runtime logic changes in adopters.
- Re-theming existing products beyond maintaining their current Console Kit contract.

## Package Policy

The package name is `@kontourai/console-kit`.

Current local adopters may use `file:` dependencies while the package is unpublished. Static sites may vendor built CSS assets during their build so deployed HTML does not depend on symlinks or a bundler.

Before registry publishing, decide:

- license value
- versioning policy
- whether React remains a peer dependency
- whether package docs are shipped in `files`

## Acceptance Criteria

- `console-ui/package.json` has `check:readiness`, `check:pack`, and `verify`.
- `npm run verify` passes from `console-ui`.
- `npm pack --dry-run` includes package docs, tokens, React styles, elements, and dist output.
- `docs/consumer-guide.md` documents React, custom elements, static HTML, theme classes, and vendored asset sync.
- `docs/release-readiness.md` documents cross-adopter verification commands.
- `docs/gallery.html` renders shared tokens, React styles, custom elements, React `Badge`, all product theme classes, and semantic tone states.
- The readiness script confirms no legacy package-scope spelling appears in the checked contracts.
- The readiness script confirms adopter package/theme/sync markers for Kontour Console, Flow, and Surface.
- The readiness script confirms Survey still has its review workbench validator and that this plan documents the Survey token adoption blocker.

## Verification Commands

From `console-ui`:

```sh
npm install
npm run verify
```

From adopters:

```sh
cd ../kontour-console/console-ui
npm install
npm run typecheck
npm run test
npm run build
```

```sh
cd ../flow
npm install
npm run check:console-kit-assets
npm run typecheck
npm run typecheck:console-ui
npm run test
```

```sh
cd ../survey
npm install
npm run check:review-workbench
npm run verify
```

Survey token adoption is a known release blocker; `npm run verify` does not yet prove Console Kit token consumption there.

```sh
cd ../surface
npm install
npm run docs:build
npm run check:console-kit-assets
npm run verify
```

Browser evidence:

- Serve `console-ui` over HTTP after `npm run build`.
- Capture `docs/gallery.html` at 1440x1200.
- Confirm light/dark or theme switching remains coherent for the gallery and representative adopter screens.
