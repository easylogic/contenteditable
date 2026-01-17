---
id: scenario-css-contain-ko
title: CSS contain 속성이 contenteditable 선택에 영향을 줄 수 있음
description: "contenteditable 요소 또는 그 부모에 CSS contain 속성이 있을 때 선택 동작이 영향을 받을 수 있습니다. 선택이 포함된 요소를 넘어 확장되지 않을 수 있으며 커서 이동이 제한될 수 있습니다."
category: selection
tags:
  - css-contain
  - selection
  - chrome
  - windows
status: draft
locale: ko
---

contenteditable 요소 또는 그 부모에 CSS `contain` 속성이 있을 때 선택 동작이 영향을 받을 수 있습니다. 선택이 포함된 요소를 넘어 확장되지 않을 수 있으며 커서 이동이 제한될 수 있습니다.

## 참고 자료

- [W3C CSS Containment Module](https://www.w3.org/TR/css-contain-1/) - contain property specification
- [MDN: contain](https://developer.mozilla.org/en-US/docs/Web/CSS/contain) - contain property documentation
- [MDN: Using CSS containment](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Using) - Containment guide
- [W3C ContentEditable: Legal caret positions](https://www.w3.org/TR/content-editable/) - Caret position specification
- [Stack Overflow: Prevent caret placement after element](https://stackoverflow.com/questions/28669465/contenteditable-prevent-caret-placement-after-a-certain-element) - Caret restriction techniques
