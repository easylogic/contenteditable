---
id: ce-0126
scenarioId: scenario-table-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Editing table cell content breaks table structure in Safari
description: "When editing text within a table cell in Safari, the table structure may break. Cells may be removed, rows may be deleted, or the table may become malformed."
tags:
  - table
  - cell
  - structure
  - safari
status: draft
---

### Phenomenon

When editing text within a table cell in Safari, the table structure may break. Cells may be removed, rows may be deleted, or the table may become malformed.

### Reproduction example

1. Create a table: `<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>`
2. Edit text in a cell
3. Apply formatting or delete text
4. Observe table structure

### Observed behavior

- Table cells may be removed
- Rows may be deleted
- Table structure becomes malformed
- DOM structure breaks

### Expected behavior

- Table structure should be maintained
- Cells should remain intact
- Rows should not be deleted
- Structure should be preserved during editing

### Browser Comparison

- **Chrome/Edge**: Generally maintains table structure
- **Firefox**: May break structure occasionally
- **Safari**: Most likely to break structure (this case)

### Notes and possible direction for workarounds

- Intercept editing operations in table cells
- Prevent operations that break structure
- Validate table structure after operations
- Restore structure if broken

