---
id: ce-0566-safari-table-cell-composition-leak
scenarioId: scenario-table-composition-leaks
locale: en
os: macOS
osVersion: "14.4"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "17.4"
keyboard: Japanese IME
caseTitle: "IME composition text moves outside empty table cell"
description: "In Safari 17+, IME composition in a completely empty table cell often commits the final text outside the <td> container."
tags: ["ime", "composition", "table", "safari-17", "selection-leak"]
status: confirmed
domSteps:
  - label: "Step 1: Empty Cell Focus"
    html: '<table><tr><td style="border: 1px solid black;">|</td></tr></table>'
    description: "The caret is placed inside an empty <td>."
  - label: "Step 2: Composition Start"
    html: '<table><tr><td style="border: 1px solid black;"><span style="text-decoration: underline;">あ</span>|</td></tr></table>'
    description: "Composition begins. 'あ' appears as an inline composition session inside the cell."
  - label: "Step 3: Commit (Bug)"
    html: 'あ<table><tr><td style="border: 1px solid black;"></td></tr></table>'
    description: "Upon pressing Enter to commit, the text 'あ' jumps out of the cell and appears before the table."
  - label: "✅ Expected"
    html: '<table><tr><td style="border: 1px solid black;">あ|</td></tr></table>'
    description: "Expected: The committed text should remain within the <td> where it was composed."
---

## Phenomenon
Safari's WebKit engine has a flaw in how it resolves "Logical to Physical" selection mapping within table structures. When a user initiates and commits an IME composition (common in CJK languages) inside a `<td>` cell that contains no other text or nodes, the final insertion point is incorrectly calculated as being outside the cell. 

## Reproduction Steps
1. Render a structure with an empty table cell: `<table><tr><td></td></tr></table>`.
2. Set `contenteditable="true"` on the cell or its container.
3. Use a CJK IME (e.g., Japanese Kana, Chinese Pinyin).
4. Click inside the cell and type enough to start a composition (e.g., type "a").
5. Confirm the selection by pressing **Enter**.

## Observed Behavior
1. **`compositionstart` and `compositionupdate`**: These fire correctly inside the `<td>`.
2. **`compositionend`**: Fires normally.
3. **DOM Mutation**: After composition ends, the character is removed from the temporary composition state but is re-inserted as static text **outside** the `<td>`.
4. **Caret Position**: The caret often jumps to the very beginning of the document or the start of the table block.

## Expected Behavior
The browser should ensure that the `Selection` range remaines anchored to the parent `<td>` element throughout the entire composition lifecycle.

## Impact
- **Data Integrity**: Text appears in the wrong logical order or outside the intended container.
- **Visual Corruption**: The table remains empty while the text floats above or below it, breaking the document's visual layout.
- **Undo History**: Since the insertion happened in a "leaked" position, the undo operation might fail to remove the text correctly.

## Browser Comparison
- **Safari 17/18**: Exhibit the bug.
- **Chrome/Firefox**: Correct behavior; the range remains scoped to the `<td>`.

## References & Solutions
### Mitigation: Placeholder Node
A known workaround used in ProseMirror is to ensure the cell is never "truly empty" during selection or to manually reset the selection inside the cell upon `compositionend`.

```javascript
// Force an invisible placeholder or check range on compositionend
element.addEventListener('compositionend', (e) => {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  
  if (!container.contains(range.commonAncestorContainer)) {
    console.warn('Safari Selection Leak Detected! Fixing...');
    // Manually insert data at the correct location
    insertAtLastKnownValidPath(e.data);
  }
});
```

- [ProseMirror v1.41.5 Workaround](https://github.com/ProseMirror/prosemirror-view/commit/6b7f3d)
- [WebKit Bug 271501](https://bugs.webkit.org/show_bug.cgi?id=271501)
