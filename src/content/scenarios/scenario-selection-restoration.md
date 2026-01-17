---
id: scenario-selection-restoration
title: Selection restoration after DOM manipulation is unreliable
description: "After programmatically manipulating the DOM in a contenteditable element, restoring the text selection (cursor position) is unreliable across browsers. The selection may be lost, moved to an incorrect position, or become invalid."
category: selection
tags:
  - selection
  - range
  - cursor
  - dom-manipulation
status: draft
locale: en
---

After programmatically manipulating the DOM in a contenteditable element, restoring the text selection (cursor position) is unreliable across browsers. The selection may be lost, moved to an incorrect position, or become invalid.

## Observed Behavior

### Scenario 1: Inserting content programmatically
- **Chrome/Edge**: Selection may be lost or moved
- **Firefox**: Selection restoration more unreliable
- **Safari**: Selection most likely to be lost

### Scenario 2: Replacing content
- **Chrome/Edge**: Selection may become invalid
- **Firefox**: Similar issues
- **Safari**: Selection restoration inconsistent

### Scenario 3: Wrapping content in elements
- **Chrome/Edge**: Selection may move inside new element
- **Firefox**: Selection position unpredictable
- **Safari**: Most inconsistent behavior

### Scenario 4: Removing and re-adding elements
- **Chrome/Edge**: Selection may be lost completely
- **Firefox**: Similar issues
- **Safari**: Selection restoration most unreliable

## Impact

- Loss of cursor position after operations
- Poor user experience
- Difficulty implementing reliable editing features
- Need for complex selection restoration logic

## Browser Comparison

- **Chrome/Edge**: Generally better selection restoration
- **Firefox**: More likely to lose selection
- **Safari**: Most unreliable selection restoration

## Workaround

Implement robust selection restoration:

```javascript
function saveSelection() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  
  const range = selection.getRangeAt(0);
  return {
    startContainer: range.startContainer,
    startOffset: range.startOffset,
    endContainer: range.endContainer,
    endOffset: range.endOffset,
    commonAncestorContainer: range.commonAncestorContainer
  };
}

function restoreSelection(saved) {
  if (!saved) return false;
  
  try {
    const range = document.createRange();
    range.setStart(saved.startContainer, saved.startOffset);
    range.setEnd(saved.endContainer, saved.endOffset);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  } catch (e) {
    // Selection is invalid, try to find nearest valid position
    return restoreSelectionFallback(saved);
  }
}

function restoreSelectionFallback(saved) {
  // Find the common ancestor
  let node = saved.commonAncestorContainer;
  
  // Walk up to find a valid text node or element
  while (node && node.nodeType !== Node.TEXT_NODE && node.nodeType !== Node.ELEMENT_NODE) {
    node = node.parentNode;
  }
  
  if (!node) return false;
  
  try {
    const range = document.createRange();
    if (node.nodeType === Node.TEXT_NODE) {
      const length = node.textContent.length;
      range.setStart(node, Math.min(saved.startOffset, length));
      range.setEnd(node, Math.min(saved.endOffset, length));
    } else {
      range.selectNodeContents(node);
      range.collapse(true);
    }
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  } catch (e) {
    return false;
  }
}

// Use before DOM manipulation
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' || e.inputType === 'insertParagraph') {
    const saved = saveSelection();
    e.savedSelection = saved; // Store for later restoration
  }
});

// Restore after manipulation
function manipulateDOM(callback) {
  const saved = saveSelection();
  callback();
  
  // Restore selection after DOM updates
  requestAnimationFrame(() => {
    if (!restoreSelection(saved)) {
      restoreSelectionFallback(saved);
    }
  });
}
```

## References

- [Stack Overflow: Reset cursor position after DOM change](https://stackoverflow.com/questions/6329487/reset-cursor-position-in-content-editable-after-dom-change) - Cursor restoration
- [Stack Overflow: contenteditable div issue when restore saving selection](https://stackoverflow.com/questions/16604213/contenteditable-div-issue-when-restore-saving-selection) - Selection saving issues
- [Stack Overflow: Saving and restoring caret position](https://stackoverflow.com/questions/4576694/saving-and-restoring-caret-position-for-contenteditable-div) - Character offset method
- [Stack Overflow: Preserve cursor position when changing innerHTML](https://stackoverflow.com/questions/62232111/preserve-cursor-position-when-changing-innerhtml-in-a-contenteditable-div) - Timing considerations
