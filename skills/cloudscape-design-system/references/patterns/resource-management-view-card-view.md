---
scraped_at: '2026-04-20T08:53:47+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/view/card-view/index.html.md
title: Card view
---

# Card view

A collection of resources represented as cards. It's effective for glancing at small sets of similar resources with text, numerical, and imagery data sets.

 [View demo](/examples/react/cards.html)
## Key UX concepts

- #### Default

  Cards view of all user resources within the AWS service.
- #### Data density

  Cards view of all user resources displayed with more or less entries per page, set by the user view preferences.
- #### Filter

  Reduction of the list of user resources by a specific query set by the user.
- #### Empty state

  Cards view in a state when data has been successfully fetched, and the cards collection contains no resources (Example: user deleted all resources).
- #### Error state

  Cards view in state when a problem occurred fetching user resources. Supported with a [flash message](/components/flashbar/index.html.md)   pattern to notify the user in case of request timed-out or no access.

## Building blocks

A B C D E F G H I A B C D E F G H I
#### A. Flash message

Use a flash message to notify the user about the progress and outcome (success or failure) of the actions taken upon the resources.

#### B. Breadcrumbs

Use the service name for the root page in the breadcrumbs, and make it a link. Follow it with the page title, which is usually the category name of the service items (For example: *Resources, Distributions, Instances* ).

#### C. Cards

Use the "full-page" `variant` of the [cards](/components/cards/index.html.md) component for this pattern.

#### D. Header

Enabling a sticky header is optional, but recommended, for these potentially lengthy list pages. If enabled, use the "awsui-h1-sticky" header `variant` so the title reduces its size on scroll.

#### E. Filter - optional

Text filter helps users with an extensive number of table rows to quickly find one or several resources with a matching query. The entire set of columns are used as a base for the filter.

We recommend building in a custom message, with a clear call to action to clear the filter, when the query doesn't match with any resources.

#### F. Pagination - optional

Pagination helps users with an extensive number of resources to navigate through them across multiple pages. Users can change the default number of table rows per view on [Resources preferences](/components/collection-preferences/index.html.md).

Display the pagination even if the resources set fits in one page.

Navigating via the pagination functionality overwrites any selection.

#### G. Preferences - optional

Use preferences to allow users to view and change their display configuration. User configurations in preferences affect the following settings of the table view:

- Number of rows displayed per page (Pagination)
- Which columns are visible or set to hidden
- Order of the columns displayed
- Change of view pattern: from table view to card view, and vice versa
- Which columns are sticky

#### H. Selection - optional

Cards can be selected individually or in bulk (multiple selection) by using the checkbox mechanism. Actions initiated after selection affect only the selected, visible cards. Selection is overwritten by the following:

- Pagination
- Preferences
- When the selections are no longer visible on the page

When there are no interactive elements in a card use the full card selection feature to increase the target area for users.

#### I. Side navigation

Navigation is open by default on view pages. For more information about structuring side navigation content, follow the guidelines for [side navigation](/patterns/general/service-navigation/side-navigation/index.html.md).

## General guidelines

### Do

- Use one card per resource.
- Surface only relevant and repeatable information across resources. Treat it as a quick reference for each resource.
- Each card links to the [details view](/patterns/resource-management/details/index.html.md)   so users can access more detailed information about the resource.
- Use cards to display non-columnar, yet comparable data.
- Global actions (buttons) should be included in the header, not in each card.
- Cards are dedicated to resource collection only. Use the [container](/components/container/index.html.md)   component with media to present a card-like container with an image.
- To enable easy sharing of a table view, refer to the [filter persistence in collection views](/patterns/general/filter-patterns/filter-persistence-in-collection-views/index.html.md)   pattern.

### Don't

- Do not flip over to reveal information on the back of a card.
- Card collection should not be used for page layout purposes.
- Don't use the [content layout](/components/content-layout/index.html.md)   component on this type of page. Instead, use the "full-page" `variant`   of the [cards](/components/cards/index.html.md)   component to implement this pattern.

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

#### Text filter - optional

- Use sentence case.
- Don't use end punctuation.

#### Table header

- Follow the writing guidelines for [tables](/components/table/index.html.md)   and [cards](/components/cards/index.html.md)  .

#### Custom messages

- Use active voice wherever possible. Use passive voice only to avoid blaming the users.
- Avoid excessive words, such as *please*  .
- Avoid uppercase text and exclamation points.

#### Empty state - optional

- The goal of this message is to inform the user that data has been successfully fetched, and the table contains no resources. Consider incorporating:
- A clear identification of the state.  

  - For example: *Empty resources.*
- A descriptive explanation of the reasons why the state is displayed.  

  - For example: *No resources to display or You have no resources created.*
- The message can be extended by adding a call to action.  

  - For example: *Create a resource.*

#### Error state - optional

- Make sure to inform the user in concise and clear language, that the system encountered an error retrieving resources. Consider incorporating:  

  - A clear identification of the state.    

    - For example: *Could not retrieve resources.*
  - A descriptive explanation on the reasons why the state is being displayed.    

    - *For example: Could not access your resources.*
  - A single call to action to recover from this state.    

    - For example: *Refresh or Contact support*

#### Zero results - optional

- Use concise and clear language for your custom message in cases of zero results resulting from the text filter. Consider incorporating:
- A clear identification of the state.  

  - For example: *Zero results *     or *No results*
- A descriptive explanation of the reasons why the state is displayed.  

  - For example: *No resources match your search.*
- A single call to action to recover from this state.  

  - For example: *Clear filter or Go back to default.*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- Users should be able to access and move the active state using their keyboard (arrow keys). Each single resource has focus on the navigation (links) and on the selection mechanism (checkbox).

## Related patterns

### View resources

With the view resources patterns, users can find and take action on a collection of resources in the most efficient way possible.

[View Documentation](/patterns/resource-management/view/index.html.md)

### Table view

The table view pattern is a collection of resources in a tabular format. It's effective for quickly identifying categories or comparing values in a large text and numerical data set.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/table)

[View Documentation](/patterns/resource-management/view/table-view/index.html.md)

### Split view

A collection of resources presented as table or cards and paired with a [split panel](/components/split-panel/index.html.md) for contextual resource details. It's effective for quickly browsing or comparing key resource details.---

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/split-panel-multiple)

[View Documentation](/patterns/resource-management/view/split-view/index.html.md)
