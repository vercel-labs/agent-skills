---
scraped_at: '2026-04-20T08:48:27+00:00'
section: components
source_url: https://cloudscape.design/components/input/index.html.md
title: Input
---

# Input

With the input control, users can input a single line of text.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/input)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/input/index.html.json)

## Development guidelines

#### State management

The input component is controlled. Set the `value` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting input
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Input from '@cloudscape-design/components/input';

describe('<Input />', () => {
  it('renders the input component', () => {
    const { container } = render(<Input />);
    const wrapper = createWrapper(container);

    expect(wrapper.findInput()).toBeTruthy();
  });

  it('selects all input components', () => {
    const { container } = render(<>
      <Input />
      <Input />
      <Input />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllInputs();
    expect(components).toHaveLength(3)
  });
});
```

Entering text into input
```
import Input from '@cloudscape-design/components/input';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

function Component() {
  const [value, setValue] = useState('');

  return (
    <section>
      <TextContent>Entered text: {value}</TextContent>
      <Input value={value} onChange={event => setValue(event.detail.value)} />
    </section>
  );
}

describe('<Textarea />', () => {
  it('enters the text to the input', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findInput()!.setInputValue('test text');

    expect(wrapper.findTextContent()!.getElement().textContent).toContain('Entered text: test text');
  });
});
```

Selecting native input element
```
import Input from '@cloudscape-design/components/input';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

describe('<Textarea />', () => {
  it('enters the text to the input', () => {
    const { container } = render(<Input value="test value" onChange={() => {}} />);
    const wrapper = createWrapper(container);

    const nativeInput = wrapper.findInput()!.findNativeInput().getElement();

    expect(nativeInput.value).toBe('test value');
  });
});
```

## Unit testing APIs

InputWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| blur | - | - | - |
| findClearButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> | - | - |
| focus | - | - | - |
| getInputValue | string | Gets the value of the component.Returns the current value of the input. | - |
| isDisabled | boolean | - | - |
| setInputValue | - | Sets the value of the component and calls the onChange handler | value:The value the input is set to. |
## Integration testing examples

Entering text into input
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Input', () => {
  it('enters text into the input', async () => {
    await browser.url('your-test-page');
    const wrapper = createWrapper();

    const inputSelector = wrapper.findInput().findNativeInput().toSelector();
    await browser.$(inputSelector).setValue('test text');

    const value = await browser.$(inputSelector).getValue();

    expect(value).toBe('test text');
  });
});
```

## Integration testing APIs

InputWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findClearButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Every input field should have a label. Use the [form field](/components/form-field/index.html.md)   component for labeling your inputs.
- In general, the length of an input field should accommodate 1-40 characters. You can  shorten the length of a specific field if users typically will use  fewer characters than 40.
- If users will need to copy and paste long text strings, your input field doesn't need to accommodate the entire string; instead, show only enough to allow users to determine whether what they've entered is correct.
- Remember to provide space for extra characters when localized into  other languages.
- When there is a character amount constraint, use constraint text in the [form field](/components/form-field/index.html.md)   component to provide this information to the user.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

## Features

- #### Type

  The type of control. The default type is text. Inputs with the `number`   type use the native element behavior, which might vary slightly across browsers.
- #### Placeholder - optional

  A hint or an example that helps users make a decision. For example, *johndoe@business.com*   as an example for an `email`   input.
- #### Autocomplete

  Specifies whether browsers should turn on autocomplete for this input. In some cases, it might be appropriate to turn off autocomplete, such as for security-sensitive fields.

### States

- #### Disabled

  Use the disabled state when users cannot interact with input and to prevent users from modifying the value.
- #### Read-only

  Use the read-only state when the input data is not to be modified by the user but they still need to view it.
- #### Invalid

  Shows that there is an error with an input that the user entered into the input field.
- #### Warning

  Indicates a condition regarding user-input in the field, which doesn't generate an error, but requires user attention.

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

#### Placeholder text

- You can include brief hint (placeholder) text inside an input field to indicate what the user should type into the field (that is, an example of the expected value of the input field such as *example.com*   for a Domain name field or *YYYY/MM/DD*   for a date field).
- Leave the field blank if the label is self-explanatory. Not every field requires a hint.  

  - For example, users don't need a hint for a field that is labeled* First name*    .
- Keep the placeholder brief, and avoid truncation (all of the text should be immediately visible in the field).
- Use lowercase, sentence case, or title case, depending on the placeholder.  

  - For example:    

    - *example.com*
    - *Default-Environment-1*
    - *My S3 path*
- Don't use terminal punctuation.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Input

- Labels should always be visible. Don't use placeholders instead of labels, because  
  clicking in the field makes the placeholder disappear.
- When showing or hiding a password, manipulate it with its own control (checkbox). Each control field should serve only one purpose.
- When using search input, provide alternative text with the `ariaLabel`   or `ariaLabelledby`   properties to indicate it is a search field.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
