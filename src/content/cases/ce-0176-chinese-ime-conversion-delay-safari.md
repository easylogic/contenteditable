---
id: ce-0176
scenarioId: scenario-ime-candidate-list-and-conversion-issues
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Chinese (IME - Pinyin)
caseTitle: Chinese IME conversion delay and partial conversion in Safari
description: "When using Chinese Pinyin IME in Safari on macOS, character conversion may be delayed, or only part of the input may be converted while the rest remains as Pinyin. The conversion process may also be interrupted by user interactions."
tags:
  - ime
  - composition
  - chinese
  - pinyin
  - conversion
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">nihao</span>'
    description: "Chinese Pinyin input in progress (nihao), conversion pending"
  - label: "After Partial Conversion (Bug)"
    html: 'Hello 你hao'
    description: "Only partial conversion completed, some remains as Pinyin"
  - label: "✅ Expected"
    html: 'Hello 你好'
    description: "Expected: Entire Pinyin converted to Chinese characters"
---

## Phenomenon

When composing Chinese text with Pinyin IME in a contenteditable element in Safari on macOS, character conversion may be delayed significantly, or only part of the Pinyin input may be converted to Chinese characters while the rest remains as Pinyin. The conversion process may also be interrupted by clicking, arrow keys, or other interactions.

## Reproduction example

1. Create a contenteditable div.
2. Switch to Chinese Pinyin IME.
3. Type Pinyin text (e.g., "nihao" for 你好).
4. Wait for conversion or press Space/Enter to trigger conversion.
5. Observe conversion timing and completeness.

## Observed behavior

- Conversion may take several seconds or not complete
- Only first character may convert while rest remains as Pinyin
- Conversion may be cancelled by clicking or arrow keys
- Multiple candidate selection may not work correctly
- Mixed Pinyin and Chinese characters may appear in text

## Expected behavior

- Conversion should complete quickly and reliably
- All Pinyin input should be converted to Chinese characters
- Conversion should not be interrupted by normal interactions
- Candidate selection should work correctly

## Impact

- Users experience frustration with slow or incomplete conversions
- Workflow is disrupted when conversions fail
- Text may contain unintentional mixed Pinyin and Chinese characters

## Browser Comparison

- **Safari**: Conversion delays and interruptions are more common
- **Chrome**: Generally more reliable conversion
- **Firefox**: May have different conversion behavior

## Notes and possible direction for workarounds

- Monitor composition events to detect conversion state
- Delay handling of user interactions during conversion
- Validate text after composition to detect failed conversions
- Provide user feedback when conversion appears to be delayed

