---
id: ce-0320-ie11-paste-image-base64-sharepoint-ko
scenarioId: scenario-ie11-paste-image-base64-sharepoint
locale: ko
os: Windows
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Internet Explorer
browserVersion: "11"
keyboard: US
caseTitle: Paste event does not fire for images in IE11 contenteditable on SharePoint
description: "In Internet Explorer 11, the paste event may not fire when pasting images into a contenteditable div, especially within SharePoint Online environments."
tags:
  - internet-explorer
  - paste
  - image
  - sharepoint
  - base64
status: draft
---

## Phenomenon

In Internet Explorer 11, when pasting images into a contenteditable div, the `paste` event may not fire as expected. This is particularly problematic in SharePoint Online environments. Additionally, IE11 lacks the `clipboardData` property in the paste event, making it difficult to access clipboard contents directly.

## Reproduction example

1. Create a contenteditable div in IE11 (especially in SharePoint).
2. Copy an image to clipboard.
3. Try to paste the image into the contenteditable div.
4. Observe that the `paste` event may not fire.
5. Check if image is pasted despite missing event.

## Observed behavior

- **Paste event not firing**: `paste` event listener may not be triggered.
- **No clipboardData**: IE11 doesn't provide `clipboardData` property in paste event.
- **Image pasting**: Images may still be pasted but event handling fails.
- **SharePoint-specific**: More common in SharePoint Online environments.
- **Base64 data**: Pasted images may contain base64 data in `src` attribute.

## Expected behavior

- `paste` event should fire when pasting images.
- Clipboard data should be accessible via `clipboardData` API.
- Image data should be available for processing.
- Event handling should work consistently.

## Analysis

IE11 has limited support for modern clipboard APIs. The browser handles paste events differently, especially for images, and doesn't provide the same `clipboardData` interface as modern browsers.

## Workarounds

- Extract image data from DOM after paste:
  ```javascript
  element.addEventListener('paste', function(e) {
    setTimeout(function() {
      var images = element.getElementsByTagName('img');
      for (var i = 0; i < images.length; i++) {
        var img = images[i];
        var src = img.src;
        if (src.startsWith('data:image')) {
          // Handle base64 image data
          console.log('Base64 Image:', src);
        }
      }
    }, 0);
  });
  ```
- Ensure contenteditable element has focus before paste.
- Use alternative file input for image uploads in IE11.
- Consider polyfills or libraries that handle IE11 clipboard limitations.
