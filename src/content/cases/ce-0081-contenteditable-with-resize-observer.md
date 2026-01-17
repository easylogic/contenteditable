---
id: ce-0081-contenteditable-with-resize-observer
scenarioId: scenario-resize-observer-interference
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: ResizeObserver may cause layout shifts during contenteditable editing
description: "When a ResizeObserver is attached to a contenteditable element, the observer may trigger during editing as content changes size. This can cause layout recalculations and visual jumps, especially when the observer modifies the DOM in response to size changes."
tags:
  - resize-observer
  - layout
  - performance
  - chrome
  - windows
status: draft
---

## Phenomenon

When a ResizeObserver is attached to a contenteditable element, the observer may trigger during editing as content changes size. This can cause layout recalculations and visual jumps, especially when the contenteditable has dynamic height.

## Reproduction example

1. Create a contenteditable div with auto height.
2. Attach a ResizeObserver to monitor size changes.
3. Type text that causes the contenteditable to grow.
4. Observe any layout shifts or visual jumps.
5. Check if the observer callbacks affect editing performance.

## Observed behavior

- In Chrome on Windows, ResizeObserver may trigger frequently during editing.
- Layout recalculations can cause visual jumps.
- The caret position may shift unexpectedly.
- Performance may be affected by frequent resize events.

## Expected behavior

- ResizeObserver should not cause layout shifts during editing.
- Or, resize events should be debounced or batched.
- Caret position should remain stable during resize.

