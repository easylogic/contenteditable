---
id: ce-0188
scenarioId: scenario-ime-composition-focus-blur
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Japanese (IME)
caseTitle: Japanese IME composition lost when focus changes in Safari
description: "When composing Japanese text with IME in a contenteditable element, clicking elsewhere or changing focus causes incomplete kanji conversions to be lost. The composition may be cancelled before conversion is complete."
tags:
  - composition
  - ime
  - focus
  - blur
  - japanese
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Japanese romaji input in progress (kanji → かんじ), candidate list displayed"
  - label: "After Blur (Bug)"
    html: 'Hello '
    description: "Focus change cancels composition, incomplete kanji conversion lost"
  - label: "✅ Expected"
    html: 'Hello 漢字'
    description: "Expected: Composition preserved or handled gracefully"
---

## Phenomenon

When composing Japanese text with IME in a `contenteditable` element, clicking elsewhere or changing focus causes incomplete kanji conversions to be lost. The composition may be cancelled before conversion is complete, resulting in lost work.

## Reproduction example

1. Focus the editable area.
2. Activate Japanese IME.
3. Type romaji text (e.g., "kanji") and start kanji conversion.
4. Click elsewhere or change focus before completing the conversion.

## Observed behavior

- The compositionend event fires with incomplete data
- Incomplete kanji conversions are lost
- The blur event may fire before or after compositionend
- Candidate list disappears without committing selection

## Expected behavior

- Composition should be preserved or gracefully handled when focus changes
- Incomplete conversions should not be lost
- Event sequence should be predictable and consistent

## Browser Comparison

- **Safari**: Composition may be lost on blur, especially on macOS
- **Chrome**: May have different behavior
- **Firefox**: May have different behavior

## Notes and possible direction for workarounds

- Monitor blur and compositionend events to detect composition loss
- Consider storing pending conversion state for recovery
- Prevent programmatic blur during active conversion if possible

