---
id: ce-0007
scenarioId: scenario-undo-with-composition
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: Undo during IME composition clears more text than expected
description: "Pressing Undo while an IME composition is active in a contenteditable element removes more text than expected, including characters that were committed before the current composition."
tags:
  - undo
  - composition
  - ime
status: draft
domSteps:
  - label: "Before"
    html: 'Hello 한 <span style="text-decoration: underline; background: #fef08a;">글</span>'
    description: "이미 확정된 '한'과 조합 중인 '글'"
  - label: "After Undo (Bug)"
    html: 'Hello '
    description: "Undo로 '한'과 '글' 모두 삭제됨"
  - label: "✅ Expected"
    html: 'Hello '
    description: "정상: 조합 중인 '글'만 취소, '한'은 유지되어야 함"
---

### Phenomenon

Pressing Undo while an IME composition is active in a `contenteditable` element removes more text
than expected, including characters that were committed before the current composition.

### Reproduction example

1. Focus the editable area.
2. Type a short word and finalize it.
3. Activate a Korean IME and start composing another word, but do not finalize it.
4. Press Ctrl+Z (or the platform-specific Undo shortcut).

### Observed behavior

- Both the active composition and previously committed characters are removed.
- The event log shows a sequence of `beforeinput` / `input` events that do not map cleanly to user
  intent.

### Expected behavior

- Undo reverts only the last committed edit step, or at least behaves in the same way as native
  controls in the same environment.

### Notes

- This behavior can interfere with predictable text editing and undo/redo stacks in products that
  build their own model on top of `contenteditable`.


