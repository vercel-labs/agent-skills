---
scraped_at: '2026-04-20T08:49:59+00:00'
section: components
source_url: https://cloudscape.design/components/top-navigation/index.html.md
title: Top navigation
---

# Top navigation

A global navigation element for applications that is consistent and persists across all application pages.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/top-navigation) [View in demo](/examples/react/non-console.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/top-navigation/index.html.json)

## Development guidelines

#### Implementing fixed navigation

The top navigation component is designed to be implemented as a navigational element that is always visible at the top of the screen, occupying the full width of the page.

When applying `position: sticky` CSS styles to the navigation, it's important to also specify an appropriate `z-index` value. Use a value between 1002 and 1999 to ensure the navigation aligns properly with other Cloudscape components. Refer to the [z-index article](/get-started/dev-guides/z-index/index.html.md) for more information.

If you are using the [app layout](/components/app-layout/index.html.md) component in your application, make sure to reference the top navigation component (or a wrapping element) in the `headerSelector` property of the app layout. Or simply use the default selector `#h`.

You can find an example implementation of this component at the end of this page or on the [top navigation demo page](/examples/react/non-console.html).

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting top navigation
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import TopNavigation from '@cloudscape-design/components/top-navigation';

describe('<TopNavigation />', () => {
  it('renders the top-navigation component', () => {
    const { container } = render(<TopNavigation />);
    const wrapper = createWrapper(container);

    expect(wrapper.findTopNavigation()).toBeTruthy();
  });

  it('selects all top-navigation components', () => {
    const { container } = render(<>
      <TopNavigation />
      <TopNavigation />
      <TopNavigation />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllTopNavigations();
    expect(components).toHaveLength(3)
  });
});
```

Selecting title, logo or the identity link
```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TopNavigation from '@cloudscape-design/components/top-navigation';

import { render } from '@testing-library/react';

function Component() {
  return (
    <TopNavigation
      identity={{
        href: '#/identity/path',
        title: 'Top navigation',
        logo: {
          alt: 'Top navigation logo',
          src: 'path/to/logo.svg',
        },
      }}
    />
  );
}

describe('<TopNavigation />', () => {
  it('selects identity information of the top navigation', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);
    const topNavigation = wrapper.findTopNavigation()!;

    const title = topNavigation.findTitle()!.getElement();
    const logo = topNavigation.findLogo()!.getElement();
    const link = topNavigation.findIdentityLink()!.getElement();

    expect(title.textContent).toBe('Top navigation');
    expect(logo).toHaveAttribute('src', 'path/to/logo.svg');
    expect(link).toHaveAttribute('href', '#/identity/path');
  });
});
```

Interacting with utility menu items
```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';
import TopNavigation from '@cloudscape-design/components/top-navigation';

import { render } from '@testing-library/react';
import { useState } from 'react';

function Component() {
  const [selectedPath, setSelectedPath] = useState<string>();

  return (
    <>
      <TopNavigation
        identity={{ href: '#' }}
        utilities={[
          {
            type: 'button',
            href: '#/button/href',
            onClick: () => setSelectedPath('#/button/href'),
          },
          {
            type: 'menu-dropdown',
            onItemClick: ({ detail }) => setSelectedPath(detail.href),
            items: [
              {
                id: 'menu-item-1',
                text: 'Menu item 1',
                href: '#/menu/item/1',
              },
              {
                id: 'menu-item-2',
                text: 'Menu item 2',
                href: '#/menu/item/2',
              },
            ],
          },
        ]}
      />
      <TextContent>Selected path: {selectedPath}</TextContent>
    </>
  );
}

describe('<TopNavigation />', () => {
  it('selects a menu item from the top navigation utilities', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    // Use `findMenuDropdownType` to access dropdown utilities
    const utilityDropdown = wrapper.findTopNavigation()!.findUtility(2)!.findMenuDropdownType()!;
    utilityDropdown.openDropdown();
    utilityDropdown.findItemById('menu-item-2')!.click();
    const dropdownPath = wrapper.findTextContent()!.getElement().textContent;

    expect(dropdownPath).toBe('Selected path: #/menu/item/2');
  });

  it('selects the button from the top navigation utilities', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    // Use `findButtonLinkType` to access button utilities
    const utilityButton = wrapper.findTopNavigation()!.findUtility(1)!.findButtonLinkType()!;
    utilityButton!.click();
    const buttonPath = wrapper.findTextContent()!.getElement().textContent;

    expect(buttonPath).toBe('Selected path: #/button/href');
  });
});
```

Interacting with the search bar
```
import Input from '@cloudscape-design/components/input';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';
import TopNavigation from '@cloudscape-design/components/top-navigation';

