---
id: ce-0113-undo-redo-custom-ops
scenarioId: scenario-undo-redo-stack
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Custom operations are not added to undo stack
description: "When using preventDefault() and implementing custom editing operations, those operations are not added to the browser's undo stack. Users cannot undo custom operations using Ctrl+Z."
tags:
  - undo
  - redo
  - history
  - chrome
status: draft
---

## Phenomenon

When using `preventDefault()` and implementing custom editing operations, those operations are not added to the browser's undo stack. Users cannot undo custom operations using Ctrl+Z.

## Reproduction example

1. Implement custom text insertion with `preventDefault()`
2. Insert some text
3. Press Ctrl+Z to undo

## Observed behavior

- Custom operation is not undone
- Browser's undo stack does not include the operation
- User cannot undo custom operations
- Undo/redo functionality is broken for custom features

## Expected behavior

- Custom operations should be undoable
- Undo stack should include all operations
- Ctrl+Z should work for custom operations
- Redo should also work

## Browser Comparison

- **All browsers**: Custom operations not in undo stack
- This is expected behavior when using `preventDefault()`
- Custom undo/redo implementation needed

## Notes and possible direction for workarounds

- Implement custom undo/redo stack
- Save state before each operation
- Restore state on undo
- Handle Ctrl+Z and Ctrl+Y manually
- Maintain separate undo/redo stacks

