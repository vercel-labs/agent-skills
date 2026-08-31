---
scraped_at: '2026-04-20T08:47:53+00:00'
section: components
source_url: https://cloudscape.design/components/file-dropzone/index.html.md
title: File dropzone
---

# File dropzone

An area that allows users to drag and drop files.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/file-dropzone)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/file-dropzone/index.html.json)

## Development guidelines

#### useFilesDragging hook

By default, the file dropzone is always visible. If you want the file dropzone to only be visible upon a file being dragged onto the browser (for example, in [file upload](/components/file-upload/index.html.md) ), use the `useFilesDragging` hook that is exported alongside the component.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

FileDropzoneWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
## Integration testing APIs

FileDropzoneWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use only when the [file upload](/components/file-upload/index.html.md)   can't be used, such as with [prompt input](/components/prompt-input/index.html.md)  .
- Use in combination with [file input](/components/file-input/index.html.md)   and [file token group](/components/file-token-group/index.html.md)   to configure the file uploading experience for users.

### Don't

- Don't put anything inside the file dropzone other than description text or a [file input](/components/file-input/index.html.md)  .

## Features

- #### Visibility

  By default, the file dropzone is always visible. Hide the dropzone until a file is being dragged into the browser when file upload is a secondary action, or when space is limited, such as in the [prompt input](/components/prompt-input/index.html.md)   . See [development guidelines](/components/file-dropzone/index.html.md)   for more details on how to toggle visibility.  

  Note that in the file upload component, the file dropzone is invisible until a file is being dragged.

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

#### Text

- Use action verbs that reflect the goal of the drop. Don't change the text on file drag.
- Use this text: *Drop file here*   (single) *or Drop files here*   (multiple)

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
