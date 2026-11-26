---
scraped_at: '2026-04-20T08:51:59+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/actions/index.html.md
title: Actions
---

# Actions

Ways to invoke actions in the interface.

## Patterns

### Global actions

Use global actions when there's a single set of actions, or bulk actions, to be taken against any or all resources in a given view or page.

[View Documentation](/patterns/general/actions/global-actions/index.html.md)

### In-context actions

Use in-context actions when there are actions tied to a singular element, resource or container.

[View Documentation](/patterns/general/actions/incontext-actions/index.html.md)

## Key UX concepts

**Global actions**
Global actions are performed on one or multiple resources.  For example, upon selection of an item in a table, at page level in a detail view page, or selecting multiple resources in a table to complete a bulk action.

**In-context actions**
In-context actions are performed on only one resource. For example, actions related to specific data in a container, such as *Edit* . They should be placed contextually to the item they relate to, as this helps speed up task completion for commonly used actions.

**Pairing global and in-context actions**
To provide a consistent experience across collection views we recommend to pair global and in-context actions. All available actions should always be featured globally, and commonly used actions can be provided in-context to speed up task completion.

For example, in a table view users can download an item by selecting the item and using the related download action in the table header, or via an in-context download action at row level.

## Criteria

|  | Global actions | In-context actions |
| --- | --- | --- |
| Placement | Placed in the header of the page or component. | Placed in context of a singular item in a container, table row, or card. |
| User goal | Perform actions related to one or multiple resources. | Perform actions related to one resource. |
| Bulk actions | Use for bulk actions. | Do not use for bulk actions. |
| Common use cases | Tables, cards, resource, and collection views. | Dashboard items, containers, table rows, and cards. |

### Placement

- **Global actions: **   Place in the page header, or as part of the full page [table](/components/table/index.html.md)   or [cards](/components/cards/index.html.md)   header. For example: A primary action in the table header to create a new resource.
- **In-context:**   Place near the item they relate to. For example: An action in a table row to edit a singular resource.

Global and in-context actions can be combined. For example, users can stop a singular instance in a table by using an in-context action, or selecting multiple instances to stop selected instances from a global action.

### User goal

- **Global actions:**   For actions that can be completed on item selection, bulk actions, singular actions, or page level actions like creating or editing a page.
- **In-context actions:**   Use to speed up task completion for singular, common, and repetitive tasks such as downloading an object or stopping an instance.

### Bulk actions

If an action can be triggered on multiple resources in bulk, it should be listed as a global action to avoid users having to trigger the action multiple times for each resource.

### Common uses

Due to the fact that tables, cards, and other types of collection views often show the same list of resources with a consistent set of actions that can be carried out upon them, global actions are commonly used in these contexts and can be paired with in-context actions.
