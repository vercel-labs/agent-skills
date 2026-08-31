---
scraped_at: '2026-04-20T08:47:11+00:00'
section: components
source_url: https://cloudscape.design/components/cards/index.html.md
title: Cards
---

# Cards

Represents a collection of items.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/cards) [View in demo](/examples/react/cards.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/cards/index.html.json)

## Development guidelines

#### Providing unique keys for items

React recommends providing [key property](https://reactjs.org/docs/lists-and-keys.html) for improved re-rendering of list items. By default our component uses array indexes as keys, which work for simple use-cases, but it may [lead to issues](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318).

To improve items tracking and rendering, you need to specify keys in two dimensions:

- Card item - by using the `trackBy`   property.
- Section in each card - by specifying an `id`   property for section in `cardDefinition`  .

#### Cards features

In its basic usage, the cards component simply allows to display a list of items as a set of containers. It is possible to add extra features to enhance the customer experience: [text-filtering](/components/text-filter/index.html.md) and [pagination](/components/pagination/index.html.md).

Each of these features can be configured in different ways. In particular, two different patterns emerge:

- Cards with client-side operations: when the list of items to display is not too big, these items can be fetched in their entirety. Filtering and pagination can hence be done synchronously on the client side. This can be implemented using [collection hooks](/get-started/dev-guides/collection-hooks/index.html.md)   . When you are using collection hooks, make sure that the selection is also controlled by the hook.
- Cards with server-side operations: the list of items to display might be too big, so you want to perform filtering and pagination on the server-side, and load only the visible items on the client side. In this case, the data handling logic will be totally on your side.

#### Selection state management

The selection state of cards component is controlled. Set the `selectedItems` property and the `onSelectionChange` listener to store the selected items in the state of your application. Ensure that you update the resource counter in the cards header. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting cards
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Cards from '@cloudscape-design/components/cards';

describe('<Cards />', () => {
  it('renders the cards component', () => {
    const { container } = render(<Cards />);
    const wrapper = createWrapper(container);

    expect(wrapper.findCards()).toBeTruthy();
  });

  it('selects all cards components', () => {
    const { container } = render(<>
      <Cards />
      <Cards />
      <Cards />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllCards();
    expect(components).toHaveLength(3)
  });
});
```

Selecting multiple cards from the list
```
import Box from '@cloudscape-design/components/box';
import Cards, { CardsProps } from '@cloudscape-design/components/cards';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';

import { render } from '@testing-library/react';
import { useState } from 'react';

const cardItems: CardsProps['items'] = [
  { name: 'Item 1', description: 'This is the first item' },
  { name: 'Item 2', description: 'This is the second item' },
  { name: 'Item 3', description: 'This is the third item' },
  { name: 'Item 4', description: 'This is the fourth item' },
];

const cardDefinition: CardsProps['cardDefinition'] = {
  header: item => item.name,
  sections: [
    {
      id: 'description',
      header: 'Description',
      content: item => item.description,
    },
  ],
};

function Component() {
  const [selectedItems, setSelectedItems] = useState<CardsProps['items']>([]);
  const selectedCardTitles = selectedItems.map(card => card.name).join(', ');

  return (
    <Box>
      <TextContent>Selected card titles: {selectedCardTitles}</TextContent>
      <Cards
        selectedItems={selectedItems}
        items={cardItems}
        cardDefinition={cardDefinition}
        selectionType="multi"
        onSelectionChange={({ detail }) => {
          setSelectedItems(detail.selectedItems);
        }}
      />
    </Box>
  );
}

describe('<Cards />', () => {
  it('selects the second and third cards from the cards list', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const cards = wrapper.findCards()!.findItems();
    cards[1].findSelectionArea()!.click();
    cards[2].findSelectionArea()!.click();
    const selectedCardTitles = wrapper.findTextContent()!.getElement().textContent;

    expect(selectedCardTitles).toBe('Selected card titles: Item 2, Item 3');
  });
});
```

## Unit testing APIs

CardsWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCollectionPreferences | [CollectionPreferencesWrapper](/components/collection-preferences/index.html.md) &#124; null | - | - |
| findEmptyRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Alias for findEmptySlot method for compatibility with previous versions | - |
| findEmptySlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeaderRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Alias for findHeader method for compatibility with previous versions | - |
| findItems | Array<[CardWrapper](/index.html.md)> | - | - |
| findLoadingText | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findPagination | [PaginationWrapper](/components/pagination/index.html.md) &#124; null | - | - |
| findSelectedItems | Array<[CardWrapper](/index.html.md)> | - | - |
| findTextFilter | [TextFilterWrapper](/components/text-filter/index.html.md) &#124; null | - | - | CardWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCardHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSections | Array<[CardSectionWrapper](/index.html.md)> | - | - |
| findSelectionArea | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - | CardSectionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSectionHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

CardsWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCollectionPreferences | [CollectionPreferencesWrapper](/components/collection-preferences/index.html.md) | - | - |
| findEmptyRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Alias for findEmptySlot method for compatibility with previous versions | - |
| findEmptySlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeaderRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Alias for findHeader method for compatibility with previous versions | - |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CardWrapper](/index.html.md)> | - | - |
| findLoadingText | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findPagination | [PaginationWrapper](/components/pagination/index.html.md) | - | - |
| findSelectedItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CardWrapper](/index.html.md)> | - | - |
| findTextFilter | [TextFilterWrapper](/components/text-filter/index.html.md) | - | - | CardWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCardHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSections | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CardSectionWrapper](/index.html.md)> | - | - |
| findSelectionArea | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | CardSectionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSectionHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use icons in cards only to show status. Avoid using other icons in cards where possible.
- Ensure data symmetry. For example, the order of the key-value pairs after the unique identifier and status should match the order of the inputs in the create flow.
- Only use filtering and pagination if there are more than five cards in the collection.
- Use - (hyphen) for any empty values.
- Consider using sticky header in your card collection if users need to take an action on item(s) upon selection.
- Use a sticky header only in card views and table views.
- Always show the total number of items next to the cards collection title.
- Use [header](/components/header/index.html.md)   component to display additional information, such as item counter, info link, action buttons, or description text.
- Only use selection if the user can take action on the items in the collection.
- Disabled items should not be selected. A user should always be able to deselect an item.
- Always provide information on why inactive items are unselectable. For example: show the status of an item as *Pending.*
- Reset item selection across pagination, sorting, filtering, and page size changes to prevent users from performing actions on items they may not know are selected.
- Store all the card preferences when the user leaves the page and restore them when the user comes back to the same page.
- Always include the number of selected items in the header item counter.
- When used within the [app layout](/components/app-layout/index.html.md)   , `full-page`   cards must be the first component in the `content`   slot.
- Cards are dedicated to collections only. Use the [container](/components/container/index.html.md)   component with media to present a card-like container with an image.
- Use the [primary link](/components/link/index.html.md)   variant instead of the [secondary link](/components/link/index.html.md)   variant in cards to help users distinguish links from other surrounding text content.
- Make sure that the cards per row property includes a single column breakpoint for mobile viewports.

### Don't

- Don't use cards within a container.
- Don't use sticky header in cards without actions in the [header](/components/header/index.html.md)  .
- Don't use sticky header for continuous scrolling. We strongly recommend using [pagination](/components/pagination/index.html.md)   to give users an easy and consistent access to all items without scroll.
- Don't show the number of selected items if nothing has been selected. For example, 0/150 should never be displayed.
- Don't use full card selection when there are interactive elements within a card.

## Features

- #### Variant

  There are two types of cards available:  

  - **Default**    

    - The default variant renders the cards header within a container.
  - **Full page**    

    - This variant takes up the full page. Use for presenting and managing cards on a standalone page. We also suggest enabling the sticky header and using the "awsui-h1-sticky" `variant`       of the [header](/components/header/index.html.md)       with this variant, so the title reduces its size on scroll. For further context, see the [card view demo](/examples/react/cards.html)       and the [card view](/patterns/resource-management/view/card-view/index.html.md)       pattern.
- #### Header

  The header is an area to place descriptive content and actions applicable to the entire items collection. These can include a title, item counter, and action stripe.  

  - **Collection title **    

    - The collection title is a short noun phrase describing the contents of the collection.
    - Use the h1 variant of the [header](/components/header/index.html.md)       component to display the title of full page collection in card view.      

      - For example: When used as a [full page card view](/examples/react/cards.html)        .
    - Use the h2 variant of the [header](/components/header/index.html.md)       component in the container header of the default cards variant.
  - **Item counter **    

    - The item counter is a number next to the title that shows the total number of items in a collection, in parentheses.      

      - For example: *(150)*
    - If the total number of items is unknown, include a plus sign (+) after the known number, indicating that more items exist.
    - If the table is in loading state, don't display the item counter.
    - The number of selected items are listed before number of total items, using a forward slash (/) to separate the two values. Use the format: ([number of selected items]/[number of total items])      

      - For example: *(1/150)*
    - The counter slot in the header component is designed to provide counter functionality in this component.
- #### Sticky header - optional

  A sticky header keeps the collection header and features at the top of the page when a user scrolls down the page. Enabling this property lets users perform actions in context, such as using the action stripe, selecting items, filtering, and using pagination. Use the [awsui-h1-sticky](/components/header/index.html.md)   header variant when the full page cards header is set to sticky. The title size is then automatically reduced on scroll to conserve space.  

  If users need to take an action on items upon selection, consider using a sticky header in your card collection.  

  Sticky header is not supported on mobile viewport sizes.
- #### Features

  Features are additional attributes that can be added to support more complex collections, such as those with many items. Features include:  

  - **Filtering:**     Filtering allows users to find a specific item, or a subset of items, using one of three [filtering mechanisms](/patterns/general/filter-patterns/index.html.md)     : [text filtering](/components/text-filter/index.html.md)     , [collection select filter](/components/collection-select-filter/index.html.md)     , or [property filter](/components/property-filter/index.html.md)    .
  - **Pagination:** [Pagination](/components/pagination/index.html.md)     allows users to paginate through a collection.
  - **Preferences:** [Preferences](/components/collection-preferences/index.html.md)     allow users to manage the display of the cards for properties like visible sections and page size.
- #### Cards per row

  Use this property to specify the number of cards per row for any interval of container width. You can set the maximum number of cards in each row for very wide screens. The maximum number of cards per row is 20.
- #### Selection types - optional

  - **None**     - default    

    - Prevents users from selecting any items from the collection.
  - **Multi**    

    - Allows multiple items to be selected at a time, by using checkboxes in each card item.
    - Includes the ability for users to select groups of items by using `shift + click`       or `shift + space`       to select items between ranges.
    - Use for collections that support bulk actions.
  - **Single**    

    - Allows a single item to be selected, by using a radio button in each card item.
    - Use for collections that don't support bulk actions.
  - **Full card selection**    

    - Enables the entire card to be selectable when there are no interactive elements within a card. This makes the selection easier by increasing the selection target area. Full card selection can be used with Multi or Single card selection.
- #### Disabled items - optional

  The selection on any item can be inactive. When an item is inactive, a user won't be able to select it.

### States

- #### Loading

  The state of the component while the dataset is being loaded before being displayed. Follow the guidelines for [loading states](/patterns/general/loading-and-refreshing/index.html.md)   in table and cards.
- #### No match

  The state of the collection of items after a user applies a filter that doesn't return any results. Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)   zero results.
- #### Empty

  The state of the component when there are no items to display. Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)   in table and cards.

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

#### Cards title

- Use nouns to describe what the table contains.  

  - For example: *Resources*     or *Distributions*

#### Cards description

- Follow the writing guidelines for [table description](/components/table/index.html.md)  .

#### Item counter

- When no items are selected, use the format: *(\[number of items in the collection\])*  

  - For example: *(340)*
- If the total number of items is unknown and you only know a subset, use the format: *(\[number of known items in the collection\]\+)*  

  - For example: *(1000\+)*
- When at least one item is selected, use the format: *(\[number of selected items\]/\[number of total items\])*  

  - For example:* (1*     / *500)*

#### Loading state

- When the table is in a loading state, make sure to add a loading text as well.
- Follow the guidelines for [loading and refreshing](/patterns/general/loading-and-refreshing/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
