---
id: scenario-drag-drop-behavior
title: Drag and drop of text within contenteditable does not work as expected
description: "Dragging selected text within a contenteditable region to move it to a different position does not work consistently. Sometimes the text is copied instead of moved, or the drop target is not where the mouse pointer indicates."
category: selection
tags:
  - drag-drop
  - selection
  - chrome
status: draft
locale: en
---

Dragging selected text within a contenteditable region to move it to a different position does not work consistently. Sometimes the text is copied instead of moved, or the drop target is not where the mouse pointer indicates.

## References

- [Firefox Bug 1860328: Caret not showing after drag drop](https://bugzilla.mozilla.org/show_bug.cgi?id=1860328) - Linux Firefox caret issues
- [Firefox Bug 1930277: Nested span tags from drag](https://bugzilla.mozilla.org/show_bug.cgi?id=1930277) - Span nesting issues
- [Stack Overflow: Remove default styles from draggable content](https://stackoverflow.com/questions/43491536/remove-default-styles-from-draggable-content-inside-of-contenteditable-div) - Default behavior issues
- [Stack Overflow: Drag drop image deletes first letter](https://stackoverflow.com/questions/15120517/drag-drop-image-onto-text-in-contenteditable-div-deletes-first-letter-of-word) - Character deletion issues
- [Stack Overflow: Drag and drop event in contenteditable](https://stackoverflow.com/questions/7280738/drag-and-drop-event-in-a-contenteditable-element) - Event handling
