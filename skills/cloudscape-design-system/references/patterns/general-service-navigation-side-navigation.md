---
scraped_at: '2026-04-20T08:52:59+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/service-navigation/side-navigation/index.html.md
title: Side navigation
---

# Side navigation

Provides a structural view of a services's navigation, allowing users to easily navigate sections and pages within the service.

## Key UX concepts

### Navigation structure

Organize the side navigation according to the information architecture (IA) of your service, the primary use case of the user, and the user's mental model of involved resources. Within the [side navigation](/components/side-navigation/index.html.md) component are four possible types of information architecture, with various hierarchies. [Breadcrumbs](/components/breadcrumb-group/index.html.md) displayed on each page should reflect the same information architecture as used in the side navigation.

**Note** : A use case not currently supported by this pattern is services organized as service hubs. Typically, these types of services are organized by top-level projects.

## Simple

The pages are hierarchically all on one level, listed one after another. Dividers may be used to provide additional organization between these links when different sets are fundamentally not related to each other. For example, a set of pages that manage the resources provided by the service, versus a set of pages that provide additional information regarding the general service for example, notifications or additional documentation.

#### A. Service homepage

The introduction or home page for a service. This is always the top page of the service's IA.

#### B. Page

Page of a service that is hierarchically on the second level of a service's IA.

## Organized with sections

A set of links that are conceptually related to each other can be grouped together under a single section header to provide further organization. The links should have a clear relationship to one another and to the section header. Avoid redundancy by not repeating the title for a link in the section header. The section header is not a link but provides the ability to expand and collapse the section.

#### A. Service homepage

The introduction or home page for a service. This is always the top page of the service's IA.

#### B. Page

Page of a service that is hierarchically on the second level of a service's IA.

### Corresponding with breadcrumbs - optional

Section headers may be included within the breadcrumbs as a prefix to the breadcrumb item for the current page, separated by a colon. We recommend this when the additional context will help users maintain the mental model of the service's IA and resources.

## Organized with group sections

A set of links that are conceptually related to each other can be grouped together under a single section group to provide further organization. You can nest expandable sections, link groups, and expandable link groups within a section group depending on you IA needs. A section header is not a link, but provides the grouping header.

#### A. Service homepage

The introduction or home page for a service. This is always the top page of the service's IA.

#### B. Section header

Group header title, with related pages below.

#### C. Page

Page of a service that is hierarchically on the second level of a service's IA.

### Corresponding with breadcrumbs - optional

Section group headers may be included within the breadcrumbs as a prefix to the breadcrumb item for the current page, separated by a colon. We recommend this when the additional context will help users maintain the mental model of the service's IA and resources.

## Nesting with expandable link groups

This structure supports a primary and secondary level to allow nesting of child pages. We recommend child pages be hidden unless the section has an active link (on the parent or any child pages) or the user has expanded the section into view.

When there are three or more levels of hierarchy with in the service's IA, the user may navigate to them via links and actions embedded within the first and second level pages. The breadcrumbs will then become the method for the user to understand where they are and how to get back. If this strategy is not optimal, consider restructuring the IA. Keeping the navigation shallow helps surface functionality to users faster and helps them keep a mental model of the service.

#### A. Service homepage

The introduction or home page for a service. This is always the top page of the service's IA.

#### C. Parent page

Page that has children pages directly related to it.

#### D. Child page

Page that is hierarchically on the third level of a service's IA, and one level below a parent page.

### Corresponding with breadcrumbs

Child pages are listed as a separate breadcrumb item to the parent page that it is secondary to.

## Link groups for large resource details

Some services may contain resources that are too large or complex to use the [details page with tabs](/patterns/resource-management/details/details-page-with-tabs/index.html.md) or [detail pages as a hub](/patterns/resource-management/details/details-page-as-hub/index.html.md) structures, and must split it into multiple pages to manage the resource. In this case, a link group may be used to organize the resource detail pages.

After an existing resource has been selected from a collection via a [view resource page](/patterns/resource-management/view/index.html.md) (E), the links for the selected [resource's detail pages](/patterns/resource-management/details/index.html.md) (F) appear nested below the overarching view resource page. The landing page for the specific resource should be listed as the first link of the nested link group. We recommend that all primary actions and information relevant to the resource be made available on the first (and landing) detail page for the resource.

#### A. Service homepage

The introduction or home page for a service. This is always the top page of the service's IA.

#### E. View resource page for large resources

The view resource page that becomes the parent page for a group of [resource detail pages](/patterns/resource-management/details/index.html.md) utilized for a single existing resource.

#### F. Resource detail page

A resource detail page for a large resource with multiple detail pages. These sets of detail pages only appear in the side navigation once a specific resource has been selected.

### Corresponding with breadcrumbs

The name of the selected resource is included as a prefix to the breadcrumb item for the current page, separated by a colon.

## Service identity

The service identity tells the user which service they're using. Always link it to the homepage of your particular service, so users can learn more about it. The service identity is always displayed at the top page of the service's IA.

You may choose to use a logo in the navigation, in order to provide additional brand awareness. Logos can be used together with the service name, or separately.

## General guidelines

### Do

- Organize the side navigation to best support the user's primary use cases and the mental model for the involved resources rather than treating the navigation as a site map. Avoid including links for pages which are best intended to be accessed inline a page, such as: [create resource](/patterns/resource-management/create/index.html.md)   flows, [edit resource](/patterns/resource-management/edit/index.html.md)   flows, and [view resource](/patterns/resource-management/view/index.html.md)   pages accessed from another [details page as a hub](/patterns/resource-management/details/details-page-as-hub/index.html.md)  .
- Keep groupings to a minimum when organizing the side navigation with sections or expandable link groups.
- Organize and order your links from general to specific, in order of usefulness, relevance, or frequency of use.
- Use dividers sparingly to separate sets of links that are fundamentally not related to each other.
- Keep the name of the items within the side navigation consistent with the breadcrumb items.
- By default side navigation is closed on [create resource](/patterns/resource-management/create/index.html.md)   and [edit resource](/patterns/resource-management/edit/index.html.md)   pages. It is open on all other pages.
- Keep the side navigation open by default for returning users.
- Always ensure one link in the side navigation is active. If the user is on a [resource details](/patterns/resource-management/details/index.html.md)   page, the resources type link should be active.   For example,* *   when on *Service > Distributions > SLCCSMWOHOFUY0, Distributions*   should be highlighted in the side navigation.

### Don't

- Avoid using sections and expandable link groups in the same side navigation.
- Avoid sections with only two links.
- Don't use badges with section headers or for labeling links with static messages. For example: *Preview*   , *New*   , or *Beta*   . Badges may be used to surface actionable areas to a page.
- When opening a [resource details](/patterns/resource-management/details/index.html.md)   page, don't add a new item to the side navigation.

## Related patterns

### Side navigation

A list of navigational links that point to the pages within an application.

[View Documentation](/patterns/general/service-navigation/side-navigation/index.html.md)

### Breadcrumb group

Displays a series of navigational links in a hierarchical list.

[View Documentation](/components/breadcrumb-group/index.html.md)

### Resource details

On a resource details page, users can view the details of a resource and, when relevant, any related resources.

[View Documentation](/patterns/resource-management/details/index.html.md)

### View resources

With the view resources patterns, users can find and take action on a collection of resources in the most efficient way possible.---

[View Documentation](/patterns/resource-management/view/index.html.md)
