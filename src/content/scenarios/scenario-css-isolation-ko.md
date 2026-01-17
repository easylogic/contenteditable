---
id: scenario-css-isolation-ko
title: CSS isolation 속성이 contenteditable 스태킹 컨텍스트에 영향을 줄 수 있음
description: "contenteditable 요소에 CSS isolation: isolate 속성이 있을 때 새로운 스태킹 컨텍스트를 만듭니다. 이것은 선택 핸들과 IME 후보 창이 요소에 대해 어떻게 위치하는지에 영향을 줄 수 있습니다."
category: other
tags:
  - css-isolation
  - stacking-context
  - safari
  - macos
status: draft
locale: ko
---

contenteditable 요소에 CSS `isolation: isolate` 속성이 있을 때 새로운 스태킹 컨텍스트를 만듭니다. 이것은 선택 핸들과 IME 후보 창이 contenteditable에 대해 어떻게 위치하는지에 영향을 줄 수 있습니다.

## 참고 자료

- [MDN: isolation](https://developer.mozilla.org/en-US/docs/Web/CSS/isolation) - isolation property documentation
- [Runebook: CSS isolation](https://runebook.dev/en/docs/css/isolation) - isolation documentation
- [MDN: Understanding CSS z-index stacking context](https://developer.mozilla.org/en-US/docs/Understanding_CSS_z-index/The_stacking_context) - Stacking context guide
- [MDN: The stacking context](https://devdoc.net/web/developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context.html) - Stacking context details
- [W3C EditContext: Character bounds](https://www.w3.org/TR/edit-context/) - IME positioning specification
