# Next.js 15 and 16 Turbopack matrix

Use the installed `next` version, not an assumption based on repository age. Verify version-sensitive behavior against the matching official documentation before changing configuration. Check the exact patch: several CSS behaviors changed inside the 15.4, 16.2, and 16.3 lines.

## Commands and status

| Concern                          | Next.js 15                                                                                                                                          | Next.js 16                                                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Turbopack development            | `next dev --turbopack`; stable from 15.0. 15.0.0 accepted only `--turbo`; `--turbopack` arrived in 15.0.1                                           | `next dev`; Turbopack is the default                                                                                     |
| Turbopack production             | `next build --turbopack`; alpha in 15.3 and 15.4 (the docs table calls it experimental), beta from 15.5                                             | `next build`; Turbopack is stable and the default                                                                        |
| Webpack control                  | `next build` without the Turbopack flag                                                                                                             | `next build --webpack`                                                                                                   |
| Webpack development              | `next dev` without the Turbopack flag                                                                                                               | `next dev --webpack`                                                                                                     |
| Turbopack config                 | `experimental.turbo` through 15.2; top-level `turbopack` from 15.3, with `experimental.turbo` deprecated but accepted                               | Top-level `turbopack` only                                                                                               |
| Default browser baseline         | Chrome 64+, Edge 79+, Firefox 67+, Opera 51+, Safari 12+                                                                                            | Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+                                                                       |
| CSS targets applied by Turbopack | None through 15.4.0; the resolved Browserslist from 15.4.1                                                                                          | The resolved Browserslist                                                                                                |
| Lightning CSS                    | Always used by Turbopack from 15.1. 15.0.x could opt out with the legacy `experimental.turbo.useSwcCss`                                             | Always used by Turbopack                                                                                                 |
| `useLightningcss: false`         | Ignored by Turbopack                                                                                                                                | Ignored by Turbopack                                                                                                     |
| Feature override                 | No supported `lightningCssFeatures` option                                                                                                          | `experimental.lightningCssFeatures` from 16.2; Turbopack reads it without `useLightningcss`                              |
| `cssChunking`                    | Ignored by Turbopack                                                                                                                                | Ignored by Turbopack through 16.2. From 16.3, only `true` (default) and `'graph'`; `false` and `'strict'` fail the build |
| Default PostCSS config           | Applied by webpack only. Turbopack runs PostCSS only when the project has a config file                                                             | Same as Next.js 15                                                                                                       |
| CSS Modules class names          | Turbopack emits `[name]__[hash]__[local]`, with a doubled `-module-scss-module` segment for `.module.scss`. Webpack emits `[name]_[local]__[hash5]` | Long names through 16.3.x; short `[hash]_[local]` names from 16.4.0-canary.10                                            |
| `next build` size table          | Per-route size and First Load JS; not comparable across bundlers                                                                                    | Per-route size and First Load JS columns removed                                                                         |

Delete `.next` between cold comparisons. Preserve each completed build outside the project before starting the next one.

## Next.js 15 caveats

- Treat production Turbopack as beta on 15.5 and alpha on 15.3–15.4.
- Check the patch before attributing growth to browser targets. Turbopack applied no CSS targets through 15.4.0 (no lowering and no vendor prefixes), so target lowering cannot explain growth on 15.0–15.4.0, and upgrading from 15.4.0 to 15.4.1 can grow CSS without changing bundlers.
- Before 15.4.1, Turbopack production builds also emitted a `*.single.css` file per module in multi-module chunks, which inflates generated inventory.
- Keep webpack as a valid production fallback when compatibility or output correctness cannot be achieved safely.
- From 15.4.1, expect the default browser targets to cause substantially more CSS lowering than Next.js 16. Logical properties can expand through `:dir()`, `:lang()`, `:is()`, and prefixed selector fallbacks.
- Test a modern Browserslist through the environment first. Only commit it after confirming the actual browser-support contract.
- Do not recommend `experimental.useLightningcss: false`; it does not disable Lightning CSS for Turbopack.
- Do not recommend `lightningCssFeatures`; it was added in Next.js 16.2.
- Verify the `turbopack.resolveAlias` workaround for `~` imports on the installed patch. Only the Next.js 16 documentation describes it.

