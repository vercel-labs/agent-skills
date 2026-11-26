---
scraped_at: '2026-04-20T08:46:44+00:00'
section: components
source_url: https://cloudscape.design/components/autosuggest/index.html.md
title: Autosuggest
---

# Autosuggest

Autosuggest enables users to choose from a list of suggestions.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/autosuggest)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/autosuggest/index.html.json)

## Development guidelines

The autosuggest component comes with two ways to provide suggestions to the user.

#### Static suggestions

If you have the full list of suggestions available
and you don't need to fetch more suggestions as the user types,
you can just set the `options` property.

By default, the component will filter the available suggestions by checking
if the user input is a substring of either the value, label, description or if it is contained in the set of tags or filteringTags of each option.

If you prefer to have a custom filtering of the list of suggestions, you can:

- set `filteringType`   to `"manual"`   ,
- listen to the `onChange`   event to update the list of suggestions.

#### Asynchronously fetched suggestions

If the list of available suggestions has to be asynchronously fetched as the user types in the input field:

- listen to the `onLoadItems`   event to determine when to set a loading state and clear the current list of suggestions:  

  - set the `statusType`     property to `"loading"`     ,
  - set the `options`     property to an empty array
  - the `loadingText`     will then be displayed in the list to inform the user that resources are being fetched.
- at the same time, trigger API calls to fetch more suggestions using event details.  
  Once the new suggestions have been fetched:  

  - update the component's `options`     property,
  - remove the loading state by setting the `statusType`     property to `"finished"`     ,
  - in case of an error, set the `statusType`     property to `"error"`     which will cause the `errorText`     to appear.
- set `filteringType`   to `"manual"`   to disable default filtering.  
  The assumption is that the list of suggestions you return are all relevant, given the user input.

You can find an example implementation for fetching suggestions by pages at the end of this page.

#### State management

The autosuggest component is controlled. Set the `value` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of our components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Testing guidelines

When using asynchronous loading, the `onLoadItems` event is not called immediately after an interaction, for example focusing or changing the filtering text. Make sure to instruct your test code to properly wait for the next assertion.

## Unit testing examples

Selecting autosuggest
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Autosuggest from '@cloudscape-design/components/autosuggest';

describe('<Autosuggest />', () => {
  it('renders the autosuggest component', () => {
    const { container } = render(<Autosuggest />);
    const wrapper = createWrapper(container);

    expect(wrapper.findAutosuggest()).toBeTruthy();
  });

  it('selects all autosuggest components', () => {
    const { container } = render(<>
      <Autosuggest />
      <Autosuggest />
      <Autosuggest />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllAutosuggests();
    expect(components).toHaveLength(3)
  });
});
```

Selecting options from autosuggest
```
import Autosuggest from '@cloudscape-design/components/autosuggest';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';
import { useState } from 'react';

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
  {
    label: 'New Option',
    value: '4',
  },
];

function Component() {
  const [value, setValue] = useState('1');

  return (
    <Autosuggest
      enteredTextLabel={value => `Use "${value}"`}
      options={options}
      value={value}
      onChange={event => setValue(event.detail.value)}
    />
  );
}

describe('<Autosuggest />', () => {
  it('selects options from the list by index', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    wrapper.focus();
    wrapper.selectSuggestion(2);

    expect(wrapper.getInputValue()).toEqual('2');
  });

  it('selects options from the list after typing', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findAutosuggest()!;

    wrapper.focus();
    wrapper.setInputValue('new');
    wrapper.selectSuggestion(1);

    expect(wrapper.getInputValue()).toEqual('4');
  });
});
```

Populate options after user input
```
import Autosuggest, { AutosuggestProps } from '@cloudscape-design/components/autosuggest';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';
import { useState } from 'react';

function Component() {
  const [value, setValue] = useState('1');
  const options: AutosuggestProps['options'] = [
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
    {
      label: 'New Option',
      value: '5',
    },
  ];

  return (
    <Autosuggest
      enteredTextLabel={value => `Use "${value}"`}
      filteringType="auto"
      options={options}
      value={value}
      onChange={event => {
        setValue(event.detail.value);
      }}
    />
  );
}

