---
id: scenario-caret-position-after-paste
title: Caret position jumps unexpectedly after pasting content
description: After pasting content into a contenteditable region, the caret position does not end up at the expected location, sometimes jumping to the beginning of the pasted content or to an unexpected position.
category: paste
tags:
  - paste
  - caret
  - position
  - firefox
status: draft
locale: en
---

After pasting content into a contenteditable region, the caret position does not end up at the expected location, sometimes jumping to the beginning of the pasted content or to an unexpected position.

## References

- [Stack Overflow: How to restore caret position after paste](https://stackoverflow.com/questions/10258637/how-to-restore-caret-position-after-paste-to-contenteditable-and-sanitization) - Caret restoration techniques
- [Stack Overflow: Firefox sets wrong caret position with ::before](https://stackoverflow.com/questions/21986985/firefox-sets-wrong-caret-position-contenteditable-with-before) - Firefox-specific issues
- [Stack Overflow: Caret disappears in Firefox when saving position](https://stackoverflow.com/questions/57373053/caret-disappears-in-firefox-when-saving-its-position-with-rangy) - Range preservation issues
- [ProseMirror Discuss: Firefox contenteditable false cursor bug](https://discuss.prosemirror.net/t/firefox-contenteditable-false-cursor-bug/5016) - Non-editable element issues
- [Jessie Ji: ContentEditable in Vue](https://jessieji.com/2022/contenteditable-vue) - Framework-specific caret issues
- [WebCompat Issue #48056: Caret positioning](https://webcompat.com/issues/48056) - Browser compatibility issues
