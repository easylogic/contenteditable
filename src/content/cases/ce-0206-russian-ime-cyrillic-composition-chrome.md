---
id: ce-0206
scenarioId: scenario-ime-combining-characters-composition
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Russian (IME - Cyrillic)
caseTitle: Russian IME Cyrillic character composition issues
description: "When composing Russian text with Cyrillic IME in a contenteditable element, some Cyrillic characters may not compose correctly, or keyboard layout switching may cause unexpected character insertion."
tags:
  - ime
  - composition
  - russian
  - cyrillic
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">Прив</span>'
    description: "러시아어 키릴 문자 입력 중 (Прив)"
  - label: "After (Bug)"
    html: 'Hello Прив'
    description: "문자 조합 오류 또는 키보드 레이아웃 전환 문제"
  - label: "✅ Expected"
    html: 'Hello Привет'
    description: "정상: 키릴 문자가 올바르게 조합됨"
---
### Phenomenon

When composing Russian text with Cyrillic IME in a `contenteditable` element, some Cyrillic characters may not compose correctly, or keyboard layout switching may cause unexpected character insertion.

### Reproduction example

1. Focus the editable area.
2. Activate Russian Cyrillic IME or switch keyboard layout to Russian.
3. Type Russian text (e.g., "Привет").
4. Observe character composition and keyboard layout behavior.

### Observed behavior

- Some Cyrillic characters may not compose correctly
- Keyboard layout switching may cause unexpected character insertion
- Character encoding issues may occur
- Behavior may differ from native input fields

### Expected behavior

- Cyrillic characters should compose correctly
- Keyboard layout switching should work smoothly
- Character encoding should be consistent
- Behavior should match native input fields

### Browser Comparison

- **Chrome**: Generally good support for Cyrillic
- **Edge**: Similar to Chrome
- **Firefox**: May have different behavior
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Monitor keyboard layout changes
- Handle character encoding carefully
- Validate Cyrillic character composition

