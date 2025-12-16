---
id: ce-0041
scenarioId: scenario-spellcheck-behavior
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Spellcheck interferes with contenteditable editing
tags:
  - spellcheck
  - editing
  - safari
status: draft
---

### Phenomenon

When `spellcheck="true"` is enabled on a contenteditable region in Safari, the spellcheck functionality may interfere with normal editing. Red underlines may appear incorrectly, and the spellcheck UI may block text selection or editing.

### Reproduction example

1. Create a contenteditable div with `spellcheck="true"`.
2. Type some text, including intentionally misspelled words.
3. Observe the spellcheck behavior.
4. Try to select text that has spellcheck underlines.

### Observed behavior

- In Safari on macOS, spellcheck underlines may interfere with text selection.
- The spellcheck UI may appear in unexpected locations.
- Editing may be blocked or delayed by spellcheck processing.

### Expected behavior

- Spellcheck should not interfere with normal editing operations.
- Text selection should work regardless of spellcheck underlines.
- The spellcheck UI should not block or delay editing.

