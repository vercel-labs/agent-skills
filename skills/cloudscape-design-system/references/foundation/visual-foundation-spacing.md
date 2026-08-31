---
scraped_at: '2026-04-20T08:50:34+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/visual-foundation/spacing/index.html.md
title: Spacing
---

# Spacing

Spacing is used to define paddings and margins of the elements on the interface. Consistent spacing creates predictable layouts, favors visual rhythm and helps you create a clear hierarchy.

## Grid system

A layout is an underlying structure that allows you to organize information and lay your content. A well-designed layout has a clear hierarchy and guides users through key pieces of information that serve their main goal. When used consistently layouts create a predictable experience, letting users navigate through a series of pages that they understand as part of a same flow.

A grid system is an ordering system. It sets the measurements used to space and size objects within a given format. It provides a consistent set of rules that is used to define the [grid](/components/grid/index.html.md) , the [spacing system](/foundation/visual-foundation/spacing/index.html.md) , [typography](/foundation/visual-foundation/typography/index.html.md) , and the [iconography system](/foundation/visual-foundation/iconography/index.html.md) . All these foundational elements come together to build up the layout, and use the grid system to bring consistency and visual coherence between them.

Our design system is based on a 4-pixel grid system. It has a 4-pixel base unit, and uses increments of 4 to define the spacing and scale of elements on the interface.

### Laying content

When it comes to laying content on a page, grid systems can follow a hard or a soft grid approach. A hard grid approach consists on laying text and objects on a baseline grid (a set of equally spaced horizontal lines used to measure typography from its baseline). The soft grid approach measures typography from its line-height and positions elements relative to each other, rather than to an actual baseline grid.

Our design system follows a a soft grid approach which allows more flexibility and is more closely aligned to how websites are built. Use the [spacing system](/foundation/visual-foundation/spacing/index.html.md) to lay your content and achieve a consistent vertical rhythm on the pages of your application.

## Spacing system

Our design system's grid system is based on a 4-pixel base unit, which is used to calculate the spacing and scale of elements on the screen. The base unit is at the core of the visual foundation, and also provides the basis for the typography and iconography systems. The result is a consistent set of rules that allow you to create a coherent and balanced visual experience across your application.

### Spacing types

Spacing can be used **inside components ** (paddings), and **between components** (margins). Spacing inside components often uses smaller spacing units to achieve a closer relationship of elements. On the other side, spacing between components uses larger spacing units, to establish a visual separation of the content.

Spacing inside components is already built into the coded components so that you can focus on creating the layout that better serves your users' needs. If you build custom components, remember that they should use the same spacing scale to bring consistency and create a natural and familiar flow from page to page.

## Spacing scale

The spacing scale is based on progressive increments of the 4-pixel base unit.



| Spacing unit | Size (px) | Preview | Examples |
| --- | --- | --- | --- |
| 2 |  | Vertical space between a container [header](/components/header/index.html.md) and its description |  |
| 4 |  | Vertical space between [form field](/components/form-field/index.html.md) label and control |  |
| 8 |  | Horizontal space between [buttons](/components/button/index.html.md) in an action stripeHorizontal space between [tokens](/components/token-group/index.html.md) in a [property filter](/components/property-filter/index.html.md)Horizontal space between [checkbox](/components/checkbox/index.html.md)/[radio button](/components/radio-group/index.html.md) and their respective labels |  |
| 12 |  | Vertical padding inside a [popover](/components/popover/index.html.md) |  |
| 16 |  | Horizontal padding inside a [popover](/components/popover/index.html.md)Vertical space inside individual [cards](/components/cards/index.html.md)Vertical space between a page [header](/components/header/index.html.md) and [content](/components/content-layout/index.html.md) |  |
| 20 |  | [Grid](/components/grid/index.html.md) gutter width (fixed)Horizontal padding inside a [container](/components/container/index.html.md)Vertical space between [form fields](/components/form-field/index.html.md) |  |
| 24 |  | Vertical space between tasks in a [tutorial panel](/components/tutorial-panel/index.html.md) |  |
| 32 |  | Left indentation of grouped options in a [select](/components/select/index.html.md) |  |
| 40 |  | Horizontal padding for [app layout](/components/app-layout/index.html.md) and [split panel](/components/split-panel/index.html.md) content on large screens |  |
## Key concepts

Use the spacing scale to arrange components when creating a certain layout. Be conscious of hierarchy and visual relationships that you're trying to create. Apply spacing decisions intentionally and consistently across pages so that users can build a mental model. Having a predictable layout will help them reduce the cognitive load and will increase their focus on the content rather than on the layout.

### Create relationships

Proximity conveys relationship. Elements that appear near to each other are perceived as closely related when compared with elements that appear farther apart. Proximity is a very powerful tool to group content and connect concepts, letting you create sections or areas on the page that users can easily scan through.

### Create hierarchy

The amount of space surrounding an element can increase or decrease its visual prominence on the page and be perceived as more or less important than other elements on the page. Use larger spacing increments for elements that need to be positioned higher in the visual hierarchy and draw users attention. On the contrary, assign less space to those elements that  should be perceived and less important.

### Use white space

White space, also known as empty or negative space, is another active design element. It allows you to create visual contrast when laying out the content on a page, and to create sections or areas that you would like users to perceive as different. Negative space can also be used to create visual tension and attract focus, and overall it lets the content breathe and provides a stronger visual hierarchy to your layout.

## Implementation

There are three options that can be used to control spacing.

### Box component

The [box component](/components/box/index.html.md) allows to display and style basic elements and containers in compliance with the typography and spacing strategy of the design system. You can control the padding, margin and floating properties of an element by defining the unit of the spacing scale you would like to apply.

### Space between component

The [space between component](/components/space-between/index.html.md) lets you to define equal vertical or horizontal spacing among a group of similar components. Some examples are:

- the space between buttons inside the action stripe
- the space between form fields in a form
- the space between containers

### Design tokens

You can use the spacing values directly in your styles with [spacing design tokens](/foundation/visual-foundation/design-tokens/index.html.md).

[View Documentation](/foundation/visual-foundation/design-tokens/index.html.md)
