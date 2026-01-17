---
id: scenario-css-contain
title: CSS contain property may affect contenteditable selection
description: "When a contenteditable element or its parent has the CSS contain property, selection behavior may be affected. Selection may not extend beyond the contained element, and caret movement may be restricted."
category: selection
tags:
  - css-contain
  - selection
  - chrome
  - windows
status: draft
locale: en
---

When a contenteditable element or its parent has the CSS `contain` property, selection behavior may be affected. Selection may not extend beyond the contained element, and caret movement may be restricted.

## References

- [W3C CSS Containment Module](https://www.w3.org/TR/css-contain-1/) - contain property specification
- [MDN: contain](https://developer.mozilla.org/en-US/docs/Web/CSS/contain) - contain property documentation
- [MDN: Using CSS containment](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Using) - Containment guide
- [W3C ContentEditable: Legal caret positions](https://www.w3.org/TR/content-editable/) - Caret position specification
- [Stack Overflow: Prevent caret placement after element](https://stackoverflow.com/questions/28669465/contenteditable-prevent-caret-placement-after-a-certain-element) - Caret restriction techniques
