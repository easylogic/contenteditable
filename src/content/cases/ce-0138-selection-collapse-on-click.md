---
id: ce-0138
scenarioId: scenario-selection-restoration
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Selection collapses unexpectedly when clicking during editing
description: "When clicking on the contenteditable element during editing operations in Safari, the text selection may collapse unexpectedly. The selection range becomes invalid or moves to an unexpected position."
tags:
  - selection
  - click
  - collapse
  - safari
status: draft
---

### Phenomenon

When clicking on the contenteditable element during editing operations in Safari, the text selection may collapse unexpectedly. The selection range becomes invalid or moves to an unexpected position.

### Reproduction example

1. Select some text
2. Click elsewhere in the contenteditable
3. Observe selection state

### Observed behavior

- Selection collapses to a point
- Or selection moves to unexpected position
- Selection range may become invalid
- Cannot maintain selection across clicks

### Expected behavior

- Selection should collapse to click position (normal behavior)
- Or selection should be maintained if desired
- Behavior should be predictable
- Selection should remain valid

### Browser Comparison

- **Chrome/Edge**: Selection generally behaves correctly
- **Firefox**: Selection may collapse unexpectedly
- **Safari**: Selection collapse most unpredictable (this case)

### Notes and possible direction for workarounds

- Handle click events to preserve selection if needed
- Restore selection after click if desired
- Document selection collapse behavior
- Consider if selection should persist across clicks

