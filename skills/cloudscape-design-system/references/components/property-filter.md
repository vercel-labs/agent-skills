---
scraped_at: '2026-04-20T08:49:06+00:00'
section: components
source_url: https://cloudscape.design/components/property-filter/index.html.md
title: Property filter
---

# Property filter

With the property filter, users can find specific items in a collection by using properties, property values, typing free text, and combining these with operators.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/property-filter) [View property filter demo](/examples/react/table-property-filter.html) [View server-side property filter demo](/examples/react/server-side-table-property-filter.html) [View property filter with dates demo](/examples/react/table-date-filter.html) [View saved filter sets demo](/examples/react/table-saved-filters.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/property-filter/index.html.json)

## Development guidelines

The property filter component uses `filteringOptions` array provided to it to generate a list of suggestions for the user when they are creating or editing a filtering token. The `filteringOptions` can be fetched asynchronously during those processes following the guidelines:

#### Sorting and filtering on nested properties

If you want to use filtering on items that include nested properties, such as `item.name.first` and `item.name.last` , transform the items to bring the nested properties to the top:

```
allItems = allItems.map(item => ({ ...item, firstName: item.name.first, lastName: item.name.last }));

const { items, collectionProps, propertyFilterProps } = useCollection(allItems, {
  propertyFiltering: {
    filteringProperties: [...],
    empty: <EmptyState title="No instances" />,
    noMatch: <EmptyState title="No matches" />,
  },
});

// Filtering now includes item.firstName and item.lastName
```

#### Token groups

When `enableTokenGroups=true` , the component stores tokens in `query.tokenGroups` , which supports nesting. If your code uses `query.tokens` for saved filters or server-side filtering you need to update it to use `query.tokenGroups` instead.

#### Multi-select tokens

By default, filtering tokens have a single value, represented as a string. It is also possible to make tokens accept multiple values by setting `tokenType="enum"` for the desired property and operator. In that case, the token value is represented as an array of strings and is displayed to the user as a comma-separated list of selected options. Multi-select tokens only support `=` and `!=` operators. For example:

```
<PropertyFilter 
  filteringProperties={[
    {
      key: 'state',
      operators: [
        // Set token type for equals and not equals operators as enum so that
        // the default multi-choice form and formatter are used. 
        { operator: '=',  tokenType: "enum" },
        { operator: '!=', tokenType: "enum" },
        // Keep token type for contains and not contains operators as is.
        ':',
        '!:',
      ],
    },
    // ...
  ]}
  {...otherProps}
/>
```

#### Asynchronously fetched filteringOptions

To asynchronously fetch filtering options:

- listen to the `onLoadItems`   event to determine when to set a loading state and clear the current list of filtering options:  

  - set the `filteringStatusType`     property to `"loading"`     ,
  - set the `filteringOptions`     property to an empty array
  - the `filteringLoadingText`     will then be displayed in the list to inform the user that resources are being fetched.
- at the same time, trigger API calls to fetch more filtering options using event details.  
  Once the new suggestions have been fetched:  

  - update the component's `filteringOptions`     property,
  - remove the loading state by setting the `filteringStatusType`     property to `"finished"`     ,
  - in case of an error, set the `filteringStatusType`     property to `"error"`     which will cause the `filteringErrorText`     to appear.

You can find an example implementation for fetching `filteringOptions` by pages at the end of this page.

#### Custom properties

The property filter supports custom properties to help define filtering queries for those types where plain text input is not enough, such as date or time information.

Custom properties are described with additional `form` and `format` attributes on the extended operator notation. The `token` value provided to the custom form can be a `null` , a `string` (when an option is selected), or a custom type assigned in the form or set programmatically. Treat it as an unknown and assert for the type to prevent runtime errors. Additionally, a `match` attribute can be used to define specific filtering logic, but only when the property filter is used in combination with [collection hooks](/get-started/dev-guides/collection-hooks/index.html.md).

All inputs used in the custom property form must be wrapped with [form field](/components/form-field/index.html.md) to be associated with the property label. Consider using different input components for token create and edit flow for optimal user experience.

