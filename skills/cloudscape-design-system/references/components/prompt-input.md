---
scraped_at: '2026-04-20T08:49:04+00:00'
section: components
source_url: https://cloudscape.design/components/prompt-input/index.html.md
title: Prompt input
---

# Prompt input

Enables users to provide a prompt or command.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/prompt-input)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/prompt-input/index.html.json)

## Development guidelines

#### State management

The prompt input component is controlled. Set the `value` or `tokens` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

#### Shortcuts

To enable shortcuts the following properties need to be set:

- `tokens`   - the state to control the content inside the input.
- `menus`   - the options and triggers to include in the input as shortcuts.

#### State to text conversion

To have full control of the plain text conversions of the content in the input set `tokensToText` . This will change the `value` returned in `onChange` and `onAction` to allow for transforming references to either a visual representation to use in chat bubbles or with their underlying values (such as file content) for content sent to LLMs.

The following state: `[{type: "text", value: "Hello "}, {type: "reference", id: "ref-1", label: "file.txt", value: "1 2 3 4"}]`

Can be converted to: `"Hello file.txt"` or `"Hello 1 2 3 4"`

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Testing guidelines

When using shortcuts a `ref` should be used to access the `insertText` function. Use this function to set content at the desired `caretStart` location (defaults to current cursor location if not set). This will insert content and trigger the necessary browser events to enable testing complex shortcut behaviours.

## Unit testing examples

Use insertText to test shortcut behaviors
```
import PromptInput from '@cloudscape-design/components/prompt-input';
import { PromptInputProps } from '@cloudscape-design/components/prompt-input/interfaces';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render, waitFor } from '@testing-library/react';
import React, { act } from 'react';
import { createRef, useState } from 'react';

const menus: PromptInputProps.MenuDefinition[] = [
  {
    id: 'commands',
    trigger: '/',
    useAtStart: true,
    filteringType: 'auto',
    empty: 'No commands found',
    options: [
      { value: 'dev', label: 'Developer Mode', description: 'Optimized for code generation' },
      { value: 'creative', label: 'Creative Mode', description: 'Optimized for creative writing' },
    ],
  },
  {
    id: 'mentions',
    trigger: '@',
    filteringType: 'auto',
    empty: 'No users found',
    options: [
      { value: 'alice.johnson', label: 'Alice Johnson', description: 'Product Manager' },
      { value: 'bob.smith', label: 'Bob Smith', description: 'Software Engineer' },
      { value: 'new.user', label: 'New User', description: 'New team member' },
    ],
  },
];

function Component({ promptInputRef }: { promptInputRef: React.Ref<PromptInputProps.Ref> }) {
  const [tokens, setTokens] = useState<readonly PromptInputProps.InputToken[]>([]);

  return (
    <PromptInput
      ref={promptInputRef}
      ariaLabel="Prompt input"
      tokens={tokens}
      onChange={({ detail }) => setTokens(detail.tokens || [])}
      menus={menus}
    />
  );
}

describe('<PromptInput />', () => {
  it('opens mode menu', async () => {
    const ref = createRef<PromptInputProps.Ref>();
    const { container } = render(<Component promptInputRef={ref} />);
    const wrapper = createWrapper(container).findPromptInput()!;

    // Use insertText to type "/" at the start, triggering the commands menu
    act(() => {
      ref.current!.insertText('/');
    });

    await waitFor(() => {
      expect(wrapper.findOpenMenu()).toBeTruthy();
    });

    expect(wrapper.findOpenMenu()!.findOptions().length).toBeGreaterThan(0);
  });

  it('opens and filters mentions menu', async () => {
    const ref = createRef<PromptInputProps.Ref>();
    const { container } = render(<Component promptInputRef={ref} />);
    const wrapper = createWrapper(container).findPromptInput()!;

    // Use insertText to type "@new", triggering and filtering the mentions menu
    act(() => {
      ref.current!.insertText('@new');
    });

    await waitFor(() => {
      expect(wrapper.findOpenMenu()).toBeTruthy();
    });

    expect(wrapper.findOpenMenu()!.findOptionByValue('new.user')).not.toBeNull();
  });
});
```

