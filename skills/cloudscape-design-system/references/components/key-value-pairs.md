---
scraped_at: '2026-04-20T08:48:33+00:00'
section: components
source_url: https://cloudscape.design/components/key-value-pairs/index.html.md
title: Key-value pairs
---

# Key-value pairs

Key-value pairs are lists of properties (labels) followed by their corresponding values.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/key-value-pairs) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/key-value-pairs/index.html.json)

## Unit testing APIs

KeyValuePairsWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItems | Array<[KeyValuePairsItemWrapper](/index.html.md)> | - | - | KeyValuePairsItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findGroupPairs | Array<[KeyValuePairsPairWrapper](/index.html.md)> &#124; null | - | - |
| findGroupTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - | KeyValuePairsPairWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

KeyValuePairsWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[KeyValuePairsItemWrapper](/index.html.md)> | - | - | KeyValuePairsItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findGroupPairs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[KeyValuePairsPairWrapper](/index.html.md)> | - | - |
| findGroupTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | KeyValuePairsPairWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- If the label isn't sufficiently describable in a single line, provide the user with assistance with an info link that opens the help panel with more information.
- Use hyphen (-) for any empty values.
- Place a title above groupings of similar key-value pairs to help the user understand the relationship of the group of pairs.
- Values may contain icons. Acceptable icons are status indicators and the external link icon. Status indicators are left-aligned, and external link icons are to the right of the end of the text.

### Don't

- Don't collapse or truncate data using ellipses (...) or other characters; always show the full string for both label and value.
- Don't use key-value pairs to display read-only controls in forms. Instead, follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

## Features

- #### Layout

  The layout is based on our [column layout](/components/column-layout/index.html.md)   , and can have between one and four columns. The types of layout are:  

  - **Default layout: **     Key-value pairs are displayed without any additional visual grouping.
  - **Group layout: **     Multiple key-value pairs can be visually grouped within columns.
  - **Combined layout: **     Both default and group layouts can be utilized within the same area, providing flexibility in data presentation.
- #### Label

  A descriptor used for the key-value pair property (label) that identifies the corresponding value.
- #### Value

  The value of key-value pairs can be any elements, but recommended patterns include:  

  - Text string or number: For example, the distribution ID.
  - [Status indicator](/components/status-indicator/index.html.md)     : For example, to show the status of a task, failed or successful.
  - [Link](/components/link/index.html.md)     : For example, linking to a resource to view more details.
  - Copy to clipboard: For example, copying a ARN. Use [inline copy to clipboard](/components/copy-to-clipboard/index.html.md)     variant to enable users to quickly copy a string of text.
  - [Progress bar](/components/progress-bar/index.html.md)     : When using a progress bar to inform users of an operation within a value, ensure only one label is used, either on the key-value pairs or on the progress bar component.
- #### Info link - optional

  Next to the label, an additional [info link](/components/link/index.html.md)   can be displayed to provide further information. Follow the guidelines for [info link](/components/link/index.html.md)  .

### States

- #### Loading

  The state of the value while the data is being loaded before being displayed. Follow the guidelines for [spinner](/components/spinner/index.html.md)  .
- #### Empty

  The state of the component when there is no value to display. Use hyphen (-) for any empty values.

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

- Keep labels concise, at most 1-3 words.

#### Titles

- Place a title above groupings of similar key-value pairs to help the user understand the relationship of the group of pairs.
- Follow the writing guidelines for [header](/components/header/index.html.md)  .

#### Links

- Follow the writing guidelines for [link](/components/link/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### KeyValuePairs

- Wrap interactive values within Info link keys in a [Box](/components/box/index.html.md)   component with a `padding`   set to `top: "xxs"`   to meet minimum click target requirements, preventing accidental mis-clicks.

#### Icons

- Follow the accessibility guidelines for [icon](/components/icon/index.html.md)  .

#### Links

- Follow the accessibility guidelines for [link](/components/link/index.html.md)  .






30%

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
