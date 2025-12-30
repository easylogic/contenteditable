---
id: ce-0173
scenarioId: scenario-undo-redo-stack
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Custom text insertion cannot be undone
description: "When using preventDefault() and implementing custom text insertion in Chrome, those operations cannot be undone using Ctrl+Z. The undo stack does not include custom text insertions."
tags:
  - undo
  - redo
  - text
  - insertion
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Basic text"
  - label: "After Custom Insert"
    html: 'Hello World New'
    description: "Custom text inserted via preventDefault()"
  - label: "After Undo (Bug)"
    html: 'Hello World New'
    description: "Undo not possible with Ctrl+Z, custom operation not in undo stack"
  - label: "✅ Expected"
    html: 'Hello World'
    description: "Expected: Custom text insertion can be cancelled with Undo"
---

## Phenomenon

When using `preventDefault()` and implementing custom text insertion in Chrome, those operations cannot be undone using Ctrl+Z. The undo stack does not include custom text insertions.

## Reproduction example

1. Implement custom text insertion with `preventDefault()`
2. Insert some text
3. Press Ctrl+Z to undo

## Observed behavior

- Text insertion is not undone
- Browser's undo stack does not include the operation
- User cannot undo custom text insertions
- Undo/redo functionality is broken for custom features

## Expected behavior

- Custom text insertion should be undoable
- Undo stack should include all operations
- Ctrl+Z should work for custom insertions
- Redo should also work

## Browser Comparison

- **All browsers**: Custom operations not in undo stack
- This is expected when using `preventDefault()`
- Custom undo/redo implementation needed

## Notes and possible direction for workarounds

- Implement custom undo/redo stack
- Save state before each text insertion
- Restore state on undo
- Handle Ctrl+Z and Ctrl+Y manually

