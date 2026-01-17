---
id: ce-0306-table-cell-contenteditable-focus-ie-ko
scenarioId: scenario-table-cell-contenteditable-focus-ie
locale: ko
os: Windows
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Internet Explorer
browserVersion: "11"
keyboard: US
caseTitle: Cannot focus on contenteditable table cell in Internet Explorer
description: "In Internet Explorer, setting contenteditable='true' directly on <td> elements can prevent the cells from gaining focus, making editing impossible."
tags:
  - table
  - focus
  - internet-explorer
  - td
status: draft
---

## Phenomenon

In Internet Explorer, setting `contenteditable="true"` directly on `<td>` (table cell) elements can prevent the cells from gaining focus. Users cannot click into the cell to edit content, making table editing impossible.

## Reproduction example

1. Create an HTML table with `<td contenteditable="true">` cells.
2. Open in Internet Explorer 11.
3. Try to click on a table cell to focus and edit.
4. Observe that focus cannot be established.

## Observed behavior

- **Focus failure**: Clicking on `<td contenteditable="true">` does not establish focus.
- **Cursor not visible**: Text cursor does not appear in the cell.
- **Input not accepted**: Typing does not insert text into the cell.
- **Selection issues**: Cannot select text within the cell.
- **IE-specific**: This issue is specific to Internet Explorer and does not occur in modern browsers.

## Expected behavior

- Clicking on a contenteditable table cell should establish focus.
- Text cursor should appear in the cell.
- Typing should insert text into the cell.
- Cell should be fully editable.

## Analysis

Internet Explorer has limitations with applying `contenteditable` directly to table-related elements. The browser's contenteditable implementation does not properly handle focus for table cells.

## Workarounds

- Place a contenteditable element inside the `<td>` instead of on the `<td>` itself:
  ```html
  <td>
    <div contenteditable="true">Cell content</div>
  </td>
  ```
- Use `<span contenteditable="true">` inside the cell.
- Wrap cell content in a contenteditable div or span.
- This workaround allows the inner element to handle editing while the cell provides structure.
