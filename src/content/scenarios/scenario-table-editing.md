---
id: scenario-table-editing
title: Table editing in contenteditable is limited and inconsistent
description: "Editing tables within contenteditable elements is limited and behaves inconsistently across browsers. Creating tables, editing cells, adding/removing rows and columns, and maintaining table structure all have browser-specific behaviors and limitations."
category: formatting
tags:
  - table
  - cell
  - row
  - column
status: draft
locale: en
---

Editing tables within contenteditable elements is limited and behaves inconsistently across browsers. Creating tables, editing cells, adding/removing rows and columns, and maintaining table structure all have browser-specific behaviors and limitations.

## Observed Behavior

### Scenario 1: Creating tables
- **Chrome/Edge**: May support table creation via execCommand or manual insertion
- **Firefox**: Limited table creation support
- **Safari**: Table creation behavior varies

### Scenario 2: Editing table cells
- **Chrome/Edge**: Cell editing works but may break structure
- **Firefox**: Similar issues with structure
- **Safari**: Cell editing most likely to break structure

### Scenario 3: Adding/removing rows
- **Chrome/Edge**: May support via execCommand but behavior inconsistent
- **Firefox**: Limited support
- **Safari**: Row manipulation unreliable

### Scenario 4: Tab navigation in tables
- **Chrome/Edge**: Tab may move to next cell or insert tab character
- **Firefox**: Similar inconsistent behavior
- **Safari**: Tab handling varies

## Impact

- Difficulty implementing table editing features
- Risk of breaking table structure
- Inconsistent user experience
- Need for custom table editing implementation

## Browser Comparison

- **Chrome/Edge**: Best table editing support but still limited
- **Firefox**: More limited table support
- **Safari**: Most inconsistent table behavior

## Workaround

Implement custom table handling:

```javascript
// Handle Tab key in table cells
element.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const cell = range.startContainer.closest('td, th');
    
    if (cell) {
      e.preventDefault();
      
      const table = cell.closest('table');
      const row = cell.parentElement;
      const cells = Array.from(row.cells);
      const currentIndex = cells.indexOf(cell);
      
      if (e.shiftKey) {
        // Shift+Tab: previous cell
        if (currentIndex > 0) {
          focusCell(cells[currentIndex - 1]);
        } else {
          // Move to last cell of previous row
          const prevRow = row.previousElementSibling;
          if (prevRow) {
            focusCell(prevRow.cells[prevRow.cells.length - 1]);
          }
        }
      } else {
        // Tab: next cell
        if (currentIndex < cells.length - 1) {
          focusCell(cells[currentIndex + 1]);
        } else {
          // Move to first cell of next row
          const nextRow = row.nextElementSibling;
          if (nextRow) {
            focusCell(nextRow.cells[0]);
          } else {
            // Add new row
            const newRow = table.insertRow();
            const newCell = newRow.insertCell();
            newCell.contentEditable = 'true';
            focusCell(newCell);
          }
        }
      }
    }
  }
});

function focusCell(cell) {
  const range = document.createRange();
  range.selectNodeContents(cell);
  range.collapse(true);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  cell.focus();
}
```

