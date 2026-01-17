---
id: scenario-spellcheck-behavior-ko
title: 맞춤법 검사가 contenteditable 편집을 간섭함
description: "Safari에서 contenteditable 영역에 spellcheck=\"true\"가 활성화되면 맞춤법 검사 기능이 정상 편집을 간섭할 수 있습니다. 빨간 밑줄이 잘못 나타날 수 있으며, 맞춤법 검사 UI가 텍스트 선택이나 편집을 차단할 수 있습니다."
category: other
tags:
  - spellcheck
  - editing
  - safari
status: draft
locale: ko
---

Safari에서 contenteditable 영역에 `spellcheck="true"`가 활성화되면 맞춤법 검사 기능이 정상 편집을 간섭할 수 있습니다. 빨간 밑줄이 잘못 나타날 수 있으며, 맞춤법 검사 UI가 텍스트 선택이나 편집을 차단할 수 있습니다.

## 참고 자료

- [Stack Overflow: iOS Safari spellcheck suggestion menu with spellcheck false](https://stackoverflow.com/questions/78022279/ios-safari-when-contenteditable-true-and-spellcheck-false-clicking-on-a-word-tha) - 제안 메뉴 이슈
- [Stack Overflow: Remove underlines after setting spellcheck to false](https://stackoverflow.com/questions/62515239/remove-underlines-after-setting-the-spellcheck-attribute-to-false) - 밑줄 제거
- [TutorialPedia: Disable spell checking on HTML textfields](https://www.tutorialpedia.org/blog/disable-spell-checking-on-html-textfields/) - 속성 조합
- [Stack Overflow: Red spellcheck squiggles remain after editing disabled](https://stackoverflow.com/questions/12812348/red-spellcheck-squiggles-remain-in-chrome-after-editing-is-disabled/12839373) - 강제 재렌더링 해결책
- [Stack Overflow: Prevent red squiggle lines from contenteditable](https://stackoverflow.com/questions/57468200/how-to-prevent-red-squiggle-lines-from-a-contenteditable-div-that-is-no-longer-i) - contenteditable 토글 접근법
- [MDN: ::spelling-error pseudo-element](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/%3A%3Aspelling-error) - 맞춤법 오류 CSS 스타일링
