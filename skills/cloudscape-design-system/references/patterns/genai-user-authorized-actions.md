---
scraped_at: '2026-04-20T08:51:50+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/genai/user-authorized-actions/index.html.md
title: User authorized actions
---

# User authorized actions

Best practices for building experiences where generative AI needs user authorization before performing actions.

## Key UX concepts

### Mutating actions

Mutating actions are operations performed by generative AI that change the state of the users environment. For example, creating, editing, or deleting resources. While some mutating actions can be executed autonomously by generative AI, others require user authorization, especially when changes could be critical or having lasting consequences. The need for authorization depends on the type and potential impact of the change. For example, formatting text with a pre-authorized writing assistant might not require active user authorization, while deleting resources would.

### Authorization levels

Different kinds of actions require different levels of user authorization based on their potential impact and risk.

- **Simple authorization:**   For low-risk changes like adding tags.
- **Additional authorization:**   For actions with serious or irreversible consequences like deleting resources.

### Human in the loop

The *human* refers to the user interacting with the generative AI system. Keeping the human in the loop means users verify what the model is doing and approve its actions. Here's how users stay in the loop:

- **Initiate an action**   : The user asks AI to make an action on their behalf. AI confirms the action the user is requesting with a brief explanation of the action. The user then initiates the action with a button.
- **Execute an action**   : Select the authorization method that matches the risk level. Use simple authorization for low-risk changes. Require additional confirmation for serious or irreversible changes. Before execution, AI presents proposed changes and potential effects to the user. The user reviews the potential impact while the system clearly shows if changes are reversible or permanent. Show clear status indicators during the process and allow users to monitor progress.
- **Complete an action**   : Confirm changes were completed and provide detailed feedback on what changed. Record actions in audit trail when needed and show how to reverse changes if possible.

### Action permanence

Before authorization, clearly communicate whether changes can be reversed, what happens if something goes wrong, and any long-term impacts of the change. Reversible actions like adding tags can proceed with simple authorization. Permanent actions like deleting resources require additional confirmation since they can't be undone.

### Transparent execution and feedback

Clear communication maintains user trust throughout the authorization process. For successful changes, confirm completion, list all modifications made, outline any next steps, and show how to reverse changes when possible. When failures occur, explain what went wrong and why it happened, then provide specific steps to resolve the issue and offer alternative solutions.

## Building blocks

A B C D E F
#### A. Steps

Display status updates for each task during the authorization process. Use the [steps](/components/steps/index.html.md) as suggested in the [progressive steps pattern](/patterns/genai/progressive-steps/index.html.md).

#### B. Authorization dialog

