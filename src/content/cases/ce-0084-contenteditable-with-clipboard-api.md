---
id: ce-0084
scenarioId: scenario-clipboard-api
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Clipboard API read/write works inconsistently with contenteditable
tags:
  - clipboard-api
  - paste
  - firefox
  - windows
status: draft
---

### Phenomenon

When using the Clipboard API (navigator.clipboard.readText/writeText) with contenteditable elements, the behavior may be inconsistent. Reading clipboard content may not work during paste events, and writing to clipboard may not preserve formatting.

### Reproduction example

1. Create a contenteditable div.
2. Listen for paste events.
3. Try to read clipboard content using Clipboard API.
4. Try to write formatted content to clipboard.
5. Observe any errors or inconsistencies.

### Observed behavior

- In Firefox on Windows, Clipboard API may not work correctly with contenteditable.
- Reading clipboard during paste may require user gesture.
- Writing formatted content may not preserve HTML.
- Permissions may be required inconsistently.

### Expected behavior

- Clipboard API should work seamlessly with contenteditable.
- Reading should work during paste events.
- Writing should preserve formatting when appropriate.

