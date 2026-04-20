---
scraped_at: '2026-04-20T08:50:09+00:00'
section: foundation
source_url: https://cloudscape.design/foundation/core-principles/accessibility/focus-management-principles/index.html.md
title: Focus management principles
---

# Focus management principles

Learn about principles of accessible focus management, potential challenges and examples.

## What is accessible focus management?

Accessible focus management is the practice of using programmatic focus changes to enhance comprehension and usability of a website. Cloudscape uses focus management to streamline tasks and direct attention to important areas of a document. Focus management benefits a variety of users including those using assistive technology (AT) such as a screen reader, those using a keyboard to navigate, and those who may have increased the zoom of their browser to make reading more comfortable.

## Why we manage focus for accessibility?

Focus management is used to redirect the user's attention and to make keyboard navigation more efficient.

### Redirecting the user's attention

Screen readers can only announce one item at a time. When an event requires a user's attention outside of the focused element, we can redirect their attention by programmatically setting focus onto the desired component.

### Making keyboard navigation more efficient

Some user actions or events require moving their focus to navigate efficiently. This often means using javascript to provide alternate models of navigation, such as enabling arrow keys to navigate between tabs in a tab list. Sometimes a user interaction indicates an intention to interact with specific content. For example, clicking a button that opens a modal requires setting focus into the newly open modal. The occurrence of a post-submit error requires moving focus to the first element in error to aid remediation.

## Browser focus versus screen reader focus

In order to design for accessible focus management it is important to understand some basics of how users might read and navigate a page. There are two types of focus:

- Browser focus refers to the browsers' sense of the current active page element, for example a form field or link. This is the element that is referenced by **document.activeElement **   and which the **:focus **   CSS selector will apply to.
- Screen reader "focus" (also known as the "Virtual Cursor") refers to the element that is currently being read by a screen reader. This focus is actually a queue of announcements managed by the screen reader. This may be the same as browser focus (in the case of interactive elements), or it may be different (for example: the browser focus is on an element, but paragraph below it is being read from the screen reader focus). In the case of users navigating non-visually with a screen reader, it is important to note that **the users' attention will only be on the element that has screen reader focus **   and changes that occur outside of this element will not be noticed.

