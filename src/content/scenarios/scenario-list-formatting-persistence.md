---
id: scenario-list-formatting-persistence
title: List formatting is lost when editing list items
description: "When editing text within list items, formatting such as bold, italic, or links may be lost or behave unexpectedly. The list structure itself may also be lost when certain operations are performed, such as pasting content or applying formatting."
category: formatting
tags:
  - list
  - formatting
  - paste
  - bold
  - italic
status: draft
---

When editing text within list items, formatting such as bold, italic, or links may be lost or behave unexpectedly. The list structure itself may also be lost when certain operations are performed, such as pasting content or applying formatting.

## Observed Behavior

### Scenario 1: Applying bold formatting to text in a list item
- **Chrome/Edge**: Formatting is applied, but may be lost when pressing Enter to create a new list item
- **Firefox**: Formatting may not persist when editing list items
- **Safari**: Formatting can be lost unexpectedly

### Scenario 2: Pasting formatted content into a list item
- **Chrome/Edge**: May preserve formatting but lose list structure
- **Firefox**: May convert list items to paragraphs
- **Safari**: May create unexpected nested structures

### Scenario 3: Pasting a list into another list
- **Chrome/Edge**: May create nested lists or flatten the structure
- **Firefox**: May lose the nested list structure
- **Safari**: May create malformed HTML

### Scenario 4: Applying formatting across multiple list items
- **Chrome/Edge**: May break the list structure
- **Firefox**: May convert list items to paragraphs
- **Safari**: Behavior is inconsistent

## Impact

- Loss of formatting when editing lists
- Unexpected list structure changes
- Difficulty maintaining consistent list appearance
- User frustration when formatting is lost

## Browser Comparison

- **Chrome/Edge**: Generally better at preserving formatting, but list structure may be affected
- **Firefox**: More likely to lose formatting or list structure
- **Safari**: Most inconsistent behavior

## Workaround

Intercept formatting operations and ensure list structure is preserved:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'formatBold' || e.inputType === 'formatItalic') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const listItems = Array.from(range.commonAncestorContainer.closest('ul, ol')?.querySelectorAll('li') || [])
      .filter(li => range.intersectsNode(li));
    
    if (listItems.length > 0) {
      e.preventDefault();
      // Apply formatting while preserving list structure
      applyFormattingToSelection(e.inputType, range, listItems);
    }
  }
});

element.addEventListener('paste', (e) => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  const listItem = range.startContainer.closest('li');
  
  if (listItem) {
    e.preventDefault();
    // Handle paste in list item, preserving list structure
    handlePasteInListItem(e.clipboardData, range, listItem);
  }
});
```

