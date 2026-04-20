---
scraped_at: '2026-04-20T08:49:42+00:00'
section: components
source_url: https://cloudscape.design/components/text-filter/index.html.md
title: Text filter
---

# Text filter

With a text filter, users can enter text that's used to match specific items in a collection.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/text-filter)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/text-filter/index.html.json)

## Development guidelines

This component does not perform filtering operations, only shows the UI. If you want to perform filtering operations on your data, consider using [collection hooks](/get-started/dev-guides/collection-hooks/index.html.md).

#### State management

The text filter component is controlled. Set the `filteringText` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

TextFilterWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findInput | [InputWrapper](/components/input/index.html.md) | - | - |
| findResultsCount | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
## Integration testing APIs

TextFilterWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findInput | [InputWrapper](/components/input/index.html.md) | - | - |
| findResultsCount | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use the text filter to provide basic filtering in a collection. The most common use cases are [table](/components/table/index.html.md)   and [card](/components/cards/index.html.md)   collections.
- Always use the filter functionality on the full collection of items, not just on visible or loaded items.
- After a user completes a filter action, display the number of results next to the filter input.

### Don't

- Don't use a filter if most of your users have a small collection of items (fewer than five items).
- Don't use a text filter for collections that have a large set of values; use the [property filter](/components/property-filter/index.html.md)   instead.
- Don't use a text filter in combination with the [property filter](/components/property-filter/index.html.md)   pattern. Use only the property filter.

## Features

- #### Clear filter

  Removes the filter that is applied to a collection of items by removing typed characters or by clearing the field. This action sets the collection view back to the default.
- #### Results counter

  - The results counter displays the number of items that match the specified filter values.    

    - For example:* 28 matches*
  - The results count number will only show when text has been added to the input.

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

- Don't use terminal punctuation.

#### Results counter

- Don't use terminal punctuation.
- If there are no matches, use this text: *0 matches*
- If there are matches, use the format: *\[number of results\] matches*  

  - For example: *28 matches*
- If the total number of results is unknown, include an indication that there may be more results than the number listed.  

  - For example:* 25\+ matches*

#### Loading state

- Follow the writing guidelines for [loading state](/patterns/general/loading-and-refreshing/index.html.md)  .

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

- Provide alternative text for the filtering input through the `filteringAriaLabel`   property according to the alternative text guidelines. The label should be a combination of a verb that describes filtering in the user's locale and the name of the item type exactly as displayed in the header of the table or cards collection.
- Make sure that you use the same labeling convention throughout your application to promote discoverability.  

  - For example:* Find resources*

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