See the [table date filter demo](/examples/react/table-date-filter.html) for a complete code example.

```
const filteringProperties = [{
  key: 'createdAt',
  propertyLabel: 'Created at',
  groupValuesLabel: 'Created at value',
  operators: ['=', '!=', '<', '<=', '>', '>='].map(operator => ({
      operator,
      form: DateForm,
      format: (tokenValue) => tokenValue,
      match: 'date',
  })),
}];

function DateForm({ filter, value, onChange }) {
  // Using date picker for token edit flow.
  if (typeof filter === 'undefined') {
    return (
      <FormField>
        <DatePicker
          value={value ?? ''}
          onChange={event => onChange(event.detail.value)}
          placeholder="YYYY/MM/DD"
          locale="en-GB"
        />
      </FormField>
    );
  }
  // Using a combination of date input and calendar for token create flow
  // to optimise dropdown space and minimise user clicks.
  return (
    <div className="date-form">
      <FormField>
        <DateInput
          value={value || ''}
          onChange={event => onChange(event.detail.value)}
          placeholder="YYYY/MM/DD"
        />
      </FormField>
      <Calendar
        value={value || ''}
        onChange={event => onChange(event.detail.value)}
        locale="en-GB"
        todayAriaLabel="Today"
        nextMonthAriaLabel="Next month"
        previousMonthAriaLabel="Previous month"
      />
    </div>
  );
}
```

#### State management

The property filter component is controlled. Set the `query` property and the `onChange` listener to store its value in the state of your application. Refer to [state management guidelines](/get-started/dev-guides/state-management/index.html.md) for components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Testing guidelines

When using asynchronous loading, the `onLoadItems` event is not called immediately after an interaction, for example focusing or changing the filtering text. Make sure to instruct your test code to properly wait for the next assertion.

## Unit testing examples

Selecting property filter
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import PropertyFilter from '@cloudscape-design/components/property-filter';

describe('<PropertyFilter />', () => {
  it('renders the property-filter component', () => {
    const { container } = render(<PropertyFilter />);
    const wrapper = createWrapper(container);

    expect(wrapper.findPropertyFilter()).toBeTruthy();
  });

  it('selects all property-filter components', () => {
    const { container } = render(<>
      <PropertyFilter />
      <PropertyFilter />
      <PropertyFilter />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllPropertyFilters();
    expect(components).toHaveLength(3)
  });
});
```

Filtering properties
```
import PropertyFilter, { PropertyFilterProps } from '@cloudscape-design/components/property-filter';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const filteringProperties: PropertyFilterProps['filteringProperties'] = [
  {
    key: 'instanceid',
    operators: ['=', '!=', ':', '!:', '^', '!^'],
    propertyLabel: 'Instance ID',
    groupValuesLabel: 'Instance ID values',
  },
  {
    key: 'state',
    operators: ['=', '!=', ':', '!:', '^', '!^'],
    propertyLabel: 'State',
    groupValuesLabel: 'State values',
  },
  {
    key: 'instancetype',
    operators: ['=', '!=', ':', '!:', '^', '!^'],
    propertyLabel: 'Instance type',
    groupValuesLabel: 'Instance type values',
  },
];

function Component() {
  const [query, setQuery] = useState<PropertyFilterProps['query']>({
    tokens: [],
    operation: 'and',
  });

  return (
    <PropertyFilter
      filteringProperties={filteringProperties}
      onChange={event => setQuery(event.detail)}
      query={query}
    />
  );
}

describe('<PropertyFilter />', () => {
  it('filters the filtering properties when input is typed', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findPropertyFilter()!.setInputValue('instance');

    const options = wrapper.findPropertyFilter()!.findDropdown().findOptions();
    const optionValues = options.map(option => option.getElement().textContent);

    expect(optionValues).toEqual(['Instance ID', 'Instance type']);
  });
});
```

Filtering property options
```
import PropertyFilter from '@cloudscape-design/components/property-filter';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { ComponentProps, useState } from 'react';

