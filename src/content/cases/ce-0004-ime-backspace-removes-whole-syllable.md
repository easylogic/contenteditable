---
id: ce-0004
scenarioId: scenario-ime-backspace-granularity
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: Backspace removes a whole composed syllable instead of a single jamo
description: "When editing Korean text in a contenteditable element, pressing Backspace removes the entire composed syllable instead of a single jamo. This makes fine-grained correction difficult and differs from the expected behavior."
tags:
  - composition
  - ime
  - backspace
status: draft
domSteps:
  - label: "Before"
    html: 'Hello 한글'
    description: "Korean text input completed"
  - label: "After Backspace (Bug)"
    html: 'Hello '
    description: "Entire syllable '한글' deleted (single Backspace)"
  - label: "✅ Expected"
    html: 'Hello 한'
    description: "Expected: Delete one character at a time (first Backspace deletes only '글')"
---

## Phenomenon

When editing Korean text in a `contenteditable` element, pressing Backspace removes the entire
composed syllable instead of a single jamo. This makes fine-grained correction difficult and
differs from native input fields on the same platform.

## Reproduction example

1. Focus the editable area.
2. Activate a Korean IME.
3. Type one composed syllable (for example, three jamo characters that form a syllable).
4. Press Backspace once.

## Observed behavior

- The entire syllable is removed by a single Backspace press.
- The event log shows only one `beforeinput` / `input` pair for the deletion.

## Expected behavior

- Each Backspace press removes a single jamo, matching how native inputs behave in the same OS,
  browser, and IME configuration.

## Notes

- Compare behavior with a plain `<input>` element in the same environment to confirm the
  difference.
- This behavior can affect cursor movement, undo granularity, and diff calculation for text
  editors built on top of `contenteditable`.


