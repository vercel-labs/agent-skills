---
scraped_at: '2026-04-20T08:51:19+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/testing/core-classes/index.html.md
title: Testing classes
---

# Testing classes

API documentation for test utilities classes.

## Overview

This article contains the API documentation for Cloudscape test utilities classes. These utilities don't depend on the specific component you're testing. For information about how to use these core classes in your tests, see [introduction to testing](/get-started/testing/introduction/index.html.md).

Test utilities expose two classes:

- An element wrapper for unit tests, where you typically have direct access to the Document Object Model (DOM).
- An element wrapper for integration tests, where it's typical to rely on string selectors.

## Unit Testing

The entry point for unit tests is the default method exposed by the `@cloudscape-design/components/test-utils/dom` package. This method returns an instance of `ElementWrapper` . The following table describes the class interface.

For more information and examples for unit testing with Cloudscape, see [introduction to testing](/get-started/testing/introduction/index.html.md).

ElementWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| blur | - | - | - |
| click | - | Performs a click by triggering a mouse event.Note that programmatic events ignore disabled attribute and will trigger listeners even if the element is disabled. | params: |
| find | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<NewElementType> &#124; null | - | selector: |
| findAlert | [AlertWrapper](/components/alert/index.html.md) | Finds a Alert component | selector: |
| findAll | Array<[ElementWrapper](/index.html.md)> | - | selector: |
| findAllAlerts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AlertWrapper](/index.html.md)> | Finds all Alert components | selector: |
| findAllAnchorNavigations | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AnchorNavigationWrapper](/index.html.md)> | Finds all AnchorNavigation components | selector: |
| findAllAppLayouts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AppLayoutWrapper](/index.html.md)> | Finds all AppLayout components | selector: |
| findAllAreaCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AreaChartWrapper](/index.html.md)> | Finds all AreaChart components | selector: |
| findAllAttributeEditors | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AttributeEditorWrapper](/index.html.md)> | Finds all AttributeEditor components | selector: |
| findAllAutosuggests | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AutosuggestWrapper](/index.html.md)> | Finds all Autosuggest components | selector: |
| findAllAvatars | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AvatarWrapper](/index.html.md)> | Finds all Avatar components | selector: |
| findAllBadges | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BadgeWrapper](/index.html.md)> | Finds all Badge components | selector: |
| findAllBarCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BarChartWrapper](/index.html.md)> | Finds all BarChart components | selector: |
| findAllBoardItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BoardItemWrapper](/index.html.md)> | Finds all BoardItem components | selector: |
| findAllBoards | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BoardWrapper](/index.html.md)> | Finds all Board components | selector: |
| findAllBoxes | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BoxWrapper](/index.html.md)> | Finds all Box components | selector: |
| findAllBreadcrumbGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BreadcrumbGroupWrapper](/index.html.md)> | Finds all BreadcrumbGroup components | selector: |
| findAllButtonDropdowns | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ButtonDropdownWrapper](/index.html.md)> | Finds all ButtonDropdown components | selector: |
| findAllButtonGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ButtonGroupWrapper](/index.html.md)> | Finds all ButtonGroup components | selector: |
| findAllButtons | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ButtonWrapper](/index.html.md)> | Finds all Button components | selector: |
| findAllByClassName | Array<[ElementWrapper](/index.html.md)> | - | className: |
| findAllCalendars | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CalendarWrapper](/index.html.md)> | Finds all Calendar components | selector: |
| findAllCards | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CardsWrapper](/index.html.md)> | Finds all Cards components | selector: |
| findAllChatBubbles | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ChatBubbleWrapper](/index.html.md)> | Finds all ChatBubble components | selector: |
| findAllCheckboxes | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CheckboxWrapper](/index.html.md)> | Finds all Checkbox components | selector: |
| findAllCodeEditors | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CodeEditorWrapper](/index.html.md)> | Finds all CodeEditor components | selector: |
| findAllCodeViews | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CodeViewWrapper](/index.html.md)> | Finds all CodeView components | selector: |
| findAllCollectionPreferences | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CollectionPreferencesWrapper](/index.html.md)> | Finds all CollectionPreferences components | selector: |
| findAllColumnLayouts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ColumnLayoutWrapper](/index.html.md)> | Finds all ColumnLayout components | selector: |
| findAllComponents | Array<[Wrapper](/index.html.md)> | Returns the wrappers of all components that match the specified component type and the specified CSS selector.If no CSS selector is specified, returns all of the components that match the specified component type.If no matching component is found, returns an empty array. | ComponentClass:Component's wrapper classselector:CSS selector |
| findAllContainers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ContainerWrapper](/index.html.md)> | Finds all Container components | selector: |
| findAllContentLayouts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ContentLayoutWrapper](/index.html.md)> | Finds all ContentLayout components | selector: |
| findAllCopyToClipboards | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CopyToClipboardWrapper](/index.html.md)> | Finds all CopyToClipboard components | selector: |
| findAllDateInputs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[DateInputWrapper](/index.html.md)> | Finds all DateInput components | selector: |
| findAllDatePickers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[DatePickerWrapper](/index.html.md)> | Finds all DatePicker components | selector: |
| findAllDateRangePickers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[DateRangePickerWrapper](/index.html.md)> | Finds all DateRangePicker components | selector: |
| findAllDrawers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[DrawerWrapper](/index.html.md)> | Finds all Drawer components | selector: |
| findAllExpandableSections | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ExpandableSectionWrapper](/index.html.md)> | Finds all ExpandableSection components | selector: |
| findAllFileUploads | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FileUploadWrapper](/index.html.md)> | Finds all FileUpload components | selector: |
| findAllFlashbars | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FlashbarWrapper](/index.html.md)> | Finds all Flashbar components | selector: |
| findAllFormFields | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FormFieldWrapper](/index.html.md)> | Finds all FormField components | selector: |
| findAllForms | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FormWrapper](/index.html.md)> | Finds all Form components | selector: |
| findAllGrids | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[GridWrapper](/index.html.md)> | Finds all Grid components | selector: |
| findAllHeaders | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[HeaderWrapper](/index.html.md)> | Finds all Header components | selector: |
| findAllHelpPanels | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[HelpPanelWrapper](/index.html.md)> | Finds all HelpPanel components | selector: |
| findAllHotspots | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[HotspotWrapper](/index.html.md)> | Finds all Hotspot components | selector: |
| findAllIcons | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[IconWrapper](/index.html.md)> | Finds all Icon components | selector: |
| findAllInputs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[InputWrapper](/index.html.md)> | Finds all Input components | selector: |
| findAllItemsPalettes | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ItemsPaletteWrapper](/index.html.md)> | Finds all ItemsPalette components | selector: |
| findAllKeyValuePairs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[KeyValuePairsWrapper](/index.html.md)> | Finds all KeyValuePairs components | selector: |
| findAllLineCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[LineChartWrapper](/index.html.md)> | Finds all LineChart components | selector: |
| findAllLinks | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[LinkWrapper](/index.html.md)> | Finds all Link components | selector: |
| findAllLiveRegions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[LiveRegionWrapper](/index.html.md)> | Finds all LiveRegion components | selector: |
| findAllLoadingBars | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[LoadingBarWrapper](/index.html.md)> | Finds all LoadingBar components | selector: |
| findAllMixedLineBarCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[MixedLineBarChartWrapper](/index.html.md)> | Finds all MixedLineBarChart components | selector: |
| findAllModals | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ModalWrapper](/index.html.md)> | Finds all Modal components | selector: |
| findAllMultiselects | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[MultiselectWrapper](/index.html.md)> | Finds all Multiselect components | selector: |
| findAllPaginations | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PaginationWrapper](/index.html.md)> | Finds all Pagination components | selector: |
| findAllPieCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PieChartWrapper](/index.html.md)> | Finds all PieChart components | selector: |
| findAllPieCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PieChartWrapper](/index.html.md)> | Finds all PieChart components | selector: |
| findAllPopovers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PopoverWrapper](/index.html.md)> | Finds all Popover components | selector: |
| findAllProgressBars | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ProgressBarWrapper](/index.html.md)> | Finds all ProgressBar components | selector: |
| findAllPromptInputs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PromptInputWrapper](/index.html.md)> | Finds all PromptInput components | selector: |
| findAllPropertyFilters | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PropertyFilterWrapper](/index.html.md)> | Finds all PropertyFilter components | selector: |
| findAllRadioGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[RadioGroupWrapper](/index.html.md)> | Finds all RadioGroup components | selector: |
| findAllS3ResourceSelectors | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[S3ResourceSelectorWrapper](/index.html.md)> | Finds all S3ResourceSelector components | selector: |
| findAllSegmentedControls | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SegmentedControlWrapper](/index.html.md)> | Finds all SegmentedControl components | selector: |
| findAllSelects | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SelectWrapper](/index.html.md)> | Finds all Select components | selector: |
| findAllSideNavigations | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SideNavigationWrapper](/index.html.md)> | Finds all SideNavigation components | selector: |
| findAllSliders | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SliderWrapper](/index.html.md)> | Finds all Slider components | selector: |
| findAllSpaceBetweens | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SpaceBetweenWrapper](/index.html.md)> | Finds all SpaceBetween components | selector: |
| findAllSpinners | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SpinnerWrapper](/index.html.md)> | Finds all Spinner components | selector: |
| findAllSplitPanels | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SplitPanelWrapper](/index.html.md)> | Finds all SplitPanel components | selector: |
| findAllStatusIndicators | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[StatusIndicatorWrapper](/index.html.md)> | Finds all StatusIndicator components | selector: |
| findAllSteps | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[StepsWrapper](/index.html.md)> | Finds all Steps components | selector: |
| findAllSupportPromptGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SupportPromptGroupWrapper](/index.html.md)> | Finds all SupportPromptGroup components | selector: |
| findAllTables | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TableWrapper](/index.html.md)> | Finds all Table components | selector: |
| findAllTabs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TabsWrapper](/index.html.md)> | Finds all Tabs components | selector: |
| findAllTagEditors | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TagEditorWrapper](/index.html.md)> | Finds all TagEditor components | selector: |
| findAllTextContents | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TextContentWrapper](/index.html.md)> | Finds all TextContent components | selector: |
| findAllTextFilters | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TextFilterWrapper](/index.html.md)> | Finds all TextFilter components | selector: |
| findAllTextareas | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TextareaWrapper](/index.html.md)> | Finds all Textarea components | selector: |
| findAllTiles | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TilesWrapper](/index.html.md)> | Finds all Tiles components | selector: |
| findAllTimeInputs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TimeInputWrapper](/index.html.md)> | Finds all TimeInput components | selector: |
| findAllToggleButtons | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ToggleButtonWrapper](/index.html.md)> | Finds all ToggleButton components | selector: |
| findAllToggles | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ToggleWrapper](/index.html.md)> | Finds all Toggle components | selector: |
| findAllTokenGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TokenGroupWrapper](/index.html.md)> | Finds all TokenGroup components | selector: |
| findAllTopNavigations | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TopNavigationWrapper](/index.html.md)> | Finds all TopNavigation components | selector: |
| findAllTreeViews | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TreeViewWrapper](/index.html.md)> | Finds all TreeView components | selector: |
| findAllTutorialPanels | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TutorialPanelWrapper](/index.html.md)> | Finds all TutorialPanel components | selector: |
| findAllWizards | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[WizardWrapper](/index.html.md)> | Finds all Wizard components | selector: |
| findAnchorNavigation | [AnchorNavigationWrapper](/components/anchor-navigation/index.html.md) | Finds a AnchorNavigation component | selector: |
| findAnnotationContext | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds a AnnotationContext component | selector: |
| findAny | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<NewElementType> &#124; null | - | selectors: |
| findAppLayout | [AppLayoutWrapper](/components/app-layout/index.html.md) | Finds a AppLayout component | selector: |
| findAppLayoutToolbar | [AppLayoutToolbarWrapper](/components/app-layout-toolbar/index.html.md) | Finds a AppLayoutToolbar component | selector: |
| findAreaChart | [AreaChartWrapper](/components/area-chart/index.html.md) | Finds a AreaChart component | selector: |
| findAttributeEditor | [AttributeEditorWrapper](/components/attribute-editor/index.html.md) | Finds a AttributeEditor component | selector: |
| findAutosuggest | [AutosuggestWrapper](/components/autosuggest/index.html.md) | Finds a Autosuggest component | selector: |
| findAvatar | [AvatarWrapper](/components/avatar/index.html.md) | Finds a Avatar component | selector: |
| findBadge | [BadgeWrapper](/components/badge/index.html.md) | Finds a Badge component | selector: |
| findBarChart | [BarChartWrapper](/components/bar-chart/index.html.md) | Finds a BarChart component | selector: |
| findBoard | [BoardWrapper](/components/board/index.html.md) | Finds a Board component | selector: |
| findBoardItem | [BoardItemWrapper](/components/board-item/index.html.md) | Finds a BoardItem component | selector: |
| findBox | [BoxWrapper](/components/box/index.html.md) | Finds a Box component | selector: |
| findBreadcrumbGroup | [BreadcrumbGroupWrapper](/components/breadcrumb-group/index.html.md) | Finds a BreadcrumbGroup component | selector: |
| findButton | [ButtonWrapper](/components/button/index.html.md) | Finds a Button component | selector: |
| findButtonDropdown | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) | Finds a ButtonDropdown component | selector: |
| findButtonGroup | [ButtonGroupWrapper](/components/button-group/index.html.md) | Finds a ButtonGroup component | selector: |
| findByClassName | [ElementWrapper](/get-started/testing/core-classes/index.html.md)<NewElementType> &#124; null | - | className: |
| findCalendar | [CalendarWrapper](/components/calendar/index.html.md) | Finds a Calendar component | selector: |
| findCards | [CardsWrapper](/components/cards/index.html.md) | Finds a Cards component | selector: |
| findCartesianHighcharts | [CartesianChartWrapper](/components/cartesian-chart/index.html.md) | Finds a CartesianChart component | selector: |
| findChatBubble | [ChatBubbleWrapper](/components/chat-bubble/index.html.md) | Finds a ChatBubble component | selector: |
| findCheckbox | [CheckboxWrapper](/components/checkbox/index.html.md) | Finds a Checkbox component | selector: |
| findClosestAlert | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Alert | - |
| findClosestAnchorNavigation | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent AnchorNavigation | - |
| findClosestAnnotationContext | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent AnnotationContext | - |
| findClosestAppLayout | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent AppLayout | - |
| findClosestAppLayoutToolbar | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent AppLayoutToolbar | - |
| findClosestAreaChart | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent AreaChart | - |
| findClosestAttributeEditor | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent AttributeEditor | - |
| findClosestAutosuggest | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Autosuggest | - |
| findClosestAvatar | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Avatar | - |
| findClosestBadge | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Badge | - |
| findClosestBarChart | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent BarChart | - |
| findClosestBoard | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Board | - |
| findClosestBoardItem | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent BoardItem | - |
| findClosestBox | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Box | - |
| findClosestBreadcrumbGroup | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent BreadcrumbGroup | - |
| findClosestButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Button | - |
| findClosestButtonDropdown | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent ButtonDropdown | - |
| findClosestButtonGroup | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent ButtonGroup | - |
| findClosestCalendar | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Calendar | - |
| findClosestCards | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Cards | - |
| findClosestCartesianChart | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent CartesianChart | - |
| findClosestChatBubble | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent ChatBubble | - |
| findClosestCheckbox | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Checkbox | - |
| findClosestCodeEditor | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent CodeEditor | - |
| findClosestCodeView | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent CodeView | - |
| findClosestCollectionPreferences | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent CollectionPreferences | - |
| findClosestColumnLayout | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent ColumnLayout | - |
| findClosestComponent | [Wrapper](/index.html.md) &#124; null | Returns the closest ancestor element (or self) that matches the specified component type.If no matching component is found, returns null. | ComponentClass:Component's wrapper class |
| findClosestContainer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Container | - |
| findClosestContentLayout | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent ContentLayout | - |
| findClosestCopyToClipboard | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent CopyToClipboard | - |
| findClosestDateInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent DateInput | - |
| findClosestDatePicker | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent DatePicker | - |
| findClosestDateRangePicker | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent DateRangePicker | - |
| findClosestDrawer | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Drawer | - |
| findClosestErrorBoundary | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent ErrorBoundary | - |
| findClosestExpandableSection | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent ExpandableSection | - |
| findClosestFileDropzone | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent FileDropzone | - |
| findClosestFileInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent FileInput | - |
| findClosestFileTokenGroup | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent FileTokenGroup | - |
| findClosestFileUpload | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent FileUpload | - |
| findClosestFlashbar | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Flashbar | - |
| findClosestForm | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Form | - |
| findClosestFormField | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent FormField | - |
| findClosestGrid | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Grid | - |
| findClosestHeader | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Header | - |
| findClosestHelpPanel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent HelpPanel | - |
| findClosestHotspot | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Hotspot | - |
| findClosestIcon | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Icon | - |
| findClosestInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Input | - |
| findClosestItemCard | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent ItemCard | - |
| findClosestItemsPalette | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent ItemsPalette | - |
| findClosestKeyValuePairs | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent KeyValuePairs | - |
| findClosestLineChart | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent LineChart | - |
| findClosestLink | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Link | - |
| findClosestList | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent List | - |
| findClosestLiveRegion | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent LiveRegion | - |
| findClosestLoadingBar | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent LoadingBar | - |
| findClosestMixedLineBarChart | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent MixedLineBarChart | - |
| findClosestModal | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Modal | - |
| findClosestMultiselect | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Multiselect | - |
| findClosestPagination | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Pagination | - |
| findClosestPanelLayout | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent PanelLayout | - |
| findClosestPieChart | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent PieChart | - |
| findClosestPieChart | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent PieChart | - |
| findClosestPopover | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Popover | - |
| findClosestProgressBar | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent ProgressBar | - |
| findClosestPromptInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent PromptInput | - |
| findClosestPropertyFilter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent PropertyFilter | - |
| findClosestRadioGroup | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent RadioGroup | - |
| findClosestS3ResourceSelector | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent S3ResourceSelector | - |
| findClosestSegmentedControl | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent SegmentedControl | - |
| findClosestSelect | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Select | - |
| findClosestSideNavigation | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent SideNavigation | - |
| findClosestSlider | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Slider | - |
| findClosestSpaceBetween | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent SpaceBetween | - |
| findClosestSpinner | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Spinner | - |
| findClosestSplitPanel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent SplitPanel | - |
| findClosestStatusIndicator | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent StatusIndicator | - |
| findClosestSteps | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Steps | - |
| findClosestSupportPromptGroup | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent SupportPromptGroup | - |
| findClosestTable | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Table | - |
| findClosestTabs | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Tabs | - |
| findClosestTagEditor | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent TagEditor | - |
| findClosestTextContent | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent TextContent | - |
| findClosestTextFilter | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent TextFilter | - |
| findClosestTextarea | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Textarea | - |
| findClosestTiles | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Tiles | - |
| findClosestTimeInput | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent TimeInput | - |
| findClosestToggle | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Toggle | - |
| findClosestToggleButton | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent ToggleButton | - |
| findClosestToken | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Token | - |
| findClosestTokenGroup | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent TokenGroup | - |
| findClosestTopNavigation | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent TopNavigation | - |
| findClosestTreeView | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent TreeView | - |
| findClosestTutorialPanel | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent TutorialPanel | - |
| findClosestWizard | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds the closest parent Wizard | - |
| findCodeEditor | [CodeEditorWrapper](/components/code-editor/index.html.md) | Finds a CodeEditor component | selector: |
| findCodeView | [CodeViewWrapper](/components/code-view/index.html.md) | Finds a CodeView component | selector: |
| findCollectionPreferences | [CollectionPreferencesWrapper](/components/collection-preferences/index.html.md) | Finds a CollectionPreferences component | selector: |
| findColumnLayout | [ColumnLayoutWrapper](/components/column-layout/index.html.md) | Finds a ColumnLayout component | selector: |
| findComponent | [Wrapper](/index.html.md) &#124; null | Returns the component wrapper matching the specified selector.If the specified selector doesn't match any element, it returns null.Note: This function returns the specified component's wrapper even if the specified selector points to a different component type. | selector:CSS selectorComponentClass:Component's wrapper class |
| findContainer | [ContainerWrapper](/components/container/index.html.md) | Finds a Container component | selector: |
| findContentLayout | [ContentLayoutWrapper](/components/content-layout/index.html.md) | Finds a ContentLayout component | selector: |
| findCopyToClipboard | [CopyToClipboardWrapper](/components/copy-to-clipboard/index.html.md) | Finds a CopyToClipboard component | selector: |
| findDateInput | [DateInputWrapper](/components/date-input/index.html.md) | Finds a DateInput component | selector: |
| findDatePicker | [DatePickerWrapper](/components/date-picker/index.html.md) | Finds a DatePicker component | selector: |
| findDateRangePicker | [DateRangePickerWrapper](/components/date-range-picker/index.html.md) | Finds a DateRangePicker component | selector: |
| findDrawer | [DrawerWrapper](/components/drawer/index.html.md) | Finds a Drawer component | selector: |
| findErrorBoundary | [ErrorBoundaryWrapper](/components/error-boundary/index.html.md) | Finds a ErrorBoundary component | selector: |
| findExpandableSection | [ExpandableSectionWrapper](/components/expandable-section/index.html.md) | Finds a ExpandableSection component | selector: |
| findFileDropzone | [FileDropzoneWrapper](/components/file-dropzone/index.html.md) | Finds a FileDropzone component | selector: |
| findFileInput | [FileInputWrapper](/components/file-input/index.html.md) | Finds a FileInput component | selector: |
| findFileTokenGroup | [FileTokenGroupWrapper](/components/file-token-group/index.html.md) | Finds a FileTokenGroup component | selector: |
| findFileUpload | [FileUploadWrapper](/components/file-upload/index.html.md) | Finds a FileUpload component | selector: |
| findFlashbar | [FlashbarWrapper](/components/flashbar/index.html.md) | Finds a Flashbar component | selector: |
| findForm | [FormWrapper](/components/form/index.html.md) | Finds a Form component | selector: |
| findFormField | [FormFieldWrapper](/components/form-field/index.html.md) | Finds a FormField component | selector: |
| findGrid | [GridWrapper](/components/grid/index.html.md) | Finds a Grid component | selector: |
| findHeader | [HeaderWrapper](/components/header/index.html.md) | Finds a Header component | selector: |
| findHelpPanel | [HelpPanelWrapper](/components/help-panel/index.html.md) | Finds a HelpPanel component | selector: |
| findHotspot | [HotspotWrapper](/components/hotspot/index.html.md) | Finds a Hotspot component | selector: |
| findIcon | [IconWrapper](/components/icon/index.html.md) | Finds a Icon component | selector: |
| findInput | [InputWrapper](/components/input/index.html.md) | Finds a Input component | selector: |
| findItemCard | [ItemCardWrapper](/components/item-card/index.html.md) | Finds a ItemCard component | selector: |
| findItemsPalette | [ItemsPaletteWrapper](/components/items-palette/index.html.md) | Finds a ItemsPalette component | selector: |
| findKeyValuePairs | [KeyValuePairsWrapper](/components/key-value-pairs/index.html.md) | Finds a KeyValuePairs component | selector: |
| findLineChart | [LineChartWrapper](/components/line-chart/index.html.md) | Finds a LineChart component | selector: |
| findLink | [LinkWrapper](/components/link/index.html.md) | Finds a Link component | selector: |
| findList | [ListWrapper](/components/list/index.html.md) | Finds a List component | selector: |
| findLiveRegion | [LiveRegionWrapper](/components/live-region/index.html.md) | Finds a LiveRegion component | selector: |
| findLoadingBar | [LoadingBarWrapper](/components/loading-bar/index.html.md) | Finds a LoadingBar component | selector: |
| findMixedLineBarChart | [MixedLineBarChartWrapper](/components/mixed-line-bar-chart/index.html.md) | Finds a MixedLineBarChart component | selector: |
| findModal | [ModalWrapper](/components/modal/index.html.md) | Finds a Modal component | selector: |
| findMultiselect | [MultiselectWrapper](/components/multiselect/index.html.md) | Finds a Multiselect component | selector: |
| findPagination | [PaginationWrapper](/components/pagination/index.html.md) | Finds a Pagination component | selector: |
| findPanelLayout | [PanelLayoutWrapper](/components/panel-layout/index.html.md) | Finds a PanelLayout component | selector: |
| findPieChart | [PieChartWrapper](/components/pie-chart-legacy/index.html.md) | Finds a PieChart component | selector: |
| findPieHighcharts | [PieChartWrapper](/components/pie-chart/index.html.md) | Finds a PieChart component | selector: |
| findPopover | [PopoverWrapper](/components/popover/index.html.md) | Finds a Popover component | selector: |
| findProgressBar | [ProgressBarWrapper](/components/progress-bar/index.html.md) | Finds a ProgressBar component | selector: |
| findPromptInput | [PromptInputWrapper](/components/prompt-input/index.html.md) | Finds a PromptInput component | selector: |
| findPropertyFilter | [PropertyFilterWrapper](/components/property-filter/index.html.md) | Finds a PropertyFilter component | selector: |
| findRadioGroup | [RadioGroupWrapper](/components/radio-group/index.html.md) | Finds a RadioGroup component | selector: |
| findS3ResourceSelector | [S3ResourceSelectorWrapper](/components/s3-resource-selector/index.html.md) | Finds a S3ResourceSelector component | selector: |
| findSegmentedControl | [SegmentedControlWrapper](/components/segmented-control/index.html.md) | Finds a SegmentedControl component | selector: |
| findSelect | [SelectWrapper](/components/select/index.html.md) | Finds a Select component | selector: |
| findSideNavigation | [SideNavigationWrapper](/components/side-navigation/index.html.md) | Finds a SideNavigation component | selector: |
| findSlider | [SliderWrapper](/components/slider/index.html.md) | Finds a Slider component | selector: |
| findSpaceBetween | [SpaceBetweenWrapper](/components/space-between/index.html.md) | Finds a SpaceBetween component | selector: |
| findSpinner | [SpinnerWrapper](/components/spinner/index.html.md) | Finds a Spinner component | selector: |
| findSplitPanel | [SplitPanelWrapper](/components/split-panel/index.html.md) | Finds a SplitPanel component | selector: |
| findStatusIndicator | [StatusIndicatorWrapper](/components/status-indicator/index.html.md) | Finds a StatusIndicator component | selector: |
| findSteps | [StepsWrapper](/components/steps/index.html.md) | Finds a Steps component | selector: |
| findSupportPromptGroup | [SupportPromptGroupWrapper](/components/support-prompt-group/index.html.md) | Finds a SupportPromptGroup component | selector: |
| findTable | [TableWrapper](/components/table/index.html.md) | Finds a Table component | selector: |
| findTabs | [TabsWrapper](/components/tabs/index.html.md) | Finds a Tabs component | selector: |
| findTagEditor | [TagEditorWrapper](/components/tag-editor/index.html.md) | Finds a TagEditor component | selector: |
| findTextContent | [TextContentWrapper](/components/text-content/index.html.md) | Finds a TextContent component | selector: |
| findTextFilter | [TextFilterWrapper](/components/text-filter/index.html.md) | Finds a TextFilter component | selector: |
| findTextarea | [TextareaWrapper](/components/textarea/index.html.md) | Finds a Textarea component | selector: |
| findTiles | [TilesWrapper](/components/tiles/index.html.md) | Finds a Tiles component | selector: |
| findTimeInput | [TimeInputWrapper](/components/time-input/index.html.md) | Finds a TimeInput component | selector: |
| findToggle | [ToggleWrapper](/components/toggle/index.html.md) | Finds a Toggle component | selector: |
| findToggleButton | [ToggleButtonWrapper](/components/toggle-button/index.html.md) | Finds a ToggleButton component | selector: |
| findToken | [TokenWrapper](/components/token/index.html.md) | Finds a Token component | selector: |
| findTokenGroup | [TokenGroupWrapper](/components/token-group/index.html.md) | Finds a TokenGroup component | selector: |
| findTopNavigation | [TopNavigationWrapper](/components/top-navigation/index.html.md) | Finds a TopNavigation component | selector: |
| findTreeView | [TreeViewWrapper](/components/tree-view/index.html.md) | Finds a TreeView component | selector: |
| findTutorialPanel | [TutorialPanelWrapper](/components/tutorial-panel/index.html.md) | Finds a TutorialPanel component | selector: |
| findWizard | [WizardWrapper](/components/wizard/index.html.md) | Finds a Wizard component | selector: |
| fireEvent | - | - | event: |
| focus | - | - | - |
| getElement | ElementType | - | - |
| keydown | - | - | keyboardEventProps: |
| keydown | - | - | keyCode: |
| keypress | - | - | keyboardEventProps: |
| keypress | - | - | keyCode: |
| keyup | - | - | keyboardEventProps: |
| keyup | - | - | keyCode: |
| matches | this &#124; null | - | selector: |
## Integration testing

