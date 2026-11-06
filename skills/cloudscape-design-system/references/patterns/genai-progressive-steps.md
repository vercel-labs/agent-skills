---
scraped_at: '2026-04-20T08:51:42+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/genai/progressive-steps/index.html.md
title: Progressive steps
---

# Progressive steps

A hierarchical display of information to inform users of the tasks being performed.

## Building blocks

A B C D E E F
#### A. Header - optional

When displaying a list of steps, the header should succinctly describe the main task or workflow. In a chat interface, a header may not be necessary as the context is established through the conversation.

#### B. Main steps

Display status related to individual tasks or actions being performed as steps using the [steps](/components/steps/index.html.md) component.

#### C. Sub-steps - optional

If the main step has sub-steps, display them in a [tree view](/components/tree-view/index.html.md) leveraging the [status indicators](/components/status-indicator/index.html.md) component.

#### D. Status hub - optional

If there is more than one status within sub-steps, display a status hub to the right of the step. The status hub uses the [status indicator](/components/status-indicator/index.html.md) component.

#### E. Step details - optional

Step details can be indicated via popover or description text. Use a [popover](/components/popover/index.html.md) to provide supplemental information about the step. Use description text to display details that are necessary for the user's context. For example, estimated completion time for a step, or additional details about a step status.

#### F. Input request - optional

