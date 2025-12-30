---
id: ce-0156
scenarioId: scenario-blockquote-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Pasting blockquote content creates nested blockquotes in Safari
description: "When pasting content that contains blockquote elements into an existing blockquote in Safari, nested blockquote structures are created. This creates invalid or confusing HTML structure."
tags:
  - blockquote
  - nested
  - paste
  - safari
status: draft
domSteps:
  - label: "Before"
    html: '<blockquote><p>Quoted text</p></blockquote>'
    description: "Existing blockquote"
  - label: "Clipboard"
    html: '<blockquote><p>Another quote</p></blockquote>'
    description: "Content including copied blockquote"
  - label: "After Paste (Bug)"
    html: '<blockquote><p>Quoted text</p><blockquote><p>Another quote</p></blockquote></blockquote>'
    description: "Nested blockquote created (incorrect structure)"
  - label: "✅ Expected"
    html: '<blockquote><p>Quoted text</p><p>Another quote</p></blockquote>'
    description: "Expected: Blockquote tags removed, only inner content inserted"
---

## Phenomenon

When pasting content that contains blockquote elements into an existing blockquote in Safari, nested blockquote structures are created. This creates invalid or confusing HTML structure.

## Reproduction example

1. Create a blockquote: `<blockquote><p>Quoted text</p></blockquote>`
2. Copy content that contains a blockquote
3. Paste into the existing blockquote

## Observed behavior

- Nested blockquotes are created: `<blockquote><p>Text</p><blockquote>...</blockquote></blockquote>`
- Structure becomes confusing
- Visual appearance may be unexpected
- HTML structure is nested unnecessarily

## Expected behavior

- Blockquote tags should be stripped from pasted content
- Or pasted content should be inserted without blockquote wrapper
- No nested blockquotes should be created
- Structure should remain clean

## Browser Comparison

- **Chrome/Edge**: May create nested blockquotes
- **Firefox**: More likely to create nested structures
- **Safari**: Most likely to create nested blockquotes (this case)

## Notes and possible direction for workarounds

- Intercept paste in blockquote context
- Strip blockquote tags from pasted content
- Preserve blockquote structure
- Normalize structure after paste