## Next.js 16 caveats

- Use plain `next dev` and `next build` for Turbopack. Explicit `--turbopack` remains unnecessary.
- Use `--webpack` for a control or fallback build.
- Plain `next build` fails when the project defines a custom `webpack` config. Migrate it, or build with `--webpack`, before assuming a Turbopack build is valid.
- Use top-level `turbopack` configuration.
- Expect some lowering at the default targets. Authored `:dir()` (native from Chrome and Edge 120), `light-dark()` (Chrome and Edge 123, Safari 17.5), `oklch()` and `lab()` colors (Firefox 113), and selector lists containing `:has()` are still lowered. Turbopack always lowers nesting and media range syntax.
- From 16.2, use `experimental.lightningCssFeatures.include` or `.exclude` only after checking supported browsers. Excluding a transform deliberately ships modern syntax without legacy fallback.
- Use kebab-case feature names such as `logical-properties`, `dir-selector`, `lang-selector-list`, `is-selector`, `light-dark`, and `vendor-prefixes`. Next.js rejects unknown names.
- Pair `logical-properties` with `dir-selector` when source contains `:dir()`. Excluding `logical-properties` alone still lowers authored `:dir()` into `:lang()` lists.
- Prefer correct Browserslist targets over forcing feature exclusions. Use exclusions for a documented compatibility decision, not as a generic minifier. A narrow exclusion such as `light-dark` can be safer than raising targets, which changes every other lowering at once.
- Migrate `sassOptions.includePaths` to `loadPaths`. Next.js 16 uses sass-loader 16 with the modern Sass API.

Example feature override for a project that explicitly supports logical properties and `:dir()` natively:

```js
module.exports = {
  experimental: {
    lightningCssFeatures: {
      exclude: ['logical-properties', 'dir-selector']
    }
  }
};
```

Confirm the current option name and availability in the installed Next.js version before applying it. Webpack reads the option only with `useLightningcss: true`.

## Browserslist resolution

Next.js resolves CSS targets with Browserslist's `loadConfig`, in this order:

1. The `BROWSERSLIST` environment variable.
2. The `BROWSERSLIST_CONFIG` environment variable.
3. The nearest `browserslist` file, `.browserslistrc`, or `package.json` `browserslist` key, searching parent directories.
4. The Next.js default targets for the installed major version.

Builds select the `production` section of an environment-specific configuration, and dev selects `development`; `BROWSERSLIST_ENV` and `NODE_ENV` do not change the section. Conflicting configuration files make Browserslist throw, and Next.js silently falls back to its defaults. Because the environment variable wins, a throwaway build with `BROWSERSLIST` set tests targets without editing source.

## CSS pipeline differences

- Webpack runs PostCSS with the Next.js default configuration (`postcss-flexbugs-fixes` and `postcss-preset-env` at stage 3, with custom properties disabled) unless the project has its own config, then minifies each emitted file with cssnano. Stage 3 leaves logical properties, `:dir()`, `:is()`, nesting, and `lab()`/`oklch()` unlowered.
- Turbopack runs PostCSS only when the project has a config file, then lowers and minifies each module with Lightning CSS. PostCSS plugins run before lowering, so a PostCSS minifier or purger cannot undo it.
- Webpack's whole-file cssnano pass can remove exact duplicate rules that several modules emit into one file. Turbopack minifies each module separately and concatenates the results, so duplicated unhashed rules from shared partials survive.
- Turbopack lowers CSS that a package or Tailwind CSS v4 already processed with Lightning CSS a second time, using the app's targets. Tailwind CSS v4 excludes logical-property, `:dir()`, and `light-dark()` lowering in its own pass, and Turbopack reapplies them.

