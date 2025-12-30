---
id: scenario-image-deletion
title: Image deletion behavior varies across browsers
description: "Deleting images from contenteditable elements behaves differently across browsers. Some browsers delete the image cleanly, while others may leave empty elements, break the DOM structure, or require multiple delete operations."
category: formatting
tags:
  - image
  - deletion
  - backspace
  - delete
status: draft
locale: en
---

Deleting images from contenteditable elements behaves differently across browsers. Some browsers delete the image cleanly, while others may leave empty elements, break the DOM structure, or require multiple delete operations.

## Observed Behavior

### Scenario 1: Selecting and deleting an image
- **Chrome/Edge**: Image is deleted, but may leave empty parent elements
- **Firefox**: May delete image or require multiple operations
- **Safari**: Behavior varies, may break DOM structure

### Scenario 2: Backspace on selected image
- **Chrome/Edge**: Deletes image, cursor position may be unexpected
- **Firefox**: May delete image or move cursor unexpectedly
- **Safari**: Behavior inconsistent

### Scenario 3: Delete key on selected image
- **Chrome/Edge**: Deletes image forward
- **Firefox**: Similar behavior
- **Safari**: May behave differently

### Scenario 4: Empty image elements
- **Chrome/Edge**: May create empty `<img>` tags or wrapper divs
- **Firefox**: Similar issues
- **Safari**: May create different empty structures

## Impact

- Inconsistent deletion experience
- Risk of creating malformed HTML
- Empty elements left in DOM
- Cursor position issues after deletion

## Browser Comparison

- **Chrome/Edge**: Generally deletes images but may leave empty elements
- **Firefox**: More likely to leave empty structures
- **Safari**: Most inconsistent behavior

## Workaround

Implement custom image deletion handling:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const img = range.startContainer.nodeType === Node.ELEMENT_NODE 
      ? range.startContainer.querySelector('img')
      : range.startContainer.parentElement?.querySelector('img');
    
    if (img && (range.intersectsNode(img) || selection.containsNode(img, true))) {
      e.preventDefault();
      
      // Clean up image and any empty wrapper elements
      const parent = img.parentElement;
      img.remove();
      
      // Remove empty wrapper divs
      if (parent && parent.tagName !== 'BODY' && 
          (!parent.textContent || parent.textContent.trim() === '') &&
          parent.children.length === 0) {
        parent.remove();
      }
      
      // Set cursor position after deletion
      const newRange = document.createRange();
      if (parent && parent.nextSibling) {
        newRange.setStartBefore(parent.nextSibling);
      } else if (parent && parent.previousSibling) {
        newRange.setStartAfter(parent.previousSibling);
      } else {
        newRange.setStart(parent || element, 0);
      }
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }
});
```

