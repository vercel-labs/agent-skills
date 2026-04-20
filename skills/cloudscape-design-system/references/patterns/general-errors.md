---
scraped_at: '2026-04-20T08:52:22+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/errors/index.html.md
title: Errors
---

# Errors

Errors inform users of an inaccuracy, malfunction, unsuccessful action, or critical issue.

## Common error types

### Form or field validation

Client or server side errors that occur as a result of validation on a form, field, or flow. They usually require a user to perform an action on that field, form, or another page to remediate the error. Refer to the [validation](/patterns/general/errors/validation/index.html.md) pattern for details on scenarios and guidelines on addressing them.

### Component specific functional errors

Errors that occur in a component due to fetching or loading issues. For example:

- The [autosuggest](/components/autosuggest/index.html.md)   has a built-in error state that is displayed when an error occurs while getting suggestions based on the user's entered query.
- The [multiselect](/components/multiselect/index.html.md)   component error state occurs when it fails at fetching options (for example, if the API fails to load the next set of options in the list).
- The [code editor](/components/code-editor/index.html.md)   error state is displayed when the component fails to load.
- The individual [charts](/components/bar-chart/index.html.md)   components have an error state that is displayed when they fail to fetch data.

### Unexpected client-side errors

Errors that occur due to a technical malfunction. For example, when a component fails to render. The cause of these errors is usually unknown, and there might not be a clear action to fix it. Instead, users can report the problem, and then reload the page or retry the operation again later.

## Key UX concepts

### Contextualize errors

Error messages can be standalone field errors resulting from validation or be more complex requiring users take action on multiple elements across pages. In either case, provide error messages to users in the context of where the error occurred when possible, accounting for the scale and criticality of these errors. For example:

- Show inline field error message for standalone field errors resulting from client side validation.
- Show a page level error alert above the submit button for an error resulting from server side validation.
- Show a page level flashbar for an error returned due to failure in deleting a resource.
- Show an error alert where a component failed to render.

## General guidelines

### Do

- Use the built-in component error states for component specific functional errors whenever applicable, instead of creating new ones.
- For form or field validation, follow the pattern recommendations outlines in [validation](/patterns/general/errors/validation/index.html.md)  .
- For table errors, follow the guidelines for [table view](/patterns/resource-management/view/table-view/index.html.md)  .
- For errors when loading and refreshing, follow the guidelines for [loading and refreshing](/patterns/general/loading-and-refreshing/index.html.md)  .

### Don't

- Don't use error messages to display warnings. Error messages imply critical failure which needs immediate user attention and often requires rapid user action to continue with the flow. Warnings on the other hand are advisory.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Related patterns

### Validation

Help users with error recovery by accurately identifying issues and providing easy identification of incorrect fields for correction.

[View Documentation](/patterns/general/errors/validation/index.html.md)

### Error messages

Error messages give users context about an inaccuracy, malfunction, unsuccessful action, or critical issue.---

[View Documentation](/patterns/general/errors/error-messages/index.html.md)
