---
scraped_at: '2026-04-20T08:49:11+00:00'
section: components
source_url: https://cloudscape.design/components/s3-resource-selector/index.html.md
title: S3 resource selector
---

# S3 resource selector

S3 resource selector is a component that provides the ability to read objects from an S3 bucket, or write objects to an S3 bucket with a prefix.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/s3-resource-selector)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/s3-resource-selector/index.html.json)

## Development guidelines

#### State management

The S3 resource selector component is controlled. Set the `resource` property and the `onChange` listener to store its value and validation result in the state of your application. Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

#### S3 API integration

When handling S3 API response, merge [common prefixes](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html#API_ListObjectsV2_ResponseSyntax) (directories) and [contents](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html#AmazonS3-ListObjectsV2-response-Contents) (files)  in a single list. For common prefixes, preserve trailing slashes in the names, to avoid ambiguity when three is a file and a directory with the same name.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting s3 resource-selector
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import S3ResourceSelector from '@cloudscape-design/components/s3-resource-selector';

describe('<S3ResourceSelector />', () => {
  it('renders the s3-resource-selector component', () => {
    const { container } = render(<S3ResourceSelector />);
    const wrapper = createWrapper(container);

    expect(wrapper.findS3ResourceSelector()).toBeTruthy();
  });

  it('selects all s3-resource-selector components', () => {
    const { container } = render(<>
      <S3ResourceSelector />
      <S3ResourceSelector />
      <S3ResourceSelector />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllS3ResourceSelectors();
    expect(components).toHaveLength(3)
  });
});
```

Selecting a resource using the selector modal
```
import Box from '@cloudscape-design/components/box';
import S3ResourceSelector, { S3ResourceSelectorProps } from '@cloudscape-design/components/s3-resource-selector';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';

import { render, waitFor } from '@testing-library/react';
import { useState } from 'react';

const buckets = [
  {
    Name: 'bucket-fugiat',
    CreationDate: 'December 27, 2019, 22:16:38 (UTC+01:00)',
    Region: 'Middle East (Bahrain) me-south-1',
  },
  {
    Name: 'bucket-ut',
    CreationDate: 'July 06, 2019, 12:41:19 (UTC+02:00)',
    Region: 'US East (N. Virginia) us-east-1',
  },
];
const objects = [
  {
    Key: 'black-hole-5ns.zip',
    LastModified: 'August 03, 2019, 19:26:58 (UTC+02:00)',
    Size: 66477663816,
    IsFolder: false,
  },
  {
    Key: 'electron-8h.zip',
    LastModified: 'November 06, 2019, 14:00:40 (UTC+01:00)',
    Size: 96909820974,
    IsFolder: false,
  },
];
const versions = [
  {
    VersionId: 'f2ef887e-af4c-4003-ad16-153d1419c024',
    LastModified: 'April 30, 2019, 05:21:44 (UTC+02:00)',
    Size: 29013625564809,
  },
  {
    VersionId: '82e5f938-fe82-4977-a39a-44a549e630c1',
    LastModified: 'April 10, 2019, 21:21:10 (UTC+02:00)',
    Size: 25016305995260,
  },
];

function Component() {
  const [resource, setResource] = useState<S3ResourceSelectorProps['resource']>({
    uri: '',
  });

  return (
    <Box>
      <TextContent>Selected resource URI: {resource.uri}</TextContent>
      <TextContent>Selected resource version: {resource.versionId}</TextContent>
      <S3ResourceSelector
        onChange={({ detail }) => setResource(detail.resource)}
        resource={resource}
        fetchBuckets={() => Promise.resolve(buckets)}
        fetchObjects={() => Promise.resolve(objects)}
        fetchVersions={() => Promise.resolve(versions)}
        selectableItemsTypes={['objects', 'versions']}
      />
    </Box>
  );
}

describe('<S3ResourceSelector />', () => {
  it('selects the resource using the s3 selector modal', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    // 1. Open the browse modal
    const s3Selector = wrapper.findS3ResourceSelector()!;
    s3Selector.findInContext()!.findBrowseButton().click();
    const modalContent = await waitFor(() => {
      return s3Selector.findModal()!.findContent();
    });

    // 2. Pick the `bucket-fugiat` bucket from the list.
    const s3Bucket = await waitFor(() => {
      const link = modalContent.findTable()!.findBodyCell(1, 2)!.findLink()!;

      expect(link.getElement().textContent).toBe('bucket-fugiat');

      return link;
    });
    s3Bucket.click();

    // 3. From the selected bucket, pick the `electron-8h.zip` object.
    const s3Object = await waitFor(() => {
      const link = modalContent.findTable()!.findBodyCell(2, 2)!.findLink()!;

      expect(link.getElement().textContent).toBe('electron-8h.zip');

      return link;
    });
    s3Object.click();

    // 4. From the selected object, pick the second version.
    const s3Version = await waitFor(() => {
      const selectionArea = modalContent.findTable()!.findRowSelectionArea(2)!;

      expect(selectionArea).toBeTruthy();

      return selectionArea;
    });
    s3Version.click();

    // 5. Submit and wait for modal to close.
    s3Selector.findModal()!.findSubmitButton().click();
    await waitFor(() => {
      const modal = wrapper.findModal();

      expect(modal).toBe(null);
    });

    // 6. Assert the selected resource.
    const [resourceUri, versionId] = wrapper.findAllTextContents();

    expect(resourceUri.getElement().textContent).toBe('Selected resource URI: s3://bucket-fugiat/electron-8h.zip');
    expect(versionId.getElement().textContent).toBe('Selected resource version: 82e5f938-fe82-4977-a39a-44a549e630c1');
  });
});
```

Selecting a resource using the text input
```
import Box from '@cloudscape-design/components/box';
import S3ResourceSelector, { S3ResourceSelectorProps } from '@cloudscape-design/components/s3-resource-selector';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import TextContent from '@cloudscape-design/components/text-content';

import { render, waitFor } from '@testing-library/react';
import { useState } from 'react';

const buckets = [
  {
    Name: 'bucket-fugiat',
    CreationDate: 'December 27, 2019, 22:16:38 (UTC+01:00)',
    Region: 'Middle East (Bahrain) me-south-1',
  },
];
const objects = [
  {
    Key: 'black-hole-5ns.zip',
    LastModified: 'August 03, 2019, 19:26:58 (UTC+02:00)',
    Size: 66477663816,
    IsFolder: false,
  },
];
const versions = [
  {
    VersionId: 'f2ef887e-af4c-4003-ad16-153d1419c024',
    LastModified: 'April 30, 2019, 05:21:44 (UTC+02:00)',
    Size: 29013625564809,
  },
  {
    VersionId: '82e5f938-fe82-4977-a39a-44a549e630c1',
    LastModified: 'April 10, 2019, 21:21:10 (UTC+02:00)',
    Size: 25016305995260,
  },
];

function Component() {
  const [resource, setResource] = useState<S3ResourceSelectorProps['resource']>({
    uri: '',
    versionId: '',
  });

  return (
    <Box>
      <TextContent>Selected resource URI: {resource.uri}</TextContent>
      <TextContent>Selected resource version: {resource.versionId}</TextContent>
      <S3ResourceSelector
        onChange={({ detail }) => setResource(detail.resource)}
        resource={resource}
        fetchBuckets={() => Promise.resolve(buckets)}
        fetchObjects={() => Promise.resolve(objects)}
        fetchVersions={() => Promise.resolve(versions)}
        selectableItemsTypes={['objects', 'versions']}
      />
    </Box>
  );
}

describe('<S3ResourceSelector />', () => {
  it('selects the resource and its version using the in-context text input', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);

    const s3SelectorInContext = wrapper.findS3ResourceSelector()!.findInContext();
    s3SelectorInContext!.findUriInput()!.setInputValue('s3://bucket-fugiat/bucket-hole-5ns.zip');
    await waitFor(() => {
      if (s3SelectorInContext.findVersionsSelect()!.isDisabled()) {
        throw new Error('Waiting for versions to load');
      }
    });

    s3SelectorInContext.findVersionsSelect()!.openDropdown();
    s3SelectorInContext.findVersionsSelect()!.selectOptionByValue('82e5f938-fe82-4977-a39a-44a549e630c1');

    const [resourceUri, versionId] = wrapper.findAllTextContents();

    expect(resourceUri.getElement().textContent).toBe('Selected resource URI: s3://bucket-fugiat/bucket-hole-5ns.zip');
    expect(versionId.getElement().textContent).toBe('Selected resource version: 82e5f938-fe82-4977-a39a-44a549e630c1');
  });
});
```

## Unit testing APIs

S3ResourceSelectorWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAlertSlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findInContext | [S3InContextWrapper](/index.html.md) | - | - |
| findModal | [S3ModalWrapper](/index.html.md) &#124; null | - | - |
| findTable | [TableWrapper](/components/table/index.html.md) &#124; null | - | - | S3InContextWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findBrowseButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findUriInput | [InputWrapper](/components/input/index.html.md) | - | - |
| findVersionsSelect | [SelectWrapper](/components/select/index.html.md) &#124; null | - | - |
| findViewButton | [ButtonWrapper](/components/button/index.html.md) | - | - | S3ModalWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findDismissButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findSubmitButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| isVisible | boolean | - | - |
## Integration testing APIs

S3ResourceSelectorWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findAlertSlot | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findInContext | [S3InContextWrapper](/index.html.md) | - | - |
| findModal | [S3ModalWrapper](/index.html.md) | - | - |
| findTable | [TableWrapper](/components/table/index.html.md) | - | - | S3InContextWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findBrowseButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
| findUriInput | [InputWrapper](/components/input/index.html.md) | - | - |
| findVersionsSelect | [SelectWrapper](/components/select/index.html.md) | - | - |
| findViewButton | [ButtonWrapper](/components/button/index.html.md) | - | - | S3ModalWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDismissButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findFooter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSubmitButton | [ButtonWrapper](/components/button/index.html.md) | - | - |
### Key Amazon S3 concepts

Amazon Simple Storage Service (Amazon S3) is an object storage service. The basic storage units of Amazon S3 are objects which are organized into buckets. For more information [refer to the Amazon S3 documentation](https://docs.aws.amazon.com/s3/index.html).

## General guidelines

### Do

- Catch and display server errors using the alert component included in  the S3 resource selector.

### Don't

- Don't use the S3 resource selector in a modal or popover.
- Don't use the S3 resource selector pattern as a generic file resource selector; instead use the [file upload](/components/file-upload/index.html.md)   pattern.

## Features

The S3 resource selector component's primary function is to help users select a Amazon S3 resource URI (Uniform Resource Identifier), so your service can then perform read or write actions on that resource. The component provides integrated logic including interactions, functionalities, and validation rules from Amazon S3.

### Modes

The S3 resource selector operates in one of two modes - either reading resources from Amazon S3 or writing resources to Amazon S3. Some features are available only in specific modes.

- #### Read

  Used to select an object or bucket URI for your service to read resources from Amazon S3.  

  - For example:    

    - Read from a bucket with log file objects for parsing and analysis.
    - Read from a video file object to transcribe the file's audio.
- #### Write

  Used to select an object or bucket URI for your service to write resources to Amazon S3.  

  - For example:    

    - Write log files of an event to an Amazon S3 bucket.
    - Write a video file to an Amazon S3 bucket after transcoding it.

### Built-in functions

- #### Resource URI input

  Input which helps users to type in or paste the URI of a resource. If users choose a resource with the browsing resources modal, the URI field is automatically populated with that resource URI.  

  - The URI resource field is validated inline and checks the provided URI against [Amazon S3's rules for naming resources](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html#bucketnamingrules)    .
  - For specific validation text strings, follow the writing guidelines for [S3 resource selector](/components/s3-resource-selector/index.html.md)    .
- #### Object version selection - Optional

  Select is how users choose available versions of an object.  

  - In Read mode, we strongly recommended including the version select since it helps users to choose the correct version of an object. If the user does not choose a version, the most recent version of the object is used.
  - In Write mode, the version select is not included since Amazon S3 does not provide the ability to write to a specific version. If versioning is active on a bucket, writing to an existing object creates a new version of that object.
  - In the S3 resource selector's empty state, the version select shows in the disabled state.    

    - The version select is active when the user has entered an object's URI in the resource URI field or has chosen an object with the browse modal.
    - Buckets are not versioned (only objects inside buckets). If the user chooses a bucket, the version select remains inactive.
- #### Browsing resources modal

  Modal with a list of Amazon S3 resources, which is how the user browses buckets, objects, and versions to find the resource URI for a particular resource. The modal launches when users click the *Browse*   button.  

  - While Amazon S3 does not technically support folders, object keys using the / delimiter prefix are shown in the S3 resource selector as nested in folders.
  - You can define which resource types the user can choose, including buckets, objects, and versions.
- #### Viewing a chosen object - Optional

  The *View*   button is how users open an object's description page in the Amazon S3 console, which provides additional metadata. This helps users select the correct object. The *View*   button is activated once users choose an object.
- #### Validation

  Validation happens inline when users type in or paste a resource URI. Follow the [error writing guidelines](about:blank/index.html.md)   for specific validation rules and text strings.

### States

- #### Empty

  The state of the S3 resource selector when no resource URI has been provided or the user has not browsed and chosen a resource.
- #### Loading

  When users type in or pastes a resource URI, or browses for and chooses a resource, the component provides events so implementors can trigger an Amazon S3 fetch operation. During the fetch operation, the component shows a loading indicator below the *Resource URI*   input.
- #### Errors

  There are two primary error types that occur in the S3 resource selector:  

  - Validation errors, which can occur when users type in or paste a URI into the *Resource URI*     input. These errors show automatically below the *Resource URI*     input.
  - Server errors, which occur when there was a problem fetching a resource. It is the implementer's responsibility to catch and pass server errors to the alert included in the component.

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

#### Form field labels

- For the resource URI and version form field labels, use this text:  

  - *Resource URI *     for the Amazon S3 resource URI path label.
  - *Object Version *     for the version select label.
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Form field constraint text

- For fields on the inline form, use this text:  

  - *Use s3://bucket/prefix/object format *     for the Resource URI field in read mode.
  - *Use s3://bucket/prefix format *     for the Resource URI field in write mode.
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Form field placeholders - optional

- For fields on the inline form, use the placeholder text:  

  - s3://bucket/prefix/object* *     for the Resource URI field placeholder in read mode.
  - s3://bucket/prefix* *     for the Resource URI field placeholder in write mode.
  - Choose version* f*     or the object version select.
- Follow the writing guidelines for [form field](/components/form-field/index.html.md)  .

#### Buttons

- For buttons on the initial form, use this text:  

  - *View *     for the object view button.
  - *Browse S3 *     for the button to open the modal browser.
- On the browse Amazon S3 modal, use this text:  

  - *Choose*     for the button that chooses the resource.
  - *Cancel *     for the button that cancels the selection and closes the modal.
- Follow the writing guidelines for [button](/components/button/index.html.md)  .

#### Browse modal

- For the browse modal header, use this text: *Choose \[resource type\] in Amazon S3*  

  - For example: *Choose audio file in Amazon S3.*
- Follow the writing guidelines for [modal](/components/modal/index.html.md)  .

#### Browse table

- For column headers in the browse modal table, use this text:  

  - For bucket names: *Name*
  - For the bucket creation date: *Creation date*
  - For the bucket region: *Region*
  - For object key: *Key*
  - For the object last modified timestamp: *Last modified*
  - For the object or version size: *Size*
  - For version IDs: *Version ID*
  - For version creation time: *Creation time*
- For table columns with dates or times, follow the guidelines for [timestamps](/patterns/general/timestamps/index.html.md)  .
- Follow the writing guidelines for [table](/components/table/index.html.md)  .

#### Component states

#### Empty state

For empty states, such as the *Resource URI * input, *Object version* select, and *browse S3 resources* table, follow the guidelines for [empty states](/patterns/general/empty-states/index.html.md).

#### Loading

- When a resource is being fetched, the component shows a loading indicator. For the loading indicator text, use the text: Loading resource
- In the browse S3 modal table, when resources are loading, use this text: *Loading \[resource type\]*  

  - For example:    

    - *Loading buckets*
    - *Loading objects*
    - *Loading versions*      .

#### Error

- When validating the S3 resource URI, use this text:  

  - *The path must begin with s3://*
  - *The bucket name must start with a lowercase character or number.*
  - *The bucket name must not contain uppercase characters.*
  - *The bucket name must comply with DNS naming conventions.*
  - *The bucket name length must be from 3 to 63 characters.*
- When displaying a server error, the alert title should state the problem, and the description should describe how the user can resolve the problem.  

  - For example:    

    - Title: *Object versions were not retrieved for the title*
    - Description: *You might not have permissions to retrieve object versions. Contact your account administrator to request necessary permissions*
- Follow the writing guidelines for [alert](/components/alert/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- For the respective parts of the S3 resource selector, reference the alternative text guidelines for [alert](/components/alert/index.html.md)   , [breadcrumbs](/components/breadcrumb-group/index.html.md)   , [modal](/components/modal/index.html.md)   , [table](/components/table/index.html.md)   , and [pagination](/components/pagination/index.html.md)  .

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
