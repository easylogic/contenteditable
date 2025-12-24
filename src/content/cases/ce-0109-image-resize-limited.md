---
id: ce-0109
scenarioId: scenario-image-resize
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Native image resize handles are limited or unavailable
description: "When selecting an image in a contenteditable element, native resize handles may not appear or may be limited. Users cannot easily resize images without custom implementation."
tags:
  - image
  - resize
  - drag
  - chrome
status: draft
---

### Phenomenon

When selecting an image in a contenteditable element, native resize handles may not appear or may be limited. Users cannot easily resize images without custom implementation.

### Reproduction example

1. Insert an image into contenteditable
2. Click to select the image
3. Look for resize handles

### Observed behavior

- Resize handles may not appear at all
- Or handles may appear but not work properly
- Image resizing is not intuitive
- Users cannot easily adjust image size

### Expected behavior

- Resize handles should appear when image is selected
- Handles should work smoothly
- Image should resize while maintaining aspect ratio (optionally)
- Behavior should be consistent across browsers

### Browser Comparison

- **Chrome/Edge**: Limited or no native resize handles
- **Firefox**: No native resize support
- **Safari**: May have different resize behavior

### Notes and possible direction for workarounds

- Implement custom resize handles
- Use mouse events to track drag operations
- Update image width/height attributes or CSS
- Maintain aspect ratio if desired
- Provide visual feedback during resize

