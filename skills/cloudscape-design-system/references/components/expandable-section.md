---
scraped_at: '2026-04-20T08:47:51+00:00'
section: components
source_url: https://cloudscape.design/components/expandable-section/index.html.md
title: Expandable section
---

# Expandable section

With expandable selection, users can expand or collapse a section.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/expandable-section)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/expandable-section/index.html.json)

## Development guidelines

#### State management

By default, the expandable section component expands and collapses automatically when clicked.

If you want to control this behavior, you need to explicitly set the `expanded` property and provide an `onChange` listener.

If you only want to set a default expanded state, you can set the `defaultExpanded` property. The component will then expand and collapse automatically when clicked.

Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting expandable section
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import ExpandableSection from '@cloudscape-design/components/expandable-section';

describe('<ExpandableSection />', () => {
  it('renders the expandable-section component', () => {
    const { container } = render(<ExpandableSection />);
    const wrapper = createWrapper(container);

    expect(wrapper.findExpandableSection()).toBeTruthy();
  });

  it('selects all expandable-section components', () => {
    const { container } = render(<>
      <ExpandableSection />
      <ExpandableSection />
      <ExpandableSection />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllExpandableSections();
    expect(components).toHaveLength(3)
  });
});
```

Expanding the expandable section
```
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

function Component() {
  return <ExpandableSection defaultExpanded={false}>Expandable content</ExpandableSection>;
}

describe('<ExpandableSection />', () => {
  it('expands the expandable section', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findExpandableSection()!.findExpandButton().click();

    const expandableContent = wrapper.findExpandableSection()!.findExpandedContent()!;

    expect(expandableContent.getElement().textContent).toBe('Expandable content');
  });
});
```

Collapsing the expandable section
```
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

function Component() {
  return <ExpandableSection defaultExpanded={true}>Expandable content</ExpandableSection>;
}

describe('<ExpandableSection />', () => {
  it('collapses the expandable section', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findExpandableSection()!.findExpandButton().click();

    const expandableContent = wrapper.findExpandableSection()!.findExpandedContent();

    expect(expandableContent).toBeNull();
  });
});
```

Selecting the header
```
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

function Component() {
  return <ExpandableSection headerText="Test header text">Test content</ExpandableSection>;
}

describe('<ExpandableSection />', () => {
  it('renders the header text', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const headerText = wrapper.findExpandableSection()!.findHeaderText()!;

    expect(headerText.getElement().textContent).toBe('Test header text');
  });
});
```

## Unit testing APIs

ExpandableSectionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findExpandButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findExpandedContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findExpandIcon | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findHeaderDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeaderText | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing examples

Expanding the expandable section
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('ExpandableSection', () => {
  it('expands the expandable section', async () => {
    /**
     * This code tests the <ExpandableSection defaultExpanded={false} />
     * Check the playground: /components/expandable-section/?tabId=playground&example=default
     */
    await browser.url('your-test-page');
    const wrapper = createWrapper();

    const expandButtonSelector = wrapper.findExpandableSection().findExpandButton().toSelector();
    await browser.$(expandButtonSelector).click();

    const expandableContentSelector = wrapper.findExpandableSection().findExpandedContent().toSelector();
    const expandableContent = await browser.$(expandableContentSelector).getText();

    expect(expandableContent).toBe('Expandable content');
  });
});
```

Collapsing the expandable section
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('ExpandableSection', () => {
  it('collapses the expandable section', async () => {
    /**
     * This code tests the <ExpandableSection defaultExpanded={true} />
     * Check the playground: /components/expandable-section/?tabId=playground&example=default
     */
    await browser.url('your-test-page');
    const wrapper = createWrapper();

    const expandButtonSelector = wrapper.findExpandableSection().findExpandButton().toSelector();
    await browser.$(expandButtonSelector).click();

    const expandableContent = wrapper.findExpandableSection().findExpandedContent().toSelector();
    const isExpanded = await browser.$(expandableContent).isExisting();

    expect(isExpanded).toBe(false);
  });
});
```

Selecting the header
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('ExpandableSection', () => {
  it('renders the header text', async () => {
    /**
     * This code tests the <ExpandableSection headerText="Test header text" />
     * Check the playground: /components/expandable-section/?tabId=playground&example=default
     */
    await browser.url('your-test-page');
    const wrapper = createWrapper();

    const headerTextSelector = wrapper.findExpandableSection()!.findHeaderText().toSelector();
    const headerText = await browser.$(headerTextSelector).getText();

    expect(headerText).toBe('Test header text');
  });
});
```

## Integration testing APIs

ExpandableSectionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findExpandButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findExpandedContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findExpandIcon | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeaderDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeaderText | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use expandable sections so that the user can view one or more sections at a time.
- Include only secondary content in expandable sections.
- Use expandable sections beneath relevant items in the interface to reduce page length. An example is advanced configurations in a form. All adjacent content will be pushed vertically down the page.
- Expandable sections are collapse expandable sections by default.

### Don't

- Don't hide error messages or critical information under an expandable section.
- Don't nest expandable sections.
- Don't use expandable sections inside tables. Instead use [table with expandable rows](/components/table/index.html.md)  .
- Don't use more than one action in a default expandable section header. If you need more, use a [inline icon button dropdown](/components/button-dropdown/index.html.md)  .

## Features

- #### Variant

  - **Default**     : can be placed at the page level or inside the container. It also allows for additional optional elements in the header: description and actions.
  - **Footer**     : intended for containers' footers within forms.
  - **Container**     : has its own visual container. It's used within the context of other containers, such as [resource creation flows](/patterns/resource-management/create/index.html.md)     . It also allows for additional optional elements in the header: description, counter, info link, and actions.
  - **Stacked**     : optimized to be displayed adjacent to other stacked components.
- #### Actions - optional

  Actions can be featured in the default and container variants.  

  - **Default: **     Use the [inline button](/components/button/index.html.md)     and [inline button dropdown](/components/button-dropdown/index.html.md)     . For example, an action to remove a section.
  - **Container: **     Follow the guidelines for [actions in the header](/components/header/index.html.md)    .

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

- Don't provide unnecessary alternative text or roles. The caret icon is already part of the component.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
