---
scraped_at: '2026-04-20T08:51:48+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/genai/support-prompts/index.html.md
title: Support prompts
---

# Support prompts

Prompts in generative AI chats that present recommended inputs to the user

## Key UX concepts

### Types

Support prompts in AI workflows can be largely categorized into two types: non-editable prompts and editable prompts. The distinction is based on what happens when a user selects them.

- **Non-editable: **   These prompts send immediately upon selection without appearing in the prompt input.
- **Editable: **   Editable prompts populate the prompt input field when selected, allowing users to review, modify, or replace the [variables](/patterns/genai/variables/index.html.md)   in the prompt template before sending.

### Affordance for editability

Editable prompts do not execute on selection. The interface should clearly signal that the prompt can be edited with an edit icon before any interaction occurs. A designated visual affordance sets the correct expectation that selecting the prompt will insert the editable text.

### No persistent state

Selecting a prompt is a one-time interaction that inserts text into the prompt input. [Support prompts](/patterns/genai/support-prompts/index.html.md) do not maintain state upon selection. Selecting a prompt is a one-time interaction that either populates the prompt input in editable prompts or sends immediately with non-editable prompts.

## Common use cases

### Helping users get started

Editable prompts can be useful when users are beginning an AI interaction. They act as starting points, or icebreakers, that users can select from to get started.

# Welcome to the AI assistant

Choose a prompt below or type your own in the prompt input to begin a conversation.

Explain my cost trends Visualizes spending over time Analyze my EC2 instance performance Reviews compute metrics and optimization Generate a cost optimization report Actionable recommendations to reduce spending Use of this service is subject to the [AWS Responsible AI Policy](https://aws.amazon.com/machine-learning/responsible-ai/policy/)
### Guiding users during a conversation

Non-editable prompts help maintain conversation flow by proactively suggesting contextually relevant next steps. Users can quickly select these suggestions to continue the interaction without composing their own prompt, making the experience feel more guided.

How can I help? JD My AWS bill increased by 30% last month and I need to understand why I've analyzed your billing data and identified cost increases across multiple regions and services. To help you investigate further, I can generate a comprehensive cost report covering both EC2 and S3, or create a workflow one service at a time. Create comprehensive cost report Create individual cost report for my service Use of this service is subject to the [AWS Responsible AI Policy](https://aws.amazon.com/machine-learning/responsible-ai/policy/)
## General guidelines

### Do

- Enable users to edit all text after inserting an editable prompt into the [prompt input](/components/prompt-input/index.html.md)  .
- Use [variables](/patterns/genai/variables/index.html.md)   in editable prompt text to indicate expected customization. For example, when a user selects "Analyze my AWS cost trends over the past <time_period>," they understand that <time_period> is the primary element to customize.

### Don't

- Avoid using editable prompts when prompts should be sent directly into the conversation. For example, use non-editable prompts for contextual [follow-up questions](/patterns/genai/follow-up-questions/index.html.md)   , or suggestions like "Show me more details" or "Compare with last quarter" that users can quickly select and send without customization.
- Don't disable text inserted from a prompt template.

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

#### Variable text

- Follow the writing guidelines for [variables](/patterns/genai/variables/index.html.md)  .

#### Support prompt labels

- Follow the writing guidelines for [support prompt group](/components/support-prompt-group/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.
