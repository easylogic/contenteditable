---
id: scenario-placeholder-behavior-ko
title: contenteditable이 포커스를 받으면 플레이스홀더 텍스트가 사라짐
description: "contenteditable 영역에 대한 플레이스홀더 텍스트를 만들기 위해 CSS ::before 또는 ::after 의사 요소를 사용할 때, 콘텐츠가 비어 있어도 요소가 포커스를 받으면 플레이스홀더가 즉시 사라집니다. 이것은 input 및 textarea 동작과 다릅니다."
category: focus
tags:
  - placeholder
  - focus
  - safari
status: draft
locale: ko
---

contenteditable 영역에 대한 플레이스홀더 텍스트를 만들기 위해 CSS `::before` 또는 `::after` 의사 요소를 사용할 때, 콘텐츠가 비어 있어도 요소가 포커스를 받으면 플레이스홀더가 즉시 사라집니다. 이것은 `<input>` 및 `<textarea>` 동작과 다릅니다.

## 참고 자료

- [Stack Overflow: Placeholder for contenteditable div](https://stackoverflow.com/questions/20726174/placeholder-for-contenteditable-div) - CSS placeholder implementation
- [CodePen: contenteditable placeholder](https://codepen.io/peleskei_gabriel/pen/beBoLY) - Placeholder examples
- [Stack Overflow: Firefox contenteditable cursor issue](https://stackoverflow.com/questions/27093136/firefox-contenteditable-cursor-issue) - Firefox behavior
