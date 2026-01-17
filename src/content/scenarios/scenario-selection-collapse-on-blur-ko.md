---
id: scenario-selection-collapse-on-blur-ko
title: "contenteditable 외부를 클릭하면 선택이 예상치 못하게 축소됨"
description: "`contenteditable` 요소 내부에서 텍스트 범위가 선택되어 있을 때 요소 외부를 클릭하면 선택이 완전히 지워지는 대신 편집 가능한 영역 내부의 캐럿 위치로 축소됩니다."
category: selection
tags:
  - selection
  - caret
status: draft
locale: ko
---

`contenteditable` 요소 내부에서 텍스트 범위가 선택되어 있을 때 요소 외부를 클릭하면
선택이 완전히 지워지는 대신 편집 가능한 영역 내부의 캐럿 위치로 축소됩니다.

## 참고 자료

- [Stack Overflow: contenteditable div loses selection when input focuses](https://stackoverflow.com/questions/12778508/contenteditable-div-loses-selection-when-another-input-focuses) - Focus loss issues
- [Stack Overflow: Selection collapses when clicking button](https://stackoverflow.com/questions/71633329/selection-in-contenteditable-div-collapses-as-soon-as-i-click-a-button) - Button click issues
- [Stack Overflow: Keep text selected when element loses focus](https://stackoverflow.com/questions/28148742/how-to-keep-text-selected-in-a-contenteditable-element-when-the-element-loses-fo) - Selection preservation
- [Stack Overflow: contenteditable div issue when restore saving selection](https://stackoverflow.com/questions/16604213/contenteditable-div-issue-when-restore-saving-selection) - Selection restoration
- [jQuery UI Bug #11145: Safari selection issues](https://bugs.jqueryui.com/ticket/11145/) - Browser differences
