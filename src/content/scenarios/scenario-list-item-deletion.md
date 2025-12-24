---
id: scenario-list-item-deletion
title: List item deletion behavior varies across browsers
description: "When pressing Backspace or Delete at the beginning or end of a list item, the behavior varies significantly across browsers. Some browsers delete the list item and merge with adjacent content, while others may delete the entire list or create unexpected DOM structures."
category: formatting
tags:
  - list
  - deletion
  - backspace
  - delete
  - browser-compatibility
status: draft
---

When pressing Backspace or Delete at the beginning or end of a list item (`<li>`), the behavior varies significantly across browsers. Some browsers delete the list item and merge with adjacent content, while others may delete the entire list or create unexpected DOM structures.

## Observed Behavior

### Scenario 1: Backspace at the beginning of first list item
- **Chrome/Edge**: Deletes the list item and converts it to a paragraph, or merges with previous content
- **Firefox**: May delete the entire list or create nested structures
- **Safari**: Behavior may differ, sometimes creating empty list items

### Scenario 2: Delete at the end of last list item
- **Chrome/Edge**: Deletes the list item and merges with following content
- **Firefox**: May delete the list item or the entire list
- **Safari**: May create unexpected DOM structures

### Scenario 3: Backspace on empty list item
- **Chrome/Edge**: Removes the list item, may remove the entire list if it's the last item
- **Firefox**: May remove the list item or create empty paragraphs
- **Safari**: Behavior varies

## Impact

- Inconsistent user experience across browsers
- Unexpected DOM structure changes
- Loss of list formatting when users expect to delete text
- Difficulty in implementing consistent list editing behavior

## Browser Comparison

- **Chrome/Edge**: Generally more predictable, converts list items to paragraphs when appropriate
- **Firefox**: May be more aggressive in removing list structure
- **Safari**: Behavior can be inconsistent, sometimes creating malformed HTML

## Workaround

When handling list item deletion, intercept `beforeinput` events and implement custom deletion logic:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const listItem = range.startContainer.closest('li');
    
    if (listItem) {
      // Check if cursor is at the beginning/end of list item
      const isAtStart = range.startOffset === 0 && 
                       range.startContainer === listItem.firstChild;
      const isAtEnd = range.endOffset === (range.endContainer.textContent?.length || 0) &&
                      range.endContainer === listItem.lastChild;
      
      if (isAtStart || isAtEnd) {
        e.preventDefault();
        // Implement custom list item deletion logic
        handleListItemDeletion(listItem, e.inputType);
      }
    }
  }
});
```

