---
id: ce-0115
scenarioId: scenario-table-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Tab key inserts tab character instead of moving to next cell
description: "When editing a table cell in a contenteditable element, pressing Tab inserts a tab character instead of moving to the next cell. This makes table navigation difficult."
tags:
  - table
  - tab
  - navigation
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    description: "Table structure, cursor in first cell"
  - label: "After Tab (Bug)"
    html: '<table><tr><td>Cell 1\t</td><td>Cell 2</td></tr></table>'
    description: "Tab key inserts tab character, does not move to next cell"
  - label: "✅ Expected"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    description: "Expected: Tab key moves to next cell, tab character not inserted"
---

### Phenomenon

When editing a table cell in a contenteditable element, pressing Tab inserts a tab character instead of moving to the next cell. This makes table navigation difficult.

### Reproduction example

1. Create a table in contenteditable
2. Click inside a table cell
3. Press Tab key

### Observed behavior

- Tab character is inserted into the cell
- Cursor does not move to next cell
- Table navigation is broken
- Users cannot easily navigate between cells

### Expected behavior

- Tab should move to next cell
- Shift+Tab should move to previous cell
- Tab character should not be inserted
- Navigation should work like spreadsheet applications

### Browser Comparison

- **All browsers**: Tab inserts character (default behavior)
- Custom handling needed for table navigation

### Notes and possible direction for workarounds

- Intercept Tab key in table cells
- Prevent default behavior
- Find next/previous cell
- Move cursor to next cell
- Handle edge cases (last cell, first cell)

