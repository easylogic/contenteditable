---
id: ce-0064
scenarioId: scenario-pattern-validation
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: pattern attribute does not validate contenteditable content
tags:
  - pattern
  - validation
  - regex
  - firefox
status: draft
---

### Phenomenon

The `pattern` attribute, which allows regex-based validation on form inputs, does not work on contenteditable regions. Content cannot be validated against a pattern.

### Reproduction example

1. Create a contenteditable div with `pattern="[0-9]+"` (numbers only).
2. Type non-numeric characters.
3. Observe whether validation occurs.

### Observed behavior

- In Firefox on Windows, the `pattern` attribute is ignored on contenteditable.
- No validation occurs.
- Invalid content can be entered freely.

### Expected behavior

- The `pattern` attribute should validate contenteditable content.
- Invalid content should be rejected or flagged.
- Or, there should be a standard way to validate content against patterns.

