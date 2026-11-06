---
scraped_at: '2026-04-20T08:52:47+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/selection/index.html.md
title: Selection in forms
---

# Selection in forms

Form elements that allow users to select one or more options from a list, or turn on and off an option.

## Components

Depending on the type of selection (single- or multi-), you can choose between different types of patterns.

### Toggle

Toggles enable users to turn an option on or off, and can result in an immediate change.

[View Documentation](/components/toggle/index.html.md)

### Radio group

Radio group enable users to choose one option from a predefined set.

[View Documentation](/components/radio-group/index.html.md)

### Select

Selects enable users to choose a single item from a list of items.

[View Documentation](/components/select/index.html.md)

### Checkbox

Checkboxes enable users to turn an option on or off.

[View Documentation](/components/checkbox/index.html.md)

### Tiles

Tiles enable users to choose one of a predefined set of options, including additional metadata to facilitate comparisons or progressive disclosure.

[View Documentation](/components/tiles/index.html.md)

### Multiselect

Multiselects enable users to choose multiple items from a list of options.

[View Documentation](/components/multiselect/index.html.md)

### Autosuggest

Autosuggest enables users to choose from a list of suggestions.

[View Documentation](/components/autosuggest/index.html.md)

## Key UX concepts

### Selection patterns

Within a form, you can provide users with predefined options to choose from. To determine which component to use, it's important to consider whether users can select one or multiple options, the number of options they can choose from, and whether they need additional metadata to support the selection. Depending on your use case the following are the common types of selections:

- Single selection: useful when users need to select one option out of a list with two or more choices.
- Multi-selection: useful when users need to select one or multiple options out of a list.
- Boolean selection: useful when users need to select one option that turns on or off a setting.

### Progressive disclosure

With progressive disclosure, information or functionality is revealed as a result of a user action. This reduces how much information a user has to consume at one time and the information density on the page. As users indicate that they want to progress their interaction, additional content and more advanced functionality are progressively revealed. Users can make a binary choice, such as on/off, activated/deactivated, enabled/disabled.

#### Example of progressive disclosure via checkbox

Language settings This service automatically identifies the language in your media. You can also select a specific language. Choose another language (non-default) Language Select the language you want to use. English (United States)
## Single selection criteria

Single selection patterns are useful when users need to make a single, mutually exclusive choice from a set of options. It simplifies decision-making and is appropriate when users are expected to choose just one option that best fits their needs.

Refer to the criteria table below to identify the best component for your use cases.

|  | Radio group | Tiles | Select | Autosuggest |
| --- | --- | --- | --- | --- |
| Number of options | 2 to 7 options | 2 to 7 options | 8+ options | 8+ options, including user generated inputs |
| Additional metadata per option | Descriptions | Descriptions, lists, and/or images | Icons, descriptions, and/or tags | Icons, descriptions, and/or tags |

#### Number of items

The fastest way for users to ﬁnd and select an option in a list of seven or fewer options is to see all the options at once as a group of [checkboxes](/components/checkbox/index.html.md) , [radio buttons](/components/radio-group/index.html.md) , or [tiles](/components/tiles/index.html.md) . For groups of eight or more options, we recommend using a select or autosuggest list. This will reduce the space the selection pattern takes on the page and help the user find options within larger groups.

#### Additional metadata

Sometimes users can make faster, more informed decisions by seeing descriptions, icons (such as database types), or by having comparative details across all options in the list (such as instance storage amount, RAM, or cost). In these cases, use the pattern that works best with the metadata you have.

## Multi-selection criteria

Multi-selection patterns are beneficial when users need to make multiple selections from a list or set of options. It provides flexibility and allows users to choose multiple items or criteria simultaneously.

Refer to the criteria table below to identify the best component for your use cases.

|  | Checkbox | Multiselect |
| --- | --- | --- |
| Number of options | 2 to 7 boolean options grouped below a form field label | 8+ options |
| Additional metadata per option | Descriptions | Icons, descriptions, and or tags |

#### Number of items

The fastest way for users to ﬁnd and select an option in a list of seven or fewer options is to see all the options at once as a group of [checkboxes](/components/checkbox/index.html.md) . For groups of eight or more options, we recommend using a [multiselect](/components/multiselect/index.html.md) list. This will reduce the space the selection pattern takes on the page and to help the user find options within larger groups.

#### Additional metadata

Sometimes users can make faster, more informed decisions by seeing descriptions, icons (such as database types), or by having comparative details across all options in the list (such as instance storage amount, RAM, or cost). In these cases, use the pattern that works best with the metadata you have.