type Query = ComponentProps<typeof PropertyFilter>['query'];
type FilteringProperties = ComponentProps<typeof PropertyFilter>['filteringProperties'];
type FilteringOptions = ComponentProps<typeof PropertyFilter>['filteringOptions'];

const filteringProperties: FilteringProperties = [
  {
    key: 'instanceid',
    operators: ['=', '!=', ':', '!:', '^', '!^'],
    propertyLabel: 'Instance ID',
    groupValuesLabel: 'Instance ID values',
  },
];

const filteringOptions: FilteringOptions = [
  {
    propertyKey: 'instanceid',
    value: '1133',
  },
  {
    propertyKey: 'instanceid',
    value: '1123',
  },
  {
    propertyKey: 'instanceid',
    value: '0223',
  },
];

function Component() {
  const [query, setQuery] = useState<Query>({
    tokens: [],
    operation: 'and',
  });

  return (
    <PropertyFilter
      filteringProperties={filteringProperties}
      filteringOptions={filteringOptions}
      onChange={event => setQuery(event.detail)}
      query={query}
    />
  );
}

describe('<PropertyFilter />', () => {
  it('filters the options of a property when input is typed', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findPropertyFilter()!.setInputValue('Instance ID=11');

    const options = wrapper.findPropertyFilter()!.findDropdown().findOptions();
    const optionValues = options.map(option => option.getElement().textContent);

    expect(optionValues).toEqual(['Instance ID = 1133', 'Instance ID = 1123']);
  });
});
```

Selecting token from dropdown
```
import PropertyFilter, { PropertyFilterProps } from '@cloudscape-design/components/property-filter';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const filteringProperties: PropertyFilterProps['filteringProperties'] = [
  {
    key: 'instanceid',
    operators: ['=', '!=', ':', '!:', '^', '!^'],
    propertyLabel: 'Instance ID',
    groupValuesLabel: 'Instance ID values',
  },
  {
    key: 'state',
    operators: [
      { operator: '=', tokenType: 'enum' },
      { operator: '!=', tokenType: 'enum' },
    ],
    propertyLabel: 'State',
    groupValuesLabel: 'State values',
  },
];

const filteringOptions: PropertyFilterProps['filteringOptions'] = [
  {
    propertyKey: 'instanceid',
    value: '1133',
  },
  {
    propertyKey: 'instanceid',
    value: '1123',
  },
  {
    propertyKey: 'instanceid',
    value: '0223',
  },
  {
    propertyKey: 'state',
    value: 'Stopped',
  },
  {
    propertyKey: 'state',
    value: 'Stopping',
  },
  {
    propertyKey: 'state',
    value: 'Running',
  },
];

function Component() {
  const [query, setQuery] = useState<PropertyFilterProps['query']>({
    tokens: [],
    operation: 'and',
  });

  return (
    <PropertyFilter
      filteringProperties={filteringProperties}
      filteringOptions={filteringOptions}
      onChange={event => setQuery(event.detail)}
      query={query}
    />
  );
}

describe('<PropertyFilter />', () => {
  it('adds token when option is found and enter is pressed', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);
    const enterKeyCode = 13;

    wrapper.findPropertyFilter()!.setInputValue('Instance ID=1133');
    wrapper.findPropertyFilter()!.findNativeInput().keydown(enterKeyCode);

    const tokens = wrapper.findPropertyFilter()!.findTokens();
    const tokenValues = tokens.map(token => token.getElement().textContent);

    expect(tokenValues).toEqual(['Instance ID = 1133']);
  });

  it('adds enum token with two options', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findPropertyFilter()!.focus();
    wrapper.findPropertyFilter()!.setInputValue('State =');
    wrapper.findPropertyFilter()!.selectSuggestionByValue('Stopped');
    wrapper.findPropertyFilter()!.selectSuggestionByValue('Stopping');
    wrapper.findPropertyFilter()!.findPropertySubmitButton()!.click();

    const tokens = wrapper.findPropertyFilter()!.findTokens();
    const tokenValues = tokens.map(token => token.getElement().textContent);

    expect(tokenValues).toEqual(['State = Stopped, Stopping']);
  });
});
```

Removing a selected token
```
import PropertyFilter, { PropertyFilterProps } from '@cloudscape-design/components/property-filter';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const filteringProperties: PropertyFilterProps['filteringProperties'] = [
  {
    key: 'instanceid',
    operators: ['=', '!=', ':', '!:', '^', '!^'],
    propertyLabel: 'Instance ID',
    groupValuesLabel: 'Instance ID values',
  },
];

