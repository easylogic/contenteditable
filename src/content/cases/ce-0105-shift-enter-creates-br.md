---
id: ce-0105
scenarioId: scenario-enter-vs-shift-enter
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Shift+Enter creates br element for line break
description: "When pressing Shift+Enter in a contenteditable element, a <br> line break element is created instead of a new paragraph. This behavior is consistent across Chrome, Firefox, and Safari."
tags:
  - enter
  - line-break
  - br
  - all-browsers
status: draft
---

### Phenomenon

When pressing Shift+Enter in a contenteditable element, a `<br>` line break element is created instead of a new paragraph. This behavior is consistent across Chrome, Firefox, and Safari.

### Reproduction example

1. Focus a contenteditable element
2. Type some text
3. Press Shift+Enter

### Observed behavior

- A `<br>` element is inserted
- Text continues on the next line without creating a new block element
- This is consistent across all major browsers
- Useful for line breaks within paragraphs

### Expected behavior

- Shift+Enter should create a line break (current behavior is correct)
- Enter should create a new paragraph/block
- Behavior should be consistent (which it is)

### Browser Comparison

- **All browsers**: Shift+Enter creates `<br>` consistently
- This is expected and correct behavior

### Notes and possible direction for workarounds

- This behavior is generally correct and expected
- May need to handle edge cases where `<br>` is in unexpected contexts
- Consider normalizing multiple `<br>` elements if needed
- Ensure `<br>` is properly styled for line breaks

