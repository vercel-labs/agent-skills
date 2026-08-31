---
scraped_at: '2026-04-20T08:47:47+00:00'
section: components
source_url: https://cloudscape.design/components/drawer/index.html.md
title: Drawer
---

# Drawer

A panel that displays supplementary content on a page, which supports task completion or feature access.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/drawer)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/drawer/index.html.json)

## Development guidelines

#### App layout

- Place drawer content in the content slot of the `drawers`   property of the [app layout](/components/app-layout/index.html.md)   component. The app layout will provide the dismiss icon and toggle functionality.
- To allow users to adjust the size of the drawer, set the `resizable`   value to true on the `drawers`   property of the app layout . The component will set the maximum and minimum size when resizing the drawer and remembers the adjusted size when users close and reopen the drawer. If you need to override the default drawer width provided by the app layout, modify the `defaultSize`   value on the `drawers`   property of the app layout.
- Don't disable the functionality to close the drawer, even when there is only one state of content.
- When the user closes the drawer and later reopens it within the same page view, the content should remain the same as what was previously shown. The content should not automatically switch back to the default content.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting drawer
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Drawer from '@cloudscape-design/components/drawer';

describe('<Drawer />', () => {
  it('renders the drawer component', () => {
    const { container } = render(<Drawer />);
    const wrapper = createWrapper(container);

    expect(wrapper.findDrawer()).toBeTruthy();
  });

  it('selects all drawer components', () => {
    const { container } = render(<>
      <Drawer />
      <Drawer />
      <Drawer />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllDrawers();
    expect(components).toHaveLength(3)
  });
});
```

Selecting drawer header, content and footer
```
import Drawer from '@cloudscape-design/components/drawer';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

describe('<Drawer />', () => {
  it('selects the drawer header, content, and footer', () => {
    const { container } = render(
      <Drawer header="Drawer header" footer="Drawer footer">
        Drawer content
      </Drawer>
    );
    const wrapper = createWrapper(container);
    const drawer = wrapper.findDrawer()!;

    const headerText = drawer.findHeader()!.getElement()!.textContent;
    const contentText = drawer.findContent()!.getElement()!.textContent;
    const footerText = drawer.findFooter()!.getElement()!.textContent;

    expect(headerText).toBe('Drawer header');
    expect(contentText).toBe('Drawer content');
    expect(footerText).toBe('Drawer footer');
  });
});
```

## Unit testing APIs

DrawerWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeaderActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

DrawerWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeaderActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Persist the user preference for drawer open or closed when users navigate across pages.
- For drawers that are opened from an on-page action and need an empty state as a default state, display an empty state in the drawer. Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md)  .
- For more information on the use of drawer, help panel, and split panel, see [secondary panels](/patterns/general/secondary-panels/index.html.md)  .
- Use the footer to host persistent actions or contextual information that must remain accessible while users scroll through the panel's content.

### Don't

- Don't put critical content in a drawer. Content in a drawer should be supplemental and not required for a user to complete their task.
- Don't trigger a drawer from a modal.
- Don't put help content or tutorial content in a drawer, instead use [help panel](/components/help-panel/index.html.md)   or [tutorial panel](/components/tutorial-panel/index.html.md)  .
- Don't use a drawer for item selection, instead use a [split panel](/components/split-panel/index.html.md)  .
- Don't overwhelm users with information. Be selective on the content of the drawer and keep it concise to minimize cognitive load.
- Don't overload the footer with too much content. Keep it focused on the most important content related to the drawer.

## Features

- #### Header

  The header area should contain a title that explains the content of the drawer in a concise manner. This should be the only `<h2>`   in the drawer.
- #### Content

  Drawer content is a space for supplementary features or assistance in task completion. Unlike the help panel content, drawer content can be interactive and may include inputs, expandable sections, and other dynamic components. Common content types in a drawer are:  

  - Inputs and text areas for feedback or queries
  - Key-value pairs for summaries
  - Links and buttons for sharing content
  - Expandable sections for progressive disclosure or simplifying the interface
- #### App layout

  Place a drawer in the `drawers`   region of [app layout](/components/app-layout/index.html.md)   to get properties such as default drawer width and dismiss control functionality.
- #### Footer - optional

  An area at the bottom of the panel to display content, for example text or [prompt input](/components/prompt-input/index.html.md)   in a chat experience. Footer is sticky by default and remains visible when users scroll.

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

#### Component-specific guidelines

- Keep the content succinct. Users should be able to quickly scan content without scrolling. Content that's in a drawer should never include critical information.
- To keep content concise, rely on page element context as much as possible.
- Follow the writing guidelines for any child component in the content area.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and ARIA regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.
- [More accessibility guidelines](/foundation/core-principles/accessibility/index.html.md)

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
