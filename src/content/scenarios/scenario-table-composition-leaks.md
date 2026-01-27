---
id: scenario-table-composition-leaks
title: "IME composition text leaks outside table cells"
description: "A technical evaluation of why IME composition often fails when anchored inside empty table structures."
category: "ime"
tags: ["composition", "table", "selection", "webkit"]
status: "confirmed"
locale: "en"
---

## Problem Overview
Table cells (`<td>`, `<th>`) are unique in the DOM because they act as both layout containers and structural boundaries. IME (Input Method Editor) sessions require a stable `Selection` range to manage the "pre-edit" text. In many browsers, particularly WebKit-based ones, if a cell is empty or contains only a `<br>` or a zero-width space, the engine's internal selection-mapping logic can "overshoot" the cell boundary during the commit phase, placing the final text in the parent row or before the table entirely.

## Observed Behavior
### Scenario 1: The "Empty Cell" Trap
In an empty cell, the browser often represents the caret as being "at the start of the cell", but logically it might resolve to the same point as "before the table". 

```javascript
/* Observed Sequence */
// 1. User focuses <td></td>
// 2. User types 'G' (IME start)
// 3. Browser creates a temp span for 'G'
// 4. User presses Enter (Commit)
// 5. Browser destroys temp span
// 6. Browser inserts 'G' but uses a cached range that is no longer validly nested.
```

## Impact
- **Document Corruption**: The table becomes physically broken in the DOM.
- **Accessibility**: Screen readers lose the context that the text belongs to a specific cell.
- **Styling**: Text outside the `<td>` ignores cell padding, alignment, and scoping rules.

## Browser Comparison
- **WebKit (Safari)**: Most vulnerable engine. The issue is persistent across iOS and macOS in versions 17.x.
- **Blink (Chrome)**: Generally robust due to an "automatic paragraph" insertion logic that adds a `<p>` or `<br>` to maintain cell height/focus.
- **Gecko (Firefox)**: Handles the boundary well, but can sometimes suffer from duplicate characters if the commit timing is slightly off.

## Solutions
### 1. Invisible Placeholder (Zero-Width Space)
Ensuring the cell is never technically "empty" is the most common fix.

```javascript
function ensureTdContent(td) {
  if (td.childNodes.length === 0) {
    // Add a ZWSP to anchor the selection
    td.appendChild(document.createTextNode('\u200B'));
  }
}
```

### 2. Manual Reconciliation on `compositionend`
Override the browser's insertion by intercepting the final commit.

```javascript
element.addEventListener('compositionend', (e) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const td = findParentTd(range.startContainer);
  
  if (!td) {
    e.preventDefault();
    console.warn('Fixing selection leak...');
    forceInsertIntoCorrectCell(e.data);
  }
});
```

## Best Practices
- **Always maintain a ZWSP or BR**: Never leave a `contenteditable` table cell completely empty.
- **Verify range containment**: In your event handlers, always check `cell.contains(range.commonAncestorContainer)`.

## Related Cases
- [ce-0566: IME composition text moves outside empty table cell](file:///Users/user/github/barocss/contenteditable/src/content/cases/ce-0566-safari-table-cell-composition-leak.md)

## References
- [W3C Editing: Table Handling](https://github.com/w3c/editing)
- [WebKit Selection Bug Tracker](https://bugs.webkit.org/show_bug.cgi?id=271501)