When collecting authorization from a user, display the content in a [dialog box](https://github.com/cloudscape-design/demos/blob/main/src/pages/chat/additional-info/dialog.tsx).

#### C. Description and impact

Include a clear description of the proposed change, its potential consequences, a list of affected resources, and action buttons. Clearly explain what the AI will do and its potential positive and negative consequences. Use simple language that helps users make informed decisions.

#### D. Action details

Identify specific resources that will be affected. Include unique identifiers such as service names, ARNs, or instance IDs. Link directly to the resources when possible.

#### E. Additional confirmation

For actions with serious, irreversible, or cascading consequences, collect additional confirmation from the user.

#### F. Buttons

Provide clear options for users to either proceed with the action or decline AI assistance and exit the flow. Button labels should match the intended action. For example, use *Delete* for deleting an S3 bucket.

## Common use cases

## Initiating an action

When a user prompts generative AI to perform an action, the AI processes the prompt and responds with an acknowledgement and an explicit action button to initiate the action.

### Generative AI assistant

JD I want to delete 'aws_us_west2-678d13-pipe' S3 bucket I'll help you delete the specified S3 bucket. S3 buckets must be empty before deletion, so I'll first delete the objects in the bucket if any, and then delete the bucket itself. Do you want me to proceed with deletion? Delete bucket
## Executing an action

When AI needs user authorization to proceed with executing an action, you can select two levels of authorization based on the potential impact and risk to the user's environment.

## Simple authorization

Use when changes are low-risk and won't affect critical infrastructure. For example, when AI adds tags to resources.

### Generative AI assistant

1. Analyzed Billing application
2. Checked EC2 instances
3. Authorization required from user to add cost allocation tags

#### Add cost allocation tags

I notice your EC2 instance i-1234abcd doesn't have proper cost allocation tags. Adding these tags would make it easier to track Atlas project costs. This can be easily reversed.

EC2 instance: i-1234abcd

Project: Atlas

Environment: Development

Action: Add cost allocation tags

Would you like me to add the tags?

Add tags Cancel
## Additional authorization

Use when a mutating action could have serious, irreversible, or cascading consequences. For example, generative AI deleting an S3 bucket. This requires the user to provide additional confirmation because this mutating action could have serious consequences like loss of critical data.

### Generative AI assistant

JD I want to delete 'aws_us_west2-678d13-pipe' S3 bucket I'll help you delete the specified S3 bucket. S3 buckets must be empty before deletion, so I'll first delete the objects in the bucket if any and then delete the bucket itself.
- Inspected S3 buckets
- Analyzed specific bucket
- Deleting bucket contents
  - Authorization required from user to delete objects in bucket

#### Your authorization is needed to delete objects in the S3 bucket

To avoid unexpected results, review the details below and provide additional written consent. This action is permanent and cannot be undone.

Bucket: [aws_us_west2-678d13-pipe](about:blank/index.html.md)

Objects:
- app/builds/v2.1.0/backend.zip
- app/config/prod/application.yaml
- app/assets/images/logo-v3.png

Action: Delete objects

To confirm this action, type "Delete objects" Delete objects Cancel
## No authorization provided

If a user declines to authorize the AI to perform an action, cancels the process, or doesn't provide authorization, display step-by-step instructions for manual completion. This ensures the user can still complete the action independently if desired. Offer a *Retry* option to return to the AI-assisted execution if the user changes their mind.

### Generative AI assistant

JD I want to delete 'aws_us_west2-678d13-pipe' S3 bucket Objects not deleted [2/3]
1. Inspected S3 buckets
2. Analyzed specified bucket
3. User declined consent to delete objects.   Retry

You can delete the objects in ' [aws_us_west2-678d13-pipe](about:blank/index.html.md) ' S3 bucket manually by yourself:

1. **AWS Console Method:**
2. Go to S3 in the AWS Console
  1. Select your bucket
  2. Check the boxes next to objects you want to delete
  3. Click "Delete" button
  4. Type "permanently delete" in the confirmation box
  5. Click "Delete objects"
3. **To Empty Entire Bucket:**
  1. Go to bucket "Properties"
  2. Find "Empty bucket" option
  3. Follow confirmation steps
4. **AWS CLI Quick Method:**   aws s3 rm s3://your-bucket-name/your-object-key
5. **Delete Multiple Objects with CLI:**   aws s3 rm s3://your-bucket-name --recursive

Remember that object deletion is permanent unless you have versioning enabled on your bucket.

## Complete an action

Once generative AI has completed an authorized action, confirm changes were completed and provide detailed feedback on what actions were completed.

### Generative AI assistant

JD Can you tag my EC2 instance 'i-1234abcd' as production? Production tag added [4/4]
1. Validated access
2. Fetched instance details
3. Constructed tag structure
4. Requested user consent:   Added production tag

Successfully tagged the EC2 instance 'i-1234abcd' as production. **Now that the production tag is added to 'i-1234abcd' EC2 instance, consider these next steps:**

1. Verify tags appear correctly in AWS Console and all connected systems
2. Update relevant documentation and system records
3. Check if related AWS resources need the same tags

## Action failure

When an authorized action fails, use the [steps](/components/steps/index.html.md) component to show which step has the error. Include details about the error using a [popover](/components/popover/index.html.md) or description text, and display specific steps needed to fix the error. For more prominent error notifications, use [error alerts](/components/alert/index.html.md) with action buttons. Refer to [error state guidelines](/patterns/genai/generative-AI-chat/index.html.md) for more details.

### Generative AI assistant

JD Can you tag my EC2 instance 'i-1234abcd' as production? Production tag not added [1/2]
1. Validated access
2. Failed to tag the EC2 instance.   Retry   Max number of tags exceeded

Failed to tag the EC2 instance 'i-1234abcd' as production Maximum number of tags exceeded. Remove unused tags and try again. Retry
## General guidelines

### Do

- Use additional authorization flows only when the actions that AI is performing on the user's behalf have critical consequences. When AI needs more information to continue, use [follow-up questions](/patterns/genai/follow-up-questions/index.html.md)   instead.
- Clearly indicate whether an action is permanent or can be reverted prior to execution, ensuring users understand the permanence of their decision.
- If the user doesn't authorize AI to execute an action, always provide instructions for manual execution.
- Be transparent about the steps AI is taking before and during execution of an action.
- When possible, add a 'Revert changes' option next to completed actions.

### Don't

- Don't execute changes that have serious, irreversible, or cascading consequences without explicit user authorization.

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

#### Button

- Button labels should match the intended action. If the [dialog box](https://github.com/cloudscape-design/demos/blob/main/src/pages/chat/additional-info/dialog.tsx)   is to collect authorization for a "Delete S3 bucket" action, use *Delete*   as the label.

#### Dialog box

- List affected resources using their unique identifiers.
- Format resource names in monospace font when showing exact IDs.
- Use bullet points for multiple resources.

#### Tree view

- Update [status indicator](/components/status-indicator/index.html.md)   labels within each tree item to clearly show what happened. For example:  

  - Original label: "User consent required".
  - After user declines: Change label to "User declined consent to delete objects".

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.
