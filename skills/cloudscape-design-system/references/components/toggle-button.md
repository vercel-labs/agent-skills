---
scraped_at: '2026-04-20T08:49:50+00:00'
section: components
source_url: https://cloudscape.design/components/toggle-button/index.html.md
title: Toggle button
---

# Toggle button

Enables user to toggle between two actions / states.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/toggle-button) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/toggle-button/index.html.json)

## Unit testing APIs

ToggleButtonWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLoadingIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTextRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| isDisabled | boolean | - | - |
| isPressed | boolean | - | - |
## Integration testing APIs

ToggleButtonWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLoadingIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTextRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use to immediately trigger binary, mutually exclusive actions like saving or favoriting.
- Always use an icon. Use an outline icon for the not pressed state, and switch to filled icon for pressed state.
- Maintain a consistent button label for all button states. For example: *Save *   for both the pressed label and not pressed label.

### Don't

- Don't use a toggle button for actions that affect system-wide settings, such as turning a group of elements on or off, or UI such as light mode or dark mode. Instead, use [toggle](/components/toggle/index.html.md)  .
- Don't use a toggle button to change the way a piece of content or data is formatted on the page. Instead use [segmented control](/components/segmented-control/index.html.md)  .
- Don't use for options that require descriptions to understand the implications of both the pressed and not pressed states. Use a [radio group](/components/radio-group/index.html.md)   or [tiles](/components/tiles/index.html.md)   instead.
- Don't use a toggle button in a form. Follow [selection in forms](/patterns/general/selection/index.html.md)   guidelines.

## Features

- #### Variant

  There are two types of toggle buttons:  

  - **Normal toggle button: **     The normal toggle button features an icon and an optional label. Use this when a standalone icon is not clear enough for users.    

    - For example: a heart icon with label S *ave.*

  - **Icon toggle button: **     A toggle button that features an icon only with no button border. These buttons should be clear enough without text. If you feel like the icon can't clearly convey it's use without text, use the normal toggle button instead with a supporting label.    

    - For example: a toggle button for favoriting a menu item with the `star`       and `star-filled`       icon.
- #### Icons

  Icons are used to reinforce toggle button states by using both outline and filled versions.  

  - For example: a toggle button that has been pressed could be represented by the `star-filled`     icon, while a toggle button that has not been pressed could be represented by the `star`     icon. Follow the [guidelines for iconography](/foundation/visual-foundation/iconography/index.html.md)    .
- #### Disabled reason - optional

  You can use a tooltip with disabled toggle button to explain why the action is unavailable.

### States

- #### Pressed

  Use the pressed state to communicate that the button's action is activated. Selecting a toggle button in its pressed state returns button to a not pressed state.
- #### Not pressed

  Use the not pressed state to communicate that the button's action is not activated. Selecting a toggle button in its not pressed state turns toggle button to a pressed state.
- #### Loading

  When a toggle button is selected, a loading state may be used to inform users of a pending request. In this scenario, the loading state informs users about the pending request by swapping icon with spinner and disabling the toggle button until the request is complete.
- #### Disabled

  Use the disabled state to prevent the user from initiating an action, or when a user still needs to perform an action to activate an item.  

  You can use a tooltip with disabled toggle button to explain why the action is unavailable.

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

- Maintain a consistent button label for all button states.  

  - For example: *Save *     for both the pressed label and not pressed label.
- Follow writing guidelines for [button](/components/button/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Provide alternative text with the `ariaLabel`   property if there is no button text or if you are conveying additional information through means other than text.
- The accessible button name should be unique on the page whenever possible. For example a repeated favorite button should indicate what a user is favoriting. In cases where this is not possible, be sure that there is an additional mechanism for disambiguation, such as a named group.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
