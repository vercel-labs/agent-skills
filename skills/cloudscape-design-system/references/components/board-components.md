---
scraped_at: '2026-04-20T08:46:52+00:00'
section: components
source_url: https://cloudscape.design/components/board-components/index.html.md
title: Board components
---

# Board components

Made up of three components that work together to allow users to interact with, move, and configure a board layout.

 [Configurable dashboard demo](/examples/react/configurable-dashboard.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/board-components/index.html.json)

## Related components

### Board

Provides the base for a configurable layout, including drag and drop, responsiveness and grid.

[View Documentation](/components/board/index.html.md)

### Board item

A board item is a self-contained user interface (UI) element living within a board.

[View Documentation](/components/board-item/index.html.md)

### Items palette

Provides the ability to add board items to a board layout when combined with discreet split panel.

[View Documentation](/components/items-palette/index.html.md)

## Guidance on creating a configurable dashboard

For information about how to design and build a configurable dashboard experience using board components, see [Service dashboard](/patterns/general/service-dashboard/index.html.md) , [Configurable dashboard](/patterns/general/service-dashboard/configurable-dashboard/index.html.md) and [Dashboard items](/patterns/general/service-dashboard/dashboard-items/index.html.md) patterns.

## How components work together

Configurable dashboard pattern consists of three components, [board](/components/board/index.html.md) , [board item](/components/board-item/index.html.md) and [items palette](/components/items-palette/index.html.md).

Essentially, this pattern is a board component that contains board items within it. Individual board item components should be used for each content type you want to display on the board. These board item components are configurable (resizable and draggable).

The items palette component provides the ability to add new content types to the board via drag-and-drop. Items palette content should also be featured in the board item component. For the best experience, we recommend using the [split panel](/components/split-panel/index.html.md) component, in [discreet mode](/components/split-panel/index.html.md).

For an example of a configurable dashboard built using board items, see [this demo](/examples/react/configurable-dashboard.html).

A B C D---

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
