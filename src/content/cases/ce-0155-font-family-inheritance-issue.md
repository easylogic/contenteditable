---
id: ce-0155
scenarioId: scenario-font-family-change
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Font family inheritance causes unexpected formatting in Firefox
description: "When applying font family to text in Firefox, the font may be inherited from parent elements unexpectedly. This causes inconsistent font rendering and makes it difficult to control typography."
tags:
  - font
  - inheritance
  - typography
  - firefox
status: draft
---

### Phenomenon

When applying font family to text in Firefox, the font may be inherited from parent elements unexpectedly. This causes inconsistent font rendering and makes it difficult to control typography.

### Reproduction example

1. Create contenteditable with parent element having font-family
2. Apply different font to selected text
3. Observe font rendering

### Observed behavior

- Font may be inherited from parent
- Applied font may not take effect
- Font rendering is inconsistent
- Typography control is difficult

### Expected behavior

- Applied font should override parent font
- Font should be applied as specified
- Inheritance should be predictable
- Typography should be controllable

### Browser Comparison

- **Chrome/Edge**: Font application generally works
- **Firefox**: Font inheritance issues (this case)
- **Safari**: Font inheritance varies

### Notes and possible direction for workarounds

- Use more specific CSS selectors
- Apply font with `!important` if needed
- Ensure inline styles override parent styles
- Normalize font inheritance behavior

