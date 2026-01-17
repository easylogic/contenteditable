---
id: scenario-css-isolation
title: CSS isolation property may affect contenteditable stacking context
description: "When a contenteditable element has the CSS isolation: isolate property, it creates a new stacking context. This may affect how selection handles and IME candidate windows are positioned relative to the element."
category: other
tags:
  - css-isolation
  - stacking-context
  - safari
  - macos
status: draft
locale: en
---

When a contenteditable element has the CSS `isolation: isolate` property, it creates a new stacking context. This may affect how selection handles and IME candidate windows are positioned relative to the contenteditable.

## References

- [MDN: isolation](https://developer.mozilla.org/en-US/docs/Web/CSS/isolation) - isolation property documentation
- [Runebook: CSS isolation](https://runebook.dev/en/docs/css/isolation) - isolation documentation
- [MDN: Understanding CSS z-index stacking context](https://developer.mozilla.org/en-US/docs/Understanding_CSS_z-index/The_stacking_context) - Stacking context guide
- [MDN: The stacking context](https://devdoc.net/web/developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context.html) - Stacking context details
- [W3C EditContext: Character bounds](https://www.w3.org/TR/edit-context/) - IME positioning specification
