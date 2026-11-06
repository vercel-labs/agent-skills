---
scraped_at: '2026-04-20T08:52:11+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/density-settings/index.html.md
title: Density settings
---

# Density settings

With the density settings pattern, users can define the preferred density level of the content visible within the interface.

 [View demo](/examples/react/dashboard.html?awsui-density=compact)
## Objectives

### Service level settings

When implementing [density modes](/foundation/visual-foundation/content-density/index.html.md) in your service, you must provide users with a mechanism to choose between comfortable and compact mode. With this pattern, you can set up service-level settings for density modes. Make sure when you use this pattern, you store the user's preference across all pages within your service.

## Building blocks

A B C D E F
#### A. Density settings link

Use a [side navigation link](/components/side-navigation/index.html.md) to trigger a modal. Place the link as last item in your side navigation and separate it from the other links with a divider. If your service already has a settings area include the content density selection there.

#### B. Modal

Use a modal to display the appearance settings.

#### C. Form field label

Include a form field label and description to provide context to users.

#### D. Tiles

Use tiles so that users can select a mode. Include label, description, and image in both options.

#### E. Form actions

Include form actions so that users can confirm or cancel their choice.

#### F. Dismiss button

Include a dismiss button to close the modal. Upon dismiss no changes are applied.

## Scenarios

### Full implementation

When compact mode is fully available in your service implement the density settings and provide context to your users via form field description.

Content density Choose the preferred level of content density for this console. Comfortable Compact
### Partial implementation

When compact mode is partially available in your service, for example due to version migration strategies or rollout in only some sub-services, include additional information in the form field description to set expectations for users.

Content density Choose the preferred level of content density of this console. The compact experience is available for some features in this console. Comfortable Compact
## Feature announcement

- Customize your view experience   You can now customize the level of content density for CloudFront console density settings. [Let us know what you think](about:blank/index.html.md)  .   Open density settings

We recommend communicating the release of the compact mode to your users, for example by using a [flash message](/components/flashbar/index.html.md) . Include information about compact mode release, and an [action button](/components/button/index.html.md) to choose the preferred density level via density settings modal.
You can optionally include a link to allow users to provide feedback, via the feedback mechanism found in the global footer.

## General guidelines

### Do

- Always provide comfortable mode as default. Compact mode reduced spacing can hinder readability of content for users with vision impairment, and interactivity with close targets for users with physical disability.
- Store users preferences when they select the preferred density mode, and display the corresponding selection in the density settings.
- Apply the mode selection at submission via the confirm button.
- In case you already have a settings area in your service, implement the density settings  within that space.

### Don't

- Don't use the density settings pattern for generic service-level settings.

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

#### Modal

- For the header, use this text: *Density settings*
- For the primary action button, use this text: *Confirm*

#### Label

- **Form field label:**  

  - For the tiles group label, use this text: *Content density*
- **Tiles label: **  

  - The tile label describes the density level applicable. For the labels, use this text: *comfortable and compact*

#### Description

- **Form field description: **  

  - For the tiles group description, use this text: *Choose the preferred level of content density for this \[service\].*
  - In case of partial implementation, include additional details.    

    - For example: *The compact experience is available for some features in this service.*

- **Tiles description: **  

  - The tile description provides additional information about the option.
  - For comfortable mode, use this text: *Default spacing that optimizes information consumption.*
  - For compact mode, use this text: *Reduced spacing that provides more visibility over content. *

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Modal

- Follow the accessibility guidelines for [modal](/components/modal/index.html.md)  .

#### Tiles

- Follow the accessibility guidelines for [tiles](/components/tiles/index.html.md)  .

## Related patterns and components

### Content density

Content density is defined by the ratio of information visible compared to the space available in the interface.

[View Documentation](/foundation/visual-foundation/content-density/index.html.md)

### Tiles

Tiles enable users to choose one of a predefined set of options, including additional metadata to facilitate comparisons or progressive disclosure.

[View Documentation](/components/tiles/index.html.md)

### Modal

A user interface element subordinate to an application's main window. It prevents interaction with the main page content, but keeps it visible with the modal as a child window in front of it.

[View Documentation](/components/modal/index.html.md)

### Flashbar

Displays one or more status notifications that communicate critical task operation status, including errors, success, in-progress, and info. Flashbars are exclusively used for status notifications.---

[View Documentation](/components/flashbar/index.html.md)
