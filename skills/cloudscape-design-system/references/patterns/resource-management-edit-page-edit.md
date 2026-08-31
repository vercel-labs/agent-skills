---
scraped_at: '2026-04-20T08:53:45+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/edit/page-edit/index.html.md
title: Page edit
---

# Page edit

Use the page edit pattern when you want users to manage an item by editing its properties and configuration in bulk.

 [View demo](/examples/react/edit.html)
## Key UX concepts

### Primary configuration section

Be critical of the inputs you place in the primary section, and keep it as short as possible. Make resource editing as easy as possible - having a shorter form to complete both decreases the initial mental load and makes it faster for users to complete your form.

### Data symmetry

When building the edit page, offer the same type of flow used for the [resource creation](/patterns/resource-management/create/index.html.md) , a [single page](/patterns/resource-management/create/single-page-create/index.html.md) edit, or a [multipage](/patterns/resource-management/create/multi-page-create/index.html.md) edit. The order of the input fields displayed in the form should reflect the same order of the input field displayed in the create resource form.

### Validation

There are two types of validation, which are frequently used together:

 <a href="/components/form-field/?example=with-error"> **Form field**</a>** validation**
Most often used for *client-side * validation, which processes information and provides feedback, before* * the form is sent. This feedback is presented as [error text](/components/form-field/index.html.md) on individual form fields.

It's best used for validating specific values such as: missing required fields, incorrect formatting of values, and unacknowledged confirmation fields.

This type of validation can be invoked on the completion of each field or upon form submission or transition to the next step in a wizard.

**Page level ** <a href="/components/form/?example=with-errors"> **form**</a>** validation**
Most often used for *server-side * validation, which processes information after* * the form is submitted, and returns either a success or failure. This [feedback](/patterns/general/user-feedback/index.html.md) is presented in one of two ways: either as a page level [alert](/components/alert/index.html.md) above the form's action buttons (in the case of a recoverable failure), or a [flashbar](/components/flashbar/index.html.md) on the page following submission (in the case of success or immutable failure).

It's best used for validating requests to the server that result in recoverable errors such as: insufficient capacity, exceeded request limits, and permission errors that can be updated. Failure messages should be communicated in the context of the form when possible, to prevent the user from having to re-enter any information.

This type of validation is launched upon form submission or transition to the next step in a wizard.

[View Documentation](/patterns/general/errors/validation/index.html.md)

### No changes submitted

Users can exit the edit page via Save changes button even if no changes have been made. In this case, users are redirected to the page where the edit flow was initiated and an info [flashbar](/components/flashbar/index.html.md) provides feedback that no changes were submitted.

## Building blocks

A B C D E F G H I A B C D E F G H I
#### A. Breadcrumbs

Use the service name for the root page in the breadcrumbs, and make it a link. For the last entry in the breadcrumbs, use *Edit*.

#### B. Form page header

For the title of the page, use a heading 1.

#### C. Container

In most cases, use a single container for all the configuration inputs of a single resource. Consider using multiple containers if the choice is highly complex and would benefit from having its own section in the form layout. For example: Choosing a database type.

#### D. Primary form fields

Keep the primary configuration section as short as possible. Criteria for primary section inputs:

- Any required field that we can't provide a good default for. For example: password.
- Any field that 80% or more of users would expect to see, and want to know the value of in order to be successful. For example: Knowing the security group associated with the resource, even when we provide a good default.

#### E. Additional expandable section - optional

Place as many inputs as possible into the additional settings section for each resource card. This allows the user to keep the primary section as short as possible, so the user can focus on the most important tasks. The label of this section should align with its container's heading, and similarly, should be a noun describing its content, not an action.

#### F. Form action buttons

These allow the user to commit changes to the resource or to exit the edit flow. Place buttons below the resource cards.

#### G. Info link

Use the Info link next to a form field label or section header to open the help panel.

#### H. Help panel

Place supplemental, helpful information in the help panel. For more information about structuring help content and how users can open help panels, follow the guidelines for [help system](/patterns/general/help-system/index.html.md).

#### I. Side navigation

Navigation is closed by default on forms. For more information about structuring side navigation content, follow the guidelines for [side navigation](/patterns/general/service-navigation/side-navigation/index.html.md).

## Flow charts

## Edit resource Successful

## Edit Resource - Unsuccessful

## Edit Resource Validation

## General guidelines

### Do

- **Editing entire page: **   When clicking the edit button at the page level, show all editable resource cards for the entire resource in a single page view for simple to medium complex configurations or multi-page view for long or complex configurations.
- **Editing single container: **   When clicking the edit button in a container, show only a single editable resource in a modal view. The single editable resource should match the resource container.
- **No changes submitted:**   When clicking the save changes button, redirect users to the page where the edit flow was initiated, and display an info alert communicating that no changes have been made.

### Don't

- Don't mix edit and create actions in one view, respect the user mental model and goal by offering a standalone creation or editing flow.
- Don't disable the primary button, even if the user has not completed the required inputs. Perform [field validation](/patterns/general/errors/validation/index.html.md)   instead.

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

#### Form page title

- Use the format: *Edit \[resource name\]*  

  - For example:* Edit KJ3829HD9*     or *Edit distribution*

#### Container headings

- Use the same resource card header titles from the [create flow](/patterns/resource-management/create/single-page-create/index.html.md)  .

#### Additional expandable sections

- Follow the writing guidelines for [create flow](/patterns/resource-management/create/single-page-create/index.html.md)  .

#### Container descriptions

- Follow the writing guidelines for [headers](/components/header/index.html.md)  .

#### Form

- Follow the general writing guidelines for [forms](/components/form/index.html.md)  .

#### Placeholders in fields

- Follow the writing guidelines for placeholders in [inputs](/components/input/index.html.md)  .

#### Defaults in fields

- Follow the writing guidelines for [select](/components/select/index.html.md)  .

#### Constraint text

- Follow the writing guidelines for [form fields](/components/form-field/index.html.md)  .

#### Buttons

- The button that allows the user to submit the form should use the format: *Save \[object\]*
- Follow the writing guidelines for [buttons](/components/button/index.html.md)   and [form](/components/form/index.html.md)   actions.

#### Flashbar

- For success and error messages, follow the guidelines for [flashbar](/components/flashbar/index.html.md)  .
- When no changes are submitted use an info flashbar and use the format: *No changes were made to \[object\]. *  

  - For example: *No changes were made to t1.macro.*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- Make navigation links, form inputs, and buttons keyboard accessible, in a logical order.

## Related patterns

### View resources

With the view resources patterns, users can find and take action on a collection of resources in the most efficient way possible.

[View Documentation](/patterns/resource-management/view/index.html.md)

### Resource details

On a resource details page, users can view the details of a resource and, when relevant, any related resources.---

[View Documentation](/patterns/resource-management/details/index.html.md)