## Boolean selection criteria

Boolean selection is commonly used to activate/deactivate, enable/disable, or turn on/turn off settings, features, or functionalities. Users can choose between two exclusive options, typically represented as "true" (selected) or "false" (not selected).

To provide effective boolean options take into account the following considerations:

- Evaluate whether the selection results in an immediate change visible within the same UI, for example turn on/ turn off light and dark modes.
- Determine if the selection activates or deactivates a group of sub-elements, for example in case of progressive disclosure.
- Assess if the off option to deactivate/disable/turn off requires a description to provide clarity, or if the option that activates/enable/turn on is sufficient to understand the consequences of the selection.
- Decide whether it is necessary to explicitly display both options to highlight the implications of both options.

Refer to the criteria table below to identify the best component for your use case.

|  | Checkbox | Toggle | Radio group | Tiles |
| --- | --- | --- | --- | --- |
| Selection | The selection takes effect at form submission. | The selection results in an immediate change. For example, turning on dark mode. | The selection takes effect  at form submission. | The selection takes effect  at form submission. |
| Sub-options | The option's sub-elements should not include checkboxes. Checkboxes are used to activate and deactivate groups of sub-elements elsewhere on the page. | The option's sub-elements should not include toggles. Toggles are used to activate and deactivate groups of elements elsewhere on the page. | The option's sub-elements should not include radio groups. | The option's sub-elements should not include tiles. |
| Additional metadata | Additional metadata, such as a description, can be included only in the selected state. For example, activated, enabled, on. | Additional metadata, such as a description, can be included only in the selected state. For example, activated, enabled, on. | Additional metadata, such as a description, can be included for both the on and off options. | Additional metadata, such as descriptions, lists, and/or images, can be included for both the on and off options. |

#### Selection

Binary choices made by using checkboxes, radio groups, and tiles should take effect at form submission, for example in a creation or edit flow.

Use a toggle for an option that takes effect immediately, such as turning on a system feature that results in a visible interface change, for example, turn on dark mode.

#### Sub-options

Boolean options can be used to turn on / turn off a group of sub-options, for example users can turn on encryption and then select the preferred encryption type among a list of options.

We recommend to provide consistent progressive disclosure patterns within the same page. For example, when using a toggle to activate a setting and checkboxes as sub-options, use the same configuration for other progressive disclosure patterns in the same page.

#### Additional metadata

Sometimes users can make faster, more informed decisions by seeing descriptions, icons, or by having comparative details across all options in the list.

We recommend to use radio groups or tiles for options which require additional metadata in both on and off states. You can choose between a checkbox or toggle to turn a group of elements on or off when only the on state requires additional metadata.

## General guidelines

### Do

- When using toggles or checkboxes in multiple places in a page to turn groups of elements on and off, use the same parent control, [toggle](/components/toggle/index.html.md)   , or [checkbox](/components/checkbox/index.html.md)   throughout.

### Don't

- In progressive disclosure patterns, don't use the same selection control type for the main option and its sub-options. For example, don't use a checkbox to activate a setting and other checkboxes to display the sub-options. Use a toggle as main control, and checkboxes as sub-options controls.
- In progressive disclosure patterns, don't include controls in between radio options. Place them after the [radio group](/components/radio-group/index.html.md)  .

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

#### Headings

- Use descriptive titles that accurately represent the options.

#### Options

- When the list of options have a group subject (for example, audit log, error log, general log, slow query log) you can avoid including a verb for all the options, and instead include it in the group label.  

  - For example: *Log exports*
- When using a verb, use present-tense and active voice wherever possible.  

  - **Toggle: **     Describe the outcome of the enabled option.    

    - For example: *dark mode*
  - **Checkbox: **     Describe the intent of the enabled option.    

    - For example: *enable enhance monitoring*
  - **Radio group: **     Describe the intent of the options by using label and provide descriptions. Both options should have verbs.
- Use logical ordering by grouping similar options together, or providing options in an order that would best match the user journey.

#### Descriptions

- Descriptions should have end punctuation, with the only exception being if a description ends with an external link icon, which should not have a period after it.
- Keep descriptions short, to the point, and free of jargon. Provide any instructions or necessary information quickly. Any detailed descriptions about the service should sit elsewhere (info link, learn more link, card description).
- Keep sentence structure similar across all grouped options. This provides users familiarity, allowing them to more quickly navigate through the experience.
