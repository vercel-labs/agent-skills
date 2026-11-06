---
scraped_at: '2026-04-20T08:49:53+00:00'
section: components
source_url: https://cloudscape.design/components/toggle/index.html.md
title: Toggle
---

# Toggle

Toggles enable users to turn an option on or off, and can result in an immediate change.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/toggle)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/toggle/index.html.json)

## Development guidelines

#### State management

The toggle component is controlled. Set the `checked` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting toggle
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Toggle from '@cloudscape-design/components/toggle';

describe('<Toggle />', () => {
  it('renders the toggle component', () => {
    const { container } = render(<Toggle />);
    const wrapper = createWrapper(container);

    expect(wrapper.findToggle()).toBeTruthy();
  });

  it('selects all toggle components', () => {
    const { container } = render(<>
      <Toggle />
      <Toggle />
      <Toggle />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllToggles();
    expect(components).toHaveLength(3)
  });
});
```

Toggling on and off
```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';
import Toggle from '@cloudscape-design/components/toggle';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const Component = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <section>
      <TextContent>{isChecked ? 'checked!' : 'not checked'}</TextContent>
      <Toggle checked={isChecked} onChange={event => setIsChecked(event.detail.checked)} />
    </section>
  );
};

describe('<Toggle />', () => {
  it('calls onChange when toggled', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findToggle()!.findNativeInput().click();

    expect(wrapper.findTextContent()!.getElement().textContent).toContain('checked!');
  });
});
```

## Unit testing APIs

ToggleWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> | - | - |
## Integration testing examples

Interacting with toggle component
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Toggle', () => {
  it('toggles on and off when clicked', async () => {
    // go to a page which contains the toggle to test
    await browser.url('your-page-to-test');

    const wrapper = createWrapper();

    await browser.$(wrapper.findToggle()!.findNativeInput().toSelector()).click();

    // assuming there are some text that will be shown when the toggle is clicked.
    const textContent = await browser.$(wrapper.findTextContent().toSelector()).getText();

    expect(textContent).toBe('text content when toggle is clicked');
  });
});
```

## Integration testing APIs

ToggleWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use for an option that takes effect immediately, for example toggling versioning on an S3 bucket to enable or disable the storage of multiple versions of objects.
- Use for options that turn a group of elements on or off, for example progressive disclosure of form elements.
- Use when a description of the selected (on/activated/enabled) state is sufficient to understand the implications of the option. Use [tiles](/components/tiles/index.html.md)   or a [radio group](/components/radio-group/index.html.md)   if you need to explicitly describe both the on* *   and off* *   states, for example to describe cost or performance implications.
- Follow the guidelines for [selection in forms](/patterns/general/selection/index.html.md)  .

### Don't

- Don't change the label depending on the switch state. Use a [radio group](/components/radio-group/index.html.md)   instead, and display labels and description for both states.
- Don't use a toggle for options that are activated at form submission, such as an acknowledgement of EULA or Terms and Conditions. In this case, use a [checkbox](/components/checkbox/index.html.md)  .
- Don't use for options that require descriptions to understand the implications of both the on and off states. Use [radio group](/components/radio-group/index.html.md)   or [tiles](/components/tiles/index.html.md)   instead.
- Don't label a toggle as optional. When the user submits a form with a toggle, they make a binary choice for that option, either on or off.
- Don't use a toggle to turn groups of options on and off that contain other toggles. Instead, use [checkbox](/components/checkbox/index.html.md)   , [radio group](/components/radio-group/index.html.md)   , or [tiles](/components/tiles/index.html.md)   for the group of sub-elements.
- Don't hide the label for toggles in read-only state.

## Features

- #### Label - optional

  A short description of the toggle.
- #### Description - optional

  A description can be used to define or provide additional context on the toggle.

### States

- #### Disabled

  Use the disabled state when users cannot interact with the toggle and to prevent users from modifying the value.
- #### Read-only

  Use the read-only state when the toggle is not to be modified by the user but they still need to view it.

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

#### Labels

- Follow the guidelines for [selection in forms](/patterns/general/selection/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Provide a meaningful label for toggles through the `label`   property.
- The label should not change when the toggle state changes.
- Follow the guidelines for associating multiple toggles with a single form field and to point to hint and error text, in the [API section](/components/toggle/index.html.md)  .

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
