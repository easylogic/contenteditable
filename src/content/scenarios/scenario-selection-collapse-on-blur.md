---
id: scenario-selection-collapse-on-blur
title: Selection collapses unexpectedly when clicking outside contenteditable
description: When a range of text is selected inside a `contenteditable` element, clicking outside the element
category: selection
tags:
  - selection
  - caret
status: draft
locale: en
---

When a range of text is selected inside a `contenteditable` element, clicking outside the element
collapses the selection to a caret position inside the editable region instead of clearing the
selection entirely.

## References

- [Stack Overflow: contenteditable div loses selection when input focuses](https://stackoverflow.com/questions/12778508/contenteditable-div-loses-selection-when-another-input-focuses) - Focus loss issues
- [Stack Overflow: Selection collapses when clicking button](https://stackoverflow.com/questions/71633329/selection-in-contenteditable-div-collapses-as-soon-as-i-click-a-button) - Button click issues
- [Stack Overflow: Keep text selected when element loses focus](https://stackoverflow.com/questions/28148742/how-to-keep-text-selected-in-a-contenteditable-element-when-the-element-loses-fo) - Selection preservation
- [Stack Overflow: contenteditable div issue when restore saving selection](https://stackoverflow.com/questions/16604213/contenteditable-div-issue-when-restore-saving-selection) - Selection restoration
- [jQuery UI Bug #11145: Safari selection issues](https://bugs.jqueryui.com/ticket/11145/) - Browser differences
