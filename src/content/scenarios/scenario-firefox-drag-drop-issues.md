---
id: scenario-firefox-drag-drop-issues
title: Firefox Drag and Drop Issues in contenteditable
description: "Firefox has several issues with drag and drop functionality in contenteditable elements, including text not moving from textarea to contenteditable, nested span generation, and cursor positioning problems."
tags:
  - firefox
  - drag-drop
  - textarea
  - nested-elements
  - cursor-position
  - selection
category: drag-drop
status: draft
locale: en
---

## Overview

Firefox has several issues with drag and drop functionality in `contenteditable` elements. These include problems with dragging text from `textarea` to `contenteditable`, generating nested spans when dragging within contenteditable spans, and cursor positioning issues when contenteditable is nested within draggable elements.

## Impact

- **Drag and Drop Failure**: Text cannot be moved from textarea to contenteditable in Firefox
- **DOM Corruption**: Nested spans are generated unexpectedly during drag operations
- **Cursor Positioning**: Cursor appears at wrong position after drag operations
- **User Experience**: Drag and drop functionality is unreliable in Firefox

## Technical Details

### Issue 1: Textarea to contenteditable Drag Failure

When dragging text from a `textarea` to a `contenteditable` div in Firefox, the text does not move as expected. This works correctly in Chrome and Internet Explorer.

### Issue 2: Nested Span Generation

When dragging and dropping text within a `<span contenteditable>` element in Firefox, a new nested `<span>` is generated around the dragged text, leading to unintended nesting.

### Issue 3: Cursor Positioning in Draggable Elements

When a `contenteditable` element is nested within a draggable element in Firefox, clicking on it may position the cursor at the start of the editable text, regardless of the click position.

## Browser Comparison

- **Firefox**: All these issues occur
- **Chrome**: Not affected
- **Safari**: Not affected
- **Edge**: Not affected

## Workarounds

### Prevent Unwanted Drag and Drop

```javascript
const editor = document.querySelector('[contenteditable]');

// Disable drag and drop entirely
editor.addEventListener('dragstart', (e) => {
  e.preventDefault();
});

// Or handle drag and drop manually
editor.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
});

editor.addEventListener('drop', (e) => {
  e.preventDefault();
  const text = e.dataTransfer.getData('text/plain');
  
  // Insert text manually at cursor position
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
```

### Normalize Nested Spans

```javascript
function normalizeNestedSpans(element) {
  const spans = element.querySelectorAll('span');
  spans.forEach(span => {
    // Check if span is nested unnecessarily
    if (span.parentElement.tagName === 'SPAN' && 
        span.parentElement.getAttribute('contenteditable') === 'true') {
      // Unwrap the nested span
      const parent = span.parentElement;
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      parent.removeChild(span);
    }
  });
}

editor.addEventListener('drop', (e) => {
  // ... handle drop ...
  normalizeNestedSpans(editor);
});
```

## Related Cases

- Case IDs will be added as cases are created for specific environment combinations

## References

- [Firefox Bug 1930277: Nested span creation on drag-and-drop](https://bugzilla.mozilla.org/show_bug.cgi?id=1930277) - Fixed in Firefox 134
- [Firefox Bug 1860328: Missing caret indicator on Linux during drag](https://bugzilla.mozilla.org/show_bug.cgi?id=1860328) - Fixed
- [Firefox Bug 1860324: Missing caret when dragging into iframe contenteditable](https://bugzilla.mozilla.org/show_bug.cgi?id=1860324) - Open
- [Firefox Bug 454832: Drag-drop between two contentEditable areas](https://bugzilla.mozilla.org/show_bug.cgi?id=454832) - Fixed
- [Stack Overflow: Drag and drop into contenteditable div in Firefox](https://stackoverflow.com/questions/9063111/drag-and-drop-into-contenteditable-div-in-firefox)