function Component() {
  const [query, setQuery] = useState<PropertyFilterProps['query']>({
    tokens: [
      {
        operator: '=',
        value: 'Instance ID = 1133',
        propertyKey: 'instanceid',
      },
    ],
    operation: 'and',
  });

  return (
    <PropertyFilter
      filteringProperties={filteringProperties}
      filteringOptions={[]}
      onChange={event => setQuery(event.detail)}
      query={query}
    />
  );
}

describe('<PropertyFilter />', () => {
  it('removes token when clicked', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findPropertyFilter()!.findTokens()[0].findRemoveButton().click();

    expect(wrapper.findPropertyFilter()!.findTokens()).toHaveLength(0);
  });
});
```

## Unit testing APIs

PropertyFilterWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| blur | - | - | - |
| findClearButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findConstraint | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the element containing the filteringConstraintText slot. | - |
| findCustomControl | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the element containing the customControl slot. | - |
| findCustomFilterActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the element containing the customFilterActions slot. | - |
| findDropdown | [AutosuggestDropdownWrapper](/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findEnteredTextOption | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findErrorRecoveryButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> | - | - |
| findPropertyCancelButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | Returns custom property form cancel button. | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findPropertySubmitButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | Returns custom property form submit button. | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findRemoveAllButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the button that removes all current tokens. | - |
| findResultsCount | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findStatusIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findTokens | Array<[FilteringTokenWrapper](/index.html.md)> | - | - |
| findTokenToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the button that toggles if the tokens above tokenLimit are visible. | - |
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
| findOptionsContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Use this element to scroll through the list of options | - | FilteringTokenWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findEditButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> | - | - |
| findEditorDropdown | [PropertyFilterEditorDropdownWrapper](/index.html.md) &#124; null | Returns dropdown content of editing token if opened or null otherwise. | options: |
| findGroupTokens | Array<[FilteringGroupedTokenWrapper](/index.html.md)> | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findRemoveButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> | - | - |
| findTokenOperation | [SelectWrapper](/components/select/index.html.md) &#124; null | - | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTags | Array<[ElementWrapper](/index.html.md)> &#124; null | - | - |
| isDisabled | boolean | - | - | PropertyFilterEditorDropdownWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCancelButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findForm | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findOperatorField | [FormFieldWrapper](/components/form-field/index.html.md) | - | index: |
| findPropertyField | [FormFieldWrapper](/components/form-field/index.html.md) | - | index: |
| findSubmitButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findTokenAddActions | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) &#124; null | - | - |
| findTokenRemoveActions | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) &#124; null | - | index: |
| findValueField | [FormFieldWrapper](/components/form-field/index.html.md) | - | index: | FilteringGroupedTokenWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findRemoveButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> | - | - |
| findTokenOperation | [SelectWrapper](/components/select/index.html.md) &#124; null | - | - |
## Integration testing examples

Filtering properties
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('PropertyFilter', () => {
  it('filters the filtering properties when input is typed', async () => {
    // this code tests a component instance similar to this /components/property-filter&example=default
    await browser.url('your-test-page');
    const wrapper = createWrapper();

    const inputSelector = wrapper.findPropertyFilter().findNativeInput().toSelector();
    await browser.$(inputSelector).setValue('instance');

    const optionsSelector = wrapper.findPropertyFilter().findDropdown().findOptions().toSelector();
    const options = await browser.$$(optionsSelector).map(token => token.getText());

    expect(options).toEqual(['Instance ID', 'Instance type']);
  });
});
```

