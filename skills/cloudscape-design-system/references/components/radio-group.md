---
scraped_at: '2026-04-20T08:49:09+00:00'
section: components
source_url: https://cloudscape.design/components/radio-group/index.html.md
title: Radio group
---

# Radio group

Radio group enable users to choose one option from a predefined set.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/radio-group)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/radio-group/index.html.json)

## Development guidelines

#### State management

The radio group component is controlled. Set the `value` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

RadioGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findButtons | Array<[RadioButtonWrapper](/index.html.md)> | - | - |
| findInputByValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> &#124; null | - | value: | RadioButtonWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> | - | - |
## Integration testing APIs

RadioGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findButtons | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[RadioButtonWrapper](/index.html.md)> | - | - |
| findInputByValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | value: | RadioButtonWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use radio group when only one selection can be made from a group of two to seven options. Use [select](/components/select/index.html.md)   for groups of eight or more options.
- If one item is selected and disabled, always disable the other items in the radio group.
- Use for a selection between two options that require visible explanation via label and description for both states. Use a [toggle](/components/toggle/index.html.md)   or [checkbox](/components/checkbox/index.html.md)   if you need to explain only the active state of a boolean option.
- Use for options that turn a group of elements on or off, for example progressive disclosure of form elements. If the group of sub-elements contain other radio groups, use [checkbox](/components/checkbox/index.html.md)   , [toggle](/components/toggle/index.html.md)   , or [tiles](/components/tiles/index.html.md)   instead.
- Optimize form completion by pre-selecting an option, to reduce users effort.
- Follow the guidelines for [selection in forms](/patterns/general/selection/index.html.md)  .
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

### Don't

- Don't use for options that take immediate effect, for example to switch between light and dark mode. Use a [toggle](/components/toggle/index.html.md)   instead.
- Don't label a radio group as optional.

## Features

- #### Label

  The label of an individual radio button in the radio group. In contrast to checkboxes, use radio buttons only as part of a group, not as standalone buttons.  

  Make sure to label individual radio buttons, as well as the whole group.
- #### Description - optional

  Use the description to provide a broader explanation of the label. Follow the guidelines for [form field](/components/form-field/index.html.md)  .
- #### Vertical layout

  - Recommended for most use cases, such as forms or longer option lists.
  - Supports quick scanning and readability.
- #### Horizontal layout

  - Use only for small sets of options (2 or 3) when vertical arrangement would not fit well within your design.
  - Best for compact layouts or when side-by-side placement improves visual structure.
- #### Progressive disclosure - optional

  For options that add additional complexity, consider showing users the most important options first, then show the additional options upon selection below the radio group.

### States

- #### Disabled item

  Use the disabled state when users cannot interact with one of the radio buttons in the radio group and to prevent users from modifying the value.
- #### Read-only

  Use the read-only state when radio group data is not to be modified by the user but they still need to view it.

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

- Always include labels to specify the individual options and the whole group.
- Use parallel sentence structure.  

  - For example: *A radio group labeled Edition, and the individual radio button labels MySQL 5.6, MySQL 5.7, and PostgreSQL.*
- Do not include links in individual option labels.
- Follow the guidelines for [form field](/components/form-field/index.html.md)  .

#### Description - optional

- Avoid directive text that states the obvious, such as *Select one option*  .
- Do not include links in individual option descriptions.
- Follow the guidelines for [form field](/components/form-field/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Provide a meaningful label and description for each radio button.
- Wrap the component in a [form field](/components/form-field/index.html.md)   to ensure that the group of radio buttons is correctly labelled. Alternatively, explicitly set properties `ariaLabel`   (or `ariaLabelledBy`   ) and `ariaDescribedBy`  .

#### Labels and descriptions

- Radio button labels and descriptions are part of the clickable/focusable area of the control, so they should not contain interactive content (for example, links). Place links at the [form field](/components/form-field/index.html.md)   level instead.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
