---
scraped_at: '2026-04-20T08:49:36+00:00'
section: components
source_url: https://cloudscape.design/components/tabs/index.html.md
title: Tabs
---

# Tabs

With tabs, users can switch between different categories of information in the same view.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/tabs)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/tabs/index.html.json)

## Development guidelines

#### State management

By default, the Tabs component switches tabs automatically when the user clicks on a tab header.

If you want to control which tab is being shown, you need to explicitly set the `activeTabId` property and the `onChange` listener. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting tabs
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Tabs from '@cloudscape-design/components/tabs';

describe('<Tabs />', () => {
  it('renders the tabs component', () => {
    const { container } = render(<Tabs />);
    const wrapper = createWrapper(container);

    expect(wrapper.findTabs()).toBeTruthy();
  });

  it('selects all tabs components', () => {
    const { container } = render(<>
      <Tabs />
      <Tabs />
      <Tabs />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllTabs();
    expect(components).toHaveLength(3)
  });
});
```

Navigating to a tab using its index
```
import Tabs from '@cloudscape-design/components/tabs';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

const tabs = [
  { label: 'First tab label', id: 'first', content: 'First tab content area' },
  { label: 'Second tab label', id: 'second', content: 'Second tab content area' },
  { label: 'Third tab label', id: 'third', content: 'Third tab content area', disabled: true },
];

describe('<Tabs />', () => {
  it('navigates to the second tab', () => {
    const { container } = render(<Tabs tabs={tabs} />);
    const wrapper = createWrapper(container);

    wrapper.findTabs()?.findTabLinkByIndex(2)!.click();
    const activeTab = wrapper.findTabs()!.findTabContent()!.getElement();

    expect(activeTab.textContent).toBe('Second tab content area');
  });
});
```

Dismissing a dismissable tab
```
import Tabs, { TabsProps } from '@cloudscape-design/components/tabs';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import { useState } from 'react';

function Component() {
  const [tabs, setTabs] = useState<TabsProps['tabs']>([
    {
      label: 'First tab label',
      id: 'first',
      dismissible: true,
      onDismiss: () => dismissTab('first'),
    },
    {
      label: 'Second tab label',
      id: 'second',
      dismissible: true,
      onDismiss: () => dismissTab('second'),
    },
  ]);

  function dismissTab(tabId: string) {
    setTabs(tabs => tabs.filter(tab => tab.id !== tabId));
  }

  return <Tabs tabs={tabs} />;
}

describe('<Tabs />', () => {
  it('dismisses the first tab', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findTabs()!.findDismissibleButtonByTabId('first')!.click();
    const tabLinks = wrapper.findTabs()!.findTabLinks();

    expect(tabLinks).toHaveLength(1);
    expect(tabLinks[0].getElement().textContent).toBe('Second tab label');
  });
});
```

Selecting the disabled reason of a disabled tab
```
import Tabs, { TabsProps } from '@cloudscape-design/components/tabs';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { fireEvent, render } from '@testing-library/react';

const tabs: TabsProps['tabs'] = [
  {
    label: 'First tab label',
    id: 'first',
    disabled: false,
  },
  {
    label: 'Second tab label',
    id: 'second',
    disabled: true,
    disabledReason: 'User does not have access to this tab',
  },
];

