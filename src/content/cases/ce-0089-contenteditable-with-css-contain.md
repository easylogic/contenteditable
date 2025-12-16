---
id: ce-0089
scenarioId: scenario-css-contain
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: CSS contain property may affect contenteditable selection
tags:
  - css-contain
  - selection
  - chrome
  - windows
status: draft
---

### Phenomenon

When a contenteditable element or its parent has the CSS `contain` property, selection behavior may be affected. Selection may not extend beyond the contained element, and caret movement may be restricted.

### Reproduction example

1. Create a contenteditable div with `contain: layout style paint`.
2. Try to select text that spans beyond the element boundaries.
3. Try to move the caret outside the element.
4. Observe selection and caret behavior.

### Observed behavior

- In Chrome on Windows, CSS contain may restrict selection.
- Selection may not extend beyond contained boundaries.
- Caret movement may be limited.
- Selection ranges may be invalidated.

### Expected behavior

- CSS contain should not affect contenteditable selection.
- Or, the behavior should be clearly documented.
- Selection should work normally within contained elements.

