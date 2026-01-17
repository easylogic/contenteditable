---
id: scenario-caret-movement-with-emoji
title: Arrow keys skip over emoji in contenteditable
description: When using the left and right arrow keys in a `contenteditable` element that contains emoji, the
category: caret
tags:
  - caret
  - emoji
  - navigation
status: draft
locale: en
---

When using the left and right arrow keys in a `contenteditable` element that contains emoji, the
caret sometimes jumps over entire emoji clusters instead of moving by a single visual position.

This scenario has been observed in multiple environments with similar behavior.

## References

- [Unicode TR29: Text Segmentation](https://www.unicode.org/reports/tr29/tr29-29.html) - Grapheme cluster rules
- [Unicode TR51: Emoji](https://unicode.org/standard/reports/tr51/) - Emoji and ZWJ sequences
- [Firefox Bug 435967: Caret movement with non-text nodes](https://bugzilla.mozilla.org/show_bug.cgi?id=435967) - Non-editable element navigation
- [Stack Overflow: Chrome skips over empty paragraphs](https://stackoverflow.com/questions/75397803/chrome-skips-over-empty-paragraphs-of-contenteditable-parent-when-moving-cursor) - Empty paragraph navigation
- [WebKit Bug 106827: Down arrow doesn't move caret with images](https://bugs.webkit.org/show_bug.cgi?id=106827) - Image element navigation
- [W3C: ContentEditable specification](https://www.w3.org/TR/content-editable/) - Legal caret positions
- [Stack Overflow: Emojis become question marks after re-render](https://stackoverflow.com/questions/66926658/emojis-become-question-marks-after-re-render-in-contenteditable) - Emoji handling issues
- [Stack Overflow: Strange caret position in contenteditable](https://stackoverflow.com/questions/49222639/strange-caret-position-in-contenteditable-div) - Caret positioning with spans
