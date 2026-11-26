---
scraped_at: '2026-04-20T08:49:15+00:00'
section: components
source_url: https://cloudscape.design/components/select/index.html.md
title: Select
---

# Select

Selects enable users to choose a single item from a list of items.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/select)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/select/index.html.json)

## Development guidelines

The select component comes with two ways to provide options to the user.

#### Static options

If you have the full list of options available and you don't need to fetch more options as the user types, you can just set the `options` property.

By default, the component will filter the available options by checking if the user input is a substring of either the value, label, description or if it is contained in the set of tags or filteringTags of each option.

If you prefer to have a custom filtering of the list of options, you can:

- set `filteringType`   to `"manual"`   ,
- listen to the `onLoadItems`   event to update the list of options.

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

The select component is controlled. Set the `selectedOption` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting select
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Select from '@cloudscape-design/components/select';

describe('<Select />', () => {
  it('renders the select component', () => {
    const { container } = render(<Select />);
    const wrapper = createWrapper(container);

    expect(wrapper.findSelect()).toBeTruthy();
  });

  it('selects all select components', () => {
    const { container } = render(<>
      <Select />
      <Select />
      <Select />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllSelects();
    expect(components).toHaveLength(3)
  });
});
```

Selecting options in select
```
import Select, { SelectProps } from '@cloudscape-design/components/select';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

function Component() {
  const [selectedOption, setSelectedOption] = useState<SelectProps.ChangeDetail['selectedOption']>({
    label: 'Option 1',
    value: '1',
  });

  return (
    <Select
      selectedOption={selectedOption}
      onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
      options={[
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
        { label: 'Option 4', value: '4' },
        { label: 'Option 5', value: '5' },
      ]}
    />
  );
}

describe('<Select />', () => {
  it('selects an option using value', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findSelect()!;
    wrapper.openDropdown();

    expect(wrapper.findTrigger().getElement().textContent).toBe('Option 1');

    wrapper.selectOptionByValue('2');

    expect(wrapper.findTrigger().getElement().textContent).toBe('Option 2');
  });

  it('selects an option using index', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findSelect()!;
    wrapper.openDropdown();

    expect(wrapper.findTrigger().getElement().textContent).toBe('Option 1');

    wrapper.selectOption(2);

    expect(wrapper.findTrigger().getElement().textContent).toBe('Option 2');
  });
});
```

## Unit testing APIs

SelectWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| clickSelectAll | - | Selects all options by triggering corresponding events on the element that selects or deselects all options in Multiselect when using the enableSelectAll flag.This utility does not open the dropdown of the given select. You will need to call openDropdown first in your test.Example:wrapper.openDropdown();wrapper.clickSelectAll(); | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| closeDropdown | - | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findDropdown | [OptionsDropdownContentWrapper](/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findErrorRecoveryButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findFilteringInput | [InputWrapper](/components/input/index.html.md) &#124; null | Returns the input that is used for filtering. | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findInlineLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findPlaceholder | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findStatusIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
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
| findSelectedOptions | Array<[OptionWrapper](/index.html.md)> | - | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTags | Array<[ElementWrapper](/index.html.md)> &#124; null | - | - |
| isDisabled | boolean | - | - |
## Integration testing examples

Selecting options in select
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Select', () => {
  it('selects an option using value', async () => {
    await browser.url('your-page-to-test');
    const wrapper = createWrapper().findSelect();

    // opens the select dropdown
    await browser.$(wrapper.findTrigger().toSelector()).click();

    let options = await browser.$$(wrapper.findDropdown().findSelectedOptions().toSelector());

    expect(await options[0].getText()).toBe('Option 1');

    await browser.$(wrapper.findDropdown().findOptionByValue('2').toSelector()).click();
    options = await browser.$$(wrapper.findDropdown().findSelectedOptions().toSelector());

    expect(await options[0].getText()).toBe('Option 2');
  });

  it('selects an option using index', async () => {
    await browser.url('your-page-to-test');
    const wrapper = createWrapper().findSelect();

    // opens the select dropdown
    await browser.$(wrapper.findTrigger().toSelector()).click();

    let options = await browser.$$(wrapper.findDropdown().findSelectedOptions().toSelector());

    expect(await options[0].getText()).toBe('Option 1');

    await browser.$(wrapper.findDropdown().findOption(2).toSelector()).click();
    options = await browser.$$(wrapper.findDropdown().findSelectedOptions().toSelector());

    expect(await options[0].getText()).toBe('Option 2');
  });
});
```

## Integration testing APIs

SelectWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDropdown | [OptionsDropdownContentWrapper](/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findErrorRecoveryButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findFilteringInput | [InputWrapper](/components/input/index.html.md) | Returns the input that is used for filtering. | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findInlineLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findPlaceholder | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findStatusIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
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
| findSelectedOptions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[OptionWrapper](/index.html.md)> | - | - | OptionWrapper 

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
- Order the items alphabetically when there are eight to 15 items in the  list.
- Use groups if the options belong to different categories. Also  consider using groups if there are more than 16 suggestions.
- Use additional metadata per option only if absolutely necessary.  Adding extra information may impede decision-making if not necessary  to the interaction.
- Use minus sign (-) for any empty values.
- Use manual filtering, configured to support server-side asynchronous  fetching of options, to improve loading times when there are 50 or more options to choose from.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .
- Always include a visible label. In forms, use the [form field](/components/form-field/index.html.md)   . In filtering use cases such as the [collection select filter](/components/collection-select-filter/index.html.md)   , or when vertical space is limited, use an inline label.

## Features

- #### Labels

  Labels are a requirement for a11y compliance. There are two ways to display a label with a select input:  

**Form field label**  
  When used in forms, wrap the select in a [form field](/components/form-field/index.html.md)   . This provides a label above the input along with a description and validation. For example, when setting permissions, a select dropdown allows users to choose role or policy.  

**Inline label**  
  When used as a filter, use the `inlineLabelText`   property to display a label inline. This helps to minimize the vertical space. For example, applying a region filter to a resource table allows users to limit the list of resources in a region.  

  Follow the guidelines for the [collection select filter](/components/collection-select-filter/index.html.md)  .

### General controls

- #### Trigger variant - optional

  The trigger variant determines what information is visible for the selected item.  

  - [Label](/components/select/index.html.md)     - default    

    - Only the label of the selected item is visible in the control.
  - [Option](/components/select/index.html.md)    

    - All of the associated metadata for the selected item is visible in the control.
- #### Filtering - optional

  With the select feature, users can filter through the list of items by label or additional metadata. This is helpful for larger or more complex datasets. There are two exclusive ways to set up the filtering mechanism. The filtering can either be performed automatically by the component, or manually configured. If you want to activate server-side filtering, you need to manually configure filtering.  

  - Automatic filtering *- *     default    

    - Use [automatic filtering](/components/select/index.html.md)       when the list of options usually takes only one API call to be fetched completely.
  - Manual filtering    

    - Use [manual filtering](/components/select/index.html.md)       when the list of options is fetched asynchronously as the user scrolls or types.
- #### Placeholder - optional

  Placeholder text is visible in the control when no items are selected. It indicates that the user needs to make at least one selection from the dropdown.

### Options list

- #### Label

  Each option needs a label as a unique identifier.
- #### Additional metadata - optional

  Each option can have additional, filterable metadata to help the user's decision making. Only use this metadata if it's comparable across options. Examples include storage size, RAM, and operating costs.  

  - The label tag is displayed on the right side to the label.
  - Descriptions can add extra information for a user to read and understand. They can also impede decision making if they're not necessary to the interaction.
  - Icons are displayed on the left side of the label. View available icons in our [iconography](/foundation/visual-foundation/iconography/index.html.md)     article.
  - Tags are used to display comparable metadata across options.
  - Filter tags are additional tags displayed only when matching the user's input.
- #### Groups - optional

  Options can be grouped into sections if there are clear categories among them. There can only be one level of nesting.
- #### Disabled reason - optional

  You can use a tooltip with a disabled option in the list to explain why this is unavailable.

### States

- #### Loading

  - The state of fetching items, when getting options based on the user's entered query.
  - More options are loaded as a user scrolls through the current list.
- #### Error

  - An error state occurs when the control fails at fetching options (for example, if the API fails to load the next set of options in the list).
  - Provide a [recovery action](/components/select/index.html.md)     in the error state, as a recovery mechanism.
- #### Finished

  The finished state communicates to the user that they have reached the end of the dataset.
- #### Zero results

  The state when the user's entered query does not match any of the options.
- #### Empty

  - The state when there are no options to choose from.
  - Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)    .
- #### Disabled

  You can apply a disabled state in one of two ways:  

  1. On the entire select component, which will prevent the user from interacting with the dropdown entirely.
  2. On individual options in the list, which will let the user interact with the dropdown but prevent the user from selecting specific (disabled) items.
- #### Read-only

  Use the read-only state when the select data is not to be modified by the user but they still need to view it.

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

- Names of options in a list should be concise, typically from one to three words.
- Names of inputs are a short description of the corresponding control, follow the guidelines for [form field labels](/components/form-field/index.html.md)  .

#### Descriptions

- Use parallel sentence structure.  

  - For example: All descriptions in the list should start either with verbs or with nouns. Don't mix the two.
- Keep in mind that text can grow by as much as three times its length when it's translated into other languages.

#### Loading state

- Use the format: *Loading \[options type\]*
- Follow the guidelines for [loading states](/patterns/general/loading-and-refreshing/index.html.md)  .

#### Error state

- Error message  

  - Use the format: *Error fetching \[options type\]*
  - Follow the guidelines for [validation](/patterns/general/errors/validation/index.html.md)     and [alerts and error messages](/components/alert/index.html.md)    .
- Recovery action  

  - Use this text: *Retry*
  - Follow the writing guidelines for [buttons](/components/button/index.html.md)    .

#### Finished state

- When the user reaches the end of filtered results, use the format: *End of "\[filter text\]" results*  

  - For example:* End of "sg-5" results.*
- When the user reaches the end of all results in a non-filtered list, use this text: *End of results*

#### Zero results state

- Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .

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

- If you enable filtering, you also need to label the filtering input through `filteringAriaLabel`  .  

  - For example: *Filter options.*
- Set `renderHighlightedAriaLive`   or `selectedAriaLabel`   to label selected option for screen readers.
- `selectedAriaLabel`   : The value of this property will be appended to the end of the option announced by screen readers.  

  - For example:* *     selectedAriaLabel set to *selected*     would produce the message *option 1 selected*     for a selected option `{label: "option 1"}`
- `renderHighlightedAriaLive`   gives you full control over how screen readers are going to read out options. The returned string should contain all visible properties of the option and the information about its selected state.

#### Keyboard interaction

- By default, the tab key focuses the component.
- The enter key opens the list of options.
- Use the keyboard arrows to highlight options and press the enter key to select.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
