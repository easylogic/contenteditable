---
id: scenario-readonly-attribute-ko
title: "readonly 속성이 contenteditable에서 편집을 방지하지 않음"
description: "폼 입력에서 편집을 방지해야 하는 `readonly` 속성은 Firefox의 contenteditable 영역에서 작동하지 않습니다. `readonly`가 설정되어 있어도 사용자가 여전히 콘텐츠를 편집할 수 있습니다."
category: other
tags:
  - readonly
  - editing
  - firefox
status: draft
locale: ko
---

폼 입력에서 편집을 방지해야 하는 `readonly` 속성은 Firefox의 contenteditable 영역에서 작동하지 않습니다. `readonly`가 설정되어 있어도 사용자가 여전히 콘텐츠를 편집할 수 있습니다.

## 참고 자료

- [MDN: contenteditable global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable) - contenteditable documentation
- [MDN: readonly attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/readonly) - readonly attribute documentation
- [MDN: HTMLInputElement.readOnly](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/readOnly) - readOnly property
- [Stack Overflow: Why does contenteditable false not work?](https://stackoverflow.com/questions/78133863/why-does-contenteditable-false-not-work) - contenteditable="false" issues
- [MDN: aria-readonly](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-readonly) - ARIA readonly attribute
