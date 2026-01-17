---
id: scenario-disabled-attribute-ko
title: "disabled 속성이 contenteditable을 비활성화하지 않음"
description: "폼 입력을 비활성화하는 `disabled` 속성이 Safari의 contenteditable 영역에서 작동하지 않습니다. `disabled`가 설정되어 있어도 contenteditable은 편집 가능하고 상호작용 가능한 상태로 유지됩니다."
category: other
tags:
  - disabled
  - editing
  - safari
status: draft
locale: ko
---

폼 입력을 비활성화하는 `disabled` 속성이 Safari의 contenteditable 영역에서 작동하지 않습니다. `disabled`가 설정되어 있어도 contenteditable은 편집 가능하고 상호작용 가능한 상태로 유지됩니다.

## 참고 자료

- [MDN: contenteditable global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable) - contenteditable documentation
- [MDN: HTMLElement.contentEditable](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/contentEditable) - contentEditable property
- [Stack Overflow: Why does contenteditable false not work?](https://stackoverflow.com/questions/78133863/why-does-contenteditable-false-not-work) - Safari nested contenteditable issues
- [CKEditor Issue #12128: contenteditable false in Safari](https://dev.ckeditor.com/ticket/12128) - Safari deletion issues
