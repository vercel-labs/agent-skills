---
scraped_at: '2026-04-20T08:48:02+00:00'
section: components
source_url: https://cloudscape.design/components/file-uploading-components/index.html.md
title: File uploading components
---

# File uploading components

Components that allow users to upload files.

The API properties for this component are found here: [API Properties](https://cloudscape.design/components/file-uploading-components/index.html.json)

## Related components

### File dropzone

An area that allows users to drag and drop files.

[View Documentation](/components/file-dropzone/index.html.md)

### File input

A trigger that allows users to select one or more files to upload.

[View Documentation](/components/file-input/index.html.md)

### File token group

A collection of uploaded files displayed as tokens.

[View Documentation](/components/file-token-group/index.html.md)

### File upload

File upload is a form element. Users can use it to select one or multiple local files to upload. The files can then be uploaded upon form submission or processed further in the browser.

[View Documentation](/components/file-upload/index.html.md)

## How the components work together

File uploading consists of four components: one parent component and three sub-components. These components can be configured together to create a full file upload experience.

The [file upload](/components/file-upload/index.html.md) is a pre-built combination of a [file input](/components/file-input/index.html.md) , [file token group](/components/file-token-group/index.html.md) , and [file dropzone](/components/file-dropzone/index.html.md) . The file input is the trigger that allows the user to select files to upload. The file token group is the set of uploaded files displayed as [tokens](/components/token/index.html.md) . The file dropzone is an area where a user can drag and drop files in order for them to be uploaded.

The file upload component covers standard use cases for file uploading, including in forms and create flows, and, in most cases, is the only component you need. For other use cases, you may need more flexible layouts for uploading files. Examples of this include placing the file tokens in a separate area from the file input, showing file data in a table instead of tokens, or showing the file dropzone even before a file is being dragged. In these cases, you can use the three sub-components in different combinations to create unique layouts.

For an example of all three file uploading components working together, see the [prompt input](/components/prompt-input/index.html.md).

A B C---

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
