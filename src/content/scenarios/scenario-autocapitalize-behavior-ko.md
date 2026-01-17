---
id: scenario-autocapitalize-behavior-ko
title: "autocapitalize 속성이 contenteditable에서 일관되지 않게 작동함"
description: "모바일 키보드에서 자동 대문자화를 제어하는 `autocapitalize` 속성이 contenteditable 요소에서 일관되지 않게 작동합니다. 동작이 표준 입력 요소와 다를 수 있습니다."
category: mobile
tags:
  - autocapitalize
  - mobile
  - ios
  - safari
status: draft
locale: ko
---

모바일 키보드에서 자동 대문자화를 제어하는 `autocapitalize` 속성이 contenteditable 요소에서 일관되지 않게 작동합니다. 동작이 표준 입력 요소와 다를 수 있습니다.

## 참고 자료

- [MDN: autocapitalize global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/autocapitalize) - autocapitalize documentation
- [MDN: HTMLElement.autoCapitalize](https://developer.mozilla.org/docs/Web/API/HTMLElement/autoCapitalize) - autoCapitalize property
- [WebKit Bug 148503: autocapitalize not supported on contenteditable](https://bugs.webkit.org/show_bug.cgi?id=148503) - iOS Safari support issues
- [WebKit Bug 287578: contenteditable-autocapitalize test flaky](https://bugs.webkit.org/show_bug.cgi?id=287578) - Test instability
- [Stack Overflow: Can autocapitalize be turned off with JavaScript?](https://stackoverflow.com/questions/1145880/can-autocapitalize-be-turned-off-with-javascript-in-mobile-safari) - JavaScript attribute handling
- [TutorialPedia: Disable spell checking](https://www.tutorialpedia.org/blog/disable-spell-checking-on-html-textfields/) - Related attributes
