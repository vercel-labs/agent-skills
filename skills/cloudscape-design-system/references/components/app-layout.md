---
scraped_at: '2026-04-20T08:46:38+00:00'
section: components
source_url: https://cloudscape.design/components/app-layout/index.html.md
title: App layout
---

# App layout

Provides page structure for general use cases, which offers collapsible side navigation, tools panel, drawers, and split panel.

 [Get design library](/get-started/for-designers/design-resources/index.html.md) [Browse code](https://github.com/cloudscape-design/components/tree/main/src/app-layout)
The API properties for this component are found here: [API Properties](https://cloudscape.design/components/app-layout/index.html.json)

## Development guidelines

You can use this basic layout component for applications with navigation, content areas, and tools or help panel.

If your application has a custom header or footer, you need to specify their selectors via `headerSelector` and `footerSelector` properties respectively. These selectors are used to ensure that the AppLayout position doesn't overlap the header and footer elements. The app layout component only supports sticky header and footer, you need to ensure that your custom header uses `position: sticky` CSS.

#### Usage with routing

Many app layout properties are different between pages (for example, `contentType` , `splitPanel,` or `tools` ). When using app layout with a client-side router in your project (for example, react-router), our team recommends that you put individual app layout instances per route. See [this example](https://github.com/cloudscape-design/demos/blob/main/src/pages/onboarding/index.tsx) for a possible code structure.

If your team can't use individual app layout instances per route, make sure to reset the following properties when changing pages: `contentType` , `disableContentPaddings` , `maxContentWidth` , `minContentWidth` , `splitPanelOpen` , `splitPanel`.

#### State management

If you want to control the state of the navigation, tools, or split panels, you need to explicitly set the properties and the corresponding event listeners.

- For the navigation panel, set the `navigationOpen`   property and `onNavigationChange`   event listener. If you are using the navigation panel in a controlled manner, make sure to call the `closeNavigationIfNecessary`   function on the initial page load, page resize, and any future navigation actions. Calling this function closes the navigation drawer if it is necessary for the current viewport size.
- For the tools panel, set the `toolsOpen`   property and `onToolsChange`   event listener.
- For drawers, set the `activeDrawerId`   property and `onDrawerChange`   event listener.
- If you are using the split panel component in the `splitPanel`   slot and you want to control its visibility, size and preferences  

  - Set the `splitPanelOpen`     property and `onSplitPanelToggle`     event listener.
  - Set the `splitPanelSize`     property and the `onSplitPanelResize`     listener.
  - Set the `splitPanelPreferences`     property and the `onSplitPanelPreferencesChange`     listener.

Panels are independent, you can control the state of only one of them or more.

Learn more about the [state management](/get-started/dev-guides/state-management/index.html.md) of Cloudscape components.

When used with the [content layout](/components/content-layout/index.html.md) , we recommend to disable app layout content paddings ( `disableContentPaddings=true` ) and set content layout `defaultPadding` property to `true` . Note that proper padding is applied only when both components are part of the same React application.

If you are new to test utility classes, you can learn more in the [introduction article](/get-started/testing/introduction/index.html.md).
## Unit testing examples

Selecting app layout
```
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import AppLayout from '@cloudscape-design/components/app-layout';

describe('<AppLayout />', () => {
  it('renders the app-layout component', () => {
    const { container } = render(<AppLayout />);
    const wrapper = createWrapper(container);

    expect(wrapper.findAppLayout()).toBeTruthy();
  });

  it('selects all app-layout components', () => {
    const { container } = render(<>
      <AppLayout />
      <AppLayout />
      <AppLayout />
    </>);
    const wrapper = createWrapper(container);

    const components = wrapper.findAllAppLayouts();
    expect(components).toHaveLength(3)
  });
});
```

Navigating to a link from the sidebar
```
import AppLayout from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import SideNavigation, { SideNavigationProps } from '@cloudscape-design/components/side-navigation';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const navigationItems: SideNavigationProps['items'] = [
  { type: 'link', text: `Page #1`, href: `#/page-1` },
  { type: 'link', text: `Page #2`, href: `#/page-2` },
];

function Component() {
  const [currentPath, setCurrentPath] = useState('/');
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  function getContent() {
    switch (currentPath) {
      case '#/page-1':
        return <ContentLayout>Page 1</ContentLayout>;
      case '#/page-2':
        return <ContentLayout>Page 2</ContentLayout>;
      default:
        return <ContentLayout>404</ContentLayout>;
    }
  }

  return (
    <AppLayout
      navigationOpen={isNavigationOpen}
      onNavigationChange={({ detail }) => setIsNavigationOpen(detail.open)}
      navigation={
        <SideNavigation
          header={{
            href: currentPath,
            text: 'Service name',
          }}
          onFollow={({ detail }) => setCurrentPath(detail.href)}
          items={navigationItems}
        />
      }
      content={getContent()}
    />
  );
}

describe('<AppLayout />', () => {
  it('opens the navigation and navigates to the second page', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);
    const appLayout = wrapper.findAppLayout()!;

    appLayout.findNavigationToggle()!.click();
    appLayout.findOpenNavigationPanel()!.findSideNavigation()!.findLinkByHref('#/page-2')!.click();
    const content = appLayout.findContentRegion().findContentLayout()!.findContent();

    expect(content.getElement()!.textContent).toBe('Page 2');
  });
});
```

Opening the drawers
```
import AppLayout, { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import createWrapper from '@cloudscape-design/components/test-utils/dom';

import { render } from '@testing-library/react';
import React, { useState } from 'react';

const drawers: AppLayoutProps['drawers'] = [
  {
    content: 'Drawer 1',
    id: 'drawer-1',
    ariaLabels: {
      drawerName: 'drawer 1',
    },
    trigger: {
      iconName: 'settings',
    },
  },
  {
    content: 'Drawer 2',
    id: 'drawer-2',
    ariaLabels: {
      drawerName: 'drawer 2',
    },
    trigger: {
      iconName: 'security',
    },
  },
];

function Component() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);

  return (
    <AppLayout
      activeDrawerId={activeDrawerId}
      onDrawerChange={({ detail }) => setActiveDrawerId(detail.activeDrawerId)}
      drawers={drawers}
      content={<ContentLayout>Active drawer id: {activeDrawerId}</ContentLayout>}
    />
  );
}

