---
scraped_at: '2026-04-20T08:49:34+00:00'
section: components
source_url: https://cloudscape.design/components/table/index.html.md
title: Table
---

# Table

Presents data in a two-dimensional table format, arranged in columns and rows in a rectangular form.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/table) [View in demo](/examples/react/table.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/table/index.html.json)

## Development guidelines

### Providing unique keys for items

React recommends providing [key property](https://reactjs.org/docs/lists-and-keys.html) for improved re-rendering of list items. By default our component uses array indexes as keys, which work for simple use-cases, but it may [lead to issues](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318).

To improve items tracking and rendering, you need to specify keys in two dimensions:

- Rows - by using the `trackBy`   property.
- Columns - by specifying an `id`   property for each column definition

### Table features

In its basic usage, the table component allows to display a list of items in tabular form. It is possible to add extra features to enhance the customer experience: [text-filtering](/components/text-filter/index.html.md) and [pagination](/components/pagination/index.html.md).

Each of these tools can be configured in different ways. In particular, two different patterns emerge:

- Table with client-side operations: when the list of items to display is not too big, these items can be fetched in their entirety. Filtering, pagination and sorting can hence be done synchronously on the client side, using [collection hooks](/get-started/dev-guides/collection-hooks/index.html.md)   . When you are using collection hooks, make sure that the selection is also controlled by the hook. An example of client-side table can be found [here](/examples/react/table.html)  .
- Table with server-side operations: the list of items to display might be too big, so you want to perform filtering, pagination and sorting on the server-side, and load only the visible items on the client side. An example of server-side table can be found [here](/examples/react/server-side-table.html)  .

### State management

The selection and sorting state of table component are controlled. You need to explicitly set the properties and the corresponding event listeners.

- For the selection state, set the `selectedItems`   property and `onSelectionChange`   event listener.
- For the sorting state, set the `sortingColumn`   and `sortingDescending`   properties and `onSortingChange`   event listener.

The state of resizable columns is **uncontrolled** . The widths configuration is applied on the first rendering and consequent `width` property changes are ignored. However, it is recommended to persist the updated column widths to store the user preference and apply on the page reload.

Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

[Learn more](/get-started/dev-guides/state-management/index.html.md)

### Limitations

The table component measures its width conditionally in order to apply styles. This can cause an infinite update loop with noticeable component flickering in the user interface (UI) if the parent container is flexible. We recommend to render the table in a container whose width is not determined by its content. Use the [grid component](/components/grid/index.html.md) if you need to render the table before or next to another UI element.

To prevent unexpected content overflow in tables with resizable columns, ensure that cell content is plain text or uses components that support inline display, such as links or status indicators. Avoid using elements with block-level display.

### Table column widths

Table column width rendering depends on the `resizableColumns` property, as well as the `width` , `minWidth` , and `maxWidth` values of the `columnDefinitions` property.

**If resizable columns is not active (default)** , the table uses `table-layout: auto` (see this [article about table-layout](https://css-tricks.com/almanac/properties/t/table-layout/) ). In this case the rendered column width depends on displayed content and may not match `width` and `maxWidth` values. When displayed content changes, column widths automatically update. In most cases there is no need to define `width` values explicitly.
The values for `width` , `minWidth` , and `maxWidth` can be numbers (for example, 120) or strings (for example, `"50%"` or `"120px"` ).

**If resizable columns is active** , the table uses `table-layout: fixed` and the column widths will match the values defined by `width` and `minWidth` (defaults to 120px). The `maxWidth` values are ignored. The values for `width` and `minWidth` have to be numbers (for example, 120).
If the `width` values are not defined, they are calculated based on the table content of the first render. All following renders (for example, with asynchronous loading) will not affect column widths. We therefore recommend that you define meaningful default `width` values for all columns when using resizable columns and that you update them using the `onColumnWidthsChange` event when the users resizes columns manually.

If setting explicit widths is not possible for your case, either don't use `resizableColumns` or force React to re-render the table component after loading is completed (see [React documentation on resetting component state](https://beta.reactjs.org/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key) ).

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Testing guidelines

All `rowIndex` and `columnIndex` parameters for table test utilities are 1-based indices. If the table has row selection enabled, the column containing the radio button or checkbox counts as the first column.

## Unit testing examples

Selecting table
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Table from '@cloudscape-design/components/table';

describe('<Table />', () => {
  it('renders the table component', () => {
    const { container } = render(<Table />);
    const wrapper = createWrapper(container);

    expect(wrapper.findTable()).toBeTruthy();
  });

  it('selects all table components', () => {
    const { container } = render(<>
      <Table />
      <Table />
      <Table />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllTables();
    expect(components).toHaveLength(3)
  });
});
```

Select table row
```
import Link from '@cloudscape-design/components/link';
import Table, { TableProps } from '@cloudscape-design/components/table';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const items = [
  {
    name: 'Item 1',
    alt: 'First',
    description: 'This is the first item',
    type: '1A',
    size: 'Small',
  },
  {
    name: 'Item 2',
    alt: 'Second',
    description: 'This is the second item',
    type: '1B',
    size: 'Large',
  },
  {
    name: 'Item 3',
    alt: 'Third',
    description: '-',
    type: '1A',
    size: 'Large',
  },
  {
    name: 'Item 4',
    alt: 'Fourth',
    description: 'This is the fourth item',
    type: '2A',
    size: 'Small',
  },
  {
    name: 'Item 5',
    alt: '-',
    description: 'This is the fifth item with a longer description',
    type: '2A',
    size: 'Large',
  },
  {
    name: 'Item 6',
    alt: 'Sixth',
    description: 'This is the sixth item',
    type: '1A',
    size: 'Small',
  },
];
const Component = ({ selectionMock }: { selectionMock: jest.Mock }) => {
  const [selectedRows, setSelectedRows] = useState<TableProps['selectedItems']>([]);
  return (
    <Table
      selectedItems={selectedRows}
      onSelectionChange={({ detail }) => {
        selectionMock(detail.selectedItems);
        setSelectedRows(detail.selectedItems);
      }}
      columnDefinitions={[
        {
          id: 'variable',
          header: 'Variable name',
          cell: item => <Link href="#">{item.name}</Link>,
          sortingField: 'name',
          isRowHeader: true,
        },
        {
          id: 'value',
          header: 'Text value',
          cell: item => item.alt,
          sortingField: 'alt',
        },
        {
          id: 'type',
          header: 'Type',
          cell: item => item.type,
        },
        {
          id: 'description',
          header: 'Description',
          cell: item => item.description,
        },
      ]}
      items={items}
      selectionType="single"
    />
  );
};

describe('<Table />', () => {
  it('select a single row', () => {
    const mockHandleElementSelected = jest.fn();
    const { container } = render(<Component selectionMock={mockHandleElementSelected} />);
    const tableWrapper = createWrapper(container).findTable();

    // selects second row
    tableWrapper!.findRowSelectionArea(2)!.click();

    // checks if selection is triggered with the expected object.
    expect(mockHandleElementSelected).toHaveBeenCalledWith([
      { alt: 'Second', description: 'This is the second item', name: 'Item 2', size: 'Large', type: '1B' },
    ]);
  });
});
```

Select multiple table rows
```
import Link from '@cloudscape-design/components/link';
import Table, { TableProps } from '@cloudscape-design/components/table';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const items = [
  {
    name: 'Item 1',
    alt: 'First',
    description: 'This is the first item',
    type: '1A',
    size: 'Small',
  },
  {
    name: 'Item 2',
    alt: 'Second',
    description: 'This is the second item',
    type: '1B',
    size: 'Large',
  },
  {
    name: 'Item 3',
    alt: 'Third',
    description: '-',
    type: '1A',
    size: 'Large',
  },
  {
    name: 'Item 4',
    alt: 'Fourth',
    description: 'This is the fourth item',
    type: '2A',
    size: 'Small',
  },
  {
    name: 'Item 5',
    alt: '-',
    description: 'This is the fifth item with a longer description',
    type: '2A',
    size: 'Large',
  },
  {
    name: 'Item 6',
    alt: 'Sixth',
    description: 'This is the sixth item',
    type: '1A',
    size: 'Small',
  },
];
const Component = ({ selectionMock }: { selectionMock: jest.Mock }) => {
  const [selectedRows, setSelectedRows] = useState<TableProps['selectedItems']>([]);
  return (
    <Table
      selectedItems={selectedRows}
      onSelectionChange={({ detail }) => {
        selectionMock(detail.selectedItems);
        setSelectedRows(detail.selectedItems);
      }}
      columnDefinitions={[
        {
          id: 'variable',
          header: 'Variable name',
          cell: item => <Link href="#">{item.name}</Link>,
          sortingField: 'name',
          isRowHeader: true,
        },
        {
          id: 'value',
          header: 'Text value',
          cell: item => item.alt,
          sortingField: 'alt',
        },
        {
          id: 'type',
          header: 'Type',
          cell: item => item.type,
        },
        {
          id: 'description',
          header: 'Description',
          cell: item => item.description,
        },
      ]}
      items={items}
      selectionType="multi"
    />
  );
};

describe('<Table />', () => {
  it('select all rows', async () => {
    const mockHandleElementSelected = jest.fn();
    const { container } = render(<Component selectionMock={mockHandleElementSelected} />);
    const tableWrapper = createWrapper(container).findTable();

    // Select all rows using the select all trigger
    tableWrapper!.findSelectAllTrigger()!.click();

    expect(tableWrapper!.findSelectedRows().length).toEqual(6);
    expect(mockHandleElementSelected).toHaveBeenCalledWith(items);
  });
});
```

Search table rows using text filter
```
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import Table from '@cloudscape-design/components/table';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextFilter from '@cloudscape-design/components/text-filter';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const items = [
  {
    name: 'Item 1',
    alt: 'First',
    description: 'This is the first item',
    type: '1A',
    size: 'Small',
  },
  {
    name: 'Item 2',
    alt: 'Second',
    description: 'This is the second item',
    type: '1B',
    size: 'Large',
  },
  {
    name: 'Item 3',
    alt: 'Third',
    description: '-',
    type: '1A',
    size: 'Large',
  },
  {
    name: 'Item 4',
    alt: 'Fourth',
    description: 'This is the fourth item',
    type: '2A',
    size: 'Small',
  },
  {
    name: 'Item 5',
    alt: '-',
    description: 'This is the fifth item with a longer description',
    type: '2A',
    size: 'Large',
  },
  {
    name: 'Item 6',
    alt: 'Sixth',
    description: 'This is the sixth item',
    type: '1A',
    size: 'Small',
  },
];
const Component = () => {
  const [filterText, setFilterText] = useState('');

  // your filtering logic
  const filteredItems = items.filter(
    item =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.alt.toLowerCase().includes(filterText.toLowerCase())
  );
  return (
    <Table
      empty={<Box data-testid="empty-results">Empty Results</Box>}
      filter={
        <TextFilter
          data-testid="table-filter"
          filteringPlaceholder="Search"
          filteringText={filterText}
          onChange={event => setFilterText(event.detail.filteringText)}
        />
      }
      columnDefinitions={[
        {
          id: 'variable',
          header: 'Variable name',
          cell: item => <Link href="#">{item.name}</Link>,
          sortingField: 'name',
          isRowHeader: true,
        },
        {
          id: 'value',
          header: 'Text value',
          cell: item => item.alt,
          sortingField: 'alt',
        },
        {
          id: 'type',
          header: 'Type',
          cell: item => item.type,
        },
        {
          id: 'description',
          header: 'Description',
          cell: item => item.description,
        },
      ]}
      items={filteredItems}
    />
  );
};

describe('<Table />', () => {
  it('searches with filter input', () => {
    const { container } = render(<Component />);
    const tableWrapper = createWrapper(container).findTable();
    const inputWrapper = tableWrapper!.findFilterSlot()!.findTextFilter('[data-testid="table-filter"]');

    inputWrapper!.findInput().setInputValue('Item 2');

    // only one item should be filtered
    expect(tableWrapper!.findRows().length).toEqual(1);
    expect(tableWrapper!.findRows()[0].getElement().textContent).toContain('Item 2');
  });

  it('shows empty slot with no search results', () => {
    const { container } = render(<Component />);
    const tableWrapper = createWrapper(container).findTable();
    const inputWrapper = tableWrapper!.findFilterSlot()!.findTextFilter('[data-testid="table-filter"]');

    inputWrapper!.findInput().setInputValue('1234567');

    expect(tableWrapper!.findRows().length).toEqual(0);

    const emptySlot = tableWrapper?.findEmptySlot();

    expect(emptySlot?.findBox()?.getElement().textContent).toContain('Empty Results');
  });
});
```

## Unit testing APIs

TableWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAscSortedColumn | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the column that is used for ascending sorting. | - |
| findBodyCell | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns a table cell based on given row and column indices. | rowIndex:1-based index of the row of the cell to select.columnIndex:1-based index of the column of the cell to select. |
| findBodyCellCounter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns a table cell counter, if defined, based on given row and column indices. | rowIndex:1-based index of the row of the cell to select.columnIndex:1-based index of the column of the cell to select. |
| findCollectionPreferences | [CollectionPreferencesWrapper](/components/collection-preferences/index.html.md) &#124; null | - | - |
| findColumnHeaders | Array<[ElementWrapper](/index.html.md)> | - | - |
| findColumnResizer | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the element the user clicks when resizing a column. | columnIndex:1-based index of the column containing the resizer. |
| findColumnSortingArea | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | colIndex: |
| findDescSortedColumn | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the column that is used for descending sorting. | - |
| findEditCellButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the button that activates inline editing for a table cell based on given row and column indices. | rowIndex:1-based index of the row of the cell to select.columnIndex:1-based index of the column of the cell to select. |
| findEditingCell | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findEditingCellCancelButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findEditingCellSaveButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findEmptyRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Alias for findEmptySlot method for compatibility with previous versions | - |
| findEmptySlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findExpandToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the expandable row toggle button. | rowIndex:1-based index of the row. |
| findFilterSlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findFooterSlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeaderRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Alias for findHeaderSlot method for compatibility with previous versions | - |
| findHeaderSlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findItemsLoaderByItemId | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns items loader of the specific item (matched by item's track ID). | itemId:the (expandable) item ID provided with `trackBy` property. Note: when used with collection-hooks the `trackBy` is set automatically from `expandableRows.getId`. |
| findLoadingText | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findPagination | [PaginationWrapper](/components/pagination/index.html.md) &#124; null | - | - |
| findPropertyFilter | [PropertyFilterWrapper](/components/property-filter/index.html.md) &#124; null | - | - |
| findRootItemsLoader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns items loader of the root table level. | - |
| findRows | Array<[ElementWrapper](/index.html.md)> | - | - |
| findRowSelectionArea | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns a row selection area for a given index. | rowIndex:1-based index of the row selection area to return. |
| findSelectAllTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSelectedRows | Array<[ElementWrapper](/index.html.md)> | - | - |
| findTextFilter | [TextFilterWrapper](/components/text-filter/index.html.md) &#124; null | - | - |
| isRowToggled | boolean | Returns true if the row expand toggle is present and expanded. Returns false otherwise. | rowIndex:1-based index of the row. |
## Integration testing examples

Select multiple table rows
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Table', () => {
  it('selects a single row', async () => {
    // this code tests a component instance similar to this /components/table&example=default
    await browser.url('your-test-page');
    const tableWrapper = createWrapper().findTable();

    // selects first row
    await browser.$(tableWrapper.findRowSelectionArea(2).toSelector()).click();

    expect(await browser.$$(tableWrapper.findSelectedRows().toSelector()).length).toEqual(6);
  });

  it('selects all rows', async () => {
    // this code tests a component instance similar to this /components/table&example=default
    await browser.url('your-test-page');
    const tableWrapper = createWrapper().findTable();

    // clicks on the select all trigger
    await browser.$(tableWrapper.findSelectAllTrigger().toSelector()).click();

    // counting the number of selected rows
    expect(await browser.$$(tableWrapper.findSelectedRows().toSelector()).length).toEqual(6);
  });
});
```

Search table rows using text filter
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Table', () => {
  it('performs search with filter input', async () => {
    // this code tests a component instance similar to this /components/table&example=default
    await browser.url('your-test-page');
    const tableWrapper = createWrapper().findTable();
    const inputWrapper = tableWrapper!.findFilterSlot()!.findInput('[data-testid="table-filter"]');

    // type 'Item 2' into the filter input
    await browser.$(inputWrapper.toSelector()).setValue('Item 2');

    // only one item should be filtered
    const rowsCount = await browser.$$(tableWrapper.findRows().toSelector()).length;

    expect(rowsCount).toBe(1);
    expect(await browser.$(tableWrapper.findBodyCell(1, 2).toSelector()).getText()).toBe('Item 2');
  });

  it('shows empty slot with no search results', async () => {
    // this code tests a component instance similar to this /components/table&example=default
    await browser.url('your-test-page');
    const tableWrapper = createWrapper().findTable();
    const inputWrapper = tableWrapper!.findFilterSlot()!.findInput('[data-testid="table-filter"]');

    // second column because the first one is for the selection checkboxes
    await browser.$(inputWrapper.toSelector()).setValue('12345667');

    // only one item should be filtered
    const rowsCount = await browser.$$(tableWrapper.findRows().toSelector()).length;

    expect(rowsCount).toBe(0);

    const emptySlotSelector = tableWrapper.findEmptySlot().toSelector();

    expect(await browser.$(emptySlotSelector).isExisting()).toBe(true);
  });
});
```

## Integration testing APIs

TableWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAscSortedColumn | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the column that is used for ascending sorting. | - |
| findBodyCell | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns a table cell based on given row and column indices. | rowIndex:1-based index of the row of the cell to select.columnIndex:1-based index of the column of the cell to select. |
| findBodyCellCounter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns a table cell counter, if defined, based on given row and column indices. | rowIndex:1-based index of the row of the cell to select.columnIndex:1-based index of the column of the cell to select. |
| findCollectionPreferences | [CollectionPreferencesWrapper](/components/collection-preferences/index.html.md) | - | - |
| findColumnHeaders | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findColumnResizer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the element the user clicks when resizing a column. | columnIndex:1-based index of the column containing the resizer. |
| findColumnSortingArea | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | colIndex: |
| findDescSortedColumn | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the column that is used for descending sorting. | - |
| findEditCellButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the button that activates inline editing for a table cell based on given row and column indices. | rowIndex:1-based index of the row of the cell to select.columnIndex:1-based index of the column of the cell to select. |
| findEditingCell | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findEditingCellCancelButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findEditingCellSaveButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findEmptyRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Alias for findEmptySlot method for compatibility with previous versions | - |
| findEmptySlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findExpandToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the expandable row toggle button. | rowIndex:1-based index of the row. |
| findFilterSlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFooterSlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeaderRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Alias for findHeaderSlot method for compatibility with previous versions | - |
| findHeaderSlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findItemsLoaderByItemId | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns items loader of the specific item (matched by item's track ID). | itemId:the (expandable) item ID provided with `trackBy` property. Note: when used with collection-hooks the `trackBy` is set automatically from `expandableRows.getId`. |
| findLoadingText | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findPagination | [PaginationWrapper](/components/pagination/index.html.md) | - | - |
| findPropertyFilter | [PropertyFilterWrapper](/components/property-filter/index.html.md) | - | - |
| findRootItemsLoader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns items loader of the root table level. | - |
| findRows | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findRowSelectionArea | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns a row selection area for a given index. | rowIndex:1-based index of the row selection area to return. |
| findSelectAllTrigger | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSelectedRows | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findTextFilter | [TextFilterWrapper](/components/text-filter/index.html.md) | - | - |
## General guidelines

### Do

- Header
- Consider using a sticky header in your table when it has more than 30 items per page, the values in the table may be ambiguous to users without column headers, users need to take an action on items upon selection, the table has more than five columns, or the columns can be sorted.
- Always show the total number of items next to the table title.
- Use [header](/components/header/index.html.md)   component to display additional information, such as item counter, info link, action buttons, or description text.
- Use a sticky header only in [card views](/patterns/resource-management/view/card-view/index.html.md)   and [table views](/patterns/resource-management/view/table-view/index.html.md)  .
- Columns
- Use the first table column for unique identifiers of the items that are represented in the table (for example: name, id, and ARN). Also use the first table column for users to navigate to a [details page](/patterns/resource-management/details/index.html.md)   that shows more information about the item. The first column(s) can be set to sticky so users can reference the row title or item ID when scrolling horizontally.
- Use the second column for status when status is relevant, for example *Running*  .
- Ensure data symmetry. For example: The order of the columns, after the unique identifier and status columns, should match the order of the inputs in the create flow.
- Always set the column width and minimum width properties based on content length. When setting it, avoid text wrapping in more than three rows and too much white space after cell content.
- Use column resizing or allow text wrapping to guarantee visibility of content.
- When providing a default column sorting, base this on user data. For example: sorting by ascending order for item title or by item creation date.
- Preferences
- Only use filtering, pagination, and sorting if there are more than five items in the table. When these features are enabled in the table, they should persist when the amount of items in the table changes. For example, if there is no match after filtering, don't hide sorting and pagination if they are enabled.
- Store all the table preferences, including column widths, when the user leaves the page and restore them when the user comes back to the same page.
- Set the content density preference to comfortable by default.
- If you are providing table preferences by default then always give users the option to manage these via [collection preferences](/components/collection-preferences/index.html.md)   . For example: When sticking the first column in a table by default, support this with the collection preferences controls to turn this off.
- Cell
- Use hyphen (-) for any empty values.
- Left-align textual data within table cells that use letters letters (for example: links and paragraphs).
- Left-align categorical numeric data within table cells (for example: dates, zip and postal codes, and phone numbers).
- Right-align quantitative numeric data within table cells to make them easier to compare and contrast (for example: amounts, measures, and percentages). Format this data so that all are aligned and show the same number of decimal places. This consistency helps users to quickly scan lists and compare values.
- Use the [primary link](/components/link/index.html.md)   variant instead of the [secondary link](/components/link/index.html.md)   variant in table cells to help users distinguish links from other text content in adjoining cells.
- Inline-edit
- Only provide the following input types for inline cell editing: [input](/components/input/index.html.md)   , [autosuggest](/components/autosuggest/index.html.md)   , [select](/components/select/index.html.md)   , [multiselect](/components/multiselect/index.html.md)   , and [time input](/components/time-input/index.html.md)  .
- When disabling inline editing on a cell, use the `<i>disabledReason</i>`* *   property to provide the reason it is not editable. For example: *You can't edit the tag value as this is auto generated when created.*
- We recommend setting a minimum width of 176px to the supported columns for inline edit to ensure the content is always visible on small viewports.
- Selection
- Only use selection if the user can take action on the items in the collection.
- Inactive items should not be selected. A user should always be able to deselect an item.
- Always provide information on why inactive items are not selectable. For example: show the status of an item as *Pending*  .
- To prevent users from performing actions on items they may not know are selected, reset item selection across pagination, sorting, filtering, page size changes, and collapsing an expandable row.
- Always include the number of selected items in the header item counter.
- Layout
- When used within the [app layout](/components/app-layout/index.html.md)   , `full-page`   tables must be the first component in the `content`   slot.
- Expandable rows
- For tables with expandable rows, follow the patterns [table with nested resources](/patterns/resource-management/view/table-with-nested-resources/index.html.md)   , or [table with grouped resources](/patterns/resource-management/view/table-with-grouped-resources/index.html.md)  .
- Progressive loading
- For tables with multiple levels of progressive loading, uniquely identify each level with a different string. For example, *Load more regions*   and *Load more instances*  .
- Use progressive loading on child rows when necessary to avoid slow load times.

### Don't

- Header
- Don't use sticky header in tables without actions in the [header](/components/header/index.html.md)  .
- Don't use sticky header for continuous scrolling. We strongly recommend using [pagination](/components/pagination/index.html.md)   to give users easy and consistent access to all items without scroll.
- Don't place interactive elements inside table header cells.
- Columns
- Column resizing applies to all columns. It is not possible to apply it only to a custom number of columns.
- Don't provide sticky column(s) where these occupy more than 70% of the available table content area, as this can hinder the readability of the scrollable content area.
- Selection
- Don't show the number of selected items if nothing has been selected. For example, *0/150*   should never be displayed.
- Preferences
- Don't use the pagination and preferences slots if the table doesn't have filtering or header actions. Instead, add pagination and preferences to the actions slot in the [header](/components/header/index.html.md)   component.
- Don't use the content density preference feature if your application already has a global density mode switch.
- Layout
- Don't expand a table after activating a *View all*   footer link. Instead, navigate to a separate page with the full list of items.
- Progressive loading
- Don't set different load sizes on an item-by-item basis. Instead, set one for the table, or one per level.
- Don't use progressive loading when pagination will work. Pagination provides several advantages over progressive loading, such as page load time and quicker access to specific items.
- Don't use pagination and progressive loading at the same time, except in tables with expandable rows. In this case, pagination may be applied to the top-level rows, with progressive loading used for nested levels.

## Features

- #### Variant

  There are three available types of tables:  

  - **Container**    

    - This table variant has its own visual container with shadows and borders. Use this variant to feature a table in a stand-alone container with its own hierarchy.
    - For example: when using a table on a [details page](/examples/react/details.html)      .
  - **Borderless**    

    - Use this variant to place a table inside a container with other content, such as key-value pairs.
    - Use this variant to display a table without the shadows and borders surrounding a container. Use when placing a table inside another container.
    - For example: when using a table in a [dashboard item](/patterns/general/service-dashboard/dashboard-items/index.html.md)       , [expandable section](/components/expandable-section/index.html.md)       , [modal](/components/modal/index.html.md)       or within a [split panel](/patterns/resource-management/view/split-view/index.html.md)      .
  - **Full page**    

    - This variant is for implementing the full page [table view](/patterns/resource-management/view/table-view/index.html.md)       pattern. Use it for presenting and managing a table with many columns within a stand-alone page.
    - We suggest enabling the sticky header and using the "awsui-h1-sticky" `variant`       of the [header](/components/header/index.html.md)       with this variant, so the title reduces its size on scroll. Refer to the [table view demo](/examples/react/table.html)       and the [table view](/patterns/resource-management/view/table-view/index.html.md)       pattern for examples in context.
    - Use this variant in conjunction with the `contentType="table"`       property on the App Layout to maximize the available space.
- #### Header

  The header is an area to place descriptive content and actions applicable to the entire items collection. These can include a title, item counter, and action stripe.  

  - **Collection title**    

    - The collection title is a short noun phrase describing the contents of the collection.
    - Use the h1 variant of the [header](/components/header/index.html.md)       component with the full page table.
    - Use the h2 variant of the [header](/components/header/index.html.md)       component with the container table.
    - When embedding multiple tables or other content in a container in such a way that they have the same level of hierarchy, use the h2 variant of the header component for each one. If the embedded content has a parent-child relationship instead, use the h2 variant for the parent followed by smaller headings for the children. Make sure to follow the flow of the content hierarchy.
  - **Item counter **    

    - The item counter is a number next to the title that shows the total number of items in a collection, in parentheses.      

      - For example: *(150)*
    - If the total number of items is unknown, include a plus sign (+) after the known number, indicating that more items exist.
    - If the table is in loading state, don't display the item counter.
    - The number of selected items are listed before number of total items, using a forward slash (/) to separate the two values. Use the format: *(\[number of selected items\]/\[number of total items\])*      

      - For example:* (1/150)*
    - The counter slot in the header component is designed to provide counter functionality in this component.
- #### Footer

  The footer is an area to place interactive elements relating to the rows above. For example, the [details as a hub](/patterns/resource-management/details/details-page-as-hub/index.html.md)   pattern uses this area for a *View all*   link that navigates a user to a new page where they can view the complete items list.
- #### Sticky header - optional

  A sticky header keeps the collection header and features at the top of the page when a user scrolls down the page. Enabling this property lets users perform actions in context, such as using the action stripe, selecting items, sorting and resizing columns in tables, filtering, and using pagination. Use the [awsui-h1-sticky](/components/header/index.html.md)   header variant when the full page table header is set to sticky. The title size is then automatically reduced on scroll to conserve space.  

  Sticky header is not supported on mobile viewport sizes.
- #### Features - optional

  Features are additional attributes that can be added to support more complex collections, such as those with many items. Features include:  

  - **Filtering **     -** **     Filtering allows users to find a specific item or a subset of items, using one of three [filtering mechanisms](/patterns/general/filter-patterns/index.html.md)     which are: [text filtering](/components/text-filter/index.html.md)     , [collection select filter](/components/collection-select-filter/index.html.md)     , or [property filter](/components/property-filter/index.html.md)    .
  - **Pagination **     -** ** [Pagination](/components/pagination/index.html.md)     allows users to view a collection page by page. In tables with expandable rows, pagination will only apply to the parent rows.
  - **Sorting **     -** **     Sorting allows users to re-order table rows based on a specific column.
  - **Preferences **     -** ** [Collection preferences](/components/collection-preferences/index.html.md)     allow users to manage the display of the table for properties such as:    

    - content display (order and visibility of columns)
    - page size
    - line wrap
    - striped rows
    - content density
    - sticky columns
- #### Column reordering - optional

  With column reordering, users can set their preferred column order for a specific table, to suit the need for comparison and to make faster decisions. This helps to categorize and cluster data in columns-heavy tables.  

  Users are able to customize columns order in the table view via [collection preferences](/components/collection-preferences/index.html.md)  .
- #### Column resizing - optional

  With column resizing, the user can manually resize the column width by dragging the divider on the right of a column header. Users can also reveal, hide, and adjust the content to the screen area.  

  Column resizing is not supported for touch interactions.
- #### Column headers

  The title for the values shown in a given column.
- #### Column width - optional

  Columns allow to set width, min-width and max-width.  Set the width based on content length to guarantee visibility on content:  

  - Set min-width, if the content may cause table cell overflow on small total table width.
  - Set the width based on content length to guarantee visibility on content. The table might be automatically adjusted to fill available space and the actual column widths may be different.
  - Set the max-width if the expected content length is too big and it will push all the following columns out of visible area.
- #### Sticky columns - optional

  Sticky columns provide the ability to keep visible column(s) in view when a table is wider than the viewport, for example, to support data comparison across columns. It is possible to define the number of sticky columns, and to provide it by default, depending on your user needs.  

  Users are able to control what columns should stick in the table view via [collection preferences](/components/collection-preferences/index.html.md)  .  

  Sticky columns are deactivated when the available space for table content is reduced, ensuring that table content is always available.
- #### Selection types - optional

  - **None**     - default    

    - The component doesn't provide the ability for users to select any items from the collection.
  - **Multi**    

    - Allows multiple items to be selected at a time by using checkboxes for each item.
    - Includes the ability for users to select groups of items by using `shift + click`       or `shift + space`       to select items between ranges.
    - Use for collections that support bulk actions.
  - **Single**    

    - Allows a single item to be selected by using a radio button in the table row.
    - Use for collections that don't support bulk actions.
- #### In-context actions - optional

  Use for performing actions on a singular item in the respective table rows. Use the [inline buttons](/components/button/index.html.md)   and [inline button dropdowns](/components/button-dropdown/index.html.md)   when featuring actions in a table cell.  

  For more information refer to [in-context actions](/patterns/general/actions/incontext-actions/index.html.md)  .
- #### Disabled items - optional

  The selection on any item can be inactive. When an item is inactive, a user won't be able to select it.
- #### Inline edit - optional

  Inline edit allows customers to edit a cell value. When inline editing is enabled, customers can edit, save, or discard changes. Validation happens per field, make sure to follow the guidelines for [validation](/patterns/general/errors/validation/index.html.md)  .  

  Editable cells are displayed through the hover state, and paired with an icon to display the edit option. An icon indicator is displayed in the column headers of columns with editable cells.  

  You can disable inline editing on specific cells within an editable column to prevent users from editing a cell value. For example, due to user permissions.  

  Supported input types for cell editing are: [input](/components/input/index.html.md)   , [autosuggest](/components/autosuggest/index.html.md)   , [select](/components/select/index.html.md)   , [multiselect](/components/multiselect/index.html.md)   , and [time input](/components/time-input/index.html.md)   . When using components with dropdowns, make sure to enable the `expandToViewport`   property to ensure that the component is not constrained by the table's scrollable container. Also make sure to include additional logic to handle updates in sorting, pagination, and filtering as described in the [inline edit](/patterns/resource-management/edit/inline-edit/index.html.md)   pattern.  

  Refer to the demo page for [inline edit](/examples/react/table-editable.html)   to see examples in context.
- #### Content density (compact mode) - optional

  The table's content density feature allows users to reduce the space between elements in the table. This helps increase the visibility of large amounts of data, and can be useful when higher information density leads to users making decisions faster. For example, when comparing data across multiple rows. It can be utilized along with the respective [collection preference](/components/collection-preferences/index.html.md)   to provide your users with the option of toggling compact mode.
- #### Keyboard navigation - optional

  The feature makes all table cells navigable with the keyboard and ensures the entire table has a single tab stop. This allows keyboard users to efficiently navigate past the table without needing to tab through every interactive item.  

  Only use the following interactive elements in table cells: [button](/components/button/index.html.md)   , [button dropdown](/components/button-dropdown/index.html.md)   , [link](/components/link/index.html.md)   , [checkbox](/components/checkbox/index.html.md)   , [radio group](/components/radio-group/index.html.md)   . Use inline editing to provide more input types like [input](/components/input/index.html.md)   or [select](/components/select/index.html.md)  .
- #### Expandable rows - optional

  Expandable rows allows users to expand and collapse table rows to reveal one or more nested child rows. Expandable rows are toggled via a caret icon button at the start of the table row. Child rows are required to have the same columns as the parent, although some cells may be left blank or show aggregated data.  

  The table's default pagination will only apply to the parent rows. For example, if the table is set to show 10 rows per page, 10 parent rows will be shown per page regardless of the number of descendants of the parent row.  

  When expanding a parent with many child rows, consider using progressive loading. This will render a set number of rows first, along with a button to load additional rows.  

  See [table with nested resources](/patterns/resource-management/view/table-with-nested-resources/index.html.md)   and [table with grouped resources](/patterns/resource-management/view/table-with-grouped-resources/index.html.md)   to learn more about how to use the expandable rows feature.
- #### Progressive loading - optional

  Progressive loading is a feature in which table rows can be progressively loaded onto a single page. Use this feature when your user needs to see all the data in one view, to compare large data sets, and where context switching between pages creates a cognitive load and prevents easy comparison. For example, loading more child rows in a table with expandable rows.  

  The feature can be also used to make rows expand asynchronously.  

  Progressive loading supports the following states:  

  - **Pending **     - used to display the load more button when more items can be loaded.
  - **Loading **     -** **     used to display the loading indicator when loading more data asynchronously.
  - **Error **     - used to display the error message when progressive loading failed.
  - **Finished **     -** **     used to indicate there is no more data to load.
  - **Empty **     -** **     used to display the empty indicator when a table row successfully expanded but no data is available.

### States

- #### Loading

  The state of the component while the dataset is being loaded before being displayed. Follow the guidelines for [loading states](/patterns/general/loading-and-refreshing/index.html.md)   in table and cards.
- #### No match

  The state of the collection of items after a user applies a filter that doesn't return any results. Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)   zero results.
- #### Empty

  The state of the component when there are no items to display. Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)   in table and cards.

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

#### Table title

- Use nouns to describe what the table contains.  

  - For example:    

    - *Resources *
    - *Distributions*

#### Table description

- Description should be brief, concise, and written in plain language, in consideration of content density.
- Descriptions should have end punctuation, with the only exception being if a description ends with an external link icon, which should not have a period after it.
- Use the description area to provide information with time or monetary implications for the user, or to explain how to interact with or read the data within the table.

#### Item counter

- When no items are selected, only display the total number of items in the collection, in parentheses.  

  - For example: *(340)*
- If the total number of items is unknown and you only know a subset, include a plus sign (+) after the known number, in parentheses.  

  - For example: *(1000\+)*
- When at least one item is selected, use the format: *(\[number of selected items\]/\[number of total items\]) *  

  - For example:* (1/500)*

#### Column headers

- Begin column headings with nouns when possible.
- Keep text brief:  

  - Try to use only one or two words, so column width is as narrow as possible. This is to ensure readability of table data.
  - Include timezone for absolute [timestamps](/patterns/general/timestamps/index.html.md)     in column header instead of inside each table cell to reduce visual noise caused by content repetition.
- Each column heading must describe the content in the column.

#### Table cells

- Avoid inserting admonitions (such as *Note, Important*   , and *Warning*   ) in table cells.

#### Loading state

- When the table is in a loading state, make sure to add a loading text as well.
- Follow the guidelines for [loading and refreshing](/patterns/general/loading-and-refreshing/index.html.md)  .

#### Empty states

- For both the general table empty state and progressive loading row empty state, use this text: *No \[item(s)\]*  

  - For example: *No distributions*
- Follow the writing guidelines for [empty states](/patterns/general/empty-states/index.html.md)   in table and cards.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Keyboard navigation

- For tables with interactive content (for example links, or buttons), or interactive features such as inline cell editing or column sorting, provide keyboard navigation capabilities with `enableKeyboardNavigation=true`  .

#### Alternative text for sorting

- Provide alternative text for all column headers through the `ariaLabel`   property on the `columnDefinitions`   according to the alternative text guidelines.  

  - For example: *Creation date unsorted*     or *Creation date sorted ascending*

#### Alternative text for selection

- Provide alternative text for row selection controls (for single, multi, or group selection) through `allItemsSelectionLabel`   and `itemSelectionLabel`  .

#### Alternative text for inline edit

- Provide alternative text for all inline edit buttons (edit, submit, cancel) through the `ariaLabels`   properties `activateEditLabel`   , `submitEditLabel`   , and `cancelEditLabel`   . Follow the guidelines for alternative text in [button](/components/button/index.html.md)  .
- Provide alternative text for all inputs through the `ariaLabel`   and `errorIconAriaLabel`   properties within the `editConfig`   property in `columnDefinitions`  .
- Provide alternative text for the edit icon in the header of editable columns through the `editIconAriaLabel`   property within the `editConfig`   property in `columnDefinitions`  .

#### Alternative text for repeated controls

- Tables often contain controls that are repeated in every row. Make sure these controls have a unique and meaningful name. For example repeated delete buttons may have an aria-label such as *Delete \[name of thing being deleted\]*  .

#### Single-select table actions

- When using `selectionType="single"`   do not use the change of selected radio buttons to trigger an action. There must be an additional control to trigger the action. For example, do not open a details panel on radio button change, instead include a dedicated details button in the row.

#### Live regions

- *Announcing changes to pagination*   : supply text via the `renderAriaLive`   property to announce changes to visible items.  

  - For example:

```
renderAriaLive: ({ firstIndex, lastIndex, totalItemsCount }) =>
    `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
```

- *Announcing changes in tables with expandable rows*   : supply text via the `renderAriaLive`   property and use `visibleItemsCount`   argument to highlight the difference in the number of visible rows when a row gets expanded or collapsed or when progressive loading is used. Keep in mind that in tables with expandable rows the `firstIndex`   , `lastIndex`   , and `totalItemsCount`   reflect the top-level items only.  

  - For example:

```
renderAriaLive: ({ firstIndex, lastIndex, totalItemsCount, visibleItemsCount }) =>
    `Displaying regions ${firstIndex} to ${lastIndex} of ${totalItemsCount}, 
    ${visibleItemsCount} entities visible`
```

- *Announcing changes due to refresh*   : you should use the [live region component](/components/live-region/index.html.md)   to announce changes due to clicking a 'Refresh' button.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
