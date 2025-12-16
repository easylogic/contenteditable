---
id: ce-0078
scenarioId: scenario-virtual-scrolling
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Virtual scrolling libraries interfere with contenteditable selection
tags:
  - virtual-scrolling
  - performance
  - selection
  - chrome
  - macos
status: draft
---

### Phenomenon

When a contenteditable element is used with virtual scrolling libraries (e.g., for large documents), the virtual scrolling mechanism may interfere with text selection and caret positioning. The selection may be lost when elements are removed from the DOM during scrolling.

### Reproduction example

1. Create a contenteditable region with a virtual scrolling library.
2. Load a large amount of content.
3. Select text in the contenteditable.
4. Scroll to trigger virtual scrolling (DOM elements being removed/added).
5. Observe whether selection is maintained.

### Observed behavior

- In Chrome on macOS, virtual scrolling may cause selection to be lost.
- Caret position may jump when DOM elements are recycled.
- Selection ranges may become invalid.
- Editing may be disrupted during scrolling.

### Expected behavior

- Virtual scrolling should not interfere with contenteditable selection.
- Selection should be maintained across DOM updates.
- Or, there should be a standard way to preserve selection during virtual scrolling.

