---
id: ce-0118
scenarioId: scenario-image-deletion
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Deleting image leaves empty wrapper elements
description: "When deleting an image from a contenteditable element, empty wrapper divs or other elements may be left in the DOM. These empty elements cause layout issues and bloat the HTML."
tags:
  - image
  - deletion
  - empty
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<div><img src="image.jpg" alt="Image"></div>'
    description: "Structure with image"
  - label: "After Delete (Bug)"
    html: '<div></div>'
    description: "After image deletion, empty wrapper div remains"
  - label: "✅ Expected"
    html: ''
    description: "Expected: Empty elements removed, clean DOM"
---

### Phenomenon

When deleting an image from a contenteditable element, empty wrapper divs or other elements may be left in the DOM. These empty elements cause layout issues and bloat the HTML.

### Reproduction example

1. Insert an image into contenteditable
2. Select the image
3. Press Delete or Backspace

### Observed behavior

- Image is deleted
- Empty wrapper `<div>` elements may remain
- Or empty `<p>` elements may remain
- DOM structure becomes bloated

### Expected behavior

- Image should be deleted cleanly
- No empty elements should remain
- DOM should be clean
- Cursor position should be correct

### Browser Comparison

- **Chrome/Edge**: May leave empty elements (this case)
- **Firefox**: More likely to leave empty structures
- **Safari**: Most likely to leave empty elements

### Notes and possible direction for workarounds

- Intercept image deletion
- Clean up empty wrapper elements
- Remove parent elements if empty
- Set cursor position correctly after deletion

