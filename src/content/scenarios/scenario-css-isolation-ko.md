---
id: scenario-css-isolation
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
