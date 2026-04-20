---
scraped_at: '2026-04-20T08:51:33+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/genai/generative-AI-chat/index.html.md
title: Generative AI chat
---

# Generative AI chat

Generative AI chat is a conversation between a user and a generative AI assistant.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [View demo](/examples/react/chat.html)
## Key UX concepts

### Distinguish between message authors

It's important to provide visual affordance that helps users distinguish between authors of messages involved in a conversation. [Avatars](/components/avatar/index.html.md) in [chat bubbles](/components/chat-bubble/index.html.md) help distinguish between messages sent by the user and generative AI by offering a different visual representation for the author of each message.

### Maintain the flow of a conversation

Conversations can be exchange of multiple messages between a user and generative AI. Use [support prompts](/components/support-prompt-group/index.html.md) to display suggested prompts from generative AI. This will help keep the conversation going and make the conversation more engaging.

### Earn trust with users

List the sources of content, or cite the sources inline of the generative AI response. This enhances credibility and allows users to verify the information. Allow users to provide feedback on generative AI responses and use the feedback to improve the responses produced by generative AI moving forward.

### Provide transparency

Users may feel uncertain or lose confidence during a generative chat if they're unaware of the system's processing status, especially when a generative AI response takes time or encounters an error. Display error and loading states to keep users informed about the generative AI's activity and help set clear expectations.

### Set user expectations around generative AI usage

Communicate the overall role of AI and risks involved with its usage in accordance by referencing any AI policies that are relevant to your product.

## Building blocks

A A B B C D E F G H I
#### A. Chat bubble

Display the [outgoing chat bubble](/components/chat-bubble/index.html.md) for messages sent by the user, and [incoming chat bubble](/components/chat-bubble/index.html.md) for messages received by the user from generative AI in a conversation.

#### B. Avatar

Represents the user and the generative AI with an [avatar](/components/avatar/index.html.md).

#### C. Citation popover - optional

Provide the inline citation to a unique source of content referenced by generative AI in a [popover](/components/popover/index.html.md) . Follow the [writing guidelines](/patterns/genai/generative-AI-chat/index.html.md) for inline citations.

#### D. Sources expandable section - optional

List all links to sources referenced by the generative AI to generate the response. Follow the [writing guidelines](/patterns/genai/generative-AI-chat/index.html.md) for sources to format the sources correctly.

#### E. Inline actions button group - optional

A collection of contextual and persistent actions that users can perform on generative AI responses:

- **Thumbs up and thumbs down feedback**   : users can provide feedback on whether the generated response was helpful or unhelpful. Follow the guidelines for [feedback on generative AI responses](/patterns/genai/generative-AI-chat/index.html.md)  .
- **Copy to clipboard**   : use the [copy to clipboard](/components/copy-to-clipboard/index.html.md)   icon button to copy the content of the generative AI response to the user's clipboard.
- **Other actions**   : For a large number of actions, display relevant and most used actions as standalone icon buttons in the button group component, and group less relevant ones in the [icon button dropdown](/components/button-dropdown/index.html.md)   . Follow the guidelines for [in-context actions](/patterns/general/actions/incontext-actions/index.html.md)  .

#### F. Stacked chat bubbles - optional

When displaying complex UI elements such as lists or code blocks in generative AI response, stack each element in separate chat bubbles to ensure clarity and improve readability. Only one avatar should be shown at the first bubble, and for the content displayed in the following bubbles, the avatar should be hidden to maintain a cleaner, more streamlined interface.

#### G. Prompt input

Enable users to enter and send text prompts in a generative AI chat. Display optional placeholder text suggesting an action. Once the user sends the prompt, it will be displayed as a conversational bubble. Leverage prompt templates with [variables](/patterns/genai/variables/index.html.md) to help users construct effective prompts while maintaining consistent structure.

#### H. Disclaimer - optional

A textual disclaimer displayed by services to inform users of any legal or other important information as needed. Use constraint text in the [form field](/components/form-field/index.html.md) to provide this information.

#### I. Support prompt group - optional

Support prompts are selectable message prompts that present recommended inputs to the user. They are displayed based on context from prior user actions and can help guide a conversation forward by suggesting the next input.

There are two possible scenarios for when a user selects a prompt:

- When it is not editable, the text is sent immediately as a [chat bubble](/components/chat-bubble/index.html.md)  .
- When editable, the text fills the [prompt input](/components/prompt-input/index.html.md)   , and is not sent immediately. Use this option when it is likely that users will want to edit the text before sending it.

