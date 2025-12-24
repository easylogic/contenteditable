---
id: ce-0159
scenarioId: scenario-empty-element-cleanup
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Empty elements accumulate after removing formatting in Safari
description: "When removing formatting (bold, italic, color, etc.) in Safari, empty wrapper elements accumulate in the DOM. These empty elements cause layout issues and bloat the HTML significantly."
tags:
  - empty
  - formatting
  - cleanup
  - safari
status: draft
---

### Phenomenon

When removing formatting (bold, italic, color, etc.) in Safari, empty wrapper elements accumulate in the DOM. These empty elements cause layout issues and bloat the HTML significantly.

### Reproduction example

1. Apply multiple formatting to text
2. Remove formatting one by one
3. Observe the DOM structure

### Observed behavior

- Empty `<span>`, `<b>`, `<i>` elements remain
- Empty elements with style attributes remain
- DOM becomes heavily bloated
- Layout has unexpected spacing

### Expected behavior

- Empty elements should be removed
- DOM should be clean
- No unnecessary elements should remain
- Structure should be normalized

### Browser Comparison

- **Chrome/Edge**: May leave some empty elements
- **Firefox**: More likely to leave empty elements
- **Safari**: Most likely to accumulate empty elements (this case)

### Notes and possible direction for workarounds

- Implement aggressive cleanup logic
- Remove all empty formatting elements
- Normalize DOM structure regularly
- Clean up after each formatting operation

