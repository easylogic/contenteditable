---
id: ce-0002
scenarioId: scenario-ime-enter-breaks
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Korean (IME)
caseTitle: Composition is cancelled when pressing Enter inside contenteditable
description: "When composing Korean text with an IME in a contenteditable element, pressing Enter cancels the composition and sometimes commits only a partial syllable. In some browser and IME combinations, the caret moves to the next line but the last composed character is lost."
tags:
  - composition
  - ime
  - enter
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "Korean composition in progress"
  - label: "❌ After (Bug)"
    html: 'Hello 하'
    description: "Final consonant 'ㄴ' lost"
  - label: "✅ Expected"
    html: 'Hello 한'
    description: "Expected: '한' preserved"
---

### Phenomenon

When composing Korean text with an IME in a `contenteditable` element, pressing Enter cancels the
composition and sometimes commits only a partial syllable. In some browser and IME combinations,
the caret moves to the next line but the last composed character is lost.

### Reproduction example

1. Focus the editable area.
2. Activate a Korean IME.
3. Type several syllables but do not finalize the composition.
4. Press Enter to insert a new line.

### Observed behavior

- The compositionend event fires with incomplete data.
- The caret moves to the next line.
- The last composed syllable is missing from the DOM text content.

### Expected behavior

- The IME finalizes the current composition before inserting a line break.
- The last composed syllable remains in the DOM text content.

### Notes and possible direction for workarounds

- Observe the sequence of `beforeinput`, `compositionend`, and `input` events in the playground.
- Check whether the browser emits a `beforeinput` event with `inputType = 'insertParagraph'`
  before or after `compositionend`.
- A possible workaround is to intercept Enter on `keydown` and prevent the default behavior while
  waiting for composition to complete, but this changes the native editing behavior and must be
  evaluated carefully per product.


