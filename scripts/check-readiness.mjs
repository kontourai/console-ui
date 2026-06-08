import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(root, "..");
const pkg = readJson(path.join(root, "package.json"));

assert.equal(pkg.name, "@kontourai/console-kit", "Package name must stay @kontourai/console-kit.");
assertNoLegacyScope(JSON.stringify(pkg), "console-ui/package.json");
assert.equal(pkg.private, false, "Package should remain publishable when release policy changes.");
assertIncludes(pkg.files, "tokens/", "Package files must include tokens.");
assertIncludes(pkg.files, "react/styles.css", "Package files must include React styles.");
assertIncludes(pkg.files, "elements/", "Package files must include element source/demo assets.");
assertIncludes(pkg.files, "docs/", "Package files must include consumer docs.");

for (const file of [
  "README.md",
  "docs/consumer-guide.md",
  "docs/release-readiness.md",
  "docs/gallery.html",
  "docs/adr/0001-console-kit-token-contract.md",
  "plans/04-release-readiness.md",
  "plans/HANDOFF-step1.md",
  "plans/HANDOFF-step2.md",
  "plans/HANDOFF-step3.md",
  "plans/HANDOFF-package-hardening.md",
  "plans/HANDOFF-surface-adoption.md",
]) {
  assertFile(path.join(root, file), `Missing readiness artifact: ${file}`);
}

const readme = read(path.join(root, "README.md"));
for (const expected of [
  "@kontourai/console-kit/tokens",
  "@kontourai/console-kit/react",
  "@kontourai/console-kit/elements",
  "theme-console",
  "theme-flow",
  "theme-survey",
  "theme-surface",
  "npm run verify",
]) {
  assertContains(readme, expected, `README must document ${expected}.`);
}
assertNoLegacyScope(readme, "README.md");

const gallery = read(path.join(root, "docs/gallery.html"));
for (const expected of [
  "../tokens/index.css",
  "../react/styles.css",
  "../dist/elements/elements/src/index.js",
  "../dist/react/Badge.js",
  "theme-console",
  "theme-flow",
  "theme-survey",
  "theme-surface",
  "k-badge",
  "k-topbar",
  "react-badge-mount",
]) {
  assertContains(gallery, expected, `Gallery must include ${expected}.`);
}

assertAdopterContracts();
console.log("Console Kit release readiness check passed.");

function assertAdopterContracts() {
  const consolePkg = readJson(path.join(workspace, "kontour-console/console-ui/package.json"));
  assert.equal(consolePkg.dependencies?.["@kontourai/console-kit"], "file:../../console-ui");
  assertContains(read(path.join(workspace, "kontour-console/console-ui/index.html")), "class=\"theme-console\"");
  assertContains(read(path.join(workspace, "kontour-console/console-ui/src/main.tsx")), "@kontourai/console-kit/react/styles.css");

  const flowPkg = readJson(path.join(workspace, "flow/package.json"));
  assert.equal(flowPkg.devDependencies?.["@kontourai/console-kit"], "file:../console-ui");
  assertContains(JSON.stringify(flowPkg.scripts), "check:console-kit-assets");
  assertContains(read(path.join(workspace, "flow/src/console-ui/index.html")), "class=\"theme-flow\" data-theme=\"light\"");
  assertFile(path.join(workspace, "flow/scripts/sync-console-kit-assets.mjs"), "Flow must keep a Console Kit asset sync script.");

  const surveyPkg = readJson(path.join(workspace, "survey/package.json"));
  assertContains(JSON.stringify(surveyPkg.scripts), "check:review-workbench", "Survey must keep its review workbench validator.");
  assertContains(read(path.join(workspace, "survey/examples/review-workbench/index.html")), "review-workbench.css", "Survey review workbench must keep its local stylesheet until token adoption is restored.");
  assertContains(read(path.join(root, "plans/04-release-readiness.md")), "Survey token adoption is a known release blocker", "Step 4 plan must document the Survey token adoption blocker.");
  assertContains(read(path.join(root, "docs/release-readiness.md")), "Survey token adoption is a known release blocker", "Release readiness docs must document the Survey token adoption blocker.");

  const surfacePkg = readJson(path.join(workspace, "surface/package.json"));
  assertContains(JSON.stringify(surfacePkg.scripts), "check:console-kit-assets");
  assertContains(read(path.join(workspace, "surface/scripts/build-pages-site.mjs")), "class=\"theme-surface\"");
  assertContains(read(path.join(workspace, "surface/scripts/sync-console-kit-assets.mjs")), "@kontourai/console-kit");
}

function readJson(file) {
  return JSON.parse(read(file));
}

function read(file) {
  return readFileSync(file, "utf8");
}

function assertFile(file, message) {
  if (!existsSync(file)) throw new Error(message);
}

function assertContains(content, expected, message) {
  if (!content.includes(expected)) throw new Error(message);
}

function assertIncludes(values, expected, message) {
  if (!Array.isArray(values) || !values.includes(expected)) throw new Error(message);
}

function assertNoLegacyScope(content, label) {
  if (content.includes("@kontour/console-kit")) {
    throw new Error(`${label} must not reference @kontour/console-kit.`);
  }
}
