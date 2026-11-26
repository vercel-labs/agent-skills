---
scraped_at: '2026-04-20T08:53:22+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/resource-management/delete/delete-with-additional-confirmation/index.html.md
title: Delete with additional confirmation
---

# Delete with additional confirmation

The delete with additional confirmation pattern helps prevent users from performing accidental, high-severity deletions by adding friction during the deletion process.

 [View demo](/examples/react/delete-with-additional-confirmation.html)
## Building blocks

Delete with additional confirmation can be used for single-resource deletion or multi-resource deletion.

## Single resource deletion

Use delete with additional confirmation for single-resource deletion if the resource cannot be recreated, or if deleting the resource poses a risk of breaking other infrastructure or causing an outage.

A B C D E A B C D E
#### A. Modal title

Use Delete together with the resource type. For example: *Delete instance*

#### B. Reassurance

Make sure the user understands everything that is being deleted, and that the action is irreversible. Use important details associated with the resource being deleted, such as the resource name or other unique identifiers. Use [bold font weight](/foundation/visual-foundation/typography/index.html.md) to expose the resource identifier. For example: *Permanently delete instance * *CMRVMLFVHDVHU0* *? You can't undo this action.*

#### C. Consequences

State the possible consequences of the action like severity, outcome, and potential cascading effects of the action. This helps the user be aware of the actual impact and scope of the destructive action. Use the [warning alert](/components/alert/index.html.md) format to present this information. If possible, add an [external link](/components/link/index.html.md) to detailed documentation for users to consult.

#### D. Confirmation text input field

Provide an additional layer of confirmation for users to validate the deletion. By default, the user should enter word confirm (with no case sensitivity).

#### E. Buttons

Allow users to execute the resource deletion or to exit the delete flow.

### Additional prerequisites - optional

F G H
#### F. Prerequisite actions

Give users clear guidance on prerequisites and recommend best practices. For example, prompting users to disable the resource prior to deletion or create a snapshot to help recover from a deletion in the future. Any [links](/components/link/index.html.md) leading to additional information on the prerequisites, or to prerequisite actions outside of the modal, should open in a new tab. Use the [Box](/components/box/index.html.md) component with the `variant` property set to `"small"` to show the approximate deletion time if the deletion is not instantaneous.

#### G. Confirmation text input field

If there is a single action that needs to be completed prior to deletion, disable the [input field](/components/input/index.html.md) to focus the user's attention on that prerequisite task.

#### H. Buttons

If there is a single action that needs to be completed prior to deletion, disable the [primary button](/components/button/index.html.md) in order to focus the user's attention on that prerequisite task.

## Multi-resource deletion

Use the delete with additional confirmation pattern if the resources cannot be recreated, or if deleting the resources poses a risk of breaking other infrastructure or causing an outage.

A B C D E A B C D E
#### A. Modal title

Use Delete together with the resource type. For example: *Delete instances*

#### B. Reassurance

Make sure the user understands everything that is being deleted, and that the action is irreversible. Show the number of resources that were chosen to be deleted. Use [bold font weight](/foundation/visual-foundation/typography/index.html.md) to expose number and resource type. For example:* Permanently delete * *7** * *distributions? * *You can't undo this action.*

#### C. Consequences

State the possible consequences of the action like severity, outcome, and potential cascading effects of the action. This helps the user be aware of the actual impact and scope of the destructive action. Use [warning alert](/components/alert/index.html.md) format to present this information. If possible, add an [external link](/components/link/index.html.md) to detailed documentation for users to consult.

#### D. Confirmation text input field

Provide an additional layer of confirmation for users to validate the deletion. By default, the user should enter word confirm (with no case sensitivity).

#### E. Buttons

Allow users to execute the resource deletion or to exit the delete flow.

### Additional prerequisites - optional

F G H
#### F. Prerequisite actions

Give users clear guidance on prerequisites and recommend best practices. For example, prompting users to disable the resource prior to deletion or create a snapshot to help recover from a deletion in the future. Any [links](/components/link/index.html.md) leading to additional information on the prerequisites, or to prerequisite actions outside of the modal, should open in a new tab. Use the [Box](/components/box/index.html.md) component with the `variant` property set to `"small"` to show the approximate deletion time if the deletion is not instantaneous.

#### G. Confirmation text input field

If there is a single action that needs to be completed prior to deletion, disable the [input field](/components/input/index.html.md) to focus the user's attention on that prerequisite task.

#### H. Buttons

If there is a single action that needs to be completed prior to deletion, disable the [primary button](/components/button/index.html.md) in order to focus the user's attention on that prerequisite task.

## General guidelines

### Do

- Inform users about the severity and consequences of the delete action.
- Give users additional contextual information about the resource being deleted, to adequately inform the deletion.
- Use delete with additional confirmation only for high severity deletions, such as those that could break running infrastructure, or create an outage. Adding friction to low severity deletions can slow users down and create frustration. For lower priority deletions, use [delete with simple confirmation](/patterns/resource-management/delete/delete-with-simple-confirmation/index.html.md)   instead.

### Don't

- Don't use other patterns (such as popovers or a new page) to add confirmation to a delete action. Always use a [modal](/components/modal/index.html.md)  .

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

- Use the format: *\[Delete\] \[resource type\] *  

  - For example:    

    - For a single resource: *Delete instance*
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

### Delete with simple confirmation

Provide a layer of confirmation before deleting resources that cannot be easily recreated.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/delete-with-simple-confirmation)

[View Documentation](/patterns/resource-management/delete/delete-with-simple-confirmation/index.html.md)

### One-click delete

With the one-click delete pattern, users can quickly delete low-risk, non-critical resources.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/delete-one-click)

[View Documentation](/patterns/resource-management/delete/one-click-delete/index.html.md)

### Modal

A user interface element subordinate to an application's main window. It prevents interaction with the main page content, but keeps it visible with the modal as a child window in front of it.---

[View Documentation](/components/modal/index.html.md)
