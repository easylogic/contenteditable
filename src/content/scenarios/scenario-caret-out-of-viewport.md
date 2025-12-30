---
id: scenario-caret-out-of-viewport
title: Caret position goes out of viewport unexpectedly
description: "The text caret (cursor) in contenteditable elements may move outside the visible viewport during editing operations, making it difficult for users to see where they are typing. This can happen during paste operations, formatting changes, or programmatic content updates."
category: selection
tags:
  - caret
  - cursor
  - viewport
  - scroll
status: draft
locale: en
---

The text caret (cursor) in contenteditable elements may move outside the visible viewport during editing operations, making it difficult for users to see where they are typing. This can happen during paste operations, formatting changes, or programmatic content updates.

## Observed Behavior

### Scenario 1: Pasting large content
- **Chrome/Edge**: Caret may end up outside viewport
- **Firefox**: Similar issue
- **Safari**: Caret position may be more unpredictable

### Scenario 2: Applying formatting
- **Chrome/Edge**: Caret may move outside viewport after formatting
- **Firefox**: Similar behavior
- **Safari**: More likely to lose caret position

### Scenario 3: Programmatic content updates
- **Chrome/Edge**: Caret position may not be maintained
- **Firefox**: Similar issues
- **Safari**: Caret position most likely to be lost

### Scenario 4: Undo/redo operations
- **Chrome/Edge**: Caret may move to unexpected position
- **Firefox**: Similar behavior
- **Safari**: Caret position restoration inconsistent

## Impact

- Users lose track of typing position
- Poor user experience
- Need to manually scroll to find cursor
- Difficulty implementing reliable editing features

## Browser Comparison

- **Chrome/Edge**: Generally better at maintaining caret visibility
- **Firefox**: More likely to lose caret position
- **Safari**: Most inconsistent caret position handling

## Workaround

Ensure caret stays in viewport:

```javascript
function ensureCaretVisible(element, range) {
  const rect = range.getBoundingClientRect();
  const containerRect = element.getBoundingClientRect();
  
  // Check if caret is outside viewport
  const isOutside = 
    rect.top < containerRect.top ||
    rect.bottom > containerRect.bottom ||
    rect.left < containerRect.left ||
    rect.right > containerRect.right;
  
  if (isOutside) {
    // Scroll caret into view
    range.getBoundingClientRect(); // Force layout
    
    // Use scrollIntoView with options
    const startNode = range.startContainer;
    if (startNode.nodeType === Node.TEXT_NODE) {
      startNode.parentElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    } else {
      startNode.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }
}

element.addEventListener('input', () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    requestAnimationFrame(() => {
      ensureCaretVisible(element, range);
    });
  }
});

// Also check after paste
element.addEventListener('paste', () => {
  setTimeout(() => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      ensureCaretVisible(element, range);
    }
  }, 0);
});
```

