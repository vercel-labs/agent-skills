---
scraped_at: '2026-04-20T08:47:26+00:00'
section: components
source_url: https://cloudscape.design/components/code-view/index.html.md
title: Code view
---

# Code view

Allow users to read and copy a code snippet.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/code-view/tree/main/src/code-view)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/code-view/index.html.json)

## Development guidelines

#### Syntax highlighting

The component supports several languages with predefined highlighting rules.

To utilize the built-in syntax highlighting with the languages supported by the component, pass one of the available highlight functions to the `highlight` property of the `CodeView` component. The following code example demonstrates how to import and use the JavaScript and PHP highlight functions for syntax highlighting in your code view. You can follow the same steps to highlight other supported languages.

```
import CodeView from "@cloudscape-design/code-view";
import javascriptHighlight from "@cloudscape-design/code-view/highlight/javascript";
import phpHighlight from "@cloudscape-design/code-view/highlight/php";

<CodeView content={`const hello = "world"`} highlight={javascriptHighlight} />

<CodeView content={`<?php echo 'Hello, world!'; ?>`} highlight={phpHighlight} />
```

If your desired programming language isn't supported out-of-the-box, you can still add syntax highlighting for it. The `createHighlight` utility let's you create a highlighting function based on an [ace-code](https://www.npmjs.com/package/ace-code) rule, which you can then pass to the `highlight` property of the `CodeView` component. This allows you to integrate syntax highlighting for any language supported by `ace-code` that isn't included by default in our component.

```
import { TerraformHighlightRules } from "ace-code/src/mode/terraform_highlight_rules";
import { createHighlight } from "@cloudscape-design/code-view/highlight";

const terraformHighlight = createHighlight(new TerraformHighlightRules());

<CodeView content={`resource "aws_s3_bucket" "example" { bucket = "example-bucket" }`} highlight={terraformHighlight} />
```

Alternatively, you can use a custom highlighting function for more flexibility. You can pass a function to the `highlight` property of the component that takes the source code content as a string argument and returns a React node representing the highlighted code.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Testing guidelines

These components are distributed in a separate package. To find them in test-utils, add an extra import along with the main test-utils import:

### For unit testing

```
// side-effect import to install the finder methods
import '@cloudscape-design/code-view/test-utils/dom';
// use import from the main package to use the wrapper
import createWrapper from '@cloudscape-design/components/test-utils/dom';

createWrapper().findCodeView().getElement();
```

### For integration testing

```
// side-effect import to install the finder methods
import '@cloudscape-design/code-view/test-utils/selectors';
// use import from the main package to use the wrapper
import createWrapper from '@cloudscape-design/components/test-utils/selectors';

createWrapper().findCodeView().toSelector();
```

## Unit testing APIs

CodeViewWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
## Integration testing APIs

CodeViewWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use to display read-only code snippets. For code editing use [code editor](/components/code-editor/index.html.md)   instead.

## Features

- #### Action buttons - optional

  Enables users to perform actions, such as copy or download the code snippet. Follow the guidelines for [copy to clipboard](/components/copy-to-clipboard/index.html.md)  .
- #### Syntax highlight - optional

  Syntax highlighting determines the color and style of source code displayed in the code view.  

  - For example, it's responsible for colorizing keywords in JavaScript like `for`     , `if`     , or `const`     differently than strings, comments, and numbers.
- #### Line numbers - optional

  Line numbers are displayed preceding each line of code to support lines reference.
- #### Line wrapping - optional

  With line wrapping, users can have visibility over the source code content within the code view area by wrapping long lines of code onto new lines. When line wrapping is active, the maximum row width is the width of the code editing area in the component. Line wrapping is off by default.

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

### Component-specific guidelines

#### Button

- Follow the accessibility guidelines for [buttons](/components/button/index.html.md)  .
- Follow the accessibility guidelines for [copy to clipboard.](/components/copy-to-clipboard/index.html.md)

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
