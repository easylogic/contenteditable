---
id: scenario-insertHTML-behavior-ko
title: insertHTML이 DOM 구조와 포맷팅을 손상시킴
description: "contenteditable 영역에 HTML 콘텐츠를 삽입하기 위해 document.execCommand('insertHTML', ...)를 사용할 때 DOM 구조가 손상되거나 예상치 못하게 재포맷될 수 있습니다. 중첩된 요소가 평탄화되거나 재구성될 수 있습니다."
category: formatting
tags:
  - insertHTML
  - dom
  - formatting
  - chrome
status: draft
locale: ko
---

`document.execCommand('insertHTML', ...)`를 사용하여 contenteditable 영역에 HTML 콘텐츠를 삽입할 때 DOM 구조가 손상되거나 예상치 못하게 재포맷될 수 있습니다. 중첩된 요소가 평탄화되거나 재구성될 수 있습니다.

## 참고 자료

- [W3C Editing: execCommand insertHTML](https://w3c.github.io/editing/docs/execCommand/) - execCommand specification
- [Stack Overflow: Chrome execCommand insertHTML behavior](https://stackoverflow.com/questions/23354903/chrome-execcommandinserthtml-behavior) - Attribute stripping issues
- [Stack Overflow: Weird behaviour with execCommand insertHTML](https://stackoverflow.com/questions/66272074/weird-behaviour-with-document-execcommandinserthtml) - Nested element issues
- [Stack Overflow: Keep execCommand insertHTML from removing attributes](https://stackoverflow.com/questions/25941559/is-there-a-way-to-keep-execcommandinserthtml-from-removing-attributes-in-chr) - Range API alternatives
