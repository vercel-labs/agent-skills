---
scraped_at: '2026-04-20T08:51:10+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/for-developers/internationalization/index.html.md
title: Built-in internationalization
---

# Built-in internationalization

Learn about internationalization support built into Cloudscape and how to integrate it with your application.

## Overview

Cloudscape components render text to the document, either as visible UI text or as ARIA labels and announcements for assistive technology. Cloudscape components have hundreds of static strings that should be the same across all usages of a component. For example, when a search input is rendered, the same ARIA label ("Clear" in English) should always be provided for the clear button, in the user's chosen language.

To simplify this process for Cloudscape consumers, the components package includes a library of internationalized strings used by the components, and the I18nProvider component to inject them into your application. This reduces the effort of both determining the correct values for static strings and translating them into multiple languages.

Using built-in internationalization ensures consistent visual labels on Cloudscape components throughout your application, and also provides accessible text for many components that may otherwise have been missed.

The following locales are included: `ar` , `en` , `en-GB` , `de` , `es` , `fr` , `ja` , `it` , `pt-BR` , `ko` , `zh-CN` , `zh-TW` , `id` , `tr`.

## Usage

### Requirements

- A minimum TypeScript version of 3.8 (for TypeScript support)

### Integration effort

Integrating the provider and messages using standard `import` should take approximately 1-2 hours. This estimate includes deleting existing strings.

### Integration

#### Add the I18nProvider

At the root of your application, import the I18nProvider and messages and wrap your application with the provider:

```
import { I18nProvider } from '@cloudscape-design/components/i18n';

// Import all locales
import messages from '@cloudscape-design/components/i18n/messages/all.all';
// Or only import specific locales
import enMessages from '@cloudscape-design/components/i18n/messages/all.en';

// At the top of your application tree:
<I18nProvider locale="..." messages={[messages]}>
  <App />
</I18nProvider>
```

The locale argument is optional. If an argument for locale is not provided, the provider will use the value of the " `lang` " attribute on the `<html>` tag.

#### Remove existing strings

The I18nProvider provides strings to Cloudscape components only if an existing value was not already provided. It won't overwrite strings provided directly on component properties, so you won't get the full benefit of consistent and localized strings if you continue providing your own static strings. Therefore, after integrating the I18nProvider with your application, we recommend that you remove any existing strings from your Cloudscape components that are now covered by the provider.

To check which properties for a particular component are supported by the provider, visit the API tab of that component's documentation. For a list of all components and strings supported by the provider, [see the source file here](https://github.com/cloudscape-design/components/blob/main/src/i18n/messages/all.en.json).

#### Importing messages dynamically

To reduce bundle size, locale-specific messages can be loaded dynamically, either using [dynamic JS imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) or using [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) . Here is an example of importing strings using dynamic imports:

```
// 1. Import the importMessages function
import { I18nProvider, importMessages } from "@cloudscape-design/components/i18n";

// 2. Get the messages for the current locale, for example, through "lang" on <html>:
const locale = document.documentElement.lang;
const messages = await importMessages(locale);

// 3. Provide the locale and messages to I18nProvider when rendering:
<I18nProvider locale={locale} messages={messages}>
  <App />
</I18nProvider>
```

### Supporting additional locales

The provider also allows you to provide messages for an unsupported locale or override messages for a supported locale. The messages are defined as a nested structure demonstrated below using the standard [ICU message format](https://formatjs.github.io/docs/core-concepts/icu-syntax).

```
// 1. Define your custom messages
const customMessages = {
  // Namespace: always "@cloudscape-design/components" for the components library
  "@cloudscape-design/components": {
    // Locale: as IETF language tag
    "klh": {
      // Component name
      "alert": {
        // String name: corresponds to the property defined on the component
        "dismissAriaLabel": "..."
      },
    }
  }
};

// 2. Provide the messages to the I18nProvider
<I18nProvider locale="klh" messages={[messages, customMessages]}>
  <App />
</I18nProvider>
```

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
