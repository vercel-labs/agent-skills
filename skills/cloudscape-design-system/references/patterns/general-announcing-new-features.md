---
scraped_at: '2026-04-20T08:52:03+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/announcing-new-features/index.html.md
title: Announcing new features
---

# Announcing new features

Communicate new feature releases to users.

 [View demo](/examples/react/dashboard.html?awsui-density=comfortable)
## Key UX concepts

### Keep in-product communication focused and concise

Users typically learn about feature releases outside of a product. Generally, users come to a product to complete a specific task, rather than to learn, explore, or find out about changes to the service. Thus, the role of new feature announcements is to help users orient themselves and become aware of any changes that can affect their workflows. To reduce cognitive load, keep concise any text that explains the feature and its benefits. Provide a [Learn more link](/components/link/index.html.md) to where the feature is documented so that users can decide when to read more about it.

### Give users control over surfacing information

Users are likely to immediately dismiss communication that covers or adds clutter to the interface, especially when the communication is not directly related to their workflow. Communication that appears without user action slows users down, adding friction and building frustration. This amplifies when communication is unrelated to the current task and forces users' attention away from it.

Unless you're communicating a service-wide feature release, ensure that user action invokes the communication, as opposed to the communication loading automatically when users launch the service.

### Minimize visual noise

Be mindful of what will grab most of users' attention on the screen. Loud visual indicators such as [badges](/components/badge/index.html.md) or [flashbars](/components/flashbar/index.html.md) can distract users from their main tasks. Because of this, we don't recommend them for communicating new features. We do recommend using flashbars to alert the user to large, service-wide announcements.

## Types of feature announcements

### Service-wide feature releases

Service-wide features affect all pages in the service. Only service-wide feature releases should use a [flashbar](/components/flashbar/index.html.md) as a feedback mechanism.

- Introducing the new CloudFront console experience   We've redesigned the CloudFront console to make it easier to use. Continue to use the new console and [let us know what you think](about:blank/index.html.md)   . Or you can [use the old console](about:blank/index.html.md)  .

### Page-level feature releases

Page-level feature releases refer to features that are introduced as a new page or a new section within a service. For example, adding a new dashboard page or a new sub-service within a service.

To mark new pages, use *New* labels in the side navigation. Because users typically see the side navigation as the site map of the service product, these labels give a first glance overview of new pages that have been introduced.

Include a [popover](/components/popover/index.html.md) , invoked by user action, that provides a summary of the functionalities introduced by the new page. Add an external [Learn more link](/components/link/index.html.md) , guiding users to relevant service documentation about the new feature.

If you're using a *New* label, change the behavior of collapsible sections. Open any section that is usually collapsed if one or more pages in that section use the *New * label. This improves discoverability.

## Side navigation

## Service name

- [Page 1](about:blank/index.html.md)   New
- [Page 2](about:blank/index.html.md)
- [Page 3](about:blank/index.html.md)
- [Page 4](about:blank/index.html.md)

- [Notifications](about:blank/index.html.md)   23
- [Documentation](https://example.com/)

To implement the *New* labels in the side navigation, use the snippet below in the `info` slot of the SideNavigation component:

```
<Box color="text-status-info" display="inline">
  <Popover
    header="Introducing [feature name]"
    size="medium"
    triggerType="text"
    content={
      <>
        Add feature description.{' '}
        <Link external>Learn more</Link>
      </>
    }
    renderWithPortal={true} 
  >
    <Box color="text-status-info" fontSize="body-s" fontWeight="bold">
      New
    </Box>
  </Popover>
</Box>
```

### In-page feature releases

For in-page feature releases, add a new element to an existing page, or a new functionality to a page element. For example, adding a new widget on the dashboard.

Because users see these features when going through a specific workflow, the indicators announcing them should be subtle to minimize distractions. Indicate that a form element is new by adding *-new* on labels, headings, or group items (such as an individual radio button in a radio group).

Use in-page help content to explain or describe the feature. If a content ramp with the [help panel](/components/help-panel/index.html.md) can't be implemented, standalone learn more links may be used as a fallback. These links should be placed after descriptions. Don't add popovers for in-page feature announcements, as they can create double click targets or conflict with info links.

Some new features, such as a new option within a select component, might not be noticeable at first glance. To bring attention to these hidden features, leverage external channels, such as a blog or a feature spotlight, to announce the release.

## Distribution content delivery

Bucket Region - *new*
## Service overview - new

 <a href=""> Info :</a> Running instances [14](about:blank/index.html.md) Volumes [126](about:blank/index.html.md) Security groups [116](about:blank/index.html.md) Load balancers [28](about:blank/index.html.md)
## General guidelines

### Do

- *New *   labels should persist for 30 days.
- To communicate interactivity and not conflate with status related information, use the same blue that's used for links for *New *   labels in the side navigation (as opposed to green or another color).
- Use *New*   labels in the side navigation only for pages that are entirely new. Don't use it to communicate a new addition to an existing page.
- Always combine *New*   labels in the side navigation with a popover.

### Don't

- Don't add *New*   labels for changes of low importance, such as small bug fixes or minor UI improvements. Keep the visual noise to a minimum to decrease the cognitive load.
- Don't launch popovers when the page loads. Popovers should always be initiated by user action.
- Don't use badges for labeling features as new.
- Avoid using flashbars for releases that are not service-wide.
- Don't create a series of popovers that move from one new feature to the next. This can be unexpected and disorienting for users.
- Don't add *New*   labels to section headers in the side navigation, because this can create double-click targets. Instead, add *New*   labels to every new page introduced in the new expandable section.

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

## Related patterns and components

### Announcing beta and preview features

Communicate to users which features are in beta or preview.

[View Documentation](/patterns/general/announcing-beta-preview-features/index.html.md)

### Flashbar

Displays one or more status notifications that communicate critical task operation status, including errors, success, in-progress, and info. Flashbars are exclusively used for status notifications.

[View Documentation](/components/flashbar/index.html.md)

### Popover

Provides on-demand contextual information about elements or events.---

[View Documentation](/components/popover/index.html.md)
