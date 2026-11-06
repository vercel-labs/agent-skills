---
scraped_at: '2026-04-20T08:48:50+00:00'
section: components
source_url: https://cloudscape.design/components/multiselect/index.html.md
title: Multiselect
---

# Multiselect

Multiselects enable users to choose multiple items from a list of options.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/multiselect)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/multiselect/index.html.json)

## Development guidelines

The select component comes with two ways to provide options to the user.

#### Static options

If you have the full list of options available
and you don't need to fetch more options as the user types,
you can just set the `options` property.

By default, the component will filter the available options by checking
if the user input is a substring of either the value, label, description or if it is contained in the set of tags or filteringTags of each option.

If you prefer to have a custom filtering of the list of options, you can:

- set `filteringType`   to `"manual"`   ,
- listen to the `onChange`   event to update the list of options.

#### Asynchronously fetched options

If the list of available options has to be asynchronously fetched as the user types in the filtering input field:

- listen to the `onLoadItems`   event to determine when to set a loading state and clear the current list of options:  

  - set the `statusType`     property to `"loading"`     ,
  - set the `options`     property to an empty array
  - the `loadingText`     will then be displayed in the list to inform the user that resources are being fetched.
- at the same time, trigger API calls to fetch more options using event details.  
  Once the new options have been fetched:  

  - update the component's `options`     property,
  - remove the loading state by setting the `statusType`     property to `"finished"`     ,
  - in case of an error, set the `statusType`     property to `"error"`     which will cause the `errorText`     to appear.
- set `filteringType`   to `"manual"`   to disable default filtering.  
  The assumption is that the list of options you return are all relevant, given the user input.

You can find an example implementation for fetching options by pages at the end of this page.

#### State management

The multiselect component is controlled. Set the `selectedOptions` property and the `onChange` listener to store the selected options in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Testing guidelines

The multiselect dropdown uses complex event listeners to open the dropdown and select items. Make sure to use the `openDropdown()` and `selectOption()` methods respectively.

When using asynchronous loading, the `onLoadItems` event is not called immediately after an interaction, for example focusing or changing the filtering text. Make sure to instruct your test code to properly wait for the next assertion.

## Unit testing examples

Selecting multiselect
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Multiselect from '@cloudscape-design/components/multiselect';

describe('<Multiselect />', () => {
  it('renders the multiselect component', () => {
    const { container } = render(<Multiselect />);
    const wrapper = createWrapper(container);

    expect(wrapper.findMultiselect()).toBeTruthy();
  });

  it('selects all multiselect components', () => {
    const { container } = render(<>
      <Multiselect />
      <Multiselect />
      <Multiselect />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllMultiselects();
    expect(components).toHaveLength(3)
  });
});
```

Finding options in dropdown
```
import Multiselect, { MultiselectProps } from '@cloudscape-design/components/multiselect';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const options = [
  {
    label: 'Option 1',
    value: '1',
  },
  {
    label: 'Option 2',
    value: '2',
  },
  {
    label: 'Option 3',
    value: '3',
  },
];

function Component() {
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps['selectedOptions']>([]);

  return (
    <Multiselect
      options={options}
      selectedOptions={selectedOptions}
      onChange={event => setSelectedOptions(event.detail.selectedOptions)}
    />
  );
}

describe('<Multiselect />', () => {
  it('lists the options in dropdown', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findMultiselect()!.openDropdown();

    const options = wrapper.findMultiselect()!.findDropdown()!.findOptions();
    const optionLabels = options.map(option => option.findLabel().getElement().textContent);

    expect(optionLabels).toEqual(['Option 1', 'Option 2', 'Option 3']);
  });
});
```

Selecting options from dropdown
```
import Multiselect, { MultiselectProps } from '@cloudscape-design/components/multiselect';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const options = [
  {
    label: 'Option 1',
    value: '1',
  },
  {
    label: 'Option 2',
    value: '2',
  },
  {
    label: 'Option 3',
    value: '3',
  },
];

function Component() {
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps['selectedOptions']>([]);

  return (
    <Multiselect
      options={options}
      selectedOptions={selectedOptions}
      onChange={event => setSelectedOptions(event.detail.selectedOptions)}
    />
  );
}

