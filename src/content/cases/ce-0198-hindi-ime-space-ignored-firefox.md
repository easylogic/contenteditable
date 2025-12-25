---
id: ce-0198
scenarioId: scenario-space-during-composition
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Hindi (IME - Devanagari)
caseTitle: Hindi IME Space key ignored during composition
description: "While composing Hindi text with Devanagari IME in a contenteditable element, pressing the Space key may be ignored or may commit the composition unexpectedly. This behavior differs from native text controls and can affect word boundary detection."
tags:
  - composition
  - ime
  - space
  - hindi
  - devanagari
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">नम</span>'
    description: "힌디어 데바나가리 조합 중 (नम), 모음 기호와 결합 문자 포함"
  - label: "After Space (Bug)"
    html: 'Hello नम'
    description: "Space 키가 무시되거나 조합이 예상치 못하게 확정됨"
  - label: "✅ Expected"
    html: 'Hello नम '
    description: "정상: Space 키로 공백 삽입 또는 조합 확정"
---

### Phenomenon

While composing Hindi text with Devanagari IME in a `contenteditable` element, pressing the Space key may be ignored or may commit the composition unexpectedly. This behavior differs from native text controls and can affect word boundary detection.

### Reproduction example

1. Focus the editable area.
2. Activate Hindi IME with Devanagari script.
3. Start composing Hindi text with vowel signs and conjuncts (e.g., "नमस्ते").
4. Press Space one or more times during composition.

### Observed behavior

- The Space key sometimes does not insert a visible space
- In some sequences, the composition is committed and a space is inserted, but the order of events differs from native controls
- Vowel signs or conjuncts may be affected by Space key presses
- Word boundaries may not be detected correctly

### Expected behavior

- Space behaves consistently across `contenteditable` and native text inputs
- Space should insert reliably during or after composition
- Word boundaries should be detected correctly

### Browser Comparison

- **Firefox**: May have more issues with Space key during Devanagari composition
- **Chrome**: Generally better support
- **Edge**: Similar to Chrome
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Monitor composition state to handle Space key appropriately
- Consider complex character combinations when handling word boundaries
- Handle Space key events carefully during active composition with combining characters

