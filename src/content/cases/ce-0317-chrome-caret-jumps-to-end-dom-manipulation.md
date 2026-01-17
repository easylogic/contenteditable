---
id: ce-0317-chrome-caret-jumps-to-end-dom-manipulation
scenarioId: scenario-chrome-caret-jumps-to-end-dom-manipulation
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Caret jumps to end when DOM is manipulated during input in Chrome
description: "In Chrome, when DOM is manipulated during user input (such as inserting or deleting non-editable spans), the browser may reset the caret position to the end of the contenteditable element."
tags:
  - chrome
  - caret
  - dom-manipulation
  - non-editable
status: draft
---

## Phenomenon

In Chrome, when the DOM is manipulated during user input in a contenteditable element, the caret may unexpectedly jump to the end of the content. This often occurs when programmatically inserting or deleting non-editable elements like `<span contenteditable="false">` while the user is typing.

## Reproduction example

1. Create a contenteditable div with some text.
2. Programmatically insert or delete a non-editable `<span contenteditable="false">` element.
3. Observe that the caret jumps to the end of the contenteditable element.
4. This disrupts the user's typing position.

## Observed behavior

- **Caret jumps to end**: Caret position resets to end of contenteditable element.
- **DOM manipulation trigger**: Occurs when DOM is modified during user input.
- **Non-editable elements**: More common when working with `contenteditable="false"` elements.
- **Chrome-specific**: This behavior is more prevalent in Chrome.
- **User disruption**: Severely disrupts typing and editing experience.

## Expected behavior

- Caret position should be preserved during DOM manipulations.
- Programmatic changes should not affect user's cursor position.
- Editing should continue smoothly even when DOM is modified.

## Analysis

Chrome's contenteditable implementation may reset the selection when DOM structure changes, especially when non-editable elements are involved. The browser's selection management doesn't properly track position across structural changes.

## Workarounds

- Preserve caret position before DOM manipulation:
  ```javascript
  function saveCaretPosition(element) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
    }
    return null;
  }
  
  function restoreCaretPosition(element, savedPosition) {
    if (!savedPosition) return;
    const range = document.createRange();
    range.setStart(savedPosition.startContainer, savedPosition.startOffset);
    range.setEnd(savedPosition.endContainer, savedPosition.endOffset);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
  ```
- Insert non-breaking space after non-editable elements to maintain position.
- Use block-level elements instead of inline elements for contenteditable regions.
- Avoid DOM manipulation during active input, defer to next frame.
