---
scraped_at: '2026-04-20T08:47:41+00:00'
section: components
source_url: https://cloudscape.design/components/date-input/index.html.md
title: Date input
---

# Date input

A form element in which a user can enter a date value.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/date-input) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/date-input/index.html.json)

## Unit testing APIs

DateInputWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| blur | - | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> | - | - |
| focus | - | - | - |
| getInputValue | string | Gets the value of the component.Returns the current value of the input. | - |
| isDisabled | boolean | - | - |
| setInputValue | - | Sets the value of the component and calls the onChange handler.The value needs to use the "YYYY/MM/DD" format,but the subsequent onChange handler will contain the value in the "YYYY-MM-DD" format. | value:The value the input is set to, using the "YYYY/MM/DD" format. |
## Integration testing APIs

DateInputWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Prefer using [date picker](/components/date-picker/index.html.md)   , and only fall back to date input if absolutely needed.
- Always include the required input format in the constraint text, along with any other format constraints. You should also include the format in the placeholder text.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

### Don't

- Don't use a date input where a [date picker](/components/date-picker/index.html.md)   can be used instead.
- Don't use a date input for fields that require relative date periods, such as *in 3 days*   . Instead, use [input](/components/input/index.html.md)   or [select](/components/select/index.html.md)  .
- Don't add logic for date formatting. Instead, rely on the default behavior for separator insertion and capped values for year, month, and day.

## Features

- #### Date input

  Users can input a date by either entering or pasting a date in the input field. You can also provide a value as a default.  

  - Forward slashes (/) are used to separate the year, month, and day. These populate automatically as the user enters a value.
  - Other delimiters such as hyphens (-), periods (.) and spaces ( ) are also accepted, but will be replaced by a forward slash (/).
  - The value in the input will appear in the format *YYYY/MM/DD*     , but the actual value will be sent in the format *YYYY-MM-DD*    .

  Follow the guidelines for [input](/components/input/index.html.md)  .
- #### Placeholder text

  Use placeholder text to indicate the accepted date format.  

  - For example: *YYYY/MM/DD*

  Follow the guidelines for [input](/components/input/index.html.md)  .
- #### Constraint text - optional

  Use constraint text for date input constraints. For example, an accepted date format, such as *YYYY/MM/DD*   . We recommend working with your localization team to format times tailored to your users' region.
- #### Validation - optional

  Error and warning messages can be displayed per input field, below the input field, or above any constraint text. Use standard form field [validation](/patterns/general/errors/validation/index.html.md)  .

### States

- #### Disabled

  Use the disabled state when users cannot interact with input and to prevent users from modifying the value.
- #### Read-only

  Use the read-only state when the input data is not to be modified by the user but they still need to view it.

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

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
