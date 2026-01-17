---
id: scenario-double-line-break
title: Pressing Enter inserts two line breaks in contenteditable
description: In a plain `contenteditable` element, pressing Enter inserts two visible line breaks instead of one.
category: other
tags:
  - enter
  - newline
status: draft
locale: en
---

In a plain `contenteditable` element, pressing Enter inserts two visible line breaks instead of one.
The resulting DOM contains nested `<div>` or `<br>` elements that render as an extra blank line.

This scenario has been observed in multiple environments with similar behavior.

## References

- [MDN: Editable content guide](https://mdn2.netlify.app/en-us/docs/web/guide/html/editable_content/) - Firefox behavior changes
- [Stack Overflow: contenteditable in Firefox creates 2 newlines](https://stackoverflow.com/questions/52817606/contenteditable-in-firefox-creates-2-newlines-instead-of-1) - Double line break issues
- [Stack Overflow: Prevent contenteditable adding div on Enter](https://stackoverflow.com/questions/18552336/prevent-contenteditable-adding-div-on-enter-chrome) - plaintext-only mode
