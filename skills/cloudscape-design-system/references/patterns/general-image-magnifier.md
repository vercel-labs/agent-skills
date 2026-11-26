---
scraped_at: '2026-04-20T08:52:36+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/image-magnifier/index.html.md
title: Image magnifier
---

# Image magnifier

Enable users to enlarge an image to view additional details.

 [Get design library](/get-started/for-designers/design-resources/index.html.md)
## Building blocks

A B C D E
#### A. Image preview

An image, that can be placed within a container as a standalone element, or with additional content.

An image can be enlarged by using the expand button, or via the image itself. When hovering over an image, switch the cursor to a clickable pointer to indicate that the image is interactive.

#### B. Expand button

Allows users to expand the image to its full size. Place the button on the bottom left corner of the image as a visual cue to indicate the feature.

#### C. Modal

Use a modal to display the full image. Use the `max` size variant so it fits the largest size of the viewport.

#### D. Modal title

Use the image title as the modal title. For example: *How it works diagram*

#### E. Other actions - optional

Allow users to use other functionalities. For example, download the image.

## General guidelines

### Do

- Use image magnifier for complex images where the available space on the page does not allow for users to see the full details of the image.
- Always include both dismiss and close buttons in a [modal](/components/modal/index.html.md)  .

### Don't

- Don't use image magnifier for simple images, such as icons or illustrations.
- Don't stretch or distort the image when displaying it in the [modal](/components/modal/index.html.md)  .

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

#### Modal

- Follow the guidelines for [modal](/components/modal/index.html.md)  .

#### Button

- For the dismiss button, use this text: *Close*
- Follow the guidelines for [button](/components/button/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Modal

- Follow the accessibility guidelines for [modal](/components/modal/index.html.md)  .

#### Button

- Follow the accessibility guidelines for [button](/components/button/index.html.md)  .
