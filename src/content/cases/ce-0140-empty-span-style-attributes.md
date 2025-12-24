---
id: ce-0140
scenarioId: scenario-empty-element-cleanup
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Empty span elements with style attributes accumulate
description: "When removing formatting (bold, italic, color, etc.) in Chrome, empty span elements with empty or unnecessary style attributes accumulate in the DOM. These elements bloat the HTML and serve no purpose."
tags:
  - empty
  - span
  - style
  - cleanup
  - chrome
status: draft
---

### Phenomenon

When removing formatting (bold, italic, color, etc.) in Chrome, empty span elements with empty or unnecessary style attributes accumulate in the DOM. These elements bloat the HTML and serve no purpose.

### Reproduction example

1. Apply multiple formatting to text
2. Remove formatting one by one
3. Observe the DOM structure

### Observed behavior

- Empty `<span style="">` elements remain
- Or `<span>` elements with only whitespace remain
- Style attributes may be empty but still present
- DOM becomes bloated with empty spans

### Expected behavior

- Empty span elements should be removed
- Style attributes should be removed when empty
- DOM should be clean and minimal
- No unnecessary elements should remain

### Browser Comparison

- **Chrome/Edge**: Leaves empty spans (this case)
- **Firefox**: More likely to leave empty elements
- **Safari**: Most likely to accumulate empty elements

### Notes and possible direction for workarounds

- Clean up empty span elements after formatting removal
- Remove style attributes if empty
- Unwrap spans that only contain whitespace
- Normalize DOM structure regularly

