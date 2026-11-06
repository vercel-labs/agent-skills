---
scraped_at: '2026-04-20T08:48:08+00:00'
section: components
source_url: https://cloudscape.design/components/form/index.html.md
title: Form
---

# Form

A section of a page that has interactive controls with which a user can submit information to a web server.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/form) [View in demo](/examples/react/form.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/form/index.html.json)

## Development guidelines

Embed this component inside a `<form>` tag or an element with `role="form"` in order to comply with accessibility guidelines and gain full benefit of your framework's form support.

#### App layout

Set `contentType="form"` in the [app layout](/components/app-layout/index.html.md) component to automatically apply the recommended max content area width and default panel states to the page.

#### Communicating unsaved changes

Ensures users can exit a [single page create](/patterns/resource-management/create/single-page-create/index.html.md) flow at any time.
If a user has entered data in the form and attempts to exit before completing the flow, you must prompt them with a [modal](/components/modal/index.html.md) asking them to confirm that they want to exit the flow.
If there is no user input, you may end the creation flow without a prompt. For additional guidelines, see the [communicating unsaved changes](/patterns/general/unsaved-changes/index.html.md) pattern.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

FormWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findError | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSecondaryActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
## Integration testing APIs

FormWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findError | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSecondaryActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Apply the recommended max content area width and default panel states by setting `contentType='form'`   in the [app layout](/components/app-layout/index.html.md)   component.
- When used within the app layout, `full-page`   forms must be the first component in the `content`   slot.
- If there are [unsaved changes](/patterns/general/unsaved-changes/index.html.md)   invoke a [modal](/components/modal/index.html.md)   when exiting the form.
- Apply standard form [validation](/patterns/resource-management/create/single-page-create/index.html.md)   . Use form field (client-side) and/or page level (server-side) validation depending on your use cases.
- Refer to the [single page create flow](/patterns/resource-management/create/single-page-create/index.html.md)   for additional design guidance on the pattern.

### Don't

- Don't use the "full-page" `variant`   inside of a [content layout](/components/content-layout/index.html.md)   component.

## Features

- #### Form header

  Use the h1 variant of the [header](/components/header/index.html.md)   component in this area. The form header can include:  

  - A title that clearly and concisely describes the purpose of the form.
  - An info link for page level [help content](/patterns/general/help-system/index.html.md)     (optional).
  - A description detailing the the form's purpose (optional).
- #### Form content

  Form content is organized into sections using [containers](/components/container/index.html.md)   . Each container has a [header](/components/header/index.html.md)   with a title and an optional description. [Info links](/components/link/index.html.md)   may also be included and appended to the container header.
- #### Form actions

  - Use the primary button for the main action to submit the form. Buttons should be right aligned.
  - Use link styling for the action of exiting the form, typically *Cancel*    .
  - In case of secondary submit actions, use secondary button styling, and include it in between the primary and exit actions.
  - Do not deactivate the buttons. All form actions should be active by default.
- #### Form error text

  Use a validation error message for server-side failures.
- #### Variant

  There are two types of forms:  

  - **Full page (default)**    

    - This variant occupies the full page and applies the high contrast header and content overlap automatically.
    - Use this variant if you are following the single-page [create](/patterns/resource-management/create/single-page-create/index.html.md)       or [edit](/patterns/resource-management/edit/page-edit/index.html.md)       patterns.
  - **Embedded**    

    - This variant does not contain a high contrast header.
    - Use this variant if the form is used in another context other than a [create](/patterns/resource-management/create/single-page-create/index.html.md)       or [edit](/patterns/resource-management/edit/page-edit/index.html.md)       page, one that doesn't occupy the full page.

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

- Keep the content simple. Be concise and focus on the information required for users to complete a step. Dense textual instructions defeat the purpose of the flow.
- Refer to different mechanisms, such as help panel triggers and description text, to provide any additional information, per section, or per field.
- Use sentence case for *all*   text, including button labels. (Capitalize only the first word in a sentence or phrase as well as any proper nouns, such as service names.)

#### Form title

- Use sentence case (not title case).
- The heading should indicate the main purpose of the form or current step in a [wizard](/components/wizard/index.html.md)  .
- Avoid articles (for example: *a, an, the*   ) to keep content short and actionable.
- Include an [Info link](/components/link/index.html.md)   as needed.
- Don't use ampersands.

#### Form description

- Descriptions should have end punctuation, with the only exception being if a description ends with an external link icon, which should not have a period after it.
- Briefly summarize the purpose of the page and the main actions that users need to take on the page.
- Use active voice and present tense.
- The suggested length is about two lines.  

  - For example:* Find and register an available domain, or transfer your existing domains to Route 53.*

#### Form actions

- Use action verbs that reflect the goal of the form.
- Follow the guidelines for [button](/components/button/index.html.md)  .

#### Form container header

- Use sentence case (not title case).
- The heading should indicate the contents of the section form.
- Begin section headings with a noun.
- Avoid articles (for example: *a, an, the*   ).

#### Form container descriptions

- Briefly summarize the purpose of the section and the main action that users need to take. Use active voice and present tense.  

  - For example: *Provide the code for your function. Use the editor if your code doesn't require custom libraries. If you need custom libraries, you can upload your code and libraries as a .ZIP file.*

#### Validation form error

- Follow the guidelines for [error messages](/patterns/general/errors/error-messages/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Forms

- Ensure the forms are keyboard accessible.
- Auto focus the first field by default. This allows users to tab through elements in the form in a logical way.
- Focus the first field with an error message if the validation has failed. See <a href="/patterns/general/errors/validation/#make-errors-discoverable"> *make errors discoverable*</a>   in the validation pattern for more details.
- Allow resubmission and revalidation of the form information.
- The form doesn't ship with the tag or role `form`   , so make sure you set it.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
