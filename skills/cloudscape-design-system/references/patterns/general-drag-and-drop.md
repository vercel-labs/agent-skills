---
scraped_at: '2026-04-20T08:52:15+00:00'
section: patterns
source_url: https://cloudscape.design/patterns/general/drag-and-drop/index.html.md
title: Drag-and-drop
---

# Drag-and-drop

Drag-and-drop enables users to select and manipulate UI elements through moving, reordering, or resizing.

## Introduction

Cloudscape features drag-and-drop functionality in a variety of patterns and components. This article explains general drag-and-drop concepts, the building blocks of common drag-and-drop interactions, and implementation considerations when adding drag-and-drop functionality to user experiences.

## Key UX concepts

### Complementary functionality

Complementary drag-and-drop refers to drag-and-drop functionality that is a feature which complements an experience, not as the sole interaction required to complete a task within a flow. Complementary drag-and-drop can be found in [file upload](/components/file-upload/index.html.md) , where users can drag files into a [file dropzone](/components/file-dropzone/index.html.md) , or use [file input](/components/file-input/index.html.md) to select files.

### Essential functionality

Essential drag-and-drop refers to when drag-and-drop is required to complete a flow. For example, in a [configurable dashboard](/patterns/general/service-dashboard/configurable-dashboard/index.html.md) , users must interact with board items through drag-and-drop functionality to successfully configure a dashboard. When drag-and-drop is essential, it is important to provide clear signifiers of affordance and alternative methods of completion to increase probability of user success.

### Source and destination

A drag-and-drop interaction is made up of a source and a destination *. * Source refers to the state or position of a draggable item at the beginning of an interaction. For example, the [items palette](/components/items-palette/index.html.md) can be considered a source, as it provides the beginning position of a drag-and-drop interaction for a palette item. Destination refers to where a draggable item can be dropped. For example, [file dropzone](/components/file-dropzone/index.html.md) acts as a destination for files to be dropped. The source and destination of a draggable item can be in the same drag-and-drop area like in a [board](/components/board/index.html.md) . This can also be abstract like when interacting with a [slider](/components/slider/index.html.md) , where the source and destination are taking place within a single component, and the draggable item's source is dynamic along a static destination.

### Dynamic states

A draggable item may change both in its content and appearance before, during, and after the drag-and-drop interaction. This is especially common when items are being dragged from one source to a different destination. For example, in a [configurable dashboard](/patterns/general/service-dashboard/configurable-dashboard/index.html.md) , draggable items in the item palette show limited content while inactive. While active, they display a drop shadow and an active border, and ultimately display different content after being dropped into the destination.

## Fundamental categories

### In-app

In-app drag-and-drop refers to a drag-and-drop interaction that takes place within a single application or user interface. For example, moving [board items](/components/board-item/index.html.md) within a [configurable dashboard](/patterns/general/service-dashboard/configurable-dashboard/index.html.md) or reordering items in a [list](/components/list/index.html.md).

![Video]()
Controls: true

### Cross-app

Cross-app drag-and-drop refers to a drag-and-drop interaction that takes place between multiple applications, windows, or user interfaces. This kind of drag-and-drop interaction may not always warrant certain building blocks like drag handles because the source may be within an external environment. For example, in [file upload](/components/file-upload/index.html.md) a file is dragged from a file explorer and is dropped within a defined drag-and-drop area accompanied by a state change.

![Video]()
Controls: true

## Building blocks

A B C C D
#### A. Drag-and-drop area

A drag-and-drop area is an area where the drag-and-drop interaction takes place and can take on different forms depending on the pattern or component. It can be invisible to a user, or intentionally visible with color, patterns, or other visual cues. It can act as a drag source, a drag destination or both.

#### B. Draggable item

A draggable item refers to an interactive element within a drag-and-drop area. For example, a [board item](/components/board-item/index.html.md) is a draggable item within a [board](/components/board/index.html.md).

#### C. Drag handle  - optional

A drag handle is a dedicated grip area used to signify drag-and-drop affordance, and initiate different types of drag-and-drop interactions like reordering or resizing items. A drag handle may not be necessary for a drag-and-drop experience that acts only as a destination. Alternatively, a draggable item may have more than one drag handle signifying different drag-and-drop affordances like in a board item.

#### D. Drop preview - optional

A drop preview helps users understand the destination where active draggable item will be dropped. A drop preview should reflect the general shape and size of the selected draggable item.

## Drag handles

To reinforce perceived drag-and-drop affordances, interacting with signifiers like drag handles for common drag-and-drop interactions includes cursor changes, which gives users additional clues as to the specific behavior associated with a drag handle. These signifiers typically refer to either resizing or multi-purpose drag-and-drop affordances.

#### Area resizing

Area resizing uses the `resize-area` icon to signify both horizontal and vertical resize affordance. On input devices, a user's cursor changes to a diagonal resize arrow `cursor: nwse-resize` to reinforce multi-directional resize affordance.

