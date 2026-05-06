---
scraped_at: '2026-04-20T08:50:37+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/visual-foundation/theming/index.html.md
title: Theming
---

# Theming

Theming allows for the customization of specific visual attributes across the product interface.

## Key UX concepts

Cloudscape currently offers a default theme, which you can use for your own applications or products. Theming is used for modification of some visual aspects of the UI to meet product-specific needs.

- Theming is applied to foundational elements and reflected in all elements provided by the system that uses its foundation. To promote a consistent and unified brand experience for users, Cloudscape doesn't currently support theming individual instances of components.
- Theming is achieved by changing specific [design tokens](/foundation/visual-foundation/design-tokens/index.html.md)   . There are three categories of design tokens: [typography, colors, and border radii](/foundation/visual-foundation/design-tokens/index.html.md)   . Changes are applied globally across the UI and are reflected in all components which use the system's foundation.
- Theming can be used to better reflect a brand identity or meet other industry-specific needs.

## What can I change through theming?

### Supported

- Changing color values of brand or common UI related tokens.
- Changing the typeface of your product.
- Changing the border radius of elements. For example: containers, form elements, alerts, and notifications.
- Applying visual changes globally across a product.
- Applying visual changes to predefined [visual contexts](/foundation/visual-foundation/visual-context/index.html.md)  .

Color, typography, and border radius tokens that can be themed are marked as themeable in the [tokens table](/foundation/visual-foundation/design-tokens/index.html.md) .  Data visualization color tokens that are themeable can be found in the respective [color palette tables](/foundation/visual-foundation/data-vis-colors/index.html.md) . To experiment with theming, you can modify the values of themeable tokens in our [demos](/demos/index.html.md) by choosing **Theme** on the right of the top navigation.

### Not supported

- Creating new design tokens.
- Changing spacing, motion, iconography, grid, or other foundational elements not listed above.
- Making visual changes to instances of components and not others.

