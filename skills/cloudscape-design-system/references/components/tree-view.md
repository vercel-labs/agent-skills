---
scraped_at: '2026-04-20T08:50:01+00:00'
section: components
source_url: https://cloudscape.design/components/tree-view/index.html.md
title: Tree view
---

# Tree view

A hierarchical list of nested items.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/tree-view)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/tree-view/index.html.json)

## Development guidelines

#### State management

By default, the tree view items expand and collapse automatically when expand toggle is clicked.

If you want to control this behavior, you need to explicitly set the `expandedItems` property and provide an `onItemToggle` listener.

Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting tree view
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import TreeView from '@cloudscape-design/components/tree-view';

describe('<TreeView />', () => {
  it('renders the tree-view component', () => {
    const { container } = render(<TreeView />);
    const wrapper = createWrapper(container);

    expect(wrapper.findTreeView()).toBeTruthy();
  });

  it('selects all tree-view components', () => {
    const { container } = render(<>
      <TreeView />
      <TreeView />
      <TreeView />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllTreeViews();
    expect(components).toHaveLength(3)
  });
});
```

Expanding an item
```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TreeView from '@cloudscape-design/components/tree-view';

import { render } from '@testing-library/react';
import { act } from 'react';

type Item = {
  id: string;
  content: string;
  children?: Item[];
};

function Component() {
  return (
    <TreeView<Item>
      items={[
        {
          id: '1',
          content: 'Item 1',
          children: [
            {
              id: '1.1',
              content: 'Item 1.1',
            },
          ],
        },
        {
          id: '2',
          content: 'Item 2',
        },
      ]}
      renderItem={item => ({
        content: item.content,
      })}
      getItemChildren={item => item.children}
      getItemId={item => item.id}
      ariaLabel="Simple tree view"
    />
  );
}

describe('<TreeView />', () => {
  it('expands an item', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findTreeView()!;

    const expandableItem = wrapper.findItemById('1')!;

    act(() => {
      expandableItem.findItemToggle()!.getElement().click();
    });

    expect(expandableItem.findChildItems()).toHaveLength(1);
  });
});
```

Selecting items
```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TreeView from '@cloudscape-design/components/tree-view';

import { render } from '@testing-library/react';
import { act } from 'react';

function Component() {
  return (
    <TreeView
      items={[
        {
          id: '1',
          content: 'Item 1',
          children: [
            {
              id: '1.1',
              content: 'Item 1.1',
            },
          ],
        },
        {
          id: '2',
          content: 'Item 2',
          children: [
            {
              id: '2.1',
              content: 'Item 2.1',
            },
          ],
        },
        {
          id: '3',
          content: 'Item 3',
        },
      ]}
      renderItem={item => ({
        content: item.content,
      })}
      getItemChildren={item => item.children}
      getItemId={item => item.id}
      ariaLabel="Simple tree view"
    />
  );
}

describe('<TreeView />', () => {
  it('selects all visible items', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findTreeView()!;

    expect(wrapper.findItems()).toHaveLength(3);
  });

  it('selects all visible collapsed items', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findTreeView()!;

    expect(wrapper.findItems({ expanded: false })).toHaveLength(2);
  });

  it('selects all visible expanded items', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findTreeView()!;

    act(() => {
      wrapper.findItemById('1')!.findItemToggle()!.getElement().click(); // expand item
    });

    expect(wrapper.findItems({ expanded: true })).toHaveLength(1);
  });
});
```

Selecting content of a child item
```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TreeView from '@cloudscape-design/components/tree-view';

import { render } from '@testing-library/react';
import { act } from 'react';

type Item = {
  id: string;
  content: string;
  children?: Item[];
};

function Component() {
  return (
    <TreeView<Item>
      items={[
        {
          id: '1',
          content: 'Item 1',
          children: [
            {
              id: '1.1',
              content: 'Item 1.1',
            },
          ],
        },
        {
          id: '2',
          content: 'Item 2',
        },
      ]}
      renderItem={item => ({
        content: item.content,
      })}
      getItemChildren={item => item.children}
      getItemId={item => item.id}
      ariaLabel="Simple tree view"
    />
  );
}

