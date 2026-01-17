---
id: scenario-beforeinput-support
title: beforeinput event is not supported in Safari
description: "The beforeinput event, which is crucial for intercepting and modifying input before it's committed to the DOM, is not supported in Safari. This makes it difficult to implement custom input handling that works across all browsers."
category: other
tags:
  - beforeinput
  - events
  - safari
  - compatibility
status: draft
locale: en
---

The `beforeinput` event, which is crucial for intercepting and modifying input before it's committed to the DOM, is not supported in Safari. This makes it difficult to implement custom input handling that works across all browsers.

## References

- [WebKit Blog: Enhanced Editing with Input Events](https://webkit.org/blog/7358/enhanced-editing-with-input-events/) - beforeinput implementation in Safari
- [Can I Use: beforeinput event](https://caniuse.com/mdn-api_element_beforeinput_event) - Browser compatibility
- [WebKit Bug 217692: beforeinput not fired for autocomplete](https://bugs.webkit.org/show_bug.cgi?id=217692) - Autocomplete issues
- [WebKit Bug 284769: beforeinput not fired for password autofill](https://bugs.webkit.org/show_bug.cgi?id=284769) - Autofill issues
- [WebKit Changes: Event order fix](https://lists.webkit.org/pipermail/webkit-changes/2024-May/302147.html) - beforeinput/textInput order correction
- [WebKit Bug 166889: beforeinput order during IME composition](https://lists.webkit.org/pipermail/webkit-unassigned/2024-March/1156275.html) - Composition event ordering
- [W3C Input Events Issue #86: Event ordering](https://github.com/w3c/input-events/issues/86) - Specification discussion
- [MDN: Element beforeinput event](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event) - Official documentation
