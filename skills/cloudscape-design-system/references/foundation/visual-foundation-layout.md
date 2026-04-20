---
scraped_at: '2026-04-20T08:50:30+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/visual-foundation/layout/index.html.md
title: Layout
---

# Layout

Layout refers to the arrangement of elements on the interface to serve a specific purpose. It's the integration of the spatial and organizational principles of the system that result in a final visual composition.

## Introduction

A layout is an underlying structure that allows you to organize your content. A well-designed layout has a clear hierarchy and guides users through key pieces of information that serve their goal. Some layout elements are optimized for highly productivity environments while others provide opportunities to add visual expression to the page. Consistent layouts create a predictable experience, letting users build mental models that help them navigate through a series of pages within and across applications.

## Anatomy of a layout

Cloudscape offers a handful of layout components that vary in granularity to solve unique challenges at the application, page, and section levels. They can be used together to create layouts that support the needs from different experience types. From productivity environments with high information density requirements, to interfaces that prioritize the learning and discovery experience such as documentation and marketing sites.

### Application layouts

An application layout is the high-level layout structure used across all pages within a given experience. Cloudscape provides two components that are able to control the layout inside an application: [standard app layout](/components/app-layout/index.html.md) and [toolbar app layout](/components/app-layout-toolbar/index.html.md) . These components are opinionated, out-of-the-box layout solutions that are designed to be orchestrators for complex application-wide features. For example, managing [drawer](/patterns/general/secondary-panels/index.html.md) states and position across pages, or maintaining a single source of truth for elements which may persist across pages such as [flashbar](/components/flashbar/index.html.md) notifications.

*Standard app layout*

*Toolbar app layout*

Both app layouts provide the page layout structure for use cases that include collapsible side navigation and tools. They both consume 100% of the width and height of the page and contain the following regions:

- Left side region to display a collapsible [side navigation](/patterns/general/service-navigation/index.html.md)   (A)
- Right side region, also collapsible, to display the tools and [secondary panels](/patterns/general/secondary-panels/index.html.md)   (F)
- Region to display [breadcrumbs](/components/breadcrumb-group/index.html.md)   (B)
- Region to display [flashbar](/components/flashbar/index.html.md)   notifications (C)
- Central region to display the main content (D)

Only use one type of an app layout within a product. When deciding which app layout to use for your product, consider the following:

- Use the toolbar app layout for products that have a lot of interactive tools, or where information density is crucial. This app layout was designed to serve products that require high levels of user interaction and focus, which helps support users completing their tasks efficiently. **The toolbar app layout is optimized for productivity tools. **

- Use the standard app layout for products that are mainly used for browsing (low levels of interactivity), or where information density is not critical. Often these products are those which rely heavily on [hero headers](/patterns/general/hero-header/index.html.md)   , where most of the pages don't need to occupy 100% of the horizontal real estate available, or have simple enough information architectures to not require breadcrumbs. **The standard app layout is suggested for use cases that may benefit from a higher level of visual expression such as marketing and documentation applications. **

### Content layout

 [Content layout](/components/content-layout/index.html.md) is a lower-level page layout component that offers out-of-the-box solutions for more expressive patterns, like the background styles and layout in the [hero header pattern](/patterns/general/hero-header/index.html.md) , or centered content with a maximum width for easier reading. These patterns are often used in products with low levels of interactivity and where information density is not critical, such as documentation and marketing site pages. Content layout can be used standalone, or it can be used in combination with an app layout component if there's a need to include side navigation and tools.

 [Content layout](/components/content-layout/index.html.md) provides the page layout structure for expressive use cases. It consumes 100% of the width and height of the page and contains the following regions:

- Top region to display page level [flashbar](/components/flashbar/index.html.md)   notifications (A), and [breadcrumbs](/components/breadcrumb-group/index.html.md)   (B)
- Header region (C) with styling capabilities in compliance to the [hero header pattern](/patterns/general/hero-header/index.html.md)   (D)
- Content region (E)

Content layout enables the definition of a background style (solid color, gradient, or image), includes variants with different styles to separates the header from the content (divider or solid background), the option to create a container-header overlap, and the possibility to include a secondary header content. Content layout also allows more freedom to define layout properties such as the maximum content width, and content padding. To learn more about header styling use cases, see [hero header](/patterns/general/hero-header/index.html.md) pattern guidelines.

[View Documentation](/components/content-layout/index.html.md)

### Column layout and grid

 [Column layout](/components/column-layout/index.html.md) and [grid](/components/grid/index.html.md) are components that provide the low-level flexibility to create layouts or help organize the information within a page or even within other components. Information inside the content area of a page can be distributed using the [column layout](/components/column-layout/index.html.md) (A), or [12-col grid](/components/grid/index.html.md) (B), for greater control (creating multiple equal columns inside a component). The content can be displayed using [containers](/components/container/index.html.md) , [cards](/components/cards/index.html.md) , or directly laying the content on the background of the page.

## Layout principles

### Predictable

Define layouts that support concrete user flows and apply them consistently across your application. Using different page types to display information will help users navigate through your application in a more efficient way.

### Consistent

Build layouts following the spacing system and create a coherent visual experience. Use a consistent logic when distributing content vertically down the page to determine the hierarchy and structure of your layout.

### Responsive

Our design system works with responsive layouts. Don't design for specific screen sizes, devices, or resolutions; instead, build for responsive, fluid content in a browser. To learn more about responsive layouts see [responsive design](/foundation/core-principles/responsive-design/index.html.md) to learn more about responsive layouts.

## General guidelines

### Do

- Use app layout toolbar for productive use cases.
- Use only one app layout in an application, and use it consistently throughout.
- Use content layout and/or [standard app layout](/components/app-layout/index.html.md)   for expressive use cases, such as those related to documentation and marketing sites.
- When creating a layout, select components that support the content hierarchy you're trying to convey.
- Use visual expression to draw users attention to a specific message (for example, a call to action), or build brand equity.
- Use styling with intent, and not as a default across any particular site (on a use case basis and not on at an application level).

### Don't

- Don't use a styled header on pages with high levels of interactivity that need to prioritize user focus.
- Don't use the toolbar without breadcrumbs.

## Related pages

### Hero header

Showcase key messages and functionality for your application or section of an application in the header of the page.

[View Documentation](/patterns/general/hero-header/index.html.md)

### Content layout

Provides page structure for expressive use cases.
### Spacing

Spacing is used to define paddings and margins of the elements on the interface. Consistent spacing creates predictable layouts, favors visual rhythm and helps you create a clear hierarchy.

[View Documentation](/foundation/visual-foundation/spacing/index.html.md)

### App layout

Provides page structure for general use cases, which offers collapsible side navigation, tools panel, drawers, and split panel.

[View Documentation](/components/app-layout/index.html.md)

### App layout toolbar

Provides page structure for productive use cases, which offers collapsible side navigation, tools panel, drawers, and split panel, in the form of a toolbar.---

[View Documentation](/components/app-layout-toolbar/index.html.md)
