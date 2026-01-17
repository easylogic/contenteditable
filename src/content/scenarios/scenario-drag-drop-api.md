---
id: scenario-drag-drop-api
title: Drag and Drop API behavior differs in contenteditable
description: "When using the HTML5 Drag and Drop API with contenteditable elements, the behavior differs from standard elements. Dragging text within a contenteditable may not work as expected, and drop zones may not be recognized correctly."
category: other
tags:
  - drag-drop
  - api
  - chrome
  - macos
status: draft
locale: en
---

When using the HTML5 Drag and Drop API with contenteditable elements, the behavior differs from standard elements. Dragging text within a contenteditable may not work as expected, and drop zones may not be recognized correctly.

## References

- [MDN: HTML Drag and Drop API - Recommended drag types](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types) - Data transfer types
- [MDN: HTML Drag and Drop API - Drag operations](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations) - Effect allowed and dropEffect
- [MDN: contenteditable global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/contenteditable) - contenteditable="plaintext-only"
- [Stack Overflow: Precise drag and drop within contenteditable](https://stackoverflow.com/questions/14678451/precise-drag-and-drop-within-a-contenteditable) - Drop position detection
- [Stack Overflow: Remove default styles from draggable content](https://stackoverflow.com/questions/43491536/remove-default-styles-from-draggable-content-inside-of-contenteditable-div) - Formatting preservation
