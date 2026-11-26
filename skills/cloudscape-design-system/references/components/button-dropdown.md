---
scraped_at: '2026-04-20T08:47:03+00:00'
section: components
source_url: https://cloudscape.design/components/button-dropdown/index.html.md
title: Button dropdown
---

# Button dropdown

With a button dropdown, you can group a set of actions under one button.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/button-dropdown)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/button-dropdown/index.html.json)

## Development guidelines

#### State management

Checkbox item types are controlled. You need to explicitly set the `checked` property on each item, and update the `checked` state in the `onItemClick` event listener.

Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting button dropdown
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import ButtonDropdown from '@cloudscape-design/components/button-dropdown';

describe('<ButtonDropdown />', () => {
  it('renders the button-dropdown component', () => {
    const { container } = render(<ButtonDropdown />);
    const wrapper = createWrapper(container);

    expect(wrapper.findButtonDropdown()).toBeTruthy();
  });

  it('selects all button-dropdown components', () => {
    const { container } = render(<>
      <ButtonDropdown />
      <ButtonDropdown />
      <ButtonDropdown />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllButtonDropdowns();
    expect(components).toHaveLength(3)
  });
});
```

Selecting action option
```
import ButtonDropdown, { ButtonDropdownProps } from '@cloudscape-design/components/button-dropdown';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const items: ButtonDropdownProps['items'] = [
  {
    id: 'action-1',
    text: 'Action 1',
  },
  {
    id: 'action-2',
    text: 'Action 2',
  },
];

function Component() {
  const [selectedActionId, setSelectedActionId] = useState<string>();

  return (
    <section>
      <TextContent>Selected action id: {selectedActionId}</TextContent>
      <ButtonDropdown items={items} onItemClick={event => setSelectedActionId(event.detail.id)} />
    </section>
  );
}

describe('<ButtonDropdown />', () => {
  it('selects option from dropdown', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findButtonDropdown()!.openDropdown();
    wrapper.findButtonDropdown()!.findItemById('action-2')!.click();

    expect(wrapper.findTextContent()!.getElement().textContent).toBe('Selected action id: action-2');
  });
});
```

## Unit testing APIs

ButtonDropdownWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the disabled reason tooltip for a dropdown item. Returns null if no disabled item with disabledReason is highlighted. | - |
| findExpandableCategoryById | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds an expandable category in the open dropdown by category id. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first. | id: |
| findHighlightedItem | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the highlighted item in the open dropdown. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first. | - |
| findItemById | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds an item in the open dropdown by item id. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first.Supported options:disabled (boolean) - Use it to find the disabled or non-disabled item. | id:options: |
| findItemCheckedById | string &#124; null | Finds checked value of item in the open dropdown by item id. Returns null if there is no open dropdown or the item is not a checkbox item.This utility does not open the dropdown. To find dropdown items, call openDropdown() first. | id: |
| findItems | Array<[ElementWrapper](/index.html.md)> | Finds all the items in the open dropdown. Returns empty array if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first.Supported options:disabled (boolean) - Use it to find all disabled or non-disabled items. | options: |
| findMainAction | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findNativeButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> | - | - |
| findOpenDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTriggerButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| openDropdown | - | - | - |
## Integration testing examples

Selecting action option
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('ButtonDropdown', () => {
  it('selects option from dropdown', async () => {
    // this code tests a component instance similar to this /components/multiselect&example=default
    await browser.url('your-page-to-test');
    const wrapper = createWrapper();

    await browser.$(wrapper.findButtonDropdown().findOpenDropdown().toSelector()).click();
    await browser.$(wrapper.findButtonDropdown().findItemById('action-2').toSelector()).click();

    const textContent = await browser.$(wrapper.findTextContent().toSelector()).getText();

    expect(textContent).toBe('Selected action id: action-2');
  });
});
```

## Integration testing APIs

ButtonDropdownWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the disabled reason tooltip for a dropdown item. Returns null if no disabled item with disabledReason is highlighted. | - |
| findExpandableCategoryById | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds an expandable category in the open dropdown by category id. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first. | id: |
| findHighlightedItem | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the highlighted item in the open dropdown. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first. | - |
| findItemById | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds an item in the open dropdown by item id. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first.Supported options:disabled (boolean) - Use it to find the disabled or non-disabled item. | id:options: |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Finds all the items in the open dropdown. Returns empty array if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first.Supported options:disabled (boolean) - Use it to find all disabled or non-disabled items. | options: |
| findMainAction | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findNativeButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOpenDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTriggerButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
## General guidelines