## Unit testing APIs

PromptInputWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActionButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> | Finds the action button. Note that, despite its typings, this may return null. | - |
| findContentEditableElement | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLDivElement> &#124; null | Finds the contentEditable element used when menus or tokens is defined. | - |
| findCustomPrimaryAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLDivElement> &#124; null | - | - |
| findNativeTextarea | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLTextAreaElement> | Finds the native textarea element.Note: When menus or tokens is defined, the component uses a contentEditable element instead of a textarea.In this case, use findContentEditableElement() instead. | - |
| findOpenMenu | [PromptInputMenuWrapper](/index.html.md) &#124; null | Finds the menu dropdown when menus or tokens is defined. | - |
| findSecondaryActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLDivElement> | Finds the secondary actions slot. Note that, despite its typings, this may return null. | - |
| findSecondaryContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLDivElement> &#124; null | - | - |
| getTextareaValue | string | Gets the value of the component.Returns the current value of the textarea.When menus or tokens is defined, the component uses a contentEditable element.Use findContentEditableElement().getElement().textContent instead. | - |
| isMenuOpen | boolean | Checks if the menu is currently open. | - |
| selectMenuOption | - | Selects an option from the menu by simulating mouse events. | optionIndex:1-based index of the option to select |
| selectMenuOptionByValue | - | Selects an option from the menu by simulating mouse events. | value:value of option to select |
| setTextareaValue | - | Sets the value of the textarea and calls the onChange handler.When menus or tokens is defined, the component uses a contentEditable elementand this method will have no effect. | value:value to set the textarea to. | PromptInputMenuWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findOption | [OptionWrapper](/index.html.md) &#124; null | Returns an option from the menu. | optionIndex:1-based index of the option to select. |
| findOptionByValue | [OptionWrapper](/index.html.md) &#124; null | Returns an option from the menu by its value | value:The 'value' of the option. |
| findOptions | Array<[OptionWrapper](/index.html.md)> | - | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTags | Array<[ElementWrapper](/index.html.md)> &#124; null | - | - |
| isDisabled | boolean | - | - |
## Integration testing APIs

PromptInputWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActionButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the action button. Note that, despite its typings, this may return null. | - |
| findContentEditableElement | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the contentEditable element used when menus or tokens is defined. | - |
| findCustomPrimaryAction | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNativeTextarea | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the native textarea element.Note: When menus or tokens is defined, the component uses a contentEditable element instead of a textarea.In this case, use findContentEditableElement() instead. | - |
| findOpenMenu | [PromptInputMenuWrapper](/index.html.md) | Finds the menu dropdown when menus or tokens is defined. | - |
| findSecondaryActions | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the secondary actions slot. Note that, despite its typings, this may return null. | - |
| findSecondaryContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | PromptInputMenuWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findOption | [OptionWrapper](/index.html.md) | Returns an option from the menu. | optionIndex:1-based index of the option to select. |
| findOptionByValue | [OptionWrapper](/index.html.md) | Returns an option from the menu by its value | value:The 'value' of the option. |
| findOptions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[OptionWrapper](/index.html.md)> | - | - | OptionWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDisabledReason | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the label wrapper of this option. | - |
| findLabelTag | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTags | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
## General guidelines

### Do

