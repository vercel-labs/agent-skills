---
scraped_at: '2026-04-20T08:53:52+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/view/split-view/index.html.md
title: Split view
---

# Split view

A collection of resources presented as table or cards and paired with a [split panel](/components/split-panel/index.html.md) for contextual resource details. It's effective for quickly browsing or comparing key resource details.

 [View demo](/examples/react/split-panel-multiple.html)
## Objectives

The split view is an extension of the [table view](/patterns/resource-management/view/table-view/index.html.md) or [card view](/patterns/resource-management/view/card-view/index.html.md) . It adds a collapsible panel for displaying additional resource details. It's effective when users need to quickly view or compare resource details of multiple resources within their workflow.

The split view serves three primary objectives:

- **Resource identification: **   Users need to quickly view key details to identify resources within a group of similar resources. The key details needed in this scenario are often a list of sub-resources or additional attributes which can't be displayed in the table or cards view, but are critical to identify a specific resource.
- **Monitoring: **   Users need to quickly check details like status or metrics, to monitor the health of a group of resources.
- **Troubleshooting: **   Users need to quickly check or compare relevant resource details to troubleshoot an issue.

A split view is a page layout used to view resources and browse key details. It's split into two main parts: the main page area, and the actual split panel with resource details.

## Building blocks

A split view is a page layout used to view resources and browse key details, which is 'split' into two main parts: the main page area, and the actual split panel with resource details.

A B C D E A B C D E
### Main page area

Use the main page area to display the collection of resources following the guidelines of [table view](/patterns/resource-management/view/table-view/index.html.md) or [card view](/patterns/resource-management/view/card-view/index.html.md) . The main page area contains these building blocks:

#### A. Flash message

Use a flash message to notify the user about the progress and outcome (success or failure) of the actions taken upon the resources.

#### B. Breadcrumbs

Use the service name for the root page in the breadcrumbs, and make it a link. Follow it with the page title, which is usually the category name of the service items (For example: *Resources, Distributions, Instances* ).

#### C. Resource collection

Use [table](/components/table/index.html.md) or [cards](/components/cards/index.html.md) component to display resource collection.

### Split panel

#### D. Split panel

The split panel presents additional information about the selected resources. By default, it's closed on page load and opens automatically on resource selection. Use the split panel component to implement this pattern.

#### E. Details of the selected resources

Display relevant details for the selected resources based on the user's objectives.

[View Documentation](/components/split-panel/index.html.md)

## Use-case examples

When structuring content in the split panel, start from the user needs and choose the appropriate representation based on the use case. Present users with meaningful content that fits into their browsing, monitoring, or troubleshooting workflow.

Make sure you consider how the content is displayed when the users select single or multiple resources, because the resources might have different structures or serve different objectives. Below are some examples of content and the corresponding use cases.

### Use-case \#1: A table of sub-resources for resource identification

Users need to view the sub-resources to identify a resource from a group of similar ones. Use a table to represent the sub-resources.

### Use-case \#2: An overview of selected resources for high-level insights

When users perform multi-selection, the split panel should present meaningful aggregated details. A typical example is an overview of the selected resources which summarizes key data points for users. This could include the status or state of the resources.

### Use-case \#3: An attribute comparison table for comparing resources

Users performing troubleshooting often need to scan attributes for similarities and differences to inform them about the next steps. To help with this comparison, use a table to represent attributes of multiple resources. For an example, see the [split view with details comparison demo](/examples/react/split-panel-comparison.html).

Follow these best practices to design a comparison table:

- Use the selected resource ID as column headers, and the attributes to compare as the row labels.
- To keep it concise, include only attributes relevant for comparison.
- Help users narrow down the resources they're comparing by [filtering](/patterns/general/filter-patterns/index.html.md)   the resource collection. We recommend users compare five or fewer resources at a time (see [Nielsen Norman Group guideline](https://www.nngroup.com/articles/comparison-tables/)   ), but don't block users from selecting more than five resources.
- Display the resources from left to right following the order of selection. When a resource is deselected, remove its information from the split panel.

### Use-case \#4: Metrics for quick monitoring

