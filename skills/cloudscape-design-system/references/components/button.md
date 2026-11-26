---
scraped_at: '2026-04-20T08:47:07+00:00'
section: components
source_url: https://cloudscape.design/components/button/index.html.md
title: Button
---

# Button

Allows users to initiate actions in the user interface.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/button)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/button/index.html.json)

## Development guidelines

If you want to place multiple buttons next to each other, use the [space between component](/components/space-between/index.html.md) with size `xs` to add horizontal spacing between them.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting button
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Button from '@cloudscape-design/components/button';

describe('<Button />', () => {
  it('renders the button component', () => {
    const { container } = render(<Button />);
    const wrapper = createWrapper(container);

    expect(wrapper.findButton()).toBeTruthy();
  });

  it('selects all button components', () => {
    const { container } = render(<>
      <Button />
      <Button />
      <Button />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllButtons();
    expect(components).toHaveLength(3)
  });
});
```

Clicking button
```
import Button from '@cloudscape-design/components/button';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';

import { render } from '@testing-library/react';
import { useState } from 'react';

function Component() {
  const [isClicked, setIsClicked] = useState('No');

  return (
    <section>
      <TextContent>Is clicked? {isClicked}</TextContent>
      <Button onClick={() => setIsClicked('Yes!')}>Test button</Button>
    </section>
  );
}

describe('<Button />', () => {
  it('changes the text when clicked', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findButton()!.click();

    const textContent = wrapper.findTextContent()!.getElement().textContent;

    expect(textContent).toBe('Is clicked? Yes!');
  });
});
```

Checking if disabled
```
import Button from '@cloudscape-design/components/button';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

function Component() {
  return <Button disabled>Save!</Button>;
}

describe('<Button />', () => {
  it('disables the button', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    expect(wrapper.findButton()!.isDisabled()).toBeTruthy();
  });
});
```

Checking if loading
```
import Button from '@cloudscape-design/components/button';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

function Component() {
  return <Button loading>Test button</Button>;
}

describe('<Button />', () => {
  it('shows the loading spinner', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const loadingIndicator = wrapper.findButton()!.findLoadingIndicator();

    expect(loadingIndicator).toBeTruthy();
  });
});
```

## Unit testing APIs

ButtonWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLoadingIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTextRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| isDisabled | boolean | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLoadingIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTextRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| isDisabled | boolean | - | - |
## Integration testing examples

Clicking button
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Button', () => {
  it('changes the text when clicked', async () => {
    // This code tests a component similar to the TestPage.tsx example below.
    await browser.url('your-test-page');
    const wrapper = createWrapper();

    const buttonSelector = wrapper.findButton().toSelector();
    await browser.$(buttonSelector).click();

    const textSelector = wrapper.findTextContent().toSelector();
    const text = await browser.$(textSelector).getText();

    expect(text).toBe('Is clicked? Yes!');
  });
});

/**
 * TestPage.tsx
 *
 * function Component() {
 *   const [isClicked, setIsClicked] = useState('No');
 *
 *   return (
 *      <section>
 *        <TextContent>Is clicked? {isClicked}</TextContent>
 *        <Button onClick={() => setIsClicked('Yes!')}>Test button</Button>
 *      </section>
 *   );
 * }
 */
```

