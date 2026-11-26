---
scraped_at: '2026-04-20T08:46:57+00:00'
section: components
source_url: https://cloudscape.design/components/board/index.html.md
title: Board
---

# Board

Provides the base for a configurable layout, including drag and drop, responsiveness and grid.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/board-components/tree/main/src/board) [Configurable dashboard demo](/examples/react/configurable-dashboard.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/board/index.html.json)

## Development guidelines

### Installing board components

This component comes from the new `@cloudscape-design/board-components` NPM module. Make sure to add this module to your dependencies.

#### Usage

This component is a part of configurable dashboards pattern. For more details on the expected usage, see the [pattern article](/patterns/general/service-dashboard/configurable-dashboard/index.html.md).

#### State management

The board component is controlled. Set the `items` property and the `onItemsChange` listener to store its value in the state of your application. Refer to [state management guidelines](/get-started/dev-guides/state-management/index.html.md) for components.

It is recommended to persist items layout as a user preference and apply on page reload.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Testing guidelines

These components are distributed in a separate package. To find them in test-utils, add an extra import along with the main test-utils import:

### For unit testing

```
// side-effect import to install the finder methods
import '@cloudscape-design/board-components/test-utils/dom';
// use import from the main package to use the wrapper
import createWrapper from '@cloudscape-design/components/test-utils/dom';

createWrapper().findBoard().getElement();
```

### For integration testing

```
// side-effect import to install the finder methods
import '@cloudscape-design/board-components/test-utils/selectors';
// use import from the main package to use the wrapper
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

createWrapper().findBoard().toSelector();
```

## Unit testing APIs

BoardWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItemById | [BoardItemWrapper](/components/board-item/index.html.md) &#124; null | - | itemId: |
## Integration testing APIs

BoardWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItemById | [BoardItemWrapper](/components/board-item/index.html.md) | - | itemId: |
## General guidelines

### Do

- Use a single board component on the page. Multiple board components on the same page are not supported.

### Don't

- Don't place the board into a side or split panel. Instead, place this in the content region of the [app layout](/components/app-layout/index.html.md)   . This should only be featured as the primary element on a page.
- Don't place static content in the board layout content area. Instead, use [board items](/components/board-item/index.html.md)   and follow the guidelines for [configurable dashboards](/patterns/general/service-dashboard/configurable-dashboard/index.html.md)   if you are creating a configurable dashboard

## Features

- #### Layout

  The board layout provides three key types of functionality.  

**Grid**  
  The layout uses a fluid 4 column grid that allows you to create views where elements can span across 4 columns of the available horizontal space. Columns have a variable width, while space between them (known as the gutter) remains fixed. Use columns and rows to place your content, and create a clear hierarchy that users can browse through.  

**Responsiveness**  
  The 4 column grid responds to become a 1 column grid on smaller breakpoint with content spanning 100% of the available width.  

**Drag-and-drop**  
  The drag-and-drop feature provides the ability for users to move, change the size, and add board items to the board layout. For more information, [see drag-and-drop](/patterns/general/drag-and-drop/index.html.md)  .  

  Follow the guidelines for [configurable dashboard](/patterns/general/service-dashboard/configurable-dashboard/index.html.md)   for details on how to build a configurable dashboard.
- #### Content

  The content area is where [board items](/patterns/general/service-dashboard/configurable-dashboard/index.html.md)   are featured. The board items hosts different content types such as tables, charts, and lists.  

  Follow the guidelines for [configurable items](/patterns/general/service-dashboard/dashboard-items/index.html.md)   for details on types of content to feature in a dashboard.

### States

- #### Empty state

  An empty state occurs when users have deleted all board items, or a configuration is needed in order to display items. Include actions to trigger the population of items in the component. For example: a button that allows new dashboard items to be added.  

  Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Set all of `liveAnnouncement*`   values in `i18nStrings`   object to provide texts for announcing reorder and resize interactions. Board item movements will be announced using values from this property.
- Provide `i18nStrings.navigationAriaLabel`   and `i18nStrings.navigationItemAriaLabel`   to annotate keyboard navigation helper elements.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
