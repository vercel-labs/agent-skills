---
name: optimize-turbopack-css
description: Analyze and safely optimize Sass/SCSS and generated CSS when migrating a Next.js 15 or 16 application from webpack to Turbopack. Use when Turbopack increases raw or transferred CSS size, Lightning CSS expands selectors, browser targets change output, global framework or utility styles dominate routes, client barrels or error boundaries preload unrelated CSS, Sass generators create excessive selectors, CSS Modules duplicate emitted styles or inflate HTML with long class names, lowered CSS changes specificity or RTL behavior, or the user asks to plan or execute a full SCSS size-reduction program with measurement and regression safeguards.
---

# Optimize Turbopack CSS

Diagnose the actual source of a CSS size change, then optimize the Sass source and stylesheet boundaries in measured, reversible phases. Support analysis-only requests and full implementation requests.

Resolve bundled scripts and references relative to this loaded `SKILL.md`. Never assume the skill was installed under a particular global or project-level directory.

## Load references

Read [references/nextjs-version-matrix.md](references/nextjs-version-matrix.md) before choosing build commands or configuration.

Read [references/optimization-patterns.md](references/optimization-patterns.md) before editing Sass generators, utilities, framework entries, or global stylesheet boundaries.

Read [references/validation.md](references/validation.md) when executing changes or defining completion criteria.

Read [references/runtime-delivery.md](references/runtime-delivery.md) before attributing CSS to routes, diagnosing client barrels or error boundaries, comparing manifest output with browser requests, measuring authenticated routes in a browser, or inspecting inlined CSS and chunking decisions.

## Respect scope

Determine whether the user asked for analysis, a plan, or execution.

- For analysis, inspect and measure without editing source files.
- For planning, return prioritized phases with evidence, expected impact, risks, and acceptance criteria.
- For execution, implement one optimization class at a time, verify it, and preserve unrelated worktree changes.
- Never weaken the supported-browser contract without explicit authorization. A newer Browserslist is an optimization only when product support permits it.
- Never purge selectors until class names that the app builds at runtime or receives from outside the repository, such as CMS content, translations, or third-party code, have been inventoried.

## 1. Discover the project

Locate the package containing `next`, then inspect:

- Installed Next.js and Sass versions.
- Package manager, workspace layout, and build orchestration.
- `next.config.*`, especially `turbopack`, `webpack`, `sassOptions`, `cssChunking`, `inlineCss`, and Lightning CSS options such as `lightningCssFeatures`.
- `package.json`, `.browserslistrc`, the `BROWSERSLIST` and `BROWSERSLIST_CONFIG` environment variables, PostCSS configuration, and build scripts.
- Tailwind CSS or packages that ship CSS already processed by Lightning CSS.
- Root layouts and every global CSS/SCSS import.
- SCSS entry points, CSS Modules, shared partials, framework entries, utility generators, and package aliases.
- Existing dirty changes. Preserve them and avoid rewriting overlapping files unnecessarily.

Record which of these traits the app has. Later checks for a trait apply only when the app has it:

- Multiple locales, locale-specific typography, or right-to-left (RTL) documents.
- HTML or class names from outside the repository, such as CMS content, remote templates, or third-party embeds.
- A CSS framework such as Bootstrap, or an in-house utility library.
- Web components or other side-effect client registration.
- Print, email, or PDF output that shares stylesheets.
- Themes such as dark or high-contrast modes.

Classify each stylesheet as one of:

1. Universal global CSS.
2. Route- or layout-scoped global CSS.
3. CSS Module output.
4. Token-only Sass dependency.
5. Selector-emitting shared Sass dependency.
6. Runtime/CMS/third-party compatibility CSS.

## 2. Establish comparable baselines

Use the commands from the version matrix. Build webpack and Turbopack from the same source revision, environment, browser targets, and production mode.

Delete the generated Next.js output between cold comparisons. Only delete generated directories that are safe and in scope. Copy each complete output, including `static/` and `server/app/`, to a temporary directory outside the repository before starting the next build.

Record at least:

