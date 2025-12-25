---
id: ce-0154
scenarioId: scenario-image-insertion
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Image drop position is incorrect in drag and drop
description: "When dragging and dropping an image file into a contenteditable element in Chrome, the image may be inserted at an incorrect position. The drop position does not match the cursor position or drop location."
tags:
  - image
  - drag-drop
  - position
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello World'
    description: "Text, cursor positioned between 'Hello' and 'World'"
  - label: "After Drop (Bug)"
    html: 'Hello World<img src="image.jpg" alt="Image">'
    description: "Image inserted at end regardless of drop position"
  - label: "✅ Expected"
    html: 'Hello <img src="image.jpg" alt="Image"> World'
    description: "Expected: Image inserted at drop position (cursor position)"
---

### Phenomenon

When dragging and dropping an image file into a contenteditable element in Chrome, the image may be inserted at an incorrect position. The drop position does not match the cursor position or drop location.

### Reproduction example

1. Create contenteditable with text
2. Place cursor at a specific position
3. Drag and drop an image file

### Observed behavior

- Image is inserted at wrong position
- Drop position does not match cursor
- Or image is inserted at end of content
- Position is unpredictable

### Expected behavior

- Image should be inserted at drop location
- Or at cursor position
- Position should be predictable
- Drop should work intuitively

### Browser Comparison

- **Chrome/Edge**: Position may be incorrect (this case)
- **Firefox**: Similar position issues
- **Safari**: Drop position most unpredictable

### Notes and possible direction for workarounds

- Intercept drop event
- Calculate drop position from event coordinates
- Insert image at calculated position
- Use `document.caretRangeFromPoint` if available

