---
scraped_at: '2026-04-20T08:49:57+00:00'
section: components
source_url: https://cloudscape.design/components/token/index.html.md
title: Token
---

# Token

Tokens are a compact representation of an individual item or data point.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/token) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/token/index.html.json)

## Unit testing APIs

TokenWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the token description. | - |
| findDismiss | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the token dismiss button. | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Returns the token label. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the token label tag. | - |
| findTags | Array<[ElementWrapper](/index.html.md)> &#124; null | Returns the token tags. | - |
## Integration testing APIs

TokenWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the token description. | - |
| findDismiss | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the token dismiss button. | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the token label. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the token label tag. | - |
| findTags | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Returns the token tags. | - |
## General guidelines

### Do

- Use a token for representing an individual item, data point, or variable.
- Use icons in token to enhance usability, clarity, and recollection of the items, not for decoration. When using icons, make sure they are distinct from one another.
- Keep token labels concise.
- Only use text within inline token.

### Don't

- Don't use a token to indicate severity of another item. Use [badge](/components/badge/index.html.md)   instead.
- Don't use tokens as on/off toggles.
- Don't make tokens movable or draggable.

## Features

- #### Variant

  There are two variants of a token:  

  - **Normal**    
    A compact visual representation of an individual item or data point, typically used in sets to display selected or filtered content.
  - **Inline**    
    A slimmer token designed to fit smaller amount of content inline or in high density interfaces.    

    - For example, an inline token as a read-only variable used to highlight the key parameters within a snippet to show users where specific values can be edited.
- #### Label

  The area for main token content.
- #### Label tag - optional

  Label tag is displayed on next to the label, apart from the remaining information. Use it to display a unique piece of information that should stand out, for quicker recollection and decision making. For example, For [file upload](/components/file-upload/index.html.md)   , the file size metadata can help to identify the selected files.
- #### Description - optional

  An optional explanation of the token's content.
- #### Tags - optional

  Use tags to add additional comparable metadata to support the description of the token.  

  - For example: *vCPU*     and *RAM*     for instance types.
- #### Icon - optional

  Icons are displayed on the left side of the label. Use Cloudscape icons or custom icons to support distinguishing the items. When using icons, follow the guidelines for [icons](/components/icon/index.html.md)  .
- #### Dismiss button - optional

  Users can dismiss individual tokens by selecting the *X*   icon.
- #### Tooltip content - optional

  Content to display in the tooltip when `variant="inline"`   . The tooltip appears when the token label is truncated due to insufficient space.  

  Only applies to plain text labels.

### States

- #### Disabled

  Set a token to disabled when it can't be removed or changed.
- #### Read-only

  Set tokens to read-only it can't be modified by the user but they still need to view it.

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

- When using a text string as a label, keep label concise. If additional information is needed, use a description.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- Use tokens as items in list contexts, for example:  

  - `<ul><li><Token label="Item 1"/></li></ul>`
- Use the disabled state only when a token has interactive elements in the label or a dismiss button.
- Provide an ARIA label if the provided label or custom content in the token is not plain text.
- Provide a dismiss label when a token has a dismiss button.
- Provide tooltip content when `variant="inline"`  .  

  - *The tooltip is available for plain text labels.*

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
