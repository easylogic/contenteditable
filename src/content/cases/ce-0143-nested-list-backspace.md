---
id: ce-0143
scenarioId: scenario-nested-list-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Backspace at beginning of nested list item deletes nested list
description: "When pressing Backspace at the beginning of a nested list item in Firefox, the entire nested list structure may be deleted instead of just unindenting the list item. This breaks the list structure."
tags:
  - list
  - nested
  - backspace
  - firefox
status: draft
---

### Phenomenon

When pressing Backspace at the beginning of a nested list item in Firefox, the entire nested list structure may be deleted instead of just unindenting the list item. This breaks the list structure.

### Reproduction example

1. Create a nested list: `<ul><li>Item 1<ul><li>Nested item</li></ul></li></ul>`
2. Place cursor at the beginning of "Nested item"
3. Press Backspace

### Observed behavior

- Entire nested list is deleted
- Or nested structure is broken
- List item is not just unindented
- Structure becomes malformed

### Expected behavior

- List item should be unindented (moved to parent list)
- Nested list structure should be preserved
- Only the specific item should be affected
- Structure should remain valid

### Browser Comparison

- **Chrome/Edge**: May unindent correctly or delete list
- **Firefox**: More likely to delete nested list (this case)
- **Safari**: Behavior most inconsistent

### Notes and possible direction for workarounds

- Intercept Backspace in nested list items
- Implement custom unindent logic
- Move list item to parent list
- Preserve nested list structure

