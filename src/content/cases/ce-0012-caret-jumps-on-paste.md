---
id: ce-0012
scenarioId: scenario-caret-position-after-paste
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Caret position jumps unexpectedly after pasting content
tags:
  - paste
  - caret
  - position
  - firefox
status: draft
---

### Phenomenon

After pasting content into a contenteditable region, the caret position does not end up at the expected location, sometimes jumping to the beginning of the pasted content or to an unexpected position.

### Reproduction example

1. Create a contenteditable div with some existing text.
2. Place the caret in the middle of the text.
3. Paste content (Ctrl+V or Cmd+V).
4. Observe the final caret position.

### Observed behavior

- In Firefox on Windows, the caret sometimes ends up at the start of the pasted content instead of after it.
- The selection range after paste is inconsistent.

### Expected behavior

- The caret should be positioned immediately after the pasted content.

