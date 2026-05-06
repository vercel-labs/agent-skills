---
scraped_at: '2026-04-20T08:53:37+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/details/index.html.md
title: Resource details
---

# Resource details

On a resource details page, users can view the details of a resource and, when relevant, any related resources.

## Patterns

While your service could include a [split view](/patterns/resource-management/view/split-view/index.html.md) which provides users with a subset of resource details, a dedicated resource details page allows users to view the details of a resource on a single page and perform actions on that resource.

### Details page with tabs

Users can use tabs to view the configuration details of a single resource on a single page. Users can choose each tab on the page to easily switch between different groupings of information in the same view.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/details-tabs)

[View Documentation](/patterns/resource-management/details/details-page-with-tabs/index.html.md)

### Details page as a hub

With the  details page as a hub pattern, users can view the details about a resource and a preview of related resources. Use the hub for resources that have large and complex data sets.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/details-hub)

[View Documentation](/patterns/resource-management/details/details-page-as-hub/index.html.md)

## Flow chart

## Criteria

|  | Details page | Details page with tabs | Details page as a hub |
| --- | --- | --- | --- |
| User tasks | One main task | Multiple tasks on a resource | Multiple tasks on a resource and related resources |
| Content structure | Everything at a glance | Contextual | Contextual |
| Navigation | Does not serve as navigation | Does not serve as navigation | Serves as navigation |

### User tasks

Users can perform tasks that directly affect a resource (for example: Edit or Delete the resource) or tasks that also affects a related resource.

- Use **tabs **   to structure the information into independent, actionable groups.
- Use a **container **   with a link to navigate users to related resources.

### Content structure

Details pages should always contain the details of a resource. If possible, display all information at once on a details page, so that everything is accessible by the user.

- **Details page with tabs **   displays details of a single resource on a single page, grouping information by task.
- **Details page as a hub **   displays details of a resource and a preview of related resources on a single page. Provide links to view the full resource collection for each related resource.

### Navigation

The details page (with or without tabs) is always self-contained and keeps the user focused in one place.

Use **details page as a hub** if users need to navigate to one or more [view resources](/patterns/resource-management/view/index.html.md) pages.
