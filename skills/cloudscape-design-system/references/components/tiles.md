---
scraped_at: '2026-04-20T08:49:46+00:00'
section: components
source_url: https://cloudscape.design/components/tiles/index.html.md
title: Tiles
---

# Tiles

Tiles enable users to choose one of a predefined set of options, including additional metadata to facilitate comparisons or progressive disclosure.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/tiles)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/tiles/index.html.json)

## Development guidelines

#### State management

The tiles component is controlled. Set the `value` property and the `onChange` listener to store its value in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting tiles
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import Tiles from '@cloudscape-design/components/tiles';

describe('<Tiles />', () => {
  it('renders the tiles component', () => {
    const { container } = render(<Tiles />);
    const wrapper = createWrapper(container);

    expect(wrapper.findTiles()).toBeTruthy();
  });

  it('selects all tiles components', () => {
    const { container } = render(<>
      <Tiles />
      <Tiles />
      <Tiles />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllTiles();
    expect(components).toHaveLength(3)
  });
});
```

Finding an item by its index
```
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import Tiles, { TilesProps } from '@cloudscape-design/components/tiles';

import { render } from '@testing-library/react';

const items: TilesProps['items'] = [
  { label: 'First item', value: 'item-1' },
  { label: 'Second item', value: 'item-2' },
  { label: 'Third item', value: 'item-3' },
];

describe('<Tiles />', () => {
  it('finds the second item by its index', () => {
    const { container } = render(<Tiles items={items} value="item-1" />);
    const wrapper = createWrapper(container);

    const thirdItem = wrapper.findTiles()!.findItems()[2].getElement();

    expect(thirdItem.textContent).toBe('Third item');
  });
});
```

Selecting an item by its value
```
import Box from '@cloudscape-design/components/box';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';
import Tiles from '@cloudscape-design/components/tiles';

import { render } from '@testing-library/react';
import { useState } from 'react';

const items = [
  { label: 'First item', value: 'item-1' },
  { label: 'Second item', value: 'item-2' },
  { label: 'Third item', value: 'item-3' },
];

function Component() {
  const [itemValue, setItemValue] = useState<string>('item-1');
  const selectedItem = items.find(item => item.value === itemValue);

  return (
    <Box>
      <TextContent>Selected item: {selectedItem?.label}</TextContent>
      <Tiles
        items={items}
        value={itemValue}
        onChange={({ detail }) => {
          setItemValue(detail.value);
        }}
      />
    </Box>
  );
}

describe('<Tiles />', () => {
  it('selects the second item by its value', () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    wrapper.findTiles()!.findItemByValue('item-2')!.click();
    const selectedItemLabel = wrapper.findTextContent()!.getElement();

    expect(selectedItemLabel.textContent).toBe('Selected item: Second item');
  });
});
```

## Unit testing APIs

TilesWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findInputByValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLInputElement> &#124; null | - | value: |
| findItemByValue | [TileWrapper](/index.html.md) &#124; null | - | value: |
| findItems | Array<[TileWrapper](/index.html.md)> | - | - | TileWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findImage | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
## Integration testing APIs

TilesWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findInputByValue | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | value: |
| findItemByValue | [TileWrapper](/index.html.md) | - | value: |
| findItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TileWrapper](/index.html.md)> | - | - | TileWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findDescription | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findImage | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findLabel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNativeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Use tiles when there are two to seven options in the group. Use a [select](/components/select/index.html.md)   or [autosuggest](/components/autosuggest/index.html.md)   when there are more than eight options.
- Use for selections that require additional metadata to compare mutually exclusive options. For boolean options that do not require a description of the off state, use a [toggle](/components/toggle/index.html.md)   or [checkbox](/components/checkbox/index.html.md)   instead.
- When displaying a description, image, or both to differentiate options, use them on every tile. When using a description, keep the length and sentence structure of descriptions consistent for each tile in a group for easy comparison.
- When using images, make sure that the image formats are consistent. This includes, but is not limited to, ratio, color, and background. For example, if one tile has an image in grayscale, the images on the other tiles also should be in grayscale.
- If one tile is selected and inactive, always deactivate the other tiles in the group. If possible, provide a description to explain why the group is inactive or how the user may be able to activate it.
- Use for options that turn a group of elements on or off, for example progressive disclosure of form elements. If the group of sub-elements contain other [tiles](/components/tiles/index.html.md)   , use [checkbox](/components/checkbox/index.html.md)   , [toggle](/components/toggle/index.html.md)   , or [radio group](/components/radio-group/index.html.md)   instead.
- Always provide an option selected by default.
- Follow the guidelines for [selection in forms](/patterns/general/selection/index.html.md)  .
- Follow the guidelines for [disabled and read-only states](/patterns/general/disabled-and-read-only-states/index.html.md)  .

### Don't

- To ensure legibility of labels and descriptions, avoid setting the  columns to display four tiles in the same row unless absolutely  necessary.
- Don't use generic icons or imagery for the sake of visual emphasis or  decoration.
- To prevent multiple click targets in the same area, don't place links  in labels or descriptions. Refer to the [help system](/patterns/general/help-system/index.html.md)   for the  appropriate placement of links.
- Don't place animated images or videos in tiles.
- Don't label tiles as optional.

## Features

- #### Label

  Tiles should be labeled to identify the option each represents. Use a [form field](/components/form-field/index.html.md)   or other label to identify groups of tiles. Make sure the group label is linked to the tiles both visually and for assistive technology.
- #### Description - optional

  A tile description can be used to define or provide additional context on each tile. They may include lists if necessary.  

  For example: When a tile is set up to trigger progressive disclosure of additional form fields, the tile's description may be used to indicate what will follow when the tile is selected.
- #### Image - optional

  Use an image for a tile if it is unique, highly recognizable, and provides clarity and distinction among tiles. For example, you might use a brand logo on a tile.
- #### Columns

  Columns determine the set number of tiles to display per row, between one and four. The default displays a max of three tiles per row unless explicitly set otherwise. If the default is not used, columns should be set to a number that displays the tiles evenly in each row.  

  For example: For a group of six tiles, use three columns (two rows of three tiles) instead of four columns (one row of four and one row of two tiles).

### States

- #### Disabled tile

  The state that specifies that a tile is disabled, preventing the user from selecting it.
- #### Read-only

  Use the read-only state when tiles data is not to be modified by the user but they still need to view it.

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

#### Labels

- Limit each label to a single line.
- Don't use terminal punctuation (such as colons) after labels.

#### Descriptions

- Use parallel sentence structure for easy comparison between options.
- Descriptions should have end punctuation, with the only exception being if a description ends with an external link icon, which should not have a period after it.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Provide a meaningful label and description for each tile.
- Ensure that any icons and images have appropriate alternative text.
- Wrap the component in a [form field](/components/form-field/index.html.md)   to ensure that the group of tiles is correctly labelled. Alternatively, explicitly set properties `ariaLabel`   (or `ariaLabelledBy`   ) and `ariaDescribedBy`  .

#### Labels and descriptions

- Tile labels and descriptions are part of the clickable/focusable area of the control, so they should not contain interactive content (for example, links). Place links at the [form field](/components/form-field/index.html.md)   level instead.

#### Roles and landmarks

- The component automatically applies the correct role.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
