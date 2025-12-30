---
id: ce-0085
scenarioId: scenario-file-api
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: File API drag and drop does not work in contenteditable
description: "When trying to drag and drop files into a contenteditable element, the File API may not work as expected. File drop events may not fire, or file content may not be accessible."
tags:
  - file-api
  - drag-drop
  - safari
  - macos
status: draft
---

## Phenomenon

When trying to drag and drop files into a contenteditable element, the File API may not work as expected. File drop events may not fire, or file content may not be accessible.

## Reproduction example

1. Create a contenteditable div.
2. Try to drag a file from the file system into the contenteditable.
3. Listen for drop events and try to read file content.
4. Observe whether files can be dropped and accessed.

## Observed behavior

- In Safari on macOS, file drag and drop may not work in contenteditable.
- Drop events may not fire for files.
- File content may not be accessible.
- The default paste behavior may interfere.

## Expected behavior

- File drag and drop should work in contenteditable.
- Drop events should fire correctly.
- File content should be accessible via File API.

