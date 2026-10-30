# SCSS optimization patterns

Apply these patterns only after measuring emitted CSS and inventorying runtime class usage.

## Replace Cartesian utility generation with allowlists

Avoid multiplying every breakpoint, value, side, state, color, locale, and print mode.

Before:

```scss
@each $breakpoint in $breakpoints {
  @each $color, $value in $colors {
    @each $side in $sides {
      // Emits every possible combination.
    }
  }
}
```

After:

```scss
$enabled-border-widths: 0, 1, 2, 4;
$enabled-border-colors: subtle, strong;
$enabled-border-sides: all, bottom, inline-start;
$enabled-responsive-borders: (
  (
    breakpoint: md,
    side: bottom,
    width: 1
  )
);
```

Generate base utilities from the small lists and responsive utilities from explicit tuples. Move rare combinations into the owning CSS Module.

Add a Sass snapshot test for the emitted selector set. Require a safelist change before adding a new combination.

## Centralize language and direction behavior

Apply this when the app varies typography or spacing by locale or direction. Do not repeat every locale selector inside every font-size, heading, button, and print utility.

Before:

```scss
.text-14 {
  font-size: 14px;

  @each $language, $font in $languages {
    &:lang(#{$language}) {
      font-family: $font;
    }
  }
}
```

After:

```scss
html:lang(ja) {
  --app-font: 'Noto Sans JP';
}
html:lang(ar) {
  --app-font: 'Noto Sans Arabic';
  --app-text-line-height: 1.6;
}

body {
  font-family: var(--app-font, sans-serif);
  line-height: var(--app-text-line-height, normal);
}

.text-14 {
  font-size: 14px;
}
```

Preserve locale-specific weight and line-height behavior. Verify every supported locale, plus RTL and print output when the app supports them.

## Group locale selectors by declaration signature

When inherited variables cannot replace per-component overrides, group locales
that emit the same declarations. Use the complete declaration signature as the
grouping key, not only the font family. For example, `(font, weight,
line-height)` keeps tall-script behavior attached to the right font group and
avoids emitting a second overlapping rule.

Compile the entry before and after the refactor. Compare the selector-to-
declaration mapping so grouping does not silently change specificity, weight,
or line height.

## Reduce rules that carry lowered declarations

When the support contract requires lowering logical properties, the cost scales
with the rules and selectors that contain one-sided inline declarations. Each
affected rule becomes six rules per selector in its list, while declarations in
the same rule share one expansion.

- Use symmetric shorthands such as `padding-inline: 1rem` when both sides match;
  they lower to physical properties without direction rules.
- Avoid long selector lists on rules with one-sided logical declarations.
- Merge one-sided declarations that target the same selector into one rule.
- Prefer inherited direction variables where they preserve behavior.

Compile the affected entries at the production targets before and after the
change, and compare rule counts as well as bytes.

## Keep token partials pure

Separate symbols from emitted CSS:

```text
styles/
  _tokens.scss       # variables, maps, functions; emits zero CSS
  _mixins.scss       # mixins only; emits zero CSS
  utilities.scss     # explicit selector-emitting entry
  global.scss        # universal selector-emitting entry
```

Compile token partials in tests and assert empty output. Never import a full component or framework entry merely to access a color or breakpoint variable.

`@use` prevents duplicate evaluation within one Sass compilation. It does not deduplicate selector-emitting partials across independent CSS Module entries.

## Consolidate overlapping utility systems

Inventory class families by property, not package name:

| Property family | Examples                                                            |
| --------------- | ------------------------------------------------------------------- |
| Spacing         | Framework utilities, design-system spacing, custom spacing          |
| Typography      | Framework headings, design-system typography, custom font utilities |
| Borders/colors  | Framework utilities, palette loops, semantic tokens                 |
| Layout          | Grid, display, flex, width, visibility                              |

Choose one canonical family per use case. Retain compatibility aliases only for observed source or runtime content. Remove invalid generated declarations such as negative padding.

Configure a framework utility API instead of generating an overlapping custom copy when possible.

Before replacing a custom utility family with a framework's, inspect what the
framework actually emits. For example, Bootstrap's start and end utilities use
physical left and right properties and assume a separate RTLCSS build, so an
app that switches `dir` at runtime with one stylesheet must remap them to
logical properties:

```scss
@use 'sass:map';

$utilities: map.set(
  $utilities,
  'margin-start',
  map.set(map.get($utilities, 'margin-start'), 'property', margin-inline-start)
);
```

Apply the same remap to margin-end and padding start and end before Bootstrap's
utility API emits classes, and verify physical computed values in both LTR and
RTL. Keep custom utilities the framework doesn't generate, such as negative
logical margins.

## Curate CSS framework entries

Inspect the actual Sass entry before describing it as the full framework. Measure each import independently.

Retain required configuration dependencies in their documented order, then include only required layout, component, helper, and utility entries. Restrict the framework's utility configuration, such as Bootstrap's `$utilities` map, and its responsive variants using the class inventory.

