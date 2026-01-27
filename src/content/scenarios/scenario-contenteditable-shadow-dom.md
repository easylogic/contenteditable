---
id: scenario-contenteditable-shadow-dom
title: "Contenteditable isolation and selection in Shadow DOM"
description: "Analysis of the architectural friction between the single-selection document model and Web Component encapsulation."
category: "other"
tags: ["shadow-dom", "selection", "encapsulation", "api-collision"]
status: "confirmed"
locale: "en"
---

## Problem Overview
The Web Selection API was standardized long before the widespread adoption of Shadow DOM. This architectural gap creates a "Selection Blindness" phenomenon: the global `window.getSelection()` model often treats a Shadow Host as an opaque block, while the internal `shadowRoot.getSelection()` provides a range that the rest of the application (and even some browser systems like find-in-page) cannot see.

## Observed Behavior
### Scenario 1: Selection Collision (Double-Highlight)
When a user moves focus from a global text selection to a `contenteditable` region inside a Shadow Root, many browsers fail to correctly clear the previous highlight, leading to confusing "double-selection" UI.

```javascript
/* Conflict Logic */
// 1. User selects "Hello World" in the light DOM.
// 2. User clicks inside <my-editor> (Shadow DOM).
// 3. window.getSelection() still reports "Hello World".
// 4. shadowRoot.getSelection() reports the active caret in the editor.
```

### Scenario 2: Command Execution Failure
Calling `document.execCommand()` typically targets the range reported by `window.getSelection()`. If this selection is stuck at the shadow-host boundary, global commands (like 'bold' or 'italic') will do nothing to the text inside the editor.

## Impact
- **Framework Blindness**: Editor engines (Slate, Lexical) that rely on `selectionchange` on the document often miss events happening inside Shadow Roots.
- **Accessibility Isolation**: Accessibility trees sometimes fail to bridge the gap zwischen the shadow-based caret and the document-level focus indicator.

## Browser Comparison
- **Blink (Chrome/Edge)**: Supports `shadowRoot.getSelection()`, but synchronization with the light DOM selection is often laggy or inconsistent.
- **Gecko (Firefox)**: Historically had the most restricted support for selection crossing shadow boundaries; requires heavy manual polyfilling.
- **WebKit (Safari)**: Notable for "unbreakable" light-DOM selections that stay active even when focus is deep within a Shadow Root.

## Solutions
### 1. Manual Selection Syncing
Listen to `selectionchange` within the shadow root and explicitly notify your state manager.

```javascript
this.shadowRoot.addEventListener('selectionchange', () => {
  const selection = this.shadowRoot.getSelection();
  if (selection.rangeCount > 0) {
    this.dispatchEvent(new CustomEvent('editor-selection-change', {
      detail: selection.getRangeAt(0),
      bubbles: true,
      composed: true
    }));
  }
});
```

## Related Cases
- [ce-0571: Multiple selections collision in Shadow DOM](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0571-shadow-dom-selection-collision.md)

## References
- [W3C: Selection API in Shadow DOM](https://github.com/w3c/selection-api/issues/173)
- [Blink Intent-to-Ship: delegatesFocus text selection](https://groups.google.com/a/chromium.org/g/blink-dev/c/egWmzZ4MNuU)