Filtering property options
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('PropertyFilter', () => {
  it('filters the options of a property when input is typed', async () => {
    // this code tests a component instance similar to this /components/property-filter&example=default
    await browser.url('your-test-page');

    const wrapper = createWrapper();

    const inputSelector = wrapper.findPropertyFilter().findNativeInput().toSelector();
    (await browser.$(inputSelector)).setValue('Instance ID = 2');

    const optionsSelector = wrapper.findPropertyFilter().findDropdown().findOptions().toSelector();
    const options = await browser.$$(optionsSelector).map(option => option.getText());

    expect(options).toEqual(['Instance ID = i-2dc5ce28a0328391', 'Instance ID = i-d0312e022392efa0']);
  });
});
```

Selecting token from dropdown
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('PropertyFilter', () => {
  it('adds token when option is found and enter is pressed', async () => {
    // this code tests a component instance similar to this /components/property-filter&example=default
    await browser.url('your-test-page');

    const wrapper = createWrapper();
    const enterKeyCode = 13;

    const inputSelector = wrapper.findPropertyFilter().findNativeInput().toSelector();
    (await browser.$(inputSelector)).setValue('Instance ID = i-2d');
    await browser.pressKeyCode(enterKeyCode);

    const tokenSelectors = wrapper.findPropertyFilter().findTokens().toSelector();
    const tokenValues = await browser.$$(tokenSelectors).map(token => token.getText());

    expect(tokenValues).toEqual(['Instance ID = i-2dc5ce28a0328391']);
  });
});
```

