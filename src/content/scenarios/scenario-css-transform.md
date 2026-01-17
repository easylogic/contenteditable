---
id: scenario-css-transform
title: CSS transform may cause selection handles to appear in wrong position
description: "When a contenteditable element has CSS transforms applied (translate, scale, rotate), the selection handles and caret may appear in incorrect positions. The visual position may not match the actual selection position."
category: selection
tags:
  - css-transform
  - selection
  - edge
  - windows
status: draft
locale: en
---

When a contenteditable element has CSS transforms applied (translate, scale, rotate), the selection handles and caret may appear in incorrect positions. The visual position may not match the actual selection position.

## References

- [WebKit Mailing List: Transforms problems with contentEditable](https://lists.webkit.org/pipermail/webkit-unassigned/2010-November/1082244.html) - WebKit Bug 19058
- [Stack Overflow: Caret position when centering with flexbox](https://stackoverflow.com/questions/32905957/caret-position-when-centering-with-flexbox-in-contenteditable) - Transform and flexbox issues
