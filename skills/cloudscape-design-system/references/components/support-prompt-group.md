---
scraped_at: '2026-04-20T08:49:32+00:00'
section: components
source_url: https://cloudscape.design/components/support-prompt-group/index.html.md
title: Support prompt group
---

# Support prompt group

Selectable message prompts in generative AI chats that present recommended inputs to the user.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/chat-components/tree/main/src/support-prompt-group) If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/support-prompt-group/index.html.json)

## Unit testing APIs

SupportPromptGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItemById | [SupportPromptWrapper](/index.html.md) &#124; null | Finds a support prompt item by its id. | id: |
| findItems | Array<[ElementWrapper](/index.html.md)> | Finds all items. | - | SupportPromptWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## Integration testing APIs

SupportPromptGroupWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findItemById | [SupportPromptWrapper](/index.html.md) | Finds a support prompt item by its id. | id: |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | Finds all items. | - | SupportPromptWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## General guidelines

### Do

- Use support prompt group in [generative AI chat](/patterns/genai/generative-AI-chat/index.html.md)  .
- Hide previous support prompts once a message is sent in the chat. Once a message is sent, the conversation progresses, and the context changes. As a result, the older support prompts may not be relevant to the user anymore.
- Once support prompt text is sent as a message, follow guidelines for generating a response in [generative AI loading states](/patterns/genai/genai-loading-states/index.html.md)  .

### Don't

- Don't display more than five support prompts at a time to avoid cognitive overload.
- Don't use support prompt group to show selected items from a list, instead use [token group](/components/token-group/index.html.md)  .

## Features

- #### Text

  There are two possible scenarios for when a user selects a prompt:  

  - When it is not editable, the text is sent immediately as a [chat bubble](/components/chat-bubble/index.html.md)    .
  - When editable, the text fills the [prompt input](/components/prompt-input/index.html.md)     , and is not sent immediately. Use this option when it is likely that users will want to edit the text before sending it.
- #### Alignment

  - **Vertical **     (default) - By default, support prompts are vertically aligned to allow for easy scanning.    

    - For example, below incoming chat bubbles.
  - **Horizontal - **     In instances where compact prompts would be beneficial, horizontal alignment can be used instead.    

    - For example, at the beginning of new chats or with short text.

## Writing guidelines

- Keep labels and descriptions clear and concise.
- Use parallel sentence structure.
- Use sentence case for all text. Don't use title case.
- Use present-tense verbs and active voice wherever possible.
- Don't use "please," "thank you," or Latinisms such as "e.g.," "i.e.," or "etc."

### Component-specific guidelines

- Phrase prompts as either a full question or a request.  

  - For example: "List my S3 buckets" or "What is the difference between S3 and EC2?"

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

- Specify an aria label for the group of support prompts.
- Provide text for every support prompt in the group to ensure all elements have an accessible name.

#### Keyboard interaction

- Focus moves between the support prompts with left, right, up, and down arrow keys.
- Press the enter or space key to select the prompt.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
