---
scraped_at: '2026-04-20T08:53:04+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/timestamps/index.html.md
title: Timestamps
---

# Timestamps

Timestamps display the relative or absolute datetime at which an event has occurred or will occur.

## Criteria

|  | Relative | Absolute human-readable | Absolute ISO |
| --- | --- | --- | --- |
| When to use | Users need to quickly see how long ago an event occurred, or how far in the future it will occur, and they don't need the specific datetime. | Users need a specific date and time for when an event occurred or will occur. | Users need a specific date and time in the standardized ISO format (typically when using timestamps in code). |

## Examples

### Relative

Creation date 5 hours ago by [plrs](about:blank/index.html.md)

Scan completed 6 days ago

### Absolute human-readable

Creation date October 3, 2012, 09:32 (UTC+3:30) by [plrs](about:blank/index.html.md)

Bucket deleted January 31, 2010, 14:56 (UTC+3:30) by [plrs](about:blank/index.html.md)

### Absolute ISO

`{ "creationDate": "2010-01-19T14:32:35+03:00" }`
## Key UX concepts

### Formats

Use the timestamp that's most appropriate to your users' needs. Relative timestamps are easier for users to read, so we recommend them for most use cases.

### Labels

Timestamps should always be accompanied by a label that clearly and consistently describes what event the timestamp references. You can display a timestamp label with the timestamp, above it as a heading (such as the *key* in a [key-value pair](/components/key-value-pairs/index.html.md) ), or as a column header in a [table](/components/table/index.html.md).

For example: *Resource edited*

### Source of change

When it's important to identify who or what made a change, add the user or system's name after the timestamp and link to its profile.

For example: *Template edited 6 hours ago by * <a href="about:blank#"> *plrs*</a>

## Formats

### Relative timestamps

- Relative timestamps for events in the past use the format: *\[number\] \[unit of time\] ago.*   For example: *36 minutes ago.*
- Use the plural form of the time unit when necessary. For example: *1 year or 2 years*  .
- When the event is happening in the future, use the format: *In \[number\] \[unit of time\].*   For example: *In 36 minutes*

#### Relative timestamp units

Use the level of granularity appropriate for the event.

| Time Frame | Unit |
| --- | --- |
| 0 - 59 seconds | Now |
| 1 - 59 minutes | # minutes ago |
| 1 - 24 hours | # hours ago |
| 1 - 31 days | # days ago |
| 1 - 4 weeks | # weeks ago |
| 1 - 12 months | # months ago |
| More than 12 months | # years ago |

### Absolute human-readable timestamps

Absolute human-readable timestamps in the US, Canada, Palau, Micronesia, and the Philippines use this format: "Month DD, YYYY, hh:mm (UTC±h:mm)".

For example: January 31, 2010, 14:32 (UTC+3:30)

For additional timestamp locale formats, you can use localization libraries.

### Absolute ISO timestamps

Absolute ISO timestamps use the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: YYYY-MM-DDThh:mm:ss±hh:mmZ. For example: 2010-01-31T14:32:35+03:00

In the ISO timestamp, T is used as a divider between the date and time and Z is the zone designator for the zero UTC offset. If the timestamp is doesn't require time granularity, only display the date portion of the timestamp. For example: 2010-01-31

## General guidelines

### Do

- Since relative dates are easier to read, we recommend using them in most situations.
- When reporting usage for billing, relative timestamps should use the same time unit as the resource is being billed at. For example, for a resource billed by the hour, use 32 hours, not *1 day, 8 hours.*

### Don't

- Don't abbreviate the words in timestamps. For example, always use* January*   , not* Jan*   , and* seconds*   not* sec.*

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

#### Labels

- Use the format: *\[Noun\] \[verb\]*  

  - For example:* *    

    - *Endpoint created*
    - *Template edited*
    - *Scan terminates*
- For events that occurred in the past, use past tense.  

  - For example:* Certificate expired*
- For events that occur in the future, use future tense.  

  - For example: *Certificate expiring*
- Don't include *date*   , *time*   , or *timestamp*   in the label (with one exception, below).  

  - For example:* *     Use *Role modified*     instead of *Role modified date *
- In tables, where you report the status of a number of resources, processes, or activities that won't all begin or end at the same time, use the format: *\[noun\] \[verb\] time*  

  - For example:    

    - *Training job start time *
    - *Training job end time*
- Add *last*   to a label only when the event can reoccur and users need to know the most recent occurrence.  

  - For example: *Role last modified*

#### Source of change

- Use the format: *\[label\] \[timestamp\] by \[name\]*   . The name is the user or service that made the change.  

  - For example: *Template edited 6 hours ago by * <a href="about:blank#"> *plrs*</a>

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Relative timestamps

- For relative timestamps, provide users access to the corresponding absolute human-readable timestamps by doing the following:  

  - 1. Wrap the relative timestamp in a `<time>`     element and set the `datetime`     attribute to the absolute human-readable timestamp. For more information, see [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time)    .
  - 2. Set the `<time>`     element's `title`     attribute to the absolute human-readable timestamp, which allows users to hover over the timestamp to access the absolute human-readable format.    

    - For example: `<time title="January 31, 2010, 14:32 (UTC+1:00)" datetime="January 31, 2010, 14:32 (UTC+1:00)">10 days ago</time>`