- Raw, gzip, and Brotli bytes for every CSS asset.
- Aggregate build CSS, while labeling it as an inventory rather than a route payload.
- Manifest-attributed CSS for representative routes, split into applied and error-boundary preload sets.
- Applied stylesheet URLs from the rendered document.
- Actual browser CSS requests, including transient preloads, with decoded, encoded, and transferred bytes.
- Largest global and route-specific assets.
- Selector count and selector characters.
- Counts of `:lang(`, `:dir(`, `:is(`, `:-webkit-any(`, and `:-moz-any(`.
- Logical-property occurrences.
- Color-lowering markers: `--lightningcss-light`, `--lightningcss-dark`, and `lab(`.
- CSS Modules class-name occurrences and the bytes they add over webpack's naming, in CSS and in prerendered HTML and RSC.
- Exact duplicate assets and repeated selectors.

Run the bundled analyzer after each build:

```bash
SKILL_DIR="<directory containing the loaded SKILL.md>"
bash "$SKILL_DIR/scripts/audit-css.sh" \
  --next-build turbo=/tmp/next-turbo \
  --next-build webpack=/tmp/next-webpack \
  --scss ./app \
  --scss ./components \
  --json /tmp/css-audit.json
```

Use route manifests for static attribution across every built route, including routes behind sign-in, and cold browser navigations for network truth on a representative sample. Load a saved test-account session for authenticated routes. Deduplicate stylesheet URLs. Do not infer a network payload from aggregate `.next/static` size, manifest entries, initial HTML, or the final `<head>` alone. Do not compare bundlers with the `next build` size table; Next.js 16 removed its per-route size and First Load JS columns because they misattributed CSS chunks.

## 3. Isolate the root cause

Apply this decision order.

### A. Browser-target selector expansion

Suspect Lightning CSS lowering when raw CSS grows far more than compressed CSS and generated selectors contain large `:lang()`, `:dir()`, `:is()`, `:-webkit-any()`, or `:-moz-any()` structures. Also count color-lowering markers (`--lightningcss-light`, `--lightningcss-dark`, `lab(`). `oklch()` and `lab()` fallbacks can grow gzip faster than raw bytes, so do not require a raw-versus-gzip gap before suspecting lowering. When the gap appears without transform markers, rule out CSS Modules class-name overhead (H) first.

Run a temporary build with the `BROWSERSLIST` environment variable set; Next.js reads it before any config file. Do not edit source yet. If output returns near webpack size, identify the browser-support policy as the deciding constraint.

On Next.js 15, check the patch: Turbopack applied no CSS targets through 15.4.0, and the old default targets apply from 15.4.1. On Next.js 16, account for its newer baseline, which still lowers authored `:dir()`, `light-dark()`, `oklch()`, and `:has()` selector lists. Treat `useLightningcss: false` as ineffective under Turbopack.

Check for CSS already processed by Lightning CSS upstream, such as Tailwind CSS v4 output or pre-built package CSS. Turbopack lowers it again with the app's targets.

### B. Sass generator multiplication

Search for `@each`, `@for`, `@while`, nested breakpoint loops, palette loops, side/axis loops, locale loops, and print duplication. Calculate the Cartesian product rather than judging the source file by its byte size.

Compile suspicious entries independently in compressed mode and rank their emitted raw/gzip size. Identify combinations not used by source or runtime content.

### C. Selector-emitting shared partials

Compile widely imported partials independently. Require variables, functions, mixins, maps, and tokens to emit zero CSS.

Remember that Sass `@use` caches a module only within one compilation. A selector-emitting partial used by many independent CSS Module entries repeats its CSS in every entry. Selectors in `sassOptions.additionalData` repeat the same way.

Expect this duplication to surface after migration. Webpack's whole-file cssnano pass can remove exact duplicate unhashed rules across modules in one file, while Turbopack minifies each module separately and concatenates the results.

### D. Global framework and utility surface

Measure framework, design-system, theme, reset, utility, and external-content compatibility imports independently. Check for overlapping systems such as multiple spacing, color, typography, border, display, or grid utility families.

Use import ablation builds to determine contribution. Do not describe a curated framework entry as a full framework until its imports have been inspected.

### E. Chunking or route scope

Compare CSS links in rendered routes. Confirm whether the increase is universal, route-specific, or only an aggregate chunk inventory difference.

Do not use `cssChunking` as a selector-size fix. Turbopack ignores it through Next.js 16.2; from 16.3 it accepts only `true` or `'graph'`, and `'graph'` trades CSS bytes per route against request count. Change stylesheet boundaries only when route ownership is clear and ordering has been tested.

If `experimental.inlineCss` is enabled, inspect prerendered HTML for repeated copies of the same stylesheet.

### F. Post-processing

Test a post-minifier only after structural causes are understood. Minifiers rarely undo selector multiplication or generated utility matrices.

