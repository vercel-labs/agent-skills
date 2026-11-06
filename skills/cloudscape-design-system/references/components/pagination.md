---
scraped_at: '2026-04-20T08:48:52+00:00'
section: components
source_url: https://cloudscape.design/components/pagination/index.html.md
title: Pagination
---

# Pagination

Provides horizontal navigation between pages of a collection.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/pagination)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/pagination/index.html.json)

## Development guidelines

This component only displays the pagination UI. If you want to perform the actual pagination of data, consider using [collection hooks](/get-started/dev-guides/collection-hooks/index.html.md).

#### State management

The pagination component is controlled. Set the `currentPageIndex` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting pagination
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Pagination from '@cloudscape-design/components/pagination';

describe('<Pagination />', () => {
  it('renders the pagination component', () => {
    const { container } = render(<Pagination />);
    const wrapper = createWrapper(container);

    expect(wrapper.findPagination()).toBeTruthy();
  });

  it('selects all pagination components', () => {
    const { container } = render(<>
      <Pagination />
      <Pagination />
      <Pagination />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllPaginations();
    expect(components).toHaveLength(3)
  });
});
```

Navigates to a page by its number
```
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Pagination from '@cloudscape-design/components/pagination';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import { useState } from 'react';

interface Item {
  header: string;
  content: string;
}

const pages: Item[] = [
  { header: 'First page', content: 'Page 1 content' },
  { header: 'Second page', content: 'Page 2 content' },
  { header: 'Third page', content: 'Page 3 content' },
  { header: 'Fourth page', content: 'Page 4 content' },
];

function Component() {
  const [pageIndex, setPageIndex] = useState(1);
  const page = pages[pageIndex - 1];

  return (
    <Box>
      <Container header={page.header}>{page.content}</Container>
      <Pagination
        pagesCount={pages.length}
        currentPageIndex={pageIndex}
        onChange={({ detail }) => {
          setPageIndex(detail.currentPageIndex);
        }}
      />
    </Box>
  );
}

describe('<Pagination />', () => {
  it('navigates to the third page by its number', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findPagination()!.findPageNumberByIndex(3)!.click();
    const pageContent = wrapper.findContainer()!.findHeader()!.getElement();

    expect(pageContent.textContent).toBe('Third page');
  });
});
```

## Unit testing APIs

PaginationWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCurrentPage | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findNextPageButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findPageNumberByIndex | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns a page number for a given index. | index:1-based index of the page number to return. |
| findPageNumbers | Array<[ElementWrapper](/index.html.md)> | - | - |
| findPreviousPageButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| isDisabled | boolean | - | - |
## Integration testing APIs

PaginationWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCurrentPage | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNextPageButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findPageNumberByIndex | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns a page number for a given index. | index:1-based index of the page number to return. |
| findPageNumbers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findPreviousPageButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use pagination to provide horizontal navigation between pages of a collection. Most common use-cases include different types of collection views: tables, cards, lists.
- Use the default pagination when you need a simple pagination pattern for a collection that will not change size.

### Don't

- Don't use pagination if the majority of your users operate on really small collection (less than five elements).
- Don't use open end pagination if you can determine the full size of the collection.

## Features

- #### Basic controls

  Pagination includes several mechanisms to move between pages:  

**Left arrow**  

  - Navigates backward one page.
  - Inactive when the first page is selected.

**Numbers**  

  - Redirect directly to a certain collection page.
  - The number of pages changes based on the filter results.

**Right arrow**  

  - Navigates forward one page.
  - Inactive when the last page is selected.

**Ellipsis**  

  - Ellipsis is included at the end of the pagination element when the total amount of items is unknown (see *Open end pagination*     ).
- #### Open end pagination

  Open end pagination is a pagination variant for cases when it's impossible to determine the full size of the data set. This can happen when, for example, the API does not return the total number of items, or it's not paginated. The open end variant always displays ellipsis before the next page icon. The next button is always active so that users can load the next page of items.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Define labels for the pagination buttons through the `labels`   property according to the alternative text guidelines.
- When using multiple `Pagination`   on a page, define `paginationLabel`   to help users with context setting.
- State where the icon takes the user to.  

  - For example: Previous page or even page numbers (such as* Page 6*     ) rather than *left*     or *right*    .

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
