---
id: ce-0068
scenarioId: scenario-spellcheck-interference
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Spellcheck suggestions interfere with contenteditable editing
tags:
  - spellcheck
  - editing
  - safari
  - macos
status: draft
---

### Phenomenon

When spellcheck is enabled on a contenteditable element, browser spellcheck suggestions can interfere with editing. The spellcheck UI may overlap with content, and accepting suggestions may cause unexpected behavior.

### Reproduction example

1. Create a contenteditable div with `spellcheck="true"`.
2. Type text with intentional misspellings.
3. Observe the spellcheck suggestions that appear.
4. Try to accept or ignore suggestions.
5. Continue editing and observe any interference.

### Observed behavior

- In Safari on macOS, spellcheck suggestions appear as expected.
- Accepting suggestions may cause the caret to jump unexpectedly.
- The spellcheck UI may overlap with content during editing.
- Spellcheck may interfere with IME composition.

### Expected behavior

- Spellcheck should work seamlessly with contenteditable.
- Suggestions should not interfere with editing flow.
- Caret position should remain stable when accepting suggestions.
- Spellcheck should pause during IME composition.

