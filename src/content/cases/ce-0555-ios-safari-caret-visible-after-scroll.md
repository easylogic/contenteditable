---
id: ce-0555-ios-safari-caret-visible-after-scroll
scenarioId: scenario-ios-safari-caret-visible-after-scroll
locale: en
os: iOS
osVersion: Any
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: Latest
keyboard: US
caseTitle: Caret and text selection remain visible after scrolling in iOS Safari
description: "In iOS Safari, when a contenteditable div is within a scrollable container, the caret and text selection can remain visible even after scrolling, leading to visual artifacts."
tags:
  - ios
  - safari
  - caret
  - selection
  - scroll
  - mobile
status: draft
---

## Phenomenon

In iOS Safari, when a contenteditable div is within a scrollable container, the text caret and text selection can remain visible even after the content has been scrolled out of view. This creates visual artifacts where the caret or selection highlight appears floating or in the wrong position.

## Reproduction example

1. Create a scrollable container with a contenteditable div inside.
2. Add enough content to make scrolling necessary.
3. Focus the contenteditable element and place cursor or select text.
4. Scroll the container so the editable area moves out of view.
5. Observe whether the caret or selection highlight remains visible.

## Observed behavior

- **Caret remains visible**: Text cursor stays visible after scrolling out of view.
- **Selection highlight persists**: Selected text highlight may remain visible.
- **Visual artifacts**: Caret or selection appears floating or in incorrect position.
- **iOS-specific**: This issue is specific to iOS Safari.
- **Scrollable containers**: Issue occurs when contenteditable is inside scrollable parent.

## Expected behavior

- Caret should disappear when contenteditable area scrolls out of view.
- Selection highlight should be removed when content scrolls out of view.
- Visual artifacts should not appear after scrolling.
- Caret and selection should only be visible when content is in viewport.

## Analysis

iOS Safari's rendering engine may not properly update caret and selection rendering when content is scrolled. The browser may cache or persist these visual indicators even when they're no longer relevant.

## Workarounds

- Hide caret and selection on scroll events:
  ```javascript
  container.addEventListener('scroll', () => {
    const selection = window.getSelection();
    selection.removeAllRanges();
  });
  ```
- Use CSS to hide caret when element is out of view.
- Implement custom caret and selection indicators that respect scroll position.
- Blur contenteditable element on scroll to remove focus.
- Test and adjust scroll handling for iOS Safari specifically.
