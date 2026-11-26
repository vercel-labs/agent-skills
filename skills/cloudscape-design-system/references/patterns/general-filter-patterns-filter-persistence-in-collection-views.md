---
scraped_at: '2026-04-20T08:52:26+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/filter-patterns/filter-persistence-in-collection-views/index.html.md
title: Filter persistence in collection views
---

# Filter persistence in collection views

Persist filters in URLs to enable easy sharing of a collection view.

## Key UX concepts

### State persistence

Users may need to navigate away from a collection and then return within a flow. These users expect their filters or collection preferences to persist upon returning to the page to prevent data loss.

### Easy sharing of collection views

Data persistence in URLs is especially helpful for users who may need to share a specific collection view. When the URL is copied from one user and shared with another, the recipient will be able to see the specific collection view within the page without manually applying filters and/or preferences.

## Saving filters in URL

On a page where data should persist in the URL, make sure the URL is updated whenever a user makes changes to a collection view.

### Filters

Changes to filters are defined as any action taken on a filter within a collection. For example:

- User adds a new filter to a collection
- User removes a filter from a collection
- User edits a property filter token

### Collection preferences - optional

You can persist specific collection preferences in the URL to capture an entire collection view beyond a collection's filters. For example:

- Page size
- Visible columns

## Loading filters from a shared URL

When a user enters a page, check if the URL contains any persisted data like filters or collection preferences, and apply them to the relevant filtering component immediately. Discard any parts of the loaded data that is not valid.

## Implementation

Ensure that components consuming data from the URL remain controlled, and treat the URL as the single source of truth for data. See example implementation in [saved filter sets](/examples/react/table-saved-filters.html) and [property filter](/examples/react/table-property-filter.html) demos. Note that these examples only include persistence for property filtering.

#### Security considerations

Ensure that all raw data extracted from the URL is properly validated against your expected data format before it is processed by the rest of your application or passed to a Cloudscape component. If invalid data is detected, default to a valid option to maintain a secure and seamless user experience. Additionally, ensure compliance with relevant security policies and best practices, such as encoding data properly and using secure transmission protocols.

Consider the following cases:

- **What goes into the URL:**  

  Avoid including sensitive information to prevent potential data exposure.
- **What is read from the URL:**  

  Validate the data coming from the URL to mitigate risks from maliciously crafted URLs.

## General guidelines

### Do

- Use when it is clear which collection view is persisting filters into the URL. For example, when a [table view](/patterns/resource-management/view/table-view/index.html.md)   is the only collection on a page.

### Don't

- Don't store any sensitive information in URLs.
- Don't use persistence when it's not clear which part of the page the preferences are connected to. For example, when there are multiple tables with property filters on the same page.

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

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Related patterns and components

### Property filter

With the property filter, users can find specific items in a collection by using properties, property values, typing free text, and combining these with operators.

[View Documentation](/components/property-filter/index.html.md)

### Saved filter sets

Enable users to save filter configurations as filter sets and quickly apply them in a collection of resources.

[View Documentation](/patterns/general/filter-patterns/saved-filter-sets/index.html.md)

### Table view

The table view pattern is a collection of resources in a tabular format. It's effective for quickly identifying categories or comparing values in a large text and numerical data set.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/table)

[View Documentation](/patterns/resource-management/view/table-view/index.html.md)

### Card view

A collection of resources represented as cards. It's effective for glancing at small sets of similar resources with text, numerical, and imagery data sets.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/cards)

[View Documentation](/patterns/resource-management/view/card-view/index.html.md)

### Filtering patterns

Filtering patterns let users find specific items in a collection of resources. Users can filter by exact values or by ﬁnite sets of properties.---

[View Documentation](/patterns/general/filter-patterns/index.html.md)
