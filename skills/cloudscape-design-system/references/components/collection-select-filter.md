---
scraped_at: '2026-04-20T08:47:30+00:00'
section: components
source_url: https://cloudscape.design/components/collection-select-filter/index.html.md
title: Collection select filter
---

# Collection select filter

A select filter helps users find specific items in a collection by choosing one or two properties.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [View in demo](/examples/react/table-select-filter.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/collection-select-filter/index.html.json)

## Preview

## Features

- #### Properties

  Display the most pertinent properties that users need to find an item in a collection. Most commonly, those properties refer to the column headers for [table view](/patterns/resource-management/view/table-view/index.html.md)   and content labels for a [cards view](/patterns/resource-management/view/card-view/index.html.md)  .  

  We don't recommend using more than two collection select filters. Used in combination, the two filters behave as an And operator.
- #### Values

  - Using the [select filter](/components/select/index.html.md)     , list all finite values that correspond to the property.    

    - For example: **Property: Status**       ; Values: Error, Loading, Pending, Stopped, and Success.
  - Use Any {property} as the default pre-selected option. It takes into account any values that correspond to that property. The collection isn't filtered and displays all items.
  - Follow the guidelines for the [select](/components/select/index.html.md)     component.

### Collection view

- #### Displaying results

  The collection is filtered as soon as the user selects a value from a select filter or enters text into the accompanying [text filter](/components/text-filter/index.html.md)   . Only items that match the conditions of the values are displayed. For example: *Engine*   set to *Aurora*   and *Status*   set to *available*   will show the available resources that are running the Aurora engine*.*
- #### Loading state

  The state of the collection of items, such as [table](/components/table/index.html.md)   or [cards](/components/cards/index.html.md)   , while the filtered dataset is being loaded. Follow the guidelines for [loading state](/patterns/general/loading-and-refreshing/index.html.md)   for collections.
- #### No match state

  The state of the collection of items, such as [table](/components/table/index.html.md)   or [cards](/components/cards/index.html.md)   , after a user applies a filter that does not return any results. In other words, the state when there are no items that match the filters applied. Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .

## General guidelines

### Do

- Always use the filter functionality on the full collection of resources, not just on visible or loaded resources.
- Always display the number of matched resources. In table and card views, the count is shown next to the title in the table header.
- Use a select ﬁlter for commonly used properties and values.
- Always provide a visible label for every select filter to improve accessibility. Labels are optional for open text filters when a search icon is included in the control.
- After a user completes a filter action, display the number of results next to the select filters.
- Use a select filter if users need a maximum of two properties to find a specific item. If more than two are required, use a property filter instead.
- If a select filter has two properties, the operator is always *and*   . If you need more operators to combine properties, use a property filter instead.

### Don't

- Don't use ﬁltering if the majority of your users operate on small collections of resources (fewer than ﬁve resources).
- Don't use a select ﬁlter for collections that have a very large set of values.
- Don't use a select ﬁlter if users need to select multiple values that correspond to one property. Use a property filter instead.
- Don't change the control for the selection mechanism. Always use a [select](/components/select/index.html.md)   component.
- Don't change table column headers after a user has completed a filter action.

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

#### Placeholder text

- Follow the writing guidelines for [placeholder text](/components/input/index.html.md)  .
- Don't use terminal punctuation.

#### Label

- Follow the writing guidelines for [select](/components/select/index.html.md)  .

#### Select

- Follow the writing guidelines for [select](/components/select/index.html.md)  .

#### Results counter

- Follow the writing guidelines for [table resource counter](/components/table/index.html.md)  .

#### Loading state

- Follow the writing guidelines for [loading and refreshing](/patterns/general/loading-and-refreshing/index.html.md)  .

#### No match state

- Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Follow the accessibility guidelines for [select](/components/select/index.html.md)  .

#### Label

- Provide a visible label using `inlineLabelText`   property   for filter controls to specify the parameter the dataset is filtered by.  

  - For example: *Filter engine*     , or *Filter class*    .

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
