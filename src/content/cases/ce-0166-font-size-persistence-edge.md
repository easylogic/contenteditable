---
id: ce-0166
scenarioId: scenario-font-size-change
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: Font size persists correctly when typing after applying in Edge
description: "When applying a font size to selected text in Edge and then continuing to type, the new text inherits the font size. This is the expected behavior and works correctly in Edge."
tags:
  - font
  - size
  - persistence
  - edge
status: draft
---

### Phenomenon

When applying a font size to selected text in Edge and then continuing to type, the new text inherits the font size. This is the expected behavior and works correctly in Edge.

### Reproduction example

1. Select some text in a contenteditable element
2. Apply a font size (e.g., 18px)
3. Place cursor after the formatted text
4. Type new text

### Observed behavior

- The newly typed text inherits the applied font size
- Font size formatting persists for new text
- This is the correct and expected behavior
- Works consistently in Edge/Chrome

### Expected behavior

- Newly typed text should inherit the font size (current behavior is correct)
- Font size formatting should persist until explicitly changed
- Behavior should be consistent (which it is in Edge/Chrome)

### Browser Comparison

- **Chrome/Edge**: Font size persists correctly (this case - correct behavior)
- **Firefox**: Size persistence may be less reliable
- **Safari**: Font size does not persist

### Notes and possible direction for workarounds

- This behavior is correct and expected
- May need to handle size removal explicitly
- Consider if size should persist across paragraphs
- Document expected behavior for users

