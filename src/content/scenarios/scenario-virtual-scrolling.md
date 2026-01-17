---
id: scenario-virtual-scrolling
title: Virtual scrolling libraries interfere with contenteditable selection
description: "When a contenteditable element is used with virtual scrolling libraries (e.g., for large documents), the virtual scrolling mechanism may interfere with text selection and caret positioning. The selection may be lost when elements are removed from the DOM during scrolling."
category: performance
tags:
  - virtual-scrolling
  - performance
  - selection
  - chrome
  - macos
status: draft
locale: en
---

When a contenteditable element is used with virtual scrolling libraries (e.g., for large documents), the virtual scrolling mechanism may interfere with text selection and caret positioning. The selection may be lost when elements are removed from the DOM during scrolling.

## References

- [TipTap Issue #2629: iOS Safari selection visible after scroll](https://github.com/ueberdosis/tiptap/issues/2629) - iOS Safari selection bugs
- [Stack Overflow: Saving and restoring caret position](https://stackoverflow.com/questions/4576694/saving-and-restoring-caret-position-for-contenteditable-div) - Caret restoration patterns
- [ProseMirror: Documentation](https://prosemirror.net/docs/ref/) - Logical position system
- [NPM: use-editable](https://www.npmjs.com/package/use-editable/v/1.2.0) - React hook for caret preservation
