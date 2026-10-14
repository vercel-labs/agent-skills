# Validation and rollout matrix

Use this matrix for executed optimizations. Tailor it to the product's supported routes and browsers, and include locale, RTL, external-content, print, and theme checks only for traits the app has.

## Build validation

- Run the production Turbopack build for the installed Next.js version.
- Run the webpack control when compatibility with the pre-migration output matters.
- Delete generated output between cold comparisons.
- Confirm type checking, Sass compilation, PostCSS, and route generation succeed.
- Confirm no unsupported webpack configuration was silently assumed to apply to Turbopack.
- Record the Browserslist source (environment variable, config file, or Next.js default) and the environment section the build used.
- On Next.js 16.3 and later, confirm `cssChunking` is `true` or `'graph'`; other values fail Turbopack builds.
- Repeat the final clean build when Turbopack repartitions chunks unexpectedly;
  verify stable totals before committing exact budgets.

## CSS measurements

For every representative route, capture:

- Unique stylesheet URLs.
- Request count.
- Raw, gzip, and Brotli bytes.
- Largest global and route-owned asset.
- Selector count and selector characters.
- Lightning CSS transform markers.
- Color-lowering markers (`--lightningcss-light`, `--lightningcss-dark`, and `lab(`).
- CSS Modules class-name occurrences and the bytes they add over webpack's naming, in CSS and in prerendered HTML and RSC.
- Exact duplicate assets.
- Manifest-attributed applied, error-boundary preload, and inlined CSS.
- Browser-applied stylesheet URLs versus every requested CSS resource.
- Decoded body, encoded body, and transferred bytes for a cold navigation.

Compare the same routes, browser targets, environment, and compression settings.
Treat asset count as a graph diagnostic rather than a success metric because
chunk repartitioning can increase count while reducing route bytes.

## Visual coverage

Cover at least:

- Small mobile, large mobile, tablet, desktop, and wide desktop.
- Every custom Sass breakpoint.
- LTR and RTL documents when the app supports RTL.
- Every supported locale with a special font, line height, weight, or glyph requirement.
- Print preview and generated PDF/email output when styles are shared.
- Light/dark/high-contrast themes when supported.
- Loading, error, disabled, focus, hover, selected, and expanded states.
- Specificity-sensitive utility combinations, such as a base spacing utility overridden at a breakpoint, because lowered selectors gain specificity.

For logical utilities, assert computed physical values after changing the same
document from LTR to RTL. Class presence or compiled property names alone do not
catch a framework utility that still emits physical left/right properties.

Prefer screenshot diffing for stable routes. Review cascade and stylesheet ordering separately because a small diff may be an ordering regression rather than a missing selector.

## Runtime content coverage

- Snapshot representative CMS and remote HTML for each content variant the app
  serves, such as regions, tenants, or brands.
- Exercise dynamically constructed utility classes.
- Test authenticated and anonymous route variants, with a saved test-account
  session for each role that changes the rendered UI.
- Test feature-flagged components and lazy-loaded boundaries.
- Confirm third-party widgets and web components retain compatibility styles.
- When `experimental.inlineCss` is enabled, confirm each prerendered page embeds each stylesheet once.
- Force the root error boundary and verify its content, accessibility, and CSS
  dependency set.
- Check that lightweight routes, such as embeds or framework-only pages, don't
  inherit app-wide providers or component registration.
- Treat browser CSS coverage as evidence only; do not use it as the sole deletion criterion.

## Sass contract tests

- Compile token-only partials and assert zero emitted CSS.
- Snapshot selectors from allowlisted utility generators.
- Assert removed Cartesian combinations stay absent.
- Assert selectors required by runtime or external content remain.
- When styles vary by locale or direction, assert the variables resolve for every supported case.
- Compare selector-to-declaration maps when grouping locale selectors.
- Snapshot lowered output for representative logical-property rules at the production targets, and assert that no rule from a split selector list is dropped. Open Lightning CSS issues report dropped rules.
- Enforce maximum compiled byte sizes for the largest generators.
- Guard source boundaries that must remain token-only or dependency-light.

## Rollout sequence

Use small, reversible changes:

1. Measurement tooling and safelist.
2. Browser-target correction, only if authorized.
3. Sass generator reduction, starting with the generators that emit the most
   CSS on the most routes.
4. Framework utility-map and overlapping utility-system reduction.
5. Global-to-route scoping.
6. Root error, client barrel, and side-effect graph isolation.
7. CSS Module cleanup.
8. CI budget enforcement.

Rebuild and remeasure after every step. Avoid batching unrelated phases.

## Acceptance criteria

Define project-specific numbers before implementation. A complete optimization normally requires:

- The agreed raw and transferred CSS reduction is met on representative routes.
- No route exceeds its CSS budget without an approved change.
- Browser-support policy is unchanged or explicitly updated.
- No unexplained visual diffs remain.
- Manifest-attributed and browser-requested CSS differences are explained and
  any residual transient preloads are recorded.
- Coverage passes for every trait the app has, such as external content, RTL,
  locales, print, themes, and third-party widgets.
- Production Turbopack build succeeds.
- Webpack fallback remains documented for Next.js 15 when required.
- Changes are divided into commits or PRs that can be reverted independently.

## Final report

Provide:

- Root cause with evidence.
- Next.js version and caveats.
- Before/after route table.
- Source changes by phase.
- Browser targets, their Browserslist source, and Lightning CSS configuration.
- Validation performed.
- Generated inventory, manifest attribution, applied CSS, and browser requests
  reported as separate measurement planes.
- Routes, sessions, and interactions covered by browser measurements, and any
  they could not reach.
- Known gaps, safelist ownership, and remaining opportunities.