describe('<Tabs />', () => {
  it('selects the custom option from the second tab', () => {
    const { container } = render(<Tabs tabs={tabs} />);
    const wrapper = createWrapper(container);

    const secondTab = wrapper.findTabs()!.findTabLinkById('second')!;
    fireEvent.mouseOver(secondTab.getElement());
    const disabledReason = secondTab.findDisabledReason()!.getElement();

    expect(disabledReason.textContent).toBe('User does not have access to this tab');
  });
});
```

## Unit testing APIs

TabsWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActionByTabId | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the tab action by using the tab id | id:ID of the clickable element to return |
| findActionByTabIndex | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the tab action by using the tab index | index:1-based index of the clickable element to return |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findActiveTab | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLAnchorElement &#124; HTMLButtonElement> &#124; null | Finds the currently active tab and returns the clickable element from its tab label. | - |
| findActiveTabAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the tab action for the active tab | - |
| findActiveTabDismissibleButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | Finds the dismissible button for the active tab | - |
| findDismissibleButtonByTabId | [ButtonWrapper](/components/button/index.html.md) &#124; null | Finds the dismissible button by using the tab id | id:ID of the clickable element to return |
| findDismissibleButtonByTabIndex | [ButtonWrapper](/components/button/index.html.md) &#124; null | Finds the dismissible button by using the tab index. | index:1-based index of the clickable element to return |
| findFocusedTab | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLAnchorElement &#124; HTMLButtonElement> &#124; null | Finds the currently focused tab, which might not be active if disabled with a reason. | - |
| findTabContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLDivElement> &#124; null | Finds the currently displayed tab content and returns it. | - |
| findTabHeaderContentByIndex | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLAnchorElement &#124; HTMLButtonElement> &#124; null | Finds the tab header container at the given position (1-based) and returns the element. | index:1-based index of the clickable element to return |
| findTabLinkById | [TabWrapper](/index.html.md) &#124; null | Finds the tab with the given ID and returns the clickable element from its tab label. | id:ID of the clickable element to return |
| findTabLinkByIndex | [TabWrapper](/index.html.md) &#124; null | Finds the tab at the given position (1-based) and returns the clickable element from its tab label. | index:1-based index of the clickable element to return |
| findTabLinks | Array<[ElementWrapper &#124; HTMLButtonElement>> | Finds all tab headers and returns the clickable elements from their labels. | - | TabWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

TabsWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActionByTabId | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the tab action by using the tab id | id:ID of the clickable element to return |
| findActionByTabIndex | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the tab action by using the tab index | index:1-based index of the clickable element to return |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findActiveTab | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the currently active tab and returns the clickable element from its tab label. | - |
| findActiveTabAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the tab action for the active tab | - |
| findActiveTabDismissibleButton | [ButtonWrapper](/components/button/index.html.md) | Finds the dismissible button for the active tab | - |
| findDismissibleButtonByTabId | [ButtonWrapper](/components/button/index.html.md) | Finds the dismissible button by using the tab id | id:ID of the clickable element to return |
| findDismissibleButtonByTabIndex | [ButtonWrapper](/components/button/index.html.md) | Finds the dismissible button by using the tab index. | index:1-based index of the clickable element to return |
| findFocusedTab | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the currently focused tab, which might not be active if disabled with a reason. | - |
| findTabContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the currently displayed tab content and returns it. | - |
| findTabHeaderContentByIndex | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the tab header container at the given position (1-based) and returns the element. | index:1-based index of the clickable element to return |
| findTabLinkById | [TabWrapper](/index.html.md) | Finds the tab with the given ID and returns the clickable element from its tab label. | id:ID of the clickable element to return |
| findTabLinkByIndex | [TabWrapper](/index.html.md) | Finds the tab at the given position (1-based) and returns the clickable element from its tab label. | index:1-based index of the clickable element to return |
| findTabLinks | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Finds all tab headers and returns the clickable elements from their labels. | - | TabWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use tabs for organizing discrete blocks of information.
- Use two to seven tabs in a tab view. This practice maintains uncluttered UI and reduces cognitive load for users.
- Disable the icon button or icon button dropdown in the action slot if the tab is disabled.
- When providing dismissible tabs and the user closes all tabs, provide a clear and informative empty state with next steps.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .
- Follow the guidelines for [announcing new features](/patterns/general/announcing-new-features/index.html.md)   to communicate if the tab is new, and follow the guidelines for [announcing beta and preview features](/patterns/general/announcing-beta-preview-features/index.html.md)   to communicate if the tab is in beta or preview.
- Use [badge](/components/badge/index.html.md)   after the tab label to display critical, actionable information, such as counts of unread messages or notifications.

### Don't

- Don't nest tabs.
- Don't use tabs as steps, application navigation, or in-page anchor navigation.
- Don't use tabs as navigation in edit and create flows. Instead use the multi-page creation flow to feature the steps to complete a flow.
- Don't use icons in tab labels as decoration.
- Don't use normal, primary or icon buttons for actions in tabs.
- Don't include info links as actions in tabs, instead add these within the content of the tab.

## Features

- #### Variant

  - **Default:**     designed to live directly on the page background and allow users to switch between discrete blocks of information in the same view.
  - **Container: **     used to switch between blocks of information inside one container.
  - **Stacked**     : optimized to be displayed adjacent to other stacked components.
- #### State

  A set of tabs can have only one active tab, the selected one. The remaining tabs in the set are inactive, or not selected by default. We strongly recommend making the first tab active by default.
- #### Header actions - optional

  Add a single [button](/components/button/index.html.md)   or [button dropdown](/components/button-dropdown/index.html.md)   to enable actions on the entire set of tabs. For example, creating a new tab.
- #### Tab actions - optional

  Add actions as [inline icon buttons](/components/button/index.html.md)   or [inline icon button dropdowns](/components/button-dropdown/index.html.md)   if users can perform actions on the tab. For example, dismissing a tab.  

**Number and order of actions**  

  - There are two actions options next to a tab label.    

    - First action can contain one inline icon button, or when more than two actions are required use icon button dropdown to collapse additional actions into a list.
    - Second action is reserved for the dismiss action and is always the last item.
- #### Disabled reason - optional

  You can use a tooltip with disabled tab to explain why the tab is unavailable.

### States

- #### Default

  A set of tabs can have only one active tab, the selected one. The remaining tabs in the set are inactive, or not selected by default. We strongly recommend making the first tab active by default.
- #### Disabled

  We don't recommend disabling tabs. If your content is coming soon, or if it's simply not available to your users, hide the tab instead of making it disabled. However, if you must disable a tab (such as when a user lacks permission), use the disabled property.

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

#### Tab label

- Ensure that the labels show a clear relationship between tab views.
- Use labels that indicate the main purpose of the associated tab.
- Avoid generic labels, such as *General*   or *Advanced*  .
- Don't use terminal punctuation.
- Limit each tab label to a maximum of two words.
- Try to keep each tab label roughly the same length.
- Use parallel structure. Either use all nouns, or all verbs.

#### Tab content

- Ensure that the tab's content is similar or related to the other tabs.
- Don't force users to navigate back and forth to compare data; keep such content in the same tab view.
- Avoid linking between tabs.

#### Disabled reasons

- Follow the guidelines for [short in-context disabled reasons](/patterns/general/disabled-and-read-only-states/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Keyboard interaction

- The default keyboard functionality is to focus on the first tab. Use the left and right keyboard arrows to shift focus from one tab to another and automatically display its associated tab panel.  

  - We support using the home and end keys to travel to the first and last elements within the tab list respectively.
  - We support using the page up and page down keys to scroll backwards and forwards respectively.
- When the focus is on a tab, using the tab key will move the focus to the associated tab panel.

#### Alternative text

- Make sure to assign a label to the tabs component. If there is a visible element that you can reference by ID, use the `ariaLabelledby`   property. Alternatively, you can use the `ariaLabel`   property to assign a label directly.
- Make sure to use the dismissLabel to pass an aria-label attribute for dismissible tabs.
- Make sure to use the aria-label attribute for the icon button or icon button dropdown if an action is being passed into the tab.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