If you require any of these features, [open a feature request with us](https://github.com/cloudscape-design/components/issues/new?template=2_feature_request.yaml) and share detailed use cases and product requirements.

## Accessibility

Cloudscape components are built according to accessibility guidelines and industry best practices, such as semantic markup and use of appropriate [ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) attributes. If you modify colors, ensure that you employ proper color contrast checks.

## Dark mode

Cloudscape offers a [dark mode](/foundation/visual-foundation/visual-modes/index.html.md) . Each color-related design token has a light mode and a dark mode value. If you don't specify a dark mode custom value, it will automatically apply the default one offered by the system. To maintain correlation and brand identity in themed interfaces, we recommend that you specify the dark mode alternative for modified color tokens.

## Visual contexts

When a [visual context](/foundation/visual-foundation/visual-context/index.html.md) uses a visual-context-specific value for a design token, this value is not overridden by global theming changes to the design token. To theme the design token in a visual context, you need to explicitly define a context-scoped set of overrides in your theme.

### Available visual contexts



| Context ID | Description |
| --- | --- |
| Used for the [Top navigation](/components/top-navigation/index.html.md) component and its content. |  |
| Used for the dark header area of the page (high contrast header variant of [app layout](/components/app-layout/index.html.md) and[content layout](/components/content-layout/index.html.md)). |  |
| Used for the [Flashbar](/components/flashbar/index.html.md) component and its content. |  |
| Used for the [Alert](/components/alert/index.html.md) component and its content. |  |
## General guidelines

### Do

- Less is more: use theming judiciously. A consistent brand experience can be achieved through calculated theming.
- For themed interfaces, perform thorough accessibility checks.
- While theming, configure the dark mode equivalent for each custom light mode color value.

### Don't

- Don't theme the UI unless your product's specific needs require you to. Think about the customer experience first.
- Don't override design tokens which are not modifiable. If you require more design tokens for your theming use case, [open a feature request with us](https://github.com/cloudscape-design/components/issues/new?template=2_feature_request.yaml)  .

## Implementation

Cloudscape offers two approaches to implement theming:

- **Build-time theming: **   you can create a package that contains all Cloudscape components with your custom theme.
- **Runtime theming: **   you can apply a theme in the browser, on top of the default Cloudscape components.

Below you will find more details about each approach, and recommendations on when to use each based on your use case.
Both approaches require you to define a theme as input parameter.

### Defining a theme

You can define a theme by providing custom values for themeable [design tokens](/foundation/visual-foundation/design-tokens/index.html.md) . There are three categories of themeable tokens: typography, color, and border radius.

#### Typography tokens

The custom values you set for typography tokens (such as `fontFamilyBase` ) are applied globally in the entire application, including visual contexts. When setting custom values for font families, ensure that you also provide the corresponding font assets.

For example, a theme with a new value for `fontFamilyBase` looks like the following:

```
const theme = {
   tokens: {
        fontFamilyBase: "'Helvetica Neue', Roboto, Arial, sans-serif",
   },
};
```

#### Border radius tokens

The values you set for border radius tokens (such as `borderRadiusButton` ) are applied globally across the entire UI, including visual contexts.

For example, a theme with a new value for `borderRadiusButton` looks like the following:

```
const theme = {
   tokens: {
        borderRadiusButton: "4px",
   },
};
```

#### Color tokens

You can set custom values for color tokens globally, and for each visual context. If you don't explicitly specify a custom value for a visual context, the default Cloudscape value will be applied.

You can also specify a value for both light and dark mode. Here is an example:

```
const theme = {
   tokens: {
      // Values are applied globally, except for visual contexts
      colorBackgroundLayoutMain: {
          // Specify value for light and dark mode
          light: 'white',
          dark: 'blue'
      }
      // Shorter syntax to apply the same value for both light and dark mode
      colorTextAccent: '#0073bb',
   },
   contexts: {
      // Values for visual contexts. Unless specified, default values will be applied
      'top-navigation': {
         tokens: {
            colorTextAccent: '#44b9d6',
         },
      },
      header: {...}
      flashbar: {...}
      alert: {...}
   },
};
```

### Applying a theme

#### Build-time theming

Build time theming allows you to create a package that contains all Cloudscape components with your custom theme.

**Generate themed artifacts**

Use the `theming` module of `@cloudscape-design/components-themeable` module as part of your build process.

```
import { join } from 'path';
import { buildThemedComponents } from '@cloudscape-design/components-themeable/theming';

const theme = {...};

buildThemedComponents({
  theme,
  outputDir: join(__dirname, './themed'),
});
```

Upon execution, the `/themed` folder will contain:

- a `/components`   folder that exports Cloudscape components with your custom theme
- a `/design-tokens`   folder that exports design tokens

**Use themed artifacts in your application**

Replace all imports of Cloudscape components and design tokens to direct them to these newly created folders.

**Use themed artifacts in dependencies that use Cloudscape (advanced)**
If you have additional dependencies using Cloudscape components as peer dependency, configure your bundler (e.g. [Webpack](https://webpack.js.org/) ) to ensure that they also use your themed artifacts. Here is an example of configuration for Webpack.

```
// webpack.config.js

const path = require('path');

module.exports = {
  //...
  resolve: {
    alias: {
      '@cloudscape-design/components': '[outputDir]/components',
      '@cloudscape-design/design-tokens': '[outputDir]/design-tokens',
    },
  },
};
```

#### Runtime theming

Runtime theming injects an inline stylesheet overriding built-in design tokens values. Use the `theming` module of `@cloudscape-design/components-themeable` module in your application.

```
import { Theme, applyTheme } from '@cloudscape-design/components/theming';

const theme: Theme = {...};

const { reset } = applyTheme({ theme });
// Use the reset method to remove the custom theme
```

Make sure your Content Security Policy supports inline stylesheets by adding `Content-Security-Policy: style-src: 'self' 'unsafe-inline';`.

Refer to the [demo](/demos/index.html.md) pages and the theme switcher in the top of the navigation bar to try out runtime theming.

#### Build-time vs runtime theming

We recommend to use build-time theming because

- It's compatible with stricter Content Security Policies (CSP): unlike runtime theming, it doesn't require injection of inline styles.
- It offers better performance: runtime theming requires to bundle a large file that contains default theme definitions, so that updated styles can be generated.
- It provides better support for Server-Side Rendering (SSR): for SSR-based applications, runtime theming is applied only after hydration, providing a sub-optimal user experience as the user sees the non-themed application first.

Use runtime theming only if your application allows each customer to define their own theme, In this scenario, built-time theming would require you to build and deploy a different application for each of them.
