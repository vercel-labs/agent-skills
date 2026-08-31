---
scraped_at: '2026-04-20T08:48:29+00:00'
section: components
source_url: https://cloudscape.design/components/item-card/index.html.md
title: Item card
---

# Item card

With the item card, you can display a single piece of content in a structured, visual format.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/item-card) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/item-card/index.html.json)

## Unit testing examples

Selecting item card
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import ItemCard from '@cloudscape-design/components/item-card';

describe('<ItemCard />', () => {
  it('renders the item-card component', () => {
    const { container } = render(<ItemCard />);
    const wrapper = createWrapper(container);

    expect(wrapper.findItemCard()).toBeTruthy();
  });

});
```

Finding item card slots
```
import ItemCard from '@cloudscape-design/components/item-card';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

describe('<ItemCard />', () => {
  it('finds the header, content, description, and footer slots', () => {
    const { container } = render(
      <ItemCard header="Card header" description="Card description" footer="Card footer">
        Card content
      </ItemCard>
    );
    const wrapper = createWrapper(container);
    const itemCard = wrapper.findItemCard()!;

    expect(itemCard.findHeader()!.getElement().textContent).toContain('Card header');
    expect(itemCard.findDescription()!.getElement().textContent).toContain('Card description');
    expect(itemCard.findContent()!.getElement().textContent).toContain('Card content');
    expect(itemCard.findFooter()!.getElement().textContent).toContain('Card footer');
  });

  it('finds the actions slot', () => {
    const { container } = render(
      <ItemCard header="Card header" actions={<button>Edit</button>}>
        Card content
      </ItemCard>
    );
    const wrapper = createWrapper(container);
    const itemCard = wrapper.findItemCard()!;

    expect(itemCard.findActions()).toBeTruthy();
    expect(itemCard.findActions()!.getElement().textContent).toBe('Edit');
  });
});
```

Finding all item cards
```
import ItemCard from '@cloudscape-design/components/item-card';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

describe('<ItemCard />', () => {
  it('finds all item cards on the page', () => {
    const { container } = render(
      <>
        <ItemCard header="First card">First card content</ItemCard>
        <ItemCard header="Second card">Second card content</ItemCard>
        <ItemCard header="Third card">Third card content</ItemCard>
      </>
    );
    const wrapper = createWrapper(container);

    const allItemCards = wrapper.findAllItemCards();

    expect(allItemCards).toHaveLength(3);

    expect(allItemCards[0].findHeader()!.getElement().textContent).toBe('First card');
    expect(allItemCards[1].findHeader()!.getElement().textContent).toBe('Second card');
    expect(allItemCards[2].findHeader()!.getElement().textContent).toBe('Third card');
  });
});
```

## Unit testing APIs

ItemCardWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the action slot of the item card. | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the content slot of the item card. | - |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the description slot of the item card. | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the footer slot of the item card. | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the header slot of the item card. | - |
| findIcon | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the icon slot of the item card. | - |
## Integration testing APIs

ItemCardWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the action slot of the item card. | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the content slot of the item card. | - |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the description slot of the item card. | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the footer slot of the item card. | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the header slot of the item card. | - |
| findIcon | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the icon slot of the item card. | - |
## General guidelines

### Do

- Use the item card to display an individual item, such as a file, a resource, a product, or an AI-generated artifact.
- Use the default variant for items that appear directly on the background of the main application.
- Use the embedded variant for items such as a file or AI-generated artifacts that are nested inside other components, such as a [container](/components/container/index.html.md)  .

### Don't

- Don't place containers inside item cards. You can nest embedded item cards within [containers](/components/container/index.html.md)   to group related items, but not the other way around.
- Don't use an item card to display complex data that is representative of many resources such as [tables](/components/table/index.html.md)   or [charts](/components/charts/index.html.md)   . Use a [container](/components/container/index.html.md)   instead.
- Don't use the default variant inside containers.
- Don't use item cards as generic layout wrappers.

## Features

- #### Variant

  - **Default: **     Used at the top level of a page or layout to represent discrete objects or entities that users interact with as individual items.
  - **Embedded: **     Used when nested inside other components like containers to display individual items.
- #### Header - optional

  Use the header to display the title of the item card.
- #### Description - optional

  Can be used to display secondary content that applies to the entire content of the item card such as a description or metadata.
- #### Content - optional

  The area for primary item card content.
- #### Actions - optional

  Add actions as icon [buttons](/components/button/index.html.md)   or [button dropdowns](/components/button-dropdown/index.html.md)   if users can perform actions on the underlying content.
- #### Icon - optional

  Can be used to visually reinforce the item card content, using a non-interactive [icon](/foundation/visual-foundation/iconography/index.html.md)  .
- #### Footer - optional

  Use a footer for tertiary content.

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

#### Component-specific guidelines

- When using an image as content, provide alternative text that describes the function or purpose of the image. Ideally, the alternative text should provide instructive information that would be missed if a person cannot see the image. If the image is purely decorative, use the respective ARIA presentation role instead.  

  - If the image is accompanied by text in the item card that describes it sufficiently, there is no need to add alternative text to the image itself.
  - When providing alternative text, make sure to follow the [alternative text guidelines](/foundation/core-principles/accessibility/index.html.md)    .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
