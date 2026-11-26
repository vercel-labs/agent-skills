---
scraped_at: '2026-04-20T08:46:30+00:00'
section: components
source_url: https://cloudscape.design/components/alert/index.html.md
title: Alert
---

# Alert

A brief message that provides information or instructs users to take a specific action.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/alert)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/alert/index.html.json)

## Development guidelines

#### State management

The alert component is controlled. If the alert is dismissible, use `onDismiss` listener to hide it. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting alert
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Alert from '@cloudscape-design/components/alert';

describe('<Alert />', () => {
  it('renders the alert component', () => {
    const { container } = render(<Alert />);
    const wrapper = createWrapper(container);

    expect(wrapper.findAlert()).toBeTruthy();
  });

  it('selects all alert components', () => {
    const { container } = render(<>
      <Alert />
      <Alert />
      <Alert />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllAlerts();
    expect(components).toHaveLength(3)
  });
});
```

Render alert content slots
```
import Alert from '@cloudscape-design/components/alert';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return (
    <Alert data-testid="alert-test-id" header="header text">
      content
    </Alert>
  );
}

describe('<Alert />', () => {
  it('renders alert content', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findAlert('[data-testid="alert-test-id"]')!;

    expect(wrapper.findContent().getElement().textContent).toContain('content');
  });

  it('renders alert header', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findAlert('[data-testid="alert-test-id"]')!;

    expect(wrapper.findHeader()!.getElement().textContent).toContain('header text');
  });
});
```

Interacting with alert slots
```
import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

function Component({ callback }: { callback: jest.Mock }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return <Box data-testid="alert-alternative-test-id">alert is dismissed</Box>;
  }
  return (
    <Alert
      dismissible
      data-testid="alert-test-id"
      action={<Button onClick={() => callback()}>action button</Button>}
      onDismiss={() => setDismissed(true)}
    >
      content
    </Alert>
  );
}

describe('<Alert />', () => {
  it('triggers an event when action button is clicked', async () => {
    const mockFunction = jest.fn();
    const { container } = render(<Component callback={mockFunction} />);
    const wrapper = createWrapper(container).findAlert('[data-testid="alert-test-id"]')!;
    wrapper.findActionSlot()!.findButton()!.click();

    expect(mockFunction).toHaveBeenCalled();
  });

  it('dismisses the alert when dismiss button is clicked', async () => {
    const mockFunction = jest.fn();
    const { container } = render(<Component callback={mockFunction} />);
    const wrapper = createWrapper(container);
    let alertWrapper = wrapper.findAlert('[data-testid="alert-test-id"]');

    alertWrapper!.findDismissButton()!.click();

    alertWrapper = wrapper.findAlert('[data-testid="alert-test-id"]');

    expect(alertWrapper).toBeNull();

    expect(wrapper.findBox('[data-testid="alert-alternative-test-id"]')!.getElement().textContent).toContain(
      'alert is dismissed'
    );
  });
});
```

## Unit testing APIs

AlertWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActionButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | Returns the action button.The action button is only rendered when the buttonText property is set. | - |
| findActionSlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | Returns the dismiss button.The dismiss button is only rendered when the dismissible property is set to true. | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findRootElement | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Returns the container node of the component. | - |
## Integration testing examples

Render alert content slots
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Alert', () => {
  it('renders alert content', async () => {
    // this tests a similar page like /components/alert/
    await browser.url('your-page-to-test');

    const wrapper = createWrapper().findAlert('[data-testid="alert-test-id"]')!;

    const textContent = await browser.$(wrapper.findContent().toSelector()).getText();

    expect(textContent).toContain(
      'Review the documentation to learn about potential compatibility issues with specific database versions.'
    );
  });

  it('renders alert header', async () => {
    // this tests a similar page like /components/alert/
    await browser.url('your-page-to-test');
    const wrapper = createWrapper().findAlert('[data-testid="alert-test-id"]')!;

    const textContent = await browser.$(wrapper.findHeader().toSelector()).getText();

    expect(textContent).toContain('Known issues/limitations');
  });
});
```

