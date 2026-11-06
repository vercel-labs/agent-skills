---
scraped_at: '2026-04-20T08:46:55+00:00'
section: components
source_url: https://cloudscape.design/components/board-item/index.html.md
title: Board item
---

# Board item

A board item is a self-contained user interface (UI) element living within a board.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/board-components/tree/main/src/board-item) [Configurable dashboard demo](/examples/react/configurable-dashboard.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/board-item/index.html.json)

## Development guidelines

### Installing board components

This component comes from the new `@cloudscape-design/board-components` NPM module. Make sure to add this module to your dependencies.

#### Usage

The board item component must be used within the `renderItem` callback of the [board](/components/board/index.html.md) or [items palette](/components/items-palette/index.html.md) components.

This component is a part of configurable dashboard pattern. For more details on the expected usage, see the [pattern article](/patterns/general/service-dashboard/configurable-dashboard/index.html.md).

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

BoardItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findDragHandle | [ComponentWrapper](/index.html.md)<HTMLElement> | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findResizeHandle | [ComponentWrapper](/index.html.md)<HTMLElement> | - | - |
| findSettings | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

BoardItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDragHandle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findResizeHandle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSettings | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Design your board item content so that the default is to show all content based on your user needs.
- Treat a board item as an executive summary with only the most important information featured as an overview.
- Ensure the user is not overwhelmed by information or functionality that could be better supported on a separate page or application.

### Don't

- Don't feature more than one action in the header. If you need more actions, place these in an [icon dropdown](/components/button-dropdown/index.html.md)  .
- Don't introduce complex interactivity in your board items, such as complex filtering on a table or a graph. Instead, link to a page where users can carry out this action.
- Don't use expandable footers.

## Features

- #### Types

  There are two types of configuration with a board item. These can be configured to create the items that live within the [configurable dashboard layout](/patterns/general/service-dashboard/configurable-dashboard/index.html.md)   and [item palette](/components/items-palette/index.html.md)  .  

**Dashboard item**  
  This gives the user the ability to move a board item and to increase its size by using the re-size action. Follow the guidelines for [dashboard items](/patterns/general/service-dashboard/dashboard-items/index.html.md)  .  

**Palette item**  
  When a board item is placed within an item palette the content should be kept to a minimum. Follow the guidelines for [configurable dashboard layout](/patterns/general/service-dashboard/configurable-dashboard/index.html.md)  .
- #### Sizes

  Board items can have different sizes depending on the content they need to represent.  

**Dashboard items**  

  - S - takes up 1 / 4 columns of board layout
  - M - takes up 2 / 4 columns of board layout
  - L - takes up 3 / 4 columns of board layout
  - XL - takes up 4 / 4 columns of board layout

  Follow the guidelines for [dashboard items](/patterns/general/service-dashboard/dashboard-items/index.html.md)   and [board](/patterns/general/service-dashboard/configurable-dashboard/index.html.md)  .  

**Palette items**  

  Takes up the available width in the item palette. See [item palette](/components/items-palette/index.html.md)   for more details.
- #### Header

  Use the header to display the title of the board item. Additionally, you can include information that applies to the entire content of the item, such as description, counter, or an info link.  

  Use the h2 variant of the [header](/components/header/index.html.md)   component for board items.  

  When combining multiple content types into one board item where it requires additional titles, use the h3 variant of the header component.
- #### Actions - optional

**Dashboard item**  
  Add actions as a [button](/components/button/index.html.md)   or icon [button dropdowns](/components/button-dropdown/index.html.md)   if users can perform actions on the underlying content. Feature one key action in the header and then place additional actions in the icon button dropdown.  

  - [Normal button](/components/button/index.html.md)     - Use this for a key user action that applies to the underlying content.
  - [Icon button dropdown](/components/button-dropdown/index.html.md)     - Sets of actions grouped together under one button. The icon button dropdown is fixed to the top right of the container.
  - **Preferences **     - Allows users to manage the display of the board item content for properties such as visible or hidden content sections. This action opens the [Preferences](/components/collection-preferences/index.html.md)     modal.
  - **Resize **     - Providing the user with the ability to change the size of the item to show and hide content.
  - **Drag - **     Allows users to move a board item within the board.

**Palette item**  
  Only include a drag action to allow users to add items to the board. Avoid additional actions and other elements to conserve space.
- #### Filtering - optional

**Dashboard item**  
  Filtering allows users to find a specific item. Supported filter types are [text filtering](/components/text-filter/index.html.md)   , [select](/components/select/index.html.md)   and [date](/components/date-picker/index.html.md)   or [date range picker](/components/date-range-picker/index.html.md)   . For example, filtering all data within a board item content by a date range.  

**Palette item**  
  Do not include filtering.
- #### Content

**Dashboard item**  
  The area for primary container content. Common content types of a container are:  

  - [Tables](/components/table/index.html.md)     - Display a collection of items in a tabular format.    

    - Board items introduce overflow to ensure table content remains accessible in responsive layouts.
  - [Key-value pairs](/components/key-value-pairs/index.html.md)     - Display key-value pairs that can, for example, describe a single items's configuration.
  - [Charts](/components/charts/index.html.md)     - Display data visualizations. These can be line, area, or pie charts.    

    - To ensure charts adjust to their container, set the `fitHeight`       property to `true`       . You can use the `height`       property to define the minimum allowed height in pixels.
  - Lists - Display a list of consecutive items displayed one below the other.

  You can feature more than one type of content in a board item. For example, pairing a chart showing cost breakdown over time and a table showing service and cost breakdown.  

**Palette item**  
  Do not include any real content within an item featured in the palette. Instead provide:  

  - Optional image. For example, a service icon.
  - Optional description giving an overview of what the widget contains and its benefits.
- #### Footer - optional

  Use a footer for secondary content. For example, a view all link that takes the user to a new page with the complete items list.  

**Item palette**   Place tags in the footer indicating what type of content is featured. For example, a table or line chart.

### States

- #### Empty state

  An empty state occurs when users haven't created an item, have deleted all items, or a configuration is needed in order to display content. Include actions to trigger the population of data in the component. For example, a button that allows for cross-service navigation to set up alarms.  

  Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .
- #### Error state

  State when a problem occurred fetching items. Provide thorough explanations for errors, suggestions, and actions on how to remedy.  

  Supported with an [alert](/components/alert/index.html.md)   to notify the user in case of request timed-out or no access.
- #### Loading state

  The state when data is loading. Follow the guidelines for [loading and refresh](/patterns/general/loading-and-refreshing/index.html.md)  .

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

#### Board item header

- Follow the writing guidelines for [header](/components/header/index.html.md)  .

#### Text filters

- Follow the writing guidelines for [text filters](/components/text-filter/index.html.md)  .

#### Board item content

- **Charts: **   Follow the writing guidelines for [charts](/components/charts/index.html.md)  .
- **Tables: **   Follow the writing guidelines for [tables](/components/table/index.html.md)  .

#### Custom messages

- Use active voice wherever possible. Use passive voice only to avoid blaming users.  

  - For example:    

    - *View details*
    - *Preferences*
    - *Remove*
- Follow the writing guidelines for [button](/components/button/index.html.md)  .

#### Empty states

- Follow the writing guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .

#### Zero results

- Use concise and clear language for your custom message in cases of zero results resulting from the text filter.
- Follow the writing guidelines for [zero results](/patterns/general/empty-states/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Provide alternative texts for drag and resize handles using `i18nStrings.dragHandleAriaLabel`   and `i18nStrings.resizeHandleAriaLabel`  .

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
