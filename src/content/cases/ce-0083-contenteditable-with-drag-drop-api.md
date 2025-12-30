---
id: ce-0083
scenarioId: scenario-drag-drop-api
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Drag and Drop API behavior differs in contenteditable
description: "When using the HTML5 Drag and Drop API with contenteditable elements, the behavior differs from standard elements. Dragging text within a contenteditable may not work as expected, and drop zones ma"
tags:
  - drag-drop
  - api
  - chrome
  - macos
status: draft
---

## Phenomenon

When using the HTML5 Drag and Drop API with contenteditable elements, the behavior differs from standard elements. Dragging text within a contenteditable may not work as expected, and drop zones may not be recognized correctly.

## Reproduction example

1. Create a contenteditable div with draggable text inside.
2. Try to drag text within the contenteditable.
3. Try to drag text from outside into the contenteditable.
4. Observe drag and drop event handling.

## Observed behavior

- In Chrome on macOS, drag and drop behavior is inconsistent in contenteditable.
- Dragging text within contenteditable may not work.
- Drop events may not fire correctly.
- The default drag behavior may interfere with editing.

## Expected behavior

- Drag and drop should work consistently in contenteditable.
- Events should fire correctly.
- Default behavior should not interfere with editing.

