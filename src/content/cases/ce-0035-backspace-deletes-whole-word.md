---
id: ce-0035
scenarioId: scenario-backspace-granularity
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Backspace deletes whole words instead of single characters
description: "In Safari on macOS, pressing Backspace may delete entire words instead of single characters, especially when the caret is positioned at word boundaries or after spaces."
tags:
  - backspace
  - deletion
  - granularity
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello world| example'
    description: "Text, cursor (|) after 'world'"
  - label: "After Backspace (Bug)"
    html: 'Hello | example'
    description: "Backspace deletes entire word 'world' (expected: one character at a time)"
  - label: "✅ Expected"
    html: 'Hello worl| example'
    description: "Expected: Backspace deletes one character at a time (only last 'd' deleted)"
---

### Phenomenon

In Safari on macOS, pressing Backspace may delete entire words instead of single characters, especially when the caret is positioned at word boundaries or after spaces.

### Reproduction example

1. Create a contenteditable div.
2. Type some text with multiple words, e.g., "Hello world example".
3. Place the caret at the end of a word (after "world").
4. Press Backspace.
5. Observe how much text is deleted.

### Observed behavior

- In Safari on macOS, Backspace may delete entire words.
- The deletion granularity is inconsistent.
- Sometimes single characters are deleted, sometimes whole words.

### Expected behavior

- Backspace should delete one character at a time by default.
- Word-level deletion should only occur with modifier keys (e.g., Option+Backspace).
- The behavior should be consistent and predictable.

