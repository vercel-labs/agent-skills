---
scraped_at: '2026-04-20T08:47:57+00:00'
section: components
source_url: https://cloudscape.design/components/file-token-group/index.html.md
title: File token group
---

# File token group

A collection of uploaded files displayed as tokens.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/file-token-group)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/file-token-group/index.html.json)

## Development guidelines

#### State management

The file token group component is controlled. Set the `onDismiss` listener to store the visible items in the state of your application and update the `items` property. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

FileTokenGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findFileToken | [FileTokenWrapper](/index.html.md) &#124; null | Returns a file token from for a given index. | fileTokenIndex: |
| findFileTokens | Array<[FileTokenWrapper](/index.html.md)> | - | - | FileTokenWrapper 

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

FileTokenGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findFileToken | [FileTokenWrapper](/index.html.md) | Returns a file token from for a given index. | fileTokenIndex: |
| findFileTokens | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FileTokenWrapper](/index.html.md)> | - | - | FileTokenWrapper 

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

- Use only when the [file upload](/components/file-upload/index.html.md)   cannot be used. For example, with [prompt input](/components/prompt-input/index.html.md)  .
- Use in combination with [file input](/components/file-input/index.html.md)   and [file dropzone](/components/file-dropzone/index.html.md)   to configure the file uploading experience for users.
- By default, tokens stack vertically to allow for easy scanning. In layouts where more compact, horizontal tokens would be beneficial, use horizontal alignment. For example, in the prompt input.

## Features

- #### File metadata

  File metadata helps the user to validate and compare the files selected. Choose the most relevant file metadata to display, based on your use case. The types of metadata that can be displayed per file are:  

  - Name (each file name). This should not include path information.
  - Size (expressed in bytes) - *optional*    

    - For example, KB (kilobyte), MB (megabyte), GB (gigabyte).
  - Last modified date - *optional*
  - Image thumbnail - *optional*
- #### Alignment

  By default, tokens stack vertically to allow for easy scanning. In instances where compact tokens would be beneficial, horizontal stacking can be used instead.
- #### Token truncation - optional

  By default, all file tokens are visible. If you expect the majority of users to upload a small number of files, you can choose to include token truncation. If you know how many files are typically uploaded, hide file tokens above that number. To toggle the visibility of the tokens, users can trigger the show/hide link, which shows or hides the tokens.

### States

- #### Invalid

  Shows that there is an error with a file that the user has uploaded.
- #### Warning

  Indicates a condition regarding a file, which doesn't generate an error, but requires user attention.
- #### Loading

  Shows a loading spinner when a file is in the process of being uploaded.

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

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

#### Alternative text

Specify alternative text for the remove icon in the tokens.

- For example: *Remove file.*
- When there are multiple files, include the specific file index. For example: *Remove file 1.*

#### Announcing files uploading

When uploading files, set the `loading` property per file token, and use the [live region](/components/live-region/index.html.md) component to announce the loading state. When uploading multiple files, use a single announcement message, for example: "Uploading 2 files".

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
