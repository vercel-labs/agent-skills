---
scraped_at: '2026-04-20T08:49:02+00:00'
section: components
source_url: https://cloudscape.design/components/progress-bar/index.html.md
title: Progress bar
---

# Progress bar

Informs the user about the progress of an operation with a known duration.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/progress-bar) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/progress-bar/index.html.json)

## Unit testing APIs

ProgressBarWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAdditionalInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findPercentageText | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findResultButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findResultText | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the result text. | status:[optional] Status of the result text. It can be either "error" or "success". If not specified, the method returns the result text that is currently displayed, independently of the result status. |
## Integration testing APIs

ProgressBarWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAdditionalInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findPercentageText | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findResultButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findResultText | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the result text. | status:[optional] Status of the result text. It can be either "error" or "success". If not specified, the method returns the result text that is currently displayed, independently of the result status. |
## General guidelines

### Do

- Use a progress bar for operations longer than 10 seconds with a  foreseeable point in time for completion.
- If the operation is contextual, place the progress bar in context of  the element. If the operation is global or not related to a specific  page element, place the progress bar in a [flash message](/components/flashbar/index.html.md)  .
- Display the matching result state once the operation has completed.  Follow the guidelines for [status indicator](/components/status-indicator/index.html.md)  .
- In case of transient errors, display a button for the user to retry  the operation by using the result button.
- When using the progress bar within a dismissible flash message, make sure that users understand the status of the operation even after the  flash message has been dismissed. To do so, pair the operation with a  contextual status indicator in, for example, a table cell or a [key-value pair](/components/key-value-pairs/index.html.md)  .
- For operations on table items, use the progress bar in a flash message and place corresponding status indicators in the table cells.
- When the operation is successful and the page reloads, remove the status indicator.

### Don't

- Don't use a progress bar for indeterminate actions. Instead, use a  different [feedback mechanism](/patterns/general/user-feedback/index.html.md)  .
- Don't use a progress bar for operations that consist of separate  manual steps.
- Don't use multiple progress bars to communicate the status of one  operation.
- Don't display the success state before the progress bar has reached  100%.

## Features

- #### Label

  Short description for the operation in progress.
- #### Description - optional

  Use this field to give users more information about the operation. It can also show dynamic information. For example, it could be the name of the file that is currently being uploaded.
- #### Bar

  A visual element that displays the relative progress of the operation.
- #### Percent completed

  Displays the progress of the operation in percent.
- #### Additional information - optional

  Use this field to give users additional information about the operation.  

  For example: number of steps completed and remaining, time remaining, upload speed.
- #### Result text

  Short description of the outcome of the operation.
- #### Result button  - optional

  A button for when the operation has finished. For example, this could be used for a *retry*   button for a failed operation.  

  If you place the progress bar in a [flash message](/components/flashbar/index.html.md)   , use the action button of the flash message rather than the built-in result button functionality.

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

- Use complete sentences with periods, where possible. If space is limited, you can use a sentence fragment without a period.  

  - For example:    

    - *Uploading file 2 of 5 (305.5 KB/s)*
    - *About 5 minutes remaining*
    - *Current rate 3MB/s*
    - *Uploading file 2 of 5 (305.5 KB/s). About 5 minutes remaining.*

#### Label

- Use clear, concise, consistent wording to explain the operation in progress.
- Don't use terminal punctuation.  

  - For example:    

    - *Creating a database*
    - *Setting up a distribution*

#### Description

- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Percent completed

- Use a numeric value paired with the percent sign (%). Use the format:* \[numeric value\] %*

#### Error and success messages

- Follow the writing guidelines for [error messages](/patterns/general/errors/error-messages/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Label

- A progress bar should always be accompanied with a label.

#### Bar

- The maximum width of the component should be approximately 800px for  
  optimal observability.

#### ARIA live regions

- Result states by default sit in an `aria-live`   region to notify screen readers about state changes.






Progress bar label : 36%

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
