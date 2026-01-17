---
id: scenario-media-query-layout
title: Media query layout changes may disrupt contenteditable editing
description: "When a page with a contenteditable element responds to media query changes (e.g., orientation change, window resize), the layout changes may disrupt editing. The caret position may jump, and selection may be lost."
category: mobile
tags:
  - media-query
  - layout
  - mobile
  - ios
  - safari
status: draft
locale: en
---

When a page with a contenteditable element responds to media query changes (e.g., orientation change, window resize), the layout changes may disrupt editing. The caret position may jump, and selection may be lost.

## References

- [Stack Overflow: Caret jumping to end in Chrome](https://stackoverflow.com/questions/27786048/why-is-my-contenteditable-caret-jumping-to-the-end-in-chrome) - Chrome caret jump issues
- [Stack Overflow: Caret position when centering with flexbox](https://stackoverflow.com/questions/32905957/caret-position-when-centering-with-flexbox-in-contenteditable) - Flexbox caret issues
- [ProseMirror Discuss: Selection lost on Safari when editor is blurred](https://discuss.prosemirror.net/t/selection-is-lost-on-safari-when-editor-is-blured/3001) - Safari selection issues
- [Stack Overflow: Saving and restoring caret position](https://stackoverflow.com/questions/4576694/saving-and-restoring-caret-position-for-contenteditable-div) - Caret restoration
