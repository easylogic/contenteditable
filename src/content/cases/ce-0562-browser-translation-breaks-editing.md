---
id: ce-0562-browser-translation-breaks-editing
scenarioId: scenario-browser-translation
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Browser translation breaks contenteditable editing
description: "When Google Translate or other browser translation features are activated, they manipulate the DOM by replacing text content and injecting elements. This breaks contenteditable functionality, causing cursor positioning issues, event handling problems, and IME composition failures."
tags:
  - browser-translation
  - google-translate
  - dom-manipulation
  - ime
  - composition
status: draft
---

## Phenomenon

When Google Translate or other browser translation features are activated, they manipulate the DOM by replacing text content and injecting elements. This breaks `contenteditable` functionality, causing cursor positioning issues, event handling problems, and IME composition failures.

## Reproduction example

1. Open a page with contenteditable editor
2. Activate Google Translate to translate the page
3. Try to edit content in the contenteditable region
4. Observe that editing becomes impossible or unreliable

## Observed behavior

- **DOM manipulation**: Translation replaces node text content and injects `<span>` or `<div>` elements
- **Cursor positioning**: Cursor won't move or appears at wrong position after translation
- **Input failures**: Pasted content doesn't insert correctly, key events act incorrectly
- **IME composition**: Translation resets or interferes with composition buffers
- **Event listeners**: Event subscriptions may be detached during DOM manipulation

## Expected behavior

- Translation should not break contenteditable functionality
- Editing should remain possible after translation
- Cursor position should remain accurate
- IME composition should continue to work

## Analysis

Translation tools manipulate the DOM structure, which interferes with contenteditable's internal state management. The browser loses track of selection, caret position, and composition state after translation.

## Workarounds

- Use `translate="no"` attribute on contenteditable elements
- Use `class="notranslate"` for Google Translate
- Reapply contenteditable attributes after translation using MutationObserver
- Disable translation during editing mode
