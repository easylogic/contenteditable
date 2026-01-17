---
id: scenario-contenteditable-inheritance
title: contenteditable inheritance behavior is inconsistent
description: "When a parent element has contenteditable=\"true\" and a child element has contenteditable=\"false\", the inheritance behavior is inconsistent across browsers. Some browsers allow editing in the child, while others correctly prevent it. The behavior may also differ when the child has contenteditable=\"inherit\" or no contenteditable attribute."
category: other
tags:
  - inheritance
  - nested
  - firefox
  - windows
status: draft
locale: en
---

When a parent element has `contenteditable="true"` and a child element has `contenteditable="false"`, the inheritance behavior is inconsistent across browsers. Some browsers allow editing in the child, while others correctly prevent it. The behavior may also differ when the child has `contenteditable="inherit"` or no contenteditable attribute.

## References

- [MDN: HTMLElement.contentEditable](https://developer.mozilla.org/docs/Web/API/HTMLElement/contentEditable) - contentEditable property documentation
- [MDN: contenteditable global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable) - Inheritance behavior
- [Microsoft Learn: UWP WebView contenteditable inheritance bug](https://learn.microsoft.com/en-us/answers/questions/1316427/when-we-set-contenteditable-false-inside-contented) - WebView-specific issues
- [WebDocs: contenteditable inheritance](https://webdocs.dev/en-us/docs/web/html/global_attributes/contenteditable) - Inheritance documentation
