---
scraped_at: '2026-04-20T08:52:24+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/errors/validation/index.html.md
title: Validation
---

# Validation

Help users with error recovery by accurately identifying issues and providing easy identification of incorrect fields for correction.

 [Form validation demo](/examples/react/form-validation.html)
## Key UX concepts

### Validation

Validation is the process of verifying the data entered into a form to ensure it meets certain criteria, such as required fields being filled or correct formats for strings. This helps prevent erroneous or incomplete submissions and improves data integrity.

There are two types of validation, which are frequently used together:

#### Form field validation

With [form field validation](/components/form-field/index.html.md) users are informed about an [error](/components/form-field/index.html.md) or [warning](/components/form-field/index.html.md) as soon as they leave the populated or empty field, which increases error discoverability and remediation. For example, to inform users about an incorrect character typed.

It's often used for *client-side * validation, which processes information and provides contextual feedback as [error text on individual form fields.](/components/form-field/index.html.md) It's best used for validating specific values such as missing required fields, incorrect formatting of values, and unacknowledged confirmation fields. This type of validation is invoked on-blur when leaving a populated field, or an empty field. Additionally, it can be invoked on key press when fixing the value of fields in error state, when submitting a form, or transitioning to a next step in a [wizard](/components/wizard/index.html.md).

#### Page level form validation

 [Page level form validation](/components/form/index.html.md) is often used for *server-side * validation, which processes information *after * the form is submitted, and returns either a success or failure in one of two ways: an [alert](/components/alert/index.html.md) above the form's action buttons (in the case of a recoverable failure), or a [flash](/components/flashbar/index.html.md) on the page following submission (in the case of success or immutable failure). It's best used for validating requests to the server that result in recoverable errors such as insufficient capacity, exceeded request limits, and permission errors that can be updated. This type of validation is invoked upon form submission or transition to the next step in a [wizard](/components/wizard/index.html.md).

[View Documentation](/patterns/general/errors/validation/index.html.md)

### Contextualize validation messages

Provide contextual error and warning messages below the corresponding control by using form field error and warning properties. Follow the guidance for [field validation](/patterns/general/errors/validation/index.html.md).

- Client-side errors related to a field. For example: *This field is required.*
- Server-side errors related to a field. For example: *This resource name is already in use.*
- Client-side warnings related to a field. For example: *The name has empty (space) characters.*

If contextualizing validation on a field isn't possible, such as due to a technical constraint (for example: no user permission), display a descriptive error message in an alert, provided by errorText in [form component](/components/form/index.html.md).

### Make errors discoverable

#### Required fields

In [medium to complex forms,](/patterns/resource-management/create/index.html.md) it is not uncommon for a user to overlook required fields on the first pass. We recommend to use inline validation for required fields that are left empty.

#### Submit button

We recommend keeping the submission button active at all times as a fallback mechanism for validating these required fields. In these scenarios, deactivating the submit button forces them to hunt for their mistake or blocks them from moving forward, leaving the user frustrated and confused. Providing feedback through error messages invoked inline or on submission is often the most straightforward and clearest approach to validation.

In the case of very simple forms where the risk of accidentally overlooking a field is close to none you can pair inline validation and a disabled submit button. For example, in a delete with additional [confirmation modal](/components/modal/index.html.md).

#### Scroll to the top-most error

When validation is shown on submission, make error states known to the user. Scroll the top-most error into view, and ensure it has focus. For an example of this behavior [see the demo](/examples/react/form-validation.html) . We recommend implementing this by assigning a `ref` to each form control, then identifying the appropriate ref for the first field with an error and calling `firstErrorControlRef.focus()`.

### Be unobtrusive

Don't interrupt the user with validation before they're ready. We recommend you delay validation until after a user has entered data, unless they are in the process of fixing validation errors, in which case you should validate on key press.

## Field validation

See an interactive example of form validation in the [validation demo](/examples/react/form-validation.html).

**Before form submission**
Upon first page visit there should be no fields in a validated state. You should validate fields after a value is inputted, or when required and left empty. Then on subsequent attempts to remedy errors, validate on key press while users edit the inputted value.

### Form field

[View Documentation](/components/form-field/index.html.md)

## Resource settings

Resource name Resource name is required. Resource name must be 3 to 28 characters. Valid characters are a-z, A-Z, 0-9, and hyphens (-). Character count: 0/28.
## After form submission

Upon form submission the form data is validated. Display client-side and server-side errors contextually to each field to enable recovery, and scroll the page to the top-most error.

Display an alert at the end of the form to inform users about server-side errors that are not linked to a field.

After errors are corrected and form is submitted again, keep the user on the page. You can use the button loading state to communicate long submission time. We recommend to not redirect the user until either success or failure of the form submission, to avoid losing the inputted data. In case a redirect is necessary to avoid long waiting time, include a mechanism to recover the pre-submitted form state. For example, a link in the flashbar that opens the form with previous values and errors present.

For detailed information about how to communicate error and success messages see [error messages](/patterns/general/errors/error-messages/index.html.md).

# Create instance

## Instance settings

Name The instance name is already in use. Use a different name. Instance name must be 8 to 128 characters. Valid characters are a-z, A-Z, 0-9, and hyphens (-). Description* - optional* You have reached the maximum amount of distributions you can create. [Learn more about distribution limits](about:blank/index.html.md) Cancel Create instance Error, You have reached the maximum amount of distributions you can create. [Learn more about distribution limits](about:blank/index.html.md)
## General guidelines

### Do

- On form submission scroll the page to the top-most error, ensuring it's in view.
- Always use real-time inline form field validation for error and warning messages, when they relate to a field.
- Use [inline error text](/components/form-field/index.html.md)   if the error is related to a specific field.
- Use an [alert](/components/form/index.html.md)   above the submit button to communicate server-side errors that are not related to a field.
- Follow the guidelines for [form field](/components/form-field/index.html.md)   , [alert](/components/alert/index.html.md)   , and [flashbar](/components/flashbar/index.html.md)   errors.
- If an error relates to a specific field for both client or server error messages, use form field validation to provide context for users to fix the error quickly.

### Don't

- Don't disable the form's submission button. Use the submission button as a fallback mechanism to launch validation error messages. Unless there are prerequisite actions that need to be completed prior to the form submission, such as in [delete with additional confirmation](/patterns/resource-management/delete/delete-with-additional-confirmation/index.html.md)   modal.
- Don't validate fields at first page visit.
- Don't display a generic message at the top of the page, such as *Fix all errors on this page.*

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

- Use plain, everyday language rather than technical jargon. But, don't oversimplify so that users can't troubleshoot and resolve issues on their own.
- Give users a clear action they can take to resolve the error.
- Don't use a tone that implies blame to the user.
- Raw error messages do not need to be localized.

#### Form field label

- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Form field description

- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Form field error messages

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

#### Form field constraint text

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
- **Character count:**  

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

## Related patterns and components

### Create resource

With the create new resource pattern, users can create new resources.

[View Documentation](/patterns/resource-management/create/index.html.md)

### Feedback mechanisms

Ways to communicate specific messages to a user in an interface.

[View Documentation](/patterns/general/user-feedback/index.html.md)

### Form

A section of a page that has interactive controls with which a user can submit information to a web server.

[View Documentation](/components/form/index.html.md)

### Form field

With the form field, users can create properly-styled controls in a form.
### Alert

A brief message that provides information or instructs users to take a specific action.

[View Documentation](/components/alert/index.html.md)

### Error messages

Error messages give users context about an inaccuracy, malfunction, unsuccessful action, or critical issue.---

[View Documentation](/patterns/general/errors/error-messages/index.html.md)
