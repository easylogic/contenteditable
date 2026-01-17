---
id: ce-0180-hindi-ime-devanagari-conjuncts-chrome
scenarioId: scenario-ime-combining-characters-composition
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Hindi (IME - Devanagari)
caseTitle: Hindi IME Devanagari conjunct and vowel sign composition issues in Chrome
description: "When using Hindi IME with Devanagari script in Chrome on Windows, consonant+vowel combinations and conjunct characters may not form correctly. Vowel signs (matras) may be misplaced, or conjunct characters may not render properly."
tags:
  - ime
  - composition
  - hindi
  - devanagari
  - indian-languages
  - conjuncts
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">नम</span>'
    description: "Hindi Devanagari composition in progress (नम)"
  - label: "After (Bug)"
    html: 'Hello न म स् ते'
    description: "Conjunct formation failed, vowel sign position error"
  - label: "✅ Expected"
    html: 'Hello नमस्ते'
    description: "Expected: Conjuncts and vowel signs correctly formed"
---

## Phenomenon

When composing Hindi text with Devanagari IME in a contenteditable element in Chrome on Windows, consonant+vowel combinations and conjunct characters (where multiple consonants combine) may not form correctly. Vowel signs (matras) may be misplaced relative to consonants, or conjunct characters may not render properly, resulting in incorrectly formed Devanagari text.

## Reproduction example

1. Create a contenteditable div.
2. Switch to Hindi IME with Devanagari script.
3. Type Hindi text with vowel signs and conjuncts (e.g., "नमस्ते").
4. Observe vowel sign positioning and conjunct formation.
5. Check text rendering.

## Observed behavior

- Vowel signs (matras) may not position correctly relative to consonants
- Multiple consonants may not combine into conjunct characters
- Character ordering may be incorrect
- Characters may be logically correct but render incorrectly visually
- Backspace may not work correctly with complex character combinations

## Expected behavior

- Vowel signs should position correctly relative to consonants
- Multiple consonants should combine into conjunct characters correctly
- Character ordering should follow Devanagari writing rules
- Visual rendering should match logical structure
- Backspace should handle complex character combinations correctly

## Impact

- Hindi/Indian language text may be unreadable or incorrect
- Users cannot reliably input correct text
- Complex character combinations may fail to form

## Browser Comparison

- **Chrome**: Generally better support but conjunct formation can fail
- **Edge**: Similar to Chrome
- **Firefox**: May have more issues with conjunct formation
- **Safari**: Devanagari rendering can be inconsistent, especially on mobile

## Notes and possible direction for workarounds

- Validate Devanagari character formation after input
- Check for proper vowel sign positioning
- Use text normalization (NFC) to ensure proper character combination
- Monitor for rendering issues
- Ensure proper font support for Devanagari characters
- Handle complex conjunct formation carefully

