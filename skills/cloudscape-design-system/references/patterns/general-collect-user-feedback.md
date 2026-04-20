---
scraped_at: '2026-04-20T08:52:05+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/collect-user-feedback/index.html.md
title: User feedback
---

# User feedback

User feedback enables users to directly and quickly express their thoughts, concerns, and suggestions about the page they are viewing.

 [Get design library](/get-started/for-designers/design-resources/index.html.md)
## Features

### Structure

A B C D
#### A. Header

A user feedback header is a concise question that specifies the content for which feedback is being gathered.

- For example: *Was this page helpful?*

#### B. Description - optional

A user feedback description is a broader explanation of the header question. Use the description only if the header needs an additional explanation.

- For example: *Tell us about your experience with the information on the page.*

#### C. Sentiments

Utilize a voting mechanism to gather quantitative sentiment data, including two distinct sentiments:

- A   "thumbs up" normal button to collect positive sentiment.
- A   "thumbs down" normal button to collect negative sentiment.

#### D. Custom area - optional

The custom area enables you to append supplementary elements to collect qualitative data, such as a [link](/components/link/index.html.md) , an [expandable section](/components/expandable-section/index.html.md) , or an embedded form. Follow the guidelines for [custom area](/patterns/general/collect-user-feedback/index.html.md).

### States

A B C
#### A. Loading state

Show the loading state while the feedback is being submitted. Follow the guidelines for [button loading state](/components/button/index.html.md).

#### B. Submitted state

Show the submitted state when the sentiment data has been successfully sent. Use a filled "thumbs up" icon for positive data sent, and a filled "thumbs down" icon for negative data sent. Express gratitude to users and confirm that feedback is received.

- For example: *Helpful. Thanks, your feedback is recorded.*

#### C. Error state

Show the error state when the data fails at storing or communicating with the server. You can provide a recovery mechanism, such as a reset action, in the error state. Follow the guidelines for [status indicator](/components/status-indicator/index.html.md).

## Custom area

When qualitative data is needed, you can append additional elements in the custom area to enable users to provide descriptive feedback. Within the custom area, you can include one of these:

- A [link](/components/link/index.html.md)   to redirect to a form, either in a [modal](/components/modal/index.html.md)   or in a new page.
- An [expandable section](/components/expandable-section/index.html.md)   to display a simple form.
- An embedded simple form composed of a header, [form fields](/components/form-field/index.html.md)   , and a submit [button](/components/button/index.html.md)  .

Refer to the table below to decide which version to use for your service:

|  | With link | With expandable section | With embedded form |
| --- | --- | --- | --- |
| Elements used in custom area | Link | Expandable section, form fields, button | Header, form fields, button |
| Type of sentiments | Positive, negative, neutral | Positive, negative, neutral | Positive, negative |
| Placement | Place at the bottom of the page or on the side of the page | Place this at the side of the page only | Place this at the side of the page only |
| Additional questions | More than 3 | 1-3 form fields, such as an open response text field, a radio group, a group checkboxes | 1-3 form fields, such as an open response text field, a radio group, a group checkboxes |
| Interaction | - | After submitting the sentiment, the expandable section opens automatically | After submitting the sentiment, shown with progressive disclosure |

#### Type of sentiments

By implementing thumbs up/yes and thumbs down/no votes, you can efficiently collect positive and negative sentiments.

If you want to accommodate users expressing neutral sentiment, or provide a space for interaction without strictly categorizing feedback as positive or negative, consider adding a link or an expandable section within the custom area. This allows users to provide feedback or engage without the need for a binary sentiment choice.

#### Placement

You can position the user feedback with a link either on the side of the page or at the bottom of the page, after users have reviewed the main content. To prevent page height jumping issues, place user feedback with expandable section or with an embedded form on the side of the page.

Responsively, the user feedback should go to the bottom of the page in narrow viewport.

#### Additional questions

- Ask 1-3 additional questions using form fields, such as an open response [text area](/components/textarea/index.html.md)   , a [radio group](/components/radio-group/index.html.md)   or [checkboxes](/components/checkbox/index.html.md)   , within the expandable section or within an embedded form.
- If you want to collect feedback for more than 3 questions, use a link to open a modal or a new page. In the modal or new page, show the sentiment submitted status as the first form field to remind users of their previous selection.

