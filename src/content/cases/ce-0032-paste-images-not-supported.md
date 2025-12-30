---
id: ce-0032
scenarioId: scenario-paste-media-handling
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Pasting images into contenteditable is not supported consistently
description: "When attempting to paste images (from clipboard) into a contenteditable region, the behavior is inconsistent across browsers. Some browsers ignore the paste, while others may insert a placeholder o"
tags:
  - paste
  - images
  - media
  - chrome
status: draft
domSteps:
  - label: "Clipboard"
    html: '[Image: screenshot.png]'
    description: "Image in clipboard"
  - label: "After Paste (Bug)"
    html: ''
    description: "Paste attempt ignored or fails, image not inserted"
  - label: "✅ Expected"
    html: '<img src="data:image/png;base64,..." alt="Image">'
    description: "Expected: Image inserted as &lt;img&gt; element"
---

## Phenomenon

When attempting to paste images (from clipboard) into a contenteditable region, the behavior is inconsistent across browsers. Some browsers ignore the paste, while others may insert a placeholder or fail silently.

## Reproduction example

1. Copy an image to the clipboard (e.g., from an image editor or screenshot).
2. Create a contenteditable div.
3. Focus the contenteditable.
4. Paste (Cmd+V or Ctrl+V).
5. Observe what happens.

## Observed behavior

- In Chrome on macOS, pasting images may be ignored or fail silently.
- No visual feedback indicates that the paste was attempted.
- The image data may be available in the clipboard but not inserted.

## Expected behavior

- Images should be pasted as `<img>` elements with appropriate `src` attributes.
- Or, the `beforeinput` event should allow intercepting and handling image paste.
- Clear feedback should indicate success or failure of the paste operation.

