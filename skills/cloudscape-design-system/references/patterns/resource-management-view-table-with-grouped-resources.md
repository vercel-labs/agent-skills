---
scraped_at: '2026-04-20T08:53:56+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/view/table-with-grouped-resources/index.html.md
title: Table with grouped resources
---

# Table with grouped resources

Use a table with grouped resources when resources are organized by one or more shared characteristics.

 [View playground example](/components/table/index.html.md)
## Key UX concepts

### Grouped resources

Grouped resources are resources organized into groups based on one or more **shared characteristics** . Groups are not resources themselves; they represent a way to categorize and present resources within the table. Grouped resources are visualized using a [table with expandable rows](/components/table/index.html.md) , where groups appear as expandable rows and resources typically reside at the deepest level. Use this pattern when grouping helps users scan, compare, or act on multiple resources that share common characteristics.

If your data represents **parent-child relationships** , where resources can contain or depend on other resources, consider using the [table with nested resources pattern](/patterns/resource-management/view/table-with-nested-resources/index.html.md) instead.

### Group resource counters

Group resource counters display the number of selectable and selected resources within each group, taking into account any filters applied to the table. When using tables with grouped resources, display these counters on every group row.

The sum of selected resource counters across all top-level groups must match the total number of selected resources shown in the table header.

### Selecting

In tables with grouped resources, only resource rows are individually selectable. Selecting a group always selects **all resources it contains, across all levels**.

The total number of selected resources must be displayed in the table header's resource counter. Do not disable selection for individual resources or groups. If a bulk action cannot be applied to some of the selected resources, indicate this using a constraint message.

When a group is selected, all resources it contains that match the table's filters are selected, regardless of row expansion state, pagination, or progressive loading. Likewise, the select all checkbox selects all resources that match the current filters.

Because grouped tables allow large numbers of resources to be selected with a small number of interactions, users may unintentionally select more resources than expected. In addition, the total number of selected resources can change when table filters are added or removed. Consider using a [confirmation modal](/patterns/resource-management/delete/delete-with-simple-confirmation/index.html.md) for bulk actions to reinforce the action scope.

### Filtering

When filtering a table with grouped resources, apply the filter only to resource rows and reflect the total number of matching resources in the matches counter.

Groups that contain at least one matching resource remain visible but do not count toward the matches counter. Groups that contain no matching resources should be hidden.

### Aggregating values

Display the group label and resource counter together in the first (expandable) column. Other columns for group rows may be left empty or populated with aggregate values, such as totals or averages for numeric properties, distinct-value counts for enumerated properties, or date ranges for date properties.

Aggregate values must be computed with respect to the currently applied table filters.

### Sorting

Sorting applies to both groups and resource rows. Groups may be sorted by aggregate values when such values are present.

Default sorting for groups and resource rows may differ (for example, groups sorted alphabetically and resource rows sorted by date). If a group is not sortable for a given column, it may fall back to its default sorting behavior.

### Pagination

In tables with expandable rows, pagination applies only to top-level rows. For example, if the table is set to display 10 rows per page, 10 top-level rows are shown per page regardless of the number of nested rows.

Use pagination to organize large data sets into manageable chunks, making it easier to navigate to specific sections. Pagination also allows users to jump directly to a specific page, helps them keep track of their position, and provides a clear indication of the overall size of the data set.

[View Documentation](/components/pagination/index.html.md)

### Progressive loading

When expanding a group with many resources or nested groups, consider using progressive loading. This renders an initial set of rows, along with a control to load additional rows.

When a group is selected, the selection must extend to all resources it contains, including those not rendered due to progressive loading.

### Inline editing

When using inline editing in tables with grouped resources, disable it for group rows. Groups are a presentation construct and do not represent editable data; their values are derived from the resources they contain.

## General guidelines

### Do

- Use row counters for all group rows.
- Use aggregated values for group rows where possible. Always compute aggregated values with respect to the currently applied table filters.
- Use a confirmation modal when performing bulk actions, and clearly display the total number of selected resources.

### Don't

- Don't disable selection on individual data rows or resource groups.

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

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.
