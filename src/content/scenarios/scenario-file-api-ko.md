---
id: scenario-file-api-ko
title: "File API 드래그 앤 드롭이 contenteditable에서 작동하지 않음"
description: "contenteditable 요소에 파일을 드래그 앤 드롭하려고 할 때 File API가 예상대로 작동하지 않을 수 있습니다. 파일 드롭 이벤트가 발생하지 않거나 파일 콘텐츠에 액세스할 수 없을 수 있습니다."
category: other
tags:
  - file-api
  - drag-drop
  - safari
  - macos
status: draft
locale: ko
---

contenteditable 요소에 파일을 드래그 앤 드롭하려고 할 때 File API가 예상대로 작동하지 않을 수 있습니다. 파일 드롭 이벤트가 발생하지 않거나 파일 콘텐츠에 액세스할 수 없을 수 있습니다.

## 참고 자료

- [WebKit Bug 57185: drop event not fired for contenteditable](https://bugs.webkit.org/show_bug.cgi?id=57185) - Drop event issues
- [WebKit Mailing List: DataTransfer items empty during dragover](https://lists.webkit.org/pipermail/webkit-unassigned/2021-March/970455.html) - File type detection issues
- [Apple Developer: Safari drag and drop](https://developer.apple.com/library/archive/documentation/AppleApplications/Conceptual/SafariJSProgTopics/DragAndDrop.html) - Safari behavior
- [MDN: File drag and drop](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop) - File drag and drop guide
- [Stack Overflow: Drag and drop event in contenteditable](https://stackoverflow.com/questions/7280738/drag-and-drop-event-in-a-contenteditable-element) - Event handling
