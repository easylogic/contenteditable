---
id: scenario-double-line-break-ko
title: "contenteditable에서 Enter를 누르면 두 개의 줄바꿈이 삽입됨"
description: "일반 `contenteditable` 요소에서 Enter를 누르면 하나 대신 두 개의 보이는 줄바꿈이 삽입됩니다."
category: other
tags:
  - enter
  - newline
status: draft
locale: ko
---

일반 `contenteditable` 요소에서 Enter를 누르면 하나 대신 두 개의 보이는 줄바꿈이 삽입됩니다.
결과 DOM에는 추가 빈 줄로 렌더링되는 중첩된 `<div>` 또는 `<br>` 요소가 포함됩니다.

이 시나리오는 유사한 동작으로 여러 환경에서 관찰되었습니다.

## 참고 자료

- [MDN: Editable content guide](https://mdn2.netlify.app/en-us/docs/web/guide/html/editable_content/) - Firefox 동작 변경
- [Stack Overflow: contenteditable in Firefox creates 2 newlines](https://stackoverflow.com/questions/52817606/contenteditable-in-firefox-creates-2-newlines-instead-of-1) - 이중 줄바꿈 이슈
- [Stack Overflow: Prevent contenteditable adding div on Enter](https://stackoverflow.com/questions/18552336/prevent-contenteditable-adding-div-on-enter-chrome) - plaintext-only 모드
