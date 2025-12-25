---
id: ce-0183
scenarioId: scenario-space-during-composition
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese (IME)
caseTitle: Japanese IME Space key conflicts with kanji conversion
description: "When using Japanese IME in a contenteditable element, the Space key is used for kanji conversion, which conflicts with inserting a space character. Pressing Space during composition may trigger conversion instead of inserting a space, or may behave inconsistently compared to native text controls."
tags:
  - composition
  - ime
  - space
  - japanese
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "일본어 로마지 입력 중 (kanji → かんじ)"
  - label: "After Space (Bug)"
    html: 'Hello 漢字'
    description: "Space 키로 한자 변환, 공백 삽입 실패"
  - label: "✅ Expected"
    html: 'Hello 漢字 '
    description: "정상: 한자 변환 후 공백 삽입"
---

### Phenomenon

When using Japanese IME in a `contenteditable` element, the Space key is used for kanji conversion, which conflicts with inserting a space character. Pressing Space during composition may trigger conversion instead of inserting a space, or may behave inconsistently compared to native text controls.

### Reproduction example

1. Focus the editable area.
2. Activate Japanese IME.
3. Type romaji text (e.g., "kanji").
4. Press Space to trigger kanji conversion.
5. Try to insert a space character after conversion.

### Observed behavior

- Space key triggers kanji conversion instead of inserting a space character
- After conversion, inserting a space may require multiple Space presses
- Behavior may differ from native text input controls
- The order of events (composition, conversion, space insertion) may be inconsistent

### Expected behavior

- Space key behavior should be consistent across `contenteditable` and native text inputs
- Users should be able to reliably insert space characters
- Conversion and space insertion should not conflict

### Browser Comparison

- **Chrome**: Space key behavior may conflict with conversion
- **Edge**: Similar to Chrome
- **Firefox**: May have different behavior
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Monitor composition and conversion state to distinguish between conversion Space and insertion Space
- Consider using alternative methods to insert spaces during composition
- Handle Space key events carefully during active composition

