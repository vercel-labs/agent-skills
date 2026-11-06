---
scraped_at: '2026-04-20T08:52:38+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/loading-and-refreshing/index.html.md
title: Loading and refreshing
---

# Loading and refreshing

Loading and refreshing is used to refresh collections of data in the interface.

 [View demo](/examples/react/table-editable.html)
## Key UX concepts

### Loading and refreshing

Loading is the process of bringing data or content into an application or a web page. For example, loading at first page visit to make information available to users. Refreshing is the action of updating or reloading the current state of a system or application. It can be done manually by a user or automatically by the system, to ensure that the displayed information is current and up-to-date.

[View Documentation](/patterns/general/loading-and-refreshing/index.html.md)

### Refresh types

Refresh can be applied in scenarios when data is fetched from the backend, such as in a [collection view](/patterns/resource-management/view/index.html.md) , within a data list.

- **Manual refresh**   is triggered by user interaction, via a [button](/components/button/index.html.md)   , ensuring control over when the data is updated. For example, a [table](/components/table/index.html.md)   with a large data set where users need to perform actions on several resources.
- **Automatic refresh**   is achieved by refreshing the data set at predefined intervals, for example 10 seconds, offering real-time updates and continuous synchronization with the dataset. For example, a [select](/components/select/index.html.md)   where the list represents resources created across consoles.

Choose the best refresh type depending on your use-case, user needs, and API type.

## Manual refresh

### Successful refresh

You can include a refresh button as part of the [header](/components/header/index.html.md) , for example in a [table](/components/table/index.html.md) . Keep the dataset visible while the refresh operation is ongoing, and enable users to perform actions on the resources. Once the data set is refreshed, display a timestamp to provide users with information on the outcome of the operation.

### Items

Last updated
December 21, 2023, 14:29 (UTC+01:00)

Edit Delete Create 

| Variable name | Current value | Description |
| --- | --- | --- |
| First | This is the first item |  |
| Second | This is the second item |  |
| Third | This is the third item |  |
| Fourth | This is the fourth item |  |
| Fifth | This is the fifth item |  |
| Sixth | This is the sixth item |  |
### Refreshing issues

Sometimes refreshing can take longer than expected or fail for some resources due to, for example, availability zone outages. When refreshing can't be completed within 1-10 seconds, communicate that the process is taking longer by using a status indicator next to the refresh button.

- If the API call returns issues with the refreshing, use a [pending status indicator](/components/status-indicator/index.html.md)   to inform users. Include in the popover additional information to explain the issues, such as longer time required to perform the refresh.
- If the API call returns partial or total failure of the refreshing, use a [warning status indicator](/components/status-indicator/index.html.md)   to inform users. Include in the popover additional information to explain the failure and provide actions to support users, such as retry or filter out affected availability zones.

### Items

Loading issues Refreshing table content Edit Delete Create 

| Variable name | Current value | Description |
| --- | --- | --- |
| First | This is the first item |  |
| Second | This is the second item |  |
| Third | This is the third item |  |
| Fourth | This is the fourth item |  |
| Fifth | This is the fifth item |  |
| Sixth | This is the sixth item |  |
### Items

Loading failed Edit Delete Create 

| Variable name | Current value | Description |
| --- | --- | --- |
| First | This is the first item |  |
| Second | This is the second item |  |
| Third | This is the third item |  |
| Fourth | This is the fourth item |  |
| Fifth | This is the fifth item |  |
| Sixth | This is the sixth item |  |
### Form controls

You can include a refresh button next to a [form](/components/form/index.html.md) control, for example a [select](/components/select/index.html.md) , to update the data set with the latest information. If an error occurs, display an [error message](/patterns/general/errors/error-messages/index.html.md) to communicate the status.

## Loading

Loading is the process of making information available to users, for example at first page visit. In a collection view a table in a [loading state](/components/table/index.html.md) is used to indicate that the entire data set is being retrieved, and the page will be populated with available data.

### Items

Edit Delete Create 

| Variable name | Current value | Description |
| --- | --- | --- |
| Loading items |  |  |
### Loading issues

Sometimes loading can fail unexpectedly, for example, due to server errors, request time-out, or network issues. To notify of a data fetching error, use an [alert](/components/alert/index.html.md) inside the table. When using progressive loading in a table, if the loading fails, use an error status indicator with the reason for the error within a popover to communicate the status.

### Form controls

In a form control, for example a [select](/components/select/index.html.md) , a [loading state](/components/select/index.html.md) is used to communicate that the entire data set is being retrieved.

Security group

## General guidelines

### Do

- For manual refresh, include the refresh button as part of the [header actions](/components/header/index.html.md)   . Include a timestamp to inform users on the outcome of the refresh operation.

### Don't

- Don't add refresh buttons in the interface, except when users need to perform an explicit action to refresh only a part of the interface.

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

#### Loading message

- Don't use articles ( *a, an, the*   ).
- Don't use end punctuation.

#### Popover

- Follow the guidelines for [popover](/components/popover/index.html.md)  .

#### Table

- Follow the guidelines for [table](/components/table/index.html.md)  .

#### Select

- Follow the guidelines for [select](/components/select/index.html.md)  .

#### Status indicator

- Follow the guidelines for [status indicator](/components/status-indicator/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- When using a refresh button, make it accessible by providing a label (aria-label). Describe the refresh action by setting the `ariaLabel`   property in the [button](/components/button/index.html.md)   component. Also set the `loadingText`   property to communicate the loading state.
- Use an ARIA live region to announce updates to the last refresh timestamp.
