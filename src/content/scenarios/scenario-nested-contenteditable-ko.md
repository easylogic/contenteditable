---
id: scenario-nested-contenteditable-ko
title: 중첩된 contenteditable 요소가 포커스 및 선택 문제를 유발함
description: "contenteditable 요소가 다른 contenteditable 요소를 포함할 때 포커스 동작이 예측 불가능해집니다. 중첩된 요소를 클릭해도 올바르게 포커스되지 않을 수 있으며, 선택 범위가 두 요소에 걸쳐 잘못 확장될 수 있습니다."
category: focus
tags:
  - nested
  - focus
  - selection
status: draft
locale: ko
---

contenteditable 요소가 다른 contenteditable 요소를 포함할 때 포커스 동작이 예측 불가능해집니다. 중첩된 요소를 클릭해도 올바르게 포커스되지 않을 수 있으며, 선택 범위가 두 요소에 걸쳐 잘못 확장될 수 있습니다.

## 참고 자료

- [ExchangeTuts: Focusing on nested contenteditable element](https://exchangetuts.com/focusing-on-nested-contenteditable-element-1641465483617619) - Focus delegation
- [Lightrun: Cypress cannot focus element inside contenteditable](https://lightrun.com/answers/cypress-io-cypress-cannot-focus-element-inside-content-editable-element) - Focus issues
- [ProseMirror Discuss: Focus issue in Chrome with contenteditable false](https://discuss.prosemirror.net/t/focus-issue-in-chrome-when-the-first-child-node-of-the-node-view-has-contenteditable-false/1820) - Browser differences
- [Stack Overflow: contenteditable div loses selection when input focuses](https://stackoverflow.com/questions/12778508/contenteditable-div-loses-selection-when-another-input-focuses) - Selection loss
- [Web.dev: Learn HTML focus](https://web.dev/learn/html/focus/) - tabindex usage
