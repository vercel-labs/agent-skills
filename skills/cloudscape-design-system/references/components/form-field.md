---
scraped_at: '2026-04-20T08:48:06+00:00'
section: components
source_url: https://cloudscape.design/components/form-field/index.html.md
title: Form field
---

# Form field

With the form field, users can create properly-styled controls in a form.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/form-field)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/form-field/index.html.json)

## Development guidelines

If you want to place multiple form fields one after another, use the [space between component](/components/space-between/index.html.md) with size `l` to add vertical spacing between them.

If you need to place multiple form fields in a single row, use the [space between component](/components/space-between/index.html.md) with size `s` to add horizontal spacing between them.

When there are multiple controls inside a single slot, they need to have unique `controlId` properties set.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

FormFieldWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCharacterCount | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findConstraint | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findControl | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findError | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSecondaryControl | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findWarning | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

FormFieldWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCharacterCount | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findConstraint | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findControl | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findError | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findInfo | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSecondaryControl | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findWarning | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Provide a label for every form control.
- Use [error text](/patterns/general/errors/error-messages/index.html.md)   for server-side validation.
- Indicate optional form fields by adding *optional*   on the label.  Mandatory fields don't need to be marked.
- Always use the same icon for form field validation. Don't switch icons based on the status of the error message.

### Don't

- Use error validation for non-blocking messages. Use warning validation instead.

## Features

- #### Label

  A form field label is a short description of the corresponding control. Labels are displayed above the control or the form field description, if any exist.  

  When a label is supported with an [info link](/components/link/index.html.md)   a divider separates the two elements.
- #### Description - optional

  A form field description is a broader explanation of the label.  

  - Use the description only if your label needs an additional explanation.
  - Don't include any images or formatted text.
  - Ensure links in the description use the [primary link](/components/link/index.html.md)     variant.
- #### Form control

  A form control is any control that allows users to input data.
- #### Error text

  An error text is an explanation for a validation error that is displayed below the form field. It's utilized for notifying users about issues such as missing required fields, incorrect value formatting, and unacknowledged confirmation fields. Refer to [validation guidelines](/patterns/general/errors/validation/index.html.md)   for further details on its usage in forms.
- #### Warning text

  A warning is an explanation for a validation warning that is displayed below the form field. It's employed when certain conditions are present that don't result in errors, but are occurrences users should be mindful of. For example: *The name has empty (space) characters. *   Refer to [validation guidelines](/patterns/general/errors/validation/index.html.md)   for further details on its usage in forms.
- #### Constraint text - optional

  A constraint text is a line of text explaining the requirements and constraints of the form control. Constraint text is displayed below validation.  

  - Constraint text is optional and should only be used if it adds additional value.
  - When there is a character amount constraint, provide this information to the user and actively count the characters.
- #### Stretch

  By default the form field will take up 66% of its container width. Enabling the stretch property will set the width of the form field to 100%. This can be done for fields where a full-width layout is more appropriate, such as when using multi column layout.

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

#### Form field label

- Use sentence case (not title case).
- Use clear, concise, consistent labels to guide the user across the form.
- Keep the content short and actionable.
- Use a maximum of three words.
- Don't use articles ( *a*   , *an*   , *the*   ).
- Don't use terminal punctuation.

#### Form field description

- Use sentence case (not title case).
- Although descriptions for fields are optional, they typically are useful because they help users understand what type of information to enter in the field.
- Place descriptions *above *   the related fields, not below. (However, place any constraints, such as alphanumeric restrictions, *below *   the fields.)
- Keep descriptions brief, and use active voice.
- Descriptions should have end punctuation, with the only exception being if a description ends with an external link icon, which should not have a period after it.
- Avoid directive text that states the obvious, such as *Enter a description*  .

#### Error text

- Follow the guidelines for [error messages](/patterns/general/errors/error-messages/index.html.md)  .
- **Required field:**  

  - Use the format: *\[label descriptor\] \[label type\] is required.*    

    - For example:      

      - *Alarm name is required.*
      - *Template URL is required.*
      - *Expiration date is required.*
      - *Custom engine version description is required.*
- **Format not valid:**  

  - Use the format: *Enter a valid \[label descriptor\] \[label type\].*    

    - For example:      

      - *Enter a valid email address.*
      - *Enter a valid subnet group name.*
      - *Enter a valid phone number.*
      - *Enter a valid KMS key ARN.*
- **Doesn't match:**  

  - Using one short sentence, indicate what doesn't match.    

    - For example: *The security code doesn't match.*
  - If additional context is necessary, follow the first sentence with clearly defined next steps.    

    - For example: *The security code doesn't match. Refresh the code and try again.*
- **Character requirements:**  

  - Use the constraint text area to include any character count requirements needed to validate a form field, rather than using validation error messaging. When triggered, the corresponding validation error should let the user know which constraint text requirements are unmet.    

    - For example:      

      - *The name has characters that aren't valid: \#*
      - *The name has too many characters. Character count: 120/50*
      - *The name has too few characters. Character count: 1/50*

#### Constraint text

- Keep constraint text brief. Two lines is the limit.
- Use regular text, not italics or boldface.
- **Value constraints:**  

  - If there are constraints on the value that users enter into an input field, describe them under the field. Use the format: *\[label descriptor\] \[label type\] must be X to Y characters. *     or* \[label descriptor\] \[label type\] must be X to Y characters, and must/can't \[constraints\].*    

    - For example:      

      - *Category name must be 1 to 100 characters. *
      - *Category name must be 1 to 100 characters, and must start with a letter. *
      - *Category name must be 1 to 100 characters, and can't start with a hyphen (-).*
  - When sharing valid characters, use the format: *periods (.) *     instead of *(periods) "." *     and use the format: *Valid characters are \[valid character list\].*    

    - For example: *Valid characters are a-z, A-Z, 0-9, and periods (.).*
- **Valid formats:**  

  - If there is a valid format users must provide (for example, an email address or phone number), share an example within the constraint text rather than (or in addition to) inside placeholder text, which is not accessible. Use the format: *\[Enter a valid\] \[label descriptor\] \[label type\] \[example\]*    

    - For example: *Enter a valid email address. For example: name@email.com*

#### Character count text

- For a counter that actively counts characters, use this text: *Character count: 0/max*  

  - For example: *Character count: 0/100*

#### Placeholder text

- Follow the writing guidelines for [placeholder text](/components/input/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- All form fields must have explicit labels.
- All fields should be accessible with keyboard. Don't change the tab order in the form.
- All fields should point to the shared label, description, constraint and error text using the appropriate aria properties to be accessible for assistive technology.
- Focus the first field with an error message if form validation has failed. See <a href="/patterns/general/errors/validation/#make-errors-discoverable"> *make errors discoverable*</a>   in the validation pattern for more details.
- To display a character count, use the `characterCountText`   property instead of placing the text in `constraintText`   or `description`   slots. This debounces character count text updates for screen reader users, preventing announcements on every keypress.

#### Info links

- Info links (that is, `<Link variant="info">`   ) within a FormField automatically have the field label appended to their accessible name. If this doesn't sufficiently describe the purpose of the link, provide additional context via an `ariaLabel`.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
