---
scraped_at: '2026-04-20T08:47:32+00:00'
section: components
source_url: https://cloudscape.design/components/column-layout/index.html.md
title: Column layout
---

# Column layout

Column layout helps you position content in columns.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/column-layout)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/column-layout/index.html.json)

## Development guidelines

The column layout provides a simplified access to our [Grid](/components/grid/index.html.md) component. The current solution comes with the same element query based behavior that the [Grid](/components/grid/index.html.md) component provides.

Use the column layout component to do any of the following:

- Specify the number of columns to get a column layout with evenly distributed columns.
- Embed column layouts inside other column layouts.
- Combine this solution with the [Grid](/components/grid/index.html.md)   component to create a custom layout.

**React version difference:** In React 18 and earlier, React.Fragment children are broken down into individual columns. This behavior is now deprecated in React 19 and later.

To achieve the layout that you want, the columns must be direct children of the component.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting column layout
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import ColumnLayout from '@cloudscape-design/components/column-layout';

describe('<ColumnLayout />', () => {
  it('renders the column-layout component', () => {
    const { container } = render(<ColumnLayout />);
    const wrapper = createWrapper(container);

    expect(wrapper.findColumnLayout()).toBeTruthy();
  });

  it('selects all column-layout components', () => {
    const { container } = render(<>
      <ColumnLayout />
      <ColumnLayout />
      <ColumnLayout />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllColumnLayouts();
    expect(components).toHaveLength(3)
  });
});
```

Finding a column by its index
```
import ColumnLayout from '@cloudscape-design/components/column-layout';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';

import { render } from '@testing-library/react';

function Component() {
  return (
    <ColumnLayout columns={4}>
      <TextContent>First column</TextContent>
      <TextContent>Second column</TextContent>
      <TextContent>Third column</TextContent>
      <TextContent>Fourth column</TextContent>
    </ColumnLayout>
  );
}

describe('<ColumnLayout />', () => {
  it('selects the third column by index', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const thirdColumn = wrapper.findColumnLayout()!.findColumn(3)!.getElement();

    expect(thirdColumn.textContent).toBe('Third column');
  });
});
```

## Unit testing APIs

ColumnLayoutWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findColumn | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLDivElement> &#124; null | Returns a column from the grid for a given index. | columnIndex:1-based index of the column to return. |
## Integration testing APIs

ColumnLayoutWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findColumn | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns a column from the grid for a given index. | columnIndex:1-based index of the column to return. |
## General guidelines

### Do

- Each column layout is independent, and is applied per content area.
- All the columns will stack responsively according to the container width.
- Use column layout when your content can be divided into sections that have a clear relationship.
- Content should be the drive to use column layout.

## Features

- #### Columns

  The layout of the region can have from one to four columns that behave responsively depending on the width of the container. The default layout is one column.
- #### Borders

  Borders, also called hairlines, are visual dividers to help structure the hierarchy of your content. By default, the columns don't display any border. Both vertical and horizontal borders are supported.
- #### Variant

  There are two variants of column layout:  

  - **Default**     - The default column layout allows you to add vertical or horizontal borders as well as removing the gutters around the columns.
  - **Text grid**     - The [text-grid](/components/column-layout/index.html.md)     is conceived for column layouts containing text. All spacing and borders are predefined and can't be customized.    

    - For example: [key-value pairs](/components/key-value-pairs/index.html.md)       on a resource detail page.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
