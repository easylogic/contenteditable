---
id: tip-selection-restoration
title: "Perfecting Selection Restoration after DOM Sync"
category: "ux"
tags: ["selection", "caret", "rendering", "ux"]
status: "confirmed"
locale: "en"
---

## Summary
Restoring the caret position after a DOM update is one of the hardest parts of editor development. This tip provides a strategy to prevent cursor jumps and selection loss.

## The Problem
When you re-render a `contenteditable` element from your internal model, the browser loses the current `Selection`. If you simply call `selection.addRange()` after the update, the cursor might jump to the start of the line or flicker visibly, especially in Chrome.

## Best Practice: Logical Path Mapping
Instead of relying on absolute offsets, use a **Logical Path** (e.g., "Node at index 2, Text Offset 5") to find the correct DOM target after rendering.

### 1. Pre-update: Store the Path
Before the DOM is modified, find the logical position of the cursor in your Model.

### 2. Post-update: Re-map to DOM
After rendering, find the new DOM nodes that represent that logical path and manually set the range.

```javascript
function restoreSelection(editor, logicalPath) {
    const { node, offset } = findTargetDom(editor, logicalPath);
    
    const range = document.createRange();
    range.setStart(node, offset);
    range.collapse(true);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}
```

## Caveats
- **Inline Widgets**: If you have `contenteditable="false"` icons or widgets, ensure your path mapping logic accounts for their presence.
- **Android**: Selection API on Android is notoriously buggy during input. Consider delaying restoration until a `requestAnimationFrame` has fired.

## References
- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection)
- [W3C: Input Events and Selection Management](https://www.w3.org/TR/input-events-2/#selection)
