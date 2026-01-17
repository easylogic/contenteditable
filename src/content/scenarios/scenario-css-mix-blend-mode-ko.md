---
id: scenario-css-mix-blend-mode-ko
title: CSS mix-blend-mode가 contenteditable 텍스트 렌더링에 영향을 줄 수 있음
description: "contenteditable 요소에 CSS mix-blend-mode가 적용되어 있을 때 텍스트 렌더링이 영향을 받을 수 있습니다. 텍스트가 잘못된 색상으로 나타날 수 있고, 선택이 보이지 않을 수 있으며, 커서가 올바르게 렌더링되지 않을 수 있습니다."
category: other
tags:
  - css-mix-blend-mode
  - rendering
  - firefox
  - windows
status: draft
locale: ko
---

contenteditable 요소에 CSS `mix-blend-mode`가 적용되어 있을 때 텍스트 렌더링이 영향을 받을 수 있습니다. 텍스트가 잘못된 색상으로 나타날 수 있고, 선택이 보이지 않을 수 있으며, 커서가 올바르게 렌더링되지 않을 수 있습니다.

## 참고 자료

- [MDN: mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode) - mix-blend-mode CSS property
- [CSS-Tricks: Methods for contrasting text backgrounds](https://css-tricks.com/methods-contrasting-text-backgrounds/) - Contrast issues
- [WebKit Mailing List: mix-blend-mode bugs](https://lists.webkit.org/pipermail/webkit-unassigned/2023-September/1122655.html) - WebKit rendering bugs
- [MDN: caret-color](https://developer.mozilla.org/en-US/docs/Web/CSS/caret-color) - caret-color property
- [CSS-Tricks: isolation](https://css-tricks.com/almanac/properties/i/isolation/) - isolation property
- [CSS-Tricks: mix-blend-mode almanac](https://css-tricks.com/almanac/properties/m/mix-blend-mode/) - Blend mode documentation
- [Reddit: mix-blend-mode transform issues](https://www.reddit.com/r/css/comments/umestm) - Transform and blend mode problems
