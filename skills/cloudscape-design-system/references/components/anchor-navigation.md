---
scraped_at: '2026-04-20T08:46:32+00:00'
section: components
source_url: https://cloudscape.design/components/anchor-navigation/index.html.md
title: Anchor navigation
---

# Anchor navigation

Allows users to quickly jump to specific page content via predefined anchor links.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/anchor-navigation) [Product details demo](/examples/react/product-detail-page.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/anchor-navigation/index.html.json)

## Development guidelines

#### Scroll-spy behaviour

By default, the component's built-in scroll-spy sets the active anchor based on the section nearest to the top of the viewport, adjusted by the `scrollSpyOffset`.

If the built-in scroll-spy behavior doesn't meet your specific requirements, use the `activeHref` prop to manually set the active anchor.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting anchor navigation
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import AnchorNavigation from '@cloudscape-design/components/anchor-navigation';

describe('<AnchorNavigation />', () => {
  it('renders the anchor-navigation component', () => {
    const { container } = render(<AnchorNavigation />);
    const wrapper = createWrapper(container);

    expect(wrapper.findAnchorNavigation()).toBeTruthy();
  });

  it('selects all anchor-navigation components', () => {
    const { container } = render(<>
      <AnchorNavigation />
      <AnchorNavigation />
      <AnchorNavigation />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllAnchorNavigations();
    expect(components).toHaveLength(3)
  });
});
```

Selecting anchor item link by href
```
import AnchorNavigation from '@cloudscape-design/components/anchor-navigation';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

const Component = () => {
  return (
    <AnchorNavigation
      anchors={[
        { text: 'Section 1', href: '#section1', level: 1 },
        { text: 'Section 2', href: '#section2', level: 1 },
        { text: 'Section 3', href: '#section3', level: 1, info: 'Updated' },
        { text: 'Section 4', href: '#section4', level: 1, info: 'New' },
      ]}
    />
  );
};

describe('<AnchorNavigation />', () => {
  it('find anchor item link by href', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findAnchorNavigation();
    const updatedSection = wrapper!.findAnchorLinkByHref('#section3')!.getElement();

    expect(updatedSection.textContent).toContain('Updated');
  });
});
```

Selecting anchor item by index
```
import AnchorNavigation from '@cloudscape-design/components/anchor-navigation';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

const Component = () => {
  return (
    <AnchorNavigation
      anchors={[
        { text: 'Section 1', href: '#section1', level: 1 },
        { text: 'Section 2', href: '#section2', level: 1 },
        { text: 'Section 3', href: '#section3', level: 1, info: 'Updated' },
        { text: 'Section 4', href: '#section4', level: 1, info: 'New' },
      ]}
    />
  );
};

describe('<AnchorNavigation />', () => {
  it('find anchor item by index', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findAnchorNavigation();
    const updatedSection = wrapper!.findAnchorByIndex(3)!.findInfo()!.getElement();
    const newSection = wrapper!.findAnchorByIndex(4)!.findInfo()?.getElement();

    expect(updatedSection?.textContent).toContain('Updated');
    expect(newSection?.textContent).toContain('New');
  });
});
```

## Unit testing APIs

AnchorNavigationWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActiveAnchor | [AnchorItemWrapper](/index.html.md) &#124; null | - | - |
| findAnchorByIndex | [AnchorItemWrapper](/index.html.md) &#124; null | - | index: |
| findAnchorLinkByHref | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLAnchorElement> &#124; null | - | href: |
| findAnchorNavigation | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLOListElement> &#124; null | - | - |
| findAnchorNavigationList | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLOListElement> &#124; null | - | - |
| findAnchors | Array<[AnchorItemWrapper](/index.html.md)> | - | - | AnchorItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLink | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLAnchorElement> &#124; null | - | - |
| findText | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| isActive | boolean | - | - |
## Integration testing examples

Interacting with anchor navigation links
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Anchor Navigation', () => {
  /**
   * This code tests a component similar to /components/anchor-navigation
   */
  it('clicks on an anchor navigation link', async () => {
    // go to a page which contains the autosuggest to test
    await browser.url('your-page-to-test');
    // always make sure to disambiguate your component to test with a data-testid attribute
    const wrapper = createWrapper().findAnchorNavigation('[data-testid="my-autosuggest"]')!;
    const linkItem = await browser.$(wrapper.findAnchorByIndex(1).toSelector());
    await linkItem.click();

    expect(browser.getUrl()).toContain('#NAME_OF_HASH');
  });
});
```

## Integration testing APIs

AnchorNavigationWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActiveAnchor | [AnchorItemWrapper](/index.html.md) | - | - |
| findAnchorByIndex | [AnchorItemWrapper](/index.html.md) | - | index: |
| findAnchorLinkByHref | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | href: |
| findAnchorNavigation | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findAnchorNavigationList | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findAnchors | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AnchorItemWrapper](/index.html.md)> | - | - | AnchorItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLink | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findText | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Limit nesting to a maximum of three levels. For example, h2, h3, h4.
- Ensure the anchor link text corresponds with the heading text that the link directs to. For example, *General guidelines*   is the title of the text of both the anchor link and the content section.
- Pair the anchor navigation component with a heading to increase the understandability of the list of links.
- Provide the anchor navigation as visible element on the page or provide an access point to it. For example, include it within an expandable section on mobile views.

### Don't

- Don't use anchor navigation to represent the information architecture of your application. Use [side navigation](/components/side-navigation/index.html.md)   instead.
- Don't use anchor navigation to represent a list of filters for page content.

## Features

- #### Anchor links

  A list of anchor links that represents the page headings (h2, h3, h4). Anchor links enable quick navigation to the corresponding content section. You have full control over the definition of the headings and sub-headings.  

  You can add a scroll motion to the content area, however be mindful of users with cognitive disabilities and respect their operating system settings.
- #### Active state indicator

  A visual indicator that enhances the active state of the selected link.
- #### Content status label - optional

  Include *New*   or *Updated*   labels next to the corresponding anchor link to highlight newly created or recently modified content. Define the timeline for the label permanence based on the frequency of releases and updates for your application. Consider 30 days as maximum time to expose the labels.

### Additional configurations

- #### Headings

  The combination of anchor navigation and heading is intended to look similar on both desktop and mobile devices, for a cohesive user experience across different platforms.  

  - **Desktop: **     You can pair the anchor navigation component with a heading, for example, *On this page*     , to provide context for the list of links that follow.
  - **Mobile:**     You can include the anchor navigation within an [expandable section](/components/expandable-section/index.html.md)     . Stack it as the first element of the content area, and collapse the expandable section by default.
- #### Motion

  You can add a scroll motion to the content area, however be mindful of users with cognitive disabilities and respect their operating system settings.

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

#### Heading

- When pairing the anchor navigation with a heading, use this text: *On this page*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Provide a meaningful label for the anchor navigation through the `ariaLabelledby`   property.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
