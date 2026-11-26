---
scraped_at: '2026-04-20T08:48:41+00:00'
section: components
source_url: https://cloudscape.design/components/live-region/index.html.md
title: Live region
---

# Live region

A non-visual component used to announce page changes to assistive technology.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/live-region)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/live-region/index.html.json)

## Development guidelines

A live region is an accessibility measure to allow screen reader and other assistive technology users to be informed of dynamic changes that occur outside of the currently focused page element. The live region component contains a status message provided either by the `message` property or extracted from the text content of the `children` slot. This message is announced to screen readers when the component is first rendered and when the message content changes. The announcement message is not associated with any specific component or section of the page. Unlike paragraph text or other page elements, live region contents cannot be navigated or repeated by screen readers, so announcement messages should be clear and concise.

Use the live region to notify screen reader users of changes outside of their immediate context when moving focus is not possible or too disruptive for the user (for example, an asynchronous page update or an informational status message). When a page change immediately follows a user action and the updated element contains a focusable control, moving focus to the control may be preferable instead of using a live region. Refer to [focus management principles](/foundation/core-principles/accessibility/focus-management-principles/index.html.md) for more guidelines on focus management.

Assertive announcements interrupt any ongoing screen reader announcement and can be disruptive for users. They should only be used for time-sensitive or immediate announcements when an interruption is necessary. For example, form field uses an assertive live region for error and warning text when the focus leaves the active input, to interrupt the announcement of the next form field control.

More details about the ARIA live region pattern can be found on [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions).

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting live region
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import LiveRegion from '@cloudscape-design/components/live-region';

describe('<LiveRegion />', () => {
  it('renders the live-region component', () => {
    const { container } = render(<LiveRegion />);
    const wrapper = createWrapper(container);

    expect(wrapper.findLiveRegion()).toBeTruthy();
  });

  it('selects all live-region components', () => {
    const { container } = render(<>
      <LiveRegion />
      <LiveRegion />
      <LiveRegion />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllLiveRegions();
    expect(components).toHaveLength(3)
  });
});
```

Selecting live region content
```
import LiveRegion from '@cloudscape-design/components/live-region';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return <LiveRegion>Status update: 5 items loaded</LiveRegion>;
}

describe('<LiveRegion />', () => {
  it('selects the live region content', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const liveRegion = wrapper.findLiveRegion()!;

    expect(liveRegion).toBeTruthy();
    expect(liveRegion.getElement().textContent).toContain('5 items loaded');
  });
});
```

Hidden live region
```
import LiveRegion from '@cloudscape-design/components/live-region';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React from 'react';

function Component() {
  return <LiveRegion hidden={true}>Hidden announcement</LiveRegion>;
}

describe('<LiveRegion />', () => {
  it('renders a hidden live region', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const liveRegion = wrapper.findLiveRegion()!;

    expect(liveRegion).toBeTruthy();
    expect(liveRegion.getElement().textContent).toContain('Hidden announcement');
  });
});
```

## Unit testing APIs

LiveRegionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## Integration testing examples

Selecting live region content
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('LiveRegion', () => {
  it('selects the live region content', async () => {
    await browser.url('your-test-page');
    const wrapper = createWrapper();

    const liveRegionSelector = wrapper.findLiveRegion().toSelector();
    const isExisting = await browser.$(liveRegionSelector).isExisting();

    expect(isExisting).toBe(true);

    const text = await browser.$(liveRegionSelector).getText();

    expect(text).toBeTruthy();
  });
});
```

## Integration testing APIs

LiveRegionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## General guidelines

### Do

- Provide a clear and succinct message for the live announcement (1-2 sentences).
- Consult the development and accessibility guidelines for the relevant component on when to use the live region alongside Cloudscape components.

### Don't

- Don't place interactive elements including links or buttons inside the live region component. Move focus to the interactive element instead.

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

- Use clear and concise sentences (1-2 sentences).

## Accessibility guidelines

- Don't place interactive elements including links or buttons inside the live region component. Live announcements are made without any page context, so screen readers users wouldn't have details on how to locate interactive elements placed inside the live region.
- Only place text or non-semantic elements (such as `div`   or `span`   ) when using the `children`   slot. Elements labelled using `aria-label`   , `aria-labelledby`   , or `alt`   will not be included in the announcement message.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
