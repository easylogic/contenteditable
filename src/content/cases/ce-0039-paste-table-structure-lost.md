---
id: ce-0039
scenarioId: scenario-paste-formatting-loss
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Pasting tables loses structure and formatting
tags:
  - paste
  - table
  - structure
  - firefox
status: draft
---

### Phenomenon

When pasting table content (from Excel, Google Sheets, or HTML tables) into a contenteditable region in Firefox, the table structure is lost. The content may be pasted as plain text or lose its formatting.

### Reproduction example

1. Copy a table from Excel or Google Sheets.
2. Create a contenteditable div.
3. Paste the table content (Ctrl+V).
4. Observe the structure of the pasted content.

### Observed behavior

- In Firefox on Windows, table structure is not preserved.
- Table cells may be converted to plain text or lose their relationships.
- Formatting (borders, colors, alignment) is lost.

### Expected behavior

- Tables should be pasted with their structure intact (`<table>`, `<tr>`, `<td>` elements).
- Formatting should be preserved where possible.
- Or, there should be a way to control how tables are pasted.

