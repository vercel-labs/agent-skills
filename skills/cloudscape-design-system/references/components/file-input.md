---
scraped_at: '2026-04-20T08:47:55+00:00'
section: components
source_url: https://cloudscape.design/components/file-input/index.html.md
title: File input
---

# File input

A trigger that allows users to select one or more files to upload.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/file-input) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/file-input/index.html.json)

## Unit testing APIs

FileInputWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> | - | - |
| findTrigger | [ButtonWrapper](/components/button/index.html.md) | - | - |
## Integration testing APIs

FileInputWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTrigger | [ButtonWrapper](/components/button/index.html.md) | - | - |
## General guidelines

### Do

- Use only when the file upload can't be used. For example, in [prompt input](/components/prompt-input/index.html.md)  .
- Use in combination with [file token group](/components/file-token-group/index.html.md)   and [file dropzone](/components/file-dropzone/index.html.md)   to build a custom file uploading experience for users.
- Use paginated tables to display large number of files, or a folder containing several files.
- When allowing users to upload files, consider browser performance and usability. If multiple files are uploaded, consider batching or staggering uploads to improve user experience.

### Don't

- Don't use without having a representation of the uploaded files, such as the file token group or table with file data, in close proximity.
- Don't use without a file dropzone.

## Features

- #### Variant

  There are two types of file inputs:  

  - **Button**     - Button file inputs have text and should be used in most cases.    

    - For example, inside a file dropzone: *Choose files*
  - **Icon**     - Icon file inputs do not have accompanying text. Use when space does not allow for a button file input.    

    - For example, in the secondary actions slot of a [prompt input](/components/prompt-input/index.html.md)
- #### Single file upload

  Use to limit the selection to a single file for upload. Any additional file will replace the existing file.
- #### Multiple files upload

  Use to allow the selection of multiple files for upload. Additional files will be added to existing files.

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

#### Button

- Use action verbs that reflect the goal of the selection.
- Use this text: *Choose file *   (single) or *Choose files*   (multiple)

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- By default, the file input's text will be used as the aria label. If you are using the icon variant and the component does not have visible text, define a separate aria label.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
