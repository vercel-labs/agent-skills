---
scraped_at: '2026-04-20T08:46:59+00:00'
section: components
source_url: https://cloudscape.design/components/box/index.html.md
title: Box
---

# Box

With the box component, you can display and style basic elements and containers in compliance with Cloudscape's typography and spacing strategy.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/box)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/box/index.html.json)

## Development guidelines

The box component allows you to:

- style basic HTML elements  ( `h1`   , `h2`   , `h3`   , `h4`   , `h5`   , `p`   , `strong`   , `small`   , `code`   , `pre`   , `samp`   ) in compliance with the Design System by using the `variant`   property. To style headings within page headers and [containers](/components/container/index.html.md)   , use the [header](/components/header/index.html.md)   component instead.
- override specific text-related properties like font size ( `fontSize`   property), text alignment ( `textAlign`   property), color ( `color`   property), and font weight ( `fontWeight`   property).
- override the default display by using the `display`   property.
- control the layout by using the `margin`   , `padding`   and `float`   properties.

You can also style basic HTML element using the [text content](/components/text-content/index.html.md) component. Here are the differences:

- The box component lets you style **style a single HTML element**   ( `h1`   , `h2`   , `h3`   , `h4`   , `h5`   , `p`   , `strong`   , `small`   , `code`   , `pre`   , `samp`   ) by setting a variant that corresponds to the tag that you need. The component allows to override the default color, font size, line height and font weight to customize the basic HTML element.
- The [text content](/components/text-content/index.html.md)   component allows to **style chunks of HTML**   that contain basic elements  ( `h1`   , `h2`   , `h3`   , `h4`   , `h5`   , `p`   , `strong`   , `small`   , `code`   , `pre`   , `samp`   , `ul`   , `ol`   , `a`   ). You can use it as an alternative to the box component when you cannot convert every single basic element to a component (for example, HTML coming from a Content Management System, or the output of Markdown file). Unlike the box component, it allows to style lists ( `ul`   , `ol`   ) and anchors ( `a`   ) contained in the text.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting box
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Box from '@cloudscape-design/components/box';

describe('<Box />', () => {
  it('renders the box component', () => {
    const { container } = render(<Box />);
    const wrapper = createWrapper(container);

    expect(wrapper.findBox()).toBeTruthy();
  });

  it('selects all box components', () => {
    const { container } = render(<>
      <Box />
      <Box />
      <Box />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllBoxes();
    expect(components).toHaveLength(3)
  });
});
```

Selecting box content
```
import Box from '@cloudscape-design/components/box';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return (
    <div>
      <Box variant="p">Paragraph text</Box>
      <Box variant="h1">Heading text</Box>
    </div>
  );
}

describe('<Box />', () => {
  it('selects box content by variant', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const boxes = wrapper.findAllBoxes();

    expect(boxes).toHaveLength(2);
    expect(boxes[0].getElement().textContent).toBe('Paragraph text');
    expect(boxes[1].getElement().textContent).toBe('Heading text');
  });
});
```

Selecting box variant content
```
import Box from '@cloudscape-design/components/box';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return (
    <div>
      <Box variant="awsui-key-label">Key label</Box>
      <Box variant="awsui-value-large">42</Box>
    </div>
  );
}

describe('<Box />', () => {
  it('renders key-value pair with correct content', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const boxes = wrapper.findAllBoxes();

    expect(boxes[0].getElement().textContent).toBe('Key label');
    expect(boxes[1].getElement().textContent).toBe('42');
  });
});
```

## Unit testing APIs

BoxWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## Integration testing examples

Selecting box content
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Box', () => {
  it('selects box content', async () => {
    await browser.url('your-test-page');
    const wrapper = createWrapper();

    const boxSelector = wrapper.findBox().toSelector();
    const text = await browser.$(boxSelector).getText();

    expect(text).toBeTruthy();
  });
});
```

## Integration testing APIs

BoxWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## Features

- #### Headers

  Use heading variants ( `h1`   - `h5`   ) for headers and section titles. These provide the correct semantic structure for page hierarchy and apply the appropriate heading styles. For more information, see [heading type styles](/foundation/visual-foundation/typography/index.html.md)  .
- #### Texts

  Use paragraph ( `p`   ), block ( `div`   ), or other text variants ( `span`   , `strong`   , `small`   ) to maintain semantic clarity and apply the correct typographic styles. For more information, see [body type styles](/foundation/visual-foundation/typography/index.html.md)  .
- #### Code

  Use the following code variants to display plain commands, output, or preformatted examples. These variants primarily control **typography styles only**   without extra visual treatments such as background color. For more information, see [code type styles](/foundation/visual-foundation/typography/index.html.md)  .  

  - Use `code`     for inline code snippets.
  - Use `pre`     for blocks of pre-formatted text, such as multi-line code examples.
  - Use `samp`     for sample output from a program or system such as command results.

  For multi-line code blocks with structured formatting, use the [code view](/components/code-view/index.html.md)   component.
- #### Inline code

  Use the `awsui-inline-code`   variant for inline code fragments that need to appear inline with surrounding text. This variant ensures code samples are **visually distinct **   with** background color and code typography**  .
- #### Key labels

  For displaying key-value pair information, use the [key-value pair component](/components/key-value-pairs/index.html.md)   , which includes the key label style by default. This ensures the label is visually distinct from the value. For more information, see the [Key-value component guidelines](/components/key-value-pairs/index.html.md)  .
- #### Generative AI labels

  Use the `awsui-gen-ai-label`   variant to clearly indicate that content has been generated by AI. For more information, see the [generative AI output label guidelines.](/patterns/genai/output-label/index.html.md)
- #### Large display values

  Use the `awsui-value-large`   variant for highlighted numeric or textual values that need to stand out such as key summary values in dashboards. This variant applies a larger, lighter display style to emphasize importance. For more information, see the [display type styles](/foundation/visual-foundation/typography/index.html.md)  .
- #### Tag override

  If you need the box component to override the properties of a certain variant, use `tagOverride`   . For example, you may want to style an `<h2>`   heading to look like an `h3`   variant while keeping the intended semantic `<h2>`   tag.
- #### Spacing

  You can control the padding, margin and floating properties of an element by defining the unit of the spacing scale you would like to apply. For usage guidelines about spacing, see the [spacing foundation page](/foundation/visual-foundation/spacing/index.html.md)  .  

  For more feature related details see the [API tab](/components/box/index.html.md)  .

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
