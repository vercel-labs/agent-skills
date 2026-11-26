---
scraped_at: '2026-04-20T08:47:36+00:00'
section: components
source_url: https://cloudscape.design/components/content-layout/index.html.md
title: Content layout
---

# Content layout

Provides page structure for expressive use cases.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/content-layout)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/content-layout/index.html.json)

## Development guidelines

Use the content layout component to structure pages that require a visual separation between the header and the content. You can apply the appropriate visual separation by configuring the `headerVariant` and `headerBackgroundStyle` properties.

The content layout component can be used as a standalone layout. It can also be used in the `content` slot of the [app layout](/components/app-layout/index.html.md) component only if your page includes side navigation and tools. When used with the app layout, we recommend to disable app layout content paddings ( `disableContentPaddings=true` ) and set content layout `defaultPadding` property to `true` . Note that proper padding is applied only when both components are part of the same React application.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting content layout
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import ContentLayout from '@cloudscape-design/components/content-layout';

describe('<ContentLayout />', () => {
  it('renders the content-layout component', () => {
    const { container } = render(<ContentLayout />);
    const wrapper = createWrapper(container);

    expect(wrapper.findContentLayout()).toBeTruthy();
  });

  it('selects all content-layout components', () => {
    const { container } = render(<>
      <ContentLayout />
      <ContentLayout />
      <ContentLayout />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllContentLayouts();
    expect(components).toHaveLength(3)
  });
});
```

Selecting content layout header and content
```
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';

describe('<ContentLayout />', () => {
  it('selects the content layout header and content', () => {
    const { container } = render(
      <ContentLayout header={<Header>Content layout header</Header>}>Content layout content</ContentLayout>
    );
    const wrapper = createWrapper(container);
    const contentLayout = wrapper.findContentLayout()!;

    const headerTextContent = contentLayout.findHeader()!.getElement().textContent;
    const contentTextContent = contentLayout.findContent()!.getElement().textContent;

    expect(headerTextContent).toBe('Content layout header');
    expect(contentTextContent).toBe('Content layout content');
  });
});
```

## Unit testing APIs

ContentLayoutWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findBreadcrumbs | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findNotifications | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findSecondaryHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
## Integration testing APIs

ContentLayoutWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findBreadcrumbs | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNotifications | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSecondaryHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use only one content layout component per page.
- Reserve header styling (for example, with color, gradients, or images) to draw users attention to a specific message (for example, a call to action), or build brand equity. Consult the [hero header](/patterns/general/hero-header/index.html.md)   pattern for more guidelines.
- Reserve header styling for use cases with low levels of interactivity, and where information density is not critical.
- Reserve header styling for specific use cases, as opposed to using across your entire application.
- Use the high-contrast `headerVariant`   when applying a dark background to the header.
- Disable content overlap if the page content does not start with a container.
- Add default padding to the content and header by setting `defaultPadding`   to true.

### Don't

- Don't use the content layout component for productive use cases such as [resources creation](/patterns/resource-management/create/index.html.md)   , [view](/patterns/resource-management/view/index.html.md)   , [edit](/patterns/resource-management/edit/index.html.md)   , and [delete](/patterns/resource-management/delete/index.html.md)  .
- Don't nest multiple content layout components.
- Don't use the content layout notifications or breadcrumbs features if you already use those slots in App layout. This results in duplicate content.
- Don't use the divider headerVariant when the content area starts with containers or tabs.

## Features

- #### Header

  The header area contains contains page level information and actions. This can span from a simple page title to more complex scenarios such as a [hero header](/patterns/general/hero-header/index.html.md)   . You can configure the visual style of the header area by selecting one of the following variants:  

  - **Default:**     no additional styling is applied. The header has the same background as the rest of the page, unless explicitly customized.
  - **Divider: **     uses a divider to separate the header from the content area. Use this variant when the content of the page starts with blocks of text outside of any container, and there no header styling is needed. The divider spans across the specified maximum content width.

  - **High-contrast:**     applies a dark [visual context](/foundation/visual-foundation/visual-context/index.html.md)     to the header.

  You can further customize the header visual style by setting a custom `headerBackgroundStyle`   to add a gradient or an image, to draw users attention to a specific message (for example, a call to action), or build brand equity. The visual treatment spans across 100% of the available space, independently of the maximum content width that you specify. It also covers notifications and breadcrumbs areas that you embed within the component. When customizing the header background style, ensure that the header content meets color contrast requirements.  

  By default, the header overlaps with the content below it. This is recommended when you place a container in the content area. In other use cases, you can remove the overlap by setting `disableOverlap`   to true. For example, see [product detail page](/examples/react/product-detail-page.html)  .  

  For additional guidance, follow the guidelines for [layout](/foundation/visual-foundation/layout/index.html.md)   and [hero header](/patterns/general/hero-header/index.html.md)  .
- #### Secondary header - optional

  The secondary header area can be used to add complementary page level information and a call to action. Note that the secondary header is always displayed in a light visual context, independently of the styling of the main header. If you want to insert a custom content area with the same visual treatment as the rest of the header, use the header slot.
- #### Notifications - optional

  The notifications area is a dedicated section at the top of a page that displays notifications such as [flashbars](/components/flashbar/index.html.md)   . The background of this area is dictated by the header background style you configured.
- #### Breadcrumbs - optional

  The breadcrumbs area is a dedicated section at the top of a page that displays [breadcrumbs](/components/breadcrumb-group/index.html.md)   . The background of this area is dictated by the header background style you configured.
- #### Content

  The content area displays the main content of the page, where users focus their attention the most. By default, the content area occupies 100% of the available space. You can configure the component to:  

  - add default padding by setting `defaultPadding`     to true. When used in conjunction with the app layout, the padding accounts for additional elements such as drawers triggers.
  - set a maximum content width. The content is centered and constrained to the specified maximum width.

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

- Follow the writing guidelines for [header](/components/header/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Accessibility landmarks

- The content layout component does not come with any accessibility landmarks. When used as a standalone layout independent from the app layout component these landmarks will need to implemented manually.
- When customizing the header background style, ensure that the header content meets color contrast requirements.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
