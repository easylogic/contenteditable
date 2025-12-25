---
id: ce-0177
scenarioId: scenario-ime-combining-characters-composition
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Thai (IME)
caseTitle: Thai IME tone mark and vowel positioning errors in Firefox
description: "When using Thai IME in Firefox on Windows, tone marks and vowel marks may not position correctly relative to base consonants. Combining characters may not render properly, resulting in incorrectly displayed Thai text."
tags:
  - ime
  - composition
  - thai
  - combining-characters
  - tone-marks
  - firefox
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">สวัส</span>'
    description: "태국어 조합 중 (สวัส)"
  - label: "After (Bug)"
    html: 'Hello สวัส'
    description: "톤 마크 위치 오류 또는 결합 문자 분리"
  - label: "✅ Expected"
    html: 'Hello สวัสดี'
    description: "정상: 톤 마크와 모음 마크가 올바르게 결합"
---

### Phenomenon

When composing Thai text with IME in a contenteditable element in Firefox on Windows, tone marks (ไม้เอก, ไม้โท, etc.) and vowel marks may not position correctly relative to base consonants. Combining characters may not render properly, resulting in Thai text that is difficult or impossible to read.

### Reproduction example

1. Create a contenteditable div.
2. Switch to Thai IME.
3. Type Thai text with tone marks and vowel marks (e.g., "สวัสดี").
4. Observe the positioning of tone marks and vowel marks.
5. Check text rendering in different browsers.

### Observed behavior

- Tone marks may appear above or below the wrong character
- Vowel marks may not combine correctly with consonants
- Character ordering may be incorrect
- Text may appear correct in DOM but render incorrectly visually
- Backspace may not delete combining characters correctly

### Expected behavior

- Tone marks should position correctly relative to base consonants
- Vowel marks should combine correctly with consonants
- Character ordering should follow Thai writing rules
- Visual rendering should match logical structure
- Backspace should handle combining characters correctly

### Impact

- Thai text may be unreadable or difficult to read
- Users cannot reliably input correct Thai text
- Text may appear correct in one browser but wrong in another

### Browser Comparison

- **Firefox**: More issues with combining character positioning
- **Chrome**: Generally better support for Thai composition
- **Safari**: Rendering can be inconsistent

### Notes and possible direction for workarounds

- Validate Thai character composition after input
- Check for proper combining character order
- Monitor for visual rendering issues
- Ensure proper font support for Thai characters
- Consider text normalization (NFC) to fix combining character issues

