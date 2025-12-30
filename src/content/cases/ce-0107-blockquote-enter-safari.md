---
id: ce-0107
scenarioId: scenario-blockquote-behavior
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Pressing Enter in blockquote may create nested blockquotes in Safari
description: "When pressing Enter inside a blockquote element in Safari, nested blockquote structures may be created unexpectedly. This breaks the intended quote structure and creates invalid or confusing HTML."
tags:
  - blockquote
  - nested
  - enter
  - safari
status: draft
domSteps:
  - label: "Before"
    html: '<blockquote><p>Quoted text</p></blockquote>'
    description: "blockquote element, cursor inside text"
  - label: "After Enter (Bug)"
    html: '<blockquote><p>Quoted text</p><blockquote><p></p></blockquote></blockquote>'
    description: "Enter creates nested blockquote (incorrect structure)"
  - label: "✅ Expected"
    html: '<blockquote><p>Quoted text</p><p></p></blockquote>'
    description: "Expected: New paragraph created within same blockquote"
---

## Phenomenon

When pressing Enter inside a blockquote element in Safari, nested blockquote structures may be created unexpectedly. This breaks the intended quote structure and creates invalid or confusing HTML.

## Reproduction example

1. Create a blockquote: `<blockquote><p>Quoted text</p></blockquote>`
2. Place cursor inside the blockquote text
3. Press Enter

## Observed behavior

- A nested blockquote may be created: `<blockquote><p>Text</p><blockquote><p></p></blockquote></blockquote>`
- Or the blockquote structure may break
- DOM structure becomes malformed
- Visual appearance may be unexpected

## Expected behavior

- A new paragraph should be created within the same blockquote
- No nested blockquotes should be created
- Blockquote structure should be maintained
- Behavior should be consistent with Chrome/Edge

## Browser Comparison

- **Chrome/Edge**: Creates paragraph within blockquote (correct)
- **Firefox**: May break blockquote structure
- **Safari**: May create nested blockquotes (this case)

## Notes and possible direction for workarounds

- Intercept Enter key in blockquote context
- Prevent default behavior
- Manually create paragraph within blockquote
- Normalize blockquote structure after operations

