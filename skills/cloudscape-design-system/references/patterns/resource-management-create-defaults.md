---
scraped_at: '2026-04-20T08:53:12+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/create/defaults/index.html.md
title: Defaults
---

# Defaults

Reduce friction during resource creation by applying defaults that are both transparent and useful to the user.

 [View demo](/examples/react/form.html)
## Key UX concepts

**Reduce friction**
Use well-chosen defaults in as many fields as possible to allow users to quickly set up a resource with minimal configuration.

**When defaults apply**
Defaults typically apply at creation or edit time. Dynamic configurations reflect system-managed behavior and should be surfaced transparently.

**Provide visibility on API defaults**
Users should understand what happens when the field is left blank and the API applies a value. Make this outcome clear by either showing the value in the field or explaining the behavior when the field is left blank.

## Types of defaults

### Service defaults

Values pre-populated by the service before creation to guide user setup. Examples include recommendations, account preferences, or prior choices.  For example, pre-selecting an encryption key.

A B
#### A. Option

Populate and pre-select with the fixed value.

#### B. Description - optional

Provide additional details of how the value is defined.

### API defaults

Values applied by a service backend when a field is left empty or no selection is made. These may be pre-filled or pre-selected to reflect what will be applied if the user takes no action. Make users aware of this behavior either by showing the fixed value or by indicating that the value will be determined on creation or runtime.

There are three types:

#### 1. Fixed

Known values pre-filled to show the user what will be applied.  For example, pre-populating an input with a volume initialisation rate with the value shown in the constraint text.

A B
#### A. Option

Populate with the fixed value.

#### B. Constraint

Include the value so the user knows what value will be applied if the input is cleared.

#### 2. Automatic

Values determined at creation time. For example, an availability zone that is defined on creation.

A B C
#### A. Option

Provide details on the value and be as descriptive as possible.

#### B. Description

Provide additional details on how the value will be determined.

#### C. Help - optional

Provide help panel content to explain how the value is defined if this can not be covered in the description only.

#### 3. Dynamic

Values determined and updated at runtime based on system conditions or configuration logic. For example, an Auto Scaling group adjusts its desired capacity to maintain a target CPU utilization of 50%. These values are typically not shown in the UI as a selection, and the system manages them dynamically after creation.

## General guidelines

### Do

- Confirm that defaults shown match the actual API behavior at runtime to prevent discrepancies between what users see and what's applied.
- Clearly specify the outcome of the automatic default value. For example: *'Optimized value'*   , with a description such as: *'Availability zone will be assigned automatically'*   .  If this cannot be fully conveyed in the description alone, provide additional guidance in the help panel.

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

#### Pattern specific guidelines

- Clearly describe what the API will do if the user takes no action.  

  - Example: "A default value of '1' will be applied if left blank."
- When a value is pre-selected, explain what the API will apply and when.  

  - Example: "Availability Zone will be assigned automatically on creation."
- Match the timing language to the type of API default, for example:  

  - Automatic: "assigned automatically on creation."
  - Dynamic: "adjusted automatically at runtime."
- Avoid redundancy between the option label and description.  

  - If the label already implies automation ("Optimized"), the description should clarify what will happen, not repeat it.
