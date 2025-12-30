---
id: ce-0191
scenarioId: scenario-ime-composition-number-input
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese (IME)
caseTitle: Japanese IME number keys select candidates instead of inserting numbers
description: "When using Japanese IME in a contenteditable element, pressing number keys (1-9) during kanji conversion selects candidates from the conversion list instead of inserting numbers. This prevents users from inserting numbers while the candidate list is active."
tags:
  - composition
  - ime
  - number-input
  - candidate-selection
  - japanese
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Japanese romaji input in progress, candidate list displayed (1. 漢字 2. 感じ 3. 幹事...)"
  - label: "After Number 5 (Bug)"
    html: 'Hello 幹事'
    description: "Number 5 key selects candidate, number insertion fails"
  - label: "✅ Expected"
    html: 'Hello かんじ5'
    description: "Expected: Number 5 inserted or Shift+5 can input number"
---

## Phenomenon

When using Japanese IME in a `contenteditable` element, pressing number keys (1-9) during kanji conversion selects candidates from the conversion list instead of inserting numbers. This prevents users from inserting numbers while the candidate list is active.

## Reproduction example

1. Focus the editable area.
2. Activate Japanese IME.
3. Type romaji text (e.g., "kanji") and trigger kanji conversion (candidate list appears).
4. Try to press a number key (e.g., "5") to insert the number "5".

## Observed behavior

- Number keys (1-9) select candidates from the conversion list instead of inserting numbers
- Users cannot insert numbers while candidate list is active
- After conversion completes, number keys work normally
- Behavior differs from native input fields where numbers can be inserted

## Expected behavior

- Users should be able to insert numbers even when candidate list is active
- Number keys should have a way to insert numbers (e.g., Shift+Number or different key combination)
- Behavior should be consistent with native input fields

## Browser Comparison

- **Chrome**: Number keys trigger candidate selection
- **Edge**: Similar to Chrome
- **Firefox**: May have different number key behavior
- **Safari**: Not applicable on Windows

## Notes and possible direction for workarounds

- Prevent number key default behavior and insert numbers manually
- Use alternative key combinations for number input during candidate selection
- Provide UI feedback to users about number input limitations

