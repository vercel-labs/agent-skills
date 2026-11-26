---
scraped_at: '2026-04-20T08:53:31+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/details/details-page-as-hub/index.html.md
title: Details page as a hub
---

# Details page as a hub

With the  details page as a hub pattern, users can view the details about a resource and a preview of related resources. Use the hub for resources that have large and complex data sets.

 [View demo](/examples/react/details-hub.html)
## Building blocks

A B C D E F G H A B C D E F G H
#### A. Breadcrumbs

Follow the guidelines for the [details page](/patterns/resource-management/details/details-page-as-hub/index.html.md).

#### B. Page title

Follow the guidelines for the [details page](/patterns/resource-management/details/details-page/index.html.md).

#### C. Global buttons

Follow the guidelines for the [details page](/patterns/resource-management/details/details-page/index.html.md).

#### D. Details summary container

Follow the guidelines for the [details page](/patterns/resource-management/details/details-page/index.html.md).

#### E. Container

Use containers to preview a set of related data. For each container, we recommend that you show only the first five items from the full list of related resources.

For example, you could group the following types of content into containers: errors, cache behaviors, security groups, logs, billing summary, or more than three graphs or charts.

#### F. View all resources link

In the footer of each container, include a link with the following text: *View all \[resource type\]*

For example: *View all logs*

Users can choose this link to navigate to a new page to view the full set of related resources. Use the [primary link](/components/link/index.html.md) component.

#### G. In-context buttons

Use when users can perform actions on the related resources in the container.

For example:* * Edit *, * Delete *, * and* * Create.

#### H. Side navigation

Follow the guidelines for the [details page](/patterns/resource-management/details/details-page/index.html.md).

## General guidelines

### Do

- Use containers to provide a functional preview of the first five items from the related resources page.
- Use details as a hub to display the relation and dependencies of resources, while allowing users to navigate to the full set of resources.
- When using this pattern, adapt the breadcrumbs on the [view resources](/patterns/resource-management/view/index.html.md)   page to reflect the complete path.

### Don't

- Although the resources displayed in the container are just a subset, allow your users to take action on them. Containers should be fully interactive.

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

#### General, buttons, and containers

- Follow the guidelines for the [details page](/patterns/resource-management/details/details-page/index.html.md)  .

#### Breadcrumbs

- Follow the guidelines for the [details page](/patterns/resource-management/details/details-page/index.html.md)  .
- For the related view resources page, use the format: *\[Service name\] > \[Resources type\] > \[Resource name/ID\] > \[Related resources\].*  

  - For example:* Cloudscape example service > Instances > SLCCSMWOHOFUY0 > Logs*

#### View resources link

- Follow the writing guidelines for [links](/components/link/index.html.md)  .
- Don't use terminal punctuation.
- Use the format: *View all \[resource type\]*  

  - For example: *View all logs*

## Related patterns

### Resource details

On a resource details page, users can view the details of a resource and, when relevant, any related resources.

[View Documentation](/patterns/resource-management/details/index.html.md)

### Details page with tabs

Users can use tabs to view the configuration details of a single resource on a single page. Users can choose each tab on the page to easily switch between different groupings of information in the same view.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/details-tabs)

[View Documentation](/patterns/resource-management/details/details-page-with-tabs/index.html.md)

### Container

With the container, you can present a group of pieces of content, indicating that the items are related. For example, a table is a type of container.---

[View Documentation](/components/container/index.html.md)
