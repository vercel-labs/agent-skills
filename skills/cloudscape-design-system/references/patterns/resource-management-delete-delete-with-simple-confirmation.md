---
scraped_at: '2026-04-20T08:53:24+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/delete/delete-with-simple-confirmation/index.html.md
title: Delete with simple confirmation
---

# Delete with simple confirmation

Provide a layer of confirmation before deleting resources that cannot be easily recreated.

 [View demo](/examples/react/delete-with-simple-confirmation.html)
## Building blocks

Delete with simple confirmation can be used for single-resource deletion or multi-resource deletion.

## Single resource deletion

A B C D A B C D
#### A. Modal title

Use Delete together with the resource type. For example: *Delete instance*

#### B. Reassurance

Make sure the user understands everything that is being deleted, and that the action is irreversible. Use important details associated with the resource being deleted, such as the resource name or other unique identifiers. Use [bold font weight](/foundation/visual-foundation/typography/index.html.md) to expose resource identifier. For example: *Permanently delete distribution * *CMRVMLFVHDVHU0* *? You can't undo this action.*

#### C. Consequences

State the possible consequences of the action like severity, outcome, and potential cascading effects of the action. This helps the user be aware of the actual impact and scope of the destructive action. Use the [info alert](/components/alert/index.html.md) format to present this information. If possible, add an [external link](/components/link/index.html.md) to detailed documentation for users to consult.

#### D. Buttons

Allow users to execute the resource deletion or to exit the delete flow.

## Multi-resource deletion

A B C D A B C D
#### A. Modal title

Use Delete together with the resource type. For example: *Delete instances*

#### B. Reassurance

Make sure the user understands everything that is being deleted, and that the action is irreversible. Show the number of resources that were chosen to be deleted. Use [bold font weight](/foundation/visual-foundation/typography/index.html.md) to expose the number and resource type. For example: *Permanently delete * *7** * *distributions* *? You can't undo this action.*

#### C. Consequences

State the possible consequences of the action like severity, outcome, and potential cascading effects of the action. This helps the user be aware of the actual impact and scope of the destructive action. Use the [info alert](/components/alert/index.html.md) format to present this information. If possible, add an [external link](/components/link/index.html.md) to detailed documentation for users to consult.

#### D. Buttons

Allow users to execute the resource deletion or to exit the delete flow.

## General guidelines

### Do

- Use the delete with simple confirmation pattern for running resources whose deletion will not affect other infrastructure. For example: A user deleting a CloudWatch alarm.
- Inform users about the severity and consequences of the delete action.
- Give users additional contextual information about the resource being deleted, to adequately inform them about the deletion.

### Don't

- Don't use the delete with simple confirmation pattern if deleting the resource poses a risk of breaking other infrastructure, or causing an outage. Use [delete with additional confirmation](/patterns/resource-management/delete/delete-with-additional-confirmation/index.html.md)   instead.

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

- Use sentence case. All words are lowercase except the first word in the phrase, proper nouns, acronyms, and service and feature names. Avoid capitalizing feature names unless absolutely necessary, such as an AWS-specific term or concept.
- Use second person (you, your) when you address the user.
- Localize the text on the user interface, including the confirmation text.  

  - For example: If the interface is in French, all text including the confirmation text to be entered, should be written in French.
- Use terminal punctuation for all modal text, except for any text in a list format.

#### Modal title

- Use the format: *Delete \[resource type\]*  

  - For example:    

    - For single resource: *Delete instance*
    - For multiple resources: *Delete instances*

#### Button text

- For the button that performs the action, use this text: *Delete*   . If your deletion action is called something different, such as *Terminate*   , then use the same verb in the modal title and button.
- For the button to dismiss the dialog box without completing the action, use this text: *Cancel*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Related patterns and components

### Delete patterns

With delete patterns, users can delete existing resources.

[View Documentation](/patterns/resource-management/delete/index.html.md)

### Delete with additional confirmation

The delete with additional confirmation pattern helps prevent users from performing accidental, high-severity deletions by adding friction during the deletion process.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/delete-with-additional-confirmation)

[View Documentation](/patterns/resource-management/delete/delete-with-additional-confirmation/index.html.md)

### One-click delete

With the one-click delete pattern, users can quickly delete low-risk, non-critical resources.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/delete-one-click)

[View Documentation](/patterns/resource-management/delete/one-click-delete/index.html.md)

### Modal

A user interface element subordinate to an application's main window. It prevents interaction with the main page content, but keeps it visible with the modal as a child window in front of it.---

[View Documentation](/components/modal/index.html.md)
