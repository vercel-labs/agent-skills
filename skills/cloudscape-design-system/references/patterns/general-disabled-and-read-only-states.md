---
scraped_at: '2026-04-20T08:52:13+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/disabled-and-read-only-states/index.html.md
title: Disabled and read-only states
---

# Disabled and read-only states

Use disabled and read-only states to indicate non-interactive elements when users are not permitted to interact with or modify them.

## Key UX concepts

### Disabled state

Disabled state is used when users cannot interact with an element and to prevent users from attempting actions that could lead to errors or undesired outcomes. Use a disabled state when a user needs to complete an action or process to enable the element. For example, disable a delete button when no resource has been selected.

#### Disabled multiselect

Name Choose options
#### Disabled button

Button
### Read-only state

Read only state is used to view data, content, or documents without the ability to edit or modify them. Use a read-only state when the content is not to be modified by the user but they still need to view it. For example, in a form when the users do not have permissions to change a value but they still need to be aware of what is being submitted.

#### Read-only radio group

First choice This is the first option Second choice This is the second option Third choice This is the third option
#### Read-only input

Name
## Communicate disabled reasons

When an element is disabled, you can add a disabled reason if needed. This will help to reduce confusion as to why the feature is disabled and provide details on how to enable it. For example, inform the user that the action is not supported due to lack of permission.

- You can use tooltip to communicate a short in-context disabled reason in:  

  - primary, normal and icon [button](/components/button/index.html.md)     / [button dropdown](/components/button-dropdown/index.html.md)
  - [button dropdown](/components/button-dropdown/index.html.md)     item
  - [select](/components/select/index.html.md)     / [multiselect](/components/multiselect/index.html.md)     item
  - [tabs](/components/tabs/index.html.md)     item
  - [segmented control](/components/segmented-control/index.html.md)     item
  - date in [calendar](/components/calendar/index.html.md)     / [date picker](/components/date-picker/index.html.md)     / [date range picker](/components/date-range-picker/index.html.md)    .
- You can use text description and/or [alert](/components/alert/index.html.md)   to communicate a long complex disabled reason.

#### Communicating disabled reason via tooltip in button dropdown

Actions
## General guidelines

### Do

- Use read-only controls in forms when you want to prevent users from modifying the value but need to include it in form submission.
- Use plain text instead of read-only controls when all of the content is in a review state, for example, on the [multipage create](/patterns/resource-management/create/multi-page-create/index.html.md)   review page.
- Use disabled reasons where adequate context is not provided through disabled button or label text.

### Don't

- Don't apply disabled state to a form submission button. Instead, follow the [validation](/patterns/general/errors/validation/index.html.md)   pattern.
- Don't show disabled items when they are redundant on the interface, and there is no way for users to enable it. Instead, you can hide the disabled items to simplify the interface.

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

#### Short in-context disabled reasons

- Use one sentence to describe what is disabled and the reason. If additional context would help the user solve for the disabled state, use a second sentence to explain next steps.
- The common reasons why elements are disabled include:  

  - **Permissions: **     In scenarios when lack of permission can be determined ahead of user interaction, for example, for region or shared resource permissions.    

    - Use the format: *This action is available in/for \[constraint\].*      

      - *For example: This action is available in the primary region.*
      - *For example: This action is available for resource owner.*
  - **Prerequisites: **     In scenarios including ongoing/pending progress, categories constraint, unmatched class.    

    - Use the format: *This action is available in \[future action\].*      

      - *For example: This action is available when changes have been made.*
      - *For example: This action is available when resources have been selected.*
      - *For example: This action is available when instance state is running.*
  - **Tech limitations: **     In scenarios including when there are technical limitations on the service side.    

    - Use the format: *This action is unavailable due to \[technical constraints\].*      

      - For example: *This action is unavailable due to network error.*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Related patterns

### In-context actions

Use in-context actions when there are actions tied to a singular element, resource or container.---

[View Documentation](/patterns/general/actions/incontext-actions/index.html.md)