describe('<Multiselect />', () => {
  it('selects options from the list', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findMultiselect()!.openDropdown();
    wrapper.findMultiselect()!.selectOptionByValue('2');
    wrapper.findMultiselect()!.selectOptionByValue('3');

    const tokens = wrapper.findMultiselect()!.findTokens();
    const tokenLabels = tokens.map(token => token.getElement().textContent);

    expect(tokenLabels).toEqual(['Option 2', 'Option 3']);
  });
});
```

Unselecting options
```
import Multiselect, { MultiselectProps } from '@cloudscape-design/components/multiselect';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const options = [
  {
    label: 'Option 1',
    value: '1',
  },
  {
    label: 'Option 2',
    value: '2',
  },
  {
    label: 'Option 3',
    value: '3',
  },
];

function Component() {
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps['selectedOptions']>([
    {
      label: 'Option 1',
      value: '1',
    },
    {
      label: 'Option 2',
      value: '2',
    },
  ]);

  return (
    <Multiselect
      options={options}
      selectedOptions={selectedOptions}
      onChange={event => setSelectedOptions(event.detail.selectedOptions)}
    />
  );
}

describe('<Multiselect />', () => {
  it('unselects the options using the dropdown', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findMultiselect()!.openDropdown();
    wrapper.findMultiselect()!.selectOptionByValue('2');

    const tokens = wrapper.findMultiselect()!.findTokens();
    const tokenLabels = tokens.map(token => token.getElement().textContent);

    expect(tokenLabels).toEqual(['Option 1']);
  });

  it('unselects the options using token dismiss button', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findMultiselect()!.findToken(2)!.findDismiss().click();

    const tokens = wrapper.findMultiselect()!.findTokens();
    const tokenLabels = tokens.map(token => token.getElement().textContent);

    expect(tokenLabels).toEqual(['Option 1']);
  });
});
```

## Unit testing APIs

MultiselectWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| clickSelectAll | - | Selects all options by triggering corresponding events on the element that selects or deselects all options in Multiselect when using the enableSelectAll flag.This utility does not open the dropdown of the given select. You will need to call openDropdown first in your test.Example:wrapper.openDropdown();wrapper.clickSelectAll(); | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| closeDropdown | - | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findDropdown | [OptionsDropdownContentWrapper](/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findErrorRecoveryButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findFilteringInput | [InputWrapper](/components/input/index.html.md) &#124; null | Returns the input that is used for filtering. | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findInlineLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findInlineToken | [TokenWrapper](/components/token/index.html.md) &#124; null | Returns an inline token. | tokenIndex:1-based index of the inline token to return |
| findInlineTokens | Array<[TokenWrapper](/components/token/index.html.md)> | - | - |
| findPlaceholder | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findStatusIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findToken | [TokenGroupItemWrapper](/index.html.md) &#124; null | Returns a token. | tokenIndex:1-based index of the token to return |
| findTokens | Array<[TokenGroupItemWrapper](/index.html.md)> | - | - |
| findTokenToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns a token toggle button. | - |
| findTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| isDisabled | boolean | - | - |
| openDropdown | - | - | - |
| selectOption | - | Selects an option for the given index by triggering corresponding events.This utility does not open the dropdown of the given select. You will need to call openDropdown first in your test.On selection the dropdown will close automatically.Example:wrapper.openDropdown();wrapper.selectOption(1); | index:1-based index of the option to selectoptions:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| selectOptionByValue | - | Selects an option for the given value by triggering corresponding events.This utility does not open the dropdown of the given select. You will need to call openDropdown first in your test.On selection the dropdown will close automatically.Example:wrapper.openDropdown();wrapper.selectOptionByValue('option_1'); | value:value of the optionoptions:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. | OptionsDropdownContentWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledOptions | Array<[OptionWrapper](/index.html.md)> | - | - |
| findFooterRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findGroup | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns an option group from the dropdown. | index:1-based index of the group to select. |
| findGroups | Array<[ElementWrapper](/index.html.md)> | Returns all option groups in the dropdown. | - |
| findHighlightedAriaLiveRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHighlightedMatches | Array<[ElementWrapper](/index.html.md)> | Returns highlighted text fragments from all of the options.Options get highlighted when they match the value of the input field. | - |
| findHighlightedOption | [OptionWrapper](/index.html.md) &#124; null | - | - |
| findOpenDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findOption | [OptionWrapper](/index.html.md) &#124; null | Returns an option from the dropdown. | optionIndex:1-based index of the option to select. |
| findOptionByValue | [OptionWrapper](/index.html.md) &#124; null | - | value: |
| findOptionInGroup | [OptionWrapper](/index.html.md) &#124; null | Returns an option from the dropdown. | groupIndex:1-based index of the group to select an option in.optionIndex:1-based index of the option to select. |
| findOptions | Array<[OptionWrapper](/index.html.md)> | - | - |
| findOptionsContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Use this element to scroll through the list of options | - |
| findSelectAll | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSelectedOptions | Array<[OptionWrapper](/index.html.md)> | - | - | TokenGroupItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDismiss | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findOption | [OptionWrapper](/index.html.md) | - | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTags | Array<[ElementWrapper](/index.html.md)> &#124; null | - | - |
| isDisabled | boolean | - | - |
## Integration testing examples

Finding options in dropdown
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Multiselect', () => {
  it('lists the options in dropdown', async () => {
    // this code tests a component instance similar to this /components/multiselect&example=default
    await browser.url('your-page-to-test');

    const wrapper = createWrapper().findMultiselect();

    await browser.$(wrapper.findTrigger().toSelector()).click();

    const optionsSelector = wrapper.findDropdown().findOptions().toSelector();
    const optionLabels = await browser.$$(optionsSelector).map(option => option.getText());

    expect(optionLabels).toEqual(['Option 1', 'Option 2', 'Option 3']);
  });
});
```