#### Interaction

- When using an expandable section, collapse the expandable section as default. After the user has submitted the sentiment data, open the expandable section.
- When using an embedded form, you can decide which sentiments you want to collect more feedback, for positive and/or negative sentiments. Reveal the additional questions in the form progressively. This reduces the information density of the feedback session and gives control over to the users to decide and choose how to give feedback. Offering the freedom on how to give feedback increases the likelihood of getting honest feedback.

## Development guidelines

We provide code examples for four types of user feedback.

## Default

### Preview

## Was this page helpful?

Yes No Code The following code uses React and JSX syntax.

```
// sentiment.jsx

import React, { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Box, Button, Icon, SpaceBetween } from '@cloudscape-design/components';

function UserFeedbackSentiment({ onChange }) {
  const [loadingSentiment, setLoadingSentiment] = useState(null);
  const [successfulSentiment, setSuccessfulSentiment] = useState(null);
  const successRef = useRef();

  const submitSentiment = sentiment => {
    setLoadingSentiment(sentiment);
    setSuccessfulSentiment(null);

    setTimeout(() => {
      flushSync(() => {
        setSuccessfulSentiment(sentiment);
        setLoadingSentiment(null);
      });
      successRef.current.focus();

      if (onChange) {
        onChange(sentiment);
      }
    }, 500);
  };

  return (
    <SpaceBetween size="s">
      <Box variant="h2">Was this page helpful?</Box>
      {!successfulSentiment && (
        <SpaceBetween direction="horizontal" size="xs">
          <Button
            iconName="thumbs-up"
            loadingText="Submitting feedback"
            onClick={() => submitSentiment('yes')}
            loading={loadingSentiment === 'yes'}
            disabled={loadingSentiment === 'no'}
          >
            Yes
          </Button>
          <Button
            iconName="thumbs-down"
            loadingText="Submitting feedback"
            onClick={() => submitSentiment('no')}
            loading={loadingSentiment === 'no'}
            disabled={loadingSentiment === 'yes'}
          >
            No
          </Button>
        </SpaceBetween>
      )}

      {successfulSentiment && (
        <>
          {/* Ensure the content has an appropriate accessible role to receive focus after submitting feedback */}
          <div ref={successRef} tabIndex={-1} role="button" aria-disabled="true">
            <Box variant="span" color="text-body-secondary">
              {successfulSentiment === 'yes' ? (
                <span>
                  <Icon name="thumbs-up-filled" /> Helpful.{' '}
                </span>
              ) : (
                <span>
                  <Icon name="thumbs-down-filled" /> Not helpful.{' '}
                </span>
              )}
              Thanks, your feedback has been recorded.
            </Box>
          </div>
        </>
      )}
    </SpaceBetween>
  );
}

export default UserFeedbackSentiment;
```

## With link

### Preview

## Was this page helpful?

Yes No [Provide more feedback]() Code The following code uses React and JSX syntax.

```
import React from 'react';
import { Link, SpaceBetween } from '@cloudscape-design/components';
import UserFeedbackSentiment from './sentiment';

export default function LinkFeedback() {
  return (
    <SpaceBetween size="s">
      <UserFeedbackSentiment />
      <Link onFollow={() => {}}>Provide more feedback</Link>
    </SpaceBetween>
  );
}
```

## With expandable section

### Preview

## Was this page helpful?

Yes No Tell us more Additional notes - *optional* Do not disclose any personal, commercially sensitive, or confidential information. Send Code The following code uses React and JSX syntax.