Interacting with alert slots
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Alert', () => {
  it('clicks an alert action', async () => {
    // this tests a similar page like components/alert/?tabId=playground&example=with-button
    await browser.url('your-page-to-test');
    const wrapper = createWrapper();

    const alertWrapper = wrapper.findAlert('[data-testid="alert-test-id"]')!;
    await browser.$(alertWrapper.findActionSlot().findButton('[data-testid="your-action"]').toSelector()).click();

    // test your business logic, for example when a button is clicked another element appears.
    const addedTextContent = await browser.$(wrapper.findBox('[data-testid="added-content]').toSelector()).getText();

    expect(addedTextContent).toContain('Button is pressed!');
  });

  it('alert is dismissible', async () => {
    // this tests a similar page like components/alert/?tabId=playground&example=with-button
    await browser.url('your-page-to-test');
    const wrapper = createWrapper().findAlert('[data-testid="alert-test-id"]')!;

    await browser.$(wrapper.findDismissButton().toSelector()).click();

    expect(await browser.$(wrapper.toSelector()).isExisting()).toBeFalsy();
  });
});
```

## Integration testing APIs

AlertWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActionButton | [ButtonWrapper](/components/button/index.html.md) | Returns the action button.The action button is only rendered when the buttonText property is set. | - |
| findActionSlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) | Returns the dismiss button.The dismiss button is only rendered when the dismissible property is set to true. | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findRootElement | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the container node of the component. | - |
## General guidelines

### Do

- Use alerts to convey different levels of severity and urgency within the context of actions.
- When there are multiples of each sub-type, show all of a sub-type in order of urgency, before the next sub-type is displayed. For example, show all error alerts before displaying the first warning.

### Don't

- Avoid using multiple alert types on the same page. In rare cases when you need to do this, stack the alerts ordered by the urgency with which the user needs to pay attention: error, warning, information, and then success.

## Features

- #### Dismissible / Non-dismissible

  When the alert is dismissible by the user, include a *Close*   button in the alert. No other action is necessary.

### Structure

- #### Icon

  An alert is always accompanied by its respective icon, with the following automatic styling:  

  - The type and color of the icon are determined by the type of alert that is used.
  - The size of the icon is determined by the content placed inside the alert. If an alert contains both a header and content, use a a large icon. If an alert contains just a header or content, a normal icon is used.
- #### Header

  Include a header in the alert when you want to catch the user's attention or if the overall message can be understood with one sentence. Use the content area to provide details.
- #### Content

  Use the content area to provide details about the alert. If more information about the topic is needed, use `primary` variant of inline [normal links](/components/link/index.html.md)   or Learn more [external links](/components/link/index.html.md)   to relevant documentation.  

  When there is a significant amount of content that is not immediately critical, consider placing the content in an expandable section. This helps maintain focus on the most important information, and conserves space while still making additional details accessible.
- #### Action button

  If an alert requires an action from the user, display it in form of an action button.

### Types

- #### Error

  Use for [errors messages](/patterns/general/errors/error-messages/index.html.md)   , malfunctions, unsuccessful actions, and critical issues.
- #### Warning

  Use when conditions are present that don't cause errors, but are occurrences that the user should be aware of.
- #### Information

  Provides alert information to users in context. Be judicious when using this alert so you don't overuse it to replace regular content.
- #### Success

  Use to display static success messages about completion and success.

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

#### Header - optional

- Don't include end punctuation in headers.
- Headers share the key message from the alert, for example:  

  - *Your instances could not be stopped*
  - *Failed to delete instance id-4890f83e*
  - *Versioning is not enabled*
  - *API failure*

#### Description

- Descriptions require end punctuation, with the only exception being if a description ends with an external link icon, which should not have a period after it.
- Descriptions should be concise at only 1-2 sentences.
- Use present tense and active voice where possible.
- For an urgent alert, include a user action. What does the user need to do?
- Add links to any additional documentation users can read to learn more if needed.
- Follow the writing guidelines for [error messages](/patterns/general/errors/error-messages/index.html.md)  .

#### Button - optional

- Action buttons should clearly describe the steps needed to resolve the error.
- Use an action verb (Retry) or an action verb plus a noun (Restart instance).
- Action buttons should be 1-2 words.
- Do not include end punctuation.
- In instances where there is no clear action that the user can take, don't include an action button, but instead add a link to learn more.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Keyboard focus

- When an urgent alert is dynamically added to the page, ensure its content receives immediate attention by calling the `focus`   method on the component.

#### Alternative text

- To provide alternative text for the close icon according to the alternative text guidelines, use the dismissAriaLabel property. For example: Dismiss alert.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
