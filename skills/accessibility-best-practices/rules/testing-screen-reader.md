---
title: Test with Real Screen Readers
impact: MEDIUM
impactDescription: Automated tools miss issues that only surface during real screen reader interaction
tags: testing, screen-reader, voiceover, nvda, manual
wcag: "N/A"
---

## Test with Real Screen Readers

**Impact: MEDIUM (Automated tools miss issues that only surface during real screen reader interaction)**

Automated accessibility testing catches structural issues, but screen readers interpret the accessibility tree in ways that tools can't predict. Test critical user flows with at least one screen reader. VoiceOver (macOS/iOS) and NVDA (Windows, free) are the most common.

**Screen reader testing checklist:**

```
1. Page load:
   - [ ] Page title is announced
   - [ ] Landmark regions are discoverable (rotor/elements list)
   - [ ] Heading hierarchy is navigable (H key)

2. Navigation:
   - [ ] Skip link works and is announced
   - [ ] All links have descriptive text in links list
   - [ ] Navigation menus are operable

3. Forms:
   - [ ] Every input announces its label on focus
   - [ ] Required fields are announced
   - [ ] Error messages are read when they appear
   - [ ] Form submission result is announced

4. Interactive components:
   - [ ] Buttons announce their name and role
   - [ ] Expandable sections announce expanded/collapsed state
   - [ ] Modals trap focus and announce their title
   - [ ] Toasts/notifications are announced

5. Dynamic content:
   - [ ] Loading states are communicated
   - [ ] Route changes announce new page title
   - [ ] Live updates (cart count, etc.) are announced
```

**Quick VoiceOver test (macOS):**
- `Cmd + F5` to toggle VoiceOver
- `VO` key = `Ctrl + Option`
- `VO + Right/Left` to navigate
- `VO + U` to open rotor (headings, links, landmarks lists)
- `Tab` to navigate focusable elements

Test the top 3-5 most important user flows. You don't need to screen-reader-test every page — focus on sign-up, checkout, search, and primary navigation.

Reference: [VoiceOver User Guide](https://support.apple.com/guide/voiceover/welcome)
