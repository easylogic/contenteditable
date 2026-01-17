---
id: scenario-web-components-integration-ko
title: Web Components 내부에서 contenteditable 동작이 다름
description: "contenteditable 요소가 Web Component(사용자 정의 요소) 내부에 있을 때 표준 HTML에 있을 때와 동작이 다를 수 있습니다. 이벤트 처리, 선택, 포커스 관리가 컴포넌트의 shadow DOM 또는 캡슐화에 영향을 받을 수 있습니다."
category: other
tags:
  - web-components
  - custom-elements
  - chrome
  - windows
status: draft
locale: ko
---

contenteditable 요소가 Web Component(사용자 정의 요소) 내부에 있을 때 표준 HTML에 있을 때와 동작이 다를 수 있습니다. 이벤트 처리, 선택, 포커스 관리가 컴포넌트의 shadow DOM 또는 캡슐화에 영향을 받을 수 있습니다.

## 참고 자료

- [MDN: ShadowRoot.delegatesFocus](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus) - Focus delegation
- [Chromium Blink Dev: delegatesFocus text selection](https://groups.google.com/a/chromium.org/g/blink-dev/c/egWmzZ4MNuU) - Selection behavior fixes
- [MDN: ShadowRoot.activeElement](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/activeElement) - Active element in shadow DOM
- [Stack Overflow: Selection isCollapsed always true in shadow DOM](https://stackoverflow.com/questions/68882638/why-is-selection-iscollapsed-always-true-in-a-shadow-dom) - Selection issues
- [Stack Overflow: shadowRoot.getSelection](https://stackoverflow.com/questions/62054839/shadowroot-getselection) - Non-standard API
- [MDN: Selection.getComposedRanges](https://developer.mozilla.org/docs/Web/API/Selection/getComposedRanges) - Composed ranges API
- [Chromium Blink Dev: getComposedRanges discussion](https://groups.google.com/a/chromium.org/d/msgid/blink-dev/6ad2542f-4745-4bb9-ba80-356e7e7d2a18%40chromium.org) - API adoption
- [W3C Shadow DOM: Event retargeting](https://www.w3.org/TR/2012/WD-shadow-dom-20120522/) - Event handling
- [MDN: Document.selectionchange event](https://developer.mozilla.org/en-US/docs/Web/API/Document/selectionchange_event) - Selection change events
- [NPM: shadow-selection-polyfill](https://www.npmjs.com/package/shadow-selection-polyfill) - Polyfill library
