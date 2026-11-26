---
scraped_at: '2026-04-20T08:48:54+00:00'
section: components
source_url: https://cloudscape.design/components/panel-layout/index.html.md
title: Panel layout
---

# Panel layout

Allows two panels of content to be displayed side by side.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/panel-layout) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/panel-layout/index.html.json)

## Unit testing APIs

PanelLayoutWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findMainContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the wrapper for the main content element. | - |
| findPanelContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the wrapper for the panel element. | - |
| findResizeHandle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the wrapper for the resize handle element.Returns null if the panel layout is not resizable. | - |
## Integration testing APIs

PanelLayoutWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findMainContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the wrapper for the main content element. | - |
| findPanelContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the wrapper for the panel element. | - |
| findResizeHandle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the wrapper for the resize handle element.Returns null if the panel layout is not resizable. | - |
## General guidelines

### Do

- Use a panel layout for layouts where two content panels should scroll independently.
- Enable resizability if the user might want to control the relative panel proportions.
- Offer an alternative layout for narrow viewports, for example using container queries.

## Features

- #### Content areas

  A panel layout consists of two content areas: a panel and a main content area.
- #### Main content

  The primary content of the panel layout.
- #### Panel

  The secondary panel. This can be a fixed size, flexible between minimum and maximum size, or resizable by the user.
- #### Panel variants

  The panel has two style variants:  

  - `panel`     : styled as a solid panel with border dividing it from main content.
  - `custom`     : no styling is applied. You should provide your own styling to distinguish the panel from the main content, for example a container.
- #### Resizability - optional

  The panel can have an optional resize handle, allowing the user to resize it between defined limits.

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

### Component-specific accessibility guidelines

- Both the panel and the main content must contain at least one keyboard-focusable element to ensure keyboard scrollability. If there are no natively focusable elements (for example, links or buttons) you should wrap the contents in an explicitly focusable element. See the playground for examples of how to do this.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
