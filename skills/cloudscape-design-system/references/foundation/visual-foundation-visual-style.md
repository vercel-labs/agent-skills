---
scraped_at: '2026-04-20T08:50:45+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/visual-foundation/visual-style/index.html.md
title: Visual style
---

# Visual style

Visual style defines how the elements of Cloudscape work together to create a consistent visual aesthetic that reinforces our brand.

## Shadows

Shadows are used to provide visual hierarchy through elevation to simulate the behavior of layering elements on the page. They provide additional focus when layering over flat elements. In Cloudscape, the visual style is flat, modern, and robust. Shadows in our system are reserved for elements that overlap or are designed to overlap others. This can either be in the form of fixed elements that remain constant or as transient elements that are interacted with.

### Shadow

Used for overlapping elements.
### Inner shadow

Used for overflow affordances and fixed headers and columns within containers.
### Shadow \+ Stroke

Used to achieve the greatest focus and depth in layout, for transient states such as dropdowns and popovers. Additional details 

| Display | Role | Examples |
| --- | --- | --- |
|  | Shadows for fixed elements. | Outer shadow for sticky [flashbar](/components/flashbar/index.html.md), sticky [table](/components/table/index.html.md) header, [sticky first and last table column](/components/table/index.html.md) and [split panels](/components/split-panel/index.html.md) in bottom position. |
|  | Shadow for elements of interactive nature, to better differentiate between the selectable components. | Outer shadow for [modal](/components/modal/index.html.md), [popover](/components/popover/index.html.md) and [dropdowns](/components/select/index.html.md). |
|  | Shadow of app layout panel triggers and drag states. | Outer shadow for [app layout](/components/app-layout/index.html.md) navigation, tools, split panels triggers, and [board item](/components/board-item/index.html.md) drag state. |
## Borders and dividers

Borders are used to visually group elements or separate them from one another. The border color varies depending on the component and context, and the width is separated into two distinct categories - layout and interactive elements. Line stroke weight determines how close an element is to the user and the importance of the content. Use a 1px line width to separate visual elements and use a 2px line width to bring interactive objects closer to the user, or to emphasize certain elements over others. Finally, you can use drop shadows for overlapping elements.

Elements have varied border radius based on their purpose and placement amongst other elements in the interface. Dividers are used to separate different elements in groups of content and are used sparingly throughout the system. A divider used effectively will enhance readability in a large group.

Consider the following example- An input and select have a border radius of 8px to indicate that the two elements are peers, while the container they live in has a border radius of 16px, indicating that it is a component of a different type and purpose. A horizontal divider is used in a table to separate each row from one another and a vertical divider is used to separate table column headers.

### Border radius

Small elements that are used inside other elements have a border radius. Button Alert Other examples not shown: autosuggest, button dropdown, checkbox, multiselect, select, textarea, and, tiles.
### Dividers

Dividers are used sparingly, but consistently. Expandable section Column layout 1 Column layout 2 Column layout 3 

| Table column 1 | Table column 2 |
| --- | --- |
| Row 1 |  |
| Row 2 |  | Other examples not shown: app layout, container, modal header/footers, dropdown items, side navigation, and tabs. Additional details 

| Display | Role | Examples |
| --- | --- | --- |
|  | Border for layout elements. | [Containers](/components/container/index.html.md), [cards](/components/cards/index.html.md), panels and horizontal and vertical dividers. |
|  | Border for interactive elements. | [Buttons](/components/button/index.html.md) and [tiles](/components/tiles/index.html.md). |
|  | Default border for form elements. | Form elements such as [input](/components/input/index.html.md), [select](/components/select/index.html.md), [textarea](/components/textarea/index.html.md) and [property filter](/components/property-filter/index.html.md). |
|  | Border for elements of greater visual prominence that are transient or provide context specific information. | [Popovers](/components/popover/index.html.md), [alerts](/components/alert/index.html.md) and [annotation popovers](/components/annotation-context/index.html.md). |
|  | Default 1px dividers. | Vertical column divider [Key/value pair](/components/key-value-pairs/index.html.md).Footer horizontal dividers in [container](/components/container/index.html.md), [modal](/components/modal/index.html.md), and [app layout](/components/app-layout/index.html.md) panels.Header horizontal dividers in [app layout](/components/app-layout/index.html.md) navigation and tools panels.Default [expandable section](/components/expandable-section/index.html.md) horizontal separator.[Tabs](/components/tabs/index.html.md) headers and [table](/components/table/index.html.md) columns vertical dividers. |
|  | Border for interactive elements. | [Table](/components/table/index.html.md) columns vertical dividers. |
## Page background

