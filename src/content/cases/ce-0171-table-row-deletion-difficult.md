---
id: ce-0171
scenarioId: scenario-table-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Deleting table rows is difficult without custom implementation
description: "When trying to delete a table row in a contenteditable element in Chrome, there's no native way to delete rows. Users must manually delete all cell content or use custom implementation."
tags:
  - table
  - row
  - deletion
  - chrome
status: draft
---

### Phenomenon

When trying to delete a table row in a contenteditable element in Chrome, there's no native way to delete rows. Users must manually delete all cell content or use custom implementation.

### Reproduction example

1. Create a table with multiple rows
2. Try to delete an entire row
3. Observe available options

### Observed behavior

- No native way to delete rows
- Must delete cell content manually
- Or use custom implementation
- Row deletion is not intuitive

### Expected behavior

- Should be able to delete rows easily
- Or native row deletion should be available
- Deletion should be intuitive
- Table structure should be maintained

### Browser Comparison

- **All browsers**: No native row deletion
- Custom implementation needed for row operations

### Notes and possible direction for workarounds

- Implement custom row deletion
- Provide UI for row operations
- Handle row deletion programmatically
- Maintain table structure after deletion

