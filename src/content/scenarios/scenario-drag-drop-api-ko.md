---
id: scenario-drag-drop-api-ko
title: Drag and Drop API 동작이 contenteditable에서 다름
description: "contenteditable 요소에서 HTML5 Drag and Drop API를 사용할 때 동작이 표준 요소와 다릅니다. contenteditable 내에서 텍스트를 드래그하는 것이 예상대로 작동하지 않을 수 있으며 드롭 영역이 올바르게 인식되지 않을 수 있습니다."
category: other
tags:
  - drag-drop
  - api
  - chrome
  - macos
status: draft
locale: ko
---

contenteditable 요소에서 HTML5 Drag and Drop API를 사용할 때 동작이 표준 요소와 다릅니다. contenteditable 내에서 텍스트를 드래그하는 것이 예상대로 작동하지 않을 수 있으며 드롭 영역이 올바르게 인식되지 않을 수 있습니다.

## 참고 자료

- [MDN: HTML Drag and Drop API - Recommended drag types](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types) - 데이터 전송 타입
- [MDN: HTML Drag and Drop API - Drag operations](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations) - Effect allowed 및 dropEffect
- [MDN: contenteditable global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/contenteditable) - contenteditable="plaintext-only"
- [Stack Overflow: Precise drag and drop within contenteditable](https://stackoverflow.com/questions/14678451/precise-drag-and-drop-within-a-contenteditable) - 드롭 위치 감지
- [Stack Overflow: Remove default styles from draggable content](https://stackoverflow.com/questions/43491536/remove-default-styles-from-draggable-content-inside-of-contenteditable-div) - 포맷팅 보존