The system uses different page background colors for different application layouts. While [standard AppLayout](/components/app-layout/index.html.md) uses the same background color as containers and other layout components across the page, [AppLayoutToolbar](/components/app-layout-toolbar/index.html.md) displays a slightly different background color. This is to provide greater depth and hierarchy in use cases that display large amounts of data that users need to interact with.

## Outlines and fills

The system uses both outlines and fills to communicate messages to users. A solid fill paired with white text creates the greatest contrast between other elements so it is used to call attention to elements of the utmost importance. Elements that don't require as much attention but are important, use a lighter fill background by default or on hover. Most elements though, don't have a background fill at all and just use an outline.

Consider the following example. A primary button uses a solid orange-600 background color to call attention to the next suggested action. An alert uses a background fill of blue-100 to call attention to the element but with less emphasis. Most icons don't have any fill and just use an outline.

### Dark fill, without outline

Important elements are inverted to create the greatest contrast with other elements on the page. Primary button
- Flash

Other examples not shown: badge, selected checkbox, toggle, and radio button.
### Light fill, with outline

Emphasized elements have a lighter background, typically acompanied with a darker border of a similar color. For dark mode, the inverse applies. Alert Other examples not shown: selected card, tile, table row, and multiselect token.
### Outline only

Most elements don't have any fill and only have a border or outline. Other examples not shown: autosuggest, button dropdown, multiselect, select, textarea, default radio, checkbox, and tiles.
## States

States communicate the status of user interface elements to the user. States should be applied consistently across components in order to increase usability.



| Display | Role | Examples |
| --- | --- | --- |
|  | Default focus state for clickable components. | Form elements such as [button](/components/button/index.html.md), [expandable section](/components/expandable-section/index.html.md), and [radio button](/components/radio-group/index.html.md). |
|  | Default focus state for selectable components with border. The component border color will change depending on any additional states that are applied. | Form elements such as [input](/components/input/index.html.md), [select](/components/select/index.html.md), and [textarea](/components/textarea/index.html.md) . |
| Text | Active state for selected items. | Selected [table](/components/table/index.html.md) row, [card](/components/cards/index.html.md), [tile](/components/tiles/index.html.md), [multiselect](/components/multiselect/index.html.md) token, and [select](/components/select/index.html.md) dropdown item. |
| Text | Hover state for highlighted dropdown items. | Hover state for[autosuggest](/components/autosuggest/index.html.md), [select](/components/select/index.html.md), and [button dropdown](/components/button-dropdown/index.html.md) dropdown items. |
| Text | Error state for form elements. | Form elements such as [input](/components/input/index.html.md), [select](/components/select/index.html.md), and [textarea](/components/textarea/index.html.md). |
| Text | Disabled state for form elements. | Form elements such as [input](/components/input/index.html.md), [select](/components/select/index.html.md), and [textarea](/components/textarea/index.html.md). |
| X | Disabled state for form controls. | Form controls such as[checkbox](/components/checkbox/index.html.md) and [radio button](/components/radio-group/index.html.md). |
| X | Selected state for form controls. | Form controls such as[checkbox](/components/checkbox/index.html.md), [radio button](/components/radio-group/index.html.md), and [toggle](/components/toggle/index.html.md). |---
