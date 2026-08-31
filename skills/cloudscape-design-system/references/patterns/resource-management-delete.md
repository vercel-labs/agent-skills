---
scraped_at: '2026-04-20T08:53:26+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/delete/index.html.md
title: Delete patterns
---

# Delete patterns

With delete patterns, users can delete existing resources.

## Patterns

When deleting resources, you can choose between different levels of friction.

### One-click delete

With one-click delete, users can quickly delete low-risk, non-critical resources that are easy to recreate. The deletion is executed immediately once invoked by users. This type of deletion does not use confirmation or friction.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/delete-one-click)

[View Documentation](/patterns/resource-management/delete/one-click-delete/index.html.md)

### Delete with simple confirmation

Delete with simple confirmation is used for single resource or bulk deletions that are not likely to break users' running infrastructure, but are still being performed on resources that cannot be quickly recreated. Use a modal to ask users to confirm that they wish to proceed with the deletion.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/delete-with-simple-confirmation)

[View Documentation](/patterns/resource-management/delete/delete-with-simple-confirmation/index.html.md)

### Delete with additional confirmation

Delete with additional confirmation is used when deleting a resource could have serious, irreversible or cascading consequences. It requires users to add written confirmation before they can initiate the deletion. Used for single resource or bulk deletions.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/delete-with-additional-confirmation)

[View Documentation](/patterns/resource-management/delete/delete-with-additional-confirmation/index.html.md)

## Flow charts

## Delete patterns - Successful

## Delete patterns -  Unsuccessful

## Criteria

|  | One-click delete | Delete with simple confirmation | Delete with additional confirmation |
| --- | --- | --- | --- |
| Severity | No effect on running infrastructure | Resource is running, but will not impact other infrastructure | Resource is running, and deleting it might break other infrastructure |
| Number of resources deleted | Single resource | Single non-critical resource, bulk deletion of multiple non-critical resources | Single, critical resource, bulk deletion of multiple critical resources, deleting a resource together with related resources |
| Cost of recreation | Low | Moderate/high | High |
| Prerequisites | No actions need to be taken prior to deletion | No actions need to be taken prior to deletion | Might require deactivating related resources during the deletion process |
| Feedback | Item is instantly removed from the page. No alert needed. | Flashbar/spinner | Flashbar/spinner |

### Severity

How severe are the consequences of deleting the resource? If your resource is running, can deleting it cause a downtime or outage? Does deleting the resource impact other resources and infrastructure? Use one-click delete only for resources that aren't running and have no affect on running infrastructure. In all other cases, use a simple confirmation or additional confirmation modal.

### Cost of recreation

Cost refers to the expense of recreating the resource, as well the time and effort to recreate it. How costly is it to recreate the resource if it's unintentionally deleted? Even if the create form is relatively short and it doesn't take much effort to recreate the resource, the cost can still be high if the resource takes hours on the backend to spin up.

Use one-click delete only for resources that can be recreated with minimal effort and time. In all other cases, use a simple confirmation or additional confirmation modal.

### Prerequisites

Can the resource be deleted immediately, or do other actions need to be taken first? Are there steps that users should take prior to deletion to prevent data loss or recover from a deletion in the future?

Use the modal to communicate prerequisites and recommend best practices. For example, when the user must first deactivate a resource before deleting it, or to create a snapshot to quickly restore the resource using the same configurations. Only use one-click delete when there are no prerequisite actions or applicable best practices that must be taken prior to deletion.
