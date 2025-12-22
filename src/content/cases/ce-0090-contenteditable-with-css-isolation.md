---
id: ce-0090
scenarioId: scenario-css-isolation
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: CSS isolation property may affect contenteditable stacking context
description: "When a contenteditable element has the CSS isolation: isolate property, it creates a new stacking context. This may affect how selection handles and IME candidate windows are positioned relative to the element."
tags:
  - css-isolation
  - stacking-context
  - safari
  - macos
status: draft
---

### Phenomenon

When a contenteditable element has the CSS `isolation: isolate` property, it creates a new stacking context. This may affect how selection handles and IME candidate windows are positioned relative to the contenteditable.

### Reproduction example

1. Create a contenteditable div with `isolation: isolate`.
2. Use an IME to compose text.
3. Observe the position of the IME candidate window.
4. Try to select text and observe selection handles.
5. Compare with a contenteditable without isolation.

### Observed behavior

- In Safari on macOS, isolation may affect IME candidate window positioning.
- Selection handles may be positioned incorrectly.
- Z-index stacking may be affected.
- Overlays may not appear correctly.

### Expected behavior

- CSS isolation should not affect contenteditable UI elements.
- IME candidate windows should be positioned correctly.
- Selection handles should appear in the right place.

