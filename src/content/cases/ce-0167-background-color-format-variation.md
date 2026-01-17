---
id: ce-0167-background-color-format-variation
scenarioId: scenario-background-color-change
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Background color format varies (hex, rgb, rgba)
description: "When applying background colors in Chrome, the color format (hex, rgb, rgba) may vary inconsistently. The same color may be stored in different formats, making it difficult to work with programmatically."
tags:
  - color
  - background
  - format
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Basic text"
  - label: "After Color Picker (Bug)"
    html: 'Hello <span style="background-color: rgb(255,255,0);">World</span>'
    description: "When applied via color picker, rgb format"
  - label: "After Text Input (Bug)"
    html: 'Hello <span style="background-color: #ffff00;">World</span>'
    description: "When applied via text input, hex format (inconsistent)"
  - label: "✅ Expected"
    html: 'Hello <span style="background-color: #ffff00;">World</span>'
    description: "Expected: Consistent color format (hex or rgb)"
---

## Phenomenon

When applying background colors in Chrome, the color format (hex, rgb, rgba) may vary inconsistently. The same color may be stored in different formats, making it difficult to work with programmatically.

## Reproduction example

1. Apply yellow background via color picker
2. Apply yellow background via text input
3. Observe the DOM color values

## Observed behavior

- Color format varies: `#ffff00`, `rgb(255,255,0)`, `rgba(255,255,0,1)`
- Same color stored in different formats
- Inconsistent color representation
- Difficult to query or modify colors

## Expected behavior

- Color format should be consistent
- Or format should be predictable
- Same color should use same format
- Format should be easy to work with

## Browser Comparison

- **Chrome/Edge**: Format varies (this case)
- **Firefox**: Similar format inconsistency
- **Safari**: Format handling varies

## Notes and possible direction for workarounds

- Normalize color format after application
- Convert all colors to consistent format (e.g., hex or rgba)
- Store original format if needed
- Document color format behavior

