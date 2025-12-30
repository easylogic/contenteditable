---
id: ce-0178
scenarioId: scenario-ime-combining-characters-composition
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Vietnamese (IME)
caseTitle: Vietnamese IME diacritic marks lost during composition in Chrome
description: "When using Vietnamese IME in Chrome on Windows, diacritic marks (accents) may be lost during composition or editing operations. Base letters and diacritics may not combine correctly, or diacritics may combine with the wrong base letter."
tags:
  - ime
  - composition
  - vietnamese
  - diacritics
  - accents
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">xin chao</span>'
    description: "Vietnamese input in progress (xin chao)"
  - label: "After (Bug)"
    html: 'Hello xin chao'
    description: "Accent marks lost (chào → chao)"
  - label: "✅ Expected"
    html: 'Hello xin chào'
    description: "Expected: Accent marks preserved (chào)"
---

## Phenomenon

When composing Vietnamese text with IME in a contenteditable element in Chrome on Windows, diacritic marks (ă, â, ê, ô, ơ, ư and their tone marks) may be lost during composition or when using backspace/delete. Diacritics may also combine with the wrong base letter, or base letters and diacritics may be inserted in the wrong order.

## Reproduction example

1. Create a contenteditable div.
2. Switch to Vietnamese IME (Telex or VNI input method).
3. Type Vietnamese text with diacritics (e.g., "xin chào").
4. Use backspace to delete characters.
5. Observe if diacritics are preserved correctly.

## Observed behavior

- Diacritic marks may be lost during composition
- Diacritics may combine with wrong base letter
- Base letter and diacritic may be inserted in wrong order
- Backspace may not remove both base and diacritic correctly
- Multiple diacritics may not combine properly

## Expected behavior

- Diacritic marks should be preserved during composition
- Diacritics should combine correctly with base letters
- Base letters and diacritics should be inserted in correct order
- Backspace should handle base+diacritic combinations correctly
- Multiple diacritics should combine properly

## Impact

- Vietnamese text may be misspelled or unreadable
- Users must manually correct diacritics frequently
- Text may appear correct but be semantically wrong

## Browser Comparison

- **Chrome**: Generally good support but diacritic loss can occur
- **Edge**: Similar to Chrome
- **Firefox**: May have more issues with diacritic positioning
- **Safari**: Diacritic composition can be inconsistent

## Notes and possible direction for workarounds

- Monitor composition events to detect diacritic formation
- Validate Vietnamese character formation after input
- Use text normalization (NFC) to ensure proper character combination
- Handle backspace carefully to preserve diacritics
- Check for proper Unicode normalization of Vietnamese characters

