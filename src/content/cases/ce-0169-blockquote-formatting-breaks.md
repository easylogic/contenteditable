---
id: ce-0169
scenarioId: scenario-blockquote-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Applying formatting in blockquote breaks structure in Firefox
description: "When applying formatting (bold, italic, etc.) to text inside a blockquote in Firefox, the blockquote structure may break. The blockquote may be removed or converted to regular paragraphs."
tags:
  - blockquote
  - formatting
  - structure
  - firefox
status: draft
---

### Phenomenon

When applying formatting (bold, italic, etc.) to text inside a blockquote in Firefox, the blockquote structure may break. The blockquote may be removed or converted to regular paragraphs.

### Reproduction example

1. Create a blockquote: `<blockquote><p>Quoted text</p></blockquote>`
2. Select text inside the blockquote
3. Apply bold formatting

### Observed behavior

- Blockquote structure may be broken
- Blockquote may be converted to paragraphs
- Formatting is applied but structure is lost
- DOM structure becomes: `<p><b>Quoted text</b></p>`

### Expected behavior

- Blockquote structure should be maintained
- Formatting should be applied within blockquote
- Blockquote should remain as `<blockquote>`
- Structure should not break

### Browser Comparison

- **Chrome/Edge**: Generally maintains structure
- **Firefox**: More likely to break structure (this case)
- **Safari**: Most likely to break structure

### Notes and possible direction for workarounds

- Intercept formatting in blockquote context
- Apply formatting within blockquote structure
- Preserve blockquote during formatting
- Normalize structure after formatting

