---
id: ce-0308-shadow-dom-execCommand-selection-ko
scenarioId: scenario-shadow-dom-execCommand-selection
locale: ko
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: execCommand and getSelection do not work in Shadow DOM
description: "When contenteditable element is inside Shadow DOM, document.execCommand and window.getSelection may not function as expected, rendering text manipulation ineffective."
tags:
  - shadow-dom
  - execCommand
  - selection
  - web-components
status: draft
---

## Phenomenon

When a contenteditable element resides inside a Shadow DOM (Web Components), standard methods like `document.execCommand` and `window.getSelection` may not function as expected. For instance, `document.execCommand` might not perform any action, and `window.getSelection().getRangeAt(0).toString()` could return an empty string, rendering text manipulation and selection styling ineffective.

## Reproduction example

1. Create a Web Component with Shadow DOM.
2. Place a contenteditable element inside the Shadow DOM.
3. Try to use `document.execCommand('bold')` to format selected text.
4. Try to use `window.getSelection()` to get selected text.
5. Observe that these operations fail or return unexpected results.

## Observed behavior

- **execCommand**: `document.execCommand('bold')` does not apply formatting.
- **getSelection**: `window.getSelection().getRangeAt(0).toString()` returns empty string.
- **Range operations**: Range manipulation may not work correctly.
- **Selection styling**: Cannot apply styles to selected text.
- **Text manipulation**: Text insertion and deletion may fail.

## Expected behavior

- `document.execCommand` should work on contenteditable elements in Shadow DOM.
- `window.getSelection()` should return correct selection information.
- Range operations should work as expected.
- Text manipulation should function normally.

## Analysis

Shadow DOM encapsulation isolates content from the main document. The Selection API and execCommand operate on the document level and may not properly traverse Shadow DOM boundaries. Event retargeting in Shadow DOM also affects how selections are reported.

## Workarounds

- Use open Shadow DOM to allow external scripts to interact with internal elements.
- Access selection through the Shadow DOM's root: `shadowRoot.getSelection()` (if available).
- Use modern alternatives to execCommand (Input Events API, Selection API with manual DOM manipulation).
- Implement custom selection and formatting handlers that work within Shadow DOM.
- Consider using libraries that handle Shadow DOM complexities.
- Expose methods from the Web Component to manipulate content programmatically.
