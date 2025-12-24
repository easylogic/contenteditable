---
id: ce-0099
scenarioId: scenario-nested-list-behavior
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Enter key in nested list creates item at same level in Chrome
description: "When pressing Enter in a nested list item in Chrome, a new list item is created at the same nesting level. This behavior is generally correct, but may differ from user expectations or other browsers."
tags:
  - list
  - nested
  - enter
  - chrome
status: draft
---

### Phenomenon

When pressing Enter in a nested list item in Chrome, a new list item is created at the same nesting level. This behavior is generally correct, but may differ from user expectations or other browsers.

### Reproduction example

1. Create a nested list: `<ul><li>Item 1<ul><li>Nested item</li></ul></li></ul>`
2. Place cursor inside "Nested item"
3. Press Enter

### Observed behavior

- A new list item is created at the same nesting level (inside the nested `<ul>`)
- The list structure is maintained
- If cursor is at the end, new item is created after
- If cursor is in the middle, text is split

### Expected behavior

- New list item should be created at the same nesting level
- List structure should be maintained
- Behavior should be consistent across browsers

### Browser Comparison

- **Chrome/Edge**: Creates item at same level (this case)
- **Firefox**: May create item or paragraph, behavior inconsistent
- **Safari**: May create unexpected nesting levels

### Notes and possible direction for workarounds

- This behavior is generally acceptable
- May need to handle edge cases where list structure breaks
- Consider intercepting Enter to ensure consistent behavior
- Normalize list structure after operations

