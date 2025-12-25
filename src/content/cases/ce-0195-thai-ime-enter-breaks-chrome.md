---
id: ce-0195
scenarioId: scenario-ime-enter-breaks
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Thai (IME)
caseTitle: Thai IME composition cancelled when pressing Enter
description: "When composing Thai text with IME in a contenteditable element, pressing Enter cancels the composition and may lose tone marks or vowel marks that were being composed. The caret moves to the next line but the last composed character may be lost."
tags:
  - composition
  - ime
  - enter
  - thai
  - chrome
  - windows
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">สวัส</span>'
    description: "Thai composition in progress (สวัส), includes tone marks and vowel marks"
  - label: "After Enter (Bug)"
    html: 'Hello สวั<br>'
    description: "Enter key cancels composition, tone marks/vowel marks lost"
  - label: "✅ Expected"
    html: 'Hello สวัสดี<br>'
    description: "Expected: Line break after composition completes, all combining characters preserved"
---

### Phenomenon

When composing Thai text with IME in a `contenteditable` element, pressing Enter cancels the composition and may lose tone marks or vowel marks that were being composed. The caret moves to the next line but the last composed character or combining marks may be lost.

### Reproduction example

1. Focus the editable area.
2. Activate Thai IME.
3. Type Thai text with tone marks and vowel marks (e.g., "สวัสดี").
4. Press Enter to insert a new line during composition.

### Observed behavior

- The compositionend event fires with incomplete data
- The caret moves to the next line
- Tone marks or vowel marks may be lost
- Combining characters may not be properly committed

### Expected behavior

- The IME finalizes the current composition before inserting a line break
- All combining characters (tone marks, vowel marks) should be preserved
- The last composed character should remain in the DOM text content

### Browser Comparison

- **Chrome**: May cancel composition when Enter is pressed
- **Edge**: Similar to Chrome
- **Firefox**: May have different behavior
- **Safari**: Not applicable on Windows

### Notes and possible direction for workarounds

- Observe the sequence of `beforeinput`, `compositionend`, and `input` events
- Check whether combining characters are properly preserved
- A possible workaround is to intercept Enter on `keydown` and prevent the default behavior while waiting for composition to complete

