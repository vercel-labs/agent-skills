---
scraped_at: '2026-04-20T08:51:31+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/genai/genai-patterns/index.html.md
title: Pattern abstraction
---

# Pattern abstraction

An abstraction of generative AI patterns.

## Pattern abstraction

### Context

In any given use case, generative AI adapts to the context a user is in by taking into account variables such as user preferences, previous interactions, and other situational factors. This contextual awareness helps inform how, when, and where generative AI is presented to users. Context can be categorized into two types; inferred and explicit.

- The context is *inferred *   when the system predicts a need for generative AI intervention based on user actions, and dynamically presents an opportunity for users to engage with generative AI to help them proceed faster in their task flows. For example, generative AI infers need for assistance for error resolution and presents a CTA in the UI.
- The context is considered *explicit *   when the system does not predictively surface opportunities for user engagement, and instead relies on expression of explicit user intent to engage with generative AI at any given point in the user flow. For example, the call to action for a chat with a generative AI assistant is always displayed, and a user can explicitly chose to engage with it.

### Ingress - optional

The first time a user comes across a generative AI feature (for example, enabling a generative AI feature or entering a playground). A consistent visual treatment of ingress points helps establish a mental model for users to identify a generative AI-powered feature anytime they encounter an element with a set visual style and treatment.

### Interaction paradigm

The type of interface and interaction a user has with generative AI informs its interaction paradigm. For example, when a user converses with generative AI in a chat UI, the interaction paradigm is chat.

### Model modality

Model modality is the nature of exchange between a user and generative AI and can be text or image. It is a characteristic of the interaction paradigm. For example, in a chat interface, the modal modality is usually text.

### User input

To engage with generative AI, users provide an input in the form of a prompt or command. It serves as the instruction from a user that the generative AI bases its response on.

### Generative AI in progress

This is the state where generative AI is processing the input sent by a user, and has a distinct visual affordance. For example, generative AI is generating a response to a user prompt in a conversation.

### Generative AI output

When generative AI is finished processing the input sent by users, it returns an output.

## Patterns

### Generative AI chat

Generative AI chat is a conversation between a user and a generative AI assistant.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/chat)

[View Documentation](/patterns/genai/generative-AI-chat/index.html.md)

### Ingress

An interactive element such as a button that lets users engage a generative AI-powered feature.

[View Documentation](/patterns/genai/ingress/index.html.md)

### Generative AI output label

A short label to indicate that an output is produced by generative AI.---

[View Documentation](/patterns/genai/output-label/index.html.md)
