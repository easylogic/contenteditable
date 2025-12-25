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
    description: "텍스트, 커서(|)가 'Hello'와 'World' 사이"
  - label: "After Backspace"
    html: 'Hell|World'
    description: "Backspace로 'o' 삭제 (뒤로 삭제)"
  - label: "After Delete (Bug)"
    html: 'Hello|orld'
    description: "Delete로 'W' 삭제 (앞으로 삭제), 하지만 일관성 없음"
  - label: "✅ Expected"
    html: 'Hello|orld'
    description: "정상: Delete로 'W' 삭제, Backspace와 일관된 동작"
---

### Phenomenon

In Firefox on Linux, the Delete key behaves differently from Backspace in ways that are inconsistent. Delete may remove different amounts of text or behave unexpectedly compared to Backspace.

### Reproduction example

1. Create a contenteditable div.
2. Type some text.
3. Place the caret in the middle of the text.
4. Press Backspace and observe what is deleted.
5. Press Delete and observe what is deleted.
6. Compare the behaviors.

### Observed behavior

- In Firefox on Linux, Delete and Backspace may delete different amounts of text.
- The granularity of deletion may be inconsistent.
- Delete may behave unexpectedly in certain contexts.

### Expected behavior

- Delete should remove the character after the caret (forward deletion).
- Backspace should remove the character before the caret (backward deletion).
- Both should have consistent, predictable behavior.

