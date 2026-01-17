---
id: scenario-selection-api-behavior-ko
title: contenteditable이 포커스를 잃으면 window.getSelection()이 null을 반환함
description: "contenteditable 영역이 포커스를 잃으면 Safari에서 window.getSelection()이 null을 반환할 수 있으며, 포커스 손실 전에 유효한 선택이 있었더라도 그렇습니다. 이것은 선택을 보존하거나 작업하기 어렵게 만듭니다."
category: selection
tags:
  - selection
  - api
  - focus
  - safari
status: draft
locale: ko
---

contenteditable 영역이 포커스를 잃으면 Safari에서 `window.getSelection()`이 `null`을 반환할 수 있으며, 포커스 손실 전에 유효한 선택이 있었더라도 그렇습니다. 이것은 선택을 보존하거나 작업하기 어렵게 만듭니다.

## 참고 자료

- [Stack Overflow: contenteditable div loses selection when another input focuses](https://stackoverflow.com/questions/12778508/contenteditable-div-loses-selection-when-another-input-focuses) - Selection preservation techniques
- [Stack Overflow: Safari getSelection not working](https://stackoverflow.com/questions/35281283/safari-getselection-not-working) - Selection API issues
- [Stack Overflow: window.getSelection returns no range in Safari after onclick](https://stackoverflow.com/questions/47299847/window-getselection-returns-no-range-in-safari-after-onclick) - Event timing issues
- [Stack Overflow: Losing focus in contenteditable in Safari](https://stackoverflow.com/questions/24215428/losing-focus-in-contenteditable-in-safari) - Focus management