describe('<AppLayout />', () => {
  it('opens the side drawer and finds its text content', async () => {
    const { container } = render(<Component />);
    const wrapper = createWrapper(container);
    const appLayout = wrapper.findAppLayout()!;

    appLayout.findDrawersOverflowTrigger()!.openDropdown();
    appLayout.findDrawersOverflowTrigger()!.findItemById('drawer-2')!.click();

    const activeDrawerTextContent = appLayout.findActiveDrawer()!.getElement().textContent;
    const appLayoutTextContent = appLayout.findContentRegion().getElement().textContent;

    expect(activeDrawerTextContent).toBe('Drawer 2');
    expect(appLayoutTextContent).toBe('Active drawer id: drawer-2');
  });
});
```

## Unit testing APIs

AppLayoutWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActiveDrawer | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findActiveDrawerCloseButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> &#124; null | - | - |
| findActiveDrawerResizeHandle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findBreadcrumbs | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findContentRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findDrawersOverflowTrigger | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) &#124; null | - | - |
| findDrawersTriggers | Array<[ElementWrapper](/index.html.md)> | - | - |
| findDrawerTriggerById | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> &#124; null | Finds a drawer trigger by the given id. | id:id of the trigger to findoptions:* hasBadge (boolean) - If provided, only finds drawers with the badge or without badge respectively |
| findDrawerTriggerTooltip | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findNavigation | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findNavigationClose | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> | - | - |
| findNavigationToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> | - | - |
| findNotifications | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findOpenNavigationPanel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findOpenToolsPanel | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findSplitPanel | [SplitPanelWrapper](/components/split-panel/index.html.md) &#124; null | - | - |
| findSplitPanelOpenButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findToolbar | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> &#124; null | - | - |
| findTools | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLElement> | - | - |
| findToolsClose | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> | - | - |
| findToolsToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<HTMLButtonElement> | - | - |
## Integration testing APIs

AppLayoutWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| findActiveDrawer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findActiveDrawerCloseButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findActiveDrawerResizeHandle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findBreadcrumbs | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findContentRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findDrawersOverflowTrigger | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) | - | - |
| findDrawersTriggers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | - |
| findDrawerTriggerById | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds a drawer trigger by the given id. | id:id of the trigger to findoptions:* hasBadge (boolean) - If provided, only finds drawers with the badge or without badge respectively |
| findDrawerTriggerTooltip | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNavigation | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNavigationClose | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNavigationToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findNotifications | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOpenNavigationPanel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findOpenToolsPanel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findSplitPanel | [SplitPanelWrapper](/components/split-panel/index.html.md) | - | - |
| findSplitPanelOpenButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findToolbar | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findTools | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findToolsClose | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
| findToolsToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | - |
## General guidelines

### Do

- Only use one type of app layout in a product.
- Use this app layout for general use cases that don't require high levels of information density. For more help choosing the application layout that best supports your use case, follow the guidelines for [layout](/foundation/visual-foundation/layout/index.html.md)  .
- Arrange your content in a coherent hierarchy and follow the grid and column layout rules.

### Don't

- When you're adding or removing flashbars, don't actively change the content scrolling position.
- Don't nest app layouts.

## Features

- #### Navigation

  Use the navigation panel region for the [side navigation](/components/side-navigation/index.html.md)   . The panel can be open, closed, or hidden.  

  - When opened, a user can close the panel with the angle-left icon button in the upper-right corner.
  - When closed, a user can open the panel with the trigger with menu icon.

  The default state (open or closed) depends on the main content type and the initial viewport size.  

  - The side navigation is closed by default on the homepage (for first time users), [forms](/components/form/index.html.md)     , and [wizards](/components/wizard/index.html.md)    .
  - In all other pages the side navigation is open by default on desktop viewports.
  - The side navigation is always closed by default for mobile viewports.
- #### Content header

  The content header is for page level title and actions. This slot has been deprecated and replaced by the `header`   slot of the [content layout](/components/content-layout/index.html.md)   component.
- #### Content

  The content area is the main content of the page, where users focus their attention the most. For most pages, it has a fixed max-width. For some content-heavy patterns, including [full-page table](/patterns/resource-management/view/table-view/index.html.md)   and [cards](/patterns/resource-management/view/card-view/index.html.md)   , or unique use-cases such as a canvas layout or a full-page task board, the content area should take up 100% of the available space.  

  The predefined content types are:  

  - Dashboard - any page using a multi-column [dashboard](/patterns/general/service-dashboard/index.html.md)     pattern.
  - Form - any page using a [form](/components/form/index.html.md)     component, such as [single-page create](/patterns/resource-management/create/single-page-create/index.html.md)     and [edit](/patterns/resource-management/edit/index.html.md)     patterns.
  - Table or Cards - any page using the [full-page table](/patterns/resource-management/view/table-view/index.html.md)     or [full-page cards](/patterns/resource-management/view/card-view/index.html.md)     pattern.
  - Wizard - any page using a [wizard](/components/wizard/index.html.md)     component or [multi-page create](/patterns/resource-management/create/multi-page-create/index.html.md)     pattern.
  - Default - any page that doesn't fall into one of the above categories, such as [dashboards](/patterns/general/service-dashboard/index.html.md)     , [resource details](/patterns/resource-management/details/index.html.md)     , and other custom layouts. These pages are typically constructed using a [page header](/components/header/index.html.md)     and a content-level [grid](/components/grid/index.html.md)     component that wraps all page elements.

  The type of content determines the default state of the navigation panel, as well as max content width for some pages including table, cards, and dashboard.
- #### Notifications

  The notifications area is a dedicated section at the top of a page that displays notifications such as [flashbars](/components/flashbar/index.html.md)   . This area can be sticky or non-sticky. When sticky, all notifications stay at the top of the page, no matter the user's scrolling position.  

  - For mobile viewports, the sticky feature is off.
  - Follow the guidelines for [sticky flashbar](/components/flashbar/index.html.md)    .

  Use the high-contrast `headerVariant`   to apply a dark visual context to the header. The component displays a dark header background and adjusts the color of elements inside to meet color contrast.
- #### Breadcrumbs

  The breadcrumbs area is a dedicated section at the top of a page that displays [breadcrumbs](/components/breadcrumb-group/index.html.md)  .  

  Use the high-contrast `headerVariant`   to apply a dark visual context to the header. The component displays a dark header background and adjusts the color of elements inside to meet color contrast.
- #### Tools

  Use the tools region to implement the [help panel](/components/help-panel/index.html.md)   and the [tutorial panel](/components/tutorial-panel/index.html.md)   . Panels can be open, closed, or hidden. Set the help panel as closed by default, except if a tutorial panel is implemented.  

  - When opened, a user can close the panels with the angle-right icon button in the upper-right corner. The panel can also be closed with the trigger with status-info icon.
  - When closed, a user can open the panels with the trigger with status-info icon. The help panel can also be opened with an [info link](/components/link/index.html.md)     in the content area.
- #### Drawers

  Use drawers to implement panels for supplementary task completion or feature access. Drawers can be open or closed by default on desktop viewports depending on your use-case. Drawers should be closed on mobile viewports by default. Follow the guidelines for [secondary panels](/patterns/general/secondary-panels/index.html.md)  .  

  Each drawer is represented by an icon hosted in the trigger bar on the upper right-hand side of the AppLayout.  

  - When opened, a user can close the drawer with the close button in the upper-right corner, or by clicking on the icon in the trigger bar.
  - When closed, a user can open each drawer with its corresponding trigger button.
  - Use the optional trigger badge to indicate a state change on the drawer, such as signifying new messages or updated content. A visual indicator will be displayed on the drawer icon.
  - When possible, use a commonly-identified icon for custom drawers. For example, a contact icon for chat, or notification icon for notifications. Follow the guidelines for [iconography](/foundation/visual-foundation/iconography/index.html.md)    .
- #### Split panel

  Use the `splitPanel`   region to implement the [split panel](/components/split-panel/index.html.md)   on a [split view](/patterns/resource-management/view/split-view/index.html.md)   . The split panel can be open, closed, or hidden. Set the split panel as closed by default.  
  There are two possible positions:  

  - **Split panel in side position**    

    - Users can close the side panel with the angle-right icon button in the upper-right corner. Additionally, the side panel can also be closed using the trigger with view-vertical icon.
    - Users can open the side panel with the trigger with view-vertical icon.
  - **Split panel in bottom position**    

    - Users can close the bottom panel with the angle-down icon button in the upper-right corner.
    - Users can open the bottom panel with the angle-up icon button.

  The side position requires sufficient horizontal space. When there is not enough space, the panel automatically falls back to the bottom position and the "Side" preference becomes disabled. The preference is restored when space becomes available. On mobile, the position is always bottom.  

  When users make a selection within the resource collection, make sure the split panel is open. Follow the guidelines for [split view](/patterns/resource-management/view/split-view/index.html.md)  .

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

- Follow the writing guidelines for [side navigation](/components/side-navigation/index.html.md)   , [help panel](/components/help-panel/index.html.md)   , [split panel](/components/split-panel/index.html.md)   and [drawer](/components/drawer/index.html.md)  .

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Component-specific guidelines

#### Alternative text

- Set the side nav and tools button labels using the `labels`   app layout property corresponding to the language context.
- Provide alternative text for the help panel icon and info links that trigger the help panel.  

  - For example: *Open help*
- Provide alternative text for the X close icon and external icons according to the alternative text guidelines.  

  - For example: *Close help*

#### ARIA live regions

- The notifications region does not come with an `aria-live`   region because it might contain flash messages of varying severities. Refer to the [alerts and flashbars focus management guidelines](/foundation/core-principles/accessibility/focus-management-principles/index.html.md)   for more information on how to announce these updates.

## Component Documentation and API

[All Components](https://cloudscape.design/components/index.html.md) ([API](https://cloudscape.design/components/index.html.json))