Removing a selected token
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('PropertyFilter', () => {
  it('removes token when clicked', async () => {
    // this code tests a component instance similar to this /components/property-filter&example=default
    await browser.url('your-test-page');
    const wrapper = createWrapper();

    const tokenSelector = wrapper.findPropertyFilter().findTokens().get(1).findRemoveButton().toSelector();
    await browser.$(tokenSelector).click();

    const tokensSelector = wrapper.findPropertyFilter().findTokens().toSelector();
    const tokens = await browser.$$(tokensSelector);

    expect(tokens).toHaveLength(0);
  });
});
```

## Integration testing APIs

PropertyFilterWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findClearButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findConstraint | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the element containing the filteringConstraintText slot. | - |
| findCustomControl | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the element containing the customControl slot. | - |
| findCustomFilterActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the element containing the customFilterActions slot. | - |
| findDropdown | [AutosuggestDropdownWrapper](/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findEnteredTextOption | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findErrorRecoveryButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findPropertyCancelButton | [ButtonWrapper](/components/button/index.html.md) | Returns custom property form cancel button. | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findPropertySubmitButton | [ButtonWrapper](/components/button/index.html.md) | Returns custom property form submit button. | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findRemoveAllButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the button that removes all current tokens. | - |
| findResultsCount | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findStatusIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | options:* expandToViewport (boolean) - Use this when the component under test is rendered with an `expandToViewport` flag. |
| findTokens | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FilteringTokenWrapper](/index.html.md)> | - | - |
| findTokenToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the button that toggles if the tokens above tokenLimit are visible. | - | AutosuggestDropdownWrapper 

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
| findOptionsContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Use this element to scroll through the list of options | - | FilteringTokenWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findEditButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findEditorDropdown | [PropertyFilterEditorDropdownWrapper](/index.html.md) &#124; null | Returns dropdown content of editing token if opened or null otherwise. | options: |
| findGroupTokens | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FilteringGroupedTokenWrapper](/index.html.md)> | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findRemoveButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTokenOperation | [SelectWrapper](/components/select/index.html.md) | - | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTags | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - | PropertyFilterEditorDropdownWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCancelButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findForm | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOperatorField | [FormFieldWrapper](/components/form-field/index.html.md) | - | index: |
| findPropertyField | [FormFieldWrapper](/components/form-field/index.html.md) | - | index: |
| findSubmitButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findTokenAddActions | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) &#124; null | - | - |
| findTokenRemoveActions | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) &#124; null | - | index: |
| findValueField | [FormFieldWrapper](/components/form-field/index.html.md) | - | index: | FilteringGroupedTokenWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findRemoveButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTokenOperation | [SelectWrapper](/components/select/index.html.md) | - | - |
## General guidelines

### Do

- Always use the filter functionality on the full collection of items, not just on visible or loaded items.
- Use a property filter if users need to select multiple values for one property.
- Use a property filter pattern if users need more than two properties to find a specific item. If only two are required, use the [collection select filter](/components/collection-select-filter/index.html.md)   instead.
- After a user completes a filter action, display the number of results next to the search filter input.
- When implementing a custom property form, consider using embeddable components for create flow, and dropdown-based components for token edit flow. For example, to support date properties we recommend using date input and calendar for create flow, and date picker for token edit flow.
- Use date-only forms for properties requiring day precision, and date-time forms for those requiring time precision. It is recommended to keep all the days active in the calendar. Exclude `=`   and `!=`   operators for date-time properties.
- If the property form requires more than one input field, annotate all fields with secondary labels (you can use form field description for this purpose). If the property requires only one input, the label can be omitted.
- When possible, enable token groups by default to allow users to filter with more complex queries.
- Use multi-select tokens for properties with discrete values or finite sets of numeric values. For example, *State = Active, Pending, Canceled*   or *Available storage = 512 GB, 1024 GB, 2048 GB.*

### Don't

- Don't use filtering if the majority of your users operate on small collections of items (fewer than five items).
- Don't use a property filter for collections with mostly user-generated lengthy strings. For example: Don't use a property filter for collections of free-form user submitted feedback.
- Don't put more than one element in the custom control slot (an area before the search input).
- Don't add an input label when implementing a single input in the form (such as a date input). This is to avoid duplicating labels. The form label (value label) is sufficient to describe the input content.
- Don't hide operations when token groups are enabled.

## Features

### Filtering

The property filter provides a variety of ways for users to filter the results in a collection.

- #### Properties

  A list of properties of the data set is displayed when the user triggers the search input field. Usually, properties refer to the column headers for a [table view](/patterns/resource-management/view/table-view/index.html.md)   , and content labels for a [cards view](/patterns/resource-management/view/card-view/index.html.md)  .
- #### Values

  The corresponding list of finite values is displayed when the user chooses one of the properties and an operator. Usually, values refer to the content of table cells in the [table view](/patterns/resource-management/view/table-view/index.html.md)   , and card contents in the [cards view](/patterns/resource-management/view/card-view/index.html.md)  .
- #### Comparison operators

  Determines the type of match between a provided property and value.  

  There are several types of operators provided by the property filter:  

  - **Equals (=): **     Returns a collection set where the property and values are exact matches. This operator can be negated (!=), which will exclude all results that equal the provided value.    

    - For example:* *       Instance type = t2.micro* *       will return only collection results which have the instance type "t2.micro".
  - **Contains (:): **     Defines a filter query where the results include the text provided (often called a *substring match*     ). This operator can be negated (!:), which will exclude all results that include the provided value.    

    - For example: Instance type : t2 will return collection results which include "t2", including "t2.micro", "t2.large", and so on.
  - **Greater than and lesser than (> and <): **     Returns a collection set where the collection results are higher or lower than the provided value. These operators can be joined with an equals operator, which returns a collection that has an exact match of the value and values above/below it.    

    - For example:* *       Launch date > 2020-01-01* *       returns a collection set where the launch date is more recent than the first day of 2020.
  - **Starts with (^):**     Defines a query where the results start with the text provided.    

    - For example: Path ^ s3://bucket01/ will return all collection items where the path starts with "s3://bucket01/".

  Filtering properties require different operators depending on their type. For example, a numeric property might require operators [<,<=, >, >=, =, !=] and textual property operators [:, !:, =, !=,^]. Operators are always shown in the following order: [=, !=, :, !:, >=, <=, <, >, ^]. Don't use equals (=) and does not equal (!=) operators for date-time properties because an exact match for this type of query is rarely possible.
- #### Free text

  When the user submits free text, the collection view gets reduced to items that contain the provided text. If the user does not provide an operator with their free text, it will default to the *contains*   operator.  

  - For example: The user types "Default", which returns collection items that contain the text provided in either the property, such as " **Default logging : **     Enabled", and in the value, such as " **State : **     Default"

  When the user selects a property and submits free text for the value, the collection view gets reduced to items that use the selected property which had text containing the provided text.  

  - For example:* *     The user selects a "Region" property from the list, the contains operator (":"), and types "us-east". All the items matching " **Region : **     us-east" (such as "us-east-1a" and "us-east-2") will remain on the collection view.

  The property filter generally allows you to specify a property name, operator, and value as plain text. However, this might not work for complex custom properties. For example, specifying the date range value as plain text has no effect. Instead, the user is expected to use the dedicated input fields.  

  - For example: Instead of typing "createdAt in 2020-01-01T00:00:00+2:00 - 2021-01-01T00:00:00+2:00", the user can use the calendar to select edge dates.

  By default all operators support free text values. When needed, you can use the `freeTextFiltering`   property to specify a subset of operators to support it.
- #### Custom properties

  The property filter allows users to query with custom properties, such as date or time, using calendar, date input and time input components.
- #### Custom groups

  A group of additional options can be added below the Properties and Values in the dropdown.  

  - For example: Filtering by tags. Typically, the property is the tag key and the value is the tag value. These additional properties and values are grouped under a *Tags*     group.
- #### Custom value indicator

  A line of text that is visible in the first row within the dropdown above the suggestions and the loading or error indicator. It allows users to use the exact value that they entered. For example: *Use \[value entered\]*
- #### Loading suggestions

  There are two ways of loading property and value suggestions. Your team needs to decide either to have the full list of suggestions available on the client side (static), or to fetch the suggestions asynchronously from the server.  

  - Static suggestions - default    

    - Use this when the full list of suggestions only takes one API call to be fetched.
  - Asynchronously fetched suggestions    

    - Use this when multiple API calls need to be made to fetch all the suggestions, such as when the list is very long or contains many similar entries. Suggestions are displayed after the user types or scrolls.
- #### Highlight

  As the user types, the characters matching the query are highlighted in properties, operators, and values.
- #### Search input states

  The property filter uses the [autosuggest](/components/autosuggest/index.html.md)   for the search input. Refer to the [autosuggest usage guidance](/components/autosuggest/index.html.md)   for more information on property filter input states, such as error, loading, async loading.

### Tokens

Property filter uses [tokens](/components/token/index.html.md) to represent each filter facet that is filtering the collection.

- #### Filtering tokens

  The user can apply a set of filters. Once a user applies a filter, a filtering token appears below the search input and the collection shows the results of the filter. The user can apply the following set of filters using the property filter:  

  - User selects a property, an operator, and selects value from the list. The token renders, for example:* * *Engine = * *Aurora*     , *or * *State = * *Stopping, Stopped.*
  - User selects a property, an operator, and types free text as a value. The token renders, for example:* * *Region : * *us-east*    .
  - User types free text. The token renders, for example:* Default*    .

  Filtering tokens can be individually edited and removed, and all tokens can be removed using the **Clear filters**   button.  

  Tokens default to containing a single value per property, but can also be multi-select. **Multi-select tokens**   allow users to select multiple values when filtering by that property. See [development guidelines](/components/property-filter/index.html.md)   for how to implement this feature.
- #### Token join operation

  When a user has multiple search filtering tokens, they are joined by an operation that defines how the overall search works. There are two join operations:  

  - **And **     -** **     Returns a collection set which matches *all*     of the search token.
  - **Or **     -** **     Returns a collection set which matches *any*     of the search tokens.

  Whenever possible, operations should be selectable by the user. If this is not feasible, for example due to API limitations, operations can be displayed in read-only mode to clarify the logic that will be applied.
- #### Token editing

  Once a token has been added, it can be edited by clicking on the token text. This opens a [popover](/components/popover/index.html.md)   , where the property, operator, and value can be changed.
- #### Token visibility and placement

  By default, all tokens are visible and shown below the trigger.  Token visibility and placement can be customized in three ways:  

  - **Inline tokens **     - Tokens are placed inside the trigger instead of below it. Token metadata is hidden, and some tokens may be cut off. Use in high density interfaces.
  - **Hide all tokens **     -** **     No tokens are shown.** **     Use in high density interfaces, when tokens are shown elsewhere on the page or when they are not critical for task completion.
  - **Hide some tokens **     -** **     Tokens up to a set number are shown. A show/hide link toggles visibility of the rest of the tokens. Use when most users will have a small number of tokens, but some users will have many tokens. If you know how many tokens are typically shown, hide tokens above that number.    

    - For example: If 90% of users only select 2 tokens, then hide all tokens above 2.
- #### Token groups

  For more complex queries that require combining both AND and OR operators, the property filter has token groups. Token groups allow users to group together two or more tokens, so that it's possible to filter by more complex queries. For example, `Status = Critical OR (Status = High AND Created at < 07-07-2023)`  .  

  Token groups can be created by making updates to an existing token, first selecting the token text, then selecting *Add new filter*   . This creates a filter group with the edited token, so that you can add new filters directly to that group.. To add an existing filter to a group, select an existing filter in the *Add new filter*   button dropdown. You can also delete filters entirely, or remove filters from a group in the overflow menu of each filter within the edit popover. See this behavior in action in the [property filter demo](/examples/react/table-property-filter.html)  .

### Additional features

- #### Custom control - optional

  The property filter provides an area before the search input, where a custom control element can be added.  

  - For example, showing a [select](/components/select/index.html.md)     for quick access to saved filter sets in the [saved filter sets](/patterns/general/filter-patterns/saved-filter-sets/index.html.md)     pattern.
- #### Custom filter actions - optional

  The property filter allows to provide a custom filter actions control that replaces the standard *Clear filters*   button. Make sure to still provide a mechanism to clear all filters when using this.  

  - For example, showing a [button dropdown](/components/button-dropdown/index.html.md)     with main action to display additional filter actions for the [saved filter sets](/patterns/general/filter-patterns/saved-filter-sets/index.html.md)     pattern.
- #### Constraint text - optional

  Constraint text explains the requirements and constraints of the property filter control. Constraint text is optional, and should only be used if it adds additional value. For example, when the number of properties allowed by the search API is limited.

### Collection view states

- #### Displaying results

  The collection of items is filtered as soon as the user enters a property filter. Only items that match the conditions of the filters are displayed.
- #### Loading state

  The state of the collection of items, either [table](/components/table/index.html.md)   or [cards](/components/cards/index.html.md)   , while the filtered dataset is being loaded. Follow the guidelines for [loading state](/patterns/general/loading-and-refreshing/index.html.md)   for collections.
- #### Zero results state

  The state of the collection of items, either [table](/components/table/index.html.md)   or [cards](/components/cards/index.html.md)   , after a user applies a filter that does not return any items in the collection. Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .

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

#### Placeholder text

- The content in the placeholder text should be supplementary. The placeholder text should not be used to communicate important filter parameters.
- Don't use terminal punctuation.

#### Visible label

- If there are specific parameters a user can filter by that need to be communicated to ensure they can proceed with their task, mention them in an adjoining visible label.
- Since visible labels tend to impact content density, use them only when necessary.

#### Filtering token

- The name of the property will always come first before the value name. The property and value are separated with a colon (:).
- The free text typed will always be rendered in between quotes ("").

#### Constraint text

- Keep constraint text brief. Two lines is the limit.
- Use regular text, not italics or boldface.
- Number of properties constraints:  

  - If there are constraints on the number of properties that users can add, describe them under the search input field. Use the format: *You can add up to \[number\] filters.*
  - For example:    

    - *You can add up to 3 filters.*

#### Results counter

- Follow the writing guidelines for [text filter](/components/text-filter/index.html.md)  .

#### Loading state

- Follow the writing guidelines for [loading state](/patterns/general/loading-and-refreshing/index.html.md)  .

#### No match state

- Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Specify a label for the text filter input through `filteringAriaLabel`  .  

  - For example: *Filter options.*

#### Keyboard interaction

- By default, the tab key focuses the component.
- After typing, the enter key submits the free text only if free text filtering is enabled.
- Use the keyboard arrows to highlight options and press the enter key to select.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
