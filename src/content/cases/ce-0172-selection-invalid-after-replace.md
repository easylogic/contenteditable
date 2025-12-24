---
id: ce-0172
scenarioId: scenario-selection-restoration
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Selection becomes invalid after replacing content
description: "When programmatically replacing selected content in Safari, the selection range becomes invalid. The cursor position is lost and cannot be restored, making it impossible to continue editing."
tags:
  - selection
  - range
  - replace
  - safari
status: draft
---

### Phenomenon

When programmatically replacing selected content in Safari, the selection range becomes invalid. The cursor position is lost and cannot be restored, making it impossible to continue editing.

### Reproduction example

1. Select some text
2. Programmatically replace it with new content
3. Check selection state

### Observed behavior

- Selection range becomes invalid
- Cursor position is lost
- Cannot continue editing at correct position
- Selection cannot be restored

### Expected behavior

- Selection should remain valid after replacement
- Cursor should be positioned after replaced content
- User should be able to continue editing
- Selection should be restored properly

### Browser Comparison

- **Chrome/Edge**: Selection generally remains valid
- **Firefox**: Selection may become invalid
- **Safari**: Selection restoration most unreliable (this case)

### Notes and possible direction for workarounds

- Save selection before replacement
- Restore selection after replacement
- Use Range API to maintain valid selection
- Handle invalid selection gracefully

