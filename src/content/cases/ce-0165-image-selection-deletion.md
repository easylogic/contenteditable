---
id: ce-0165
scenarioId: scenario-image-deletion
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Selecting and deleting image requires multiple operations
description: "When selecting an image in a contenteditable element in Chrome, deleting it may require multiple Delete or Backspace key presses. The image may not be deleted on the first attempt."
tags:
  - image
  - deletion
  - selection
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<div><img src="image.jpg" alt="Image"></div>'
    description: "Image in selected state"
  - label: "After First Delete (Bug)"
    html: '<div><img src="image.jpg" alt="Image"></div>'
    description: "First Delete key press does not delete image"
  - label: "After Multiple Delete"
    html: '<div></div>'
    description: "Deleted after multiple Delete key presses"
  - label: "✅ Expected"
    html: ''
    description: "Expected: Immediately deleted on first Delete key press"
---

## Phenomenon

When selecting an image in a contenteditable element in Chrome, deleting it may require multiple Delete or Backspace key presses. The image may not be deleted on the first attempt.

## Reproduction example

1. Insert an image into contenteditable
2. Click to select the image
3. Press Delete or Backspace once

## Observed behavior

- Image may not be deleted on first key press
- Multiple key presses may be needed
- Or image selection may be lost before deletion
- Deletion is unreliable

## Expected behavior

- Image should be deleted on first key press
- Deletion should be immediate and reliable
- Selection should be maintained until deletion
- Behavior should be consistent

## Browser Comparison

- **Chrome/Edge**: May require multiple presses (this case)
- **Firefox**: Similar deletion issues
- **Safari**: Deletion behavior most inconsistent

## Notes and possible direction for workarounds

- Intercept Delete/Backspace on selected images
- Ensure image is deleted immediately
- Handle image selection explicitly
- Provide reliable deletion behavior

