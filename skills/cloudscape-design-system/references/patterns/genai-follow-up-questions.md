---
scraped_at: '2026-04-20T08:51:27+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/genai/follow-up-questions/index.html.md
title: Follow-up questions
---

# Follow-up questions

Ways to request additional information from users to help generate more accurate and relevant responses.

## Key UX concepts

AI systems display follow-up questions to collect more input from users to provide more precise responses. These questions can appear in various interfaces, from conversational chat experiences to structured forms.

### Lead with benefits

Help users understand the value of additional context they provide. Highlight the benefits of enabling AI systems to generate better output via collection of more information to improve AI reasoning, and the expected outcome.

### Gather context at the right time

Decide whether to gather information before showing output or during the interaction. For high-impact decisions or when confidence is low, collect details first. For other scenarios, start with an initial response and ask follow-up questions to refine results.

### Streamline user choices

Provide clear options for users to proceed, skip, or exit at each step of the interaction. This ensures users feel in control of the experience and reduces friction.

### Guide users to necessary information

Help users access information that isn't readily available. Provide links or instructions on where to find required data when appropriate. This ensures users can provide accurate information even when it's not immediately at hand.

### Match input mechanism to question type

Display input methods that complement the type of information to be collected. For example, in chat experiences, open ended text responses and single selection mechanisms often work best. Questions with a finite set of answers, such as selecting resource IDs or timestamps, should use structured containers with a [form](/components/form/index.html.md) . This reduces errors and improves data quality.

## Criteria table

| **Information type** | **Input method** | **Examples** |
| --- | --- | --- |
| **Clarifying user intent** | Open ended text response using the chat [prompt input](/components/prompt-input/index.html.md)  . | User needs to explain a use case. Multiple complex aspects need to be addressed in one response. |
| **Guided selection** | Present recommended inputs with [support prompt group](/components/support-prompt-group/index.html.md)  . | There are up to five specific valid choices. You need to guide users to valid inputs. Questions change based on previous answers. |
| **Form-based input** | Present a form within the [dialog box](https://github.com/cloudscape-design/demos/blob/main/src/pages/chat/additional-info/dialog.tsx)  . | Multiple specific data points are needed. Information has validation rules. Structured data is required. |
| **Progressive steps input** | Use form-based input within [progressive steps](/patterns/genai/progressive-steps/index.html.md)  . | A specific execution step needs input to proceed. Details are needed for upcoming steps. |

## Common use cases

### Clarifying user intent

When users provide ambiguous or incomplete information, open-ended questions help gather details about their specific context and current situation.

### Generative AI assistant

JD I need to optimize EC2 costs across multiple regions. Optimizing EC2 costs across multiple regions is an important task for managing cloud expenses. Here are strategies you can implement to optimize your EC2 costs:

1. Use Reserved Instances (RIs)   [   1   ]
  - Purchase RIs for predictable, long-term workloads
  - Take advantage of regional benefit and size flexibility
  - Consider Savings Plans for more flexibility across instance types and regions
2. Implement Auto Scaling   [   2   ]
  - Set up Auto Scaling groups to automatically adjust capacity based on demand
  - Use target tracking scaling policies to maintain optimal performance at the lowest cost
3. ...

Sources <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html"> [ 1 ] Reserved Instances for Amazon EC2 overview</a> <a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html"> [ 2 ] What is Amazon EC2 Auto Scaling?</a> To provide targeted recommendations to optimize your EC2 costs, could you tell me:

1. What's your main goal? (Like Reduce costs for development environments, optimize production workload spending)
2. Any specific constraints we should know about? (Must maintain high availability, need to keep certain instances running 24/7)

### Guided selection

When specific valid choices are required, [support prompts](/components/support-prompt-group/index.html.md) guide users to select from predefined options.

### Generative AI assistant

JD I need to choose between AWS Fargate and ECS on EC2 for my containerized application. Both are great options for running containers. Here are the key differences:

AWS Fargate:

[1]

1. Serverless - no need to manage infrastructure
2. Pay only for resources used by containers
3. Easier to get started and maintain

ECS on EC2:

[2]

1. More control over underlying infrastructure
2. Better cost optimization for consistent workloads
3. Access to instance-level customization

Sources [[1] Simplify compute management with AWS Fargate](https://docs.aws.amazon.com/eks/latest/userguide/fargate.html) [[2] What is Amazon EC2?](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html) To provide a more tailored recommendation, what's your primary concern when choosing a container orchestration solution?

Minimize management overhead Maximize control over infrastructure Optimize cost
### Form-based input

When multiple specific data points are needed, a dismissible [dialog](https://github.com/cloudscape-design/demos/blob/main/src/pages/chat/additional-info/dialog.tsx) with various [form](/components/form/index.html.md) field types collect additional information.

### Generative AI assistant

JD I need to set up a new EC2 instance Here's how to set up a new EC2 instance step by step:

1. Access the EC2 Dashboard
  - Open the Amazon EC2 console at [https://console.aws.amazon.com/ec2/](https://console.aws.amazon.com/ec2/)
  - Ensure you're in the correct AWS region
2. Start the Launch Instance Wizard
  - Click on the "Launch instance" button on the EC2 dashboard
3. Choose an Amazon Machine Image (AMI)
  - Select an AMI that suits your needs (e.g., Amazon Linux 2, Ubuntu, Windows Server)
  - Consider factors like the operating system, pre-installed software, and architecture
4. ...

#### Information required

I can also help you set up a new EC2 instance. To ensure I configure it correctly for your needs, provide the following details:

Instance type Choose instance type Operating system Linux/Unix Windows MacOS Root volume size (GB) Instance lifetime Submit Skip
### Progressive steps input

Show follow-up questions in a dismissible [dialog](https://github.com/cloudscape-design/demos/blob/main/src/pages/chat/additional-info/dialog.tsx) within [progressive steps](/patterns/genai/progressive-steps/index.html.md) when additional information is needed to complete specific steps.

### Generative AI application

1. Inspecting resources
2. Analyzing data
3. Compiling details
4. Information required

#### Customize your setup

I can also help you set up a new EC2 instance. To ensure I configure it correctly for your needs, provide the following details:

Execution ID View recent [Athena queries](about:blank/index.html.md) AWS Region Choose a region Submit Skip
## General guidelines

### Do

- To avoid overwhelming the user, minimize the number of follow-up questions in a single workflow, if possible.

### Don't

- Ask for information already provided or data that can be retrieved automatically through APIs.

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

#### Dialog title

- Be specific and action-oriented. Dialog titles should clearly indicate the action being performed or the purpose of the dialog, often by combining an action verb with the resource or concept involved.  

  - For example: "Configure [specific item]"

#### Button text

- Consistency with title (if applicable). If the button performs the primary action indicated in the dialog title, the verb used in the button label should match the verb in the title.
- Follow the writing guidelines for [button](/components/button/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.
