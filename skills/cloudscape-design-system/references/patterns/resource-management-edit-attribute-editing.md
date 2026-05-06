---
scraped_at: '2026-04-20T08:53:39+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/edit/attribute-editing/index.html.md
title: Attribute editing
---

# Attribute editing

Create, edit, and delete resource attributes.

## Objectives

### Simple attribute editing

Simple attribute editing uses rows of related properties to quickly define lists of multiple resource configurations (for example, key-value pairs or Identity roles).

### Advanced attribute editing

Advanced attribute editing uses expandable sections to enable configuring detailed attributes that require additional context or multiple sub-sections with detailed settings like instance type, configuration, or network settings (for example EC2 storage volumes or load balancer listeners).

## Criteria

|  | Simple | Advanced |
| --- | --- | --- |
| Complexity | Basic inputs that are clear to the user without additional form field descriptions or help. | Additional form-field details or nested attribute editing. For example, form field descriptions. |
| Context | Individual rows relate to each other in a structure that often resembles a data table. This layout supports quick comparisons and efficient at-a-glance understanding. | Sections are standalone entities with less of a dependence on visually comparing data at a glance. |

### Complexity

Advanced attribute editing allows for more complex data formatting like form headings, descriptions, sub-sections, or nested attribute editors, while simple attribute editing utilizes rows of related inputs.

### Context

A user's understanding of how the individual resource attributes relate to each other is an important consideration for ensuring that data relationships are successful and logical. When there is a need to compare values directly with one another, the simple attribute editing pattern is preferred.

## Building blocks - simple attribute editing

When editing rows of attributes, use the [attribute editor](/components/attribute-editor/index.html.md) component.

A B C
#### A. Attribute inputs

Users can specify multiple attributes per row. Each attribute is described by a label. Typically no more than six attributes are used in a given row. Inputs can have equal widths or custom widths.

#### B. Removing rows

Users can remove attribute rows with the *Remove* button.

#### C. Adding rows

Use a normal button to allow users to add as many rows as they need or up to a fixed maximum number, when applicable.

D
#### D. Row actions - optional

Use a [button dropdown with main action](/components/button-dropdown/index.html.md) when additional actions are needed, or use the [icon button dropdown](/components/button-dropdown/index.html.md) for in-context actions when reducing visual noise and optimizing content density is a priority.

## Building blocks - advanced attribute editing

Advanced attribute editing is achieved using a combination of [expandable sections](/components/expandable-section/index.html.md) and a series of [form fields](/components/form-field/index.html.md).

A B C D E
#### A. Expandable section

Use the [stacked variant](/components/expandable-section/index.html.md) of the expandable section. The label of this section should align with its container's heading, and similarly, should be a noun describing its content, not an action.

#### B. Attribute input content

Use a series of form fields to create the inputs in an advanced attribute editor, utilizing necessary content structures to reinforce hierarchy and appropriate information architecture.

#### C. Adding sections

The *add new item* button lives outside of the last section in a flow.

#### D. Removing sections

Users can remove sections with the *Remove* button. Use the [delete with simple confirmation](/patterns/resource-management/delete/delete-with-simple-confirmation/index.html.md) pattern to prevent accidental deletion of configured attributes.

#### E. Section actions - optional

Use a [button dropdown with main action](/components/button-dropdown/index.html.md) when additional actions are needed

## Other features

### Nested attribute editing

When an [attribute editor](/components/attribute-editor/index.html.md) component is used inside of an advanced attribute editor section, use the [icon button dropdown](/components/button-dropdown/index.html.md) for row actions and the [inline link button](/components/button/index.html.md) for adding rows to visually reinforce the appropriate hierarchy.

## General guidelines

### Do

- Use resource attributes to describe, define, or categorize individual resources.
- Use simple attribute editing when the rows of resource attributes relate to each other.
- Use the [delete with simple confirmation](/patterns/resource-management/delete/delete-with-simple-confirmation/index.html.md)   pattern for removing advanced attribute editor sections.
- Use [field validation](/patterns/general/errors/validation/index.html.md)   for both simple and advanced attribute editing.

### Don't

- Don't use more than one action button for row or section-based actions. If you need more than one action, use an icon button dropdown with main-action.
- Don't use empty states for advanced attribute editors. There should always be at least one section visible.

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

### Pattern-specific writing guidelines

- Use complete sentences with periods, where possible. If space is limited, you can use a sentence fragment without a period.
- When providing information on the number of available attributes to add use the format:  

  - *You can add up to \[number\] more \[object(s)\]*    .
  - For example:    

    - *You can add up to 30 more headers.*
    - *You can add up to 1 more header.*
- If no attributes have been added, use the format:  

  - *You can add up to \[number\] \[object(s)\].*
  - For example:    

    - *You can add up to 50 headers.*
- When the limit for attributes is reached, use the format:  

  - *You have reached the limit of \[number\] \[object(s)\].*
  - For example:    

    - *You've reached the limit of 50 headers.*

**Labels**
Follow the writing guidelines for [form field label](/components/form-field/index.html.md).

**Info links**
Follow the writing guidelines for [info links](/components/link/index.html.md).

**Button**

- For button labels, use one of two formats:  

  - *\[Verb\] \[object\] *    

    For example:    

*Add new header*
  - *\[Verb\] *    

    For example:    

*Remove*
- Follow the writing guidelines for [button](/components/button/index.html.md)  .

**Removing attribute rows**
When a row is marked for removal, inform the users about the consequences of this action. For example: *After you save changes, this header is removed.*

**Placeholder text**
Follow the writing guidelines for [placeholder text](/components/input/index.html.md).

**Autosuggest**
Follow the writing guidelines for [autosuggest](/components/autosuggest/index.html.md).

**Select**
Follow the writing guidelines for [select](/components/select/index.html.md).

**Empty state**
Follow the writing guidelines for [empty states](/patterns/general/empty-states/index.html.md).

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

#### Pattern-specific accessibility guidelines

- Follow the guidelines for the [attribute editor](/components/attribute-editor/index.html.md)   component.
- When implementing advanced attribute editing using expandable sections follow the principles from the attribute editor component accessibility guidelines. For example, when adding a new section, expand the section and focus the first input within the section.
