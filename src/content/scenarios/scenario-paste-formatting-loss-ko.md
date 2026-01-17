---
id: scenario-paste-formatting-loss-ko
title: "contenteditable에 리치 텍스트를 붙여넣으면 마크업이 예상치 못하게 제거됨"
description: "리치 텍스트 소스(워드 프로세서나 웹 페이지 등)에서 contenteditable 요소로 콘텐츠를 붙여넣을 때 결과 DOM이 소스에 있던 제목, 리스트 또는 인라인 포맷팅을 손실합니다."
category: paste
tags:
  - paste
  - clipboard
  - formatting
status: draft
locale: ko
---

리치 텍스트 소스(워드 프로세서나 웹 페이지 등)에서
`contenteditable` 요소로 콘텐츠를 붙여넣을 때 결과 DOM이 소스에 있던 제목, 리스트 또는 인라인 포맷팅을 손실합니다.

이 시나리오는 여러 환경에서 유사한 동작으로 관찰되었습니다.

## 참고 자료

- [Stack Overflow: Paste rich text and only keep bold and italics](https://stackoverflow.com/questions/21257688/paste-rich-text-into-content-editable-div-and-only-keep-bold-and-italics-formatt) - Formatting preservation strategies
- [ExchangeTuts: Converting rich text to plain text when pasting](https://exchangetuts.com/converting-rich-text-to-plain-text-when-pasting-in-contenteditable-div-duplicate-1641521344433132) - Clipboard API usage
- [Namchee: The quest for perfect freeform input](https://www.namchee.dev/posts/the-quest-for-perfect-freeform-input/) - Paste handling patterns
- [Syncfusion: Rich Text Editor paste cleanup](https://ej2.syncfusion.com/javascript/documentation/rich-text-editor/paste-cleanup) - Editor paste cleanup documentation
- [MDN: Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) - Official Clipboard API documentation
