---
id: ce-0193-korean-ime-paste-cancels-firefox
scenarioId: scenario-ime-composition-paste
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: Korean IME composition cancelled by paste operation in Firefox
description: "When composing Korean text with IME in a contenteditable element, pasting content (Ctrl+V) cancels the active composition and loses the composed text. The pasted content may also be inserted in an unexpected position."
tags:
  - composition
  - ime
  - paste
  - korean
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한글</span>'
    description: "Korean composition in progress"
  - label: "After Paste (Bug)"
    html: 'Hello World'
    description: "Paste cancels composition, composition text lost, only pasted content remains"
  - label: "✅ Expected"
    html: 'Hello 한글World'
    description: "Expected: Paste after composition completes or composition text preserved"
---

## Phenomenon

When composing Korean text with IME in a `contenteditable` element, pasting content (Ctrl+V) cancels the active composition and loses the composed text. The pasted content may also be inserted in an unexpected position.

## Reproduction example

1. Focus the editable area.
2. Activate Korean IME.
3. Start composing Korean text (e.g., type "한글").
4. Press Ctrl+V to paste content before completing composition.

## Observed behavior

- The compositionend event fires with incomplete data
- The composed text is lost
- Pasted content is inserted, possibly in wrong position
- The sequence of `paste`, `compositionend`, and `input` events may be inconsistent

## Expected behavior

- Composition should complete before paste occurs, or paste should be queued
- Composed text should not be lost
- Pasted content should be inserted in the correct position
- Event sequence should be predictable and consistent

## Browser Comparison

- **Firefox**: Paste may cancel composition
- **Chrome**: May have different paste behavior during composition
- **Edge**: Similar to Chrome
- **Safari**: Not applicable on Windows

## Notes and possible direction for workarounds

- Prevent paste during active composition
- Wait for composition to complete, then allow paste
- Handle paste events carefully during composition