describe('<Autosuggest />', () => {
  it('filter options after user input', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findAutosuggest()!;
    wrapper.focus();
    wrapper.setInputValue('5');

    expect(wrapper.findDropdown().findOption(1)!.getElement().textContent).toEqual('New Option');
    expect(wrapper.findDropdown().findOptionByValue('5')!.getElement().textContent).toEqual('New Option');
  });
});
```

## Unit testing APIs

AutosuggestWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| blur | - | - | - |
| findClearButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDropdown | [AutosuggestDropdownWrapper](/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findEnteredTextOption | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findErrorRecoveryButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> | - | - |
| findStatusIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| focus | - | - | - |
| getInputValue | string | Gets the value of the component.Returns the current value of the input. | - |
| isDisabled | boolean | - | - |
| selectSuggestion | - | Selects a suggestion from the dropdown by simulating mouse events. | index:1-based index of the suggestion to select.options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| selectSuggestionByValue | - | Selects a suggestion from the dropdown by simulating mouse events. | value:value of suggestion to selectoptions:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| setInputValue | - | Sets the value of the component and calls the onChange handler | value:The value the input is set to. | AutosuggestDropdownWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledOptions | Array<[OptionWrapper](/index.html.md)> | Returns all the selected options. | - |
| findFooterRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHighlightedAriaLiveRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHighlightedMatches | Array<[ElementWrapper](/index.html.md)> | Returns highlighted text fragments from all of the options.Options get highlighted when they match the value of the input field. | - |
| findHighlightedOption | [OptionWrapper](/index.html.md) &#124; null | - | - |
| findOpenDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findOption | [OptionWrapper](/index.html.md) &#124; null | Returns an option from the dropdown. | optionIndex:1-based index of the option to select. |
| findOptionByValue | [OptionWrapper](/index.html.md) &#124; null | Returns an option from the autosuggest by it's value | value:The 'value' of the option. |
| findOptionInGroup | [OptionWrapper](/index.html.md) &#124; null | Returns an option from the dropdown. | groupIndex:1-based index of the group to select an option in.optionIndex:1-based index of the option to select. |
| findOptions | Array<[OptionWrapper](/index.html.md)> | - | - |
| findOptionsContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Use this element to scroll through the list of options | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTags | Array<[ElementWrapper](/index.html.md)> &#124; null | - | - |
| isDisabled | boolean | - | - |
## Integration testing examples

Selecting options from autosuggest
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Autosuggest', () => {
  it('selects options from the list by index', async () => {
    // go to a page which contains the autosuggest to test
    await browser.url('your-page-to-test');
    // always make sure to disambiguate your component to test with a data-testid attribute
    const wrapper = createWrapper().findAutosuggest('[data-testid="my-autosuggest"]')!;

    const autosuggestInput = await browser.$(wrapper.findNativeInput().toSelector());
    await autosuggestInput.click();
    await browser.$(wrapper.findDropdown().findOption(2).toSelector()).click();

    expect(browser.$(wrapper.findNativeInput().toSelector()).getText()).toBe('Option 2');
  });
});
```

## Integration testing APIs

AutosuggestWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findClearButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDropdown | [AutosuggestDropdownWrapper](/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findEnteredTextOption | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findErrorRecoveryButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findStatusIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. | AutosuggestDropdownWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDisabledOptions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[OptionWrapper](/index.html.md)> | Returns all the selected options. | - |
| findFooterRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHighlightedAriaLiveRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHighlightedMatches | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Returns highlighted text fragments from all of the options.Options get highlighted when they match the value of the input field. | - |
| findHighlightedOption | [OptionWrapper](/index.html.md) | - | - |
| findOpenDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOption | [OptionWrapper](/index.html.md) | Returns an option from the dropdown. | optionIndex:1-based index of the option to select. |
| findOptionByValue | [OptionWrapper](/index.html.md) | Returns an option from the autosuggest by it's value | value:The 'value' of the option. |
| findOptionInGroup | [OptionWrapper](/index.html.md) | Returns an option from the dropdown. | groupIndex:1-based index of the group to select an option in.optionIndex:1-based index of the option to select. |
| findOptions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[OptionWrapper](/index.html.md)> | - | - |
| findOptionsContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Use this element to scroll through the list of options | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTags | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
## General guidelines

### Do

- Use autosuggest if the user can input any value in the field to  proceed. If the user must select one option from a list in order to proceed, use [select](/components/select/index.html.md)  .
- Every input field should have a label. Use the [form field](/components/form-field/index.html.md)   for  labeling your inputs.
- Use groups if the suggestions belong to different categories. Also consider using groups if there are more than 16 suggestions.
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

### Don't

- Don't use descriptions if they're not necessary to the interaction. The extra information the user has to read and understand can sometimes impede decision making.

## Features

- #### Input

  A regular text input field in which users can input text in a single-line control. A list of suggestions is displayed when a user types a character or focuses on it when it's empty.
- #### Placeholder

  An example input that helps the user understand what should be queried. Placeholder text disappears as soon as the user starts typing, and reappears once the text is cleared. For example:* Specify an origin domain name.*
- #### Suggestions

  A suggestion is composed of a single value or optionally a value, label, label tag, description, icon, tags, and meta filter tags.  

  - When a user enters text in the input field, the component displays a list of suggestions that match the text. Make sure that the value text is self-explanatory.
  - Suggestions are displayed in the dropdown when the input gets triggered. When text is entered, the component displays a list of suggestions matching the text.
  - Order the suggestions based on the closest matching query and the relevance regarding your use case. If that's not possible, rely on alphanumeric ordering.
- #### Custom value indicator

  A line of text that is visible in the first row within the dropdown above the suggestions and the loading or error indicator. It allows users to use the exact value that they entered. For example: *Use \[value entered\]*
- #### Loading suggestions

  There are two ways of loading suggestions. You can decide either to have the full list of suggestions available on the client side (static), or to fetch the suggestions asynchronously from the server.  

  - [Static suggestions](/components/autosuggest/index.html.md)     - default    

    - Use this when the full list of suggestions takes only one API call to be fetched.
  - [Asynchronously fetched suggestions](/components/autosuggest/index.html.md)    

    - Use this when multiple API calls need to be made to fetch all the suggestions, such as when the list is very long or contains many similar entries.      
      Suggestions are displayed after the user types or scrolls.
- #### Suggestion metadata - optional

  Each suggestion can have additional filterable metadata to help the user's decision making. Only use this metadata if it's comparable across suggestions. For example: storage size, RAM, or cost.  

  - The label tag is displayed on the right side to the label.
  - Descriptions can add extra information for a user to read and understand. They can also impede decision making if they're not necessary to the interaction.
  - Icons are placed on the left side of the suggestion. View available icons in [Iconography](/foundation/visual-foundation/iconography/index.html.md)    .
  - Tags are used to display comparable metadata across suggestions.
  - Meta filter tags are additional tags displayed only when matching the user's input.

### States

- #### Disabled

  Use the disabled state when users cannot interact with input and to prevent users from modifying the value.
- #### Read-only

  Use the read-only state when the input data is not to be modified by the user but they still need to view it.
- #### Loading

  - Use the loading state when getting suggestions based on the user's entered query.
  - When some suggestions are already shown, the loading indicator is displayed at the end of the list.
- #### Empty

  - Use the empty state when there are no suggestions to display.
  - Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)    .
- #### Error

  - Use the error state when an error occurred while getting suggestions based on the user's entered query.
  - When some suggestions are already shown, the error indicator will be displayed below the list.
  - Provide a *Retry*     link button in the error state as a recovery mechanism.
- #### Finished

  The finished state communicates to the user that they have reached the end of the dataset when the list of suggestions is asynchronously fetched from the server.

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

#### Placeholder

- Follow the writing guidelines for [placeholder text](/components/input/index.html.md)  .

#### Description

- Use parallel form. All descriptions in the list should start with either verbs or nouns, and don't mix the two.
- Keep in mind that text can grow by as much as three times its length when it is translated into other languages.

#### Custom value indicator

- Use the text: *Use "\[value entered\]"*  

  - For example: *Use "prod"*

#### Loading state

- Use the format: *Loading \[suggestions type\]*
- Be consistent with the noun used for the suggestions type. Use the same as in the control header.

#### Empty state

- Follow the writing guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .

#### Error state

- For error message use the format: *Error fetching \[suggestion type\]*
- Follow the guidelines for [validation](/patterns/general/errors/validation/index.html.md)   and [alert](/components/alert/index.html.md)  .
- For recovery action use this text: *Retry*
- Follow the writing guidelines for [button](/components/button/index.html.md)  .

#### Finished state

- When the user reaches the end of filtered results, use the format: *End of "\[filter text\]" results*  

  - For example: *End of "sg-5" results*
- When the user reaches the end of all results in a non-filtered list, use this text: *End of results*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- All controls should have a label for screen readers to read on focus.
- Do not initiate any page refreshes when loading suggestions or updating the text input.
- If custom icons for options are used, make sure to provide an alternative text for screen readers to read on focus.
- For additional accessibility guidelines, follow the [select](/components/select/index.html.md)   component guidelines.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
