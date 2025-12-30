---
id: ce-0201
scenarioId: scenario-ime-composition-focus-blur
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Chinese (IME - Pinyin)
caseTitle: Chinese IME composition lost when focus changes in Chrome
description: "When composing Chinese text with Pinyin IME in a contenteditable element, clicking elsewhere or changing focus causes incomplete character conversions to be lost. The composition may be cancelled before conversion is complete."
tags:
  - composition
  - ime
  - focus
  - blur
  - chinese
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">nihao</span>'
    description: "Chinese Pinyin input in progress (nihao), candidate list displayed"
  - label: "After Blur (Bug)"
    html: 'Hello '
    description: "Focus change cancels composition, incomplete kanji conversion lost"
  - label: "✅ Expected"
    html: 'Hello 你好'
    description: "Expected: Composition preserved or handled gracefully"
---

## Phenomenon

When composing Chinese text with Pinyin IME in a `contenteditable` element, clicking elsewhere or changing focus causes incomplete character conversions to be lost. The composition may be cancelled before conversion is complete, resulting in lost work.

## Reproduction example

1. Focus the editable area.
2. Activate Chinese Pinyin IME.
3. Type Pinyin text (e.g., "nihao") and start character conversion.
4. Click elsewhere or change focus before completing the conversion.

## Observed behavior

- The compositionend event fires with incomplete data
- Incomplete character conversions are lost
- The blur event may fire before or after compositionend
- Candidate list disappears without committing selection

## Expected behavior

- Composition should be preserved or gracefully handled when focus changes
- Incomplete conversions should not be lost
- Event sequence should be predictable and consistent

## Browser Comparison

- **Chrome**: Composition may be lost on blur
- **Edge**: Similar to Chrome
- **Firefox**: May have different behavior
- **Safari**: Not applicable on Windows

## Notes and possible direction for workarounds

- Monitor blur and compositionend events to detect composition loss
- Consider storing pending conversion state for recovery
- Prevent programmatic blur during active conversion if possible

