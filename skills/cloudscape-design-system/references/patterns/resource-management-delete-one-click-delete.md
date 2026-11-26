---
scraped_at: '2026-04-20T08:53:29+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/delete/one-click-delete/index.html.md
title: One-click delete
---

# One-click delete

With the one-click delete pattern, users can quickly delete low-risk, non-critical resources.

 [View demo](/examples/react/delete-one-click.html?awsui-visual-refresh=true)
## Key UX concepts

With one-click delete, users can quickly delete non-critical, easy to recreate resources. For example, the deletion of a row in [attribute editor](/components/attribute-editor/index.html.md) . Deletion is instantaneous and doesn't require additional feedback.

## Building blocks

A B C A B C
#### A. Remove button

Allow users to delete the element by adding a Remove** ** [button](/components/button/index.html.md).

#### B. Undo - optional

Allow users revoke the last performed deletion by adding an Undo [link](/components/link/index.html.md).

#### C. Add new button

Allow users to add new, removable elements on the page.

## General guidelines

### Do

- Use one-click delete when you need to quickly remove an element on the page you are editing, like row, input, or item.
- Use one-click delete when removing elements that can be recovered instantaneously.

### Don't

- Don't use one-click delete when removing resources in tables. Those resources require at least simple confirmation to be provided by the user.
- Don't use one-click delete when removing resources that can't be recreated instantaneously.

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

## Related patterns

### Delete patterns

With delete patterns, users can delete existing resources.

[View Documentation](/patterns/resource-management/delete/index.html.md)

### Delete with simple confirmation

Provide a layer of confirmation before deleting resources that cannot be easily recreated.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/delete-with-simple-confirmation)

[View Documentation](/patterns/resource-management/delete/delete-with-simple-confirmation/index.html.md)

### Delete with additional confirmation

The delete with additional confirmation pattern helps prevent users from performing accidental, high-severity deletions by adding friction during the deletion process.---

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/delete-with-additional-confirmation)

[View Documentation](/patterns/resource-management/delete/delete-with-additional-confirmation/index.html.md)
