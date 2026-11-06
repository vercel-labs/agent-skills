---
scraped_at: '2026-04-20T08:48:43+00:00'
section: components
source_url: https://cloudscape.design/components/loading-bar/index.html.md
title: Loading bar
---

# Loading bar

A linear loading indicator that informs the user about an ongoing operation with unknown duration.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/chat-components/tree/main/src/loading-bar)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/loading-bar/index.html.json)

## Development guidelines

### Installing chat components

This component comes from the new `@cloudscape-design/chat-components` NPM module. Make sure to add this module to your dependencies.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing APIs

LoadingBarWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## Integration testing APIs

LoadingBarWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| No methods availableThis wrapper does not provide any additional methods. |  |  |  |
## General guidelines

### Do

- Show loading text next to the loading bar to inform users about the ongoing operation. Refer to [generative AI loading states](/patterns/genai/genai-loading-states/index.html.md)   for more guidelines.

### Don't

- Avoid using the loading bar for non-generative AI use cases. The loading bar is currently styled for usage in generative AI use cases only.

## Features

- #### Variant

  - **Generative AI -**     Use when bar is placed inside an element. For example, center of a [container](/components/container/index.html.md)    .
  - **Generative AI with mask -**     Use when bar is placed next to the edge of elements that have rounded corners. For example, bottom of a chat bubble.

## Writing guidelines

### Generative AI loading state

Follow the writing guidelines for [generative AI loading states](/patterns/genai/genai-loading-states/index.html.md).

## Accessibility guidelines

You can ensure status changes are announced to users by wrapping a [live region component](/components/live-region/index.html.md).

### Preview

Generating a response Code The following code uses React and JSX syntax.

```
import React from 'react';
import { Box, LiveRegion } from '@cloudscape-design/components';
import LoadingBar from '@cloudscape-design/chat-components/loading-bar';

const GenAILoading = () => {
  return (
    <LiveRegion>
      <Box margin={{ bottom: 'xs', left: 'l' }} color="text-body-secondary">
        Generating a response
      </Box>
      <LoadingBar variant="gen-ai" />
    </LiveRegion>
  );
};

export default GenAILoading;
```






Generating a response

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
