---
scraped_at: '2026-04-20T08:47:59+00:00'
section: components
source_url: https://cloudscape.design/components/file-upload/index.html.md
title: File upload
---

# File upload

File upload is a form element. Users can use it to select one or multiple local files to upload. The files can then be uploaded upon form submission or processed further in the browser.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/file-upload)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/file-upload/index.html.json)

## Development guidelines

When using the component with a [form field](/components/form-field/index.html.md) , make sure to provide `errorText` and `constraintText` attributes via the dedicated file upload slots. For example:

```
<FormField label="Contracts">
  <FileUpload 
     value={value} 
     onChange={onChange}
     errorText="File size is above 1 MB"
     constraintText="File size should not exceed 1 MB"
   />
</FormField>
```

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

FileUploadWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findConstraint | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findError | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findFileToken | [FileTokenWrapper](/index.html.md) &#124; null | Returns a file token from for a given index. | fileTokenIndex: |
| findFileTokens | Array<[FileTokenWrapper](/index.html.md)> | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> | - | - |
| findTokenToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | Returns the token toggle button. | - |
| findUploadButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findWarning | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - | FileTokenWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findFileError | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findFileLastModified | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findFileName | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findFileSize | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findFileThumbnail | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findFileWarning | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findRemoveButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
## Integration testing APIs

FileUploadWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findConstraint | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findError | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFileToken | [FileTokenWrapper](/index.html.md) | Returns a file token from for a given index. | fileTokenIndex: |
| findFileTokens | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FileTokenWrapper](/index.html.md)> | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTokenToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Returns the token toggle button. | - |
| findUploadButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findWarning | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | FileTokenWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findFileError | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFileLastModified | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFileName | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFileSize | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFileThumbnail | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFileWarning | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findRemoveButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use constraint text to indicate the file constraints upfront.
- Use last modified date and image thumbnail file metadata sparingly. Use those types of metadata if they are key to compare and distinguish between files.
- Use single file upload or multiple files upload appropriate to your use case.

## Features

- #### Single file upload

  Use to limit the selection to a single file for upload from the user's local drive. The file is displayed as a token and can be removed.
- #### Multiple files upload

  Use to allow the selection of multiple files for upload from the user's local drive. The files are displayed as tokens and can be removed individually.
- #### Label

  Use the label to describe the file type or its purpose. Follow the guidelines for [form field](/components/form-field/index.html.md)   . For example: *User data*
- #### Description - optional

  Use the description to state what the action will do in the context for the form. Follow the guidelines for [form field](/components/form-field/index.html.md)   . For example: *The files selected will be uploaded to this S3 bucket.*
- #### Hint text - optional

  Include all constraints that the file must match in the hint text, such as size or file type. Make sure to specify and implement validation for which file types are acceptable. Activate or deactivate non-compliant files in the folder window. Follow the guidelines for [form field](/components/form-field/index.html.md)  .
- #### Drag-and-drop

  Allows users to [drag-and-drop](/patterns/general/drag-and-drop/index.html.md)   files cross-app to upload single or multiple files.
- #### File metadata

  File metadata helps the user to validate and compare the files selected. Choose the most relevant file metadata to display, based on your use case. The types of metadata that can be displayed per file are:  

  - Name - each file name. This should not include path information.
  - Size - expressed in bytes. For example, KB (kilobyte), MB (megabyte), GB (gigabyte).
  - Last modified date
  - Image thumbnail
- #### Token

 [Tokens](/components/token/index.html.md)   display file metadata and allow for individual removal. Tokens stack vertically, aligned with each other, to allow for easy scanning.
- #### Token truncation - optional

  By default, all file tokens are visible. When most users will upload a small number of files, but some users will upload many files, you can choose to include token truncation. If you know how many files are typically uploaded, hide file tokens above that number, so most users will see all file tokens. To toggle the visibility of the tokens, users can trigger the show/hide link, which shows or hides them.
- #### Validation

  There are two types of validation for the file upload component, which are frequently used together:  

  - **File specific validation messages**    

    - Show inline file error and warning messages that are related to individual file tokens.      

      - For example: *The file size exceeds the limit. Accepted file size is 250 KB max.*
  - **Form level validation messages**    

    - Show form level errors and warning messages that do not specifically relate to individual file tokens.      

      - For example: *The combined file size can not exceed 200 MB. *

  After selection, the upload of the files is completed only when the user submits the form that contains the file upload component. For detailed information about how to communicate [error](/patterns/general/errors/error-messages/index.html.md)   and success messages after the form submission, see [create flow](/patterns/resource-management/create/index.html.md)   or [edit flow](/patterns/resource-management/edit/index.html.md)  .

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

- For example: *User data.*
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Descriptions

- For example: *The files selected will be uploaded to this S3 bucket.*
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Hint text

- A line of text explaining the requirements of the files.  

  - For example:* The file must be .jpg or .png. 500 KB max file size.*
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Button

- Use action verbs that reflect the goal of the selection.
- Use the format: *Choose file\[s\]*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Specify alternative text for the remove icon in the tokens.  

  - For example:* Remove file. *
  - Or when there are multiple files include the specific file index. For example: *Remove file 1.*

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
