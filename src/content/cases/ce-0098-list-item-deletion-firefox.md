---
id: ce-0098
scenarioId: scenario-list-item-deletion
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Backspace at beginning of list item may delete entire list in Firefox
description: "When pressing Backspace at the beginning of a list item in Firefox, the entire list may be deleted or unexpected nested structures may be created. This behavior differs from Chrome, which converts the list item to a paragraph."
tags:
  - list
  - deletion
  - backspace
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: '<ul><li>Item 1</li><li>Item 2</li></ul>'
    description: "List structure, cursor at start of first item"
  - label: "After Backspace (Bug)"
    html: ''
    description: "Backspace deletes entire list"
  - label: "✅ Expected"
    html: '<ul><li>Item 2</li></ul>'
    description: "Expected: Only first item deleted, list structure maintained"
---

### Phenomenon

When pressing Backspace at the beginning of a list item in Firefox, the entire list may be deleted or unexpected nested structures may be created. This behavior differs from Chrome, which converts the list item to a paragraph.

### Reproduction example

1. Create a list with items: `<ul><li>Item 1</li><li>Item 2</li></ul>`
2. Place cursor at the very beginning of the first list item
3. Press Backspace

### Observed behavior

- The entire list may be deleted
- Or nested list structures may be created unexpectedly
- List items may be converted to paragraphs in an inconsistent way
- DOM structure may become malformed

### Expected behavior

- The list item should be deleted while maintaining list structure
- Remaining list items should stay in the list
- Behavior should be consistent with Chrome

### Browser Comparison

- **Chrome/Edge**: Converts list item to paragraph (more predictable)
- **Firefox**: May delete entire list (this case)
- **Safari**: May create empty list items

### Notes and possible direction for workarounds

- Intercept `beforeinput` events to prevent default behavior
- Implement custom deletion that maintains list structure
- Check for list context before allowing deletion
- Normalize DOM structure after deletion operations

