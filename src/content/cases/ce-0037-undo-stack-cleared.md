---
id: ce-0037
scenarioId: scenario-undo-redo-behavior
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Undo stack is cleared when programmatically modifying content
description: "When programmatically modifying the content of a contenteditable region (e.g., using innerHTML or textContent), the undo stack is cleared in Safari. This prevents users from undoing their previous edits."
tags:
  - undo
  - programmatic
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Manually entered text"
  - label: "After Programmatic Change"
    html: 'New content'
    description: "innerHTML changed programmatically"
  - label: "After Undo (Bug)"
    html: 'New content'
    description: "Undo stack cleared, cannot cancel previous manual edits"
  - label: "✅ Expected"
    html: 'Hello World'
    description: "Expected: Previous manual edits can be restored with Undo"
---

## Phenomenon

When programmatically modifying the content of a contenteditable region (e.g., using `innerHTML` or `textContent`), the undo stack is cleared in Safari. This prevents users from undoing their previous manual edits.

## Reproduction example

1. Create a contenteditable div.
2. Type some text manually.
3. Use JavaScript to modify the content: `element.innerHTML = 'New content'`.
4. Try to undo (Cmd+Z).
5. Observe whether the previous manual edits can be undone.

## Observed behavior

- In Safari on macOS, programmatic content changes clear the undo stack.
- Users cannot undo their previous manual edits after programmatic changes.
- The undo history is lost unexpectedly.

## Expected behavior

- Programmatic changes should not clear the undo stack for manual edits.
- Or, there should be a way to preserve undo history across programmatic modifications.
- The undo stack should be managed more intelligently.

