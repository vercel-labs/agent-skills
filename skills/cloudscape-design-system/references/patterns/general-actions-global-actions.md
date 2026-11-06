---
scraped_at: '2026-04-20T08:51:54+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/actions/global-actions/index.html.md
title: Global actions
---

# Global actions

Use global actions when there's a single set of actions, or bulk actions, to be taken against any or all resources in a given view or page.

## Key UX concepts

Global actions are performed on one or multiple resources. For example, upon selection of an item in a table, at page level in a detail view page, or the selection of multiple resources, such as upon bulk selection of several items in a table.

**Page header with actions**

### Page header with actions demo

# Page title

Actions
Create duplicate Create resource **Card header with actions**

## Cards title (1/2)

Actions
Create duplicate Create resource
1. Item 1   Description   This is the first item   Type   1A   Size   Small
2. Item 2   Description   This is the second item   Type   1B   Size   Large

**Table header with actions**

## Table title (1/2)

Actions
Create duplicate Create resource 

| Variable name | Text value | Type | Description |
| --- | --- | --- | --- |
|  | First | 1A | This is the first item |
|  | Second | 1B | This is the second item | **Global action locations**

Place global actions in the action stripe of the [header](/components/header/index.html.md) component at the top of the page, or as part of the [table](/components/table/index.html.md) or [cards](/components/cards/index.html.md) header. Add actions as [buttons](/components/button/index.html.md) or [button dropdowns](/components/button-dropdown/index.html.md) if users can perform actions on the underlying content.

**Order of actions**

The order of buttons is important when action is required on a data set. It follows the order of major resource management actions.

- Place buttons in this order: *View details, Edit, Delete, Create \[resourcename\]*
- Add other action buttons between the *Edit*   and *Delete*   buttons.
- Add other *Create*   buttons between the primary *Create*   button and the *Delete*   button.
- Place status actions at the far left in the action stripe.  

  - For example: *Deactivate, Activate, Status 3, View details, Edit, Delete, Create \[resourcename\]*

**Number of actions**

- For less than five actions, use individual buttons.
- For more than five actions, use a button dropdown to collapse non-primary actions.

On mobile viewports with more than one non-primary action, consider moving these actions into a button dropdown to conserve space. Follow the guidelines for [responsive design](/foundation/core-principles/responsive-design/index.html.md).

**Sticky header - ** **optional**

If users need to take an action on resources upon selection, consider using a sticky header in your table or card collection to house your global actions.

**Disabled reasons in button dropdown - ** **optional**

For extra clarity, provide a tooltip with inactive actions that explains why the action is unavailable. These tooltip explanations should be as short as possible, with longer descriptions belong outside the dropdown component.

This feature should be used scarcely because it adds additional information to the interface. Use the tooltip only if the reason an action is inactive is unclear, and there are no other suitable approaches to guide users.

## General guidelines

### Do

- Use only one primary button per page. Primary buttons are like [The Highlander](https://en.wikipedia.org/wiki/Highlander_(film))   , there can be only one.
- Actions that do not relate to one resource should be placed in the page header, or as part of the [table](/components/table/index.html.md)   or [cards](/components/cards/index.html.md)   header.  For example: A primary action in the table header to create a new resource.
- Use buttons for actions.
- Use a button dropdown to present 5-15 contextual actions that users can choose from to initiate one action.

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

#### Button

- For labels of button dropdown, indicate the purpose of the actions set.
- Use an action verb.  

  - For example:    

    - *Rerun*
    - *Edit*
    - *Delete*
- Don't use terminal punctuation (period, exclamation point, question mark, colon) in button labels.
- Follow the writing guidelines for [button](/components/button/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Provide alternative text with the ariaLabel property if there is no button text or if you are conveying additional information through means other than text.  

  - For example, buttons without text, buttons with meaningful icons, or buttons conveying additional information with color.

#### Keyboard interaction

- By default, the tab key focuses the component.
- The enter key performs the action.

## Related patterns

### Actions

Ways to invoke actions in the interface.

[View Documentation](/patterns/general/actions/index.html.md)

### In-context actions

Use in-context actions when there are actions tied to a singular element, resource or container.---

[View Documentation](/patterns/general/actions/incontext-actions/index.html.md)
