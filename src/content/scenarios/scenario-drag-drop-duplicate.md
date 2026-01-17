---
id: scenario-drag-drop-duplicate
title: Drag and drop causes element duplication
description: "Dragging elements with contenteditable='false' within a contenteditable container can result in duplicate elements upon dropping in certain browsers, instead of moving the element."
category: drag-drop
tags:
  - drag-drop
  - contenteditable-false
  - duplicate
  - nested
status: draft
locale: en
---

Dragging elements with `contenteditable="false"` within a `contenteditable` container can result in duplicate elements upon dropping in certain browsers, instead of moving the element.

## Observed Behavior

1. **Element duplication**: Dragging creates a duplicate instead of moving
2. **Original remains**: The original element stays in its position
3. **Copy created**: A copy is created at the drop location
4. **Browser-specific**: This issue manifests in Firefox but not Chrome

## Browser Comparison

- **Firefox**: Elements are duplicated (this issue)
- **Chrome**: Elements are moved correctly
- **Safari**: Elements are moved correctly
- **Edge**: Elements are moved correctly

## Impact

- **Data integrity**: Unintended element duplication
- **User confusion**: Users may not understand why elements are duplicated
- **Content corruption**: Multiple duplicates can accumulate over time
- **Performance**: Duplicate elements can impact performance

## Workarounds

### Prevent default behavior

Call `event.preventDefault()` in drag event handlers:

```javascript
element.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', ' ');
  e.dataTransfer.effectAllowed = 'move';
});

element.addEventListener('drop', (e) => {
  e.preventDefault();
  // Manual cleanup: remove original element
  if (draggedElement && draggedElement.parentNode) {
    draggedElement.parentNode.removeChild(draggedElement);
  }
});
```

### Custom drag handler

Implement custom drag-and-drop logic to control behavior:

```javascript
let draggedElement = null;

element.addEventListener('dragstart', (e) => {
  draggedElement = element;
  e.dataTransfer.setData('text/plain', ' ');
});

element.addEventListener('drop', (e) => {
  e.preventDefault();
  
  if (draggedElement) {
    const clone = draggedElement.cloneNode(true);
    // Insert clone at drop position
    // Remove original element
    draggedElement.parentNode.removeChild(draggedElement);
  }
});
```

## References

- [Stack Overflow: TinyMCE drag and drop contenteditable false on Firefox produces duplicate](https://stackoverflow.com/questions/72302746/tinymce-drag-and-drop-contenteditable-false-on-firefox-produce-duplicate-eleme) - Firefox duplication issue
- [ProseMirror Issue #1208: Drag and drop duplicate elements](https://github.com/ProseMirror/prosemirror/issues/1208) - Related drag-drop issues