The entry point for unit tests is the default method exposed by the `@cloudscape-design/components/test-utils/selectors` package. This method returns an instance of `ElementWrapper` . The following table describes the class interface.

For more information and examples for integration testing with Cloudscape see [introduction to testing](/get-started/testing/introduction/index.html.md).

ElementWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| find | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | selector: |
| findAlert | [AlertWrapper](/components/alert/index.html.md) | Finds a Alert component | selector: |
| findAll | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | selector: |
| findAllAlerts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AlertWrapper](/index.html.md)> | Finds all Alert components | selector: |
| findAllAnchorNavigations | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AnchorNavigationWrapper](/index.html.md)> | Finds all AnchorNavigation components | selector: |
| findAllAppLayouts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AppLayoutWrapper](/index.html.md)> | Finds all AppLayout components | selector: |
| findAllAreaCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AreaChartWrapper](/index.html.md)> | Finds all AreaChart components | selector: |
| findAllAttributeEditors | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AttributeEditorWrapper](/index.html.md)> | Finds all AttributeEditor components | selector: |
| findAllAutosuggests | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AutosuggestWrapper](/index.html.md)> | Finds all Autosuggest components | selector: |
| findAllAvatars | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[AvatarWrapper](/index.html.md)> | Finds all Avatar components | selector: |
| findAllBadges | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BadgeWrapper](/index.html.md)> | Finds all Badge components | selector: |
| findAllBarCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BarChartWrapper](/index.html.md)> | Finds all BarChart components | selector: |
| findAllBoardItems | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BoardItemWrapper](/index.html.md)> | Finds all BoardItem components | selector: |
| findAllBoards | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BoardWrapper](/index.html.md)> | Finds all Board components | selector: |
| findAllBoxes | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BoxWrapper](/index.html.md)> | Finds all Box components | selector: |
| findAllBreadcrumbGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[BreadcrumbGroupWrapper](/index.html.md)> | Finds all BreadcrumbGroup components | selector: |
| findAllButtonDropdowns | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ButtonDropdownWrapper](/index.html.md)> | Finds all ButtonDropdown components | selector: |
| findAllButtonGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ButtonGroupWrapper](/index.html.md)> | Finds all ButtonGroup components | selector: |
| findAllButtons | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ButtonWrapper](/index.html.md)> | Finds all Button components | selector: |
| findAllByClassName | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | className: |
| findAllCalendars | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CalendarWrapper](/index.html.md)> | Finds all Calendar components | selector: |
| findAllCards | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CardsWrapper](/index.html.md)> | Finds all Cards components | selector: |
| findAllChatBubbles | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ChatBubbleWrapper](/index.html.md)> | Finds all ChatBubble components | selector: |
| findAllCheckboxes | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CheckboxWrapper](/index.html.md)> | Finds all Checkbox components | selector: |
| findAllCodeEditors | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CodeEditorWrapper](/index.html.md)> | Finds all CodeEditor components | selector: |
| findAllCodeViews | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CodeViewWrapper](/index.html.md)> | Finds all CodeView components | selector: |
| findAllCollectionPreferences | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CollectionPreferencesWrapper](/index.html.md)> | Finds all CollectionPreferences components | selector: |
| findAllColumnLayouts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ColumnLayoutWrapper](/index.html.md)> | Finds all ColumnLayout components | selector: |
| findAllComponents | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[Wrapper](/index.html.md)> | Returns a multi-element wrapper that matches the specified component type with the specified CSS selector.If no CSS selector is specified, returns a multi-element wrapper that matches the specified component type. | ComponentClass:selector:CSS Selector |
| findAllContainers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ContainerWrapper](/index.html.md)> | Finds all Container components | selector: |
| findAllContentLayouts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ContentLayoutWrapper](/index.html.md)> | Finds all ContentLayout components | selector: |
| findAllCopyToClipboards | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[CopyToClipboardWrapper](/index.html.md)> | Finds all CopyToClipboard components | selector: |
| findAllDateInputs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[DateInputWrapper](/index.html.md)> | Finds all DateInput components | selector: |
| findAllDatePickers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[DatePickerWrapper](/index.html.md)> | Finds all DatePicker components | selector: |
| findAllDateRangePickers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[DateRangePickerWrapper](/index.html.md)> | Finds all DateRangePicker components | selector: |
| findAllDrawers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[DrawerWrapper](/index.html.md)> | Finds all Drawer components | selector: |
| findAllExpandableSections | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ExpandableSectionWrapper](/index.html.md)> | Finds all ExpandableSection components | selector: |
| findAllFileUploads | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FileUploadWrapper](/index.html.md)> | Finds all FileUpload components | selector: |
| findAllFlashbars | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FlashbarWrapper](/index.html.md)> | Finds all Flashbar components | selector: |
| findAllFormFields | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FormFieldWrapper](/index.html.md)> | Finds all FormField components | selector: |
| findAllForms | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[FormWrapper](/index.html.md)> | Finds all Form components | selector: |
| findAllGrids | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[GridWrapper](/index.html.md)> | Finds all Grid components | selector: |
| findAllHeaders | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[HeaderWrapper](/index.html.md)> | Finds all Header components | selector: |
| findAllHelpPanels | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[HelpPanelWrapper](/index.html.md)> | Finds all HelpPanel components | selector: |
| findAllHotspots | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[HotspotWrapper](/index.html.md)> | Finds all Hotspot components | selector: |
| findAllIcons | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[IconWrapper](/index.html.md)> | Finds all Icon components | selector: |
| findAllInputs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[InputWrapper](/index.html.md)> | Finds all Input components | selector: |
| findAllItemsPalettes | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ItemsPaletteWrapper](/index.html.md)> | Finds all ItemsPalette components | selector: |
| findAllKeyValuePairs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[KeyValuePairsWrapper](/index.html.md)> | Finds all KeyValuePairs components | selector: |
| findAllLineCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[LineChartWrapper](/index.html.md)> | Finds all LineChart components | selector: |
| findAllLinks | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[LinkWrapper](/index.html.md)> | Finds all Link components | selector: |
| findAllLiveRegions | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[LiveRegionWrapper](/index.html.md)> | Finds all LiveRegion components | selector: |
| findAllLoadingBars | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[LoadingBarWrapper](/index.html.md)> | Finds all LoadingBar components | selector: |
| findAllMixedLineBarCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[MixedLineBarChartWrapper](/index.html.md)> | Finds all MixedLineBarChart components | selector: |
| findAllModals | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ModalWrapper](/index.html.md)> | Finds all Modal components | selector: |
| findAllMultiselects | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[MultiselectWrapper](/index.html.md)> | Finds all Multiselect components | selector: |
| findAllPaginations | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PaginationWrapper](/index.html.md)> | Finds all Pagination components | selector: |
| findAllPieCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PieChartWrapper](/index.html.md)> | Finds all PieChart components | selector: |
| findAllPieCharts | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PieChartWrapper](/index.html.md)> | Finds all PieChart components | selector: |
| findAllPopovers | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PopoverWrapper](/index.html.md)> | Finds all Popover components | selector: |
| findAllProgressBars | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ProgressBarWrapper](/index.html.md)> | Finds all ProgressBar components | selector: |
| findAllPromptInputs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PromptInputWrapper](/index.html.md)> | Finds all PromptInput components | selector: |
| findAllPropertyFilters | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[PropertyFilterWrapper](/index.html.md)> | Finds all PropertyFilter components | selector: |
| findAllRadioGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[RadioGroupWrapper](/index.html.md)> | Finds all RadioGroup components | selector: |
| findAllS3ResourceSelectors | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[S3ResourceSelectorWrapper](/index.html.md)> | Finds all S3ResourceSelector components | selector: |
| findAllSegmentedControls | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SegmentedControlWrapper](/index.html.md)> | Finds all SegmentedControl components | selector: |
| findAllSelects | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SelectWrapper](/index.html.md)> | Finds all Select components | selector: |
| findAllSideNavigations | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SideNavigationWrapper](/index.html.md)> | Finds all SideNavigation components | selector: |
| findAllSliders | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SliderWrapper](/index.html.md)> | Finds all Slider components | selector: |
| findAllSpaceBetweens | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SpaceBetweenWrapper](/index.html.md)> | Finds all SpaceBetween components | selector: |
| findAllSpinners | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SpinnerWrapper](/index.html.md)> | Finds all Spinner components | selector: |
| findAllSplitPanels | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SplitPanelWrapper](/index.html.md)> | Finds all SplitPanel components | selector: |
| findAllStatusIndicators | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[StatusIndicatorWrapper](/index.html.md)> | Finds all StatusIndicator components | selector: |
| findAllSteps | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[StepsWrapper](/index.html.md)> | Finds all Steps components | selector: |
| findAllSupportPromptGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[SupportPromptGroupWrapper](/index.html.md)> | Finds all SupportPromptGroup components | selector: |
| findAllTables | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TableWrapper](/index.html.md)> | Finds all Table components | selector: |
| findAllTabs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TabsWrapper](/index.html.md)> | Finds all Tabs components | selector: |
| findAllTagEditors | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TagEditorWrapper](/index.html.md)> | Finds all TagEditor components | selector: |
| findAllTextContents | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TextContentWrapper](/index.html.md)> | Finds all TextContent components | selector: |
| findAllTextFilters | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TextFilterWrapper](/index.html.md)> | Finds all TextFilter components | selector: |
| findAllTextareas | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TextareaWrapper](/index.html.md)> | Finds all Textarea components | selector: |
| findAllTiles | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TilesWrapper](/index.html.md)> | Finds all Tiles components | selector: |
| findAllTimeInputs | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TimeInputWrapper](/index.html.md)> | Finds all TimeInput components | selector: |
| findAllToggleButtons | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ToggleButtonWrapper](/index.html.md)> | Finds all ToggleButton components | selector: |
| findAllToggles | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ToggleWrapper](/index.html.md)> | Finds all Toggle components | selector: |
| findAllTokenGroups | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TokenGroupWrapper](/index.html.md)> | Finds all TokenGroup components | selector: |
| findAllTopNavigations | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TopNavigationWrapper](/index.html.md)> | Finds all TopNavigation components | selector: |
| findAllTreeViews | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TreeViewWrapper](/index.html.md)> | Finds all TreeView components | selector: |
| findAllTutorialPanels | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[TutorialPanelWrapper](/index.html.md)> | Finds all TutorialPanel components | selector: |
| findAllWizards | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[WizardWrapper](/index.html.md)> | Finds all Wizard components | selector: |
| findAnchorNavigation | [AnchorNavigationWrapper](/components/anchor-navigation/index.html.md) | Finds a AnchorNavigation component | selector: |
| findAnnotationContext | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | Finds a AnnotationContext component | selector: |
| findAny | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | selectors: |
| findAppLayout | [AppLayoutWrapper](/components/app-layout/index.html.md) | Finds a AppLayout component | selector: |
| findAppLayoutToolbar | [AppLayoutToolbarWrapper](/components/app-layout-toolbar/index.html.md) | Finds a AppLayoutToolbar component | selector: |
| findAreaChart | [AreaChartWrapper](/components/area-chart/index.html.md) | Finds a AreaChart component | selector: |
| findAttributeEditor | [AttributeEditorWrapper](/components/attribute-editor/index.html.md) | Finds a AttributeEditor component | selector: |
| findAutosuggest | [AutosuggestWrapper](/components/autosuggest/index.html.md) | Finds a Autosuggest component | selector: |
| findAvatar | [AvatarWrapper](/components/avatar/index.html.md) | Finds a Avatar component | selector: |
| findBadge | [BadgeWrapper](/components/badge/index.html.md) | Finds a Badge component | selector: |
| findBarChart | [BarChartWrapper](/components/bar-chart/index.html.md) | Finds a BarChart component | selector: |
| findBoard | [BoardWrapper](/components/board/index.html.md) | Finds a Board component | selector: |
| findBoardItem | [BoardItemWrapper](/components/board-item/index.html.md) | Finds a BoardItem component | selector: |
| findBox | [BoxWrapper](/components/box/index.html.md) | Finds a Box component | selector: |
| findBreadcrumbGroup | [BreadcrumbGroupWrapper](/components/breadcrumb-group/index.html.md) | Finds a BreadcrumbGroup component | selector: |
| findButton | [ButtonWrapper](/components/button/index.html.md) | Finds a Button component | selector: |
| findButtonDropdown | [ButtonDropdownWrapper](/components/button-dropdown/index.html.md) | Finds a ButtonDropdown component | selector: |
| findButtonGroup | [ButtonGroupWrapper](/components/button-group/index.html.md) | Finds a ButtonGroup component | selector: |
| findByClassName | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | className: |
| findCalendar | [CalendarWrapper](/components/calendar/index.html.md) | Finds a Calendar component | selector: |
| findCards | [CardsWrapper](/components/cards/index.html.md) | Finds a Cards component | selector: |
| findCartesianHighcharts | [CartesianChartWrapper](/components/cartesian-chart/index.html.md) | Finds a CartesianChart component | selector: |
| findChatBubble | [ChatBubbleWrapper](/components/chat-bubble/index.html.md) | Finds a ChatBubble component | selector: |
| findCheckbox | [CheckboxWrapper](/components/checkbox/index.html.md) | Finds a Checkbox component | selector: |
| findCodeEditor | [CodeEditorWrapper](/components/code-editor/index.html.md) | Finds a CodeEditor component | selector: |
| findCodeView | [CodeViewWrapper](/components/code-view/index.html.md) | Finds a CodeView component | selector: |
| findCollectionPreferences | [CollectionPreferencesWrapper](/components/collection-preferences/index.html.md) | Finds a CollectionPreferences component | selector: |
| findColumnLayout | [ColumnLayoutWrapper](/components/column-layout/index.html.md) | Finds a ColumnLayout component | selector: |
| findComponent | [Wrapper](/index.html.md) | Returns a wrapper that matches the specified component type with the specified CSS selector.Note: This function returns the specified component's wrapper even if the specified selector points to a different component type. | selector:CSS selectorComponentClass:Component's wrapper class |
| findContainer | [ContainerWrapper](/components/container/index.html.md) | Finds a Container component | selector: |
| findContentLayout | [ContentLayoutWrapper](/components/content-layout/index.html.md) | Finds a ContentLayout component | selector: |
| findCopyToClipboard | [CopyToClipboardWrapper](/components/copy-to-clipboard/index.html.md) | Finds a CopyToClipboard component | selector: |
| findDateInput | [DateInputWrapper](/components/date-input/index.html.md) | Finds a DateInput component | selector: |
| findDatePicker | [DatePickerWrapper](/components/date-picker/index.html.md) | Finds a DatePicker component | selector: |
| findDateRangePicker | [DateRangePickerWrapper](/components/date-range-picker/index.html.md) | Finds a DateRangePicker component | selector: |
| findDrawer | [DrawerWrapper](/components/drawer/index.html.md) | Finds a Drawer component | selector: |
| findErrorBoundary | [ErrorBoundaryWrapper](/components/error-boundary/index.html.md) | Finds a ErrorBoundary component | selector: |
| findExpandableSection | [ExpandableSectionWrapper](/components/expandable-section/index.html.md) | Finds a ExpandableSection component | selector: |
| findFileDropzone | [FileDropzoneWrapper](/components/file-dropzone/index.html.md) | Finds a FileDropzone component | selector: |
| findFileInput | [FileInputWrapper](/components/file-input/index.html.md) | Finds a FileInput component | selector: |
| findFileTokenGroup | [FileTokenGroupWrapper](/components/file-token-group/index.html.md) | Finds a FileTokenGroup component | selector: |
| findFileUpload | [FileUploadWrapper](/components/file-upload/index.html.md) | Finds a FileUpload component | selector: |
| findFlashbar | [FlashbarWrapper](/components/flashbar/index.html.md) | Finds a Flashbar component | selector: |
| findForm | [FormWrapper](/components/form/index.html.md) | Finds a Form component | selector: |
| findFormField | [FormFieldWrapper](/components/form-field/index.html.md) | Finds a FormField component | selector: |
| findGrid | [GridWrapper](/components/grid/index.html.md) | Finds a Grid component | selector: |
| findHeader | [HeaderWrapper](/components/header/index.html.md) | Finds a Header component | selector: |
| findHelpPanel | [HelpPanelWrapper](/components/help-panel/index.html.md) | Finds a HelpPanel component | selector: |
| findHotspot | [HotspotWrapper](/components/hotspot/index.html.md) | Finds a Hotspot component | selector: |
| findIcon | [IconWrapper](/components/icon/index.html.md) | Finds a Icon component | selector: |
| findInput | [InputWrapper](/components/input/index.html.md) | Finds a Input component | selector: |
| findItemCard | [ItemCardWrapper](/components/item-card/index.html.md) | Finds a ItemCard component | selector: |
| findItemsPalette | [ItemsPaletteWrapper](/components/items-palette/index.html.md) | Finds a ItemsPalette component | selector: |
| findKeyValuePairs | [KeyValuePairsWrapper](/components/key-value-pairs/index.html.md) | Finds a KeyValuePairs component | selector: |
| findLineChart | [LineChartWrapper](/components/line-chart/index.html.md) | Finds a LineChart component | selector: |
| findLink | [LinkWrapper](/components/link/index.html.md) | Finds a Link component | selector: |
| findList | [ListWrapper](/components/list/index.html.md) | Finds a List component | selector: |
| findLiveRegion | [LiveRegionWrapper](/components/live-region/index.html.md) | Finds a LiveRegion component | selector: |
| findLoadingBar | [LoadingBarWrapper](/components/loading-bar/index.html.md) | Finds a LoadingBar component | selector: |
| findMixedLineBarChart | [MixedLineBarChartWrapper](/components/mixed-line-bar-chart/index.html.md) | Finds a MixedLineBarChart component | selector: |
| findModal | [ModalWrapper](/components/modal/index.html.md) | Finds a Modal component | selector: |
| findMultiselect | [MultiselectWrapper](/components/multiselect/index.html.md) | Finds a Multiselect component | selector: |
| findPagination | [PaginationWrapper](/components/pagination/index.html.md) | Finds a Pagination component | selector: |
| findPanelLayout | [PanelLayoutWrapper](/components/panel-layout/index.html.md) | Finds a PanelLayout component | selector: |
| findPieChart | [PieChartWrapper](/components/pie-chart-legacy/index.html.md) | Finds a PieChart component | selector: |
| findPieHighcharts | [PieChartWrapper](/components/pie-chart/index.html.md) | Finds a PieChart component | selector: |
| findPopover | [PopoverWrapper](/components/popover/index.html.md) | Finds a Popover component | selector: |
| findProgressBar | [ProgressBarWrapper](/components/progress-bar/index.html.md) | Finds a ProgressBar component | selector: |
| findPromptInput | [PromptInputWrapper](/components/prompt-input/index.html.md) | Finds a PromptInput component | selector: |
| findPropertyFilter | [PropertyFilterWrapper](/components/property-filter/index.html.md) | Finds a PropertyFilter component | selector: |
| findRadioGroup | [RadioGroupWrapper](/components/radio-group/index.html.md) | Finds a RadioGroup component | selector: |
| findS3ResourceSelector | [S3ResourceSelectorWrapper](/components/s3-resource-selector/index.html.md) | Finds a S3ResourceSelector component | selector: |
| findSegmentedControl | [SegmentedControlWrapper](/components/segmented-control/index.html.md) | Finds a SegmentedControl component | selector: |
| findSelect | [SelectWrapper](/components/select/index.html.md) | Finds a Select component | selector: |
| findSideNavigation | [SideNavigationWrapper](/components/side-navigation/index.html.md) | Finds a SideNavigation component | selector: |
| findSlider | [SliderWrapper](/components/slider/index.html.md) | Finds a Slider component | selector: |
| findSpaceBetween | [SpaceBetweenWrapper](/components/space-between/index.html.md) | Finds a SpaceBetween component | selector: |
| findSpinner | [SpinnerWrapper](/components/spinner/index.html.md) | Finds a Spinner component | selector: |
| findSplitPanel | [SplitPanelWrapper](/components/split-panel/index.html.md) | Finds a SplitPanel component | selector: |
| findStatusIndicator | [StatusIndicatorWrapper](/components/status-indicator/index.html.md) | Finds a StatusIndicator component | selector: |
| findSteps | [StepsWrapper](/components/steps/index.html.md) | Finds a Steps component | selector: |
| findSupportPromptGroup | [SupportPromptGroupWrapper](/components/support-prompt-group/index.html.md) | Finds a SupportPromptGroup component | selector: |
| findTable | [TableWrapper](/components/table/index.html.md) | Finds a Table component | selector: |
| findTabs | [TabsWrapper](/components/tabs/index.html.md) | Finds a Tabs component | selector: |
| findTagEditor | [TagEditorWrapper](/components/tag-editor/index.html.md) | Finds a TagEditor component | selector: |
| findTextContent | [TextContentWrapper](/components/text-content/index.html.md) | Finds a TextContent component | selector: |
| findTextFilter | [TextFilterWrapper](/components/text-filter/index.html.md) | Finds a TextFilter component | selector: |
| findTextarea | [TextareaWrapper](/components/textarea/index.html.md) | Finds a Textarea component | selector: |
| findTiles | [TilesWrapper](/components/tiles/index.html.md) | Finds a Tiles component | selector: |
| findTimeInput | [TimeInputWrapper](/components/time-input/index.html.md) | Finds a TimeInput component | selector: |
| findToggle | [ToggleWrapper](/components/toggle/index.html.md) | Finds a Toggle component | selector: |
| findToggleButton | [ToggleButtonWrapper](/components/toggle-button/index.html.md) | Finds a ToggleButton component | selector: |
| findToken | [TokenWrapper](/components/token/index.html.md) | Finds a Token component | selector: |
| findTokenGroup | [TokenGroupWrapper](/components/token-group/index.html.md) | Finds a TokenGroup component | selector: |
| findTopNavigation | [TopNavigationWrapper](/components/top-navigation/index.html.md) | Finds a TopNavigation component | selector: |
| findTreeView | [TreeViewWrapper](/components/tree-view/index.html.md) | Finds a TreeView component | selector: |
| findTutorialPanel | [TutorialPanelWrapper](/components/tutorial-panel/index.html.md) | Finds a TutorialPanel component | selector: |
| findWizard | [WizardWrapper](/components/wizard/index.html.md) | Finds a Wizard component | selector: |
| getElement | string | - | - |
| matches | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | selector: |
| toSelector | string | - | - | MultiElementWrapper 

| Name | Return type | Description | Parameters |
| --- | --- | --- | --- |
| find | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | selector: |
| findAll | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | selector: |
| findAllByClassName | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[ElementWrapper](/get-started/testing/core-classes/index.html.md)> | - | className: |
| findAllComponents | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<[Wrapper](/index.html.md)> | Returns a multi-element wrapper that matches the specified component type with the specified CSS selector.If no CSS selector is specified, returns a multi-element wrapper that matches the specified component type. | ComponentClass:selector:CSS Selector |
| findAny | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | selectors: |
| findByClassName | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | className: |
| findComponent | [Wrapper](/index.html.md) | Returns a wrapper that matches the specified component type with the specified CSS selector.Note: This function returns the specified component's wrapper even if the specified selector points to a different component type. | selector:CSS selectorComponentClass:Component's wrapper class |
| get | T | Index is one-based because the method uses the :nth-child() CSS pseudo-class. | index: |
| getElement | string | - | - |
| map | [MultiElementWrapper](/get-started/testing/core-classes/index.html.md)<T> | - | factory: |
| matches | [ElementWrapper](/get-started/testing/core-classes/index.html.md) | - | selector: |
| toSelector | string | - | - |---
