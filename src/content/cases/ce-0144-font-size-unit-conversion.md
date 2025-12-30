---
id: ce-0144
scenarioId: scenario-font-size-change
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Font size units are converted inconsistently (px to em)
description: "When applying font sizes in Chrome, the units (px, em, rem) may be converted inconsistently. Relative units may be converted to absolute units, or vice versa, making it difficult to maintain consistent sizing."
tags:
  - font
  - size
  - unit
  - conversion
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<span style="font-size: 1.2em;">Text</span>'
    description: "Font size applied with relative unit (em)"
  - label: "After Conversion (Bug)"
    html: '<span style="font-size: 19.2px;">Text</span>'
    description: "After editing, relative unit converted to absolute unit (px)"
  - label: "✅ Expected"
    html: '<span style="font-size: 1.2em;">Text</span>'
    description: "Expected: Original unit (em) preserved"
---

## Phenomenon

When applying font sizes in Chrome, the units (px, em, rem) may be converted inconsistently. Relative units may be converted to absolute units, or vice versa, making it difficult to maintain consistent sizing.

## Reproduction example

1. Apply font size with em unit: `font-size: 1.2em`
2. Edit the text or apply other formatting
3. Observe the font-size value

## Observed behavior

- Units may be converted: `1.2em` becomes `19.2px`
- Or units may be preserved
- Conversion is inconsistent
- Relative sizing is lost

## Expected behavior

- Units should be preserved as specified
- Or conversion should be predictable
- Relative units should remain relative
- Behavior should be consistent

## Browser Comparison

- **Chrome/Edge**: May convert units (this case)
- **Firefox**: Similar conversion behavior
- **Safari**: Unit handling varies

## Notes and possible direction for workarounds

- Preserve original units explicitly
- Convert units only when necessary
- Document unit conversion behavior
- Consider using data attributes to store original units

