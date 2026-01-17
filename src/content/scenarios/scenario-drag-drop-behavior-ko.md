---
id: scenario-drag-drop-behavior-ko
title: contenteditable 내에서 텍스트 드래그 앤 드롭이 예상대로 작동하지 않음
description: "contenteditable 영역 내에서 선택한 텍스트를 다른 위치로 이동하기 위해 드래그하는 것이 일관되게 작동하지 않습니다. 때로는 텍스트가 이동하는 대신 복사되거나 드롭 대상이 마우스 포인터가 나타내는 위치가 아닐 수 있습니다."
category: selection
tags:
  - drag-drop
  - selection
  - chrome
status: draft
locale: ko
---

contenteditable 영역 내에서 선택한 텍스트를 다른 위치로 이동하기 위해 드래그하는 것이 일관되게 작동하지 않습니다. 때로는 텍스트가 이동하는 대신 복사되거나 드롭 대상이 마우스 포인터가 나타내는 위치가 아닐 수 있습니다.

## 참고 자료

- [Firefox Bug 1860328: Caret not showing after drag drop](https://bugzilla.mozilla.org/show_bug.cgi?id=1860328) - Linux Firefox 커서 이슈
- [Firefox Bug 1930277: Nested span tags from drag](https://bugzilla.mozilla.org/show_bug.cgi?id=1930277) - Span 중첩 이슈
- [Stack Overflow: Remove default styles from draggable content](https://stackoverflow.com/questions/43491536/remove-default-styles-from-draggable-content-inside-of-contenteditable-div) - 기본 동작 이슈
- [Stack Overflow: Drag drop image deletes first letter](https://stackoverflow.com/questions/15120517/drag-drop-image-onto-text-in-contenteditable-div-deletes-first-letter-of-word) - 문자 삭제 이슈
- [Stack Overflow: Drag and drop event in contenteditable](https://stackoverflow.com/questions/7280738/drag-and-drop-event-in-a-contenteditable-element) - 이벤트 처리
