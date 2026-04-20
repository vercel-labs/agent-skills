---
scraped_at: '2026-04-20T08:48:16+00:00'
section: components
source_url: https://cloudscape.design/components/header/index.html.md
title: Header
---

# Header

Summarizes the content that's displayed under it and provides a space for optional action buttons.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/header)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/header/index.html.json)

## Development guidelines

This component is intended to work together with other components. You can find more usage examples in other documentation pages:

- [Container](/components/container/index.html.md)
- [Cards](/components/cards/index.html.md)
- [Table](/components/table/index.html.md)

If you want to place multiple buttons in the `actions` slot, use the [space between](/components/space-between/index.html.md) component with size `xs` to add horizontal spacing between them.

If you want to place a page header before a container, use the [space between component](/components/space-between/index.html.md) with size `m` to add vertical spacing between them.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting header
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Header from '@cloudscape-design/components/header';

describe('<Header />', () => {
  it('renders the header component', () => {
    const { container } = render(<Header />);
    const wrapper = createWrapper(container);

    expect(wrapper.findHeader()).toBeTruthy();
  });

  it('selects all header components', () => {
    const { container } = render(<>
      <Header />
      <Header />
      <Header />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllHeaders();
    expect(components).toHaveLength(3)
  });
});
```

Selecting the header title
```
import Header from '@cloudscape-design/components/header';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

describe('<Header />', () => {
  it('selects the heading text', () => {
    const { container } = render(<Header counter="10">Page title</Header>);
    const wrapper = createWrapper(container);
    const headingText = wrapper.findHeader()!.findHeadingText().getElement();
    const counterText = wrapper.findHeader()!.findCounter()!.getElement();

    expect(headingText.textContent).toBe('Page title');
    expect(counterText.textContent!.trim()).toBe('10');
  });
});
```

Interacting with the header actions
```
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';

import { render } from '@testing-library/react';
import { useState } from 'react';

function Component() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <Box>
      {isClicked ? <TextContent>Action button clicked</TextContent> : null}
      <Header actions={<Button onClick={() => setIsClicked(true)}>Action button</Button>}>Page title</Header>;
    </Box>
  );
}

describe('<Header />', () => {
  it('clicks the header action button', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);
    const header = wrapper.findHeader()!;

    header.findActions()!.findButton()!.click();

    expect(wrapper.findTextContent()!.getElement().textContent).toBe('Action button clicked');
  });
});
```

## Unit testing APIs

HeaderWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findCounter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeadingText | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

HeaderWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findCounter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeadingText | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use h1 for page headers, h2 for container headers, and h3 for other sections or subsections.
- Use header variants according to their importance and information hierarchy.
- Include action stripes if users can perform actions on the content below, such as tables, card views, detail pages, and containers.

## Features

- #### Variant

  The header component is available in three sizes: h1 (page level), h2 (container level), and h3 (section level).
- #### Title

  A title is a piece of text that summarizes the content below.
- #### Description - optional

  Since descriptions in the UI directly impact content density, only share information necessary for the user to inform their action in the corresponding section or element. Ensure that links in the description use the [primary link](/components/link/index.html.md)   variant.  

  Follow UX guidelines and writing guidelines for description content in [help system.](/patterns/general/help-system/index.html.md)
- #### Buttons - optional

  Add actions as [buttons](/components/button/index.html.md)   or [button dropdowns](/components/button-dropdown/index.html.md)   if users can perform actions on the underlying content. For multiple button elements, use the [space between](/components/space-between/index.html.md)   component to properly space the buttons from one another.  

**Order of actions**  

  The order of buttons is important when action is required on a data set. It follows the order of major actions that can be performed on items.  

  - Place buttons in this order: *View details, Edit, Delete, Create \[resourcename\]*    .
  - Add other action buttons between the *Edit*     and *Delete*     buttons.
  - Add other *Create*     buttons between the primary *Create*     button and the *Delete*     button.
  - Place status actions at the far left in the action stripe.    

    - For example:* Deactivate, Activate, Status 3, View details, Edit, Delete, Create \[resourcename\]*       , and so on.

**Number of actions**  

  - For less than five actions, use individual buttons.    

    - For example:* Delete*
  - For five or more actions, use a button dropdown to collapse non-primary actions.

  On mobile viewports with more than one non-primary action, consider moving these actions into a button dropdown to conserve space.  For more information on responsive behavior, see [responsive design.](/foundation/core-principles/responsive-design/index.html.md)  

**Pagination and preferences**  

  - When a table does not have filtering or header actions, place pagination and collection preferences components in the actions slot, instead of the corresponding slots on the table. If using both, use a [space between](/components/space-between/index.html.md)     component to properly space them.    

    - This will ensure that there is no unused space in the table header.
- #### Counter - optional

  - The counter is a number next to the title that shows the total number of items in a collection. If a selection is active, such as in a table or cards, the counter should also show the total number of items selected.
  - The number of selected items are listed before the number of total items, using a forward slash (/) to separate the two values. Use the format: ([number of selected items]/[number of total items])    

    - For example: *(1/150)*
  - For item counters in tables, [follow the guidelines](/components/table/index.html.md)    .
- #### Info - optional

  The area to render an [info link](/patterns/general/help-system/index.html.md)   . Use an info link on h1 headers to display default page-level help panel content.  

  For more information about using the help panel, follow the guidelines for [help system](/patterns/general/help-system/index.html.md)  .

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

#### Title

- Keep headings short. Aim for a maximum of three words.
- Don't use terminal punctuation.
- Use action words and present-tense verbs.  

  - For example:    

    - *Get started*
    - *Create resource*

#### Description

- Descriptions should have end punctuation, with the only exception being if a description ends with an external link icon, which should not have a period after it.
- Follow UX guidelines and writing guidelines for description content in [help system.](/patterns/general/help-system/index.html.md)

#### Actions

- Use the generic titles for the Read, Update, and Delete actions:  

  - *View details*
  - *Edit*
  - *Delete*
- For most create actions, use the format: *Create \[resourcename\]*   . You can use a different verb where appropriate.  

  - For example:    

    - *Create bucket*
    - *Activate zone awareness*
    - *Launch instance*
- Don't include articles ( *a*   , *an*   , or *the*   ) in button labels.
- Follow the writing guidelines for [button](/components/button/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Info links

- Info links (that is, `<Link variant="info">`   ) within a header component automatically have the header title appended to their accessible name. If this doesn't sufficiently describe the purpose of the link, provide additional context via an `ariaLabel`.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