Selecting the loading indicator
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Button', () => {
  it('selects the loading indicator', async () => {
    /**
     * This code tests the component: <Button loading={true} />
     * Check the playground: /components/button/?tabId=playground&example=default
     */
    await browser.url('your-test-page');
    const wrapper = createWrapper();

    const loadingIndicatorSelector = wrapper.findButton()?.findLoadingIndicator().toSelector();
    const loadingIndicatorExists = await browser.$(loadingIndicatorSelector).isExisting();

    expect(loadingIndicatorExists).toBe(true);
  });
});
```

## Integration testing APIs

ButtonWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLoadingIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTextRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLoadingIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTextRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use buttons for actions. Use links when taking the user to a different  page.
- A button can be primary, secondary, or tertiary, depending on its  importance in the hierarchy of decision-making.
- Use the attention-grabbing primary button to communicate the most  recommended action on the page.
- Primary buttons are like [The Highlander](https://en.wikipedia.org/wiki/Highlander_(film))   , there can be only one. Use only one primary button per page.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

### Don't

- Don't hide buttons. Deactivate buttons when an action cannot be taken in a certain context. For example: deactivate a delete button when no item has been selected, because a user must first select which item to delete.
- Don't deactivate submit buttons in forms with multiple fields. Instead, use [validation](/patterns/general/errors/validation/index.html.md)   . Users choose the *Submit*   button, which invokes [validation](/patterns/general/errors/validation/index.html.md)   . When multiple fields are present, it's not  always clear to the user what they need to do to activate the button.
- Don't use icons for decoration. Only use icons in addition to text when the text for the action is ambiguous or unusual.

## Features

- #### Variant

  There are six types of buttons:  

  - **Primary**     - The [primary button](/components/button/index.html.md)     is used to call out the most common action that users will take on the page (only one per page).    

    - For example: *Create*       (for a table), or *Submit*       (for a form)
  - **Normal**     - [Normal buttons](/components/button/index.html.md)     are the default button type. You can use normal buttons for most secondary actions on the page.    

    - For example, on an item detail page: *Edit*       or *Modify*
  - **Link**     - [Link buttons](/components/button/index.html.md)     are equivalent to tertiary actions.    

    - For example, in a modal: *Cancel*
  - **Inline link **     - Inline link buttons are a link button that is placed in-context to items in table rows. Use this so as not to impact the height of the table row where data density is important.    

    - For example: A download button placed in table cells within the actions column in a table.
  - **Icon**     - An [icon button](/components/button/index.html.md)     is an [action icon](/foundation/visual-foundation/iconography/index.html.md)     that is displayed as a standalone trigger for an element or action. Icon buttons should be clear enough without text. If you feel like the icon can't speak for itself, do not use a standalone icon button.    

    - For example: The settings icon used to show preferences on a table.
  - **Inline icon**     - An [inline icon button](/components/button/index.html.md)     is an icon button that is placed inline next to text or used when space is limited.    

    - For example: The copy icon used to [copy one line of text](/components/copy-to-clipboard/index.html.md)      .
    - For example: A download icon placed in table cells within the actions column in a table.

  Buttons can also be used for actions in a [header](/components/header/index.html.md)   component.
- #### Icons

  While text should be the default label on a button, there are two ways to use icons with buttons:  

  - Icons inside primary, normal, or link button variants    

    - If the text on a button is not clear enough, you can also include an icon in the button to support the concept. When using icons in addition to text, place the icon before the text  (except for [external](/components/button/index.html.md)       icons, which should always appear after the accompanying link or text).      

      - For example: Git actions such as pull-request, merge, or fork could use icons to help users visualize and recognize the terms.
    - When using icons to describe common actions that are grouped with other elements, such as within a [header](/components/header/index.html.md)       component or attached to a [form field](/components/form-field/index.html.md)       component, place the icon inside a normal button.      
      For very common actions that are clear to the user, text can be omitted as long as you provide alternative text describing the button's purpose.      

      - For example: [refresh on a table](/patterns/general/loading-and-refreshing/index.html.md)        .
  - Icons as standalone actions    

    - Standalone actions, such as table preferences, should use the [icon button](/components/button/index.html.md)       type. These should only be used for actions that are clear without text; do not add accompanying text.
- #### Full width buttons - optional

  A button that takes up the full width of its container that can be used in situations where the container has restricted width (for example, a sign-in form or on small viewports). Full width buttons can be primary, normal, or link buttons.
- #### Disabled reason - optional

  You can use a tooltip with disabled primary button, normal button or icon button to explain why the action is unavailable.

### States

- #### Disabled

  Use the disabled state to prevent the user from initiating an action, as well as when a user still needs to perform an action to activate an item. Include a spinner in the disabled state when an action is being initiated.

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

- Use one or two words for the label. Use additional words only when you must add clarity:
- An action verb  

  - For example: *Start, Continue, Open, Create*
- An action verb plus a proper noun, including brand names (use proper nouns sparingly and only when they provide additional clarity)  

  - For example: *Launch EC2 instance*
- An action verb plus a feature or item name  

  - For example:* Create identity source, Create permission set*
- When additional clarity is required, be concise. Try to use a section header, page title, or other content to provide context so that the button does not need additional words.  

  - For example: *View dashboard*     if there's only one dashboard on the page, instead of *View Storage Lens dashboard*     because the page already describes Storage Lens.
- Don't include *Yes*   for buttons that confirm an action.  

  - For example: In a modal that prompts users to confirm a system reboot, use this label: *Reboot*
- Don't use terminal punctuation (period, exclamation point, question mark, colon) for button labels.
- Don't use articles (a, an, the) in button labels.  

  - For example: *Migrate server*     instead of *Migrate a server*

#### Disabled reasons

- Follow the guidelines for [short in-context disabled reasons](/patterns/general/disabled-and-read-only-states/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Provide alternative text with the `ariaLabel`   property if there is no button text or if you are conveying additional information through means other than text.
- The accessible button name should be unique on the page whenever possible, for example a repeated delete button should indicate what it deletes. In cases where this is not possible, be sure that there is an additional mechanism for disambiguation such as a named group.
- When using an icon in a button, if the text label of the button describes the icon sufficiently, there is no need to add alternative text to the icon itself.  

  - An external link icons represent the idea of "opens in a new window", that should be applied to the icon as alt text.
  - A button with a copy icon next to the word *Copy*     would not need the icon to be labeled because it is redundant.
- Remember: `ariaLabel`   will override any text inside of the button, including any string passed to iconAlt. Be sure to include information about the icon in your ariaLabel if the icon is providing additional information from the text label.  

  - For an external link button that requires an ariaLabel include *opens in a new window *     text in the `ariaLabel`     prop.

#### Additional ARIA Properties

- If a button controls the expansion and collapse of another element, use the `ariaExpanded`   prop to convey the controlled element's current state.

#### Keyboard interaction

- By default, the tab key focuses the component.
- The enter key performs the action.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
