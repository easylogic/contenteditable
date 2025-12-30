---
id: ce-0204
scenarioId: scenario-ime-composition-paste
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Hindi (IME - Devanagari)
caseTitle: Hindi IME composition cancelled by paste operation in Chrome
description: "When composing Hindi text with Devanagari IME in a contenteditable element, pasting content (Ctrl+V) cancels the active composition and loses the composed text including vowel signs and conjuncts. The pasted content may also be inserted in an unexpected position."
tags:
  - composition
  - ime
  - paste
  - hindi
  - devanagari
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">नम</span>'
    description: "Hindi Devanagari composition in progress (नम), includes vowel signs and combining characters"
  - label: "After Paste (Bug)"
    html: 'Hello World'
    description: "Paste cancels composition, composition text lost, only pasted content remains"
  - label: "✅ Expected"
    html: 'Hello नमस्तेWorld'
    description: "Expected: Paste after composition completes or composition text preserved"
---

## Phenomenon

When composing Hindi text with Devanagari IME in a `contenteditable` element, pasting content (Ctrl+V) cancels the active composition and loses the composed text including vowel signs and conjuncts. The pasted content may also be inserted in an unexpected position.

## Reproduction example

1. Focus the editable area.
2. Activate Hindi IME with Devanagari script.
3. Start composing Hindi text with vowel signs and conjuncts (e.g., "नमस्ते").
4. Press Ctrl+V to paste content before completing composition.

## Observed behavior

- The compositionend event fires with incomplete data
- The composed text including combining characters is lost
- Pasted content is inserted, possibly in wrong position
- The sequence of `paste`, `compositionend`, and `input` events may be inconsistent

## Expected behavior

- Composition should complete before paste occurs, or paste should be queued
- All combining characters should be preserved
- Pasted content should be inserted in the correct position
- Event sequence should be predictable and consistent

## Browser Comparison

- **Chrome**: Paste may cancel composition
- **Edge**: Similar to Chrome
- **Firefox**: May have different paste behavior during composition
- **Safari**: Not applicable on Windows

## Notes and possible direction for workarounds

- Prevent paste during active composition
- Wait for composition to complete, then allow paste
- Handle paste events carefully during composition, especially with complex character combinations

