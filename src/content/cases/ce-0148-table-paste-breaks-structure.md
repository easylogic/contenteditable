---
id: ce-0148-table-paste-breaks-structure
scenarioId: scenario-table-editing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Pasting content into table cell breaks table structure
description: "When pasting formatted content into a table cell in Chrome, the table structure may break. Cells may be removed, rows may be deleted, or the table may become malformed."
tags:
  - table
  - paste
  - structure
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    description: "Table structure"
  - label: "Clipboard"
    html: '<div><strong>Bold</strong> Text</div>'
    description: "Copied formatted content"
  - label: "❌ After Paste"
    html: '<table><tr><td></td></tr></table>'
    description: "Table structure damaged, cells deleted or structure broken"
  - label: "✅ Expected"
    html: '<table><tr><td><strong>Bold</strong> Text</td><td>Cell 2</td></tr></table>'
    description: "Table structure maintained, content inserted inside cells"
---

## Phenomenon

When pasting formatted content into a table cell in Chrome, the table structure may break. Cells may be removed, rows may be deleted, or the table may become malformed.

## Reproduction example

1. Create a table: `<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>`
2. Paste formatted HTML content into a cell
3. Observe table structure

## Observed behavior

- Table cells may be removed
- Rows may be deleted
- Table structure becomes malformed
- DOM structure breaks

## Expected behavior

- Table structure should be maintained
- Cells should remain intact
- Pasted content should be within cell
- Structure should be preserved

## Browser Comparison

- **Chrome/Edge**: May break structure (this case)
- **Firefox**: More likely to break structure
- **Safari**: Most likely to break structure

## Notes and possible direction for workarounds

- Intercept paste in table cells
- Strip block-level elements from pasted content
- Preserve table structure
- Validate structure after paste

