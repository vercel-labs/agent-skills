---
scraped_at: '2026-04-20T08:51:23+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/testing/introduction/index.html.md
title: Introduction to testing
---

# Introduction to testing

You can test your application by interacting with Cloudscape components.

## Introduction

When creating automated tests for your application you interact with Cloudscape components. For example, you choose a Cloudscape [button](/components/button/index.html.md) and assert the application updates to reflect the button's `onClick` action.

The inner HTML structure of Cloudscape components, including CSS class names, can change at any time. This is why we created test utilities for each component. Test utilities expose stable, framework-agnostic APIs that allows you to access relevant parts of components without worrying about which selector to use.

Cloudscape provides two sets of test utilities:

### DOM utilities

A set of utilities that enables you to interact with the Cloudscape components when you have direct access to DOM. DOM utilities are mainly used for unit tests to query Cloudscape components and interact with them using our provided utilities. For example:

```
import createWrapper from "@cloudscape-design/components/test-utils/dom";
import { render } from "@testing-library/react";

describe("<Button/>", () => {
  it("clicks the submit button", () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const buttonWrapper = wrapper.findButton();
    buttonWrapper.click() // clicks the button element

    // rest of your test logic
});
```

### Selector utilities

A set of utilities that enables you to find Cloudscape components using CSS selector strings. Selector utilities are mainly used for end-to-end and integration tests.

```
import createWrapper from "@cloudscape-design/components/test-utils/selectors";

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
*/

describe("Button", () => {
  it("clicks the submit button", async () => {
    await browser.url("your-test-page");
    const wrapper = createWrapper();

    const buttonSelector = wrapper
      .findButton('[data-testid="submit-button"]')
      .toSelector(); // string selector

    await browser.$(buttonSelector).click();

    // rest of your test
  });
});
```

Note that unlike the DOM utilities, we don't provide utilities like `click` or `focus` because the selector utilities return the corresponding CSS selectors that you can interact with by using the environment's browser APIs.

### Finding more examples

For some complex components, you can find more elaborate code examples using test utilities in the testing tab of the component page. Some examples include:

- [Table](/components/table/index.html.md)
- [Property filter](/components/property-filter/index.html.md)
- [Autosuggest](/components/autosuggest/index.html.md)
- [Modal](/components/modal/index.html.md)

## Querying Cloudscape components

The following main types of utilities are available to find elements:

1. **Component-specific find utilities**   : For each Cloudscape component, there's a corresponding `findX`   utility (for example `findButton(...)`  .
2. **Component-specific findAll utilities:**   For each Cloudscape component, there's also a corresponding `findAllX`   utility (for example `findAllButtons(...)`   ).
3. **General find utilities**   : You can use `find(...)`   to locate a single element and `findAll(...)`   to locate multiple elements, both used for general selection.
4. **Component-specific findClosest utilities**   : For each Cloudscape component, there's also a corresponding `findClosestX`   utility (for example `findClosestContainer()`   ) to find the closest parent which is an instance of that component. These utilities are available for unit tests but not for integration tests.

`findX` , `findAllX` and `find` utilities accept a string as an argument. The string can be a standard CSS selector, such as a class name or an ID, or a custom data attribute like `[data-testid="test-id"]`.

### Using data attributes

We recommend using data attributes to select or query components because they keep tests separate from the UI's styling and structure, making them more robust against changes in the UI. Additionally, attributes like `data-testid` are more stable and less likely to change during refactoring, providing more reliable selectors than class names or IDs.

**Example in unit testing**

```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import { render } from '@testing-library/react';

const Component = () => <Button data-testid="submit-button">Submit</Button>;

it('clicks the submit button', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper().findButton('[data-testid="submit-button"]');
    wrapper.click(); // Clicks the button using the stable data-testid attribute
});
```

**Example in integration testing**

```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
  * browser - is a global object representing your testing framework.
  * The exact API could be different for your stack.
*/  

it('clicks the submit button', async () => {
    const wrapper = createWrapper().findButton('[data-testid="submit-button"]');
    await browser.url('your-test-page');
    await browser.$(wrapper.toSelector()).click();
});
```

### Using findAll utilities

The `findAll` utilities are useful when you need to interact with or verify multiple instances of a component. These methods return an array of wrapper objects, allowing you to perform actions or assertions on multiple elements.

```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import { render } from '@testing-library/react';
import Button from '@cloudscape-design/components/button';

const Component = () => (
  <>
    <Button>First</Button>
    <Button>Second</Button>
    <Button>Third</Button>
  </>
);

it('finds and interacts with multiple buttons', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);
    const buttons = wrapper.findAllButtons();

    expect(buttons.length).toBe(3);
    expect(buttons[0].getElement().textContent).toBe('First');
    expect(buttons[1].getElement().textContent).toBe('Second');
    expect(buttons[2].getElement().textContent).toBe('Third');

    buttons.forEach(button => button.click());
});
```

### Don't use optional chaining in tests

Consider the following example:

```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
const Component = () => <Button data-testid="button1">Test Button</Button>;

// ❌ this approach can hide errors:
it('clicks a button', () => {
    createWrapper().findButton('[data-testid="button-1-2"]')?.click();
    // rest of your test    
});
```

The issue with the above code is that optional chaining ( `?.` ) will suppress any errors if the selected element is not found, potentially causing the test to pass incorrectly. This could lead to tests that do not properly validate the expected behavior.

Instead, it is recommended to avoid optional chaining to ensure that your test will fail if the element is not found:

```
// ✅ recommended approach:
it('clicks a button', () => {
    const wrapper = createWrapper().findButton('[data-testid="button-1"]');
    wrapper!.click(); 
    // this will throw an error if the button is not found, which ensures the test fails correctly
});
```

### Avoid relying on internal implementation of the components

It is important to avoid using internal class names or structures to query Cloudscape components, as these can change and break your tests. Instead, use more stable selectors like `data-testid` attributes or rely on visible text.

```
import React from 'react';
import { render, screen } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import Button from '@cloudscape-design/components/button';
import '@testing-library/jest-dom';

const Component = () => <Button data-testid="test-button">Test</Button>;

it('test button text', () => {
  const { container } = render(<Component />);
  const wrapper = createWrapper(container);

  // ❌ avoid using an internal class name as a selector
  expect(wrapper.findButton('[class*="awsui_button_123"]')!.getElement().textContent).toContain('Test');

  // ❌ avoid using find and findAll with internal class names
  expect(wrapper.find('.awsui__button_123')!.getElement().textContent).toContain('Test');
  expect(wrapper.findAll('[class*=awsui_]').length).toEqual(2);

  // ✅ prefer querying using the data attributes
  expect(wrapper.findButton('[data-testid="test-button"]')!.getElement().textContent).toContain('Test');

  // ✅ or querying by on screen text
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```
