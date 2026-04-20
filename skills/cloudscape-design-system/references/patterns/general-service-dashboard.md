---
scraped_at: '2026-04-20T08:52:53+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/service-dashboard/index.html.md
title: Service dashboards
---

# Service dashboards

A dashboard page presents at-a-glance information about service and resource status. Users can monitor this information and act upon it quickly.

## Patterns

### Static dashboard

Identify and structure a predefined and persistent set off items within a dashboard.

[View Documentation](/patterns/general/service-dashboard/static-dashboard/index.html.md)

### Configurable dashboard

Gives control to the user to show/hide, delete, move, change the size of, and add items to a dashboard.

[View Documentation](/patterns/general/service-dashboard/configurable-dashboard/index.html.md)

### Dashboard items

Dashboard items are self contained UI elements that address specific customer needs, such as navigating to a resource, monitor resources status, or viewing a costs summary.

[View Documentation](/patterns/general/service-dashboard/dashboard-items/index.html.md)

## Objectives

The objective of dashboards is to summarize the primary information of the service. In general, there are three primary use cases that a dashboard can address:

- **Monitor**   : Users monitor the overall system health and track trends to prevent issues and optimize the system.
- **Investigate**   : Users filter and drill down to the root cause of the occurring issues, make decisions after investigating, and take action. This often involves navigating across services.
- **Be informed**   : The dashboard provides guidance aimed at new users about how to use the service. It also informs all users about service updates relevant to their tasks.

When creating a service dashboard, focus on your users. The guidelines and structures we provide are oriented to build a more consistent experience, but ultimately the experience delivered should be based on concrete data for your service, such as conversion analytics, user research, and direct user feedback.

### Configurable layout

When building a dashboard you can decide the level of control you want to provide to your users. We provide the option to make [dashboard configurable](/patterns/general/service-dashboard/configurable-dashboard/index.html.md) by your users, which includes the possibility to add, remove, and arrange [dashboard items](/patterns/general/service-dashboard/dashboard-items/index.html.md) based on their preferences.

### Where dashboards fit in services

The dashboard page may be used as the default landing page of a service for returning users. Make sure to reflect it in your service [side navigation](/components/side-navigation/index.html.md) , by placing the dashboard as first link listed in it.

Some services might have a hub structure, we recommend to add the dashboard page as the first link within the console section in the service side navigation.

## Criteria

|  | Configurable layout | Static layout |
| --- | --- | --- |
| Use-case | Enable users to independently define content type and order within the view | Offer users a defined set of content type and order |
| Content personalisation | Dashboard item types and their position are editable by users | Dashboard items types and their position are predefined and persistent |

### Use-case

A configurable dashboard layout is valuable to provide an editable experience to users that need to select the type of content and their position within the view, for example, to perform troubleshooting.

A static layout is preferred when the order and importance of dashboard items displayed in the page is critical to the user success, for example, when monitoring a campaign.

### Content personalization

When creating a configurable dashboard consider the level or personalization you want to offer to your users. Configurable layout is preferred when users can independently choose the items to visualize, and their order, providing a fully personal experience.

Static layout is preferred when the dashboard items and their position is better offered as predefined and non-editable, ensuring consistency of information.

## General guidelines

### Don't

- Don't combine static and configurable layout in one dashboard. Mixing static items with configurable items can cause user frustration.
