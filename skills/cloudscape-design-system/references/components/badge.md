---
scraped_at: '2026-04-20T08:46:48+00:00'
section: components
source_url: https://cloudscape.design/components/badge/index.html.md
title: Badge
---

# Badge

A small, color-coded visual element that contains letters or numbers, that is used to label, categorize, organize, or indicate severity of items.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/badge) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/badge/index.html.json)

## Unit testing examples

Selecting badge
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Badge from '@cloudscape-design/components/badge';

describe('<Badge />', () => {
  it('renders the badge component', () => {
    const { container } = render(<Badge />);
    const wrapper = createWrapper(container);

    expect(wrapper.findBadge()).toBeTruthy();
  });

  it('selects all badge components', () => {
    const { container } = render(<>
      <Badge />
      <Badge />
      <Badge />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllBadges();
    expect(components).toHaveLength(3)
  });
});
```

Selecting badge content
```
import Badge from '@cloudscape-design/components/badge';
import Button from '@cloudscape-design/components/button';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const Component = () => {
  const [badgeContent, setBadgeContent] = useState('Content');
  return (
    <section>
      <Button onClick={() => setBadgeContent('Content Changed')}>Change Content</Button>
      <Badge>{badgeContent}</Badge>
    </section>
  );
};

describe('<Badge />', () => {
  it('selecting badge content', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);
    const button = wrapper.findButton()!;
    const badge = wrapper.findBadge()!;

    expect(badge.getElement().textContent).toBe('Content');

    button.click();

    expect(badge).toBeTruthy();
    expect(badge.getElement().textContent).toBe('Content Changed');
  });
});
```

## Unit testing APIs

BadgeWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## Integration testing examples

Selecting badge content
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Badge', () => {
  it('selecting badge content', async () => {
    /**
     * This code tests a component similar to /components/
     */
    await browser.url('your-test-page');

    const wrapper = createWrapper().findBadge('[data-testid="your-test-id"]');
    expect(wrapper).not.toBeNull();

    expect((await browser.$(wrapper.toSelector())).getText()).toContain('1');
  });
});
```

## Integration testing APIs

BadgeWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## General guidelines

### Do

- Use badges for items that you want to label, categorize, or organize using text or numbers.
- Place the badge in proximity to the item that it relates to.
- Use badges to provide additional context or to call attention to a  component.
- Use multiple badges in a row if needed.
- Use badge color coding consistently.
- Use the same severity palette for all items (badges and charts) across the application to consistently show its severity level. See [severity data visualization](/foundation/visual-foundation/data-vis-colors/index.html.md)   for more details.

### Don't

- Don't include icons or imagery on badges, only letters and numbers.
- Keep in mind that badges are not interactive.
- Avoid using badges, including severity badges, to indicate status. Follow the guidelines for [status indicator](/components/status-indicator/index.html.md)  .
- Don't use color only to indicate severity or category. Supplement color with text to let user know what this badge is indicating.
- Don't use badges for labeling features as new.

## Features

- #### Values

  Badge text is limited to alphanumeric characters.
- #### Types

  Basic badge colors are limited to the following:  

  - `grey (default)`
  - `blue`
  - `green`
  - `red`

  In addition to basic badges, there are five severity badges. Severity badge types are limited to the following:  

  - `severity-critical`
  - `severity-high`
  - `severity-medium`
  - `severity-low`
  - `severity-neutral`

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

Don't use color only to indicate severity or category. Supplement color with text to let user know what this badge is indicating. For example, use the word "Critical" in critical-severity badges.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
