---
scraped_at: '2026-04-20T08:49:25+00:00'
section: components
source_url: https://cloudscape.design/components/split-panel/index.html.md
title: Split panel
---

# Split panel

A collapsible panel that provides access to secondary information or controls. It is the primary component to implement split view, a pattern to display item collection with contextual item details.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/split-panel) [View in demo](/examples/react/split-panel-multiple.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/split-panel/index.html.json)

## Development guidelines

**Configuration**

The split panel component must be used within the `splitPanel` slot of the [app layout toolbar component](/components/app-layout-toolbar/index.html.md) . The app layout toolbar component will provide the preferences icon, dismiss icon, resize handler, resize functionality and toggle functionality. Refer to the [development guidelines](/components/app-layout-toolbar/index.html.md) of the app layout toolbar component to learn how to configure it.

The panel should be closed by default on page load.

For additional guidelines for the behavior of the split panel, see the [split view](/patterns/resource-management/view/split-view/index.html.md) pattern.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting split panel
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import SplitPanel from '@cloudscape-design/components/split-panel';

describe('<SplitPanel />', () => {
  it('renders the split-panel component', () => {
    const { container } = render(<SplitPanel />);
    const wrapper = createWrapper(container);

    expect(wrapper.findSplitPanel()).toBeTruthy();
  });

  it('selects all split-panel components', () => {
    const { container } = render(<>
      <SplitPanel />
      <SplitPanel />
      <SplitPanel />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllSplitPanels();
    expect(components).toHaveLength(3)
  });
});
```

Opening the split panel
```
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import SplitPanel from '@cloudscape-design/components/split-panel';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

function Component() {
  const [isSplitPanelOpen, setIsSplitPanelOpen] = useState(false);

  return (
    <AppLayout
      splitPanelOpen={isSplitPanelOpen}
      onSplitPanelToggle={({ detail }) => setIsSplitPanelOpen(detail.open)}
      splitPanel={<SplitPanel header="Split panel">Split panel content</SplitPanel>}
      content={<ContentLayout>App layout content</ContentLayout>}
    />
  );
}

describe('<AppLayout />', () => {
  it('opens the split panel', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);
    const appLayout = wrapper.findAppLayout()!;

    appLayout.findSplitPanelOpenButton()!.click();
    const splitPanelContent = appLayout.findSplitPanel()!.findOpenPanelBottom()!.findOpenPanelBottom()!;

    expect(splitPanelContent!.getElement()!.textContent).toContain('Split panel content');
  });
});
```

Changing the split panel position
```
import AppLayout, { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import SplitPanel from '@cloudscape-design/components/split-panel';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import { useState } from 'react';

function Component() {
  const [isSplitPanelOpen, setIsSplitPanelOpen] = useState(false);
  const [splitPanelPreferences, setSplitPanelPreferences] = useState<AppLayoutProps['splitPanelPreferences']>({
    position: 'bottom',
  });

  return (
    <AppLayout
      splitPanelOpen={isSplitPanelOpen}
      onSplitPanelToggle={({ detail }) => setIsSplitPanelOpen(detail.open)}
      splitPanelPreferences={splitPanelPreferences}
      onSplitPanelPreferencesChange={({ detail }) => setSplitPanelPreferences(detail)}
      splitPanel={<SplitPanel header="Split panel header">Content</SplitPanel>}
    />
  );
}

describe('<SplitPanel />', () => {
  it('changes the split panel position', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    // 1. Open panel
    wrapper.findAppLayout()!.findSplitPanelOpenButton()!.click();

    expect(wrapper.findSplitPanel()!.findOpenPanelBottom()).toBeTruthy();
    expect(wrapper.findSplitPanel()!.findOpenPanelSide()).toBeFalsy();

    // 2. Open panel preferences
    wrapper.findSplitPanel()!.findPreferencesButton()!.click();

    // Important note: Modal doesn't reside inside `container`.
    // For this reason we call `createWrapper` without any argument to get the root wrapper.
    const modal = createWrapper().findModal()!;

    // 3. Change position to "side"
    const sideTile = modal.findContent()!.findTiles()!.findInputByValue('side');
    sideTile!.click();

    const submitButton = modal.findFooter()!.findAllButtons()[1];
    submitButton.click();

    // 4. Assert that the panel position is changed to "side"
    expect(wrapper.findSplitPanel()!.findOpenPanelBottom()).toBeFalsy();
    expect(wrapper.findSplitPanel()!.findOpenPanelSide()).toBeTruthy();
  });
});
```

## Unit testing APIs

SplitPanelWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCloseButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findHeaderActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeaderBefore | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeaderDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeaderInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findOpenButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findOpenPanelBottom | [SplitPanelWrapper](/components/split-panel/index.html.md) &#124; null | Returns the same panel if it's currently open in bottom position. If not, it returns null.Use this method to assert the panel position. | - |
| findOpenPanelSide | [SplitPanelWrapper](/components/split-panel/index.html.md) &#124; null | Returns the same panel if it's currently open in side position. If not, it returns null.Use this method to assert the panel position. | - |
| findPreferencesButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findSlider | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

SplitPanelWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCloseButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeaderActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeaderBefore | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeaderDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeaderInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOpenButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findOpenPanelBottom | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the same panel if it's currently open in bottom position. If not, it returns null.Use this method to assert the panel position. | - |
| findOpenPanelSide | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the same panel if it's currently open in side position. If not, it returns null.Use this method to assert the panel position. | - |
| findPreferencesButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findSlider | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Implement both positions when using the component.
- Allow users to change the default position to better fit their needs.
- Refer to the [split view](/patterns/resource-management/view/split-view/index.html.md)   pattern for additional design guidance on the application of split panel.
- Hide the split panel on close when an additional trigger is not necessary, and the panel is opened from an on-page action. Common use cases for this are:
  - Adding or editing an element on the page, such as a widget or resource
  - Displaying supplemental content or details
  - Content similar to a [modal](/components/modal/index.html.md)     , where keeping the context of the main page is important

### Don't

- Don't use the split panel for help content. Use the [help panel](/components/help-panel/index.html.md)   instead.
- Don't use the split panel to replace the [details page](/patterns/resource-management/details/index.html.md)  .

## Features

The split panel component and guidelines have two main use cases: to provide or compare contextual item details in the [split view](/patterns/resource-management/view/split-view/index.html.md) , or to show supplementary information or feature access. In the case where the split panel hides on close, the split panel acts similarly to a modal, but it keeps the main page in view instead of overlaying it. Common use cases here are adding or editing an element on the page, viewing details, or other supplementary content where it is useful to have the main page context.

- #### Types of panel

  There are two types of split panels: **comparison**   and **discrete**  .  

  - **Comparison: **     Includes a global trigger as well as an icon button in the panel header to expand and collapse the panel. It supports panel preferences, allowing users to control its placement (bottom or side). Use this for viewing and comparing items in a table or card view.
  - **Discrete: **     Triggered only by interactions within the page and always positioned on the side without panel preferences. Use this for actions like adding widgets in a configurable dashboard or opening a sub-creation panel within a single-page create.
- #### Header

#### Title

  The title of the comparison split panel should show the ID of the selected item in case of single selection, or the number of selected items in case of multi-selection. For example: *2 instances selected.*  

  The title of the discrete split panel should indicate the action that the split panel is used for. For example, within a configurable dashboard, a possible title could be *Add widget.*  

#### Close button

  Users can click the close or collapse button to close the split panel.  

#### Split panel preferences (optional)

  In a comparison split panel, the split panel preferences allow users to choose the default position of the split panel: bottom or side. When users choose the gear icon button, a modal appears where users can select the preference.  

  Don't provide split panel preferences when using the discrete split panel.  

#### Description (optional)

  The description gives the user additional information about the underlying content and any actions that may be possible to perform on it. Ensure that links in the description use the [primary link](/components/link/index.html.md)   variant.  

  Follow UX guidelines and writing guidelines for description content in [help system.](/patterns/general/help-system/index.html.md)  

#### Actions (optional)

  Add actions as a [button](/components/button/index.html.md)   or a [button dropdown](/components/button-dropdown/index.html.md)   if users can perform actions on the underlying content. Feature one key action in the header and then place additional actions in the icon button dropdown.  

#### Info (optional)

  The area to render an [info link](/patterns/general/help-system/index.html.md)   . Use an info link to display help panel content.  

  For more information about using the help panel, follow the guidelines for [help system](/patterns/general/help-system/index.html.md)  .  

#### Custom title content (optional)

  Custom content can be displayed before or instead of the title, inside the same heading tag. For example, an icon or a badge.
- #### Content area

  Displays the content of the split panel. For example, details about a selected item. For more content examples and guidelines, see [split view](/patterns/resource-management/view/split-view/index.html.md)   pattern.
- #### Position

  The split panel has two positions: bottom and side. The two positions address different user needs and have a different visual treatment:  

  - **Bottom position **     - The split panel overlays the content below it.
  - **Side position**     - The split panel behaves similarly to the help panel, shifting the page content as it expands. This maintains consistency with how other side panels are used in the system, and ensures that right-aligned action buttons in containers aren't covered by the panel.

  Choose the default position that best accommodates the main page content and the content within the panel. For more guidance about which position to set as default on a split view, see [split view](/patterns/resource-management/view/split-view/index.html.md)   pattern.
- #### Resizing

  With the resize handle, users can adjust the size of the split panel. The component sets the maximum and minimum size when resizing the panel and remembers the adjusted size when users close and reopen the panel.
- #### App layout toolbar

  Place the split panel in the `splitPanel`   region of [app layout toolbar](/components/app-layout-toolbar/index.html.md)  .

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

#### Split panel title

- When no selection is made in the item collection, use the format: *0 \[item type\] selected*  

  - For example:* 0 instances selected.*
- Use the ID of the selected item for panel title when users make a selection.
- When users select more than one item, use the format: *\[number\] \[item type\] selected*  

  - For example:* 2 instances selected.*

#### Empty state text

- Use the empty state text when no selection is made in the item collection on the [split view](/patterns/resource-management/view/split-view/index.html.md)  .
- When users can only select one item from the item collection, use the format: *Select a \[item type\] to see its details*
- When users can select multiple items, use the format: *Select a \[item type\] to see its details*   . Then describe what will show when multiple items are selected.  

  - For example: *Select an instance to see its details. Select multiple instances to compare.*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Provide alternative text for the expand button of the split panel.  

  - For example:* Open resource details.*
- Provide alternative text for the X close icon of the split panel.  

  - For example: *Close resource details.*

#### ARIA label

Provide an ARIA label if the provided title or custom content in the heading tag is not appropriate label for the panel.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
