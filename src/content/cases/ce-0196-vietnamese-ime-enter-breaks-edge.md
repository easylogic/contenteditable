---
id: ce-0196
scenarioId: scenario-ime-enter-breaks
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: Vietnamese (IME)
caseTitle: Vietnamese IME composition cancelled when pressing Enter
description: "When composing Vietnamese text with IME in a contenteditable element, pressing Enter cancels the composition and may lose diacritic marks (accents) that were being composed. The caret moves to the next line but the last composed character may be lost."
tags:
  - composition
  - ime
  - enter
  - vietnamese
  - edge
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">xin chao</span>'
    description: "Vietnamese input in progress (xin chao), accent marks composing"
  - label: "After Enter (Bug)"
    html: 'Hello xin chao<br>'
    description: "Enter key cancels composition, accent marks lost"
  - label: "✅ Expected"
    html: 'Hello xin chào<br>'
    description: "Expected: Line break after composition completes, all accent marks preserved"
---

## Phenomenon

When composing Vietnamese text with IME in a `contenteditable` element, pressing Enter cancels the composition and may lose diacritic marks (accents) that were being composed. The caret moves to the next line but the last composed character or diacritics may be lost.

## Reproduction example

1. Focus the editable area.
2. Activate Vietnamese IME (Telex or VNI input method).
3. Type Vietnamese text with diacritics (e.g., "xin chào").
4. Press Enter to insert a new line during composition.

## Observed behavior

- The compositionend event fires with incomplete data
- The caret moves to the next line
- Diacritic marks may be lost
- Base letters and diacritics may not be properly combined

## Expected behavior

- The IME finalizes the current composition before inserting a line break
- All diacritic marks should be preserved
- The last composed character should remain in the DOM text content

## Browser Comparison

- **Edge**: May cancel composition when Enter is pressed
- **Chrome**: Similar to Edge
- **Firefox**: May have different behavior
- **Safari**: Not applicable on Windows

## Notes and possible direction for workarounds

- Observe the sequence of `beforeinput`, `compositionend`, and `input` events
- Check whether diacritics are properly preserved
- A possible workaround is to intercept Enter on `keydown` and prevent the default behavior while waiting for composition to complete

