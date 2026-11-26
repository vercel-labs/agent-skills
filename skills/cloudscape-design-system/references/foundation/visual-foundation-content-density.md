---
scraped_at: '2026-04-20T08:50:22+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/visual-foundation/content-density/index.html.md
title: Content density
---

# Content density

Content density is defined by the ratio of information visible compared to the space available in the interface.

## Density modes

When you provide multiple density options, users can adapt the amount of content shown on the screen based on their needs and preferences. Some users might find it easier to complete their tasks by having larger spacing that increases distinction of content, while others might prefer smaller spacing and more content that is visible at a glance.

Cloudscape supports two density modes: **comfortable** and **compact.**

### Comfortable

Comfortable is the standard density level of the system, active by default. It optimizes content consumption and readability, as well as cross device experiences.

### Compact

Compact is an additional density level for data intensive views. It increases the visibility of large amounts of data by reducing the space between elements on the screen.

## Density scale

Comfortable and compact modes are built using the 4px base unit of the [spacing system](/foundation/visual-foundation/spacing/index.html.md). In compact mode, the spacing scale is reduced in increments of 4, decreasing the vertical spacing inside components ( *paddings* ) and the vertical and horizontal spacing between components ( *margins* ).

### Spacing inside components

*Comfortable scale applied to table component*

*Compact scale applied to table component*

### Spacing between components

*Comfortable spacing*

*Compact spacing*

### Principles

#### Consistency

To ensure consistent and predictable experiences, compact mode is designed and implemented to propagate the reduced spacing scale to all components, in all view types. This allows for customization of the density level in few steps, avoiding burden on users.

#### Flexibility

Users are in control of choosing their preferred level of density within an application. The density scales alter the perception of information visible in the screen, for example a page in compact mode might be perceived as overwhelming for some users, and pleasant for others - the same page in comfortable mode might be perceived as with excessive white space for some users, and as nice balance between content and space for others.

#### Readability

When reading help content, browsing on-boarding documentation and getting started, or fixing errors within a form, users need to focus on reading. To help users make decisions without compromising content readability the compact scale is not fully applied to informational components such as [help panel](/components/help-panel/index.html.md) , [alert](/components/alert/index.html.md) , [flashbar](/components/flashbar/index.html.md) , and [form validation messages](/components/form-field/index.html.md).

#### Interactivity

When interacting with elements that are contained in a limited real estate, or when focusing on pointing and selecting, space is not a constraint. To not hinder their experience the compact scale is not fully applied to elements with limited target space such as dropdowns in [select](/components/select/index.html.md) , [multiselect](/components/multiselect/index.html.md) , [autosuggest](/components/autosuggest/index.html.md) , [date picker](/components/date-picker/index.html.md) , and in [data visualisation](/patterns/general/data-vis/index.html.md) components. It is instead optimised for full page, data intensive views, such as [dashboard](/patterns/general/service-dashboard/index.html.md) , [resource list](/patterns/resource-management/view/index.html.md) , and [resource details](/patterns/resource-management/details/index.html.md).

#### Effectiveness

Information density is not only about the *amount* of white space in an interface, but it also about *how* white space is used. White space impacts how elements relate to each other on a page, and can help increase focus and efficiency in the user flow when used effectively. For example, a task can be easier to complete by increasing the proximity of elements required to complete an action.

## General guidelines

### Do

- Always set comfortable mode as default. Comfortable mode is the default density level of Cloudscape. Compact mode can hinder readability, overwhelm, and prolong content consumption.
- Ensure users can always switch between comfortable and compact mode. Follow the guidelines for [density settings](/patterns/general/density-settings/index.html.md)  .
- Ensure a consistent experience within your application and across regions. Comfortable and compact mode are applied to the entire application, and in all regions.

### Don't

- Compact mode does not replace comfortable mode. Always provide comfortable mode.
- Don't apply compact mode to individual pages or standalone components of your application, unless the component specifically offers that capability. For an example, refer to the [table component](/components/table/index.html.md) `contentDensity`   property.

## Implementation and demos

### Implementation guide

1. Custom components:
To benefit from the compact mode in your custom components, use the [box](/components/box/index.html.md) and [space between](/components/space-between/index.html.md) components. You can find more information in our [spacing article](/foundation/visual-foundation/spacing/index.html.md).

2. Adjust child iframes:
Child iframes do not inherit css styles of the parent page automatically. Therefore, in order to be compact mode compliant, they need to have the class name applied separately.

### Demos

To see an example of the [density settings pattern](/patterns/general/density-settings/index.html.md) implemented, see the [dashboard demo](/examples/react/dashboard.html) . To see compact mode in-action, check out the following demos:

- [Table view](/examples/react/table.html)
- [Details page](/examples/react/details.html)
- [Details page with tabs](/examples/react/details-tabs.html)
- [Single page create](/examples/react/form.html)
- [Card view](/examples/react/cards.html)

## Related pages

### Density settings

With the density settings pattern, users can define the preferred density level of the content visible within the interface.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/dashboard)

[View Documentation](/patterns/general/density-settings/index.html.md)

### Table

Presents data in a two-dimensional table format, arranged in columns and rows in a rectangular form.---

[View Documentation](/components/table/index.html.md)
