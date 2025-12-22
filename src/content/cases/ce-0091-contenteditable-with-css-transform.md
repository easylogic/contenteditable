---
id: ce-0091
scenarioId: scenario-css-transform
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: CSS transform may cause selection handles to appear in wrong position
description: "When a contenteditable element has CSS transforms applied (translate, scale, rotate), the selection handles and caret may appear in incorrect positions. The visual position may not match the actual DOM position."
tags:
  - css-transform
  - selection
  - edge
  - windows
status: draft
---

### Phenomenon

When a contenteditable element has CSS transforms applied (translate, scale, rotate), the selection handles and caret may appear in incorrect positions. The visual position may not match the actual selection position.

### Reproduction example

1. Create a contenteditable div with `transform: scale(0.8) translateX(50px)`.
2. Select text in the contenteditable.
3. Observe the position of selection handles.
4. Observe the caret position during editing.
5. Compare visual position with actual selection.

### Observed behavior

- In Edge on Windows, CSS transforms may cause selection handle misalignment.
- Caret position may appear offset.
- Selection handles may not align with selected text.
- Touch selection on mobile may be affected.

### Expected behavior

- CSS transforms should not affect selection handle positioning.
- Caret should appear in the correct visual position.
- Selection handles should align with selected text.

