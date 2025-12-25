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
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Basic text"
  - label: "After Font Size"
    html: 'Hello <span style="font-size: 18px;">World</span>'
    description: "18px font size applied"
  - label: "After Typing"
    html: 'Hello <span style="font-size: 18px;">World New</span>'
    description: "Newly typed text also inherits font size (normal behavior)"
  - label: "✅ Expected"
    html: 'Hello <span style="font-size: 18px;">World New</span>'
    description: "Expected: Newly typed text also inherits font size (current behavior is correct)"
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

