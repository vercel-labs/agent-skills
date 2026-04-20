---
scraped_at: '2026-04-20T08:50:03+00:00'
section: components
source_url: https://cloudscape.design/components/tutorial-panel/index.html.md
title: Tutorial panel
---

# Tutorial panel

The tutorial panel houses contextual Hands-on tutorials that help users learn how to use an application.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/tutorial-panel) [View in demo](/examples/react/onboarding.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/tutorial-panel/index.html.json)

## Development guidelines

Place this component in the `tools` slot of your app layout element.

To show a [Help panel](/components/help-panel/index.html.md) in the `tools` slot together with the tutorial panel, place the [Tabs](/components/tabs/index.html.md) component in the tools slot, with the help panel component in the first tab and the tutorial panel in the second tab. Do not use the help panel's `header` slot, instead place the help article's header as an `<h2>` element inside the help panel's `content` slot. Refer to [the official Cloudscape Hands-on tutorials demo](/examples/react/onboarding.html) for comparison

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

TutorialPanelWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCompletionScreenDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findCompletionScreenTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findDownloadLink | [LinkWrapper](/components/link/index.html.md) &#124; null | - | - |
| findFeedbackLink | [LinkWrapper](/components/link/index.html.md) &#124; null | - | - |
| findTaskList | Array<[TutorialTaskWrapper](/index.html.md)> | - | - |
| findTutorials | Array<[TutorialItemWrapper](/index.html.md)> | - | - | TutorialTaskWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findSteps | Array<[ElementWrapper](/index.html.md)> | - | - |
| findStepsTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - | TutorialItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCollapseButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findCompleted | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findExpandButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findLearnMoreLink | [LinkWrapper](/components/link/index.html.md) &#124; null | - | - |
| findPrerequisitesAlert | [AlertWrapper](/components/alert/index.html.md) &#124; null | - | - |
| findStartButton | [ButtonWrapper](/components/button/index.html.md) &#124; null | - | - |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
## Integration testing APIs

TutorialPanelWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCompletionScreenDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findCompletionScreenTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDismissButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findDownloadLink | [LinkWrapper](/components/link/index.html.md) | - | - |
| findFeedbackLink | [LinkWrapper](/components/link/index.html.md) | - | - |
| findTaskList | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TutorialTaskWrapper](/index.html.md)> | - | - |
| findTutorials | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TutorialItemWrapper](/index.html.md)> | - | - | TutorialTaskWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findSteps | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findStepsTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - | TutorialItemWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findCollapseButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findCompleted | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findExpandButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findLearnMoreLink | [LinkWrapper](/components/link/index.html.md) | - | - |
| findPrerequisitesAlert | [AlertWrapper](/components/alert/index.html.md) | - | - |
| findStartButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findTitle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Always implement a tutorial panel with an accompanying help panel. Follow the guidelines for [help system](/patterns/general/help-system/index.html.md)  .
- Display the tutorial panel as open by default whenever a new tutorial is introduced. After a user closes the panel, it should stay closed. Make sure to store your users' preferences.
- When a tutorial is launched, keep the tutorial panel open through all relevant pages as users move through the workflow.
- When first introducing the tutorial panel, add a *-new*   label to the tab header and display it for 30 days. For more information, see [announcing new features](/patterns/general/announcing-new-features/index.html.md)  .

### Don't

- Don't dismiss a tutorial when users close the panel. Only dismiss a tutorial when the Dismiss tutorial button is initiated.
- Don't dismiss a tutorial when users open the help panel. Users should be able to move between the help panel and the tutorials panel when a tutorial is launched.

## Features

### Placement

- #### App layout

  Place the tutorial panel in the `tools`   region of the [app layout](/components/app-layout/index.html.md)  .  

**Collapse button**  

  The *angle-right*   icon button allows users to collapse the panel. Collapsing the panel doesn't dismiss the tutorial.

### States

The content, function, and structure of the tutorial panel differs between the three states mentioned below.

- #### Tutorial list

  This is the first state that users see. It displays a list of all existing tutorials within the application. Users see this state when no tutorial is launched.
- #### Tutorial launched

  In the tutorial launched state, users see a list of tasks and their underlying steps that users must complete in order to complete the tutorial. This state provides a way to dismiss the tutorial and remove hotspot icons from the interface.
- #### Tutorial completed

  After the user completes the tutorial, this state displays a congratulatory message and provides a link to give feedback about the tutorial.

### Controls

- #### Exit tutorial button

  - When the tutorial has been launched or completed, the *Exit tutorial*** ** [button](/components/button/index.html.md)     returns users to the tutorials list state.
  - Choosing the *Exit tutorial*     button dismisses any active tutorial.

### Tutorial list content

