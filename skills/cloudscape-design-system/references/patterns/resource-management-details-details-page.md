---
scraped_at: '2026-04-20T08:53:35+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/details/details-page/index.html.md
title: Details page
---

# Details page

On a details page, users can view at a glance all the available information about a single resource.

 [View demo](/examples/react/details.html)
## Building blocks

A B C D E F G A B C D G
#### A. Breadcrumbs

Use the following breadcrumb structure: *\[Service name\] > \[Resources type\] > \[Resource name/ID\]*

For example: *CloudFront > Distributions > SLCCSMWOHOFUY0*

#### B. Page title

Use the resource name or ID as the title. It should match the last breadcrumb exactly.

#### C. Header or global buttons

Use when the actions will affect the entire resource.

For example:* * Edit or* * Delete

#### D. Details summary container

Place the most relevant information about the resource in this container. To organize content, use [key-value pairs](/components/key-value-pairs/index.html.md).

#### E. Related resources container - optional

Use when showing related sections that don't require navigating to a different page.

#### F. In-context buttons - optional

Use when the user can perform actions on the respective container's content.

#### G. Side navigation

Navigation is open by default on details pages. For more information about structuring side navigation content, follow the guidelines for [side navigation](/patterns/general/service-navigation/side-navigation/index.html.md).

## General guidelines

### Do

- Use containers to group your content into meaningful sections. Reflect the [creation flow](/patterns/resource-management/create/index.html.md)   in your information grouping.

### Don't

- Don't compromise on the discoverability of your content. Use simple details pages to display self-contained information about the resource.
- Don't use containers for very long resource lists (more than 10 items). Instead, use a [details page as a hub](/patterns/resource-management/details/details-page-as-hub/index.html.md)   pattern.

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

#### Breadcrumbs

- Follow the writing guidelines for [breadcrumbs](/components/breadcrumb-group/index.html.md)  .
- Don't include *details*   in the breadcrumb title.

#### Buttons

- Follow the writing guidelines for [button](/components/button/index.html.md)  .

#### Container

- Follow the writing guidelines for [containers](/components/container/index.html.md)  .
- For the details summary container, use this text:  

  - *General configuration *
  - *\[* *Resource type\] settings*

## Related patterns

### Resource details

On a resource details page, users can view the details of a resource and, when relevant, any related resources.

[View Documentation](/patterns/resource-management/details/index.html.md)

### Details page as a hub

With the  details page as a hub pattern, users can view the details about a resource and a preview of related resources. Use the hub for resources that have large and complex data sets.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/details-hub)

[View Documentation](/patterns/resource-management/details/details-page-as-hub/index.html.md)

### Details page with tabs

Users can use tabs to view the configuration details of a single resource on a single page. Users can choose each tab on the page to easily switch between different groupings of information in the same view.---

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/details-tabs)

[View Documentation](/patterns/resource-management/details/details-page-with-tabs/index.html.md)
