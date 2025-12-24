---
id: ce-0117
scenarioId: scenario-non-breaking-space
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Non-breaking spaces are converted to regular spaces during editing
description: "When editing text that contains non-breaking spaces (&nbsp;), they may be converted to regular spaces during editing operations. This breaks formatting that relies on non-breaking spaces."
tags:
  - whitespace
  - nbsp
  - space
  - chrome
status: draft
---

### Phenomenon

When editing text that contains non-breaking spaces (`&nbsp;`), they may be converted to regular spaces during editing operations. This breaks formatting that relies on non-breaking spaces.

### Reproduction example

1. Insert text with non-breaking spaces: `Hello&nbsp;&nbsp;&nbsp;World`
2. Edit the text (type, delete, etc.)
3. Observe the DOM

### Observed behavior

- Non-breaking spaces are converted to regular spaces
- Multiple spaces collapse to single space
- Formatting that relies on nbsp is broken
- Layout may change unexpectedly

### Expected behavior

- Non-breaking spaces should be preserved
- Or conversion should be predictable
- Formatting should remain intact
- Behavior should be consistent

### Browser Comparison

- **Chrome/Edge**: May convert nbsp to space (this case)
- **Firefox**: Similar conversion behavior
- **Safari**: Conversion behavior varies

### Notes and possible direction for workarounds

- Monitor and preserve non-breaking spaces
- Replace regular spaces with nbsp if needed
- Use CSS `white-space: pre-wrap` to preserve spacing
- Handle nbsp explicitly in paste operations

