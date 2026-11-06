---
scraped_at: '2026-04-20T08:47:24+00:00'
section: components
source_url: https://cloudscape.design/components/code-editor/index.html.md
title: Code editor
---

# Code editor

With the code editor, users can write and edit code.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/code-editor)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/code-editor/index.html.json)

## Development guidelines

### Ace

The code editor component relies on the [Ace library](https://ace.c9.io/).

**Loading the Ace library**

The code editor component does not load the Ace library itself, but receives it as a property. This gives the opportunity to adapt its loading to your build stack. For example, you can load Ace asynchronously with [dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports).

The Ace library loads assets such as language-specific syntax checkers and themes dynamically at runtime. For this reason, ensure your app is able to download all production assets. Follow the [Ace embedding guide](https://ace.c9.io/#nav=embedding) and [Ace how-to guide](https://ace.c9.io/#nav=howto) for more instructions.

If you use Webpack for building your project, take advantage of the built-in [webpack-resolver](https://github.com/ajaxorg/ace-builds/blob/master/webpack-resolver.js) . The code example displayed below shows this approach.

If the `ace` property is not a valid object and the `loading` property is `false` , the component displays an error state with the `errorText` as content.

**Content Security Policy (CSP)  **

The code editor component is an exception to our general [CSP compliance rules](/get-started/dev-guides/csp/index.html.md) . If your web app uses CSP, we recommend using the following configuration:

1. Add `worker-src blob:`   and `img-src data:`   into your CSP configuration.
2. Apply these ACE configs:

```
// Import all necessary CSS for the themes you are using:
import 'ace-builds/css/ace.css';
import 'ace-builds/css/theme/cloud_editor.css';
import 'ace-builds/css/theme/cloud_editor_dark.css';

// Configure the ace library
// It is recommended to lazy-load this library inside componentDidMount or useEffect hook
const ace = await import('ace-builds');
ace.config.set('useStrictCSP', true);

<CodeEditor 
  // Specify available themes via the respective property
  themes={{ dark: ['cloud_editor_dark'], light: ['cloud_editor'] }}
/>
```

For the full working example, see [the demo below](/components/code-editor/index.html.md).

**Supported Ace versions  **

The code editor supports version 1.x of Ace library.

### Value

The component listens to changes to the `value` property and notifies the Ace editor.

### Languages

You can set the language property to any of the [languages supported by Ace](https://github.com/ajaxorg/ace/tree/master/src/mode) (for example, "javascript"). For the official guide on how to add custom languages, see [Ace Docs](https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode).

### Preferences

The `preferences` property is [controlled](/get-started/dev-guides/state-management/index.html.md) . To handle the preferences for end users, listen to `onPreferencesChange` event and store the preferences received. For example, in a session cookie or a long term cookie.

If you set the `preferences` property to `undefined` , the component uses the default value: `{ wrapLines: true, theme: 'dawn' }`.

Color theme preference should be shared across all code editor instances. Text wrapping preference should be set individually for each code editor.

### Validation

The validation information provided by Ace syntax checkers (for example, syntax errors) are exposed on the `onValidate` event. Note that the messages exposed by Ace are obtained from third party checkers (for example, jshint) and are available only in English.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).

[View Documentation](/patterns/general/errors/validation/index.html.md)

## Unit testing APIs

CodeEditorWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findEditor | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findErrorScreen | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findErrorsTab | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLoadingScreen | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findNativeTextArea | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLTextAreaElement> &#124; null | - | - |
| findPane | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSettingsButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findStatusBar | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findWarningsTab | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| setValue | - | Sets the value of the component and calls the onChange handler | value:The value the input is set to. |
## Integration testing APIs

CodeEditorWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findEditor | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findErrorScreen | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findErrorsTab | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLoadingScreen | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNativeTextArea | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findPane | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSettingsButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findStatusBar | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findWarningsTab | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use the [unsaved changes](/patterns/general/unsaved-changes/index.html.md)   pattern to prevent data loss.
- Minimize the number of code editors displayed on a page. More than 20 code editors on a single page lead to performance issues.

### Don't

- Don't use the code editor component to display non-editable code snippets. This component exceeds the functional requirements for read only purposes and is not optimized to support code viewing alone. Use the [code view](/components/code-view/index.html.md)   component instead.
- Don't use the code editor in a modal. This component includes features that can compromise the user experience when launched in the context of a modal, such as resizing, preferences modal, and the errors and warnings summary pane.
- Unless modified by a user, avoid changing the default configuration set in the preferences modal to ensure a consistent end user experience.

## Features

The component provides integrated language support, interactions, functionalities, and validation. These features are based on the [Ace library](https://ace.c9.io/#nav=about&api=editor).

### Editor

- #### Line numbers

  Line numbers are displayed in front of each line of code to provide a reference to the row.
- #### Active line highlight

  Active line highlight helps users locate their current position in the editor by highlighting the active row.
- #### Code folding

  Code folding allows users to collapse or expand sections of code. All code is unfolded by default.
- #### Resizable editor height

  Users can change the height of the code editing area by dragging the *resize*   icon.

### Language support

The code editor component provides language support for all [programming languages supported by the Ace library](https://github.com/ajaxorg/ace/tree/master/lib/ace/mode).

- #### Syntax highlighting

  Syntax highlighting determines the color and style of source code displayed in the editor. For example, it's responsible for colorizing keywords in JavaScript like `for`   , `if`   , or `var`   differently than strings, comments, and numbers.  

  The syntax highlighting scheme is deﬁned by the active language in the editor.
- #### Autosuggest for syntax completion

  Syntax completion suggests smart code completions through autosuggest based on language semantics and an analysis of the source code. If there are possible completions, the suggestions will be shown as the user types.

### Syntax validation

- #### Live syntax checker

  A live syntax checker validates the code in real-time. Lines of code with errors or warnings are marked with an error or warning status icon, respectively. Details of the error or warning are shown in the summary pane below the status bar.
- #### Errors and warnings summary pane

  The errors and warnings summary pane is a collapsible pane displayed below the status bar. This pane lists each error or warning present in the editor, along with its location. Users can open this pane by choosing the error** **   or warning icon next to the line number in the gutter region, or by choosing the *Errors*   or *Warnings*   tab-button in the status bar.  

  An open summary pane can be dismissed in two ways:  

  - The close** **     icon situated in the top right corner of this pane.
  - The *Errors*** **     or *Warnings*** **     tab-button respectively in the status bar.
  - Users can change the height of this pane by dragging the resize** **     icon.

  The component does not support localization of error or warning description text. For more information about localization, see the [development guidelines for code editor](/components/code-editor/index.html.md)  .

### Status bar

The status bar is the area below the editor that displays contextual information such as active language, cursor position, and the total number of syntactical errors and warnings. The settings icon, which triggers the preferences modal, is also located in the status bar.

- #### Active language

  The active language is the programming language that the editor will use for syntax highlighting, code completion, and syntax validation.  

  - You define the active language for the code editor.
  - Each code editor can only have one active language at a time.
- #### Cursor position

  The line and column number associated with the active cursor position in the code editor is displayed in the status bar.
- #### Count of errors and warnings

  The total number of syntactical errors and warnings present in the editor are displayed as tab-buttons in the status bar.

### Preferences

Users can manage features such as line wrapping and active color theme from the preferences modal. This modal is triggered by the settings icon on the status bar. Store all user preferences and restore them when the user returns to the component.

- #### Line wrapping

  With line wrapping, users can have visibility over the source code content within the code editing area, by wrapping long lines of code onto new lines.  

  - When line wrapping is active, the maximum row width is the width of the code editing area in the component.
  - Line wrapping is active by default. Users can change this in the preferences modal.
- #### Theme

  The code editor comes with light and dark themes. By default, it's set to a light theme. To suit their preferences and work environment, users can modify the active theme in the preferences modal.  

  The theme is only applicable to the code editing area in the component.

### States

- #### Loading

  A loading state is displayed while the Ace library loads and the component is rendered on a page. When the code editor is in a loading state, add loading state text.
- #### Error

  An error state is displayed when the component fails to load. When the code editor is in an error state, add error state text. Provide a recovery action in the [error state](/components/code-editor/index.html.md)   , as a recovery mechanism.

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

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
