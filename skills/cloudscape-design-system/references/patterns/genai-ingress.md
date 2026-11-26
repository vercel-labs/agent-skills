---
scraped_at: '2026-04-20T08:51:38+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/genai/ingress/index.html.md
title: Ingress
---

# Ingress

An interactive element such as a button that lets users engage a generative AI-powered feature.

 [Get design library](/get-started/for-designers/design-resources/index.html.md)
## Key UX concepts

### Ingress for generative AI

As explained in the generative AI pattern abstraction, ingress is the the first time a user comes across a generative AI feature (for example, enabling a generative AI feature or entering a playground). To ensure users identify this action button amid other non-generative AI actions on a page, generative AI affordance for buttons is used.

### Branded vs generic generative AI experiences

Certain generative AI experiences leverage product-specific visual branding, such as iconography. In order to determine if your product needs to be branded with product specific iconography, work with your product managers and team leadership.

### Standalone vs integrated sparkle as affordance

The standalone sparkle icon can be used to highlight AI as the primary or sole function of the feature. For example, "Ask AI" button or AI chat ingress. Sparkle can be integrated with other icons to indicate that AI enhances an existing, familiar function. For example, AI-enhanced search.

## Development guidelines

Refer to the code examples below for the primary and secondary [buttons](/components/button/index.html.md) when used in the context of generative AI.

### GenAI primary button

Primary button
```
<Button variant="primary" iconAlign="left" iconName="gen-ai" ariaLabel="Generative AI - Primary button">
  Primary button
</Button>
```

### GenAI secondary button

Normal button
```
<Button iconAlign="left" iconName="gen-ai" ariaLabel="Generative AI - Normal button">
  Normal button
</Button>
```

Normal button
```
<Button iconAlign="left" iconName="edit-gen-ai" ariaLabel="AI-powered edit button">
  Normal button
</Button>
```

### GenAI icon button

```
<Button variant="icon" iconName="search-gen-ai" ariaLabel="AI-powered search button" />
```

## General guidelines

### Do

- **Use the sparkle icon for actions related to generative AI**   Sparkles are the symbolic convention for generative AI. When this icon is used in an action button, it informs users of the nature of that action.
- **Displaying only one primary buttons on a page**   The [Highlander](https://en.wikipedia.org/wiki/Highlander_(film))   rule for a primary button applies; there can be only one per page. If there is an action that users are most likely to take and is the primary action, don't use another primary button for generative AI, instead use the secondary button with generative AI affordance.

### Don't

- **Avoid overuse and overwhelming users**   A button that leverages generative AI affordance should only be used to highlight an action compared to others on the page or that section. For example, if all actions inside a section are powered by generative AI, and the context is communicated to users at the section level such as headers, those buttons don't need to leverage the iconography to avoid overwhelming users visually.

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

- **Introducing the AI: ** *generative AI assistant*   is the approved term for introducing and referring to the AI, and *generative AI*   to refer to the experience.
- **User queries: **   use *submit*   as the label or reference term when a user is making a choice, query, or request.
- **AI replies: **   refer to AI replies as *responses*   , not *answers*  .

#### Button text

- Follow the writing guidelines for [button](/components/button/index.html.md)  .
