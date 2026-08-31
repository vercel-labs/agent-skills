---
scraped_at: '2026-04-20T08:50:05+00:00'
section: components
source_url: https://cloudscape.design/components/wizard/index.html.md
title: Wizard
---

# Wizard

A multi-page form that guides a user through a complex flow or a series of interrelated tasks. A wizard consists of a navigation pane, header, main content area, and action buttons.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/wizard) [View in demo](/examples/react/wizard.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/wizard/index.html.json)

## Development guidelines

#### App layout

Set `contentType="wizard"` in the [app layout](/components/app-layout/index.html.md) component to automatically apply the recommended max content area width and default panel states to the page.

#### Form

Embed this component inside a `<form>` tag or an element with `role="form"` in order to comply with accessibility guidelines and gain full benefit of your framework's form support.

#### Communicating unsaved changes

Ensure users can exit a [multipage create](/patterns/resource-management/create/multi-page-create/index.html.md) flow at any time. If a user has entered data in the form and attempts to exit before completing the flow, you must prompt them with a [modal](/components/modal/index.html.md) asking them to confirm that they want to exit the flow. If there is no user input, you may end the creation flow without a prompt. For additional guidelines, see the [communicating unsaved changes](/patterns/general/unsaved-changes/index.html.md) pattern.

#### State management

The wizard component is *controllable* . By default, it activates the first step and switches step automatically when a user clicks the **next** button, the **previous** button, or an enabled step link in the navigation pane.

If you want to control which step is active, you need to explicitly set the `activeStepIndex` property and provide an `onNavigate` listener. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting wizard
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Wizard from '@cloudscape-design/components/wizard';

describe('<Wizard />', () => {
  it('renders the wizard component', () => {
    const { container } = render(<Wizard />);
    const wrapper = createWrapper(container);

    expect(wrapper.findWizard()).toBeTruthy();
  });

  it('selects all wizard components', () => {
    const { container } = render(<>
      <Wizard />
      <Wizard />
      <Wizard />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllWizards();
    expect(components).toHaveLength(3)
  });
});
```

Navigating wizard step by step
```
import Box from '@cloudscape-design/components/box';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';
import Wizard, { WizardProps } from '@cloudscape-design/components/wizard';

import { render } from '@testing-library/react';
import { useState } from 'react';

function Component() {
  const [activeStep, setActiveStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fullName = `Your name is: "${firstName} ${lastName}"`;

  const steps: WizardProps['steps'] = [
    {
      title: 'First name',
      content: (
        <FormField label="First name">
          <Input value={firstName} onChange={({ detail }) => setFirstName(detail.value)} />
        </FormField>
      ),
    },
    {
      title: 'Last name',
      content: (
        <FormField label="Last name">
          <Input value={lastName} onChange={({ detail }) => setLastName(detail.value)} />
        </FormField>
      ),
    },
    {
      title: 'Review',
      content: <TextContent>{fullName}</TextContent>,
    },
  ];

  return (
    <Box>
      <TextContent>{isSubmitted ? 'Submitted!' : 'In progress'}</TextContent>
      <Wizard
        steps={steps}
        activeStepIndex={activeStep}
        allowSkipTo={true}
        i18nStrings={{
          skipToButtonLabel: step => `Skip to ${step.title}`,
          nextButton: 'Next step',
          submitButton: 'Submit',
        }}
        onNavigate={({ detail }) => setActiveStep(detail.requestedStepIndex)}
        onSubmit={() => setIsSubmitted(true)}
      />
      );
    </Box>
  );
}

describe('<Wizard />', () => {
  it('navigates the wizard and submits at the end', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const wizard = wrapper.findWizard()!;

    // Enter the first name and go to the next step.
    wizard.findContent()!.findInput()!.setInputValue('John');
    wizard.findPrimaryButton().click();

    // Enter the last name and go to the next step.
    wizard.findContent()!.findInput()!.setInputValue('Doe');
    wizard.findPrimaryButton().click();

    // Review the values.
    const reviewText = wizard.findContent()!.getElement().textContent;

    expect(reviewText).toBe('Your name is: "John Doe"');

    // Submit.
    wizard.findPrimaryButton().click();
    const statusText = wrapper.findTextContent()!.getElement();

    expect(statusText.textContent).toBe('Submitted!');
  });
});
```

Skipping to a specific step
```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import Wizard, { WizardProps } from '@cloudscape-design/components/wizard';

import { render } from '@testing-library/react';
import { useState } from 'react';

