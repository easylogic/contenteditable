---
id: ce-0044
scenarioId: scenario-selection-api-behavior
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: window.getSelection() returns null when contenteditable loses focus
tags:
  - selection
  - api
  - focus
  - safari
status: draft
---

### Phenomenon

When a contenteditable region loses focus, `window.getSelection()` may return `null` in Safari, even if there was a valid selection before the focus loss. This makes it difficult to preserve or work with selections.

### Reproduction example

1. Create a contenteditable div.
2. Select some text within it.
3. Click outside the contenteditable to remove focus.
4. Call `window.getSelection()`.
5. Observe the return value.

### Observed behavior

- In Safari on macOS, `window.getSelection()` returns `null` after focus loss.
- The selection information is lost.
- There is no way to retrieve the previous selection state.

### Expected behavior

- `window.getSelection()` should return a valid Selection object even after focus loss.
- Or, there should be a way to preserve selection state before focus loss.
- Selection information should be accessible when needed.

