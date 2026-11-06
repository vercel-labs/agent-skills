---
scraped_at: '2026-04-20T08:49:27+00:00'
section: components
source_url: https://cloudscape.design/components/status-indicator/index.html.md
title: Status indicator
---

# Status indicator

A status indicator communicates the state of a resource-either in its entirety or a particular facet of a resource-in a compact form that is easily embedded in a card, table, list, or header view.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/status-indicator) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/status-indicator/index.html.json)

## Unit testing APIs

StatusIndicatorWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## Integration testing APIs

StatusIndicatorWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## General guidelines

### Do

- Always include text to provide clarity to the meaning of the status.

### Don't

- Never rely on color alone to communicate information. Make sure the color reinforces the meaning of the icon and text.

## Features

### Structure

- #### Icon

  The icon brings visual emphasis to the severity or type of status, making it faster for the user to recognize and easier to understand. These can either be one of the seven [status icons](/foundation/visual-foundation/iconography/index.html.md)   or a [spinner](/components/spinner/index.html.md)   when using the component for a loading state.
- #### Text

  Text allows the user to quickly understand the state beyond its type or severity. A short piece of text helps describe the message succinctly.
- #### Color

  Color is used as an additional visual indicator to help the user identify the type of status, especially when looking at long tables of data. Each status icon comes with a predefined color for each icon. When using a color other than the provided default, make sure that it reinforces the message that the icon is meant to convey.  

  For example, if there are recommended actions while a process is waiting to start, you could use a pending blue status indicator with the recommendations available in a popover.  

  Below are some common uses for the available status colors:  

  - Red - Error, warning, negative, and failure states
  - Green - Success, positive, and completed states
  - Blue - Information, tips, recommendations, and improvements
  - Grey - Stopped, inactive, pending, in progress, loading, idle, and unchanged states

### Status types

The component comes with the following predefined mappings of icon and text colors:

- #### Error

  The resource or process failed or is in a critical state. Can be used when a metric crosses a user-specified threshold. For example: A resource or process has failed and cannot recover without user intervention.  

  If necessary, use [popover](/components/popover/index.html.md)   to provide additional contextual information for status indicator. For example, to communicate a server-side error status in a [key-value pairs](/components/key-value-pairs/index.html.md)   . In this case, you might show a popover with additional error description on error status indicator.
- #### Warning

  The resource or process is working, but in an unreliable or trending toward critical state. Can be used when a metric approaches a user-specified threshold. For example: A resource or process that will fail if left unchanged.
- #### Success

  The resource is running correctly, or the process has finished without errors.
- #### Information

  The resource is running correctly, but there are tips or recommendations for improving the function. Can also be used when a process has completed and has non-critical information about the completion.
- #### Stopped/inactive

  The resource, service, or process is no longer running, inactive, or severity is not relevant.
- #### Pending

  The resource or process has no errors, but is waiting for a process or task to finish before it can be used. For example: initialization, creation, deletion, review.
- #### In progress

  The process is underway and running without errors.
- #### Loading

  The resource data is being fetched and is waiting for the information to be returned. This type uses a spinner instead of a status icon and should be used for component loading states or other operations that are under 10 seconds. Follow the guidelines for [spinner](/components/spinner/index.html.md)  .
- #### Not started

  The resource or process is in its initial state and no execution has begun yet.

## Writing guidelines

### General writing guidelines

- Use sentence case, but continue to capitalize proper nouns and brand names correctly in context.
- Use end punctuation, except in [headers](/components/header/index.html.md)   and [buttons](/components/button/index.html.md)   . Don't use exclamation points.
- Use present-tense verbs and active voice.
- Don't use *please*   , *thank you*   , ellipsis ( *...*   ), ampersand ( *&*   ), *e.g.*   , *i.e.*   , or *etc.*   in writing.
- Avoid directional language.  

  - For example: use *previous*     not *above*     , use *following*     not *below*    .
- Use device-independent language.  

  - For example: use *choose*     or *select*     not *click*    .

### Component-specific guidelines

- Use sentence case (not title case).
- Clarity is most important. Aim for either a single word status, such as *Error*   , or a two word status, such as *Permission error*   . Using three or more words is confusing to users.
- For ongoing or transitory states, try to complete the statement *This resource is... *   Often used are present participles, for example: *warning, passing, running, creating, initializing, syncing*   . Other possible constructions could be active: *in-use, non-compliant, in-sync, offline, inactive, insufficient,*   or* in progress*  .
- For completion states, try to complete the statement *This process has...*   Often used are past participles, for example: *failed, passed, started, verified, succeeded, finished*   . Although they don't work with the prior statement, *ready*   and *complete *   are acceptable examples of copy for the indicator resources. In these cases, use generic category titles that would be recognized as general cloud computing terms.
- When you are working with a process or workflow, it might be hard to tell what to use. If a user has submitted a document and is waiting for it to be approved, does one write *submitted*   or *pending*   ? The *document submitted*   is best suited for a flash bar; it is shown when the user first submits the document, so there is no need to show that as your state. Rather, describe what the user is currently waiting on, in this case, the review state which would be *pending*   or *pending review*  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- If the icon and color of the status indicator communicate additional information to the status text, add an aria-label using the `iconAriaLabel`   property.  

  - For example: `<StatusIndicator iconAriaLabel="Error" type="error">Terminated</StatusIndicator>`     . This status indicator requires an aria-label to convey the information about the severity. Without the aria-label, it is unclear whether *terminated*     is an expected outcome or not.
- For dynamically updated status indicators that need to be communicated with the user, wrap them with live regions.  

  - For example: `<StatusIndicator type="loading">Loading</StatusIndicator>`

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
