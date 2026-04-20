---
scraped_at: '2026-04-20T08:47:49+00:00'
section: components
source_url: https://cloudscape.design/components/error-boundary/index.html.md
title: Error boundary
---

# Error boundary

Rendered around any part of the application to isolate unexpected errors.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/error-boundary)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/error-boundary/index.html.json)

## Development guidelines

#### Error boundaries setup

The error boundary component can wrap any part of the application to capture client-side errors that occur within its subtree. Because the component relies on [built-in internationalization](/get-started/for-developers/internationalization/index.html.md) , it must be rendered inside the `I18nProvider` or supplied with a custom `i18nStrings` configuration.

Many Cloudscape components, such as app layout, container, modal, table, and others, include built-in error boundaries that activate when a standalone error boundary exists higher in the component tree. Errors originating within these components will therefore display a fallback message closer to the source of the failure and will not propagate further up the hierarchy.

As a result, the minimal recommended setup is to include a single error boundary component that wraps the entire application.

```
<I18nProvider locale={locale} messages={[messages]}>
  <ErrorBoundary onError={logError}>
    <App />
  </ErrorBoundary>
</I18nProvider>
```

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Testing guidelines

### Showing error boundary fallback in integration tests

The error boundary exposes a small testing API on the element instance to show the fallback message on demand. Use this mechanism in integration tests in order to:

- Assert the appearance and content of the fallback
- Avoid triggering real runtime errors for testing

```
import createWrapper from '@cloudscape-design/code-view/test-utils/selectors';

// Select the error boundary root using the `errorBoundaryId` passed to <ErrorBoundary />.
const errorBoundaryRootSelector = `[data-awsui-error-boundary-id="{errorBoundaryId}"]`;
const errorBoundaryRootElement = document.querySelector(errorBoundaryRootSelector);

// Force the error boundary into its fallback state.
// Note: this does NOT invoke the onError() callback.
errorBoundaryRootElement.__awsui__.forceError();

// Query the rendered error boundary fallback (assuming only one visible at a time).
const errorBoundaryFallbackSelector = createWrapper().findErrorBoundary().toSelector();
const errorBoundaryFallbackElement = document.querySelector(errorBoundaryFallbackSelector);
expect(errorBoundaryFallbackElement).toHaveTextContent(expectedContent);

// Restore the normal state when the test is done (unless there is an actual error to be shown).
errorBoundaryRootElement.__awsui__.clearForcedError();
```

## Unit testing APIs

ErrorBoundaryWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findFeedbackAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findRefreshAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

ErrorBoundaryWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFeedbackAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findRefreshAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use error boundaries to handle unexpected JavaScript errors in your application.
- Implement a top-level error boundary to catch unhandled errors across your entire application.
- Add section-level error boundaries only for custom components or when a different fallback experience is needed, such as replacing the default "Refresh page" action with a context-specific one like "Reload section."

### Don't

- Avoid wrapping application sections or components with error boundaries unless the fallback message needs to be distinct.
- Don't use error boundaries for handling expected errors or asynchronous errors (use try-catch instead).

## Features

### Fallback structure

The fallback appears when an error is captured and typically shown in an error alert. All parts of the fallback messaging can be customized, allowing for localization or tailored messaging.

By default, it includes three elements:

- #### Header

  A short, direct statement of what went wrong. For example: *"Unexpected error, content failed to show". *
- #### Description

  A concise explanation or suggested next step. For example: *"Refresh to try again. We're tracking the issue". *   Along with an optional feedback link.
- #### Action

  A single primary button for the most relevant next step. For example: *"Refresh page".*

### Types

- #### Standalone

  When an error occurs within the wrapped content, the entire section will be replaced with the error fallback. This allows you to wrap specific parts of your application with an error boundary, providing granular control over error handling.
- #### Built-in

  Certain Cloudscape components like app layout content, container, modal or drawer have built-in error boundaries. these derive their settings from the closest standalone error boundary component up in the component hierarchy. This means that if an error occurs within a Cloudscape component with a built-in error boundary, the fallback message will be shown by the built-in error boundary, instead of propagating higher up in the components tree.

### Scope

Error boundaries can apply to different scopes in your application:

- Page-level: Handles fatal errors affecting the entire page.
- Section-level: Handles errors in a specific part of a page.

For detailed guidance on when to use page vs section boundaries, see [error types](/patterns/general/errors/error-messages/index.html.md).

## Writing guidelines

## Accessibility guidelines

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
