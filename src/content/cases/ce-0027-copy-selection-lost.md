---
id: ce-0027
scenarioId: scenario-copy-selection-behavior
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Selection is lost after copying content in contenteditable
tags:
  - copy
  - selection
  - safari
status: draft
---

### Phenomenon

After copying selected text in a contenteditable region using Cmd+C, the selection is lost in Safari. The user must re-select the text to perform additional operations.

### Reproduction example

1. Create a contenteditable div with some text.
2. Select a portion of text.
3. Copy the selection (Cmd+C).
4. Observe whether the selection remains.

### Observed behavior

- In Safari on macOS, the selection is lost after copying.
- The caret may move to an unexpected position.
- The user must manually re-select text to continue editing.

### Expected behavior

- The selection should remain after copying.
- The user should be able to continue working with the selected text.
- Or, the caret should be positioned predictably after the copy operation.

