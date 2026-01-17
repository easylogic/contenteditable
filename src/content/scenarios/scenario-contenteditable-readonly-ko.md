---
id: scenario-contenteditable-readonly-ko
title: 자식 요소의 contenteditable="false"가 일관되게 존중되지 않음
description: "contenteditable 영역에 contenteditable=\"false\"가 있는 자식 요소가 포함되어 있을 때 동작이 일관되지 않습니다. 일부 브라우저는 이러한 요소 내에서 편집을 허용하지만 다른 브라우저는 올바르게 방지합니다."
category: other
tags:
  - readonly
  - nested
  - contenteditable
  - chrome
status: draft
locale: ko
---

contenteditable 영역에 `contenteditable="false"`가 있는 자식 요소가 포함되어 있을 때 동작이 일관되지 않습니다. 일부 브라우저는 이러한 요소 내에서 편집을 허용하지만 다른 브라우저는 올바르게 방지합니다.

## 참고 자료

- [MDN: contenteditable global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable) - contenteditable 문서
- [Stack Overflow: contenteditable false inside contenteditable true IE8](https://stackoverflow.com/questions/7522848/contenteditable-false-inside-contenteditable-true-block-is-still-editable-in-ie8) - IE8 이슈
- [Microsoft Learn: UWP WebView contenteditable false](https://learn.microsoft.com/en-us/answers/questions/1316427/when-we-set-contenteditable-false-inside-contented) - WebView 이슈
