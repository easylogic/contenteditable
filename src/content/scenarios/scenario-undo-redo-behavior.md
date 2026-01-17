---
id: scenario-undo-redo-behavior
title: Undo and redo behavior is inconsistent across browsers
description: "The undo and redo functionality (Ctrl+Z / Ctrl+Y or Cmd+Z / Cmd+Shift+Z) behaves differently across browsers. Some browsers undo individual keystrokes, while others undo larger operations. The undo stack may also be cleared unexpectedly."
category: other
tags:
  - undo
  - redo
  - browser-compatibility
status: draft
locale: en
---

The undo and redo functionality (Ctrl+Z / Ctrl+Y or Cmd+Z / Cmd+Shift+Z) behaves differently across browsers. Some browsers undo individual keystrokes, while others undo larger operations. The undo stack may also be cleared unexpectedly.

This scenario has been observed in multiple environments with similar behavior.

## References

- [W3C Editing Issue #150: Native undo/redo behavior](https://github.com/w3c/editing/issues/150) - Specification discussion
- [MDN: Element beforeinput event](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event) - beforeinput with historyUndo/historyRedo
- [Can I Use: beforeinput event](https://caniuse.com/mdn-api_element_beforeinput_event) - Browser compatibility
- [ProseMirror Discuss: Native undo history](https://discuss.prosemirror.net/t/native-undo-history/1823) - Undo/redo behavior discussion
- [Stack Overflow: How to undo changes made from script](https://stackoverflow.com/questions/69857400/how-to-undo-changes-made-from-script-on-contenteditable-div) - Script changes
- [Stack Overflow: iframe undo redo for execCommand insertHTML](https://stackoverflow.com/questions/51831623/iframe-undo-redo-for-execcommand-using-inserthtml-contenteditable) - Element insertion undo issues
- [Chrome Developers: Introducing EditContext API](https://developer.chrome.com/blog/introducing-editcontext-api) - Future improvements
