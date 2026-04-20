---
scraped_at: '2026-04-20T08:47:34+00:00'
section: components
source_url: https://cloudscape.design/components/container/index.html.md
title: Container
---

# Container

With the container, you can present a group of pieces of content, indicating that the items are related. For example, a table is a type of container.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/container)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/container/index.html.json)

## Development guidelines

If you want to place multiple containers one after another, use the [space between component](/components/space-between/index.html.md) with size `l` to add vertical spacing between them.

#### Responsive media container

The dimensions and position of media content, such as images, can be tailored within a container. You can specify the `width` , `height` , `position` (top or side), or `content` individually for each container breakpoint. To accomplish this, you can use the `useContainerQuery` hook from our component-toolkit:

```
import { useContainerQuery } from '@cloudscape-design/component-toolkit';

const ResponsiveMediaContainer = () => {
  const [useMobileView, ref] = useContainerQuery(entry => entry.contentBoxWidth < 688);
  return (
    <div ref={ref}>
      <Container media={{ content: "<img src='placeholder.png' />", position: useMobileView ? 'top' : 'side' }} />;
    </div>
  );
};
```

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting container
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Container from '@cloudscape-design/components/container';

describe('<Container />', () => {
  it('renders the container component', () => {
    const { container } = render(<Container />);
    const wrapper = createWrapper(container);

    expect(wrapper.findContainer()).toBeTruthy();
  });

  it('selects all container components', () => {
    const { container } = render(<>
      <Container />
      <Container />
      <Container />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllContainers();
    expect(components).toHaveLength(3)
  });
});
```

Selecting container header
```
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return <Container header={<Header variant="h2" description="Container Header" />}>Container Content</Container>;
}

describe('<Container />', () => {
  it('gets the header text', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const header = wrapper.findContainer()!.findHeader()!.getElement()!;

    expect(header.textContent).toBe('Container Header');
  });
});
```

Selecting container content
```
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return <Container header={<Header variant="h2" description="Container Header" />}>Container Content</Container>;
}

describe('<Container />', () => {
  it('gets the content text', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const header = wrapper.findContainer()!.findContent()!.getElement()!;

    expect(header.textContent).toBe('Container Content');
  });
});
```

## Unit testing APIs

ContainerWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findMedia | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
## Integration testing examples

Selecting container header
```
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return <Container header={<Header variant="h2" description="Container Header" />}>Container Content</Container>;
}

describe('<Container />', () => {
  it('gets the header text', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const header = wrapper.findContainer()!.findHeader()!.getElement()!;

    expect(header.textContent).toBe('Container Header');
  });
});
```

Selecting container content
```
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return <Container header={<Header variant="h2" description="Container Header" />}>Container Content</Container>;
}

describe('<Container />', () => {
  it('gets the content text', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const header = wrapper.findContainer()!.findContent()!.getElement()!;

    expect(header.textContent).toBe('Container Content');
  });
});
```

## Integration testing APIs

ContainerWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findMedia | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use vertical and horizontal lines to separate pieces of content, if necessary.
- Use a container to group similar items or display a list of attributes for a single item.
- When a container includes media and text, provide enough space for the text content, to ensure readability. Optimal ratios are 2/3 text and 1/3 media, or half text and half media.
- In a collection view where containers are displayed next to each other, use the same height for media.
- For optimal display of media elements within narrow containers, position the media at the top. This arrangement allows more room for text content, enhancing readability.

### Don't

- Don't put containers inside containers. If you need to group information inside a container, consider using the [header component](/components/header/index.html.md)   to create sections within the container, or an embedded [item card](/components/item-card/index.html.md)   to display individual entities (such as files or individual resources) within the grouped content.
- Don't use containers simply for page hierarchy or for general page-layout purposes.

## Features

- #### Header - optional

  Use the header to display the title of the container. Additionally, you can include information and actions that apply to the entire content of the container, such as description, action stripe, counter, or an info link.  

  The h2 variant of the [header](/components/header/index.html.md)   component is designed to be used in this component.
- #### Content

  The area for primary container content. Common content types of a container are:  

  - [Form fields](/components/form-field/index.html.md)     for [creation](/patterns/resource-management/create/index.html.md)     and [edit](/patterns/resource-management/edit/index.html.md)     flows. Use the main content of a container for primary and required fields of a single item's configuration.
  - [Key-value pairs](/components/key-value-pairs/index.html.md)     for [detail](/patterns/resource-management/details/index.html.md)     pages. Use the main content area to display key-value pairs that describe a single item's configuration.
  - [Charts](/components/charts/index.html.md)     for [dashboard](/patterns/general/service-dashboard/index.html.md)     pages. Use the main content area to display the visualization.
  - [Tables](/components/table/index.html.md)     that are displayed with other content, such as [key-value pairs](/components/key-value-pairs/index.html.md)     and supporting text. Use the `embedded variant`     of the table in this case.
- #### Footer - optional

  Use a footer for secondary content. For example, in a [creation flow](/patterns/resource-management/create/index.html.md)   , this area often contains an [expandable section](/components/expandable-section/index.html.md)   with advanced configuration options. Alternatively, the [details as a hub](/patterns/resource-management/details/details-page-as-hub/index.html.md)   pattern uses this area for a *View all *   link that takes the user to a new page with the complete items list.  

  The footer can also contain elements like [button icons](/components/button/index.html.md)   (for example, share or download).
- #### Media - optional

  - Optimized for content-oriented containers. Using the media feature allows displaying integrated images like photos and video thumbnails. You can define different placements and sizes of integrated images:
  - The dimensions and position of media content, such as images, can be tailored within a container. You can specify the height, width, position (top or side).
  - By default, an image stretches to fill the full width of the container when positioned at the top, or the full height when positioned on the side. To crop images, you can set a custom value for height or width as needed. However, ensure that essential elements remain visible to users and aren't unintentionally cropped out of the view.
  - For best results consider using 16:9 and 4:3 formats for large images, and 1:1 format for icons. The image will be cropped if the height/width specified don't match the aspect ratio of the image.
  - Video thumbnails can be linked to the video player page or trigger a custom action (e.g.: open a modal).
- #### Variant

  - **Default**     : used in standalone context.
  - **Stacked**     : optimized to be displayed adjacent to other stacked components, see an example of [key-value pairs in a container with a table](/components/key-value-pairs/index.html.md)    .

## Writing guidelines

### General writing guidelines

- Use sentence case, but continue to capitalize proper nouns and brand names correctly in context.
- Use end punctuation, except in [headers](/components/header/index.html.md)   and [buttons](/components/button/index.html.md)   . Don't use exclamation points.
- Use present-tense verbs and active voice.
- Don't use *please*   , *thank you*   , ellipsis ( *...*   ), ampersand ( *&*   ), *e.g.*   , *i.e.*   , or *etc.*   in writing.
- Avoid directional language.  

  - For example: use *previous*     not *above*     , use *following*     not *below*    .
- Use device-independent language.  

  - For example: use *choose*     or *interact*     not *click*    .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component specific guidelines

- Provide alternative text that describes the function or purpose of the image. Ideally, the alternative text should provide instructive information that would be missed if a person cannot see the image. If the image is purely decorative, use the respective ARIA presentation role instead.  

  - If the image is accompanied by text in the container that describes it sufficiently, there is no need to add alternative text to the image itself.
  - When providing alternative text, make sure to follow the [alternative text guidelines.](/foundation/core-principles/accessibility/index.html.md)
- If the image has important visual cues or content that needs to be exposed to the user (such as text) make sure it's not cropped when the screen size changes.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
