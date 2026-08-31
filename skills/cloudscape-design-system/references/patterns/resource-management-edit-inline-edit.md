---
scraped_at: '2026-04-20T08:53:43+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/edit/inline-edit/index.html.md
title: Inline edit
---

# Inline edit

Use inline edit on views where information needs to be updated often, or when you want a user to edit a resource property across multiple resources.

 [View demo](/examples/react/table-editable.html)
## Key UX concepts

### Inline table cell edit

Within a [table](/components/table/index.html.md) , editable cells are identified in two ways: by an edit icon in a table column, and by an edit icon shown on hover. When the user chooses an editable value, the value changes into an input, and a dismiss and confirm icon appear. Data is submitted once user selects the confirm icon, and a success icon appears until the next value is edited, or the page is refreshed.

#### Example of table with inline cell edit

### Refresh and pagination

Due to applied filters or pagination an edited item might disappear from the view, disorienting users. In a table that has an active filter, or has pagination, changes to values will be displayed until the user refreshes the table via the refresh button in the table header, or goes to another page.

### Sorting

When a user changes values and there is an active sorting applied the table column, the column will go in an unsorted state to display the change until the user sorts again the column.

### Validation

 [Validation](/patterns/general/errors/validation/index.html.md) is shown in context of the field being edited, an error message is displayed which relates to the requirements of the input type.

Data validation happens first when the change is submitted, and subsequently when the required criteria are met.

[View Documentation](/patterns/general/errors/validation/index.html.md)

## General guidelines

### Do

- Always provide a visual indication that the value is editable. For example, an icon like in the editable cells in tables.
- Use [validation](/patterns/general/errors/validation/index.html.md)   to provide contextual error messages.
- Consider adding [constraint text](/components/form-field/index.html.md)   messages to guide users on the field requirements.
- Always allow users to save or discard changes.
- Always include a refresh button in table header to enable users to refresh the updated data set.
- Always unsort columns where sorting is active when a user changes a cell value in a table.

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

#### Error text

- Use complete sentences and terminal punctuation.

#### Constraint text

- If there are constraints on the value that users enter into an input field, describe them under the field. Constraints can include password requirements, a URL format for a specific service, or the maximum number of characters that a user can enter into a field.
- Use complete sentences with periods except when listing valid characters, as shown previously. If space is limited, you can use a sentence fragment without a period.
- Keep constraint text brief. Two lines is the limit.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Related patterns

### Edit resource

With the edit resource pattern, users can edit properties and configurations of resources.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/edit)

[View Documentation](/patterns/resource-management/edit/index.html.md)

### Page edit

Use the page edit pattern when you want users to manage an item by editing its properties and configuration in bulk.---

[View Documentation](/patterns/resource-management/edit/page-edit/index.html.md)