Users need to view the metrics of a single resource or compare metrics across multiple resources and quickly parse specific highlighted values or trends to achieve fast monitoring. Show a group of key metrics represented as charts when users select a resource, and the combined data for these metrics when users select multiple resources. Make sure to follow the guidelines for [data visualization](/patterns/general/data-vis/index.html.md).

## Split panel layout

### Split panel position

There are two positions of the panel: bottom and side. Choose the default position that best accommodates your content.

- #### Bottom

  The bottom position is best when:  

  - Users frequently need to view more than 5 columns in the resources table. A bottom position leaves more screen real estate to the resource table.
  - Users need to perform monitoring or comparing within the details panel. A bottom position provides more horizontal space for content like an attribute comparison table.
- #### Side

  The side position is best when:  

  - The resource table on the page typically has 5 or fewer important columns.
  - The details in the details panel are a small set of content for users to browse.

We strongly recommend implementing both positions and allow users to change the default position with the panel preferences to better fit their needs. The panel preferences modal is triggered by the preference icon button in the details panel.

### Split panel states

The split panel is closed on page load by default and opens automatically on resource selection. Users can use the **angle-down** icon button to collapse the panel. Once users close the details panel, it stays closed even if they change the resource selection. This allows users to focus on the the resource collection.

## Key UX concepts

### Split view is not a replacement of details page

Always use [details pages](/patterns/resource-management/details/index.html.md) to display full resource details of a single resource. A split view should never replace details pages in the service information architecture. The details on a split view and on a details page serve different objectives. The details or aggregated details on a split view assist users with identifying the next steps in their workflow of resource finding and browsing, monitoring, and troubleshooting by providing in-context information of the selected resources. Whereas on a details page, users primarily view and analyze the details of a single resource.

### Split view is for inspecting the selected resources

The content in the split panel should always reflect the selected resources.

- When a resource is deselected, remove its details from the split panel.
- When nothing is selected, display the empty state: a line of text informing users why the panel is empty and suggesting they make a selection to view more content.
- When the selection gets cleared upon navigation, ensure the panel displays an empty state.
- Follow the empty state guidelines for each component used in the split panel.

## General guidelines

### Do

- Always present meaningful resource detail aggregation when users perform multi-selection.
- Use [tabs](/components/tabs/index.html.md)   to group content in the split panel if there are multiple groups of details to display.
- Omit the containers and place content like [key-value pairs](/components/key-value-pairs/index.html.md)   directly on the split panel when possible to reduce visual noise.

### Don't

- Don't overwhelm users with information. Be selective on the content of the split panel and keep it concise to minimize the cognitive load.
- Don't repeat the action buttons from the table/cards header in the split panel.

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

- For the content within the split panel, follow the writing guidelines of the individual components used. For example, [container](/components/container/index.html.md)   or [key-value pairs](/components/key-value-pairs/index.html.md)  .

#### Resource collection

- Follow the writing guidelines for [table view](/patterns/resource-management/view/table-view/index.html.md)   or [card view](/patterns/resource-management/view/card-view/index.html.md)  .

#### Split panel title

- Follow the writing guidelines for [split panel](/components/split-panel/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Related patterns and components

### View resources

With the view resources patterns, users can find and take action on a collection of resources in the most efficient way possible.

[View Documentation](/patterns/resource-management/view/index.html.md)

### Table view

The table view pattern is a collection of resources in a tabular format. It's effective for quickly identifying categories or comparing values in a large text and numerical data set.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/table)

[View Documentation](/patterns/resource-management/view/table-view/index.html.md)

### Card view

A collection of resources represented as cards. It's effective for glancing at small sets of similar resources with text, numerical, and imagery data sets.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/cards)

[View Documentation](/patterns/resource-management/view/card-view/index.html.md)

### Resource details

On a resource details page, users can view the details of a resource and, when relevant, any related resources.

[View Documentation](/patterns/resource-management/details/index.html.md)

### Split panel

A collapsible panel that provides access to secondary information or controls. It is the primary component to implement [split view](/patterns/resource-management/view/split-view/index.html.md) , a pattern to display item collection with contextual item details.---
