---
scraped_at: '2026-04-20T08:47:38+00:00'
section: components
source_url: https://cloudscape.design/components/copy-to-clipboard/index.html.md
title: Copy to clipboard
---

# Copy to clipboard

With copy to clipboard, users can copy content to their clipboard.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/copy-to-clipboard) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/copy-to-clipboard/index.html.json)

## Unit testing APIs

CopyToClipboardWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCopyButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findDisplayedText | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Used to get the text displayed next to the copy icon button when variant='inline'.Returns either the textToCopy value or the textToDisplay value if it has been set. | - |
| findStatusText | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options: |
| findTextToCopy | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

CopyToClipboardWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCopyButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findDisplayedText | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Used to get the text displayed next to the copy icon button when variant='inline'.Returns either the textToCopy value or the textToDisplay value if it has been set. | - |
| findStatusText | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options: |
| findTextToCopy | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use copy to clipboard to give users a consistent mechanism for quickly copying values or text data.

## Features

- #### Variant

  - **Button: **     If users need to copy a large or formatted block of content, for example a snippet of code, the content is paired with a corresponding copy action button.
  - **Inline: **     Enable users to quickly copy a string of text.    

    - For example: Copy a long URL within a table or an Amazon Resource Name (ARN) within a list of [key-value pairs](/components/key-value-pairs/index.html.md)       (see live example in the [details page demo](/examples/react/details.html)       ).

  - **Icon: **     When creating a collection of contextual and persistent triggers that enable users to perform a series of actions including copying to clipboard, use the icon variant.
- #### Copy confirmation

  A popover with a status indicator and text string confirms the success of the action, or communicates if an error occurs.

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

#### Button label

- For the [normal button](/components/button/index.html.md)   used for copying a block of content, use this text: *Copy*

#### Popover

- Provide a precise name to the content intended for copying.  

  - For example: *Sample code copied*
- For success text, use the format: *\[Name of the content\] copied*  

  - For example:* Secret ARN copied*
- For error text, use the format: *\[Name of the content\] failed to copy*  

  - For example:* ARN failed to copy*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