For more details, see [support prompt group](/components/support-prompt-group/index.html.md).

## Other chat features

### Feedback on generative AI responses

#### Feedback flow and states

**Default state**
Use thumbs up to collect positive sentiment data. Use thumbs down to collect negative sentiment data. Follow the [writing guidelines](/patterns/genai/generative-AI-chat/index.html.md) for thumbs up and thumbs down tooltip labels.

**Loading state**
Show the loading state while the feedback is being submitted. Follow the [writing guidelines](/patterns/genai/generative-AI-chat/index.html.md) for submitting feedback.

**Submitted state**
Show the submitted state when the feedback has been successfully submitted. Follow the [writing guidelines](/patterns/genai/generative-AI-chat/index.html.md) for feedback submitted.

**Disabled reason after submission**
After submitting the feedback, add disabled reasons on thumbs up and down buttons to express gratitude to users, and confirm which feedback has been submitted. Follow the [writing guidelines](/patterns/genai/generative-AI-chat/index.html.md) for disabled reason after submission.

#### Additional feedback - optional

Display a dialog to collect additional feedback from users when they select the thumbs down button. Define the content within this dialog based on the feedback needed. You can display the questions using [form field](/components/form-field/index.html.md) , [checkboxes](/components/checkbox/index.html.md) , [radio group](/components/radio-group/index.html.md) , or [text area](/components/textarea/index.html.md).

Additional feedback is optional. Enable users to dismiss the additional feedback dialog. When users submit additional feedback, display a confirmation message to acknowledge their feedback has been collected in a stacked chat bubble below the generative output response.

### Generative AI assistant

Amazon S3 provides a simple web service interface that you can use to store and retrieve any amount of data, at any time, from anywhere. Using this service, you can easily build applications that make use of cloud native storage. Since Amazon S3 is highly scalable and you only pay for what you use, you can start small and grow your application as you wish, with no compromise on performance or reliability. "Helpful" option is unavailable after "Not helpful" feedback submitted. "Not helpful" feedback has been submitted.
#### Tell us more - optional

What did you dislike about the response? Harmful Incomplete Inaccurate Other Additional notes Submit Close
### States

#### Generating a response

Follow the guidelines for [generative AI loading states](/patterns/genai/genai-loading-states/index.html.md).

**Error state**
When users encounter an error display an [error alert](/components/alert/index.html.md) and include an action to recover, for example, try again. Types of error that can occur are, for example, access denied, [server side error](/patterns/general/errors/validation/index.html.md) , connection error. Follow the guidelines for [error messages.](/patterns/general/errors/error-messages/index.html.md)

### Generative AI assistant

JD List my S3 buckets. Access denied You don't have permission to [AWSS3:ListBuckets]. To request access, copy the following text and send it to your AWS administrator. [Learn more about troubleshooting access denied errors.](about:blank/index.html.md) `<div>User: [arn:aws:iam::123456789000:user/awsgenericuser]</div><div>Service: [AWSS3]</div><div>Action: [ListBuckets]</div><div>On resource(s): [arn:aws:S3:us-east-1:09876543211234567890]</div><div>Context: [no identity-based policy allows the AWSS3:ListBuckets action.]</div>` Copy
## General guidelines

### Do

- Display the appropriate [loading states](/patterns/genai/genai-loading-states/index.html.md)   to inform users that their input is received and being processed.
- Leverage the feedback provided by users on a generative AI response to improve the quality of future responses.
- Place the inline action [button groups](/components/button-group/index.html.md)   directly in the context of the corresponding [chat bubble](/components/chat-bubble/index.html.md)  .
- Ensure the inline action [button groups](/components/button-group/index.html.md)   are always visible without requiring additional interaction, such as hover.
- Optimize the widths of chat bubbles and additional feedback dialogs to suit different screen sizes. On smaller screens, utilize the full available width to maximize space efficiency. For larger screens, adjust the width to fit the content to avoid displaying excessive empty space.
- When collecting additional feedback, display a concise form by minimizing the number of follow up questions asked. Unnecessary questions can overwhelm users and impact form completion.
- Use stacked bubbles when you need to display complex UI elements, such as list of resources, table, or code block, or to display contextual inline actions for these elements.
- For languages that read left-to-right, align [chat bubbles](/components/chat-bubble/index.html.md)   to the left of its container. This will help enhance readability, support natural eye movement, and create a cohesive visual hierarchy. In languages that read right-to-left, revert this alignment to the right.
- For regenerate and stop functionality, see [response regeneration](/patterns/genai/response-regeneration/index.html.md)  .
- Align with your product team to determine the need for a disclaimer regarding generative AI usage in your product.