### G. Shared client dependency graphs

Inspect root error boundaries, universal client providers, side-effect web-component registration, and component barrels. Turbopack may preload CSS reachable through these graphs even when the corresponding component does not render on the successful route.

Global-error, not-found, error, and loading CSS attach to successful routes under webpack too, `<Link>` prefetching preloads target-route CSS, and nested `next/dynamic` CSS can arrive after hydration. Measure these as delivery behavior before calling them Turbopack regressions.

Scope side effects to the nearest owning layout. Keep last-resort fallbacks lightweight. Do not assume a direct leaf import is behavior-equivalent to a barrel re-export; verify client boundaries, DOM semantics, accessibility roles, and existing component tests.

### H. CSS Modules class-name overhead

Turbopack releases through Next.js 16.3.x name CSS Modules classes `[name]__[hash]__[local]`, and `.module.scss` files add a doubled `-module-scss-module` segment, about twice the length of webpack names. The overhead repeats in CSS, HTML `class` attributes, the RSC payload, and JavaScript class maps, and it compresses well, so it mimics selector lowering without transform markers.

Measure class-name occurrences and the bytes they add over webpack's naming with the analyzer. Prefer upgrading to a release with short names (16.4.0-canary.10 and later) over renaming classes or post-processing generated output.

## 4. Build a safe usage inventory

Collect class usage from:

- Static JSX/TSX/HTML and template strings.
- Class composition helpers and dynamically generated names.
- Tests, stories, templates, and server-rendered fragments.
- Content from outside the repository, such as CMS entries, remote HTML, translations, and third-party embeds, for every content variant the app serves.
- Browser CSS coverage over representative authenticated and anonymous routes.

Create an explicit safelist for runtime-only classes. Record the source and owner of each pattern. Coverage reflects only the routes, sessions, and interactions exercised, so treat it as supporting evidence, not proof that a selector is unused.

## 5. Prioritize work by reach and emitted size

Rank each candidate by how many routes load it and how much CSS it emits, and skip categories that don't apply to the app. A typical order is:

1. Universally loaded Cartesian Sass generators.
2. Selectors repeated for each locale, direction, theme, or print mode.
3. Overlapping global utility systems.
4. Oversized framework utility maps and global component layers.
5. Selector-emitting shared partials.
6. Global CSS that can move to a route or layout boundary.
7. Large route-scoped CSS Modules and unused module exports.

Prefer reducing generated selectors at the Sass source over adding another minification or purge stage.

## 6. Execute in reversible phases

For each optimization:

1. Capture the relevant baseline.
2. Add or update safelist and regression fixtures.
3. Make the smallest coherent source change.
4. Run the production Turbopack build.
5. Recalculate the same route and asset metrics.
6. Run the validation matrix.
7. Report measured impact and remaining risk before continuing.

Use explicit allowlists for utility generators. Where styles vary by locale, direction, or theme, centralize the variation in inherited CSS variables. Consolidate overlapping utility families. Keep tokens separate from selector-emitting entries. When lowering is required, reduce the rules and selectors that carry one-sided logical declarations. Route-scope CSS only when the route graph supports it.

Avoid combining browser-target changes, Sass-generator refactors, and stylesheet-boundary changes in one measurement. Separate variables so each result is attributable and reversible.

## 7. Validate and enforce budgets

Validate production builds, representative routes, supported viewports, CSS ordering, specificity-sensitive utility combinations, error fallbacks, and applied-versus-requested browser CSS. Add locale, RTL, external-content, print, and theme coverage for the traits recorded in step 1. Use the detailed matrix in the validation reference.

Introduce CI budgets after the optimized baseline stabilizes. Track both global assets and route payloads. Require an intentional budget update for regressions.

## 8. Report results

Lead with the root cause and measured outcome. Include:

- Next.js version and applicable caveats.
- Webpack and Turbopack commands used.
- Browser targets and their Browserslist source.
- Before/after route and asset table.
- Source files and generators responsible.
- Changes implemented or proposed in priority order.
- App traits recorded in step 1, and checks skipped because a trait is absent.
- Compatibility and ordering risks, plus locale, RTL, external-content, print, and theme risks for the traits the app has.
- Routes, sessions, and interactions the browser measurements covered, and any they could not reach.
- Verification performed and remaining follow-up.

Distinguish raw bytes, encoded response bytes, transferred bytes, aggregate build inventory, manifest attribution, applied stylesheets, and actual browser requests throughout.
