---
id: ce-0153
scenarioId: scenario-non-breaking-space
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Non-breaking spaces prevent line breaks unexpectedly
description: "When using non-breaking spaces in contenteditable, they prevent line breaks even when the text would normally wrap. This can cause text to overflow or create unexpected layout issues."
tags:
  - whitespace
  - nbsp
  - line-break
  - chrome
status: draft
---

### Phenomenon

When using non-breaking spaces in contenteditable, they prevent line breaks even when the text would normally wrap. This can cause text to overflow or create unexpected layout issues.

### Reproduction example

1. Insert text with multiple non-breaking spaces: `Hello&nbsp;&nbsp;&nbsp;World`
2. Resize the container to be narrow
3. Observe text wrapping

### Observed behavior

- Text does not wrap at non-breaking spaces
- Text may overflow container
- Line breaks are prevented
- Layout issues occur

### Expected behavior

- Non-breaking spaces should prevent breaks (by design)
- Or behavior should be predictable
- Layout should handle nbsp appropriately
- Users should understand nbsp behavior

### Browser Comparison

- **All browsers**: Non-breaking spaces prevent breaks (by design)
- This is expected HTML behavior
- May need to use regular spaces or CSS for wrapping

### Notes and possible direction for workarounds

- Use regular spaces if wrapping is needed
- Use CSS `word-break` or `overflow-wrap` for long words
- Replace nbsp with regular spaces if wrapping is desired
- Document nbsp behavior for users