### Don't

- Avoid displaying all actions a user can perform to interact with generative AI in the shortcuts menu. Instead, display frequently performed actions as secondary actions in the [prompt input](/components/prompt-input/index.html.md)   to improve discoverability. For example, [file upload](/components/prompt-input/index.html.md)  .
- Limit the number of inline actions displayed at once to avoid overwhelming users. For example, display up to five frequently used buttons and move the rest into an [icon button dropdown](/components/button-dropdown/index.html.md)   in a [button group.](/components/button-group/index.html.md)
- While a new generative AI output message is loading, don't auto-scroll the user to the new message when the user is interacting with (scrolling, reading, copying) older messages.
- Don't use feedback on generative AI responses for non-generative AI use cases, such as feedback about the page users are viewing. Instead, follow the guidelines for [user feedback](/patterns/general/collect-user-feedback/index.html.md)  .

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

#### Terminology

- **Introducing the AI**   : use *generative AI assistant*   for introducing and referring to the AI, and *generative AI*   to refer to the experience.
- **User queries**   : use *submit *   as the label or reference term when a user is making a choice, query, or request.
- **AI replies**   : refer to AI replies as *responses*   , not *answers*  .

#### Chat bubble

- Follow the guidelines for [chat bubble](/components/chat-bubble/index.html.md)  .

#### Error

- Follow the guidelines for [error messages](/patterns/general/errors/error-messages/index.html.md)  .

#### Inline citations

- Use *\[1\], \[2\], \[3\]*   , and so on in progressing order for the inline text.
- When inline text triggers the [popover](/components/popover/index.html.md)   , include the title of the source with a dismiss button.

#### Sources

- As the title of the [expandable section](/components/expandable-section/index.html.md)   , use this text: *Sources*
- Inside the expandable section, list each of the sources link. If available, add the title of source, description, and date of publish using description text size.

#### Inline actions

- Follow the guidelines for [copy to clipboard](/components/copy-to-clipboard/index.html.md)   when displaying the success popover.

#### Placeholder text - optional

- Don't use terminal punctuation in the placeholder.
- Keep the placeholder brief, and avoid truncation (all of the text should be immediately visible in the field).
- For the user input field, use this text: *Ask a question*
- When enabling application-specific actions in the shortcuts menu, use this text: *Ask a question or type "/" for more actions*
- Follow the writing guidelines for [placeholder text.](/components/input/index.html.md)

#### Thumbs up and thumbs down tooltip label

- For thumbs up button, use this text: *Helpful*
- For thumbs down button, use this text: *Not helpful*
- Follow the guidelines in [button group](/components/button-group/index.html.md)  .

#### Submitting feedback

Use this text: *Submitting feedback*

#### Feedback submitted

Use this text: *Feedback submitted*

#### Disabled reason after submission

- After submitting thumbs up feedback, use this text:  

  - For disabled thumbs up filled button: *"Helpful" feedback has been submitted.*
  - For disabled thumbs down button: *"Not helpful" option is unavailable after "helpful" feedback submitted. *
- After submitting thumbs down feedback, use this text:  

  - For disabled thumbs up button: *"Helpful" option is unavailable after "not helpful" feedback submitted. *
  - For disabled thumbs down filled button: *"Not Helpful" feedback has been submitted.*
- Follow the guidelines in [button group](/components/button-group/index.html.md)  .
- Follow the guidelines in [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

#### Additional feedback confirmation

Express gratitude to users and confirm that feedback is received.

- For example: *Your feedback has been submitted. Thank you for your additional feedback.*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component specific guidelines

- Use `role="region"`   with a meaningful `aria-label`   in the element that contains the [chat bubbles](/components/chat-bubble/index.html.md)  .  

  - For example: `<div role="region" aria-label="Chat"><Chat /></div>`
- Ensure any new message is announced using visually hidden `LiveRegion`   component.  

  - For example: `<LiveRegion hidden={true}>{latestMessage}</LiveRegion>`