Verify dynamic framework classes from external content or third-party components before removal.

## Separate universal and route-owned CSS

Keep resets, universal tokens, and truly shared compatibility rules global. Move feature- or route-owned CSS to the nearest Next.js layout or component boundary.

Measure rendered routes after moving CSS. Confirm:

- CSS request count does not grow excessively.
- Import order and cascade remain stable.
- Server-rendered HTML includes required styles without flash of unstyled content.
- Shared layouts do not reintroduce the CSS universally.

Do not move small route-scoped CSS into a large global utility sheet merely to deduplicate aggregate build inventory.

## Isolate shared client graphs

Audit CSS reachability through JavaScript as well as Sass imports. Root client
providers, error boundaries, component barrels, and side-effect web-component
registration can make unrelated CSS available to every route.

- Keep last-resort error UI self-contained and dependency-light.
- Move component registration to the nearest owning layout.
- Split a barrel by stable component category or client boundary when needed.
- Do not bypass a barrel with a leaf import until tests confirm the export is
  behaviorally identical. Re-export layers can affect client boundaries,
  wrappers, DOM roles, or package resolution.

Measure manifest attribution, client JavaScript, and browser CSS requests after
each graph change. Next.js 16 removed First Load JS from `next build` output, so
use `next experimental-analyze` (16.1+) or a bundle analyzer for the JavaScript
plane. Improvements on one plane do not guarantee improvements on all three.

## Protect runtime and external content

Collect classes from every source the app renders outside its own components, such as CMS records, remote HTML, templates, translations, emails, and feature flags. Maintain a reviewed safelist with source, owner, and expiration criteria.

Do not use blanket PurgeCSS against an application that renders remote or dynamically constructed class names. If a purge stage is explicitly authorized, run it only with a tested extractor and safelist, and compare rendered content across representative content variants.

## Optimize CSS Modules after global CSS

Rank modules by compiled bytes and selector count. Inspect:

- Unreferenced exported class names.
- `@extend` selector multiplication.
- Broad `:global()` selectors.
- Local Sass loops.
- Selector-emitting shared imports.
- Large component variants that can be split by route or feature.

Accept some duplication across mutually exclusive routes when globalizing the declarations would increase every route's payload.

## Account for CSS Modules class-name overhead

Turbopack releases through Next.js 16.3.x emit long CSS Modules class names
(`[name]__[hash]__[local]`), and `.module.scss` files add a doubled
`-module-scss-module` segment. The overhead repeats in CSS, HTML `class`
attributes, the RSC payload, and JavaScript class maps, and compresses well.

Measure it with the analyzer's class-name metrics before attributing
raw-versus-compressed growth to selector lowering. Prefer upgrading to a release
that ships short names (16.4.0-canary.10 and later) over renaming classes or
post-processing generated output. Modules that use no Sass features avoid the
doubled segment as `.module.css`.

## Identify upstream component-style floors

Third-party design-system components can each bundle resets, visibility helpers,
or base typography. Application Sass cannot safely consolidate those rules when
the package depends on component isolation or CSS order. Quantify the repeated
payload, verify ownership, and propose an upstream package change instead of
patching generated assets or deleting package CSS locally.

Package CSS that was already processed by Lightning CSS, including Tailwind CSS
v4 output, is lowered again by Turbopack with the app's targets. Compare the
package's shipped CSS with the app's emitted CSS before attributing duplicated
declarations to application Sass.

## Avoid false fixes

- Do not expect `useLightningcss: false` to disable Lightning CSS in Turbopack.
- Do not change `cssChunking` to fix selector expansion. Turbopack ignores it
  through Next.js 16.2 and accepts only `true` or `'graph'` from 16.3.
- Do not exclude `logical-properties` without `dir-selector` when source
  contains `:dir()`.
- Do not compare bundlers with the `next build` size table.
- Do not attribute raw-versus-compressed growth to lowering before checking
  CSS Modules class-name overhead.
- Do not add cssnano solely to undo a generated selector matrix.
- Do not compare aggregate `.next/static` bytes as if every route downloads them.
- Do not change Browserslist without confirming the support contract.
- Do not combine several optimization variables in one experiment.
- Do not treat a lower manifest total as proof that browser CSS requests fell.
- Do not treat a direct package leaf import as semantically equivalent without
  component and accessibility tests.

## Define budgets

Track:

- Largest universal CSS asset.
- CSS linked by each representative route.
- Raw, gzip, and Brotli route payload.
- CSS request count.
- Selector characters, transform-marker counts, and color-lowering markers.
- CSS Modules class-name occurrences and bytes over webpack's naming.
- Largest Sass generators and CSS Modules.
- Common applied CSS and error-boundary preload CSS separately.
- Cold-browser requested, decoded, encoded, and transferred CSS.

Start with warning-only budgets. Make them blocking after the optimized baseline is accepted.
