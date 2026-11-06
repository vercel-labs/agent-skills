---
scraped_at: '2026-04-20T08:49:21+00:00'
section: components
source_url: https://cloudscape.design/components/space-between/index.html.md
title: Space between
---

# Space between

A helper component that helps you add consistent spacing between elements on your page.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/space-between)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/space-between/index.html.json)

## Development guidelines

This component only supports element children (components or HTML elements). Primitive values will cause [React's missing key warning](https://reactjs.org/docs/lists-and-keys.html#keys) . If you want to put a string or a number as a direct child, wrap it into a ``.

Refer to the [information about spacing in our Fundamentals page](/foundation/visual-foundation/spacing/index.html.md) to determine which size of spacing to use.

**React version difference:** In React 18 and earlier, React.Fragment children are broken down into individual elements. This behavior is now deprecated in React 19 and later.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting space between
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import SpaceBetween from '@cloudscape-design/components/space-between';

describe('<SpaceBetween />', () => {
  it('renders the space-between component', () => {
    const { container } = render(<SpaceBetween />);
    const wrapper = createWrapper(container);

    expect(wrapper.findSpaceBetween()).toBeTruthy();
  });

  it('selects all space-between components', () => {
    const { container } = render(<>
      <SpaceBetween />
      <SpaceBetween />
      <SpaceBetween />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllSpaceBetweens();
    expect(components).toHaveLength(3)
  });
});
```

Selecting children within space between
```
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return (
    <SpaceBetween size="xs" direction="horizontal">
      <Button>Edit</Button>
      <Button>Delete</Button>
      <Button variant="primary">Create</Button>
    </SpaceBetween>
  );
}

describe('<SpaceBetween />', () => {
  it('selects children within space between', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const spaceBetween = wrapper.findSpaceBetween()!;

    expect(spaceBetween).toBeTruthy();

    const buttons = wrapper.findAllButtons();

    expect(buttons).toHaveLength(3);
    expect(buttons[0].getElement().textContent).toBe('Edit');
    expect(buttons[1].getElement().textContent).toBe('Delete');
    expect(buttons[2].getElement().textContent).toBe('Create');
  });
});
```

Clicking child button
```
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

function Component() {
  const [clicked, setClicked] = useState('No');

  return (
    <SpaceBetween size="xs" direction="horizontal">
      <TextContent>Clicked: {clicked}</TextContent>
      <Button onClick={() => setClicked('Yes')}>Click me</Button>
    </SpaceBetween>
  );
}

describe('<SpaceBetween />', () => {
  it('clicks a button inside space between', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    expect(wrapper.findTextContent()!.getElement().textContent).toContain('Clicked: No');

    wrapper.findButton()!.click();

    expect(wrapper.findTextContent()!.getElement().textContent).toContain('Clicked: Yes');
  });
});
```

## Unit testing APIs

SpaceBetweenWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## Integration testing examples

Selecting children within space between
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('SpaceBetween', () => {
  it('selects children within space between', async () => {
    await browser.url('your-test-page');
    const wrapper = createWrapper();

    const spaceBetweenSelector = wrapper.findSpaceBetween().toSelector();
    const isExisting = await browser.$(spaceBetweenSelector).isExisting();

    expect(isExisting).toBe(true);

    const buttons = await browser.$$(wrapper.findAllButtons().toSelector());

    expect(buttons.length).toBeGreaterThan(0);
  });
});
```

## Integration testing APIs

SpaceBetweenWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  | For usage, see the [](/foundation/visual-foundation/visual-style/) [spacing](/foundation/visual-foundation/spacing/index.html.md) guidelines.

## Features

- #### Direction - optional

  You can lay out your content either horizontally or vertically. If you choose to display your content horizontally, and it doesn't completely fit on one line, it will wrap to the next line automatically.
- #### Size

  You can choose the size of the spacing between the content's elements from the predefined set of sizes.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
