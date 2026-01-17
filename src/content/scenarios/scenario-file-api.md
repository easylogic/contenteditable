---
id: scenario-file-api
title: File API drag and drop does not work in contenteditable
description: When trying to drag and drop files into a contenteditable element, the File API may not work as expected. File drop events may not fire, or file content may not be accessible.
category: other
tags:
  - file-api
  - drag-drop
  - safari
  - macos
status: draft
locale: en
---

When trying to drag and drop files into a contenteditable element, the File API may not work as expected. File drop events may not fire, or file content may not be accessible.

## References

- [WebKit Bug 57185: drop event not fired for contenteditable](https://bugs.webkit.org/show_bug.cgi?id=57185) - Drop event issues
- [WebKit Mailing List: DataTransfer items empty during dragover](https://lists.webkit.org/pipermail/webkit-unassigned/2021-March/970455.html) - File type detection issues
- [Apple Developer: Safari drag and drop](https://developer.apple.com/library/archive/documentation/AppleApplications/Conceptual/SafariJSProgTopics/DragAndDrop.html) - Safari behavior
- [MDN: File drag and drop](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop) - File drag and drop guide
- [Stack Overflow: Drag and drop event in contenteditable](https://stackoverflow.com/questions/7280738/drag-and-drop-event-in-a-contenteditable-element) - Event handling
