---
id: scenario-execCommand-alternatives
title: execCommand is deprecated but still widely used for formatting
description: "The document.execCommand() API, which is commonly used to apply formatting (bold, italic, etc.) in contenteditable regions, has been deprecated. However, there is no complete replacement, and many implementations still rely on it. This creates uncertainty about future browser support."
category: formatting
tags:
  - execCommand
  - formatting
  - deprecation
  - chrome
status: draft
locale: en
---

The `document.execCommand()` API, which is commonly used to apply formatting (bold, italic, etc.) in contenteditable regions, has been deprecated. However, there is no complete replacement, and many implementations still rely on it. This creates uncertainty about future browser support.

## References

- [MDN: Document.execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) - execCommand API documentation (deprecated)
- [W3C Input Events Level 2 Specification](https://www.w3.org/TR/input-events-2/) - beforeinput and Input Events API
- [MDN: Element beforeinput event](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event) - Modern alternative
- [MDN: Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection) - Selection and Range APIs
