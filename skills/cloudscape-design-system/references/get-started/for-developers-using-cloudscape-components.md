---
scraped_at: '2026-04-20T08:51:14+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/for-developers/using-cloudscape-components/index.html.md
title: Using Cloudscape components
---

# Using Cloudscape components

To use Cloudscape components, first install a set of packages.

Note Cloudscape only supports React.
## Installing Cloudscape components from npm

Cloudscape components and related packages are published to npm under the scope [@cloudscape-design](https://www.npmjs.com/org/cloudscape-design).

### Step 1: Include the Cloudscape Global Styles package

This package contains global styles for Cloudscape components, including the Open Sans font.

1. Install the package by running the following command:

```
npm install @cloudscape-design/global-styles
```

2. Include the styles in your application by adding the following import to the main component/page of your application:

```
import "@cloudscape-design/global-styles/index.css"
```

### Step 2: Install the the React components

1. Install the package by running the following command:

```
npm install @cloudscape-design/components
```

2. Import a component by adding the following line of code to your application:

```
import ComponentName from "@cloudscape-design/components/{component-name}"
```

For example, to import the button component, add the following line of code to your application:

```
import Button from "@cloudscape-design/components/button"
```

After you import the component, you can use it like you would any other React component:

```
<Button>Hello!</Button>
```

You can also import components using the following syntax, but this might result in a larger overall bundle size:

```
import { Button } from "@cloudscape-design/components"
```

### Step 3: Put it all together

```
import { useState } from "react";

import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";

import '@cloudscape-design/global-styles/index.css';

export default function App() {
  const [value, setValue] = useState("");

  return (
    <SpaceBetween size="m">
      <Header variant="h1">Hello World!</Header>

      <Container>
        <SpaceBetween size="s">
          <span>Start editing to see some magic happen</span>
          <Input
            value={value}
            onChange={(event) => setValue(event.detail.value)}
          />
          <Button variant="primary">Click me</Button>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
```

### Step 4: View component properties

You can find a full list of components with accompanying documentation on the [components page](/components/index.html.md). We use TypeScript definitions to document component properties. If you're using a TypeScript-aware editor, such as [VS Code](https://code.visualstudio.com/) , you can see the full list of components, their available properties, and property types and accepted values with autocomplete or IntelliSense.

### Step 5: Integrate with testing libraries

You can configure Cloudscape components to use them alongside testing libraries, such as [Jest](https://jestjs.io/) . For more information, see [testing frameworks integration](/get-started/testing/frameworks/index.html.md).

## Available packages

### @cloudscape-design/components

This is the main Cloudscape package. It contains the React [components](/components/index.html.md) , including the TypeScript definitions.

### @cloudscape-design/board-components

This Cloudscape package contains the React components for [configurable dashboard pattern](/patterns/general/service-dashboard/configurable-dashboard/index.html.md) , including the TypeScript definitions.

### @cloudscape-design/chat-components

This Cloudscape package contains the React components for [generative AI patterns](/patterns/genai/genai-loading-states/index.html.md) , including the TypeScript definitions.

### @cloudscape-design/chart-components

This Cloudscape package contains the React components for [data visualisation](/patterns/general/data-vis/index.html.md).

### @cloudscape-design/code-view

This Cloudscape package contains the React component and languages rules for syntax highlighting for [code view](/components/code-view/index.html.md) , including the TypeScript definitions.

### @cloudscape-design/global-styles

The [global styles](/get-started/for-developers/global-styles/index.html.md) package contains site-level, typography-related styles, including the Open Sans font. To ensure consistent styling, import it once into every Cloudscape application.

### @cloudscape-design/collection-hooks

 [Collection hooks](/get-started/dev-guides/collection-hooks/index.html.md) are React hooks that you can use to control the state of the [table](/components/table/index.html.md) and [cards](/components/cards/index.html.md) components, in addition to related components, such as [textfilter](/components/text-filter/index.html.md) and [pagination](/components/pagination/index.html.md).

### @cloudscape-design/design-tokens

With this package, you'll get a set of [design tokens](/foundation/visual-foundation/design-tokens/index.html.md) in a variety of formats. You can use these tokens to build custom components that are visually consistent with Cloudscape.

### @cloudscape-design/components/test-utils

This internal package is used to create utilities for writing unit and integration tests. For more information, see [introduction to testing](/get-started/testing/introduction/index.html.md).

## Component APIs

### Properties

You configure components by using the properties documented in the API tab of each component. For example:

```
<Icon name="search" variant="subtle" />
```

Also, all components accept `data-*` attributes as properties. They attach to the top level component element. `id` and `className` are also supported but deprecated, and we recommend avoiding these where possible.

### Slots

Some properties might accept either plain text or non-text content. Such properties are called *slots * and they can accept any [valid JSX content type](https://reactjs.org/docs/jsx-in-depth.html#jsx-children).

For example, you can add a link to an [alert](/components/alert/index.html.md) header:

```
<Alert header={<span>This is the alert header <Link href="https://example.com">with a link</Link></span>} />
```

### Default slots

Most components have a default slot, which you can use to specify the content as a [child](https://reactjs.org/docs/introducing-jsx.html#specifying-children-with-jsx) of the component. Default slots are anonymous and can't be referenced by name. Components can have only one default slot.

```
<Alert>
  This is the alert content (default slot)
</Alert>
```

### Events

Some components emit custom events, for example when a [button](/components/button/index.html.md) is pressed. The API documentation for each component displays the full list of events emitted by a component.

To register a listener to a custom event, you can add it as a property. The property name is the event name (which is in camel case), prefixed by `on`.

```
<Button onClick={save}>Save</Button>
```

### Functions

Some components also expose functions that you can call. These functions are available in the reference to the React component. You can retrieve the reference to the component by using the `ref` property. For example, you can store a reference to an input and use it programmatically to focus on the input field:

```
const inputRef = React.useRef();
return (<>
  <Input ref={inputRef} />
  <Button onClick={() => inputRef.current.focus()}>Focus the input field</Button>
</>);
```

### Contexts

Components like applayout or formfield use the React context to implicitly pass down the properties to their children. We expose the formfield context consumer, which can be used to create custom form components. For example:

```
import { useFormFieldContext } from '@cloudscape-design/components/contexts/form-field';

function MyFormInput(props) {
  const { controlId, ariaLabelledby, ariaDescribedby, invalid } = useFormFieldContext(props);
  /* ... */
  return <input id={controlId} aria-labelledby={ariaLabelledby} aria-describedby={ariaDescribedby} className={invalid && 'input-invalid'} ... />
}
```

## Bundling assets

### Minifying assets with Webpack (optional)

#### Minifying JavaScript

To achieve the best page loading speed for your web application, we recommend you minify your assets. To do this, you can the `mode` option in Webpack. Make sure the `mode` option is set to `"production"` for your build. This should be enough to minimize your JS assets.

#### Minifying CSS

By default, CSS assets aren't minified by Webpack. However, we recommend it for Cloudscape-based applications because our CSS contains comments for documentation purposes, and you'll want strip them from the production bundle. Install and configure [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) in your webpack config by using the following syntax:

```
// For Webpack v4
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

plugins: [new OptimizeCssAssetsPlugin({})]

// For Webpack v5
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

optimization: {
  minimize: true,
  minimizer: [new CssMinimizerPlugin()]}
```

For more information, see the [production guide](https://webpack.js.org/guides/production/) in the official Webpack documentation.

### Bundling CSS

#### Configuring loaders

When configuring your project, make sure that there are no loaders applied to our content. This is to prevent unintended consequences, including breaking changes:

```
// sample usage of loaders for your application styles
{
    test: /\.css$/,
    // make sure our content is excluded
    exclude: /node_modules\/@cloudscape-design\//,
    use: [/* your application loaders */]
}

// sample usage of a separate loader for our styles
{
    test: /\.css$/,
    // this may include other third party modules
    include: /node_modules\/@cloudscape-design\//,
    // only these loaders are supported
    use: [MiniCssExtractPlugin.loader, 'css-loader'],
}
```

#### Using webpack mini-css-extract-plugin plugin

If you're using [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) , you might get chunk order warnings. These warnings don't have any impact because Cloudscape component styles are modular and the order of imported styles doesn't matter. If you want to remove these warnings from the build output, configure the [ignoreOrder](https://github.com/webpack-contrib/mini-css-extract-plugin#remove-order-warnings) property in your webpack configurations to exclude warnings about Cloudscape styles from the output:

```
ignoreOrder: true
```

### Bundling with Next.js (optional)

If you use Next.js 13 or higher, update your `next.config.js` file to include the Cloudscape package name in the `transpilePackages` configuration option:

```
const nextConfig = {
  transpilePackages: [
    '@cloudscape-design/components',
    '@cloudscape-design/component-toolkit'
  ]
};

module.exports = nextConfig;
```

If you use an older version of Next.js, use the `next-transpile-modules` package for the same purpose.

## Browsers support

Refer to the list of [supported browsers](https://github.com/cloudscape-design/components/blob/main/CONTRIBUTING.md#browsers-support) in our guidelines on GitHub.

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