### Do

- Use a button dropdown to present 5-15 contextual actions that users can choose from to initiate one action.
- Sort the actions set in a logical and hierarchical order. Start with  the most relevant and frequently used actions at the top, and put destructive actions at the bottom.
- Since the primary variant points the way forward, use it only to start create flows.
- Since the primary variant points the way forward, use it only once on a page, with a maximum of 3 closely related actions.
- Use six or fewer actions in expandable child menus to prevent users from being overwhelmed.
- If multiple button dropdowns are needed within a page, use the icon dropdown only if the actions are the same in each dropdown. Otherwise, use the normal dropdown variant with an appropriate button label instead.
- Items that can be selected should be placed in separate categories from non-selectable items.
- Only use items that can be selected for actions that take effect immediately, like turning on bold text styles.
- When all actions are disabled due to the same reason, disable the button dropdown and show tooltip at parent level.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

### Don't

- Don't use the expandable mode with the primary button variant.
- Don't change the label of selectable items depending on the selected state.

## Features

- #### Variant

  There are four types of button dropdowns:  

  - **Primary**     - The [primary button dropdown](/components/button-dropdown/index.html.md)     calls out a set of closely related primary actions users can take on a page (only one primary button or button dropdown per page).    

    - **Main action**       - o *ptional:*       Use the main action property when you need to expose one primary action outside of the dropdown.
  - **Normal**     - [Normal button dropdowns](/components/button-dropdown/index.html.md)     are the default button dropdown type. Use normal button dropdowns for the majority of dropdowns on a page.    

    - **Main action**       - o *ptional:*       Use the main action property when you need to expose one action outside of the dropdown.
  - **Icon **     - [Icon button dropdowns](/components/button-dropdown/index.html.md)     are an alternative to the normal button dropdown. The intended use case is for instances where the normal variant can't be used due to content density.    

    - For example: In dense dashboards, where the same actions are repeated across different cards, but the label either won't fit on the cards or creates too much visual noise when repeated throughout the interface.
  - **Inline icon **     - An [inline icon button dropdown](/components/button-dropdown/index.html.md)     is an icon button that is placed in-context to items. Use this so as not to impact the height of the table row where data density is important.    

    - For example: In cells within the actions column in a table.
- #### Categories

  Group sets of related actions into categories.  

  The category title works as a separator.  

  Nest categories to only one level, not multiple levels.
- #### Modes

  When a button dropdown has nested actions, it functions in one of the two modes:  

  - **Flat **     - In the [standard button dropdown](/components/button-dropdown/index.html.md)     , all actions are visible in the main dropdown area.
  - **Expandable **     - In the [expandable button dropdown](/components/button-dropdown/index.html.md)     , all parent actions are visible in the main dropdown area. Child actions are visible in a fly-out menu on large viewports or in an expandable section on smaller viewports.
- #### Item types

  Button dropdown items can have two types: action or selectable.  

  - **Action **     -** **     These items initiate an action.
  - **Selectable **     - These items can be selected or deselected. When selected, they show that the value is turned on, and a check mark is displayed to the left of the label or icon if present.
- #### Disabled reason - optional

  You can use a tooltip with button dropdown item, primary button dropdown, normal button dropdown, or icon button dropdown at parent level to explain why it is unavailable.
- #### Item metadata - optional

  Each action can have additional metadata to help the user's decision making. Use them scarcely and only if they are comparable across actions. For example: clarifying each action using secondary text, etc.  

  - Label tag is displayed on the right side to the label.
  - Secondary text can add extra information for a user to read and understand and can impede decision making if they're not necessary to the interaction.
  - Icons are displayed on the left side of the label. View available Cloudscape icons in [iconography](/foundation/visual-foundation/iconography/index.html.md)    .

### States

- #### Disabled

  Use the disabled state to prevent the user from initiating an action, and when a user still needs to perform a selection to activate an action in the item set. Include a spinner in the disabled state when an action is being initiated.

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

- Follow the writing guidelines for [button](/components/button/index.html.md)  .

#### Button dropdown

- For labels of button dropdown, indicate the purpose of the actions set.  

  - For example: *Create stream*

#### Category heading

- Summarize the content of the category items grouped below the category heading.

#### Selectable item label

- Title the label so that the choice and it's opposite are clear  

  - Example: *Show item descriptions*

#### Disabled reasons

- Follow the guidelines for [short in-context disabled reasons](/patterns/general/disabled-and-read-only-states/index.html.md)  .

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
