---
id: ce-0200-vietnamese-ime-backspace-granularity-edge
scenarioId: scenario-ime-interaction-patterns
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: Vietnamese (IME)
caseTitle: Vietnamese IME Backspace removes entire character with diacritics
description: "When editing Vietnamese text with IME in a contenteditable element, pressing Backspace removes the entire character including diacritic marks instead of allowing component-level editing. This makes fine-grained correction difficult."
tags:
  - composition
  - ime
  - backspace
  - vietnamese
  - edge
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello xin chào'
    description: "Vietnamese text input completed (includes accent marks)"
  - label: "After Backspace (Bug)"
    html: 'Hello xin '
    description: "Entire character 'chào' deleted (single Backspace)"
  - label: "✅ Expected"
    html: 'Hello xin chà'
    description: "Expected: Delete one character at a time (first Backspace deletes only 'o')"
---

## Phenomenon

When editing Vietnamese text with IME in a `contenteditable` element, pressing Backspace removes the entire character including diacritic marks instead of allowing component-level editing. This makes fine-grained correction difficult and differs from native input fields.

## Reproduction example

1. Focus the editable area.
2. Activate Vietnamese IME (Telex or VNI input method).
3. Type a Vietnamese character with diacritics (e.g., "xin chào").
4. Press Backspace once.

## Observed behavior

- The entire character with all diacritics is removed by a single Backspace press
- Component-level editing (e.g., editing just the diacritic) is not possible
- The event log shows only one `beforeinput` / `input` pair for the deletion
- Behavior differs from native input fields

## Expected behavior

- Each Backspace press should allow more granular deletion, matching how native inputs behave
- Component-level editing should be possible
- Behavior should be consistent with native input fields

## Browser Comparison

- **Edge**: May remove entire characters with diacritics
- **Chrome**: Similar to Edge
- **Firefox**: May have different granularity behavior
- **Safari**: Not applicable on Windows

## Notes and possible direction for workarounds

- Compare behavior with a plain `<input>` element in the same environment to confirm the difference
- This behavior can affect cursor movement, undo granularity, and diff calculation
- Consider implementing custom backspace handling for finer control with diacritics

