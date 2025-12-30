---
id: ce-0181
scenarioId: scenario-ime-enter-breaks
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese (IME)
caseTitle: Japanese IME composition cancelled when pressing Enter
description: "When composing Japanese text with IME in a contenteditable element, pressing Enter cancels the composition and may commit only partial romaji or incomplete kanji conversion. The caret moves to the next line but the last composed character may be lost."
tags:
  - composition
  - ime
  - enter
  - japanese
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">かんじ</span>'
    description: "Japanese romaji input in progress (kanji → かんじ)"
  - label: "After Enter (Bug)"
    html: 'Hello かん<br>'
    description: "Enter key cancels composition, only partial romaji remains"
  - label: "✅ Expected"
    html: 'Hello かんじ<br>'
    description: "Expected: Line break after composition completes"
---

## Phenomenon

When composing Japanese text with IME in a `contenteditable` element, pressing Enter cancels the composition and may commit only partial romaji or incomplete kanji conversion. In some browser and IME combinations, the caret moves to the next line but the last composed character or conversion may be lost.

## Reproduction example

1. Focus the editable area.
2. Activate Japanese IME.
3. Type romaji text (e.g., "kanji") and start kanji conversion.
4. Press Enter to insert a new line before completing the conversion.

## Observed behavior

- The compositionend event fires with incomplete data.
- The caret moves to the next line.
- Partial romaji or incomplete kanji conversion may be lost.
- The conversion candidate list may disappear without committing the selection.

## Expected behavior

- The IME finalizes the current composition before inserting a line break.
- The last composed character or conversion remains in the DOM text content.
- If a candidate list is active, it should be handled appropriately.

## Browser Comparison

- **Chrome**: May cancel composition when Enter is pressed
- **Edge**: Similar to Chrome
- **Firefox**: May have different behavior
- **Safari**: Not applicable on Windows

## Notes and possible direction for workarounds

- Observe the sequence of `beforeinput`, `compositionend`, and `input` events.
- Check whether the browser emits a `beforeinput` event with `inputType = 'insertParagraph'` before or after `compositionend`.
- A possible workaround is to intercept Enter on `keydown` and prevent the default behavior while waiting for composition to complete.

