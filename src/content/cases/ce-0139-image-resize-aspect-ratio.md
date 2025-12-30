---
id: ce-0139
scenarioId: scenario-image-resize
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Image resize does not preserve aspect ratio by default
description: "When resizing an image in a contenteditable element, the aspect ratio is not preserved by default. Images become distorted when resized, requiring manual aspect ratio preservation."
tags:
  - image
  - resize
  - aspect-ratio
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<img src="image.jpg" width="200" height="150" alt="Image">'
    description: "Original image (200x150, ratio 4:3)"
  - label: "After Resize (Bug)"
    html: '<img src="image.jpg" width="300" height="150" alt="Image">'
    description: "After resize, ratio damaged (300x150, distorted)"
  - label: "✅ Expected"
    html: '<img src="image.jpg" width="300" height="225" alt="Image">'
    description: "Expected: Ratio maintained (300x225, 4:3 ratio preserved)"
---

## Phenomenon

When resizing an image in a contenteditable element, the aspect ratio is not preserved by default. Images become distorted when resized, requiring manual aspect ratio preservation.

## Reproduction example

1. Insert an image into contenteditable
2. Resize the image by dragging
3. Observe image distortion

## Observed behavior

- Image width and height change independently
- Aspect ratio is not maintained
- Image becomes distorted
- Requires manual calculation to preserve ratio

## Expected behavior

- Aspect ratio should be preserved by default
- Or option to preserve aspect ratio
- Images should not become distorted
- Resize should be intuitive

## Browser Comparison

- **All browsers**: Aspect ratio not preserved by default
- Custom implementation needed for aspect ratio preservation

## Notes and possible direction for workarounds

- Implement custom resize with aspect ratio lock
- Calculate height based on width change
- Use Shift key modifier to toggle aspect ratio lock
- Provide visual feedback during resize

