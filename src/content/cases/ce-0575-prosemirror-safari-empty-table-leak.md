---
id: ce-0575-prosemirror-safari-empty-table-leak
scenarioId: scenario-table-composition-leaks
locale: en
os: macOS
osVersion: "15.2"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "18.2"
keyboard: Japanese IME
caseTitle: "ProseMirror: Text moves out of empty table cell in Safari"
description: "A specific manifestation in ProseMirror where Safari 18+ commits composition outside the <td> if it was initially empty, despite ProseMirror's internal selection management."
tags: ["prosemirror", "safari", "table", "composition", "regression"]
status: confirmed
domSteps:
  - label: "Step 1: Focus Empty TD"
    html: '<td>|</td>'
    description: "Caret is in an empty cell managed by ProseMirror-view."
  - label: "Step 2: Composition"
    html: '<td><span class="ProseMirror-widget">...</span>あ|</td>'
    description: "IME composition session starts. ProseMirror may inject temporary widget nodes."
  - label: "Step 3: Commit (Bug)"
    html: 'あ<td></td>'
    description: "Composition ends. WebKit miscalculates the physical position and inserts the text before the table."
  - label: "✅ Expected"
    html: '<td>아|</td>'
    description: "Expected: Text remains inside the cell and ProseMirror updates its document model correctly."
---

## Phenomenon
In late 2025 (affecting `prosemirror-view` prior to 1.41.5), a specific interaction with Safari 18's improved but still buggy composition engine was identified. When composing Japanese/Korean text in a completely empty `<td>`, the Committed text "leaks" out to the parent container. This happens because WebKit's selection mapping fails to find a stable anchor within the empty cell after the temporary composition nodes are removed.

## Reproduction Steps
1. Use ProseMirror-view < 1.41.5.
2. Create a document with an empty table cell.
3. Open in Safari 18.2+.
4. Focus the cell and type using a CJK IME.
5. Press Enter to confirm.

## Observed Behavior
- **DOM Leaking**: The text appears outside the table at the document level.
- **Inconsistent State**: ProseMirror's `EditorState` still thinks the cursor is in the cell, or it may crash if the mutation happens in an unmanaged area.

## Expected Behavior
The text should stay within the `<td>` boundaries.

## Browser Comparison
- **Safari 18.2**: High reproduction rate.
- **Chrome/Firefox**: Correct behavior.

## References & Solutions
### Mitigation: The "Invisible Content" Hack
ProseMirror fixed this in `v1.41.5` by ensuring that empty table cells always contain at least a `<br>` or a zero-width space during selection to anchor the WebKit engine.

```javascript
/* ProseMirror-view internal-like fix */
function fixEmptyCell(dom) {
  if (isSafari && dom.nodeName === 'TD' && !dom.firstChild) {
    dom.appendChild(document.createElement('br'));
  }
}
```

- [ProseMirror-view v1.41.5 Release Notes](https://prosemirror.net/docs/changelog/#view.1.41.5)
- [ProseMirror GitHub Issue #1452](https://github.com/ProseMirror/prosemirror/issues/1452)
