---
scraped_at: '2026-04-20T08:52:43+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/onboarding/index.html.md
title: Onboarding
---

# Onboarding

The process of getting started with a product or feature.

## Objectives

Onboarding is the customer's first experience using a product. The process of onboarding can continue past the first use of the product. For example, it includes when a user engages with a new feature or flow for the first time. There isn't one way for onboarding users onto a product or feature. Different levels of support are required based on the flow's complexity, user's experience, and point in the customer journey.

## Key UX concepts

#### Surfacing the right amount of information

Help users get comfortable with your product by surfacing the right amount of information at each step of the customer journey. The goal is to provide users with the necessary information to feel confident using the service and to successfully complete a task without being overwhelmed.

#### Providing guidance when needed

Onboarding should help users get started with a product in a clear, seamless manner, without getting in the way or slowing them down. Give users a sense of control by showing them where they can find help, and also by ensuring users can decide when and how much guidance they need. Don't surface unprompted guidance, because this can be more of a distraction than an aid, especially for users who have more expertise than typical. When you surface additional guidance, it should be initiated by user action and be immediately actionable. For example, surface workflow-specific guidance only when the user actively starts a workflow.

#### Disclosing information progressively

Don't force users to hold a lot of information in their working memory. Identify when users might be interested in general information about a product or more detailed guidance for completing a workflow. As users advance on their customer journey with a product, the information they seek becomes less generalized and more workflow specific. Consider this when surfacing guidance.

## Patterns

There are different patterns that can help onboard users to your product or features. Each pattern plays a different role in your users' onboarding experience.

### Help system

The help system pattern allows users to easily and quickly access help within the interface and current workflow.

[View Documentation](/patterns/general/help-system/index.html.md)

### Hands-on tutorials

Hands-on tutorials provide contextual suggestions at decision points in workflows, and clarify all the steps that need to be completed in order to achieve an objective.

[View source code](https://github.com/cloudscape-design/demos/tree/main/src/pages/onboarding)

[View Documentation](/patterns/general/onboarding/hands-on-tutorials/index.html.md)

## Criteria

|  | Help panel | Hands-on tutorials |
| --- | --- | --- |
| Pattern goal | Provide help content that corresponds to a concept, term, option, or task on the product page | Provide recommendations and choice criteria at decision points in complex workflows |
| Pattern location | Corresponding product page | Corresponding product page |
| User's domain expertise | Specialist or Generalist | Generalist |
| User's learning style | Reader | Doer |

### Pattern goal

Pattern goal refers to the role that each of these patterns plays in the process of onboarding. Although all of the patterns help users get started with a product or feature, they serve different goals. For example, a hands-on tutorial recommends a specific configuration, while the help panel provides more information about all available configurations. These patterns complement each other and in most instance should be used together.

### Pattern location

Location refers to the placement of the pattern in the user's journey through the product. As users advance on their customer journey, generalized information progresses to more specific information.

For example, new users engage with the homepage first, where they can find high-level, introductory information. Later, as they progress through the product, they find more specific, action-orientated information through the help panel and hands-on tutorials.

### User's domain expertise

A user's domain expertise can be classified as either a *generalist * or *specialist* . Generalists work across a variety of services and technologies, but their expertise with a particular service or technology is limited. They might be unfamiliar with standard terminology or concepts. Specialists focus on a specific product and technology, gaining a deep understanding of its capabilities, limitations, terminology, and best practices.

Specialists are more likely to want to complete tasks independently, with more autonomy and minimal or no need for detailed help with standard concepts. They benefit from guidance that supports their mental model of the product. Generalists benefit from more detailed guidance that helps frame tasks in the context of use cases, and also makes the relationships between tasks obvious.

Consider the users' domain expertise when designing an onboarding experience for your product. Make sure that both types of expertise are supported.

### User's learning style

Users can be classified as *doers * or *readers* based on their learning style. Doers prefer to get hands on as soon as possible and then learn as they go. Doers read just enough to orient themselves, without diving into details. Readers favor reading documentation, blogs, or all other options in a product before committing to a course of action.

The homepage and help panel predominantly support readers by providing conceptual information and surfacing links to relevant documentation. The first-glance overview and hands-on tutorials predominantly support doers by providing actionable, concise guidance, without the requirement for navigating to product documentation.

Consider the users' learning style when designing an onboarding experience for your product. Make sure that both learning styles are supported.
