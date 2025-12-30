---
id: ce-0016
scenarioId: scenario-undo-redo-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: Undo and redo behavior is inconsistent across browsers
description: "The undo and redo functionality (Ctrl+Z / Ctrl+Y or Cmd+Z / Cmd+Shift+Z) behaves differently across browsers. Some browsers undo individual keystrokes, while others undo larger operations. The undo"
tags:
  - undo
  - redo
  - browser-compatibility
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <strong>World</strong>'
    description: "Formatted text"
  - label: "After typing more"
    html: 'Hello <strong>World</strong> Test'
    description: "Additional text input"
  - label: "After Undo (Bug)"
    html: 'Hello '
    description: "Undo cancels entire formatting operation (not individual key presses)"
  - label: "✅ Expected"
    html: 'Hello <strong>World</strong> '
    description: "Expected: Undo per individual key press (only last 'Test' cancelled)"
---

## Phenomenon

The undo and redo functionality (Ctrl+Z / Ctrl+Y or Cmd+Z / Cmd+Shift+Z) behaves differently across browsers. Some browsers undo individual keystrokes, while others undo larger operations. The undo stack may also be cleared unexpectedly.

## Reproduction example

1. Create a contenteditable div.
2. Type several words.
3. Apply formatting (bold, italic).
4. Type more text.
5. Press Undo (Ctrl+Z or Cmd+Z) multiple times.
6. Observe what gets undone at each step.

## Observed behavior

- In Edge on Windows, undo may revert entire formatting operations rather than individual keystrokes.
- The undo stack may be cleared when focus moves away from the contenteditable.
- Redo behavior may not work consistently after certain operations.

## Expected behavior

- Undo should revert changes in a predictable order (typically most recent first).
- The undo stack should persist while the contenteditable remains in focus.
- Redo should restore undone changes in reverse order.

