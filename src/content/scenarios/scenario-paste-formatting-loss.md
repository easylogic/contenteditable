---
id: scenario-paste-formatting-loss
title: Pasting rich text into contenteditable strips markup unexpectedly
description: When pasting content from a rich text source into a contenteditable element, the resulting DOM loses headings, lists, or inline formatting that were present in the source.
category: paste
tags:
  - paste
  - clipboard
  - formatting
status: draft
locale: en
---

When pasting content from a rich text source (such as a word processor or a web page) into a
`contenteditable` element, the resulting DOM loses headings, lists, or inline formatting that were
present in the source.

This scenario has been observed in multiple environments with similar behavior.

## References

- [Stack Overflow: Paste rich text and only keep bold and italics](https://stackoverflow.com/questions/21257688/paste-rich-text-into-content-editable-div-and-only-keep-bold-and-italics-formatt) - Formatting preservation strategies
- [ExchangeTuts: Converting rich text to plain text when pasting](https://exchangetuts.com/converting-rich-text-to-plain-text-when-pasting-in-contenteditable-div-duplicate-1641521344433132) - Clipboard API usage
- [Namchee: The quest for perfect freeform input](https://www.namchee.dev/posts/the-quest-for-perfect-freeform-input/) - Paste handling patterns
- [Syncfusion: Rich Text Editor paste cleanup](https://ej2.syncfusion.com/javascript/documentation/rich-text-editor/paste-cleanup) - Editor paste cleanup documentation
- [MDN: Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) - Official Clipboard API documentation