const steps: WizardProps['steps'] = [
  {
    title: 'Step 1',
    content: 'First step',
    isOptional: true,
  },
  {
    title: 'Step 2',
    content: 'Second step',
    isOptional: true,
  },
  {
    title: 'Step 3',
    content: 'Third step',
    isOptional: true,
  },
];

function Component() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Wizard
      steps={steps}
      activeStepIndex={activeStep}
      allowSkipTo={true}
      i18nStrings={{
        skipToButtonLabel: step => `Skip to ${step.title}`,
      }}
      onNavigate={({ detail }) => setActiveStep(detail.requestedStepIndex)}
    />
  );
}

describe('<Wizard />', () => {
  it('navigates to the third step', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findWizard()!.findMenuNavigationLink(2)!.click();
    const currentStepContent = wrapper.findWizard()!.findContent()!.getElement();

    expect(currentStepContent.textContent).toBe('Second step');
  });
});
```

## Unit testing APIs

WizardWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findCancelButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findError | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findMenuNavigationLink | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns a link for a given step number. | stepNumber:1-based step indexstate:[optional] State of the link. The method returns null if the specified step does not match the state. It can be - "disabled": for disabled menu entries - "active": for the active menu entry - undefined: for any entry |
| findMenuNavigationLinks | Array<[ElementWrapper](/index.html.md)> | - | - |
| findPreviousButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findPrimaryButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findSecondaryActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSkipToButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
## Integration testing APIs

WizardWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findCancelButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findError | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findMenuNavigationLink | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns a link for a given step number. | stepNumber:1-based step indexstate:[optional] State of the link. The method returns null if the specified step does not match the state. It can be - "disabled": for disabled menu entries - "active": for the active menu entry - undefined: for any entry |
| findMenuNavigationLinks | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findPreviousButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findPrimaryButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findSecondaryActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSkipToButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
## General guidelines

### Do

- Apply the recommended max content area width and default panel states  by setting `contentType='wizard'`   in the [app layout](/components/app-layout/index.html.md)   component.
- When used within the app layout, the wizard must be the first component in the `content`   slot.
- Trigger a [modal](/components/modal/index.html.md)   upon  exiting the wizard if there are [unsaved changes](/patterns/general/unsaved-changes/index.html.md)   in  the flow.
- Match each navigation step title with the corresponding form header  title.
- If a step is optional, next to the step number label and form header title, include: *- optional*
- Apply standard form [validation](/patterns/resource-management/create/multi-page-create/index.html.md)   ; use form field (client-side) or page-level (server-side)  validation depending on your use cases.
- Display the choices on the review page in the same order they were  presented in the previous steps.
- Refer to the [multipage create](/patterns/resource-management/create/multi-page-create/index.html.md)   pattern for additional design guidance.

### Don't

- Don't use more than seven steps in a wizard flow.
- Avoid having interactions on the review page, such as inline editing  or editing modals. Edits should be made in the pages preceding the  review page.
- Don't use the wizard inside of a [content layout](/components/content-layout/index.html.md)   component.

## Features

### Navigation pane

The navigation pane is the numbered list of steps that serve as navigation, as well as an overall outline of the user's progress through a [multipage create](/patterns/resource-management/create/multi-page-create/index.html.md) pattern.

Upon initial load of the wizard, steps must be visited in chronological order to help guide the user through a complex flow or series of interrelated tasks.

- #### Step number label

  Small text displayed above the step title in the navigation pane to indicate the number of each step. For optional steps, next to the label, include: *- optional*  

  For example:  

  - *Step 1*
  - *Step 2 - optional*
- #### Step title

  - Action-oriented text, displayed in the navigation pane, which summarizes what the user needs to do in the step. This should always match the form header title.    

    - For example:* Select engine type*       or *Configure additional settings*
  - In the navigation, each step title can be in one of the following mutually exclusive states:    

    - Disabled: A disabled step title means the step has not been visited by the user yet. Disabled steps are not interactive nor active. By default, all steps beyond the first step are disabled, and become active and/or interactive as a user progresses through the flow.
    - Active: The active step is the step that the user is currently on. There can only be one active step at any point in time. An active step title is not disabled nor interactive, it is an indication of where the user is in the overall flow.
    - Interactive: A step title becomes interactive once it has been visited by the user. Interactive steps are rendered as links, and can be visited in any order.

### Form

The form is the page area adjacent to the navigation pane; the content is updated based on the user's active step.

- #### Form header

  The area at the top of the form that displays the title of the step. Optionally, the header can also include an optional tag or a page level info link.  

  - Step title: The title of the page that indicates what the user is doing in the current step. It should always match the corresponding step title listed in the navigation pane.    

    - For example: *Select engine type*
  - Optional tag: If the step is optional, next to the title, include: *- optional *    

    - For example:* Configure additional settings - optional*
  - Info link: If you are using the [help panel](/components/help-panel/index.html.md)     , add an info link for page level [help content](/patterns/general/help-system/index.html.md)    .
- #### Form description - optional

  Page-level description text that briefly summarizes the purpose of the step and the main actions that users need to take.
- #### Form content

  The main content area of the page where the [form containers](/components/container/index.html.md)   , [form fields](/components/form-field/index.html.md)   , and form controls such as [inputs](/components/input/index.html.md)   and [radio buttons](/components/radio-group/index.html.md)   , are displayed.  

  We recommend you make the last page of the wizard a review page that summarizes the choices made in previous steps.  A review page ensures users can review their information and quickly go back to any step for edits. Follow the guidelines for [multipage create](/patterns/resource-management/create/multi-page-create/index.html.md)   pattern and see the [demo page](/examples/react/wizard.html)   for examples.
- #### Validation error message (server side) - optional

  Text that is rendered inside a page-level [alert](/components/alert/index.html.md)   above the form's action buttons. This should be used for overall form submission errors such as recoverable, server-side validation failures.
- #### Form action buttons

  A standard set of actions on each page, displayed below the form content area. These can include any of the following types of buttons:  

  - **Cancel**    

    - Ensures a user can exit the flow. A user should be able to exit the flow at any time. If a user has [unsaved changes](/patterns/general/unsaved-changes/index.html.md)       in the form and attempts to exit before completing the flow, you must prompt them with a modal asking them to confirm that they want to exit the flow. If there is no user input, you may terminate the wizard without a prompt.
  - **Previous**    

    - Ensures the user can move backward and return to the previous step.
  - **Next**     or **Submit**    

    - Ensures the user can move forward to the next step or submit the form.
    - This button can be rendered in a loading state if the page needs time to load, for example if content is being fetched or validated.

  Buttons displayed for each step:  

  - First step: *Cancel*** **     and *Next*** **     buttons.
  - Intermediate steps **:** *Cancel,* *Previous,*     and *Next*** **     buttons.
  - Last step: *Cancel,* *Previous,*     and *Submit*     buttons.

  Optional form action buttons:  

  There are two optional form action buttons that allow for further customization of the wizard. These buttons are hidden by default.  

  - **Skip to step N **     or** Skip to end**    

    - Ensures the user can skip past any optional steps to the next required step. If there are no remaining required steps, it skips to the final step ( *Review and Submit*       ).
    - The button label is configurable. We recommend using *Skip to step N*       or *Skip to end *       when used for the final step in the wizard.
    - If possible, group all required steps together at the beginning of the wizard. Then, a *Skip to end*       button can appear on the last required step.
    - When a user moves to another step using either the navigation panel or the action buttons, validate the relevant data.
  - **Custom Action**    

    - Ensures the user can perform additional actions that affect the entire form. If there are multiple actions available, the button should become a single drop-down containing each action.

[View Documentation](/components/form/index.html.md)

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

#### Step number label

- Use the format: *Step \[number\]*
- If a step is optional, next to the label, include: *- optional*
- Example step number labels in a navigation pane:  

  - *Step 1*
  - *Step 2 - optional*
  - *Step 3*
- For the navigation summary label displayed on narrow viewports, use the format: *Step \[current step number\] of \[total step count\]*  

  - For example:* Step 2 of 3*

#### Step title and form header title

- Use the same title in both the navigation pane and page header.
- Begin the title with an active verb.  

  - For example:* *    

    - *Select engine type*
    - *Configure additional settings*
    - *Provide contact details*
- For the review page, use the text: *Review and \[active verb\]*  

  - For example:* Review and create*
- Follow the writing guidelines for [form](/components/form/index.html.md)  .

#### Form header

- If a step is optional, next to the form header, include: *- optional*  

  - For example: *Configure additional settings - optional*

#### Form description

- Follow the writing guidelines for [form](/components/form/index.html.md)  .

#### Form error message (server-side)

- Follow the guidelines for [validation](/patterns/general/errors/validation/index.html.md)  .

#### Form action buttons

- For the button that allows the user to exit the form, use this text: *Cancel*
- For the button that allows the user to return to the previous step, use this text: *Previous*
- For the button that allows the user to move to the next step, use this text: *Next*
- For the button that allows the user to submit the form, use the format: *\[Active verb\]\[resource type\]*  

  - For example: *Create distribution*
- Follow the writing guidelines for [button](/components/button/index.html.md)   and [form](/components/form/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Form guidelines

- Follow the accessibility guidelines for [forms](/components/form/index.html.md)  .

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
