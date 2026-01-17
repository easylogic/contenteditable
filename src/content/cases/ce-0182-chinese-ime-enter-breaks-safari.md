---
id: ce-0182-chinese-ime-enter-breaks-safari
scenarioId: scenario-ime-enter-breaks
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Chinese (IME - Pinyin)
caseTitle: Chinese IME composition cancelled when pressing Enter
description: "When composing Chinese text with Pinyin IME in a contenteditable element, pressing Enter cancels the composition and may commit only partial Pinyin or incomplete character conversion. The caret moves to the next line but the last composed character may be lost."
tags:
  - composition
  - ime
  - enter
  - chinese
  - safari
  - macos
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">nihao</span>'
    description: "Chinese Pinyin input in progress (nihao)"
  - label: "After Enter (Bug)"
    html: 'Hello nih<br>'
    description: "Enter key cancels composition, only partial Pinyin remains"
  - label: "✅ Expected"
    html: 'Hello 你好<br>'
    description: "Expected: Line break after kanji conversion completes"
---

## Phenomenon

When composing Chinese text with Pinyin IME in a `contenteditable` element, pressing Enter cancels the composition and may commit only partial Pinyin or incomplete character conversion. In some browser and IME combinations, the caret moves to the next line but the last composed character or conversion may be lost.

## Reproduction example

1. Focus the editable area.
2. Activate Chinese Pinyin IME.
3. Type Pinyin text (e.g., "nihao") and start character conversion.
4. Press Enter to insert a new line before completing the conversion.

## Observed behavior

- The compositionend event fires with incomplete data.
- The caret moves to the next line.
- Partial Pinyin or incomplete character conversion may be lost.
- The conversion candidate list may disappear without committing the selection.

## Expected behavior

- The IME finalizes the current composition before inserting a line break.
- The last composed character or conversion remains in the DOM text content.
- If a candidate list is active, it should be handled appropriately.

## Browser Comparison

- **Safari**: May cancel composition when Enter is pressed, especially on macOS
- **Chrome**: May have different behavior
- **Firefox**: May have different behavior

## Notes and possible direction for workarounds

- Observe the sequence of `beforeinput`, `compositionend`, and `input` events.
- Check whether the browser emits a `beforeinput` event with `inputType = 'insertParagraph'` before or after `compositionend`.
- A possible workaround is to intercept Enter on `keydown` and prevent the default behavior while waiting for composition to complete.

