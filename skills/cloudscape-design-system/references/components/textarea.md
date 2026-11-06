---
scraped_at: '2026-04-20T08:49:44+00:00'
section: components
source_url: https://cloudscape.design/components/textarea/index.html.md
title: Text area
---

# Text area

A form element that provides a multi-line, plain-text input control.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/textarea)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/textarea/index.html.json)

## Development guidelines

#### State management

The textarea component is controlled. Set the `value` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting textarea
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Textarea from '@cloudscape-design/components/textarea';

describe('<Textarea />', () => {
  it('renders the textarea component', () => {
    const { container } = render(<Textarea />);
    const wrapper = createWrapper(container);

    expect(wrapper.findTextarea()).toBeTruthy();
  });

  it('selects all textarea components', () => {
    const { container } = render(<>
      <Textarea />
      <Textarea />
      <Textarea />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllTextareas();
    expect(components).toHaveLength(3)
  });
});
```

Entering text to textarea
```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';
import Textarea from '@cloudscape-design/components/textarea';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

function Component() {
  const [value, setValue] = useState('');

  return (
    <section>
      <TextContent>Entered text: {value}</TextContent>
      <Textarea value={value} onChange={event => setValue(event.detail.value)} />
    </section>
  );
}

describe('<Textarea />', () => {
  it('enters the text to the textarea', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findTextarea()!.setTextareaValue('test text');

    expect(wrapper.findTextContent()!.getElement().textContent).toContain('Entered text: test text');
  });
});
```

Selecting native textarea
```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import Textarea from '@cloudscape-design/components/textarea';

import { render } from '@testing-library/react';
import React from 'react';

describe('<Textarea />', () => {
  it('enters the text to the input', () => {
    const { container } = render(<Textarea value="test value" onChange={() => {}} />);
    const wrapper = createWrapper(container);

    const nativeTextarea = wrapper.findTextarea()!.findNativeTextarea()!.getElement();

    expect(nativeTextarea.value).toBe('test value');
  });
});
```

## Unit testing APIs

TextareaWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findNativeTextarea | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLTextAreaElement> | - | - |
| getTextareaValue | string | Gets the value of the component.Returns the current value of the textarea. | - |
| setTextareaValue | - | Sets the value of the component and calls the onChange handler. | value:value to set the textarea to. |
## Integration testing examples

Selecting native textarea
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Textarea', () => {
  it('enters the text to the textarea', async () => {
    // go to a page which contains the toggle to test
    await browser.url('your-page-to-test');

    const wrapper = createWrapper();

    const textarea = wrapper.findTextarea().findNativeTextarea().toSelector();
    await browser.$(textarea).setValue('test text');

    const textContent = await browser.$(wrapper.findTextContent().toSelector()).getText();

    expect(textContent).toBe('Entered text: test text');
  });
});
```

## Integration testing APIs

TextareaWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findNativeTextarea | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Always provide a label with the text area.
- When there is a character amount constraint, use constraint text in the [form field](/components/form-field/index.html.md)   component to provide this information to the user.
- Provide a text input area large enough to accommodate the information. Avoid scrolling as much as possible.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

## Features

- #### Placeholder

  A text area can have a placeholder (or hint text) that's displayed in a ghosted color and disappears when the user has typed in the text area.

### States

- #### Disabled

  Use the disabled state when users cannot interact with input and to prevent users from modifying the value.
- #### Read-only

  Use the read-only state when the input data is not to be modified by the user but they still need to view it.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Labels should always be visible. Don't use placeholders instead of labels, because placeholders disappear when the user interacts with the field.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
