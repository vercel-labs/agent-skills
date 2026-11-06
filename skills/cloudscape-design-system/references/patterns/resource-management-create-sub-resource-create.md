---
scraped_at: '2026-04-20T08:53:20+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/create/sub-resource-create/index.html.md
title: Sub-resource create
---

# Sub-resource create

Enables users to create new sub-resources within a single or multipage create.

 [Form validation demo](/examples/react/form-validation.html)
## Key UX concepts

### Sub-resource as a dependency or enhancement

Sub-resources are either dependencies or optional enhancements used to complete a parent resource creation. For example adding roles, policies, or security groups to an instance. These can be selected from existing options or created and then added. Sub-resources may be owned by the same service or require cross-service creation.

### Prevent accidental data loss

Leverage the [communicating unsaved changes](/patterns/general/unsaved-changes/index.html.md) pattern to safeguard users from accidental data loss. This ensures users are informed before discarding changes. For example:

- W   hen canceling or submitting a create page when a sub-resource creation is in progress.
- Navigating between steps in a multi-page create flow while a split panel has unsaved changes.
- C   losing/canceling a split panel if the user has made updates, or the user opens a new sub-create.

## Types of sub-resource creation

There are three types of sub-resource creation:

- **Embedded: **   This is a set of inputs within the page. Use an embedded sub-resource creation for simplicity and efficiency when minimal configuration is required, and users benefit from predefined configurations. This offers a single workflow by submitting the sub-resources along with all other inputs on full page submission. For example, creating a pre-configured IAM role.
- **Split panel: **   This is accessed via an action in the page that opens a split panel. Use for more complex configurations. The split panel provides independent page and form level validation, and error resolution before submission. It supports multitasking by allowing users to reference or interact with the main workflow while isolating the creation process. For example, creating a cache policy when   setting up a CloudFront distribution  .
- **New tab: **   This is accessed via an action in the page that opens a separate tab. Use a new tab for resource creation as a fallback option when the process is too complex to be embedded or handled within a split panel.

Adapt sub-resource creation flows to align with service ownership and technical constraints:

- **Same service sub creates: **   Integrate these directly within the page when possible for seamless interaction using embedded fields within the main page or the split panel.
- **Cross-service creates: **   Integrate these directly within the page when possible using embedded fields or the split panel, using reusable widgets or cross service APIs when available.

## Building blocks

## Embedded

A B C A B C
#### A. Options to select a resource or create a new reosurce

Group of [radios](/components/radio-group/index.html.md) or [tiles](/components/tiles/index.html.md) that when selected show:

- Either select with a list of available resource.
- Or a group of form fields for the user to create a resource.

#### B. Form

Use pre-filled defaults where possible when the user is creating a new resource.

#### C. Link - optional

An external link to a full page create for users who require more control.

## Split panel

A B C D E F G H A B C D E F G H
#### A. Select existing resource

A [select](/components/select/index.html.md) with a list of the available resources.

#### B. Normal button

Opens a split panel allowing the user to create a new resource. For example: Create a cache policy

#### C. Refresh select input

Use a [normal icon button](/components/button/index.html.md) to allow for refreshing of the select to show the newly created resource.

#### D. Split panel

Use a discreet split panel to feature the create resource form.

#### E. External link - optional

An external link to a full page create in a new tab for users who require more control.

#### F. Form fields

Use pre-filled defaults where possible.

#### G. Validation

Ensures user inputs are accurate and complete by providing inline validation as users fill out and submit the form.

#### H. Actions

Use a [normal button](/components/button/index.html.md) to submit the form.

## New tab

A B C A B C
#### A. Select

Allow users to select an existing resource.

#### B. External link button

A link button that opens the create resource in a new tab.

#### C. Icon button

Use a normal icon button to allow for refreshing of the select to show the newly created resource.

## Criteria

|  | Embedded | Split Panel | New tab |
| --- | --- | --- | --- |
| Task complexity | Simple pre-configured tasks with minimal options, and less chance of errors. | More complex tasks with the potential for errors and requiring detailed configuration. | Use for highly complex tasks such as creations that involve sub-resources, multi-step, or have their own dependencies. |
| User focus | Keeps the user within the main workflow, minimizing disruption. | Provides a dedicated space for task completion while keeping the main workflow in view. Enable users to reference or interact with the main task as they complete the process. | Shifts focus away from the main workflow, requiring a context switch to complete the task. |
| Feedback and validation | Validate and full page feedback submited together with the rest of the inputs on the main page. | Independent validation and full page feedback invoked on submission of the split panel. | Supports independent validation for sub-resource creation, but separates it on a new tab. |

### Task complexity

Refers to the overall complexity of the resource creation process and the likelihood of user error. Simpler tasks with minimal inputs and lower error risks are better suited for embedded creation, while more intricate processes with higher error potential, or extensive configuration, benefit from the independent page level feedback of a side panel.

### User focus

Indicates how well the creation method keeps users focused on their main workflow. Embedded creation maintains focus within the page, while a side panel provides space for independent tasks or a new tab switches context entirely to complete.

### Feedback requirements

Embedded creation uses inline validation, while side panels and new tabs provide independent validation and separate page level validation.

## Split panel flow charts

## Successful

1. Close the panel after a successful submission.
2. Display a success flashbar if the resource is successfully created.
3. Update the select input to include the newly created resource.

## Unsuccessful

1. Close the panel after submission.
2. Display a error flashbar for immutable errors returned from the API after a submission. Refer to [validation](/patterns/general/errors/validation/index.html.md) [error message](/patterns/general/errors/error-messages/index.html.md)  .

## With Validation

1. Validate inputs for recoverable errors upon form submission. Refer to the [validation guidelines](/patterns/general/errors/validation/index.html.md)  .
2. Keep the panel open to allow users to fix errors, retry or cancel.

## General guidelines

### Do

- Only include essential fields to minimize complexity in embedded or split panel creates.
- Use pre-configured options when possible to simplify the creation process for users.
- Use [page level validation](/patterns/general/errors/validation/index.html.md)   . For example, show a success flashbar when a resource is created.
- Provide [field validation](/patterns/general/errors/validation/index.html.md)   within the split panel when a user fills in or submits the form.
- Use a [normal button](/components/button/index.html.md)   to trigger the side panel, or a link button with external icon when taking the user to a new tab.
- When a new resource is created using a split panel or new tab, when possible populate the related resource selection input with the new resource.
- Communicate [unsaved changes](/patterns/general/unsaved-changes/index.html.md)   when canceling or submitting a parent flow if there is a sub-create processing, and when closing the split panel when the user has entered content.
- Use the discreet split panel variant of the split panel.
- Include a link to the full-page creation flow in the sub-create description as a fallback.

### Don't

- Don't use multi page create in a split panel.
- Don't use split panels or embedded sub-resource creation for sub-resources that have additional dependencies. Instead open this in a new tab.
- Don't use a modal for sub-resource creation instead use embedded or a split panel. This offers access to help, is non-blocking and provides a consistent expectation for the create action.

## Writing guidelines

Follow the writing guidelines for [buttons](/components/button/index.html.md).
Follow the writing guidelines for [validation.](/patterns/general/errors/validation/index.html.md)

## Accessibility guidelines

#### Split panel

- Ensure that split panel receives the focus when it's opened.
- Ensure that trigger button that opens the split panel receives the focus when split panel is closed.
