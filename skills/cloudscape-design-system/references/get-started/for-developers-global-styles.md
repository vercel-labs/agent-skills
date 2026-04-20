---
scraped_at: '2026-04-20T08:51:08+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/for-developers/global-styles/index.html.md
title: Global styles
---

# Global styles

Use the Cloudscape global styles package to apply foundational CSS to pages.

## Overview

The Cloudscape global styles package ( `@cloudscape-design/global-styles` ) offers:

- [Global CSS styles](about:blank/index.html.md)   ( `@font-face`   for Open Sans font   )
- [JavaScript utilities to set visual and content density modes](about:blank/index.html.md)
- [Global CSS utility classes for dark mode](about:blank/index.html.md)

## Installation

This package is provided with the npm module: `@cloudscape-design/global-styles`

For more information, see the [package installation guide](/get-started/for-developers/using-cloudscape-components/index.html.md).

```
npm install @cloudscape-design/global-styles
```

## Apply global styles

The global styles package offers global CSS styles, including [normalize](https://www.npmjs.com/package/normalize.css?activeTab=versions) and [Open Sans font](https://fonts.google.com/specimen/Open+Sans) files. To have Cloudscape components display correctly, import the global CSS file:

```
import '@cloudscape-design/global-styles/index.css';
```

To avoid duplication of assets, make sure you have only one import of this module in your project.

## Manipulate global styles using JS helpers

The global styles package exposes a JavaScript module (global-styles.js) with helpers that allow to set visual and content density modes, as well as a function to disable motion.

### Visual modes



| Name | Type | Description | Accepted values | Default |
| --- | --- | --- | --- | --- |
| (mode: Mode) => void | Sets the color [mode](/foundation/visual-foundation/visual-modes/index.html.md). | Mode.Light, Mode.Dark | Mode.Light |  |
| (density: Density) => void | Sets the [content density](/foundation/visual-foundation/content-density/index.html.md). | Density.Comfortable, Density.Compact | Density.Comfortable |  |
| enum | Definition for content densities. | Comfortable, Compact | Comfortable |  |
| enum | Definition for color modes. | Light, Dark | Light |  |
#### Code example

```
import { applyMode, applyDensity, Density, Mode } from '@cloudscape-design/global-styles';

// apply a color mode
applyMode(Mode.Dark);
applyMode(Mode.Light);

// apply a content density mode
applyDensity(Density.Compact);
applyDensity(Density.Comfortable);
```

[View Documentation](/foundation/visual-foundation/visual-modes/index.html.md)

### Motion



| Name | Type | Description | Accepted values | Default |
| --- | --- | --- | --- | --- |
| (isDisabled: boolean) => void | Turns off [motion effects](/foundation/visual-foundation/motion/index.html.md). | - | false |  |
#### Code example

```
import { disableMotion } from '@cloudscape-design/global-styles';

disableMotion(true);
```

[View Documentation](/foundation/visual-foundation/motion/index.html.md)

## Dark mode global utility classes

To [implement dark mode](/foundation/visual-foundation/visual-modes/index.html.md) in your application, you might need to adjust some visual content. For example, you might want to display two different versions of an image depending on the mode.

To do that, you can use the following global CSS classes provided by the `dark-mode-utils.css` artifact in `@cloudscape-design/global-styles`.



| Class | Description |
| --- | --- |
| awsui-util-show-in-dark-mode | Makes the content visible in the dark mode. |
| awsui-util-hide-in-dark-mode | Makes the content hidden in the dark mode. |
### Usage example

```
import '@cloudscape-design/global-styles/dark-mode-utils.css';
...
<div>
  <img className="awsui-util-hide-in-dark-mode" src="./light-image.png" />
  <img className="awsui-util-show-in-dark-mode" src="./dark-image.png" />
</div>
```

In the previous example, there are two images, where the image with `awsui-util-hide-in-dark-mode` class name will be hidden when the dark mode is on and visible in the light mode. The image with `awsui-util-show-in-dark-mode` class name becomes visible in the dark mode and hidden in the light mode.

## Next steps

### Using Cloudscape components

Learn how to use Cloudscape components in React.

[Learn more](/get-started/for-developers/using-cloudscape-components/index.html.md)

### Global styles

Use the Cloudscape global styles package to apply foundational CSS to pages.

[Learn more](/get-started/for-developers/global-styles/index.html.md)

### Built-in internationalization

Ensures consistent visual labels on Cloudscape components throughout your application, and also provides accessible text for many components that may otherwise have been missed.

[Learn more](/get-started/for-developers/internationalization/index.html.md)