Selecting options from dropdown
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Multiselect', () => {
  it('selects options from the list', async () => {
    // this code tests a component instance similar to this /components/multiselect&example=default
    await browser.url('your-page-to-test');
    const wrapper = createWrapper().findMultiselect();

    await browser.$(wrapper.findTrigger().toSelector()).click();
    await browser.$(wrapper.findDropdown().findOptionByValue('2').toSelector()).click();
    await browser.$(wrapper.findDropdown().findOptionByValue('3').toSelector()).click();

    const tokensSelector = wrapper.findTokens().toSelector();
    const tokenLabels = await browser.$$(tokensSelector).map(token => token.getText());

    expect(tokenLabels).toEqual(['Option 2', 'Option 3']);
  });
});
```

Unselecting options
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Multiselect', () => {
  it('unselects the options using the dropdown', async () => {
    // this code tests a component instance similar to this /components/multiselect&example=default
    await browser.url('your-page-to-test');

    const wrapper = createWrapper().findMultiselect();

    await browser.$(wrapper.findTrigger().toSelector());
    await browser.$(wrapper.findDropdown().findOptionByValue('2').toSelector()).click();

    const tokensSelector = wrapper.findTokens().toSelector();
    const tokenLabels = await browser.$$(tokensSelector).map(token => token.getText());

    expect(tokenLabels).toEqual(['Option 1']);
  });

  it('unselects the options using token dismiss button', async () => {
    // this code tests a component instance similar to this /components/multiselect&example=default
    await browser.url('your-page-to-test');
    const wrapper = createWrapper().findMultiselect();

    await browser.$(wrapper.findTokens().get(2).findDismiss().toSelector());

    const tokensSelector = wrapper.findTokens().toSelector();
    const tokenLabels = await browser.$$(tokensSelector).map(token => token.getText());

    expect(tokenLabels).toEqual(['Option 1']);
  });
});
```

## Integration testing APIs

MultiselectWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDropdown | [OptionsDropdownContentWrapper](/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findErrorRecoveryButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findFilteringInput | [InputWrapper](/components/input/index.html.md) | Returns the input that is used for filtering. | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findInlineLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findInlineToken | [TokenWrapper](/components/token/index.html.md) | Returns an inline token. | tokenIndex:1-based index of the inline token to return |
| findInlineTokens | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TokenWrapper](/components/token/index.html.md)> | - | - |
| findPlaceholder | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findStatusIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findToken | [TokenGroupItemWrapper](/index.html.md) | Returns a token. | tokenIndex:1-based index of the token to return |
| findTokens | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TokenGroupItemWrapper](/index.html.md)> | - | - |
| findTokenToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns a token toggle button. | - |
| findTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | OptionsDropdownContentWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledOptions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[OptionWrapper](/index.html.md)> | - | - |
| findFooterRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findGroup | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns an option group from the dropdown. | index:1-based index of the group to select. |
| findGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Returns all option groups in the dropdown. | - |
| findHighlightedAriaLiveRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHighlightedMatches | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Returns highlighted text fragments from all of the options.Options get highlighted when they match the value of the input field. | - |
| findHighlightedOption | [OptionWrapper](/index.html.md) | - | - |
| findOpenDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOption | [OptionWrapper](/index.html.md) | Returns an option from the dropdown. | optionIndex:1-based index of the option to select. |
| findOptionByValue | [OptionWrapper](/index.html.md) | - | value: |
| findOptionInGroup | [OptionWrapper](/index.html.md) | Returns an option from the dropdown. | groupIndex:1-based index of the group to select an option in.optionIndex:1-based index of the option to select. |
| findOptions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[OptionWrapper](/index.html.md)> | - | - |
| findOptionsContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Use this element to scroll through the list of options | - |
| findSelectAll | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSelectedOptions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[OptionWrapper](/index.html.md)> | - | - | TokenGroupItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDismiss | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOption | [OptionWrapper](/index.html.md) | - | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTags | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
## General guidelines

### Do

- If possible, pre-select a good default item from the list.
- Order the items alphabetically unless you need to order the items  based on priority.
- Use groups if the options belong to different categories. Also  consider using groups if there are more than 16 suggestions.
- Use additional metadata per option only if absolutely necessary.  Adding extra information may impede decision-making if not necessary  to the interaction.
- Use hyphen (-) for any empty values.
- Use manual filtering, configured to support server-side asynchronous  fetching of options, to improve loading times when there are 50 or more options to choose from.
- If possible, try to avoid mixing groups and non grouped options.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .
- Use select all to improve efficiency when users are likely to choose all options.

### Don't

- Don't use inline tokens if token metadata or dismiss buttons are critical to the user.
- Don't hide tokens when they are necessary for task completion.

## Features

### General controls

- #### Filtering - optional

  With this feature, the user can filter through a list of items by label or additional metadata. This is helpful for larger or more complex datasets. There are two exclusive ways to set up the filtering mechanism. The filtering can either be performed automatically by the component, or manually configured. If you want to turn on server-side filtering, you need to manually configure filtering.  

  - Automatic filtering *- *     default    

    - Use [automatic filtering](/components/multiselect/index.html.md)       when the list of options typically takes only one API call to be fetched completely.
  - Manual filtering    

    - Use [manual filtering](/components/multiselect/index.html.md)       when the list of options is fetched asynchronously as the user scrolls or types.

  Note that when an Option Group is matched in automatic filtering, all of its nested Options are returned.
- #### Placeholder - optional

  A placeholder is text that is visible in the control when no items are selected. It indicates that the user needs to make at least one selection from the dropdown.

### Options list

- #### Label

  Each option needs a label as a unique identifier.
- #### Additional metadata - optional

  Each option can have additional filterable metadata to help the user's decision making. Use them scarcely and only if they are comparable across options. For example: storage size, RAM, cost, etc.  

  - Label tag is displayed on the right side to the label.
  - Descriptions can add extra information for a user to read and understand and can impede decision making if they're not necessary to the interaction.
  - Icons are displayed on the left side of the label. View available Cloudscape icons in [iconography](/foundation/visual-foundation/iconography/index.html.md)    .
  - Tags are used to display comparable metadata across options.
  - Filter tags are additional tags displayed only when matching the user's input.
- #### Groups - optional

  Options can be grouped into sections if there are clear categories among them. Only one level of nesting is allowed. Option groups can also be selected. When a user selects an option group, all of the enabled and visible options within the group will be selected. If filtering is used, only the active, visible subset of the options will be selected.
- #### Disabled reason - optional

  You can use a tooltip with a disabled option in the list to explain why this is unavailable.
- #### Select all - optional

  With this feature, users can select all available items within a list. Disabled items are not selected. Users can choose between selecting and deselecting all items. If additional items are loaded after selection, or there are items that are disabled, the select all option shows an indeterminate state inside the checkbox.

### States

- #### Loading

  - The state of fetching items, when getting options based on the user's entered query.
  - More options are loaded as a user scrolls through the current list.
