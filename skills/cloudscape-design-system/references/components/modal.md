---
scraped_at: '2026-04-20T08:48:48+00:00'
section: components
source_url: https://cloudscape.design/components/modal/index.html.md
title: Modal
---

# Modal

A user interface element subordinate to an application's main window. It prevents interaction with the main page content, but keeps it visible with the modal as a child window in front of it.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/modal)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/modal/index.html.json)

## Development guidelines

#### Testing

By default, modals are rendered to the document root. To find this component using test-utils, you need to start from the document root, for example: `createWrapper(document.body).findModal()`.

#### Alternative modal roots

By default, the Modal component renders its content directly to `document.body` using [React portal API](https://react.dev/reference/react-dom/createPortal) . This behavior can be customized in two ways:

- Use `modalRoot`   property if you experience rendering issues, for example due to `z-index`   conflicts. Then you can manually create a DOM container on your page, and style it accordingly.
- Use `getModalRoot`   and `removeModalRoot`   to add and remove modal root container on demand. This can be useful when rendering modals inside iframes when you would like to render it in a different frame to ensure it renders full screen. Note that `getModalRoot`   is called even if the `visible`   property is set to `false`   . Render the whole modal conditionally if you want to avoid this.

#### footer slot

If you want to place multiple buttons in the `footer` slot, use the [space between](/components/space-between/index.html.md) component to add horizontal spacing between them.

#### State management

The Modal component is controlled. Set the `visible` property and the `onDismiss` listener to control its visibility. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Testing guidelines

By default, modals are rendered to the document root. To find this component using test-utils, you need to start from the document root. For example: `createWrapper(document.body).findModal()`.

## Unit testing examples

Show modal when button clicked
```
import Button from '@cloudscape-design/components/button';
import Modal from '@cloudscape-design/components/modal';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';
import { useState } from 'react';

function Component() {
  const [visible, setVisible] = useState(false);

  return (
    <main>
      <Modal
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
      >
        content
      </Modal>
      <Button
        data-testid="open-modal-button"
        onClick={() => {
          setVisible(true);
        }}
      >
        Show Modal
      </Button>
    </main>
  );
}

describe('<Modal />', () => {
  it('shows modal when button is clicked', async () => {
    render(<Component />);
    const wrapper = createWrapper(document.body);
    const modalWrapper = wrapper.findModal()!;
    const button = wrapper.findButton('[data-testid="open-modal-button"]');

    expect(modalWrapper.isVisible()).toBe(false);

    button?.click();

    expect(modalWrapper.isVisible()).toBe(true);
  });
});
```

Render modal content slots
```
import Modal from '@cloudscape-design/components/modal';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return (
    <Modal footer={<p>Modal Footer</p>} visible={true} header={<h1>Modal Header</h1>}>
      <p>Modal Content</p>
    </Modal>
  );
}

describe('<Modal />', () => {
  it('renders header, content and footer in modal', async () => {
    render(<Component />);
    const wrapper = createWrapper(document.body);
    const modalWrapper = wrapper.findModal()!;
    const modalContent = modalWrapper.findContent().getElement();
    const modalHeader = modalWrapper.findHeader().getElement();
    const modalFooter = modalWrapper.findFooter()!.getElement();

    expect(modalContent.textContent).toContain('Modal Content');
    expect(modalHeader.textContent).toContain('Modal Header');
    expect(modalFooter.textContent).toContain('Modal Footer');
  });
});
```

## Unit testing APIs

ModalWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findDismissButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| isVisible | boolean | - | - |
## Integration testing examples

Show modal when button clicked
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Modal', () => {
  it('shows modal when button is clicked', async () => {
    // this code tests a component instance similar to this /components/modal&example=default
    await browser.url('your-page-to-test');
    const wrapper = createWrapper();
    const modalWrapper = wrapper.findModal()!;
    const buttonSelector = wrapper.findButton('[data-testid="open-modal-button"]').toSelector();

    await browser.$(buttonSelector).click();

    expect(await browser.$(modalWrapper.findContent().toSelector()).getText()).toContain(
      'Your description should go here'
    );
  });
});
```

## Integration testing APIs

ModalWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDismissButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use an action button to act on the entire contents of a modal. For example: *Save*   , *Delete, Done*   , *Cancel*  .
- Use a [flash message](/components/flashbar/index.html.md)   to confirm the result of committing modal data.
- Use a modal primarily to confirm or cancel a choice. For example, [deleting a resource](/patterns/resource-management/delete/index.html.md)  .
- Keep the text short and interactions to a minimum. Try to avoid  scrolling content.
- When the modal content can change dynamically, consider using top positioning or a custom size to prevent layout shifts.

### Don't

- Avoid tabs, or expanded sections in modal which overload the interface.
- Never launch another modal from within a modal.
- Do not chain together a sequence of modals. Instead of using a sequence of modals with multiple steps over multiple pages, use the [multipage create flow](/patterns/resource-management/create/multi-page-create/index.html.md)  .

## Features

- #### Overlay

  A modal will tint the outlying content areas to indicate that they are blocked from user interaction.
- #### Header

  Provides a short summary of the requested user action.
- #### Content

  The area for modal content. Common content types of a modal are:  

  - [Alert](/components/alert/index.html.md)     and description to inform the consequences of the user actions, for example, in [delete](/patterns/resource-management/delete/index.html.md)     pattern to provide details of a delete action and in [communicating unsaved changes](/patterns/general/unsaved-changes/index.html.md)     to communicate unsaved changes.
  - [Input fields](/components/input/index.html.md)     and simple [selects](/components/select/index.html.md)     to create resource, for example, in [create resource flow](/patterns/resource-management/create/index.html.md)    .
  - [Tiles](/components/tiles/index.html.md)     and description to facilitate comparison, for example, in [density settings](/patterns/general/density-settings/index.html.md)     to compare content density modes and in [split panel](/components/split-panel/index.html.md)     to compare display modes.
  - [Checkboxes](/components/checkbox/index.html.md)     , [radio groups](/components/radio-group/index.html.md)     , and [toggles](/components/toggle/index.html.md)     to change preference settings, for example, in [collection preferences](/components/collection-preferences/index.html.md)     for table and cards.
- #### Dismiss button

  Always allows the user to dismiss the modal. Dismissing via the *X*   icon is the same as canceling when more than one input or action is present in the dialog box.
- #### Scrolling content area

  A scrolling viewport for content that overflows the visible area.
- #### Footer

  An area at the bottom of the dialog box for actions, such as *Cancel, Create, Delete, or Save.*  

  While form controls may be placed within the content area, actions that commit or cancel an operation should always be placed in the footer area.
- #### Size

  Sets the width of the modal. The default is **medium**  . **Max**   varies to fit the largest size. Other sizes (small/medium/large/x-large/xx-large) are fixed width. If the predefined sizes don't work for your use case, you can also set a custom width and height.

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

#### Header

- Start with an active verb, where possible.
- Don't use terminal punctuation (period, colon, or similar).  

  - For example: *Delete channel*

#### Description

- Use one or two short sentences that describe the task. Use active voice instead of passive voice.
- Keep text concise and to the point, because text can grow by as much as three times its size when it is translated into other languages.

#### Button

- Don't include *Yes*   for buttons that confirm an action  

  - For example: in a modal that prompts users to confirm a system reboot, use *Reboot*
- Follow the writing guidelines for [button](/components/button/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Roles and landmarks

- The modal component comes with its own `role`   attribute set to `alert`   in order to announce it to screen readers. Don't add any additional roles yourself.

#### Alternative text

- Provide alternative text for the X close icon according to the alternative text guidelines using `closeLabel`   property.  

  - For example: *Close*

#### Keyboard interaction

- The default keyboard functionality is to focus the modal *Close*   button when the modal is opened.






## Modal title

Your description should go here Cancel Ok

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