When gathering additional information from users to generate an output, display the [input requests in a dialog](https://github.com/cloudscape-design/demos/blob/main/src/pages/chat/additional-info/dialog.tsx) with form fields. To avoid blocking the user, include the ability for them to skip the input if desired. However, if the input is required, exclude the skip button, and add form field error text if a user attempts to bypass the form.

## Key UX concepts

### Provide transparency

Provide clear and informative [status indicator](/components/status-indicator/index.html.md) updates throughout the process to maintain user transparency and trust. This helps users understand what the system is doing and builds confidence in the generative AI capabilities.

### Adapt to latency

Adjust the visual indicators and level of detail based on the expected latency, as mentioned in the [feedback mechansims](/patterns/general/user-feedback/index.html.md) pattern. This allows the progressive loading of steps to appropriately respond to varying response times and frames expectations for long load times.

- For under 10 seconds, provide additional details if possible, such as a list of sub-steps.
- For above 10 seconds, show a time estimate for indeterminate wait times, and a [progress bar](/components/progress-bar/index.html.md)   for determinate wait times.

### Enhance trust and confidence

Clear and contextual error or warning messages help users understand any issues that arise during the process, and enable them to take follow-up actions. This transparency helps build trust in the generative AI system's capabilities.

### Balance transparency and cognitive load

Status updates and loading indicators should be kept concise and unobtrusive. Provide users the ability to view more details about steps within the process through the use of popovers, links, or expandable sections. This allows users to control the level of information they receive.

### Request input

There are times when additional information is needed from the user to complete a task or provide a relevant response. In these cases, present clear input requests to gather the necessary details.

## Common use cases

### Latency periods

Generative AI can vary in response times. The progressive steps experience should adjust the loading states and indicators based on the expected latency, providing different visual cues for loading experiences above and below 10 seconds.

#### Under 10 seconds

**Default: ** Display a loading status on the last [step](/components/steps/index.html.md) . Avoid displaying a loading state for under one second as this can seem jarring to users and can cause flickering in the UI.

### Personalized recommendation

 <a href=""> Info :</a>
1. Evaluated
2. Checked 5 nodes
3. Checking EKS clusters

**Sub-steps: ** Display sub-steps with corresponding status to inform users of the overall progress when applicable. For example, display a list of nodes being checked when troubleshooting an EKS issue.

### Personalized recommendation

 <a href=""> Info :</a>
- Evaluated
- Checking node 3 of 3   |   1   2
  - node-17 (eksclu-node-12345)
  - node-18 (eksclu-node-09876)
  - node-19 (eksclu-node-ab123)

#### Above 10 seconds

**Indeterminate loading state: ** Display the current step in a loading state along with an estimated wait time. This helps communicate the anticipated timeline and set appropriate user expectations.

### Personalized recommendation

 <a href=""> Info :</a>
1. Evaluated
2. Checked 5 nodes
3. Checking EKS clusters   This step may take up to 15 seconds to complete.

**Determinate loading state: ** If a wait time is determinate, display a [progress bar](/components/progress-bar/index.html.md) with the time remaining as suggested in [feedback mechanisms](/patterns/general/user-feedback/index.html.md) . This helps keep users informed about the processes unfolding over a longer period of time and builds trust.

### Personalized recommendation

 <a href=""> Info :</a>
1. Evaluated
2. Checked 5 nodes
3. Checking EKS clusters   36%   36%   Less than 20 seconds remaining

### Error

A B C
#### A. Step error

When a step has an error, provide clear and concise error details along with the failed status. Offer a retry option whenever it's appropriate for the user to attempt the action again.

#### B. Sub-step error

If there is more than 1 error status within sub-steps, such as an error and warning, display the status hub to the right of the main step.

#### C. Error details

When an error or warning message has lots of details corresponding to it, provide them in a [popover](/components/popover/index.html.md) . This will help prevent overwhelming users with information displayed at once.

### Output

When presenting the final output to the user, include an [expandable section](/components/expandable-section/index.html.md) detailing the steps taken to generate the output. This should be collapsed by default.

### Personalized recommendation

 <a href=""> Info :</a> Investigation complete [4/4]
1. Evaluated
2. Checked 5 nodes
3. Checked EKS clusters
4. Summarized output

## General guidelines

### Do

- **Enable access to details **  
  Enable users to view more details about each step of the process through popovers, links, sub-steps, or expandable sections. This gives users the ability to dig deeper into the troubleshooting details.
- **Limit input requests **  
  Limit the number of input requests to 3, if possible. This helps avoid overwhelming the user and maintains a streamlined troubleshooting experience.
- **Change the status to pending when a sub-step is loading**  
  When a sub-step is loading, change the status of the main step to *pending*   to indicate that the step is in progress, and move the *loading*   status to the sub-step rather than leaving it on the main step.
- **Prioritize the most urgent status**  
  The status of the main step corresponds to the most critical status in the sub-step. For example, If there is an error, warning, and success status in the sub-steps, the main step will have an error status.

### Don't

- **Avoid displaying a loading state for under one second**  
  Displaying a loading state for under one second can seem jarring to users and can cause flickering in the UI. For example, If the model supports streaming and has a rapid processing stage, don't display the loading text in chat bubble, instead start streaming the response directly.
- **Don't have more than 4 levels of sub-steps**  
  Keeping the number of sub-steps limited to 4 levels or less helps maintain a manageable view for the user.

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

#### Error

- **Step error:**   When a step has an error, provide clear and concise error details along with the failed status. Offer a retry option whenever it's appropriate for the user to attempt the action again.
- **Sub-step error:**   If there is more than 1 status within a sub-steps, such as an error and warning, display the status hub to the right of the main step.
- **Error details:**   When an error or warning message has lots of details corresponding to it, provide them in a [popover](/components/popover/index.html.md)   . This will help overwhelming users with information displayed at once.

#### Loading text

Follow the writing guidelines for [loading and refreshing](/patterns/general/loading-and-refreshing/index.html.md) pattern.

#### Status indicator

Follow guidelines for [status indicator](/components/status-indicator/index.html.md) component.

## Related patterns and components

### Status indicator

A status indicator communicates the state of a resource-either in its entirety or a particular facet of a resource-in a compact form that is easily embedded in a card, table, list, or header view.

[View Documentation](/components/status-indicator/index.html.md)

### Expandable section

With expandable selection, users can expand or collapse a section.

[View Documentation](/components/expandable-section/index.html.md)

### Steps

Display a list of tasks.---




36%

[View Documentation](/components/steps/index.html.md)
