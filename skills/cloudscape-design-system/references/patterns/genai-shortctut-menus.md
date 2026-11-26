---
scraped_at: '2026-04-20T08:51:46+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/genai/shortctut-menus/index.html.md
title: Shortcut menus
---

# Shortcut menus

Use shortcut menus to help users modify behavior, add context, and execute quick actions.

## Key UX concepts

#### Invoke a shortcut menu

Shortcut menus can be invoked through typing special characters or selecting icon buttons.* * Providing shortcut menu access through both keystrokes and buttons supports both discoverability for new users through visible buttons and efficiency for power users through keystrokes. For example, the prompt input secondary actions slot can display a group of buttons that, when clicked, invoke a menu. Additionally, typing special characters like *@* or */* in the text area can trigger menus.

#### Enhance natural language prompts

Users interact with generative AI tools like code assistants or content generators through natural language prompts. Shortcut menus can enhance these prompts by allowing users to complete actions like specifying a mode and inserting references to provide additional context while maintaining the flow of their text input. For example, a developer might activate */code* mode when asking for code analysis, or a content creator might reference specific documentation while requesting a text summary.

#### Actions

Actions help users modify system behavior or execute common tasks. By typing */* or using an icon button, users can access different types of actions like setting modes ( which sets the framework for how the system should process and respond to user input ) or using quick commands (like clearing context or getting help). For example, a user might set a mode to specify how their prompts should be interpreted, or execute a quick action to start a new conversation.

#### References

References are interactive shortcuts that let users add context to their prompts. Users can select files, code snippets, and other data sources without manually copying file paths. This functionality creates a more efficient way to enhance prompts without disrupting the natural flow of conversation or requiring technical knowledge of file systems and paths.

#### Contextual relevance

Shortcuts open specific menu types. This helps users by showing only relevant options like modes when they need to change behavior, or references when they need to add context. For example, typing */* opens a menu of modes or quick actions, while typing *@ * opens a menu for items that can be referenced within a prompt.

## Common symbols

| **Symbol** | **Use** | **Example** |
| --- | --- | --- |
| / | Performing quick actions | In a prompt input, a user enacts a quick action through a forward slash like /clear to remove all references, files and context currently in the prompt input. |
| @ | References for inserting files, usernames, or other resources | In a prompt input, a user requests a cost analysis and provides the system with additional context by referencing a .csv file in their prompt via a shortcut menu. |

## Common use cases

### Executing quick actions

Quick actions provide users with access to helpful commands. They reduce the need to manually type out common commands like *help* or *clear* . Quick actions appear alongside modes in the shortcut menu when using the */* command or button, making them easy to discover and execute. Common quick actions include clearing the conversation or prompt input, accessing help documentation, or starting a new chat.

![Video]()
Controls: true

### Setting a mode

Setting a mode tells the system how to interpret user input entered in a [prompt input](/components/prompt-input/index.html.md) . For example, selecting */dev* for technical, development-related prompts. Users can set a mode with the prompt input with keystrokes or icon buttons. Typing / at the beginning of a prompt will invoke a shortcut menu for setting modes. Alternatively a user can set a mode at any time through an icon button.

![Video]()
Controls: true

### Adding additional context to a prompt

Users can add additional context to a prompt by inserting references to relevant data sources that the system is connected to, either by using a keystroke like @ or by clicking an icon button.

![Video]()
Controls: true

### Replacing placeholder variables in prompt templates

Users can highlight the placeholder variable in their inserted prompt template and use *@* to replace them with actual references. For example, when a template contains <dataset>, users can swap it with a specific data reference through the reference menu, customizing the template while maintaining the inserted template's structure.

![Video]()
Controls: true

## General guidelines

### Do

- Use [groups](/components/autosuggest/index.html.md)   and descriptive labels to separate different kinds of menu items.
- Use constraint text below the prompt input to increase visibility of available shortcut menus and their functionality.
- Use one symbol per menu type.
- Persist modes when users are likely to continue similar prompts. For example, maintain a mode like / *dev *   across multiple turns so users don't need to reapply it each time they ask a question or give a command.
- Keep active modes visible and display them as an inline token so users always know which mode they've configured. Users need to see their currently applied mode to understand how the system will interpret and process their input.

### Don't

- Don't show more than one shortcut menu at a time.

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

#### Reference item groups

- Use descriptive names for categories of reference types within suggestion groups to help users select relevant items within shortcut menus.  

  - For example: a shortcut menu triggered by a */*     may have  both quick actions and modes labeled as *Modes*     and *Quick actions*    .

#### Constraint text

- Describe the special characters and the shortcut menus they invoke separated by commas.  

  - For example: Use */*     to set a mode and quick actions, *@*     to add context.

#### Menu button labels

- Match the label to the keyboard character that triggers the same menu.  

  - For example: */*     button for modes and actions menu, *@*     button for references menu.
- Follow [writing guidelines for icon button](/components/button/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Related patterns and components

### Generative AI chat

Generative AI chat is a conversation between a user and a generative AI assistant.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/chat)

[View Documentation](/patterns/genai/generative-AI-chat/index.html.md)

### Prompt input

Enables users to provide a prompt or command.

[View Documentation](/components/prompt-input/index.html.md)

### Variables

A pattern for using variables within structured content such as prompt templates, code snippets, and text with predefined formats.---

[View Documentation](/patterns/genai/variables/index.html.md)
