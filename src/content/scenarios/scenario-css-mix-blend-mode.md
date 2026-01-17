---
id: scenario-css-mix-blend-mode
title: CSS mix-blend-mode may affect contenteditable text rendering
description: "When a contenteditable element has CSS mix-blend-mode applied, text rendering may be affected. Text may appear with incorrect colors, selection may not be visible, and caret may not render correctly."
category: other
tags:
  - css-mix-blend-mode
  - rendering
  - firefox
  - windows
status: draft
locale: en
---

When a contenteditable element has CSS `mix-blend-mode` applied, text rendering may be affected. Text may appear with incorrect colors, selection may not be visible, and caret may not render correctly.

## References

- [MDN: mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode) - mix-blend-mode CSS property
- [CSS-Tricks: Methods for contrasting text backgrounds](https://css-tricks.com/methods-contrasting-text-backgrounds/) - Contrast issues
- [WebKit Mailing List: mix-blend-mode bugs](https://lists.webkit.org/pipermail/webkit-unassigned/2023-September/1122655.html) - WebKit rendering bugs
- [MDN: caret-color](https://developer.mozilla.org/en-US/docs/Web/CSS/caret-color) - caret-color property
- [CSS-Tricks: isolation](https://css-tricks.com/almanac/properties/i/isolation/) - isolation property
- [CSS-Tricks: mix-blend-mode almanac](https://css-tricks.com/almanac/properties/m/mix-blend-mode/) - Blend mode documentation
- [Reddit: mix-blend-mode transform issues](https://www.reddit.com/r/css/comments/umestm) - Transform and blend mode problems
