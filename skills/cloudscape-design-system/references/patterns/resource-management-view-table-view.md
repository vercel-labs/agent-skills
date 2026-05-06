---
scraped_at: '2026-04-20T08:53:54+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/view/table-view/index.html.md
title: Table view
---

# Table view

The table view pattern is a collection of resources in a tabular format. It's effective for quickly identifying categories or comparing values in a large text and numerical data set.

 [View demo](/examples/react/table.html)
## Key UX concepts

### Default

Table view of all user resources within the service.

### Data density

Table view of all user resources displayed with more or less entries per page, set by the user view preferences.

### Sort

Table view of all user resources sorted on a certain data set by the user. Each individual table column can be sorted in ascending or descending order.

### Filter

Reduction of the list of user resources by a specific query set by the user.

### Empty state

Table view in a state of when data has been successfully fetched, and the table contains no resources. When there are no matched results for the applied filters, show a zero results state. Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md).

### Error state

When a table encounters an issue, the table should reflect an error state. Common table error types and the remediation include:

- **Table actions failures: **   use [flashbar](/components/flashbar/index.html.md)   to notify users.
- **Data fetching error or access permission error: **   display an [alert](/components/alert/index.html.md)   as part of the table empty state.
- **Refreshing error**   : follow the guidelines for [loading and refreshing](/patterns/general/loading-and-refreshing/index.html.md)  .
- **Progressive loading error: **   follow the guidelines for [loading and refreshing](/patterns/general/loading-and-refreshing/index.html.md)  .
- **Inline table cell editing error: **   follow the guidelines for [inline edit](/patterns/resource-management/edit/inline-edit/index.html.md)   and [form field validation](/patterns/general/errors/validation/index.html.md)  .

#### Example of table data fetching error in container

### Resources

Edit Delete Create 

| Variable name | Current value | Description |
| --- | --- | --- |
| Failed to fetch resourcesThe list of resources could not be loaded due to a server error. Try again later.Retry |  |  |
### Showing additional data

There are two ways to show additional data in tables: pagination and progressive loading. Use pagination for organizing large datasets into manageable chunks, making it easier to navigate to specific sections. Pagination provides the ability to jump to specific pages making it easier to keep track of where they are, return to a specific section, and provide an accurate representation of the size of the data set. Use progressive loading when your user needs to see all the data in one view, to compare large data sets, and where context switching between pages creates a cognitive load and prevents easy comparison. For example, loading more child rows in a table with expandable rows.

## Building blocks

A B C D E E F G H I J A B C D E E F G H I J
#### A. Flash message

Use a flash message to notify the user about the progress and outcome (success or failure) of the actions taken upon the resources.

#### B. Breadcrumbs

Use the service name for the root page in the breadcrumbs, and make it a link. Follow it with the page title, which is usually the category name of the service items (For example: *Resources, Distributions, Instances* ).

#### C. Table

Use the "full-page" `variant` of the [table](/components/table/index.html.md) component for this pattern.

#### D. Header

Enabling a sticky header is optional, but recommended, for these potentially lengthy list pages. If enabled, use the "awsui-h1-sticky" header `variant` so the title reduces its size on scroll.

#### E. Actions - optional

- **Actions in the header: **   For more information on actions, refer to [global actions](/patterns/general/actions/global-actions/index.html.md)  .
- **Actions in table cells: **   For more information on actions, refer to [in-context actions](/patterns/general/actions/incontext-actions/index.html.md)  .

#### F. Filter - optional

Text filter helps users with an extensive number of table rows to quickly find one or several resources with a matching query. The entire set of columns are used as a base for the filter.
We recommend building in a custom message, with a clear call to action to clear the filter, when the query doesn't match with any resources.

#### G. Pagination - optional

Pagination helps users with an extensive number of resources to navigate through them across multiple pages. Users can change the default number of table rows per view on [Resources preferences](/components/collection-preferences/index.html.md).

Display the pagination even if the resources set fits in one page.

Navigating via the pagination functionality overwrites any selection.

#### H. Preferences - optional

Use preferences to allow users to view and change their display configuration. User configurations in preferences affect the following settings of the table view:

- Number of rows displayed per page (Pagination)
- Which columns are visible or set to hidden
- Order of the columns displayed
- Change of view pattern: from table view to card view, and vice versa
- Which columns are sticky

