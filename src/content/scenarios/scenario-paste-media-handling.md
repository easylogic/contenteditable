---
id: scenario-paste-media-handling
title: Pasting images into contenteditable is not supported consistently
description: "When attempting to paste images (from clipboard) into a contenteditable region, the behavior is inconsistent across browsers. Some browsers ignore the paste, while others may insert a placeholder or fail silently."
category: paste
tags:
  - paste
  - images
  - media
  - chrome
status: draft
locale: en
---

When attempting to paste images (from clipboard) into a contenteditable region, the behavior is inconsistent across browsers. Some browsers ignore the paste, while others may insert a placeholder or fail silently.

## References

- [MDN: Window paste event](https://developer.mozilla.org/docs/Web/API/Window/paste_event) - Paste event documentation
- [MDN: DataTransfer API](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/) - Clipboard data access
- [MDN: Clipboard.read](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/read) - Async Clipboard API
- [MDN: Clipboard.write](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write) - Writing to clipboard
- [AWSM Page: Accessing clipboard images with JavaScript](https://awsm.page/javascript/code-snippet-accessing-clipboard-images-with-javascript/) - Image paste examples
