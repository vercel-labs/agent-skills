---
scraped_at: '2026-04-20T08:53:14+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/create/index.html.md
title: Create resource
---

# Create resource

With the create new resource pattern, users can create new resources.

## Create resource patterns and components

Users can create resources from multiple entry points. If it's the user's first time, or a recurrent creation, we provide four solutions.

### Single page create

Use single page create if you want your users to create a resource on a single page. This component is optimized for simple to medium-complex forms.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/form)

[View Documentation](/patterns/resource-management/create/single-page-create/index.html.md)

### Multipage create

Use the multipage create, which employs the wizard component, when you want users to create resources by completing a set of interrelated tasks. We recommend multipage create for long or complex configurations.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/wizard)

[View Documentation](/patterns/resource-management/create/multi-page-create/index.html.md)

### Modal

A user interface element subordinate to an application's main window. It prevents interaction with the main page content, but keeps it visible with the modal as a child window in front of it.

[View Documentation](/components/modal/index.html.md)

## Sub-resource create patterns

### Sub-resource create

Enables users to create new sub-resources within a single or multipage create.

[View Documentation](/patterns/resource-management/create/sub-resource-create/index.html.md)

## Flow charts

## Successful

## Unsuccessful

## With validation

## Criteria

|  | Modal | Single page create | Multipage create |
| --- | --- | --- | --- |
| Length | = 1 field | Between 2 and 15 fields in the primary section or up to 5 groups of settings | More than 16 fields in primary sections or more than 5 groups of settings |
| Complexity | Basic text input fields and simple selects | Flow does not require any category to have its own page | Concepts require in-depth interactions that benefit from having their own page |
| Recovery | Input is mutable after creation | Input mutable after creation | Input immutable after creation |
| Error handling | In trigger page | In creation page | In every single step and in summary step |
| Frequency | n/a | Frequent | Infrequent |
| Sub-resource create | No | Yes | Yes |

### Length

Deciding how many fields are in the primary section:

- Any required field that we can't provide a good default for (for example, a password).
- Any field that 80% or more users would expect to see and want to know the value of in order to be successful (for example, knowing the security group associated with the resource, even when we provide a good default).
- All other fields go into the additional configuration section with appropriate defaults.

Some flows have variables that are based on what the user chose in a previous step. The total number of fields should be considered for the longest possible variation of your form.

### Complexity

Complexity refers to the types of interactions in your flow. In some cases, interactions are complex enough that having their own page will make it easier for users to complete and make better decisions.

### Recovery

For configurations that allow or disallow a correction or modification without creating a new one.

### Error handling

Where in the flow errors can be caught, so the user can modify them in context.

### Frequency

Only use frequency as a criterion if you're unsure which pattern to use.

### Sub-resource create

Sub-resources are either dependencies or optional enhancements used to complete the parent resource creation. For example, adding roles, policies, or security groups to an EC2 instance. These can be selected from existing options or, created and then added. Sub-resources may be owned by the same service or require cross-service creation. Follow the guidelines for [sub-resource create](/patterns/resource-management/create/sub-resource-create/index.html.md).
