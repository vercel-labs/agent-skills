---
scraped_at: '2026-04-20T08:53:49+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/view/index.html.md
title: View resources
---

# View resources

With the view resources patterns, users can find and take action on a collection of resources in the most efficient way possible.

## Patterns

There are three patterns to choose to represent a collection of resources.

### Table view

The table view pattern is a collection of resources in a tabular format. It's effective for quickly identifying categories or comparing values in a large text and numerical data set.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/table)

[View Documentation](/patterns/resource-management/view/table-view/index.html.md)

### Card view

A collection of resources represented as cards. It's effective for glancing at small sets of similar resources with text, numerical, and imagery data sets.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/cards)

[View Documentation](/patterns/resource-management/view/card-view/index.html.md)

### Split view

A collection of resources presented as table or cards and paired with a [split panel](/components/split-panel/index.html.md) for contextual resource details. It's effective for quickly browsing or comparing key resource details.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/split-panel-multiple)

[View Documentation](/patterns/resource-management/view/split-view/index.html.md)

## View resources flow chart

## Criteria

Choose the most suitable pattern to represent the resource collection:

### Using a split view

Split view is an *optional* extension of the [table view](/patterns/resource-management/view/table-view/index.html.md) or [card view](/patterns/resource-management/view/card-view/index.html.md) that adds a collapsible panel for displaying additional resource details. It is effective when users need to quickly view or compare resource details of multiple resources in-context to resource collection. Use a split view only when your users go through workflows such as monitoring or troubleshooting, which often require an additional layer of details on the table/card view. Don't use a split view when standard table/card view with separate [details page](/patterns/resource-management/details/index.html.md) meets your user's need.

### Choosing between table view and card view

|  | Table view | Card view |
| --- | --- | --- |
| Number of resources in the data set | 9 or more resources in 99% of use cases | 5 or less resources in 99% of use cases |
| Metadata* being displayed | Shared metadata between resources | Different metadata across resources (different types of databases with different data) |
| Metadata type | Data that is displayed in columns (text, numerical, status, sparkline) | Data that can be displayed as visuals (charts, videos) |

* The configuration details of a resource. Example: 'date created.'

### Number of items in the collection

Tables enable users to quickly scan and sort columns, to compare metadata across many resources.

Use a table if the resources share the same metadata, and your users will be comparing resources to determine which to take action on. Use the card view if users will not be comparing between a large number of resources to determine which to take action on.

### Metadata being displayed

Table columns allow for the same metadata type to be displayed across all resources, and allow for easy scanning and comparison of similar metadata.

Cards allow for different metadata to be displayed at the same time in a constrained space.

### Metadata type

Tables are optimized for displaying metadata that can fit into data cells, and can be sorted and compared. Cards are optimized for displaying non-columnar data, like charts or images.
