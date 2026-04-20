---
scraped_at: '2026-04-20T08:51:44+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/genai/response-regeneration/index.html.md
title: Response regeneration
---

# Response regeneration

Enables users to generate an alternative response in generative AI chat.

## Key UX concepts

#### Regeneration

A user can request a new version of a model's response, which generates an alternate response to replace the original one. This approach maintains the conversation's prior context while allowing users to explore alternative responses to their questions. The same process applies whether the original response was completed or interrupted by the user through a stop action.

#### Model reprocessing

During regeneration, the model performs a new sampling process to generate an alternative response. While using the same prompt and conversation context, the model can produce varied outputs due to the probabilistic nature of language model generation. This is similar to getting different arrangements each time you shuffle a deck of cards.

#### Distinguishing regeneration from re-prompting

Regeneration happens when a user selects an explicit regenerate icon button. The model then replays the exact same input to generate a new response. Alternatively, typing a phrase like "try again" or "regenerate that" is a new, natural language prompt that the system interprets contextually as a new request.

#### How regeneration affects context

Context builds a shared understanding between user and system throughout their conversation. When a user regenerates a response, it changes the conversation's path from that point, like traveling back in time to take a different direction forward. To maintain consistent context, the system removes all messages that came after the regenerated response. This ensures the conversation can continue naturally along its new path without conflicting with messages from the previous direction.

## Building blocks

A B C D
#### A. User prompt

The user's original question using the [chat bubble](/components/chat-bubble/index.html.md) outgoing message with an [avatar](/components/avatar/index.html.md) to indicate it's a sent message.

#### B. Generated response

The system's response is displayed using the [chat bubble](/components/chat-bubble/index.html.md) incoming message and [generative AI avatar](/components/avatar/index.html.md) to indicate it's a received message.

#### C. Regenerate button

An [icon button](/components/button/index.html.md) within the [button group](/components/button-group/index.html.md) with a [refresh icon](/foundation/visual-foundation/iconography/index.html.md) that allows users to request an alternative response to the same prompt. Appears consistently below each eligible system response.

#### D. Stop action - optional

After a user has sent a prompt, the send button changes to a stop button which enables users to interrupt the generation or processing of a response.

## Common use cases

#### Regenerate a completed response

Users can regenerate a completed response to see alternative versions of the same response. The action reuses the original user prompt and context so the conversation stays coherent while exploring new outputs.

JD How do I plan a software release schedule? Release planning necessitates implementing cascading milestone dependencies, configuring automated workflow orchestration patterns, and establishing synchronized deployment windows with cross-team change management protocols. Each release cycle must incorporate parallel development streams with granular feature flagging mechanisms. Version control branching strategies should align with continuous integration pipelines while maintaining separate staging environments for quality assurance validation procedures. Use of this service is subject to the [AWS Responsible AI Policy](https://aws.amazon.com/machine-learning/responsible-ai/policy/)
#### Regenerate a stopped response

Users can stop generation as soon as they notice an unwanted response direction. This prevents the model from consuming additional tokens generating an unwanted response. The regenerate option becomes immediately available, letting users quickly pivot to better alternatives. For example, if a user sees the response taking an overly technical approach, they can stop the generation and use regenerate to get a different response to their original prompt without changing anything.

JD What are the benefits of automation? Automation is a complex technological process that involves sophisticated algorithmic implementations across multiple system architectures. The fundamental computational principles underlying automation include... Use of this service is subject to the [AWS Responsible AI Policy](https://aws.amazon.com/machine-learning/responsible-ai/policy/)
## General guidelines

### Do

- Place regeneration action in button group to create a more accessible tab order, since regenerating is typically selected after a user sent a response in the prompt input.
- Add a regeneration button only to user-initiated responses that can be regenerated without breaking context.
- Allow users to regenerate after stopping a prompt and also after system has completed a response.
- Follow [error states for Generative AI chat](/patterns/genai/generative-AI-chat/index.html.md)   to handle failed regeneration attempts.

### Don't

- Don't add additional friction to stopping generating responses. Users should be able to stop generation immediately.

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
