---
scraped_at: '2026-04-20T08:46:34+00:00'
section: components
source_url: https://cloudscape.design/components/annotation-context/index.html.md
title: Annotation context
---

# Annotation context

The annotation context is an invisible layer on top of the interface. It tracks the progress of a launched tutorial and feeds dynamic content to the Tutorial panel in Hands-on tutorials. It also renders annotation popovers and hotspot icons.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/annotation-context) [View in demo](/examples/react/onboarding.html)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/annotation-context/index.html.json)

## Development guidelines

This component is a part of the [Hands-on Tutorials pattern](/patterns/general/onboarding/hands-on-tutorials/index.html.md) , together with the [Hotspot](/components/hotspot/index.html.md) and [Tutorial panel](/components/tutorial-panel/index.html.md) components. The annotation context component provides a React context to all contained [Hotspot](/components/hotspot/index.html.md) and [Tutorial panel](/components/tutorial-panel/index.html.md) elements. For a launched tutorial, it manages the state and interaction between hotspots and the tutorial panel. This component does not render any DOM element (other than its children).

The annotation context component determines which hotspots are used and visible in the launched tutorial, in which order they should be navigated, and which annotation popover is currently open.

If the currently selected hotspot disappears from the page (e.g. because of a page navigation mechanism like react-router), the annotation context will automatically switch to the nearest available hotspot.

### Usage

The annotation context component should be used as a container for the app layout component. The app layout does not have to be a *direct* child of the annotation context.

Use only a single annotation context element in your application, and only a single instance across all pages.

## General guidelines

### Do

- Annotation popovers can only be used in the context of a [hands-on tutorial](/patterns/general/onboarding/hands-on-tutorials/index.html.md)  .

### Don't

- Don't use annotation popovers for help content that relates to explaining general terms or concepts within the interface. Use the [help panel](/components/help-panel/index.html.md)   instead.
- Don't launch a [modal](/components/modal/index.html.md)   from within an annotation popover.

## Features

### Annotation popover

The invisible annotation context component is responsible for rendering the visible step-by-step guidance of [Hands-on tutorials](/patterns/general/onboarding/hands-on-tutorials/index.html.md) . This guidance is given to users in the form of annotation popovers anchored to hotspot icons.

Hotspot icons open and close annotation popovers. Each hotspot icon is rendered by the annotation context. The location of these icons within the interface is determined by a separate component, the [Hotspot](/components/hotspot/index.html.md) , with which the annotation context communicates.

- #### Title

  Communicates the corresponding task that the annotation popover is providing information for. For example: *Task 1: Create a transcription job*
- #### Content

  Provides contextual guidance for decision points in the flow.  

**Info link ** *- * **optional**  

  Use info links in annotation popovers to lead users to the corresponding help panel content. This content provides additional information about the recommended option and other available options. For more information, see [onboarding](/patterns/general/onboarding/index.html.md)  .
- #### Steps

  Shows the current step and the total number of steps in the sequence. For example: *Step 3/4*
- #### Dismiss annotation button

  The dismiss annotation button closes the annotation popover, but it doesn't close the tutorial. When a user selects outside of the annotation popover, the popover remains open to allow users to cross-reference its information when completing actions in the application.
- #### Next and previous buttons

  The** ** *Next*** **   button opens the next annotation popover in the sequence. The *Previous*** **   button opens the previous annotation popover in the sequence. If a step requires users to submit a form or navigate to a new page, the *Next*** **   button is inactive until the users completes those actions. For example, at the end of a create flow.
- #### Size

  The annotation popover always renders in the medium [popover](/components/popover/index.html.md)   variant.

### Dynamic content of the tutorial panel

The tutorial panel consists of dynamic and static content. The static content is provided by the tutorial panel. It's the template that structures the panel's information. Follow the guidelines for [tutorial panel](/components/tutorial-panel/index.html.md).

Dynamic content is provided by the annotation context. Dynamic content fills the static template to provide guidance specific to a particular tutorial. Dynamic content is different across tutorials and consists of the title of the tutorial, tasks, and steps. The tutorial panel renders this text to make it visible to users.

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

#### Annotation popover title

- State the name of the active task.
- Use the format: *Task \[number\]: \[Name of task\]*  

  - For example: *Task 1: Create a bucket*

#### Annotation popover content

- Keep text concise to minimize cognitive load.
- Recommend a specific configuration and provide a brief reason for the recommendation.
- Display key phrases or direct recommendations in bold to improve the scanability of the content.  

  - For example: *Choose the * **Standard-IA ** *storage class for rapid access to infrequently retrieved data.*
- Provide a choice criteria when a specific configuration can't be recommended.  

  - For example: *Choose the Region closest to your geographic location to reduce latency.*
- For steps that take place across applications, provide high-level directions for navigating to and back from the external application.  

  - For example:    

    - To create a bucket:      

      - *Go to * *Amazon S3** \[external link icon\]*
      - *Create a bucket resource*
      - *Return to this page. \[Info link\]*

#### Next and previous buttons

- For the last step of the last task, instead of using *Next*   for the button label, use this text: *Finish*

#### Tutorial panel

- Follow the guidelines for [tutorial panel](/components/tutorial-panel/index.html.md)  .

#### Tutorial panel title

- The title of the tutorial panel should be consistent with the end objective that the user is trying to achieve.
- Begin titles with an active verb.  

  - For example:* *    

    - *Host a static website*
    - *Catalog audio archives*

#### Tutorial panel tasks

- Begin task titles with an active verb.
- Use the format: *Task \[task number\]: \[Task title\]*  

  - For example:* *    

    - *Task 1: Create a bucket*
    - *Task 3: Transcribe audio*
- The tutorial panel component provides the `task [task number]`   portion of the string.

#### Tutorial panel steps

- Begin step titles with an active verb.
- Use the format: *Step \[step number\]: \[Step title\]*  

  - For example:    

    - *Step 4: Select a Region*
    - *Step 2: Name your instance*
- The tutorial panel component provides the `step [step number]`   portion of the string.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.






## Task 1: Create a bucket

Create a bucket name. Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-). <a href=""> Info :</a> Step 1/3 Next

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