- Use prompt input component in the [generative AI chat](/patterns/genai/generative-AI-chat/index.html.md)  .
- To display information regarding [character count](/components/form-field/index.html.md)   in the prompt input, use constraint text in the [form field](/components/form-field/index.html.md)   component.
- Every prompt input without an action button should have a visible label. Use the [form field](/components/form-field/index.html.md)   for labelling your prompt inputs. Prompt inputs with action buttons don't require labels. The action button serves as the label.
- When the prompt input is in a disabled or read-only state, all content inside `secondaryActions`   and `secondaryContent`   should also be in that state.
- Use constraint text below the prompt input to increase visibility of available shortcut menus and their functionality. For example, *Use / to set a mode and quick actions, @ to add context*  .
- When shortcut menus are available, provide a *help*   action to communicate to users which shortcuts and actions are available.
- Separate logical options across different shortcut menus. For example, */*   for modes, *@*   for resources and *\#*   for topics.

### Don't

- Don't use prompt input with an action button as a replacement for [input](/components/input/index.html.md)   or [text area](/components/textarea/index.html.md)   in a form. This helps users avoid confusion regarding what is being submitted.
- Use lengthy labels in menu options, this affects the length of inserted references which should remain concise.

## Features

- #### Input area

  An input area that enables users to enter text. For example, type in a text prompt in a generative AI chat.
- #### Multiple lines - optional

  You can set a minimum and maximum number of rows for the input. By default, it displays one row as the minimum and three rows as the maximum. However, choose the minimum number of rows displayed based on the length of prompts entered in majority of use cases in your product. For example, if users typically enter longer prompts, display two rows by default.
- #### Placeholder - optional

  A hint or suggested action that helps users enter a prompt. For example: *Ask a question*
- #### Action button - optional

  An action button that allows users to execute the prompt in the input area. For example, a send icon button to let users send their text prompts as described in [generative AI chat](/patterns/genai/generative-AI-chat/index.html.md)  .
- #### Keyboard navigation

**Standard behaviour**  

  - Users can press the Enter key to trigger the action.
  - Users can press the Shift + Enter keys to move to a new line.

**Shortcuts behaviour**  

  - Users can type trigger characters to show relevant menus.
  - Users can use up/down arrow keys to navigate through options in the menus.
- #### Secondary actions - optional

  Additional actions that are related to the prompt input. For example, uploading files, switching response contexts, or conversation settings. Recommended components for this slot are the [button group](/components/button-group/index.html.md)   or [icon button](/components/button/index.html.md)  .
- #### Secondary content - optional

  Secondary content related to the prompt. For example, file attachments or images.

### Shortcut menus

Interactive menus that help users modify behavior, add context, and execute quick actions within the prompt input. Users can invoke shortcut menus by typing special characters such as */ or @ * in the input area or by selecting icon buttons in the secondary actions slot. For example, typing *@* opens a menu to insert file references, or typing */* opens a menu to set modes or execute quick actions. See the [shortcut menus pattern](/patterns/genai/shortctut-menus/index.html.md) for implementation details.

- #### Triggers

  These can be any keyboard character such as */*   or *@*   . Placing a trigger in the prompt input results in the corresponding menu being displayed. Adding text to the trigger results in options within the menu being filtered.
- #### Menu buttons - optional

  Secondary action icon buttons to enable adding a trigger symbol in the input.
- #### Menus

  A set of options for a given shortcut trigger symbol. Multiple menus can be configured with unique trigger symbols and options for each. Trigger symbols are not limited any particular character. For example, *\#*   or *$*   and any other symbol are valid.
- #### References

  The visual representation of a selected option from the matching menu. Option data will be used for reference details, `label`   will be the visually displayed text of the reference and `value`   will be the data the reference represents. For example, use references for files, people or resources.
- #### Pinned references

  These are pinned at the start of the input and typically persist after submitting the input. For example, use pinned references for modes or system prompts.

[View Documentation](/patterns/genai/shortctut-menus/index.html.md)

### States

- #### Disabled

  Use the disabled state when users cannot interact with input and to prevent users from modifying the value.

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

#### Placeholder

- Follow the writing guidelines for [placeholder text](/patterns/genai/generative-AI-chat/index.html.md)   on generative AI chat pattern.

#### Constraint text

- Follow the writing guidelines for [constraint text](/components/form-field/index.html.md)  .

#### Inline token

- Keep reference labels concise.

#### Button

- Follow writing guidelines for [button](/components/button/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- Set the `actionButtonAriaLabel`   dependent on the icon type.
- All controls should have a label for screen readers to read on focus.
- The placeholder disappears when the user has typed in the input area. For important information that you want to persist on the page, use [constraint text](/components/form-field/index.html.md)   instead.
- When adding dismissable content to the `secondaryContent`   slot, such as attachments, focus should return to the input if all elements are dismissed. Do this by calling the `focus()`   function once all elements are dismissed. Similarly, if an attachment is added, focus should move to the dismiss button of that attachment.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