In the tutorial list state, all the content is static. Because the tutorial isn't launched, all of the content in this view is provided by the tutorial panel itself and not the [annotation context](/components/annotation-context/index.html.md) . The role of the annotation context is to provide information to the tutorial panels that's specific to a launched tutorial.

- #### Title

  For a tutorial title, use action-oriented text that calls on users to engage with a tutorial.
- #### Description

  Summarize how the tutorial can help users learn an application.
- #### Download button

  Use a Download button to provide a text equivalent for non-interactive tutorials. When the information is laid out in a text format, it reduces the number of interactions needed to retrieve guidance. This makes the content more accessible for users who are using assistive technology and for accommodating for personal preferences.
- #### Expandable tutorial card

  - **Angle up and Angle down icon **     -** **     Expands or collapses a tutorial card.
  - **Card header **     -** **     States the objective of the tutorial.
  - **Card description **     -** **     Gives a brief overview of the tasks needed to complete the learning objective of the tutorial.
  - <a href="/components/link/?example=external-link"> **External link**</a>* - * **optional**    

    - Provide an external link to any external help content or pricing related documentation, if available.
  - <a href="/components/alert/?example=info"> **Prerequisites alert **</a> **-*** * **optional**    

    - An info alert is used to communicate prerequisites for for tutorials that can't be launched until the prerequisites are complete. Not all tutorials have prerequisites.      

      - For example, a prerequisite to start a tutorial about how to visualize analytics for a given resource would have a preexisting resource in the application.

  Provide an external link to documentation related to completing the prerequisite.
- #### Learn more external link

  A learn more [external link](/components/link/index.html.md)   leads users to more information about the particular flow by opening the associated help documentation page in a new tab.
- #### Start tutorial button

  - A tutorial is launched from the *Start tutorial* [button](/components/button/index.html.md)    .
  - If the corresponding tutorial can't be launched yet because of pending prerequisites, show the *Start tutorial*     button in an inactive state, along with an info alert in the tutorial card.

### Tutorial launched content

In the launched state, the tutorial panel consists of static and dynamic content. The tutorial panel determines the structure of the presented information and provides the portions of the strings that are static. The static content is like a template provided by the tutorial panel. Static content is the same across all tutorials.

- For example:* Task 1:, Step 2:. *

The [annotation context](/components/annotation-context/index.html.md) provides the dynamic content to the tutorial panel. Dynamic content changes across tutorials because it's specific to the user's goal. Dynamic content consists of the title of the tutorial, tasks, and steps.

- For example:* Host a static website, Catalog audio archives.*

The tutorial panel renders this text to make it visible to users.

- #### Title

  The title states the main objective that users will achieve by completing the tutorial.
- #### Tasks

  For tasks, do the following:  

  - List out the number of steps needed to complete the task.
  - Show the names and statuses of tasks in a launched tutorial.
- #### Steps

  List out the steps required to complete a task.
- #### Dismiss tutorial button

  The *Dismiss tutorial*   button dismisses the tutorial. It removes the hotspots and annotation popovers from the page and brings users back to the [tutorials list](/components/tutorial-panel/index.html.md)  .

### Tutorial completed content

The [annotation context](/components/annotation-context/index.html.md) injects the title and completed screen description text into the tutorial panel. The tutorial panel then renders this text.

- #### Title

  The title states the main objective that users achieved by completing the tutorial.
- #### Completed page description

  After a tutorial is completed, the description summarizes what the user learned from the tutorial and what objectives the user achieved.
- #### Completion page title

  A congratulatory message communicating the completion of the tutorial.
- #### Feedback link

  The feedback link opens a feedback mechanism so that users can provide insights about the helpfulness of the tutorial after they've completed it.

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

- Follow the guidelines for [annotation context](/components/annotation-context/index.html.md)  .

#### Title

- **Tutorial list title: **  

  - If there are multiple tutorials in the list, use this text: *Choose a tutorial*
  - If there is only one tutorial in the list, use this text: *Start a tutorial*
- **Tutorial launched title:**  

  - Follow the guidelines for [annotation context](/components/annotation-context/index.html.md)    .
- **Tutorial completion page title:**  

  - For the default success message, use this text: *Congratulations\! You completed the tutorial.*
  - You can change the default to whatever fits your use case best.

#### Buttons

- **Tutorial list download button:**  

  - Use this text: *Download PDF version *
- **Tutorial dismiss button:**  

  - Use this text: *Dismiss tutorial*

#### Expandable tutorial card

- **Card title:**  

  - The card title** **     should be consistent with the end objective that the user is trying to achieve.
  - Begin titles with an active verb.    

    - For example:* *      

      - *Host a static website*
      - *Catalog audio archives*
- **Card description:**  

  - Keep the content clear and concise.
  - In a bulleted list, summarize what the user learned from the tutorial.
- **Start tutorial button:**  

  - Use this text: *Start tutorial*

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
