---
scraped_at: '2026-04-20T08:48:18+00:00'
section: components
source_url: https://cloudscape.design/components/help-panel/index.html.md
title: Help panel
---

# Help panel

The panel displays help content that relates to a concept, term, setting, option, or task within the main page content.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/help-panel)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/help-panel/index.html.json)

## Development guidelines

#### App layout

- Place help panel content in the `tools`   slot of the [app layout](/components/app-layout/index.html.md)   component. The app layout will provide the dismiss icon and toggle functionality.
- Don't override the default help panel width provided by the app layout.
- Don't disable the functionality to close the help panel, even when there is only one state of content.
- When the user closes the help panel and later reopens it within the same page view, the content should remain the same as what was previously shown. The content should not automatically switch back to the default content.
- The panel should be closed by default on page load.
- For additional guidelines for the behavior of the help panel, see [help system](/patterns/general/help-system/index.html.md)  .

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting help panel
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import HelpPanel from '@cloudscape-design/components/help-panel';

describe('<HelpPanel />', () => {
  it('renders the help-panel component', () => {
    const { container } = render(<HelpPanel />);
    const wrapper = createWrapper(container);

    expect(wrapper.findHelpPanel()).toBeTruthy();
  });

  it('selects all help-panel components', () => {
    const { container } = render(<>
      <HelpPanel />
      <HelpPanel />
      <HelpPanel />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllHelpPanels();
    expect(components).toHaveLength(3)
  });
});
```

Selecting header and content
```
import AppLayout from '@cloudscape-design/components/app-layout';
import HelpPanel from '@cloudscape-design/components/help-panel';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

function Component() {
  return (
    <AppLayout
      tools={<HelpPanel header="Help panel header">Help panel content</HelpPanel>}
      content="App layout content"
    />
  );
}

describe('<HelpPanel />', () => {
  it('selects help panel header and content', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const helpPanel = wrapper.findAppLayout()!.findTools()!.findHelpPanel();
    const helpPanelHeaderText = helpPanel!.findHeader()!.getElement().textContent;
    const helpPanelContentText = helpPanel!.findContent()!.getElement().textContent;

    expect(helpPanelHeaderText).toBe('Help panel header');
    expect(helpPanelContentText).toBe('Help panel content');
  });
});
```

## Unit testing APIs

HelpPanelWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

HelpPanelWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Set the help panel closed by default, except if a [tutorial](/components/tutorial-panel/index.html.md)   panel is implemented.
- Persist the user preference for panel open or closed when users navigate across pages that have help content.
- Always use info links to open the help panel. Follow the guidelines for [help system](/patterns/general/help-system/index.html.md)  .
- The *Info*   link can be used multiple times within a page. The information in the corresponding help panel that opens when interacting with the *Info*   link should match the header or label topic directly next to the *Info*   link.

### Don't

- Don't invoke the help panel from a modal.
- Don't use more than one `<h2>`   per panel.
- Don't display item-specific meta data, forms, or tools in the help panel.
- Don't use the help panel for providing step-by-step guidance on how to complete a task, instead use the [hands-on tutorials](/patterns/general/onboarding/hands-on-tutorials/index.html.md)   instead. Follow the guidelines for [onboarding](/patterns/general/onboarding/index.html.md)  .

## Features

- #### Header

  The help panel header must match the topic header of the *Info*   link. The header is the only <h2> in the help panel.
- #### Help content area

  - Supported content types for the main content area include the following: paragraphs, links, heading levels: 3, 4, and 5, unordered and ordered lists, code, preformatted text, description lists, dividers, line breaks, bold text, and italic text. For the full list of accepted HTML elements, see the [API documentation](/components/help-panel/index.html.md)    .
  - Links to related external documentation can be embedded in the main content area, as well as placed in the *Learn more *     footer.

### Section headers

  Use the supported heading sizes starting from H3 to organize content into groups.  

### Dividers

  Use dividers to separate sections that are fundamentally not related to each other. Use dividers sparingly. It's typical for the divider between the content area and learn more footer to be the only divider in a panel.
- #### Learn more footer

  The footer is the last section in the panel that contains a list of additional links to relevant help topics. Typically these links should lead to external documentation.  

  - The header for the *Learn more*     footer should display an external [icon](/components/icon/index.html.md)     at the end.
  - The *Learn more*     footer should provide 1-3 links to additional relevant or related documentation for users who have more questions or need further explanations of the corresponding help panel topics.

  Follow the guidelines for [help system](/patterns/general/help-system/index.html.md)  .
- #### App layout

  Place help panel in the `tools`   region of [app layout](/components/app-layout/index.html.md)   to get properties such as default panel width and dismiss control functionality.

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

#### Header

- The help panel title should match the header or label of the corresponding page, section, or element directly next to the *Info*   link.

#### Section headers

- Keep section headers clear and concise.
- Don't write long section headers that are overloaded with specific or important information.

#### Help panel content

- Keep the content succinct. Users should be able to quickly scan content without scrolling.
- The ideal help panel topic length is 150 words. Minimum words per help panel topic are approximately 40. We recommend no more than about 300 words per help topic.
- To keep text concise, rely on page element context as much as possible for the placement of info links and associated help panel content.
- Follow UX guidelines and writing guidelines for help panel content in [help system.](/patterns/general/help-system/index.html.md)

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
