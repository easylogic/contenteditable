---
id: ce-0125
scenarioId: scenario-image-deletion
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Cursor position is incorrect after deleting image in Firefox
description: "When deleting an image from a contenteditable element in Firefox, the cursor position after deletion is incorrect or unexpected. The cursor may end up in the wrong location or become invalid."
tags:
  - image
  - deletion
  - cursor
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <img src="image.jpg" alt="Image">| World'
    description: "이미지 뒤에 커서(|) 위치"
  - label: "After Delete (Bug)"
    html: 'Hello | World'
    description: "이미지 삭제 후 커서 위치가 잘못됨 (이미지 앞으로 이동)"
  - label: "✅ Expected"
    html: 'Hello | World'
    description: "정상: 커서가 이미지 위치에 유지됨"
---

### Phenomenon

When deleting an image from a contenteditable element in Firefox, the cursor position after deletion is incorrect or unexpected. The cursor may end up in the wrong location or become invalid.

### Reproduction example

1. Insert an image into contenteditable
2. Place cursor after the image
3. Press Backspace to delete the image

### Observed behavior

- Image is deleted
- Cursor position is incorrect or lost
- Cursor may end up before the image position
- Or cursor may become invalid

### Expected behavior

- Cursor should be in correct position after deletion
- Cursor should be where the image was
- Cursor should remain valid
- User should be able to continue typing

### Browser Comparison

- **Chrome/Edge**: Cursor position generally correct
- **Firefox**: Cursor position incorrect (this case)
- **Safari**: Cursor position most unpredictable

### Notes and possible direction for workarounds

- Intercept image deletion
- Manually set cursor position after deletion
- Use Range API to position cursor correctly
- Restore selection after DOM manipulation