```
import React, { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Box, Button, ExpandableSection, Form, FormField, SpaceBetween, Textarea } from '@cloudscape-design/components';
import UserFeedbackSentiment from './sentiment';

export default function ExpandableFeedback() {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const feedbackSuccessRef = useRef();

  return (
    <SpaceBetween size="s">
      <UserFeedbackSentiment onChange={() => setExpanded(true)} />
      <ExpandableSection
        headerText="Tell us more"
        expanded={expanded}
        onChange={({ detail }) => setExpanded(detail.expanded)}
      >
        {!feedbackSent && (
          <Form
            actions={
              <Button
                onClick={() => {
                  flushSync(() => setFeedbackSent(true));
                  feedbackSuccessRef.current.focus();
                }}
              >
                Send
              </Button>
            }
          >
            <FormField
              label={
                <span>
                  Additional notes - <i>optional</i>
                </span>
              }
              constraintText="Do not disclose any personal, commercially sensitive, or confidential information."
            >
              <Textarea />
            </FormField>
          </Form>
        )}

        {feedbackSent && (
          <div ref={feedbackSuccessRef} tabIndex={-1}>
            <Box variant="span">
              We appreciate your feedback. This will helps us improve our products and services in the future.
            </Box>
          </div>
        )}
      </ExpandableSection>
    </SpaceBetween>
  );
}
```

## With embedded form

### Preview

## Was this page helpful?

Yes No Code The following code uses React and JSX syntax.

```
import React, { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Box, Button, Form, FormField, Header, SpaceBetween, Textarea } from '@cloudscape-design/components';
import UserFeedbackSentiment from './sentiment';
import { Sentiment } from './types';

function Contextual() {
  const successRef = useRef<HTMLDivElement | null>(null);
  const [sentiment, setSentiment] = useState<Sentiment>();
  const [feedbackSent, setFeedbackSent] = useState(false);

  return (
    <SpaceBetween size="s">
      <UserFeedbackSentiment onChange={(sentiment: Sentiment) => setSentiment(sentiment)} />

      {sentiment && (
        <div>
          <Header variant="h3">Tell us more</Header>
          {!feedbackSent && (
            <Form
              actions={
                <Button
                  onClick={() => {
                    flushSync(() => setFeedbackSent(true));
                    successRef.current?.focus();
                  }}
                >
                  Send
                </Button>
              }
            >
              <FormField
                label={
                  <span>
                    Additional notes - <i>optional</i>
                  </span>
                }
                constraintText="Do not disclose any personal, commercially sensitive, or confidential information."
              >
                <Textarea value="" />
              </FormField>
            </Form>
          )}

          {feedbackSent && (
            <div ref={successRef} tabIndex={-1}>
              <Box variant="span">
                We appreciate your feedback. This will helps us improve our products and services in the future.
              </Box>
            </div>
          )}
        </div>
      )}
    </SpaceBetween>
  );
}

export default Contextual;

```

## General guidelines

### Do

- Be non-intrusive. Place the feedback on the side of the page, or at the bottom of the page, so that users have completed reading or viewing the main content.
- Keep the feedback session brief. Long sessions often result in lower participation rates and generate a substantial volume of data that needs tracking and processing on the backend. ( [Research from Nielsen Norman Group](https://www.nngroup.com/articles/user-feedback/)   )
- Separate the submission of sentiment data from the submission of the form data. Additional questions can be time-consuming to complete, potentially impacting conversion rates.
- We recommend to place user feedback in close proximity of [anchor navigation](/components/anchor-navigation/index.html.md)   , directly below it. It provides users relevant information and it helps to conserve space.

### Don't

- Don't place multiple expandable sections or embedded forms in the custom area.
- Don't use to collect generative AI feedback. Instead, follow the guidelines for [generative AI chat](/patterns/genai/generative-AI-chat/index.html.md)  .

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

#### Keyboard focus

- Ensure that keyboard focus is not lost after feedback has been submitted. After successful submission, move the keyboard focus to the success state message.

#### Live region

- Wrap the error state message in a [live region component](/components/live-region/index.html.md)   to notify screen readers about the error.

#### Button

- Follow the accessibility guidelines for [button](/components/button/index.html.md)  .

#### Expandable section

- Follow the accessibility guidelines for [expandable section](/components/expandable-section/index.html.md)  .

#### Form fields

- Follow the accessibility guidelines for [form field](/components/form-field/index.html.md)  .

#### Modal

- Follow the accessibility guidelines for [modal](/components/modal/index.html.md)  .
