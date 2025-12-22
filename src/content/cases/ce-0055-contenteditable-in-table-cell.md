---
id: ce-0055
scenarioId: scenario-contenteditable-table
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: contenteditable in table cells causes layout issues
description: "When a contenteditable region is inside a table cell (td), editing the content may cause layout issues in Firefox. The table may resize unexpectedly or the cell may overflow."
tags:
  - table
  - layout
  - contenteditable
  - firefox
status: draft
---

### Phenomenon

When a contenteditable region is inside a table cell (`<td>`), editing the content may cause layout issues in Firefox. The table may resize unexpectedly or the cell may overflow.

### Reproduction example

1. Create a table with a contenteditable cell:
   ```html
   <table>
     <tr>
       <td contenteditable>Editable content</td>
     </tr>
   </table>
   ```
2. Edit the content in the cell (add or remove text).
3. Observe the table layout.

### Observed behavior

- In Firefox on Windows, editing content in table cells may cause layout issues.
- The table may resize unexpectedly.
- Cells may overflow or change size.
- The layout may become unstable.

### Expected behavior

- Editing content in table cells should not cause layout issues.
- The table should maintain its structure.
- Cell sizes should remain stable during editing.

