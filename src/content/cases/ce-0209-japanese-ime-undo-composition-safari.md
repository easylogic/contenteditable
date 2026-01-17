---
id: ce-0209-japanese-ime-undo-composition-safari
scenarioId: scenario-undo-with-composition
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Japanese (IME)
caseTitle: Japanese IME Undo during composition clears more text than expected
description: "Pressing Undo while Japanese IME composition is active in a contenteditable element removes more text than expected, including characters that were committed before the current composition or incomplete kanji conversions."
tags:
  - undo
  - composition
  - ime
  - japanese
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello 漢 <span style="text-decoration: underline; background: #fef08a;">字</span>'
    description: "Already committed '漢' and composing '字'"
  - label: "After Undo (Bug)"
    html: 'Hello '
    description: "Undo deletes both '漢' and '字'"
  - label: "✅ Expected"
    html: 'Hello 漢'
    description: "Expected: Only cancel composing '字', '漢' should be preserved"
---
---

## Phenomenon

Pressing Undo while Japanese IME composition is active in a `contenteditable` element removes more text than expected, including characters that were committed before the current composition or incomplete kanji conversions.

## Reproduction example

1. Focus the editable area.
2. Type a Japanese character and finalize it (e.g., "漢").
3. Activate Japanese IME and start composing another character (e.g., "字"), but do not finalize it.
4. Press Cmd+Z (or the platform-specific Undo shortcut).

## Observed behavior

- Both the active composition and previously committed characters are removed
- Incomplete kanji conversions may be lost
- The event log shows a sequence of `beforeinput` / `input` events that do not map cleanly to user intent
- Undo granularity is incorrect

## Expected behavior

- Undo reverts only the last committed edit step, or at least behaves in the same way as native controls in the same environment
- Active composition should be cancelled, but previously committed text should remain

## Browser Comparison

- **Safari**: Undo may remove more than expected during composition, especially on macOS
- **Chrome**: May have different undo behavior
- **Firefox**: May have different undo behavior

## Notes and possible direction for workarounds

- This behavior can interfere with predictable text editing and undo/redo stacks
- Monitor composition state when handling undo operations
- Consider implementing custom undo/redo logic for better control

