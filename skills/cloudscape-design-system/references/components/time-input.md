---
scraped_at: '2026-04-20T08:49:48+00:00'
section: components
source_url: https://cloudscape.design/components/time-input/index.html.md
title: Time input
---

# Time input

A form element in which a user can enter an absolute time value.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/time-input)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/time-input/index.html.json)

## Development guidelines

#### State management

The time input component is controlled. Set the `value` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

TimeInputWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| blur | - | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> | - | - |
| focus | - | - | - |
| getInputValue | string | Gets the value of the component.Returns the current value of the input. | - |
| isDisabled | boolean | - | - |
| setInputValue | - | Sets the value of the component and calls the onChange handler | value:The value the input is set to. |
## Integration testing APIs

TimeInputWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use time input in forms, such as in [create flow](/patterns/resource-management/create/index.html.md)   and [edit flow](/patterns/resource-management/edit/index.html.md)  .
- Always use placeholder text to show the required input format, and use constraint text to show any constraints.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

### Don't

- Don't use a time input for fields that require relative timestamps,  such as *in 30 mins*   . Instead, use [input](/components/input/index.html.md)   or [select](/components/select/index.html.md)  .
- Don't add logic for time formatting, rely instead on the default  behavior for colon insertion and capped values for hours, minutes and  seconds.

## Features

- #### Format

  Specifies the granularity with which the time should be entered. For example: `hh:mm`   for hours and minutes,  
  or `hh:mm:ss`   if the user should also enter seconds. Colons are populated automatically and are used to separate the units.
- #### Constraint text - optional

  Use constraint text for time input constraints, such as accepted time format. You can use 12 or 24-hours format.  
  By default the time input is set to 24-hours format. We recommend working with your localization team  
  to format times tailored to the customer's region.
- #### Placeholder

  Use placeholder text to indicate the time format granularity. For example: `hh:mm`   for hours and minutes,  
  or `hh:mm:ss`   if the user should also enter seconds.  

  Follow the guidelines for the [input](/components/input/index.html.md)   component for other features.

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

### Component-specific guidelines

#### Label

- Always include a label to specify what the absolute time value is for.
- Use descriptive labels, such as the name of the resource or process.  

  - For example:* *     Maintenance window start time or API expiration.
- Don't use *timestamp*   to label fields for time inputs.
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Description

- Avoid directive text that states the obvious, such as *Enter a time*  .
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Constraint text

- Show the accepted time format. For uniformity, we recommend to use the 24-hour format.  

  - For example:* Use 24-hour format.*
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Placeholder text

- Show the accepted format using lowercase for times.  

  - For example: *hh:mm:ss*
- Follow the writing guidelines for [input](/components/input/index.html.md)  .

#### Error text

- Follow the general guidelines for [validation](/patterns/general/errors/validation/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
