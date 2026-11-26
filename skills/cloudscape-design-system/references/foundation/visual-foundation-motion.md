---
scraped_at: '2026-04-20T08:50:32+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/visual-foundation/motion/index.html.md
title: Motion
---

# Motion

Motion helps enhance the user experience by making a user interface both easy to use and more expressive.

## Why we need motion

Motion helps draw a user's attention to key elements and interactions on a page, without interrupting their focus from the overall task. By showing how an element moves or changes from one state to another, motion helps prevent the user interface (UI) from changing too abruptly. When paired with other feedback mechanisms, motion can help users understand the consequences of their actions over the interface. To incorporate motion into a user experience in a coherent and consistent way, follow the set of guidelines mentioned below.

## Motion principles

#### Intentional

Motion should be used purposefully and judiciously. It should increase usability and guide emotion for users.

#### Focused

Use motion to draw a user's attention to important aspects of the interface without distracting them from the primary task.

#### Delightful

Use motion to make the user experience more delightful and approachable.

## Transform patterns in motion

To unify the forms of motion in the system, our components use the following transform patterns.

![Video]()
Controls: true

#### Scale

Scaling content into view draws users' attention to the item that is in motion. For instance, [Modal](/components/modal/index.html.md) reveals while scaling up to focus users' attention.

![Video]()
Controls: true

#### Fade

Fading makes it smooth to show and hide elements. It's widely used in motion in Cloudscape components such as [Modal](/components/modal/index.html.md) , [Select](/components/select/index.html.md) , [Date picker](/components/date-picker/index.html.md) , and [Date range picker](/components/date-range-picker/index.html.md) , etc.

![Video]()
Controls: true

#### Slides

Sliding signifies spacial and structural clues that makes the interactions expected, for instance, [Side navigation](/examples/react/dashboard.html) , [Help panel](/examples/react/dashboard.html) , [Split panel](/examples/react/split-panel-multiple.html) , etc. slide in from the direction of the trigger.

## Properties of motion

Motion speed adjustments include easing (acceleration over time) and duration (how long a transition lasts).

### Easing

In the real world, objects tend to accelerate or decelerate as opposed to moving at a constant rate. This allows for different speeds of movement to provide character. For example, snappier movements reflect responsiveness, whereas expressive ones create moments of delight. To make motion more purposeful and natural to the human eye, we use a set of defined streamlined easing curves. These easing curves are used by our components in combination with [duration](about:blank/index.html.md).

#### Curve A (0.00, 0.00, 0.00, 1.00)

Curve A provides responsive yet smooth visual feedbacks.

Examples:

- Dropdown part of [Select](/components/select/index.html.md)   (with 115MS duration)
- [Popover](/components/popover/index.html.md)   reveal (with 115MS duration)

#### Curve B (1.00, 0.00, 0.83, 1.00)

Curve B makes an element sticky to a certain state.

Examples:

- Popover hide only when hovering-out from [Charts](/components/bar-chart/index.html.md)   (with 115MS duration)

#### Curve C (0.84, 0.00, 0.16, 1.00)

Curve C draws a user's attention in an expressive way.

Examples:

- [Link](/components/link/index.html.md)   (with 165MS duration)

### Duration

Duration, or the amount of time that motion takes to complete an action, is defined in three ways. The correct use of duration in combination with [easing](about:blank/index.html.md) provides smooth and purposeful transitions without disorienting users.

![Video]()
Controls: true

#### Duration: 115MS

This 115MS duration is supposed to make the motion quick and responsive.

Examples:

- Dropdown part of [Select](/components/select/index.html.md)   (with easing curve A)
- [Popover](/components/popover/index.html.md)   reveal (with easing curve A)

![Video]()
Controls: true

#### Duration: 165MS

165MS accommodates the motion with more expressiveness.

Examples:

- Shaking icon on an error state of [Form field](/components/form-field/index.html.md)   (with easing curve A)
- [Link](/components/link/index.html.md)   (with easing curve C)

![Video]()
Controls: true

#### Duration: 250MS

To draw more attention or accommodate for more complexity, 250MS gives the space for that.

## Supported use cases

### Showing and hiding elements

Motion helps prevent the UI from changing too abruptly when an incoming element appears or an outgoing element disappears from the viewport.

#### a. Dropdown

An incoming dropdown on [Select](/components/select/index.html.md) fades and slides in when appearing below its trigger. This motion helps give users spacial and structural clue over the interface.

- Fade in  

  - Easing: Curve A
  - Duration: 115MS
- Scale  

  - Easing: Curve A
  - Duration: 115MS

Other examples: [Button dropdown](/components/button-dropdown/index.html.md) , [Date picker](/components/date-picker/index.html.md) , [Date range picker](/components/date-range-picker/index.html.md)

