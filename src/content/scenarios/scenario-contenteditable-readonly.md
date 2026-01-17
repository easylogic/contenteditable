---
id: scenario-contenteditable-readonly
title: contenteditable="false" on child elements is not respected consistently
description: "When a contenteditable region contains child elements with contenteditable=\"false\", the behavior is inconsistent. Some browsers allow editing within these elements, while others correctly prevent it."
category: other
tags:
  - readonly
  - nested
  - contenteditable
  - chrome
status: draft
locale: en
---

When a contenteditable region contains child elements with `contenteditable="false"`, the behavior is inconsistent. Some browsers allow editing within these elements, while others correctly prevent it.

## References

- [MDN: contenteditable global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable) - contenteditable documentation
- [Stack Overflow: contenteditable false inside contenteditable true IE8](https://stackoverflow.com/questions/7522848/contenteditable-false-inside-contenteditable-true-block-is-still-editable-in-ie8) - IE8 issues
- [Microsoft Learn: UWP WebView contenteditable false](https://learn.microsoft.com/en-us/answers/questions/1316427/when-we-set-contenteditable-false-inside-contented) - WebView issues