Browser focus can be moved to interactive items such as inputs and links using the tab key and shortcuts provided by assistive technology and/or the browser. Note: Mac browsers sometimes need to [have tab-to-focus enabled.](https://www.a11yproject.com/posts/macos-browser-keyboard-navigation/) Screen reader focus can change as a user utilizes reading commands such as using arrow keys to move through text, or using a keyboard shortcut to jump to the next heading.

When browser focus is moved programmatically by calling **focus() ** on an element, screen reader "focus" will be placed on that element as well.

## General guidelines

### Do

- ARIA Authoring Practices Guide
- **Reduce key presses**   Focus management is used to reduce the user's need to tab through content they do not wish to hear the entirety of. For example, in the [tabs component](/components/tabs/index.html.md)   , a tab list is one tab stop, and the user can use arrow keys to move between the tabs, or press tab to skip the tab list.
- **Moving focus to show a result**   Some actions have a signal to confirm that they have worked. For example, if you click a link there is a page reload. In other cases, a focus move lets the user know that an action has occurred (or completed). For example, in a single-page application without full-page refreshes, moving focus to the new H1 will communicate that the page content has changed.
- **Using focus to ensure important items are noticed**   Focus movement is not just for screen reader accessibility. It also helps ensures that users who are zoomed in have the information they need in the viewport. For example, when there is an important error, set focus on it to scroll it into the viewport.
- **Moving focus after something closes**   Where the user is placed when they are done interacting with an element that focus was previously moved to can be equally important as the initial move. For example, when focus is set into a dialog based on a user's button press, it is a best practice to return focus to that button when they close the modal. This helps ensure that the user remains oriented within the document and can easily continue where they left off.
- **Moving focus when the focused item is removed**   Sometimes when a user clicks an element it may disappear. For example, a button to delete a row in a table will disappear along with the row. In this case, set the user's focus somewhere logical. More often than not, this will be the next item in a list, or the next focusable item. In cases where the item being deleted is enumerated, like a list or table rows, it is helpful to keep the focus in that structure, so that users who are navigating non-visually will know that the number of items has been reduced.

### Don't

- **Don't move focus unless necessary**  
  It is always better to not interrupt default browser behavior unless it helps the user. Don't manage focus when in doubt. Let the focus follow the Document Object Model (DOM) order instead. This ensures that the focus order is logical and sequential.
- **Items do not have to be focusable to be read**  
  It is a common misconception that screen reader users only use the tab key to move around, and therefore important things need to be in the tab-index even if they are not interactive. However, screen reader users use a wide variety of keyboard commands to access and read all of the content of the page unless it is hidden.
- **Don't let focus disappear**  
  Make sure everything that *can*   receive focus has a visible focus state while navigating by keyboard, even if it is not normally a focusable element. For example, headings do not normally have a focus style, but when we move focus to it programatically it needs to show focus for keyboard navigation. This is crucial to keep keyboard-navigation users oriented.
- **Don't move focus without a positive user action **  
  Make sure focus moves are the result of a user clicking a control or submitting a form. Do not move focus as a result of an item receiving focus. Do not move focus when a radio button is selected.

## Examples from Cloudscape

### Modal dialogs

#### Opening the dialog

When a modal opens, focus is set into the element with role="dialog". By default, focus is set onto the close button because its the first interactive item.

When focus is first placed into the dialog, the user hears the accessible name of the dialog. This is automatically derived from the contents of the component's **"header" prop** , which is placed into an H2 that has been associated to the dialog element with **aria-labelledby. ** All other elements in the document outside of the modal are hidden from assistive technology and focus is trapped within the modal so that a user does not accidentally end up "behind" the open modal. The [modal](/components/modal/index.html.md) in Cloudscape automatically handles all of the focus requirements for opening a modal.

#### Closing the dialog

When the dialog is closed, reorient the user by returning their focus back to the button that launched the dialog. The next focusable element in the DOM order after the button is usually best if that button no longer exists.

- **What **   Cloudscape** handles:**   The Modal component automatically sets focus back on the element that opened it.
- **Implementation considerations:**  
  If the original button no longer exists, the focus must be set programmatically as a call-back. It is recommended to set it on the element that followed the original button in the tab order.

### Alerts and flashbars

It is important to make the user aware of a message in an alert or flashbar so that they are able to easily act on it. [Alerts](/components/alert/index.html.md) and [flashbars](/components/flashbar/index.html.md) in Cloudscape persist to ensure the user has ample time to interact with them, and move focus to make sure the user is aware of the alert. It is recommended to not rely solely on aria-live for important announcements as users who may be highly-zoomed do not have access to live announcements.

Consider the balance between interrupting the user and ensuring they have the information they need. Follow the recommendations below when an alert or flashbar appears:

- **Success, error, and warning**  
  Set focus on the element that contains the icon and the header and/or content.
- **Info, in Progress, progress bar**  
  Do not move focus, use a [live region component](/components/live-region/index.html.md)   to announce the message.
- **What **   Cloudscape** handles:**   The flashbar component automatically handles all of the focus requirements for flash messages if you provide a value for `ariaRole`   . For alerts, use the `focus`   ref function to set focus on the alert content.
- **Implementation considerations:**  
  Ensure focus lands on an element that is logical and helpful for the user when an alert or flashbar is dismissed.  

  - If there are more flashbars or alerts appearing, focus on the next one in the list (or the last one if there are no more).
  - If there are no more flashbars or alerts, then set focus to the top of the page or on the page's H1.

### Attribute editor

The [attribute editor](/components/attribute-editor/index.html.md) in Cloudscape is an illustrative example of using focus to show outcome, and what to do when a button disappears.

- **When "Add new item" is activated**  
  Set focus into the first newly created field.
- **When "Remove" is activated**  
  Set focus on the next attribute input in the list, or the last one if there is only one remaining. If the user has just removed the last item, set focus onto the "Add new item" button.
- **Implementation considerations:**  
  The attribute editor does not handle any focus automatically. Implement the focus management described above.

[View Documentation](/components/attribute-editor/index.html.md)