#### I. Selection - optional

Table rows can be selected individually or in bulk (multiple selection) via the checkboxes mechanism. The parent checkbox, living on the table header, only selects rows visible on the page.

Any actions triggered after selection only affects the selected visible rows. Selection is overwritten by:

- Table sorting
- Pagination
- Preferences
- And as soon as they are no longer visible on the page

#### J. Side navigation

Navigation is open by default on view pages. For more information about structuring side navigation content, follow the guidelines for [side navigation](/patterns/general/service-navigation/side-navigation/index.html.md).

## General guidelines

### Do

- Use table view pattern for static data with multiple attributes displayed in a tabular format.
- The best data type for a table view is data that is structured, easily comparable, and sortable.
- Restrain from incorporating graphics in tables. For data sets with a blend of text, images, and data visualizations, or content with mixed formatting, refer to the [cards view](/patterns/resource-management/view/card-view/index.html.md)   pattern.
- Organize columns and rows based on the information needs of your users. To help them read the table, order the columns by importance from left to right.
- To enable easy sharing of a table view, refer to the [filter persistence in collection views](/patterns/general/filter-patterns/filter-persistence-in-collection-views/index.html.md)   pattern.

### Don't

- Don't use the [content layout](/components/content-layout/index.html.md)   component on this type of page. Instead, use the "full-page" `variant`   of the [table](/components/table/index.html.md)   component to implement this pattern.
- Don't use the table view pattern for tables that aren't overly content-heavy. Instead, if a table only has a few columns, use a bordered table inside the [content layout](/components/content-layout/index.html.md)   component, with the default [app layout](/components/app-layout/index.html.md)   content max-width.
- Don't use pagination and progressive loading at the same time, except when loading child rows in [tables with expandable rows](/components/table/index.html.md)  .
- Don't change table column headers after a user has completed a filter action.

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

#### Text filter - optional

- Use sentence case.
- Don't use end punctuation.

#### Table header

- Follow the writing guidelines for [tables](/components/table/index.html.md)   and [cards](/components/cards/index.html.md)  .

#### Custom messages

- Use active voice wherever possible. Use passive voice only to avoid blaming the users.
- Avoid excessive words, such as *please*  .
- Avoid uppercase text and exclamation points.

#### Empty state - optional

- The goal of this message is to inform the user that data has been successfully fetched, and the table contains no resources. Consider incorporating:
- A clear identification of the state.  

  - For example: *Empty resources.*
- A descriptive explanation of the reasons why the state is displayed.  

  - For example: *No resources to display or You have no resources created.*
- The message can be extended by adding a call to action.  

  - For example: *Create a resource.*

#### Error state - optional

- Make sure to inform the user in concise and clear language, that the system encountered an error retrieving resources. Consider incorporating:  

  - A clear identification of the state.    

    - For example: *Could not retrieve resources.*
  - A descriptive explanation on the reasons why the state is being displayed.    

    - *For example: Could not access your resources.*
  - A single call to action to recover from this state.    

    - For example: *Refresh or Contact support*

#### Zero results - optional

- Use concise and clear language for your custom message in cases of zero results resulting from the text filter. Consider incorporating:
- A clear identification of the state.  

  - For example: *Zero results *     or *No results*
- A descriptive explanation of the reasons why the state is displayed.  

  - For example: *No resources match your search.*
- A single call to action to recover from this state.  

  - For example: *Clear filter or Go back to default.*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- Every table cell should have a logical column header or row header.
- Users should be able to access and move the active state using their keyboard (arrow keys). Each single resource has focus on the navigation (links) and on the selection mechanism (checkbox).
- Table must be visible in screen reader list of tables.

## Related patterns and components

### View resources

With the view resources patterns, users can find and take action on a collection of resources in the most efficient way possible.

[View Documentation](/patterns/resource-management/view/index.html.md)

### Card view

A collection of resources represented as cards. It's effective for glancing at small sets of similar resources with text, numerical, and imagery data sets.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/cards)

[View Documentation](/patterns/resource-management/view/card-view/index.html.md)

### Split view

A collection of resources presented as table or cards and paired with a [split panel](/components/split-panel/index.html.md) for contextual resource details. It's effective for quickly browsing or comparing key resource details.---

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/split-panel-multiple)

[View Documentation](/patterns/resource-management/view/split-view/index.html.md)
