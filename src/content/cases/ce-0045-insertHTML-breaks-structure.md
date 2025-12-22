---
id: ce-0045
scenarioId: scenario-insertHTML-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: insertHTML breaks DOM structure and formatting
description: "When using document.execCommand('insertHTML', ...) to insert HTML content into a contenteditable region, the DOM structure may be broken or reformatted unexpectedly. Nested elements may be flattened or reformatted."
tags:
  - insertHTML
  - dom
  - formatting
  - chrome
status: draft
---

### Phenomenon

When using `document.execCommand('insertHTML', ...)` to insert HTML content into a contenteditable region, the DOM structure may be broken or reformatted unexpectedly. Nested elements may be flattened or reorganized.

### Reproduction example

1. Create a contenteditable div.
2. Select a position within it.
3. Use `document.execCommand('insertHTML', false, '<p><strong>Bold text</strong></p>')`.
4. Inspect the resulting DOM structure.

### Observed behavior

- In Chrome on Windows, `insertHTML` may break the DOM structure.
- Nested elements may be flattened or reorganized.
- Formatting may be lost or changed unexpectedly.

### Expected behavior

- `insertHTML` should preserve the HTML structure as provided.
- Nested elements should remain nested.
- Formatting should be maintained.

