---
id: ce-0121
scenarioId: scenario-background-color-change
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Background color interferes with text selection visibility
description: "When applying a background color (highlighting) to text, the background color may interfere with text selection visibility. Selected text with background color may be hard to see."
tags:
  - color
  - background
  - highlight
  - selection
  - chrome
status: draft
---

### Phenomenon

When applying a background color (highlighting) to text, the background color may interfere with text selection visibility. Selected text with background color may be hard to see.

### Reproduction example

1. Apply a background color to some text (e.g., yellow highlight)
2. Select the highlighted text
3. Observe selection visibility

### Observed behavior

- Selection highlight may be hard to see against background color
- Or selection highlight may conflict with background color
- Text selection is less visible
- User experience is degraded

### Expected behavior

- Selection should be clearly visible
- Background color and selection highlight should work together
- Or selection highlight should override background color
- Text should always be readable when selected

### Browser Comparison

- **Chrome/Edge**: Selection visibility may be affected (this case)
- **Firefox**: Similar visibility issues
- **Safari**: Selection behavior may differ

### Notes and possible direction for workarounds

- Adjust selection highlight color when background color is present
- Use different selection style for highlighted text
- Ensure sufficient contrast
- Consider using outline instead of background for selection

