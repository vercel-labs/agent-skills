---
scraped_at: '2026-04-20T08:52:01+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/announcing-beta-preview-features/index.html.md
title: Announcing beta and preview features
---

# Announcing beta and preview features

Communicate to users which features are in beta or preview.

 [View demo](/examples/react/dashboard.html)
## Key UX concepts

### Informing users about beta or preview features

To help ensure users know whether a feature is in beta or preview, clearly communicate the feature's release state in the user's workflow. Do this even if if the feature's state is communicated through other communication channels.

### Communicating the impact of the beta or preview state

Certain beta or preview features can affect users' workflows. For example, they can introduce functionality changes or be unsuitable for production workloads. Providing contextual information about these features helps users decide how they will use them. To reduce cognitive load on the user, keep your explanation concise. If there's additional information that would be helpful, provide a [Learn more link](/components/link/index.html.md).

### Minimizing visual noise

Be mindful of what will attract the most attention on the screen. Loud visual indicators such as [badges](/components/badge/index.html.md) or [flashbars](/components/flashbar/index.html.md) can distract users from their main tasks. Because of this, we don't recommend using badges to communicate information about beta or preview features. We do recommend using flashbars to alert the user when the entire product service is in beta or preview.

## Beta and preview releases

Betas releases aren't publicly announced. Teams use them to gather customer feedback before a general availability (GA) launch. Previews are expected to be publicly announced. Both beta and preview releases might not be immediately ready for all customers or might be missing key features.

## Types of beta and preview announcements

### Entire service in beta/preview

Use a [flashbar](/components/flashbar/index.html.md) to communicate that an entire service has launched in beta or preview state. The flash message should communicate the impact of the the beta or preview state for the service and provide links to learn more and to give feedback for the product service. Use a flashbar only when the entire service is in beta or preview.

On the service homepage, the flashbar should be persistent, without a way to dismiss it, so the beta or preview state remains in view for the user. On every other page, users should be able to dismiss the flashbar.

- CloudFront is currently in preview   Changes may be made to this service. We don't recommend using it for production workloads. Find out more about this preview [here](about:blank/index.html.md)   , or send feedback [here](about:blank/index.html.md)  .

### Page or section in beta/preview

Page level releases refer to features in a beta or preview state that are introduced as a new page or a new section within a service. For example, adding a dashboard in preview or a table view in beta.

#### Using labels in the side navigation

Use *Beta * or *Preview* labels in the side navigation to mark pages appropriately. Marking features as beta or preview within the side navigation helps to set users' expectations about these pages.

Include a [popover](/components/popover/index.html.md) communicating what users can expect from the page. For example, the popover content area can say: *We're improving the way to use \[feature name\]* . Add an external [Learn more link](/components/link/index.html.md) , guiding users to relevant service documentation about the feature, if available.

## Side navigation

## Service name

- [Page 1](about:blank/index.html.md)   Beta
- [Page 2](about:blank/index.html.md)
- [Page 3](about:blank/index.html.md)
- [Page 4](about:blank/index.html.md)

- [Notifications](about:blank/index.html.md)   23
- [Documentation](https://example.com/)

To implement the Beta or Preview labels in the side navigation, use the snippet below in the `info` slot of the SideNavigation component:

```
<Box color="text-status-info" display="inline">
  <Popover
    header="[Release type] feature"
    size="medium"
    triggerType="text"
    content={
      <>
        Add description about the feature state.{' '}
        <Link external>Learn more</Link>
      </>
    }
    renderWithPortal={true} 
  >
    <Box color="text-status-info" fontSize="body-s" fontWeight="bold">
      Beta
    </Box>
  </Popover>
</Box>
```

#### Using labels in page titles

In addition to the side navigation, append a *- beta* or *- preview* label to the page title. Because users might access the page through a direct link, and not only through the side navigation, this reinforces the page's release type.

Include an info link and [help panel](/components/help-panel/index.html.md) to provide more information about the beta or preview, such as a description of what it entails, how it impacts users' workflows, and how to provide feedback. If you can't implement a content ramp with the help panel, you can use [Learn more links](/components/link/index.html.md) as a fallback. Place the links after beta or preview descriptions.

Don't add additional popovers on the page for page-level beta and previews.

### In-page features in beta or preview

For in-page features in beta or preview, add a beta or preview element to the existing page, or add functionality to a page element. For example, adding a beta setting in a creation flow.

To minimize distractions, the indicators announcing that the feature is in beta or preview should be subtle. Indicate that an element is in a given release type by adding *- beta* or *- preview* on labels, headings, or group items (such as an individual radio button in a radio group).

Leverage external channels, such as documentation, to bring attention to a hidden feature. For example, a beta option within a select component that might not be seen at first glance.

## General guidelines

### Do

- Make sure to communicate the impact of a beta or preview in users' workflows.
- Mark pages as beta or preview within the side navigation to help set users' expectations about these pages before they open them.
- Plan your release so users will know when the feature is going into GA. This way users can stay engaged with the beta or preview, and also plan on using the feature in production workflows.
- Use *Beta *   or *Preview *   labels in the side navigation only for pages that are entirely in a beta or preview release state.
- Always combine *Beta *   or *Preview *   labels in the side navigation with a popover so that users can get more details about the features in those states.

### Don't

- Don't rely only on external channels, such as documentation or email, to communicate that a feature is in beta or preview.
- Don't use the [New](/patterns/general/announcing-new-features/index.html.md)   label together with *Beta *   or P *review*
- Don't use badges for labeling features as beta or preview.
- Don't use flashbars for releases that aren't service-wide.

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

### Component-specific guidelines

#### Popover

- Follow the accessibility guidelines for [popover](/components/popover/index.html.md)  .

#### Flashbar

- Follow the accessibility guidelines for [flashbar](/components/flashbar/index.html.md)  .

## Related patterns and components

### Announcing new features

Communicate new feature releases to users.

[View Documentation](/patterns/general/announcing-new-features/index.html.md)

### Flashbar

Displays one or more status notifications that communicate critical task operation status, including errors, success, in-progress, and info. Flashbars are exclusively used for status notifications.

[View Documentation](/components/flashbar/index.html.md)

### Popover

Provides on-demand contextual information about elements or events.---

[View Documentation](/components/popover/index.html.md)
