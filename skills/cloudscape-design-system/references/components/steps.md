---
scraped_at: '2026-04-20T08:49:29+00:00'
section: components
source_url: https://cloudscape.design/components/steps/index.html.md
title: Steps
---

# Steps

Display a list of tasks.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/steps) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/steps/index.html.json)

## Unit testing examples

Selecting steps
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Steps from '@cloudscape-design/components/steps';

describe('<Steps />', () => {
  it('renders the steps component', () => {
    const { container } = render(<Steps />);
    const wrapper = createWrapper(container);

    expect(wrapper.findSteps()).toBeTruthy();
  });

  it('selects all steps components', () => {
    const { container } = render(<>
      <Steps />
      <Steps />
      <Steps />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllSteps();
    expect(components).toHaveLength(3)
  });
});
```

Select step header
```
import Steps from '@cloudscape-design/components/steps';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return (
    <Steps
      steps={[
        { status: 'success', header: 'Step 1', details: 'Details 1' },
        { status: 'success', header: 'Step 2', details: 'Details 2' },
      ]}
    />
  );
}

describe('<Steps />', () => {
  it('get steps header', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findSteps()!;

    const header1 = wrapper.findItems()[0].findHeader()!.getElement();
    const header2 = wrapper.findItems()[1].findHeader()!.getElement();

    expect(header1.textContent).toBe('Step 1');
    expect(header2.textContent).toBe('Step 2');
  });
});
```

## Unit testing APIs

StepsWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItems | Array<[StepWrapper](/index.html.md)> | Finds all step items | - | StepWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDetails | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the details of a step | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the header of a step | - |
## Integration testing examples

Select step header
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Steps', () => {
  it('gets step header', async () => {
    // this code tests a component instance similar to this /components/steps&example=with-loading
    await browser.url('your-page-to-test');

    const wrapper = createWrapper().findSteps();
    const header1 = await browser.$(wrapper.findItems().get(0).findHeader().toSelector()).getText();
    const header2 = await browser.$(wrapper.findItems().get(1).findHeader().toSelector()).getText();

    expect(header1).toEqual('Success step');
    expect(header2).toEqual('Loading step');
  });
});
```

## Integration testing APIs

StepsWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[StepWrapper](/index.html.md)> | Finds all step items | - | StepWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDetails | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the details of a step | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the header of a step | - |
## General guidelines

### Do

- Use this component to show a sequence of tasks while troubleshooting or loading.
- When using horizontal steps, switch to the vertical orientation as space becomes constrained.

### Don't

- Don't use this component for navigation between steps. For example, wizard step navigation.

## Features

- #### Status

  The status of a step conveyed via corresponding [status indicator](/components/status-indicator/index.html.md)  .
- #### Header

  A brief summary of the step to provide more context to users. It can be used to display the name of a task being performed, a [popover](/components/popover/index.html.md)   that contains the step details, and a [link](/components/link/index.html.md)   to a detail page as needed.
- #### Details - optional

  A slot to display additional information corresponding to the step. For example, a description or list of sub-tasks being performed, a [link](/components/link/index.html.md)   to navigate to a detail page, or a [button](/components/button/index.html.md)   to let users perform an action on that step.
- #### Orientation - optional

  The steps can be shown with two different orientations: vertical and horizontal. Vertical is the default orientation.

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

#### Status indicator

- Follow the writing guidelines for [status indicator](/components/status-indicator/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### ARIA live regions

- Status updates are not automatically announced to assistive technology. For situations where the steps' status change dynamically, the Steps component should be wrapped with live regions.  

  - For example: `<Steps steps={steps}/>`

#### Alternative text

- Provide a label for the Steps component using the `ariaLabelledBy`   property.  

  - `<p id="stepsLabelId">Cloudformation deployment</p> <Steps ariaLabelledBy={"stepsLabelId"} steps={steps} />`
- Provide a description for the Steps component using the `ariaDescribedby`   property.  

  - `<p id="stepsDescriptionId">Cloudformation deployment will affect the following resources...</p> <Steps ariaDescribedby={"stepsDescriptionId"} steps={steps} />`
- Provide alternative text for the status icon using the `statusIconAriaLabel`   property.  

  - `<Steps steps={[status: "error", header: "Terminated process", statusIconAriaLabel="Error"]}/>`

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
