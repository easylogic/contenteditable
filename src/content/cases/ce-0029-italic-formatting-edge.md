---
id: ce-0029
scenarioId: scenario-formatting-persistence
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: Italic formatting is lost when typing after applying italic
description: "When applying italic formatting to selected text and then continuing to type, the italic formatting is not maintained for the newly typed characters in Edge on Windows."
tags:
  - formatting
  - italic
  - edge
status: draft
---

### Phenomenon

When applying italic formatting to selected text and then continuing to type, the italic formatting is not maintained for the newly typed characters in Edge on Windows.

### Reproduction example

1. Create a contenteditable div.
2. Type some text.
3. Select the text and apply italic formatting (Ctrl+I or through execCommand).
4. Place the caret at the end of the italic text.
5. Continue typing.

### Observed behavior

- In Edge on Windows, newly typed characters after the italic text are not italic.
- The formatting state appears to be lost when the caret moves.

### Expected behavior

- Newly typed characters should inherit the formatting of the preceding text when the caret is within or immediately after formatted text.

