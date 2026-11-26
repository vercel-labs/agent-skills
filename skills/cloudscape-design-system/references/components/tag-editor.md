---
scraped_at: '2026-04-20T08:49:38+00:00'
section: components
source_url: https://cloudscape.design/components/tag-editor/index.html.md
title: Tag editor
---

# Tag editor

An extension of the attribute editor built with integrated logic. With the tag editor, users can create, edit, or delete resource tags.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/tag-editor) [View in demo](/examples/react/manage-tags.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/tag-editor/index.html.json)

## Development guidelines

#### State management

The tag editor component is controlled. Set the `tags` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

TagEditorWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAddButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findAdditionalInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findEmptySlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLoadingText | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findRow | [TagEditorRowWrapper](/index.html.md) &#124; null | Returns a row for a given index. | row:1-based row index |
| findRows | Array<[TagEditorRowWrapper](/index.html.md)> | Returns all rows.To find a specific row use the findRow(n) function as chaining findRows().get(n) can return unexpected results. | - | TagEditorRowWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCustomAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findField | [FormFieldWrapper](/components/form-field/index.html.md) &#124; null | Returns a field for a given index | column:1-based column index |
| findFields | Array<[FormFieldWrapper](/components/form-field/index.html.md)> | Returns all fields. Fields are supplied in the definition property of the component. | - |
| findRemoveButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findUndoButton | [LinkWrapper](/components/link/index.html.md) &#124; null | - | - |
## Integration testing APIs

TagEditorWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAddButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findAdditionalInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findEmptySlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLoadingText | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findRow | [TagEditorRowWrapper](/index.html.md) | Returns a row for a given index. | row:1-based row index |
| findRows | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TagEditorRowWrapper](/index.html.md)> | Returns all rows.To find a specific row use the findRow(n) function as chaining findRows().get(n) can return unexpected results. | - | TagEditorRowWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCustomAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findField | [FormFieldWrapper](/components/form-field/index.html.md) | Returns a field for a given index | column:1-based column index |
| findFields | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FormFieldWrapper](/components/form-field/index.html.md)> | Returns all fields. Fields are supplied in the definition property of the component. | - |
| findRemoveButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findUndoButton | [LinkWrapper](/components/link/index.html.md) | - | - |
## General guidelines

### Do

- Display tag editor in loading state until all resource tags have been  loaded.
- Use the tag editor to manage tags only in [create](/patterns/resource-management/create/index.html.md)   and [edit](/patterns/resource-management/edit/index.html.md)   flows.
- Always display an error message when tag editor fails to load key or value suggestions.
- Always use placeholders. They provide additional information when the  labels are out of screen view.

## Features

The tag editor component is an extension of [attribute editor](/components/attribute-editor/index.html.md) . It integrates into a service so that your users can manage resource tags.

- #### Tags

  Tags are metadata assigned to a resource, consisting of a key (mandatory) and a value (optional).

### Built-in functions

- #### Adding tag rows

  Users can create new tags by adding new rows with the *Add new tag*   button. New tags are associated with the resource when the form is submitted.
- #### Removing tag rows

  Users can remove tags not yet associated with the resource by using the *Remove*   button. This action removes the entire row.
- #### Removing resource tags

  Resource tags are removed when the form is submitted. Users can mark resource tags for removal by using the *Remove*   button.  

  The tag value field is replaced by a message communicating the consequences of the removal action, together with an *Undo*   action.
- #### Undo removal of resource tags

  Users can undo the action of removing a resource tag by using the *Undo*   action. The tag value field with the stored value is displayed along with the *Remove*   button.
- #### Tag limit

  - The default value is 50 tags.
  - When the tag limit is reached, the *Add new tag*** **     button will be inactive and a message explaining that the tag limit has been reached is displayed.
  - When the tag limit is exceeded, the *Add new tag*     button will be inactive and a warning message explaining that the tag limit has been exceed is displayed.    

    - For example: At form submission, when resource tags fail to be removed and there is an attempt on adding new tags.
    - For example: When users mark resource tags for removal, add tags until the limit is reached, and undo the removal of resource tags previously marked for removal.