- #### Error

  - An error state occurs when the control fails at fetching options (for example, if the API fails to load the    
    next set of options in the list).
  - Provide a [recovery action](/components/select/index.html.md)     in the error state, as a recovery mechanism.
- #### Finished

  The finished state communicates to the user that they have reached the end of the dataset.
- #### Zero results

  The state when the user's entered query does not match any of the options.
- #### Empty

  - The state when there are no options to choose from.
  - Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)    .
- #### Disabled

  You can apply an inactive state in one of two ways:  

  - On the entire select component, which prevents the user from interacting with the dropdown entirely.
  - On individual options in the list, so the user can interact with the dropdown but can't select specific (inactive) items.
- #### Read-only

  Use the read-only state when the multiselect is not to be modified by the user but they still need to view it.

### Tokens

Tokens are displayed when users make a selection in the dropdown.

- #### Token visibility and placement

  By default, all tokens are visible and shown below the trigger.  Token visibility and placement can be customized in three ways:  

  - **Inline tokens **     - Tokens are placed inside the trigger instead of below it. Token metadata is hidden, and some tokens may be cut off. Use in high density interfaces.
  - **Hide all tokens **     -** **     No tokens are shown.** **     Use in high density interfaces, when tokens are shown elsewhere on the page or when they are not critical for task completion.
  - **Hide some tokens **     -** **     Tokens up to a set number are shown. A show/hide link toggles visibility of the rest of the tokens. Use when most users will have a small number of tokens, but some users will have many tokens. If you know how many tokens are typically shown, hide tokens above that number.    

    - For example: If 90% of users only select 2 tokens, then hide all tokens above 2.

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

#### Labels

- Names of options in a list should be concise, typically from 1 to 3 words.

#### Descriptions

- Use parallel sentence structure.  

  - For example: all descriptions in the list should start either with verbs or with nouns. Don't mix the two.
- Keep in mind that text can grow by as much as three times its length when it is translated into other languages.

#### Loading state

- Use the format: *Loading \[options type\]*
- Follow the guidelines for [loading states](/patterns/general/loading-and-refreshing/index.html.md)  .

#### Error state

- Error message  

  - Use the format: *Error fetching \[options type\]*
  - Follow the guidelines for [validation](/patterns/general/errors/validation/index.html.md)     and [alert](/components/alert/index.html.md)    .
- Recovery action  

  - Use this text: *Retry*
  - Follow the writing guidelines for [buttons](/components/button/index.html.md)    .

#### Finished state

- When the user reaches the end of filtered results, use the format: *End of "\[filter text\]" results*  

  - For example: *End of "sg-5" results*
- When the user reaches the end of all results in a non-filtered list, use the format: *End of results*

#### Zero results state

- Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .

#### Token show/hide link

- Use the format: *Show chosen \[objects\]*   and *Hide chosen \[objects\]*  

  - For example: *Show chosen services*     and *Hide chosen services*
- When hiding some tokens, use the format: *Show more chosen \[objects\]*   and *Show fewer chosen \[objects\]*  

  - For example: *Show more chosen services*     and *Show fewer chosen services*

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

- Specify alternative text for the deselection button of the tokens through the `deselectAriaLabel`   property.  

  - For example: *Remove option.*
- Additionally, when enabling filtering, label the filtering input through `filteringAriaLabel`  .
- Set `renderHighlightedAriaLive`   or `selectedAriaLabel`   to label selected options for screen readers.
- `selectedAriaLabel`   : The value of this property will be appended to the end of the option announced by screen readers.  

  - For example: `selectedAriaLabel`     set to *selected*     would produce the message *option 1 selected*     for a selected option `{label: "option 1"}`
- `renderHighlightedAriaLive`   gives you full control over how screen readers are going to read out options. The returned string should contain all visible properties of the option and the information about its selected state.
- `ariaLabel`   in inline variant: For multiselects with inline tokens, include all visible tokens in the aria label.  

  - For example, if 4 tokens are selected and 2 are shown inline, the aria label should be:    

*Option 1, Option 2, and 2 more options selected*

### Keyboard interaction

- By default, the tab key focuses the component.
- The enter key opens the list of options.
- Use the keyboard arrows to highlight options and press the enter key to select.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
