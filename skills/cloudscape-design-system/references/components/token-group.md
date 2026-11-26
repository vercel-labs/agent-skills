---
scraped_at: '2026-04-20T08:49:55+00:00'
section: components
source_url: https://cloudscape.design/components/token-group/index.html.md
title: Token group
---

# Token group

A set of compact representations of individual items or data.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/token-group)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/token-group/index.html.json)

## Development guidelines

#### State management

The token group component is controlled. Set the `onDismiss` listener to store the visible items in the state of your application and update the `items` property. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

TokenGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findToken | [TokenGroupItemWrapper](/index.html.md) &#124; null | Returns a token from the group for a given index. | tokenIndex:1-based index of the token to return. |
| findTokens | Array<[TokenGroupItemWrapper](/index.html.md)> | - | - |
| findTokenToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the token toggle button. | - | TokenGroupItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDismiss | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findOption | [OptionWrapper](/index.html.md) | - | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTags | Array<[ElementWrapper](/index.html.md)> &#124; null | - | - |
| isDisabled | boolean | - | - |
## Integration testing APIs

TokenGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findToken | [TokenGroupItemWrapper](/index.html.md) | Returns a token from the group for a given index. | tokenIndex:1-based index of the token to return. |
| findTokens | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TokenGroupItemWrapper](/index.html.md)> | - | - |
| findTokenToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the token toggle button. | - | TokenGroupItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDismiss | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOption | [OptionWrapper](/index.html.md) | - | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTags | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
## General guidelines

### Do

- Use a token group for representing a set of selected items.
- Use a token group combined with a control, in create and edit flows.
- All tokens must be comparable and use the same metadata structure to better help your users identify, recall, and distinguish the selected item.
- Use label tags for calling out comparable and scannable information across the list of items.
- When using filtering controls, make sure the metadata displayed in each individual token is indexed and searchable.

### Don't

- Don't use a token group for single selection. Tokens should always be paired with other tokens in a token group.
- Don't use a token group for elements that aren't a result of a selection.
- Don't set the width and height of the token group manually. The token group and individual tokens adapt to their content, container width, and alignment.

## Features

### Token structure

- #### Label

  A label is the name or identifier of the individual selected item.
- #### Label tag - optional

  A label tag is displayed on the right side of the label, apart from the remaining information. Use it to display a unique piece of information that should stand out, for quicker recollection and decision making.  

  For example: For [file upload](/components/file-upload/index.html.md)   , the file size metadata can help to identify the selected files.
- #### Description - optional

  A broader explanation of the label.
- #### Tags - optional

  Use tags to add additional comparable metadata to support the description of the item.  

  For example: *vCPU*   and *RAM*   for instance types.
- #### Icons - optional

  Icons are displayed on the left side of the label. Use Cloudscape icons or custom icons to support distinguishing the items. When using icons, follow the guidelines for [icons](/components/icon/index.html.md)  .
- #### Remove button

  Users can dismiss individual tokens by tapping the *X*   icon.

### Token group structure

- #### Alignment

  - [Tokens](/components/token/index.html.md)     are aligned horizontally by default. Use the default alignment for an unordered set of tokens.    

    - For example: [multi-select](/components/multiselect/index.html.md)      .
  - Set the token group to be aligned vertically when it is important to compare a set of selected items.    

    - For example: For [file upload](/components/file-upload/index.html.md)       to distinguish file names, size or formats.

### Token visibility

- #### Token limit

  By default, all tokens are visible. You can hide some or all tokens. To toggle the visibility of the tokens, users can trigger the show/hide link, which shows or hides them.  

  Token visibility can be controlled in two ways:  

  - **Hide all tokens **     -** **     Use in high density interfaces.
  - **Hide some tokens **     -** **     Use when most users will have a small number of tokens, but some users will have many tokens. If you know how many tokens are typically shown, hide tokens above that number, so most users will see all tokens.    

    - For example: If 90% of users only select 2 tokens, then hide all tokens above 2.

  Tokens should not be hidden when they are needed by users to complete a task.

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

#### Token show/hide link

- Use the format: *Show chosen \[objects\]*   and *Hide chosen \[objects\]*  

  - For example:    

    - *Show chosen services  *
    - *Hide chosen services*
- When hiding some tokens, use the format: *Show more chosen \[objects\]*   and *Show fewer chosen \[objects\]*  

  - For example:    

    - *Show more chosen services *
    - *Show fewer chosen services*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Specify alternative text for the remove icon in the tokens using the `dismissLabel`   property.  

  - For example: *Remove item.*
- When using icons in tokens, make sure to specify an alternative text.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