#### Horizontal resizing

Horizontal resizing uses the `horizontal-resize` icon to signify horizontal drag affordance for resizing elements horizontally. On input devices, a user's cursor changes to a horizontal resize arrow `cursor: ew-resize` to reinforce the horizontal directional drag affordance.

#### Vertical resizing

Vertical resizing uses the `vertical-resize` icon to signify vertical drag affordance for resizing elements vertically. On input devices, a user's cursor changes to a vertical resize arrow `cursor: ns-resize` to reinforce the vertical directional drag affordance.

#### Multi-purpose

Multi-purpose drag-and-drop uses the `drag-indicator` icon to signify general drag-and-drop affordance. This is the most common signifier for drag-and drop interactions like horizontal and vertical reordering. On input devices, a user's cursor changes to a hand `cursor: pointer` to reinforce the item is draggable.

## Interaction principles

#### Drag to resize

Users can adjust the size of draggable items, allowing them to show more or less content or to increase or decrease the size of page elements.

![Video]()
Controls: true

#### Horizontal and vertical swap

When a draggable item is the same size, or multiple items are of equal size within a drop destination, the items will swap positions.

![Video]()
Controls: true

#### Push

When a draggable item is placed in an area where swap is unavailable, the active draggable item will push other items out of the way.

![Video]()
Controls: true

#### Vertical and horizontal reordering

Draggable items can be moved vertically and horizontally in the drag-and-drop area. For example, [board items](/components/board-item/index.html.md) moving within a [board](/components/board/index.html.md).

![Video]()
Controls: true

#### Invalid

When a draggable item can't be dropped into a location. For example, in a [board](/components/board/index.html.md) , when it is placed outside a layout or there is not enough room for a swap, the item returns to its original location.

![Video]()
Controls: true

## Accessible drag-and-drop

Some users may find completing a drag interaction challenging. Even when drag-and-drop functionality exists as a complementary feature with reinforced signifiers like drag handles, it is necessary to provide an alternative means of drag-and-drop that empowers a user to achieve the specific drag-and-drop movement without dragging. This may seem contradictory, but it means giving users the ability to complete a drag-and-drop interaction through a series of single selections without dragging.

## Input devices

Use two pointer events within the drag handle for mouse or trackpad devices. This enables users to move, resize, or manipulate draggable items depending on the available affordance. Include directional arrows in icon buttons to support completion through single clicks for enhanced accessibility.

## Touch devices

Use two touch events within the drag handle for touch device interactions. This enables users to move, resize, or manipulate draggable items based on the available affordance. Include directional arrows in icon buttons to support completion through single taps.

## Keyboard

Use tab, enter, and directional arrow controls to enable keyboard-based drag-and-drop interactions. Allow users to select the draggable element or its drag handle, then manipulate items using their physical keyboard's directional keys. This implementation ensures full keyboard accessibility for all users.

## Guidelines

### Do

- Understand whether drag-and-drop functionality is complementary or essential to a flow.
- Use consistent visual cues like drag handles to signify drag-and-drop affordance.
- Include cursor changes on input devices to reinforce drag-and-drop affordance.

## Accessibility guidelines

### General accessibility guidelines

- Follow the guidelines on alternative text and Accessible Rich Internet Applications (ARIA) regions for each component.
- Make sure to define ARIA labels aligned with the language context of your application.
- Don't add unnecessary markup for roles and landmarks. Follow the guidelines for each component.
- Provide keyboard functionality to all available content in a logical and predictable order. The flow of information should make sense.

### Pattern-specific accessibility guidelines

- Use single pointer and keyboard interactions to provide alternative ways to complete a drag-and-drop interactions without dragging.

## Related patterns and components

### List

A list is a group of consecutive items displayed one below the other.

[View Documentation](/components/list/index.html.md)

### File dropzone

An area that allows users to drag and drop files.

[View Documentation](/components/file-dropzone/index.html.md)

### Configurable dashboard

Gives control to the user to show/hide, delete, move, change the size of, and add items to a dashboard.

[View Documentation](/patterns/general/service-dashboard/configurable-dashboard/index.html.md)

### Split panel

A collapsible panel that provides access to secondary information or controls. It is the primary component to implement [split view](/patterns/resource-management/view/split-view/index.html.md) , a pattern to display item collection with contextual item details.

[View Documentation](/components/split-panel/index.html.md)

### Code editor

With the code editor, users can write and edit code.

[View Documentation](/components/code-editor/index.html.md)

### Table

Presents data in a two-dimensional table format, arranged in columns and rows in a rectangular form.

[View Documentation](/components/table/index.html.md)

### Collection preferences

With collection preferences, users can manage their display preferences within a collection.

[View Documentation](/components/collection-preferences/index.html.md)

### Slider

A slider enables users to select a value within a defined range.---

[View Documentation](/components/slider/index.html.md)