import { render } from '@testing-library/react';
import { useState } from 'react';

function Component() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <TopNavigation
        identity={{ href: '#' }}
        search={<Input value={searchTerm} onChange={({ detail }) => setSearchTerm(detail.value)} />}
      />
      <TextContent>Search term: {searchTerm}</TextContent>
    </>
  );
}

describe('<TopNavigation />', () => {
  it('enters search term inside the top navigation', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findTopNavigation()!.findSearch()!.findInput()!.setInputValue('test search term');
    const searchTermText = wrapper.findTextContent()!.getElement().textContent;

    expect(searchTermText).toBe('Search term: test search term');
  });
});
```

## Unit testing APIs

TopNavigationWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findIdentityLink | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findLogo | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findOverflowMenu | OverflowMenu &#124; null | - | - |
| findOverflowMenuButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findSearch | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSearchButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findUtilities | Array<[TopNavigationUtilityWrapper](/index.html.md)> | - | - |
| findUtility | [TopNavigationUtilityWrapper](/index.html.md) &#124; null | - | index: | TopNavigationUtilityWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findButtonLinkType | [LinkWrapper](/components/link/index.html.md) &#124; null | - | - |
| findMenuDropdownType | [TopNavigationMenuDropdownWrapper](/index.html.md) &#124; null | - | - |
| findPrimaryButtonType | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - | TopNavigationMenuDropdownWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the disabled reason tooltip for a dropdown item. Returns null if no disabled item with disabledReason is highlighted. | - |
| findExpandableCategoryById | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds an expandable category in the open dropdown by category id. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first. | id: |
| findHighlightedItem | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the highlighted item in the open dropdown. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first. | - |
| findItemById | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds an item in the open dropdown by item id. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first.Supported options:disabled (boolean) - Use it to find the disabled or non-disabled item. | id:options: |
| findItemCheckedById | string &#124; null | Finds checked value of item in the open dropdown by item id. Returns null if there is no open dropdown or the item is not a checkbox item.This utility does not open the dropdown. To find dropdown items, call openDropdown() first. | id: |
| findItems | Array<[ElementWrapper](/index.html.md)> | Finds all the items in the open dropdown. Returns empty array if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first.Supported options:disabled (boolean) - Use it to find all disabled or non-disabled items. | options: |
| findMainAction | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findNativeButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> | - | - |
| findOpenDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTriggerButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| openDropdown | - | - | - |
## Integration testing APIs

TopNavigationWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findIdentityLink | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLogo | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOverflowMenu | OverflowMenu | - | - |
| findOverflowMenuButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findSearch | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSearchButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findUtilities | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TopNavigationUtilityWrapper](/index.html.md)> | - | - |
| findUtility | [TopNavigationUtilityWrapper](/index.html.md) | - | index: | TopNavigationUtilityWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findButtonLinkType | [LinkWrapper](/components/link/index.html.md) | - | - |
| findMenuDropdownType | [TopNavigationMenuDropdownWrapper](/index.html.md) | - | - |
| findPrimaryButtonType | [ButtonWrapper](/components/button/index.html.md) | - | - | TopNavigationMenuDropdownWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the disabled reason tooltip for a dropdown item. Returns null if no disabled item with disabledReason is highlighted. | - |
| findExpandableCategoryById | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds an expandable category in the open dropdown by category id. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first. | id: |
| findHighlightedItem | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the highlighted item in the open dropdown. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first. | - |
| findItemById | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds an item in the open dropdown by item id. Returns null if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first.Supported options:disabled (boolean) - Use it to find the disabled or non-disabled item. | id:options: |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Finds all the items in the open dropdown. Returns empty array if there is no open dropdown.This utility does not open the dropdown. To find dropdown items, call openDropdown() first.Supported options:disabled (boolean) - Use it to find all disabled or non-disabled items. | options: |
| findMainAction | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findNativeButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOpenDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTriggerButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
## General guidelines

### Do

- For guidelines about how to structure the application's global functionality, see [top navigation](/patterns/general/service-navigation/top-navigation/index.html.md)   pattern.
- For a dropdown menu with no button text, specify the menu title inside the dropdown menu.
- Place important actions, such as *Sign out*   , only within your navigation.
- Use categories to separate sets of links that are unrelated to each other.
- To conserve space, use the dropdown menu to group related and associated links.
- Use icons without labels if they're easily recognized. For example: Commonly used icons such as search, notifications, settings, and profile.

### Don't

- Don't use more than four controls in the utility navigation. To conserve space on the top navigation bar, use dropdown menus to group associated links and menus.
- Don't use a dropdown menu for one link or action. Instead, use a button.
- Don't deactivate links or actions that can't be performed by users. Instead, don't display them in the top navigation. This helps free up limited space.

## Features

### Structure

- #### Application identity

  The application identity tells the user which application they're using. Always link it to the homepage of your particular service, so users can learn more about it.  

  If you are pairing a logo with an application name, the application name is removed on smaller screens to conserve space. Follow the guidelines for [responsive design.](/foundation/core-principles/responsive-design/index.html.md)
- #### Global search - optional

  - [Search input](/components/input/index.html.md)** -  **     Users can search for global items and resources.
  - [Autosuggest](/components/autosuggest/index.html.md)** - **     A list of suggestions that users can choose from.

  When space is reduced, the input is hidden until the user reveals it by using the search icon.
- #### Controls - optional

  To set up the [utility navigation area](/patterns/general/service-navigation/top-navigation/index.html.md)   in the top navigation component, you can add additional control types. These control types can be linked using:  

  - [Link buttons](/components/button/index.html.md)     - This control uses button text alone or with a supporting icon. When you pair an icon with button text, you can hide the button text to conserve space if the icon is globally recognizable.    

    - For example: Removing the user profile button text when it's supported with the user profile icon.
  - [External link buttons](/components/button/index.html.md)     - This control links to associated content outside the application, such as help documentation.
  - [Icon buttons](/components/button/index.html.md)     - This control links to external pages. Only use icon buttons if they're clear to the user without accompanying text. If the icon isn't clear to the user, use a link button with adjoining button text.    

    - For example: The notification icon can be used to link to a notification page.
  - [Badge](/components/button/index.html.md)     - Use to indicate a global state change on the icon, such as a badge to signify new messages.
  - [Dropdown](/components/button-dropdown/index.html.md)     menu - Sets of menu items grouped together under one button. Both icon buttons and link buttons can have dropdown menu items.    

    - Label **: **       Used to describe its content type. Keep it concise, for example: *Settings*
    - Description **: **       Used to provide more details related to the button label. For example, for the user name: *user id*       or *email address*
    - Link to internal or external pages: Organize links with more frequently used links at the top of the list. For information about creating a user menu, see the [top navigation](/patterns/general/service-navigation/top-navigation/index.html.md)       pattern.
    - Dividers **: **       Provide the ability to organize the menu by separating sets of links that aren't related to each other.
    - Categories: Categorize sets of related links together.** **       The category title works as a separator, so it can't be selected. Nest categories to only one level, not multiple levels.
- #### Overflow menu - optional

  Provides access to functionality that is made available to the user where there is a space constraint. Users open this menu from a link button with this text: *More*  

  When space is reduced, controls are moved into the overflow menu in the order they appear in the navigation. Prevent controls that are frequently accessed or require monitoring from moving into the overflow menu. For example: Preventing notifications from moving into the overflow menu so it's visible on all screen sizes.

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

#### Overflow menu

- For the overflow menu link button, use this text: *More*
- Use the same label and link text when items are moved into the menu.

#### Dropdown menu

- For button text, indicate the purpose of the menu set.  

  - For example: *Notifications*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- If providing both `identity.title`   and `identity.logo`   , use the same text for `identity.logo.alt`   as for `identity.title`  .
- Provide alternative text via the `ariaLabel`   property if there is no button text (icon variant), or if you are conveying additional information through means other than text (for example, color).

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
