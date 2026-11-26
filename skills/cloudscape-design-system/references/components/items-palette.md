---
scraped_at: '2026-04-20T08:48:31+00:00'
section: components
source_url: https://cloudscape.design/components/items-palette/index.html.md
title: Items palette
---

# Items palette

Provides the ability to add board items to a board layout when combined with discreet split panel.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/board-components/tree/main/src/items-palette) [Configurable dashboard demo](/examples/react/configurable-dashboard.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/items-palette/index.html.json)

## Development guidelines

### Installing board components

This component comes from the new `@cloudscape-design/board-components` NPM module. Make sure to add this module to your dependencies.

#### Usage

This component does not have its own state. Use `onItemsChange` handler on the [board](/components/board/index.html.md) component to handle added items from items palette to the main board

This component is a part of configurable dashboard pattern. For more details on the expected usage, see the [pattern article](/patterns/general/service-dashboard/configurable-dashboard/index.html.md).

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

ItemsPaletteWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItemById | [PaletteItemWrapper](/index.html.md) &#124; null | - | itemId: |
| findItems | Array<[PaletteItemWrapper](/index.html.md)> | - | - | PaletteItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDragHandle | [ComponentWrapper](/index.html.md)<HTMLElement> | - | - |
## Integration testing APIs

ItemsPaletteWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItemById | [PaletteItemWrapper](/index.html.md) | - | itemId: |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PaletteItemWrapper](/index.html.md)> | - | - | PaletteItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDragHandle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Include the item palette in the discreet split panel.

## Features

The item palette is placed within the [discreet split panel](/components/split-panel/index.html.md) to provide the ability for users to add items to a [board layout](/components/board/index.html.md).

- #### Content area

  The content area houses palette items that can be added into the board layout. These provide users the details of the board item and the ability to drag it onto the board. Follow the guidelines for [board items](/components/board-item/index.html.md)  .

### States

- #### Empty state

  A palette's empty state occurs when there are no board items available. Include actions to trigger the creation or processes to make items available. For example, a button that allows users to create a board item.  

  Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .
- #### Error state

  When a problem occurs fetching items show an error alert.

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
