---
scraped_at: '2026-04-20T08:52:49+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/service-dashboard/configurable-dashboard/index.html.md
title: Configurable dashboard
---

# Configurable dashboard

Gives control to the user to show/hide, delete, move, change the size of, and add items to a dashboard.

 [Configurable dashboard demo](/examples/react/configurable-dashboard.html)
## Key UX concepts

### Control over the location of a dashboard item

Changing the position of a dashboard item allows users to better prioritize their content. This is accomplished through drag-and-drop, which includes the possibility to swap and push items within the layout. A visual affordance is provided on the dashboard layout to help users place a dashboard item into available space. For more details on drag-and-drop behavior, see [drag-and-drop](/patterns/general/drag-and-drop/index.html.md).

### Control which dashboard item to feature

Adding and removing dashboard items allows users to configure a dashboard to better meet their particular needs. For example, removing a learn more item, and adding an item that shows billing activity.

When a user configures a dashboard item and afterwards decides to remove it, follow the [delete with simple confirmation](/patterns/resource-management/delete/delete-with-simple-confirmation/index.html.md) pattern, or else allow the item to be removed without confirmation.

## Building blocks

Provides configurability to a [static dashboard](/patterns/general/service-dashboard/static-dashboard/index.html.md) . Base your content and structure on the static dashboard guidelines and provide the ability for users to configure a dashboard with these additional features.

A B C D E A B C D E
#### A. Dashboard layout

Use the [board](/components/board/index.html.md) component as a base for the configurable dashboard. it provides the main content area and a two-dimensional grid with rows and columns. It allows users to reorder, add, remove, and resize dashboard items.

#### B. Dashboard item

Configurable dashboard items give the user the ability to change the size, location and the content of a dashboard item.

Follow the guidelines for [dashboard item](/patterns/general/service-dashboard/dashboard-items/index.html.md) pattern.

#### C. Add item button

Users can click on the button to reveal or hide the [dashboard item palette](/components/items-palette/index.html.md) . A panel containing all available dashboard items to be included in the dashboard.

#### D. Add item panel

The add item panel is a [discrete split panel](/components/split-panel/index.html.md) that contains a [board item palette](/components/items-palette/index.html.md) , which is a list of available dashboard items that users can add to their dashboard, via drag-and-drop.

**Filtering - Optional**
Users can browse and find dashboard items via [text filter](/components/text-filter/index.html.md) or [select filter](/components/select/index.html.md).

When no result matched the query, provide a message and an action to clear the filter. Follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md).

#### E. Palette item

A palette item is a short representation of a dashboard item, providing basic information about what data it represents, for example a title and description for a billing dashboard item. Users can add items to the dashboard via drag-and-drop.

Follow the guidelines for [board items.](/components/board-item/index.html.md)

## Layout

Column layout is based on the 12 column grid system, and adapts depending on the viewport size, which defined by the system [breakpoints](/components/grid/index.html.md) , to arrange the content in size columns (large viewports, for example a big monitor), four columns (large viewports, for example a laptop), two columns (middle viewports, for example a ipad), and one column (small viewports, for example a mobile phone).

We recommend designing the dashboard layout for all three types of column layout options.

For example:

- On a six column layout, six small board items will be displayed in a row and occupy one column space each.
- On a four column layout, four small board items will be displayed in a row and occupy one column space each.
- On a two column layout, two medium board items will be displayed in a row and occupy one column space each.
- On a one column layout, all board items will stack vertically and occupy one column space.

## General guidelines

### Do

- When a user removed a dashboard item from the layout, add it back to the board palette, to enables users to bring it again to the layout.
- Pair remove dashboard item within the item dropdown menu and add dashboard items together.
- Follow the [static dashboard](/patterns/general/service-dashboard/static-dashboard/index.html.md)   pattern to create the structure and layout of the dashboard.
- Preserve the configuration that users have made for future visits.
- Maintain size and content state. When moving an item into a desired location, make sure to maintain the size, visible content, and configuration of the item.

### Don't

- Don't show an alert in the layout as feedback when removing a dashboard item from the dashboard.

## Related patterns

### Service dashboards

A dashboard page presents at-a-glance information about service and resource status. Users can monitor this information and act upon it quickly.

[View Documentation](/patterns/general/service-dashboard/index.html.md)

### Dashboard items

Dashboard items are self contained UI elements that address specific customer needs, such as navigating to a resource, monitor resources status, or viewing a costs summary.

[View Documentation](/patterns/general/service-dashboard/dashboard-items/index.html.md)

### Configurable dashboard

Gives control to the user to show/hide, delete, move, change the size of, and add items to a dashboard.---

[View Documentation](/patterns/general/service-dashboard/configurable-dashboard/index.html.md)
