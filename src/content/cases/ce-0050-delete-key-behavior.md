---
id: ce-0050
scenarioId: scenario-delete-key-behavior
locale: en
os: Linux
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Delete key behavior is inconsistent with Backspace
description: "In Firefox on Linux, the Delete key behaves differently from Backspace in ways that are inconsistent. Delete may remove different amounts of text or behave unexpectedly compared to Backspace."
tags:
  - delete
  - backspace
  - consistency
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: 'Hello|World'
    description: "Text, cursor (|) between 'Hello' and 'World'"
  - label: "After Backspace"
    html: 'Hell|World'
    description: "Backspace deletes 'o' (backward deletion)"
  - label: "After Delete (Bug)"
    html: 'Hello|orld'
    description: "Delete deletes 'W' (forward deletion), but inconsistent"
  - label: "✅ Expected"
    html: 'Hello|orld'
    description: "Expected: Delete deletes 'W', consistent behavior with Backspace"
---

## Phenomenon

In Firefox on Linux, the Delete key behaves differently from Backspace in ways that are inconsistent. Delete may remove different amounts of text or behave unexpectedly compared to Backspace.

## Reproduction example

1. Create a contenteditable div.
2. Type some text.
3. Place the caret in the middle of the text.
4. Press Backspace and observe what is deleted.
5. Press Delete and observe what is deleted.
6. Compare the behaviors.

## Observed behavior

- In Firefox on Linux, Delete and Backspace may delete different amounts of text.
- The granularity of deletion may be inconsistent.
- Delete may behave unexpectedly in certain contexts.

## Expected behavior

- Delete should remove the character after the caret (forward deletion).
- Backspace should remove the character before the caret (backward deletion).
- Both should have consistent, predictable behavior.

