---
id: ce-0197
scenarioId: scenario-space-during-composition
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Arabic (IME)
caseTitle: Arabic IME Space key ignored during composition
description: "While composing Arabic text with IME in a contenteditable element, pressing the Space key may be ignored or may commit the composition unexpectedly. This behavior differs from native text controls and can affect word boundary detection in RTL text."
tags:
  - composition
  - ime
  - space
  - arabic
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: '<span dir="rtl">Hello <span style="text-decoration: underline; background: #fef08a;">مرح</span></span>'
    description: "아랍어 조합 중 (مرح), RTL 방향, 문자 연결 중"
  - label: "After Space (Bug)"
    html: '<span dir="rtl">Hello مرح</span>'
    description: "Space 키가 무시되거나 조합이 예상치 못하게 확정됨"
  - label: "✅ Expected"
    html: '<span dir="rtl">Hello مرح </span>'
    description: "정상: Space 키로 공백 삽입 또는 조합 확정"
---

### Phenomenon

While composing Arabic text with IME in a `contenteditable` element, pressing the Space key may be ignored or may commit the composition unexpectedly. This behavior differs from native text controls and can affect word boundary detection in RTL text.

### Reproduction example

1. Focus the editable area.
2. Activate Arabic IME.
3. Start composing Arabic text with character joining (e.g., "مرحبا").
4. Press Space one or more times during composition.

### Observed behavior

- The Space key sometimes does not insert a visible space
- In some sequences, the composition is committed and a space is inserted, but the order of events differs from native controls
- Character joining may be affected by Space key presses
- Word boundaries may not be detected correctly in RTL context

### Expected behavior

- Space behaves consistently across `contenteditable` and native text inputs
- Space should insert reliably during or after composition
- Word boundaries should be detected correctly in RTL text

### Browser Comparison

- **Chrome**: Space may be ignored during Arabic composition
- **Edge**: Similar to Chrome
- **Firefox**: May have different behavior
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Monitor composition state to handle Space key appropriately
- Consider RTL text direction when handling word boundaries
- Handle Space key events carefully during active composition with character joining

