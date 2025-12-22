---
id: ce-0048
scenarioId: scenario-contenteditable-iframe
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable behavior differs when inside an iframe
description: "When a contenteditable region is inside an iframe, its behavior may differ from when it's in the main document. Selection, focus, and event handling may be inconsistent."
tags:
  - iframe
  - contenteditable
  - isolation
  - edge
status: draft
---

### Phenomenon

When a contenteditable region is inside an iframe, its behavior may differ from when it's in the main document. Selection, focus, and event handling may be inconsistent.

### Reproduction example

1. Create an iframe.
2. Inside the iframe, create a contenteditable div.
3. Try to interact with the contenteditable (type, select, etc.).
4. Compare the behavior with a contenteditable in the main document.

### Observed behavior

- In Edge on Windows, contenteditable behavior differs inside iframes.
- Selection may not work correctly.
- Focus handling may be inconsistent.
- Events may not bubble correctly.

### Expected behavior

- contenteditable should behave identically whether in the main document or an iframe.
- Selection and focus should work consistently.
- Events should behave as expected.

