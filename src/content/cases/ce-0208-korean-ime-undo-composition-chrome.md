---
id: ce-0208
scenarioId: scenario-undo-with-composition
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: Korean IME Undo during composition clears more text than expected
description: "Pressing Undo while Korean IME composition is active in a contenteditable element removes more text than expected, including characters that were committed before the current composition."
tags:
  - undo
  - composition
  - ime
  - korean
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello 한 <span style="text-decoration: underline; background: #fef08a;">글</span>'
    description: "Already committed '한' and composing '글'"
  - label: "After Undo (Bug)"
    html: 'Hello '
    description: "Undo deletes both '한' and '글'"
  - label: "✅ Expected"
    html: 'Hello '
    description: "Expected: Only cancel composing '글', '한' should be preserved"
---
---

### Phenomenon

Pressing Undo while Korean IME composition is active in a `contenteditable` element removes more text than expected, including characters that were committed before the current composition.

### Reproduction example

1. Focus the editable area.
2. Type a short word and finalize it (e.g., "한").
3. Activate Korean IME and start composing another word (e.g., "글"), but do not finalize it.
4. Press Ctrl+Z (or the platform-specific Undo shortcut).

### Observed behavior

- Both the active composition and previously committed characters are removed
- The event log shows a sequence of `beforeinput` / `input` events that do not map cleanly to user intent
- Undo granularity is incorrect

### Expected behavior

- Undo reverts only the last committed edit step, or at least behaves in the same way as native controls in the same environment
- Active composition should be cancelled, but previously committed text should remain

### Browser Comparison

- **Chrome**: Undo may remove more than expected during composition
- **Edge**: Similar to Chrome
- **Firefox**: May have different undo behavior
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- This behavior can interfere with predictable text editing and undo/redo stacks
- Monitor composition state when handling undo operations
- Consider implementing custom undo/redo logic for better control

