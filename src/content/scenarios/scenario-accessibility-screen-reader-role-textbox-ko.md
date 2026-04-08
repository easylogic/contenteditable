---
id: scenario-accessibility-screen-reader-role-textbox-ko
title: "role=textbox와 스크린 리더 (contenteditable)"
description: "role=textbox·aria-multiline을 쓰면 보조 기술이 contenteditable을 텍스트 상자처럼 다루는데, 실제 HTML·브라우저 AX 트리와 어긋나 알림이 혼란스러울 수 있습니다."
category: accessibility
tags:
  - a11y
  - aria
  - screen-reader
  - contenteditable
status: draft
locale: ko
---

`role="textbox"`·`aria-multiline`을 쓰면 보조 기술이 `contenteditable`을 **텍스트 상자**처럼 다루는데, 실제 HTML·브라우저 **AX** 트리와 어긋나 알림이 혼란스러울 수 있습니다.

## 관련 케이스

- [ce-0323](ce-0323-accessibility-screen-reader-role-textbox)

## 참고 자료

- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