#### b. Modal

The [Modal](/components/modal/index.html.md) appears while fading in and scaling up to draw users' attention.

- Fade in  

  - Easing: Curve A
  - Duration: 115MS
- Scale  

  - Easing: Curve A
  - Duration: 115MS

#### c. Panels

The Side panel slides in from its trigger.

- Slide in  

  - Easing: Curve A
  - Duration: 115MS

Example: [Side navigation and Help panel](/examples/react/dashboard.html) in dashboard demo

#### d. Flashbar

The Flashbar slides in from top of the screen.

- Slide in  

  - Easing: Curve C
  - Duration: 250MS

Example: Flashbar in [Delete with additional confirmation demo](/examples/react/delete-with-additional-confirmation.html)

### State transitions

Motion is used to highlight a change of state in an element. It eases the transition between states and notifies users to the change of state.

#### a. Getting an error

When an error occurs, a small shake movement brings attention to the warning, as demonstrated with the [Form field component](/components/form-field/index.html.md).

- Fade in  

  - Easing: Curve A
  - Duration: 165MS
- Shake 5px on either side  

  - Easing: Curve A
  - Duration: 165MS

#### b. Link

The combination of easing Curve C and 165MS duration makes the transition on [Link component](/components/link/index.html.md) smooth yet noticeable, conveying interactivity.

- Change in color and added underline on hover  

  - Easing: Curve C
  - Duration: 165MS

### Drag-and-drop

Motion is used when an item moves and when it takes a new position. It eases the transition between an items position and notifies the users of the new location.

#### a. Swap

A [board item](/components/board/index.html.md) moves to give room for a new item. An item moves to a new location when a selected item is dragged to take its old position. The item slides to its new position.

Slide in

- Easing: Curve A
- Duration: 115MS

#### b. Transition to new location

A [board item](/components/board/index.html.md) is dropped to take its new position. When an item is moved to or close to its target location and released. It transitions to its new position.

Slide in

- Easing: Curve A
- Duration: 115MS

[View Documentation](/patterns/general/drag-and-drop/index.html.md)

### Loading states

With continuous motion, loading states inform users about actions in progress or other operations running in the background. A rotating [spinner](/components/spinner/index.html.md) motion, or progression of a [progress bar](/components/progress-bar/index.html.md) are examples of its displaying the loading state. For more details about the usage, see the guidelines for [loading and refreshing](/patterns/general/loading-and-refreshing/index.html.md).

#### a. Spinner

### Items

Edit Delete Create 

| Variable name | Current value | Description |
| --- | --- | --- |
| Loading items |  |  |
## Accessibility in motion

Certain users with reduced or no vision may not be able to perceive motion, due to their dependence on assistive technologies such as screen readers or reduced motion settings for their operating system (OS). To ensure an accessible experience for all users, follow these guidelines:

- Respect users' default motion preferences from their OS settings. Use the `prefers-reduced-motion`   CSS media feature to disable motion.
- Do not have motion that flashes more than three times in any one second period, because it can trigger epileptic seizures or physical reactions especially for users who have vestibular disorders.
- Ensure that the user interface looks and behaves so that it's perceivable to all users, without relying on motion alone.

## Implementation

### Enabling motion

Motion is active by default in all components.

We recommend to deactivate motion in test environments as this may cause your automated tests to fail. You can control the motion state using the <a href="/get-started/for-developers/global-styles/#manipulating-motion"> `disableMotion()`</a> function from the global styles package.
### Respecting user preferences

If a user prefers reduced motion on their interfaces, they can specify this at the operating system level. In a web browser, this is reflected by the `prefers-reduced-motion` CSS media feature, and is currently supported by a number of browsers. See the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) for more details. If the user's browser supports this media feature, the design system respects the user's preferences and deactivates all non-essential animations.

### Use in custom components

The [design tokens](/foundation/visual-foundation/design-tokens/index.html.md) provide easing curves, duration values, and animation keyframes names for adding motion to custom components. You can use these tokens for defining CSS transitions or CSS animations on elements as shown below.

```
@use '@cloudscape-design/design-tokens/index' as awsui;

.custom-popup {
  // Defining an entry animation using the fade-in keyframe
  animation:
    awsui.$motion-keyframes-fade-in awsui.$motion-duration-responsive awsui.$motion-easing-responsive,
    awsui.$motion-keyframes-scale-popup awsui.$motion-duration-responsive awsui.$motion-easing-responsive;
  animation-fill-mode: both;
}

.custom-caret {
  // Adding a transition for changes to the transform property
  transition:
    transform
    awsui.$motion-duration-responsive
    awsui.$motion-easing-responsive;

  &.active {
    transform: rotate(90deg);
  }
}
```
