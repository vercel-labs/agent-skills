---
scraped_at: '2026-04-20T08:52:28+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/filter-patterns/index.html.md
title: Filtering patterns
---

# Filtering patterns

Filtering patterns let users find specific items in a collection of resources. Users can filter by exact values or by ﬁnite sets of properties.

## Patterns

We provide three filtering patterns for table and cards views. Choose a pattern based on the complexity of the collection of resources.

### Text filter

With a text filter, users can enter text that's used to match specific items in a collection.

[View Documentation](/components/text-filter/index.html.md)

### Collection select filter

A select filter helps users find specific items in a collection by choosing one or two properties.

[View Documentation](/components/collection-select-filter/index.html.md)

### Property filter

With the property filter, users can find specific items in a collection by using properties, property values, typing free text, and combining these with operators.

[View Documentation](/components/property-filter/index.html.md)

## Criteria

|  | Text filter | Collection select filter | Table property filter |
| --- | --- | --- | --- |
| Complexity of the resource | Simple resource (small set of properties) | Simple resource (small set of properties) | Complex resource (large set of properties) |
| User goals | Find resources that match an exact text query | Find resources with overlapping, defined values | Find resources with multiple combinations of values |
| Selection of values | - | Single selection of a value for each property | Multiple selection of values for each property |
| Operators | - | "And" operator | "And", "Or", "Not", "And not" and "Or not" operators |

### Complexity of the collection of resources

The complexity of the collection of resources depends on the properties that are required to describe the resources.

### User goals

Because a collection of resources can be extensive and the view is conﬁgurable, users expect the ﬁlter patterns to operate within the full collection of resources, and not just the visible resources.

If users tend to know exactly the value or term they are looking for, use the [text filter](/components/text-filter/index.html.md).

If the common behavior of users is to filter a resource by only one or two properties, use the [collection select filter](/components/collection-select-filter/index.html.md) . For example: by "status" or "type".

For complex products with large collection of resources, use the [property filter](/components/property-filter/index.html.md) so that users can combine multiple properties, values, and operators.

### Selection of values

If the resources are easy to find through filtering by a specific value for one or two properties, use the collection select filter.

The collection select filter doesn't support selecting multiple values for a single property.

If users need to combine multiple values that correspond to one property, use the property filter. Each value can be removed individually for further filtering. For example: Status set to *Error* and Status set to *Warning*.

### Operators

Display operators when at least two filters are defined. The "and" operator typically is enough to narrow down most resources. By default, the operator is always set to "and" for the collection select filter, and can be modified only in the property filter.

Use a property filter if narrowing down a complex collection of resources is best done with the union, intersection, or complement of properties ("and", "or", "and not", and "or not" operators). If more complex queries are required, combine these operators using a token group.
