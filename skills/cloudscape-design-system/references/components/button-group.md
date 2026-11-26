---
scraped_at: '2026-04-20T08:47:05+00:00'
section: components
source_url: https://cloudscape.design/components/button-group/index.html.md
title: Button group
---

# Button group

Enable users to perform an action from a group of buttons.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/button-group) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/button-group/index.html.json)

## Unit testing APIs

ButtonGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findButtonById | [ButtonWrapper](/components/button/index.html.md) &#124; null | Finds a button item by its id. | id: |
| findFileInputById | [FileInputWrapper](/components/file-input/index.html.md) &#124; null | Finds a file input item by its id. | id: |
| findItems | Array<[ElementWrapper](/index.html.md)> | Finds all button and menu items. | - |
| findMenuById | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) &#124; null | Finds a menu item by its id. | id: |
| findToggleButtonById | [ToggleButtonWrapper](/components/toggle-button/index.html.md) &#124; null | Finds a toggle button item by its id. | id: |
| findTooltip | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the currently opened tooltip. | - |
## Integration testing APIs

ButtonGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findButtonById | [ButtonWrapper](/components/button/index.html.md) | Finds a button item by its id. | id: |
| findFileInputById | [FileInputWrapper](/components/file-input/index.html.md) | Finds a file input item by its id. | id: |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Finds all button and menu items. | - |
| findMenuById | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) | Finds a menu item by its id. | id: |
| findToggleButtonById | [ToggleButtonWrapper](/components/toggle-button/index.html.md) | Finds a toggle button item by its id. | id: |
| findTooltip | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the currently opened tooltip. | - |
## General guidelines

### Do

- Display buttons for frequently performed actions as standalone items in the button group. Move other actions to the overflow menu.
- Group related actions within the button group. This helps users distinguish between actions that are related to each other and standalone.
- Use button group component in the [generative AI chat bubbles](/patterns/genai/generative-AI-chat/index.html.md)  .

### Don't

- Avoid adding arbitrary information in the action popovers. Use them to display success and error states only.
- Avoid placing actions that require feedback via a popover in the overflow menu. Instead display these in the visible button group. For example, copy to clipboard action should be visible and not placed in the overflow menu.

## Features

- #### Icon buttons

  Display [icon buttons](/components/button/index.html.md)   to enable users to perform specific actions. The icons used for buttons should be easy to understand without visible labels.
- #### Toggle buttons

  Display [toggle buttons](/components/toggle-button/index.html.md)   to immediately trigger binary, mutually exclusive actions and persist the action performed. For example, use a toggle button for thumbs up and down feedback actions.
- #### Overflow menu

  Display additional actions in an [icon button dropdown](/components/button-dropdown/index.html.md)   . Actions in the dropdown do not support feedback via a popover.
- #### Tooltip

  Display the label associated with the action of a visible icon button in the tooltip.
- #### Popover - optional

  Display feedback associated with the action performed by the user in a popover using [status indicators](/components/status-indicator/index.html.md)   . For example, successfully copied content to the clipboard.
- #### Grouped buttons - optional

  Within the button group component, buttons for actions that are related to each other can be grouped. These groups are displayed with dividers to distinguish them from other actions.
- #### Disabled reason - optional

  You can use a tooltip with disabled icon buttons, toggle buttons or icon button dropdown to explain why the action is unavailable.

### States

- #### Disabled

  Display a button in [disabled state](/patterns/general/disabled-and-read-only-states/index.html.md)   to prevent users from being able to act on it.
- #### Loading

  Display the button in loading state to inform users that the action is in-progress.

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

#### Button labels

Follow the writing guidelines for [buttons](/components/button/index.html.md).

#### Popover

Follow the writing guidelines for [popover](/components/popover/index.html.md).

#### Toggle button

Follow the writing guidelines for [toggle button.](/components/toggle-button/index.html.md)

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- Provide `text`   for every button, group, and dropdown in the button group to ensure all elements have an accessible name.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