describe('<TreeView />', () => {
  it('selects content of a child item', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findTreeView()!;

    const expandableItem = wrapper.findItemById('1')!;

    act(() => {
      expandableItem.findItemToggle()!.getElement().click(); // expand item
    });

    const childItem = expandableItem.findChildItemById('1.1')!;

    expect(childItem.findContent()!.getElement()).toHaveTextContent('Item 1');
  });
});
```

## Unit testing APIs

TreeViewWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItemById | [TreeViewItemWrapper](/index.html.md) &#124; null | Finds a visible tree view item by its ID. | id:of the item to findoptions:* expanded (optiona, boolean) - Use it to find the visible expanded or collapsed item. |
| findItems | Array<[TreeViewItemWrapper](/index.html.md)> | Finds all visible tree view items. | options:* expanded (optional, boolean) - Use it to find all visible expanded or collapsed items. | TreeViewItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the actions slot of the tree view item. | - |
| findChildItemById | [TreeViewItemWrapper](/index.html.md) &#124; null | Finds a visible child item by its ID. | id:of the item to findoptions:* expanded (optional, boolean) - Use it to find the visible expanded or collapsed child item. |
| findChildItems | Array<[TreeViewItemWrapper](/index.html.md)> | Finds all visible child items of the tree view item. | options:* expanded (optional, boolean) - Use it to find all visible expanded or collapsed child items. |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the content slot of the tree view item. | - |
| findIcon | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the icon slot of the tree view item. | - |
| findItemToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the expand toggle of the tree view item. | - |
| findSecondaryContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Finds the secondary content slot of the tree view item. | - |
## Integration testing examples

Expanding an item
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Tree view', () => {
  it('expands an item', async () => {
    // This code tests a component instance similar to this: /components/tree-view/?tabId=playground&example=simple-tree-view
    await browser.url('your-page-to-test');
    const wrapper = createWrapper().findTreeView();

    const expandableItem = wrapper.findItemById('1');

    const toggleSelector = expandableItem.findItemToggle().toSelector();
    await browser.$(toggleSelector).click();

    const childItemsSelector = expandableItem.findChildItems().toSelector();
    const childItemsCount = await browser.$$(childItemsSelector).length;

    expect(childItemsCount).toBe(4);
  });
});
```

Selecting items
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Tree view', () => {
  // This code tests a component instance similar to this: /components/tree-view/?tabId=playground&example=simple-tree-view
  it('selects all visible items', async () => {
    const wrapper = createWrapper().findTreeView();
    const itemsSelector = wrapper.findItems().toSelector();
    const itemsCount = await browser.$$(itemsSelector).length;

    await expect(itemsCount).toBe(4);
  });

  it('selects all visible collapsed items', async () => {
    const wrapper = createWrapper().findTreeView();
    const collapsedItemsSelector = wrapper.findItems({ expanded: false }).toSelector();
    const collapsedItemsCount = await browser.$$(collapsedItemsSelector).length;

    await expect(collapsedItemsCount).toBe(2);
  });

  it('selects all visible expanded items', async () => {
    const wrapper = createWrapper().findTreeView();

    const expandableItemToggleSelector = wrapper.findItemById('1').findItemToggle().toSelector();
    await browser.$(expandableItemToggleSelector).click(); // expand item

    const expandedItemsSelector = wrapper.findItems({ expanded: true }).toSelector();
    const expandedItemsCount = await browser.$$(expandedItemsSelector).length;

    await expect(expandedItemsCount).toBe(1);
  });
});
```

Selecting content of a child item
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Tree view', () => {
  it('selects content of a child item', async () => {
    // This code tests a component instance similar to this: /components/tree-view/?tabId=playground&example=simple-tree-view
    const wrapper = createWrapper().findTreeView();

    const expandableItem = wrapper.findItemById('1');

    const toggleSelector = expandableItem.findItemToggle().toSelector();
    await browser.$(toggleSelector).click(); // expand item

    const childItemContentSelector = expandableItem.findChildItemById('1.1').findContent().toSelector();
    const content = await browser.$(childItemContentSelector).getText();

    expect(content).toBe('index.tsx');
  });
});
```

## Integration testing APIs

TreeViewWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItemById | [TreeViewItemWrapper](/index.html.md) &#124; null | Finds a visible tree view item by its ID. | id:of the item to findoptions:* expanded (optiona, boolean) - Use it to find the visible expanded or collapsed item. |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TreeViewItemWrapper](/index.html.md)> | Finds all visible tree view items. | options:* expanded (optional, boolean) - Use it to find all visible expanded or collapsed items. | TreeViewItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the actions slot of the tree view item. | - |
| findChildItemById | [TreeViewItemWrapper](/index.html.md) &#124; null | Finds a visible child item by its ID. | id:of the item to findoptions:* expanded (optional, boolean) - Use it to find the visible expanded or collapsed child item. |
| findChildItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TreeViewItemWrapper](/index.html.md)> | Finds all visible child items of the tree view item. | options:* expanded (optional, boolean) - Use it to find all visible expanded or collapsed child items. |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the content slot of the tree view item. | - |
| findIcon | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the icon slot of the tree view item. | - |
| findItemToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the expand toggle of the tree view item. | - |
| findSecondaryContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the secondary content slot of the tree view item. | - |
## General guidelines

### Do

- Use inline [icon](/components/button/index.html.md)   , [link](/components/button/index.html.md)   buttons, and [inline icon button dropdown](/components/button-dropdown/index.html.md)   to display contextual actions to complement the paddings in a tree item.
- Consider using horizontal scrolling for trees with several levels of nested items by specifying a minimum width on the container. This will help users read through the content better compared to extremely wrapped items.

### Don't

- Avoid having icons in icon slot for select items. Either add icons to all items, or none. This will help with consistency of tree layout.
- Avoid using horizontal scrolling in tree view when there are buttons present in the actions slot.
- Don't use a tree view for non-hierarchical display of items, use a [list](/components/list/index.html.md)   instead.
- Don't use a tree view for a flat list of steps without hierarchical sub-steps, use the [steps](/components/steps/index.html.md)   component instead.
- Don't use a tree view to show or hide information for a standalone item. Use an [expandable section](/components/expandable-section/index.html.md)   instead.
- Don't use a tree view to show tabular information with nesting. Use a [table with expandable rows](/components/table/index.html.md)   instead.

## Features

- #### Tree item

**With children**  
  Items in a tree with one or more related child items. This item can be expanded or collapsed to reveal or hide child items.  

**Without children**  
  Items in a tree without related child items. The item cannot be expanded or collapsed.
- #### Keyboard navigation

  This feature is built-in the tree view. It makes all tree view items navigable with the keyboard and ensures the entire tree view has a single tab stop. This allows keyboard users to efficiently navigate past the tree view without needing to tab through every interactive item.  

  Only use the following interactive elements in tree view items: [button](/components/button/index.html.md)   , [button dropdown](/components/button-dropdown/index.html.md)   , [toggle button](/components/toggle-button/index.html.md)   , [link](/components/link/index.html.md)   , [popover](/components/popover/index.html.md)  .
- #### Content

  The content that identifies a tree item, such as a label, to ensure proper context for users. The content can include [text](/components/text-content/index.html.md)   , [link](/components/link/index.html.md)   , and [status indicator](/components/status-indicator/index.html.md)   . For example, a link to the resource name.
- #### Icon - optional

  The leading icon in a tree item. For example, display a `folder`   icon before the name of a folder in a tree item to help users understand the content type.
- #### Secondary content - optional

  Additional details about a tree item displayed below the content. For example, description text related to the content in the tree item.  

  Wrap secondary content with a [box](/components/box/index.html.md)   and use small font and text-body-secondary color. If there is an icon, ensure the small size is used.
- #### Actions - optional

  Actions related to an individual item. Display inline [icon](/components/button/index.html.md)   or [link](/components/button/index.html.md)   buttons for individual actions, and [inline icon button dropdown](/components/button-dropdown/index.html.md)   for list of related actions. Refer to [in-context actions](/patterns/general/actions/incontext-actions/index.html.md)   for more guidelines.
- #### Expand toggle icon - optional

  Change the icon for expand toggle as per the needs of the use case. By default, `caret`   icon is displayed.
- #### Connector lines - optional

  A secondary visual affordance that helps highlight visual hierarchy across related tree items.

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

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- Provide alternative text for the tree view. Use either `ariaLabel`   or `ariaLabelledby`   to give the tree view a label that matches its visible title, for example from the container header.
- Provide unique and meaningful names to actions. For example, repeated inline icon button dropdown may have an aria-label as "Action menu for [name of the item]".
- Define `announcementLabel`   for items that have non-string content.
- Follow the accessibility guidelines for [icon](/components/icon/index.html.md)  .

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