- #### Validation

  - Validation happens inline for key and value constraints and for empty keys. Follow the [tag editor](/components/tag-editor/index.html.md)     writing guidelines for specific text strings.
  - For specific validation text strings, follow the [tag editor](/components/tag-editor/index.html.md)     writing guidelines.
  - For validation rules in form submission, follow the guidelines for [validation](/patterns/general/errors/validation/index.html.md)    .
- #### Loading of tag keys and values

  - Tag keys and values are displayed in the suggestion list. If the dataset fails to load, a message communicating the error is displayed. Follow the guidelines for [autosuggest](/components/autosuggest/index.html.md)    .
  - The dataset won't be loaded when attempting to load too many unique keys or values per tag. Instead, a message is displayed, communicating to the users that the list can't be retrieved. For example, when attempting to load up to 200 unique values per tag.

### States

- #### Empty

  The state of the tag editor when no tags are associated with the resource.
- #### Loading

  The state of the tag editor while the tags are being loaded. In case of loading failure display an error [alert](/components/alert/index.html.md)   communicating to the users the occurred error.

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

- For tag keys, use this text: *Key*
- For tag values, use this text: *Value*
- Follow the guidelines for [form field](/components/form-field/index.html.md)  .

#### Placeholder

- For tag keys, use this text: *Enter key*
- For tag values, use this text: *Enter value *
- Follow the guidelines for [form field](/components/form-field/index.html.md)  .

#### Buttons

- For add button, use this text: *Add new tag*
- For remove button, use this text: *Remove*
- Follow the guidelines for [button](/components/button/index.html.md)  .

#### Tag limit

- When no tags are present, use the format: *You can add up to \[number\] tag\[s\].*  

  - For example: *You can add up to 50 tags.*
- When tags are present but the limit for tags hasn't been reached, use the format: *You can add up to \[number\] more tag\[s\].*  

  - For example: *You can add up to 30 more tags or You can add up to 1 more tag.*
- When the limit for tags is reached, use the format: *You have reached the limit of \[number\] tags*  

  - For example:* You have reached the limit of 50 tags.*
- When the limit for tags has been exceeded, use the format: *You have exceeded the limit of \[number\] tags.*  

  - For example: *You have exceeded the limit of 50 tags.*

#### Loading of tag keys and values

- When loading the dataset of keys or values, use this text:  

  - For tag keys: *Loading tag keys*
  - For tag values: *Loading tag values*
- When the dataset is too big to be loaded, use this text:  

  - For tag keys: *You have more keys than can be displayed*
  - For tag values: *You have more values than can be displayed*
- When the loading of the dataset fails, use this text:  

  - For tag keys: *Tag keys could not be retrieved*
  - For tag values: *Tag values could not be retrieved *
- Follow the guidelines for [autosuggest](/components/autosuggest/index.html.md)  .

#### Undo

- When a tag is marked for removal, inform the users about the consequences of this action.
- Use this text: *This tag will be removed upon saving changes.*

### Validation

The following restrictions apply to tags. Use the respective indicated text:

- Tag key maximum length: The maximum number of characters you can use in a tag key is 128.
- Tag value maximum length: The maximum number of characters you can use in a tag value is 256.
- Invalid formatting for tag key: Invalid key. Keys can only contain alphanumeric characters, spaces and any of the following: _.:/=+@-
- Invalid formatting for tag value: Invalid value. Values can only contain alphanumeric characters, spaces and any of the following: _.:/=+@-
- Invalid prefix for tag key: Cannot start with aws:
- No value specified for tag key: You must specify a tag key.
- Duplicate of tag key: You must specify a unique tag key.

[View Documentation](/patterns/general/errors/validation/index.html.md)

### Empty state description

- Use this text: *No tags associated with the resource.*

### Loading

- Use this text: *Loading tags that are associated with this resource*
- When the loading of the component fails, use an alert to communicate the occurred error.  

  - Follow the guidelines for [error alert](/components/alert/index.html.md)    .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- All fields should be accessible with keyboard.
- All fields should point to the corresponding label and error text using the appropriate aria properties to be accessible for assistive technology.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
