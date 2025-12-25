---
id: ce-0184
scenarioId: scenario-space-during-composition
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Thai (IME)
caseTitle: Thai IME Space key ignored during composition
description: "While composing Thai text with IME in a contenteditable element, pressing the Space key may be ignored or may commit the composition unexpectedly. This behavior differs from native text controls and can affect word boundary detection."
tags:
  - composition
  - ime
  - space
  - thai
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">สวัส</span>'
    description: "태국어 조합 중 (สวัส), 톤 마크와 모음 마크 포함"
  - label: "After Space (Bug)"
    html: 'Hello สวัส'
    description: "Space 키가 무시되거나 조합이 예상치 못하게 확정됨"
  - label: "✅ Expected"
    html: 'Hello สวัส '
    description: "정상: Space 키로 공백 삽입 또는 조합 확정"
---

### Phenomenon

While composing Thai text with IME in a `contenteditable` element, pressing the Space key may be ignored or may commit the composition unexpectedly. This behavior differs from native text controls and can affect word boundary detection.

### Reproduction example

1. Focus the editable area.
2. Activate Thai IME.
3. Start composing Thai text with tone marks and vowel marks.
4. Press Space one or more times during composition.

### Observed behavior

- The Space key sometimes does not insert a visible space
- In some sequences, the composition is committed and a space is inserted, but the order of events differs from native controls
- Tone marks or vowel marks may be affected by Space key presses
- Word boundaries may not be detected correctly

### Expected behavior

- Space behaves consistently across `contenteditable` and native text inputs
- Space should insert reliably during or after composition
- Word boundaries should be detected correctly

### Browser Comparison

- **Firefox**: May have more issues with Space key during Thai composition
- **Chrome**: Generally better support
- **Edge**: Similar to Chrome
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Monitor composition state to handle Space key appropriately
- Consider alternative methods for word boundary detection
- Handle Space key events carefully during active composition with combining characters

