---
scraped_at: '2026-04-20T08:47:01+00:00'
section: components
source_url: https://cloudscape.design/components/breadcrumb-group/index.html.md
title: Breadcrumb group
---

# Breadcrumb group

Displays a series of navigational links in a hierarchical list.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/breadcrumb-group) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/breadcrumb-group/index.html.json)

## Unit testing examples

Selecting breadcrumb group
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';

describe('<BreadcrumbGroup />', () => {
  it('renders the breadcrumb-group component', () => {
    const { container } = render(<BreadcrumbGroup />);
    const wrapper = createWrapper(container);

    expect(wrapper.findBreadcrumbGroup()).toBeTruthy();
  });

  it('selects all breadcrumb-group components', () => {
    const { container } = render(<>
      <BreadcrumbGroup />
      <BreadcrumbGroup />
      <BreadcrumbGroup />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllBreadcrumbGroups();
    expect(components).toHaveLength(3)
  });
});
```

Selecting a breadcrumb item
```
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

const breadcrumbItems = [
  { text: 'System', href: '/' },
  { text: 'Components', href: '/components' },
  { text: 'Breadcrumb group', href: '/components/breadcrumb-group' },
];

describe(`<BreadcrumbGroup />`, () => {
  it('selects the breadcrumb link from a group by its index', () => {
    const { container } = render(<BreadcrumbGroup items={breadcrumbItems} />);
    const wrapper = createWrapper(container);

    const secondBreadcrumbItem = wrapper.findBreadcrumbGroup()!.findBreadcrumbLink(2)!.getElement();

    expect(secondBreadcrumbItem.textContent).toBe('Components');
  });
});
```

Navigating to breadcrumb link
```
import Box from '@cloudscape-design/components/box';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';

import { render } from '@testing-library/react';
import { useState } from 'react';

const breadcrumbItems = [
  { text: 'System', href: '/' },
  { text: 'Components', href: '/components' },
  { text: 'Breadcrumb group', href: '/components/breadcrumb-group' },
];

const Component = () => {
  const [selectedBreadcrumbLink, setSelectedBreadcrumbLink] = useState('Nothing yet');

  return (
    <Box>
      <TextContent>Selected breadcrumb link: {selectedBreadcrumbLink}</TextContent>
      <BreadcrumbGroup onFollow={({ detail }) => setSelectedBreadcrumbLink(detail.href)} items={breadcrumbItems} />
    </Box>
  );
};

describe(`<BreadcrumbGroup />`, () => {
  it('selects the breadcrumb link from a group by its index', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findBreadcrumbGroup()!.findBreadcrumbLink(2)!.click();
    const textContent = wrapper.findTextContent()!.getElement();

    expect(textContent.textContent).toBe('Selected breadcrumb link: /components');
  });
});
```

## Unit testing APIs

BreadcrumbGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findBreadcrumbLink | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns an item for a given index. Note that this may return the 'current' page item for backwards compatibility,even though it is not technically a link. | index:1-based item index |
| findBreadcrumbLinks | Array<[ElementWrapper](/index.html.md)> | Returns all breadcrumb items. Note that this includes the 'current' page item for backwards compatibility,even though it is not technically a link.To find a specific item use the findBreadcrumbLink(n) function as chaining findBreadcrumbLinks().get(n) can return unexpected results. | - |
| findDropdown | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) &#124; null | - | - |
## Integration testing APIs

BreadcrumbGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findBreadcrumbLink | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns an item for a given index. Note that this may return the 'current' page item for backwards compatibility,even though it is not technically a link. | index:1-based item index |
| findBreadcrumbLinks | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Returns all breadcrumb items. Note that this includes the 'current' page item for backwards compatibility,even though it is not technically a link.To find a specific item use the findBreadcrumbLink(n) function as chaining findBreadcrumbLinks().get(n) can return unexpected results. | - |
| findDropdown | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) | - | - |
## General guidelines

### Do

- The first, or parent, breadcrumb must always start with the service navigation and return the user to the application homepage.
- Use breadcrumbs to reflect the information architecture of an application, not a historical trail. A page is always identified by one and the same breadcrumb.

## Features

- #### Navigation

  Each breadcrumb item should be a link that takes the user to the page named by the breadcrumb item text. Exception: The breadcrumb item for the page the user is currently viewing should be inactive (not contain an active link). When space is limited in narrow viewports, breadcrumb items collapse into a [button dropdown](/components/button-dropdown/index.html.md)   and are displayed in ascending order. For more info see [service navigation](/patterns/general/service-navigation/index.html.md)  .

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

### Component-specific guidelines

#### Alternative text

- Set the `ariaLabel`   property to identify this landmark according to the alternative text guidelines.  

  - For example: Breadcrumbs.
- Breadcrumbs are silent by default, so don't add unnecessary alt text.

#### Roles and landmarks

- Breadcrumb group comes with its own `nav`   landmark.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
