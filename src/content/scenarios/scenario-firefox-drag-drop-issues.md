---
id: scenario-firefox-drag-drop-issues
title: "Firefox Drag and Drop failures in contenteditable"
description: "Analysis of Firefox's inconsistent handling of native Drag-and-Drop operations within editable containers."
category: "drag-drop"
tags: ["firefox", "drag-drop", "ux", "reliability"]
status: "confirmed"
locale: "en"
---

## Problem Overview
Drag-and-Drop (DnD) within `contenteditable` is a complex interaction involving the `DataTransfer` API and internal DOM mutations. While Chromium and WebKit have converged on a "move" behavior that dispatches specific `beforeinput` types (like `deleteByDrag`), Firefox often fails to execute the default action. This leaves the text at the source and provides no automated way to teleport it to the destination.

## Observed Behavior
### Scenario 1: Intra-Editor Move Failure
In recent versions (v130+), selecting a text fragment and dragging it within the same editor results in a visual ghost but no actual DOM mutation upon drop.

```javascript
/* Observer Sequence */
element.addEventListener('dragstart', (e) => {
    console.log('1. Drag started'); // Fires
});
element.addEventListener('drop', (e) => {
    console.log('2. Drop fired'); // Fires, but default action is skipped by Engine
});
```

### Scenario 2: Nested Structure Corruption
Dragging content into or out of nested `<span>` elements often causes Firefox to generate redundant wrapper nodes, breaking the logical tree of the editor.

## Impact
- **Broken User Intuition**: Modern web users expect editors to behave like native word processors (Word, Pages).
- **History Divergence**: If a framework manually handles the drop but the browser (eventually) performs a partial move, the undo history becomes corrupted.

## Browser Comparison
- **Gecko (Firefox)**: Significant inconsistency. Requires manual implementation of the "move" logic via `DataTransfer`.
- **Blink (Chrome/Edge)**: Highly reliable. Handles `beforeinput` (deleteByDrag/insertFromDrop) natively.
- **WebKit (Safari)**: Reliable on Desktop; limited support for complex DnD on iOS.

## Solutions
### 1. The "Manual Teleport" Strategy
Explicitly set and get the plain text/HTML in the data transfer object to ensure cross-platform compatibility.

```javascript
element.addEventListener('dragstart', (e) => {
    const range = window.getSelection().getRangeAt(0);
    e.dataTransfer.setData('text/plain', range.toString());
    e.dataTransfer.effectAllowed = 'move';
});

element.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const targetRange = document.caretRangeFromPoint(e.clientX, e.clientY);
    
    // Explicitly delete source and insert at target
    // Warning: Requires custom transaction handling in frameworks like Lexical
    moveFragment(sourceRange, targetRange, data);
});
```

## Related Cases
- [ce-0569: Drag and drop of text fails to move content](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0569-firefox-drag-drop-text-failure.md)

## References
- [Mozilla Bugzilla #1898711](https://bugzilla.mozilla.org/show_bug.cgi?id=1898711)
- [Lexical Issue #8014](https://github.com/facebook/lexical/issues/8014)
