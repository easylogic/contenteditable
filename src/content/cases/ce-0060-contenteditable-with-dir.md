---
id: ce-0060
scenarioId: scenario-text-direction
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: Arabic
caseTitle: Text direction (dir attribute) changes are not applied during editing
tags:
  - direction
  - rtl
  - ltr
  - firefox
status: draft
---

### Phenomenon

When the `dir` attribute is changed dynamically on a contenteditable region (e.g., switching between `ltr` and `rtl`), the text direction may not update correctly during active editing in Firefox. The caret position and text flow may be incorrect.

### Reproduction example

1. Create a contenteditable div with `dir="ltr"`.
2. Start typing some text.
3. Change `dir` to `"rtl"` programmatically.
4. Continue typing.
5. Observe the text direction and caret position.

### Observed behavior

- In Firefox on Windows, changing `dir` during editing may not take effect immediately.
- The caret position may be incorrect.
- Text flow may not update properly.

### Expected behavior

- The `dir` attribute should update text direction immediately.
- Caret position should adjust correctly.
- Text flow should reflect the new direction.

