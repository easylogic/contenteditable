---
id: scenario-contenteditable-table
title: contenteditable in table cells causes layout issues
description: When a contenteditable region is inside a table cell (`<td>`), editing the content may cause layout issues in Firefox. The table may resize unexpectedly or the cell may overflow.
category: other
tags:
  - table
  - layout
  - contenteditable
  - firefox
status: draft
locale: en
---

When a contenteditable region is inside a table cell (`<td>`), editing the content may cause layout issues in Firefox. The table may resize unexpectedly or the cell may overflow.

## References

- [Stack Overflow: Make contenteditable respect initial size of table cell](https://stackoverflow.com/questions/79350342/how-to-make-contenteditable-respect-the-initial-size-of-a-table-cell) - Table layout issues
- [MDN: table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/table-layout) - table-layout CSS property
- [Stack Overflow: Firefox doesn't style empty elements](https://stackoverflow.com/questions/73812458/firefox-doesnt-style-empty-elements) - Empty cell behavior
