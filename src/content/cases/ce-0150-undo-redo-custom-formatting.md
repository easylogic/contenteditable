---
id: ce-0150
scenarioId: scenario-undo-redo-stack
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Custom formatting operations cannot be undone
description: "When using preventDefault() and implementing custom formatting operations (bold, italic, etc.), those operations cannot be undone using Ctrl+Z. The undo stack does not include custom operations."
tags:
  - undo
  - redo
  - formatting
  - custom
  - chrome
status: draft
---

### Phenomenon

When using `preventDefault()` and implementing custom formatting operations (bold, italic, etc.), those operations cannot be undone using Ctrl+Z. The undo stack does not include custom operations.

### Reproduction example

1. Implement custom bold formatting with `preventDefault()`
2. Apply bold to selected text
3. Press Ctrl+Z to undo

### Observed behavior

- Bold formatting is not undone
- Browser's undo stack does not include the operation
- User cannot undo custom formatting
- Undo/redo functionality is broken for custom features

### Expected behavior

- Custom formatting should be undoable
- Undo stack should include all operations
- Ctrl+Z should work for custom formatting
- Redo should also work

### Browser Comparison

- **All browsers**: Custom operations not in undo stack
- This is expected when using `preventDefault()`
- Custom undo/redo implementation needed

### Notes and possible direction for workarounds

- Implement custom undo/redo stack
- Save state before each formatting operation
- Restore state on undo
- Handle Ctrl+Z and Ctrl+Y manually