## Sass behavior under Turbopack

- Import `.scss` and `.module.scss` directly; Next.js supplies Sass support when `sass` is installed.
- Turbopack runs the same vendored `sass-loader` and `resolve-url-loader` chain as webpack. It passes `sassOptions` through, honors `additionalData` and `implementation`, and rebases `url()` the same way.
- Selectors placed in `additionalData` repeat in every compiled Sass file under both bundlers. Keep `additionalData` token-only.
- Avoid webpack's legacy `~` prefix in Sass imports. Import packages directly, or define `turbopack.resolveAlias: { '~*': '*' }` deliberately.
- Do not rely on `webpack()` configuration or webpack plugins to affect a Turbopack build.
- Turbopack does not support JavaScript functions supplied through `sassOptions.functions`, and Next.js 16 fails the build when they are set. Use webpack or refactor those functions.
- Turbopack CSS Modules do not support `:export` or `:import` (ICSS), standalone `:local` or `:global` (only the function form), or `@value`. The Next.js Sass guide's `:export` example applies to webpack only.
- Expect CSS Module ordering to follow JavaScript import order more directly than webpack. Test visual ordering after splitting or moving CSS. Production order can also differ from development (issue #83941).
- Expect numeric values rounded to 5 decimal places; webpack keeps 10.

## Lightning CSS expansion chain

When targets do not support the relevant features, Lightning CSS may lower:

```text
logical properties
  -> :dir() variants
  -> :lang() selector lists
  -> :is()
  -> :-webkit-any() and :-moz-any() fallbacks
```

This can multiply selector text while remaining relatively compressible. Measure raw, gzip, and Brotli separately.

The expansion follows these rules, measured with Lightning CSS 1.33.0 at the Next.js 15 default targets:

- Only one-sided or asymmetric inline declarations produce direction rules. Symmetric values such as `padding-inline: 1rem` and block-axis properties map directly to physical properties.
- Each affected rule becomes six rules (LTR and RTL, each as `:-webkit-any()`, `:-moz-any()`, and `:is()`), multiplied by the number of selectors in its selector list.
- All one-sided declarations in the same rule share one set of six rules.
- The lowered output keeps no logical property, so direction follows the `lang` attribute instead of `dir` in every browser. Languages outside the 19-code RTL list get left-to-right values.
- Lowered selectors gain specificity (Lightning CSS issue #1018), which can change which rule wins.

Color lowering behaves differently. `light-dark()` becomes `--lightningcss-light` and `--lightningcss-dark` toggles, which compress well. `oklch()` gains hex and `lab()` fallbacks, and custom properties are repeated in an `@supports` block. Those high-entropy values can grow gzip faster than raw bytes: 120 `oklch()` custom properties grew 2.1 times raw and 4.3 times gzip at the Next.js 16 defaults. A small raw-versus-gzip gap does not rule out lowering.

## Official references

- Next.js 15 Turbopack: https://nextjs.org/docs/15/app/api-reference/turbopack
- Current Turbopack: https://nextjs.org/docs/app/api-reference/turbopack
- Turbopack configuration and key history: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack
- Next.js 16 upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-16
- Next.js 15 supported browsers: https://nextjs.org/docs/15/architecture/supported-browsers
- Current supported browsers: https://nextjs.org/docs/architecture/supported-browsers
- Lightning CSS configuration and `lightningCssFeatures`: https://nextjs.org/docs/app/api-reference/config/next-config-js/useLightningcss
- CSS chunking: https://nextjs.org/docs/app/api-reference/config/next-config-js/cssChunking
- Default PostCSS configuration: https://nextjs.org/docs/pages/guides/post-css
- Next.js Sass guide: https://nextjs.org/docs/app/guides/sass
- Lightning CSS transpilation: https://lightningcss.dev/transpilation.html
