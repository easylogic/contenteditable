---
id: ce-0112
scenarioId: scenario-nested-formatting
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Applying multiple formatting creates deeply nested structures
description: "When applying multiple formatting operations (bold, italic, underline) to text, deeply nested HTML structures are created (e.g., <b><i><u>text</u></i></b>). This makes the DOM complex and hard to manage."
tags:
  - formatting
  - nested
  - bold
  - italic
  - chrome
status: draft
---

### Phenomenon

When applying multiple formatting operations (bold, italic, underline) to text, deeply nested HTML structures are created (e.g., `<b><i><u>text</u></i></b>`). This makes the DOM complex and hard to manage.

### Reproduction example

1. Select some text
2. Apply bold formatting
3. Apply italic formatting
4. Apply underline formatting
5. Observe the DOM structure

### Observed behavior

- Deeply nested structure: `<b><i><u>text</u></i></b>`
- Or different nesting order depending on application sequence
- DOM becomes complex and bloated
- Difficult to manage formatting state

### Expected behavior

- Formatting should be applied efficiently
- Nesting should be minimized where possible
- Structure should be normalized
- Formatting state should be easy to query

### Browser Comparison

- **Chrome/Edge**: Creates nested structures (this case)
- **Firefox**: Similar nesting behavior
- **Safari**: Most complex nesting

### Notes and possible direction for workarounds

- Normalize formatting structure after operations
- Merge same-type formatting elements
- Use consistent nesting order
- Consider using data attributes instead of nested elements

