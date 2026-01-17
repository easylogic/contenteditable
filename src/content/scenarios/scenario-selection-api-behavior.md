---
id: scenario-selection-api-behavior
title: window.getSelection() returns null when contenteditable loses focus
description: "When a contenteditable region loses focus, window.getSelection() may return null in Safari, even if there was a valid selection before the focus loss. This makes it difficult to preserve or work with selections."
category: selection
tags:
  - selection
  - api
  - focus
  - safari
status: draft
locale: en
---

When a contenteditable region loses focus, `window.getSelection()` may return `null` in Safari, even if there was a valid selection before the focus loss. This makes it difficult to preserve or work with selections.

## References

- [Stack Overflow: contenteditable div loses selection when another input focuses](https://stackoverflow.com/questions/12778508/contenteditable-div-loses-selection-when-another-input-focuses) - Selection preservation techniques
- [Stack Overflow: Safari getSelection not working](https://stackoverflow.com/questions/35281283/safari-getselection-not-working) - Selection API issues
- [Stack Overflow: window.getSelection returns no range in Safari after onclick](https://stackoverflow.com/questions/47299847/window-getselection-returns-no-range-in-safari-after-onclick) - Event timing issues
- [Stack Overflow: Losing focus in contenteditable in Safari](https://stackoverflow.com/questions/24215428/losing-focus-in-contenteditable-in-safari) - Focus management
