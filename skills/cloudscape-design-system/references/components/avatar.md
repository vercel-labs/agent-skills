---
scraped_at: '2026-04-20T08:46:46+00:00'
section: components
source_url: https://cloudscape.design/components/avatar/index.html.md
title: Avatar
---

# Avatar

Visual representation of a user or generative AI entity.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/chat-components/tree/main/src/avatar)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/avatar/index.html.json)

## Development guidelines

### Installing chat components

This component comes from the new `@cloudscape-design/chat-components` NPM module. Make sure to add this module to your dependencies.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting avatar tooltip
```
/**
 * This component is distributed in a separate package. To find it in test-utils,
 * add an extra import along with the main test-utils import:
 **/
import Avatar from '@cloudscape-design/chat-components/avatar';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import '@cloudscape-design/chat-components/test-utils/dom';
import { render } from '@testing-library/react';
import React from 'react';

const Component = () => {
  return <Avatar color="gen-ai" ariaLabel="avatar" tooltipText="tooltip" />;
};

describe('<Avatar />', () => {
  it('selecting avatar tooltip', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container).findAvatar();
    // focus the avatar to show the tooltip
    wrapper!.focus();
    const tooltip = wrapper!.findTooltip();

    expect(tooltip).not.toBeNull();
    expect(tooltip!.getElement()).toHaveTextContent('tooltip');
  });
});
```

## Unit testing APIs

AvatarWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findTooltip | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing examples

Selecting avatar tooltip
```
import createWrapper from '@cloudscape-design/components/test-utils/selectors';
/**
 * This component is distributed in a separate package. To find it in test-utils,
 * add an extra import along with the main test-utils import:
 **/
import '@cloudscape-design/chat-components/test-utils/selectors';

/**
 * browser - is a global object representing your testing framework.
 * The exact API could be different for your stack.
 */

describe('Avatar', () => {
  it('changes the text when clicked', async () => {
    // This code tests a component similar to the /components/avatar.
    await browser.url('your-test-page');
    const wrapper = createWrapper().findAvatar();

    const avatarSelector = wrapper.toSelector();
    await browser.$(avatarSelector).click();

    const tooltipSelector = wrapper.findTooltip().toSelector();
    const text = await browser.$(tooltipSelector).getText();
    expect(text).toBe('Tooltip text');
  });
});
```

## Integration testing APIs

AvatarWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findTooltip | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Always provide the full name associated with the user profile or generative AI entity in a tooltip. It helps inform users about the entity that avatar represents. For example, in conversational experiences, avatar shows the identity of authors.
- When using an icon inside the avatar, ensure the size of the avatar complements the icon size, which will scale according to one of the [sizes offered by the system](/foundation/visual-foundation/iconography/index.html.md)  .

### Don't

- Avoid using a custom size for the avatar in [chat experiences](/patterns/genai/generative-AI-chat/index.html.md)  .

## Features

- #### Color

  There are two supported avatar colors:  

  - Default - use this color to represent users, objects, and services.
  - Generative AI - use this color to represent generative AI assistants.
- #### Icon

  An icon is displayed in the avatar to represent the entity it belongs to. By default, the user-profile icon is displayed. This icon can be replaced as needed in the use case. For example, use the gen-ai icon for a generative AI entity.
- #### User initials - optional

  Display up to two letters as user initials in the avatar. If you provide one letter, user initials will display one letter. If you provide two or more letters, user initials will display two letters.
- #### Tooltip

  Display the name associated with the identity of the avatar in a tooltip. For example, display the user name associated with the user profile, or the name of the generative AI assistant.
- #### Custom image - optional

  Display a custom image in the avatar. The custom image can be in any format (for example, PNG or JPEG).
- #### Size

  The avatar has a default and minimum size of 28px, which can be increased based on the use case. The icon and user initials will scale with the avatar size.

### States

- #### Loading state

  Indicates that an action is being performed by the entity it belongs to. For example, a loading state is displayed when generative AI is generating a response based on the user prompt. Find more guidelines in [generative AI loading states](/patterns/genai/genai-loading-states/index.html.md)  .

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

#### Loading state

- Follow the guidelines for [generative AI loading states.](/patterns/genai/genai-loading-states/index.html.md)

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- Use a [live region component](/components/live-region/index.html.md)   to announce avatar's loading state changes.
- When more than one avatar is used, provide a unique `ariaLabel`   for each. For example, "Avatar of John Doe" or "Avatar of generative AI assistant". If `tooltipText`   is used make sure to include it in the `ariaLabel`  .

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
