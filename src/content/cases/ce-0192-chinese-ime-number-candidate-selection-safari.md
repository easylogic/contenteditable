---
id: ce-0192
scenarioId: scenario-ime-composition-number-input
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Chinese (IME - Pinyin)
caseTitle: Chinese IME number keys select candidates instead of inserting numbers
description: "When using Chinese Pinyin IME in a contenteditable element, pressing number keys (1-9) during character conversion selects candidates from the conversion list instead of inserting numbers. This prevents users from inserting numbers while the candidate list is active."
tags:
  - composition
  - ime
  - number-input
  - candidate-selection
  - chinese
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">nihao</span>'
    description: "Chinese Pinyin input in progress, candidate list displayed (1. 你好 2. 你号 3. 泥好...)"
  - label: "After Number 3 (Bug)"
    html: 'Hello 泥好'
    description: "Number 3 key selects candidate, number insertion fails"
  - label: "✅ Expected"
    html: 'Hello nihao3'
    description: "Expected: Number 3 inserted or Shift+3 can input number"
---

### Phenomenon

When using Chinese Pinyin IME in a `contenteditable` element, pressing number keys (1-9) during character conversion selects candidates from the conversion list instead of inserting numbers. This prevents users from inserting numbers while the candidate list is active.

### Reproduction example

1. Focus the editable area.
2. Activate Chinese Pinyin IME.
3. Type Pinyin text (e.g., "nihao") and trigger character conversion (candidate list appears).
4. Try to press a number key (e.g., "3") to insert the number "3".

### Observed behavior

- Number keys (1-9) select candidates from the conversion list instead of inserting numbers
- Users cannot insert numbers while candidate list is active
- After conversion completes, number keys work normally
- Behavior differs from native input fields where numbers can be inserted

### Expected behavior

- Users should be able to insert numbers even when candidate list is active
- Number keys should have a way to insert numbers (e.g., Shift+Number or different key combination)
- Behavior should be consistent with native input fields

### Browser Comparison

- **Safari**: Number keys trigger candidate selection, especially on macOS
- **Chrome**: Similar behavior
- **Firefox**: May have different number key behavior

### Notes and possible direction for workarounds

- Prevent number key default behavior and insert numbers manually
- Use alternative key combinations for number input during candidate selection
- Provide UI feedback to users about number input limitations

