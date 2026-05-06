---
scraped_at: '2026-04-20T08:51:00+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/dev-guides/z-index/index.html.md
title: Z-index
---

# Z-index

How to understand and control element stacking in Cloudscape.

## Introduction

Cloudscape uses z-index ranges to control how certain components stack on top of each other. Elements such as [dropdown lists](/components/button-dropdown/index.html.md) and [modals](/components/modal/index.html.md) should appear layered on top of other content, regardless of where they are located on a page.

If you set a custom z-index for any custom components or elements outside the system, consider these internal z-index ranges and ensure that your content stacks in the expected manner. In general, we recommend that you avoid using z-index unless absolutely necessary, and instead use other CSS properties to control your layout. When setting z-indexes, be aware of the ranges we use in our components. You can find those ranges in the section below.

## Ranges

### z-index: auto

If no other `z-index` is defined, all elements have the default `z-index` of `auto`.

### z-index: 800-850

Sticky elements:

- Table [header](/components/header/index.html.md)
- Table sticky columns
- [Modal](/components/modal/index.html.md)   footer
- [App layout](/components/app-layout/index.html.md)   notifications slot
- App layout navigation and tools panels
- App layout header
- [Split panel](/components/split-panel/index.html.md)

### z-index: 2000

Interactive elements that should appear above all content, remain visible, and be able to be interacted with:

- Dropdown ( [select](/components/select/index.html.md)   , [button dropdown](/components/button-dropdown/index.html.md)   , [multiselect](/components/multiselect/index.html.md)   , [autosuggest](/components/autosuggest/index.html.md)   , [property filter](/components/property-filter/index.html.md)   , [date picker](/components/date-picker/index.html.md)   , and [date range picker](/components/date-range-picker/index.html.md)   ) content
- [Popover](/components/popover/index.html.md)   content

### z-index: 4999-5000

Content that should focus the user and block all interaction with other elements:

- [Modal](/components/modal/index.html.md)   overlay
- Modal content

### z-index: 7000

Interactive elements, which ignore its parent [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context) , that should appear above all content, remain visible, and be able to be interacted with:

 [Popover](/components/popover/index.html.md) content with `renderWithPortal` set to `true`
 [Copy to clipboard](/components/copy-to-clipboard/index.html.md) Popover content
