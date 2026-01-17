---
id: scenario-fullscreen-api
title: Fullscreen API may affect contenteditable focus and selection
description: When a contenteditable element enters or exits fullscreen mode using the Fullscreen API, focus and selection may be lost. The caret position may reset, and editing may be disrupted.
category: focus
tags:
  - fullscreen-api
  - focus
  - chrome
  - windows
status: draft
locale: en
---

When a contenteditable element enters or exits fullscreen mode using the Fullscreen API, focus and selection may be lost. The caret position may reset, and editing may be disrupted.

## References

- [MDN: Fullscreen API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide) - Fullscreen API documentation
- [MDN: contenteditable global attribute](https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/contenteditable) - contenteditable documentation
- [Stack Overflow: contenteditable loses selection when another input focuses](https://stackoverflow.com/questions/12778508/contenteditable-div-loses-selection-when-another-input-focuses) - Selection preservation techniques
- [ProseMirror Discuss: Selection is lost on Safari when editor is blurred](https://discuss.prosemirror.net/t/selection-is-lost-on-safari-when-editor-is-blured/3001) - Safari selection issues
