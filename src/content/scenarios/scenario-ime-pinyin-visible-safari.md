---
id: scenario-ime-pinyin-visible-safari
title: IME input in table cells shows raw Pinyin (Safari only)
description: When using Chinese IME to type text in table cells in Safari, both the raw Pinyin buffer and confirmed Chinese characters appear together after pressing Space to confirm composition. This does NOT occur in Chrome.
category: ime
tags:
  - composition
  - ime
  - table
  - safari
  - chinese
  - pinyin
status: draft
locale: en
---

When composing Chinese text with an IME (Input Method Editor) inside table cells (`<td>`) in Safari, pressing Space to confirm the composition causes both:
1. The raw Pinyin input buffer (e.g., "nihao")
2. The confirmed Chinese characters (e.g., "你好")

to appear together in the cell, showing "nihao 你好" instead of just "你好".

## Problem Description

This issue occurs specifically when:
1. User is typing inside a `<td>` element (table cell)
2. Using Chinese IME in Safari
3. Types Pinyin (e.g., "nihao" for "你好")
4. Presses Space to confirm composition

### Expected Behavior
- Only confirmed Chinese characters ("你好") should appear
- Raw Pinyin buffer should NOT be visible

### Actual Behavior (Safari Bug)
- Both Pinyin ("nihao") AND Chinese characters ("你好") appear together
- Result: "nihao 你好" instead of "你好"

## Affected Browsers

- **Safari** (macOS, iOS) - Issue confirmed
- **Chrome** - Does NOT exhibit this behavior (works correctly)
- **Firefox** - Does NOT exhibit this behavior (works correctly)

## Affected Languages

- Chinese IME (shows Pinyin buffer during composition)
- Other IMEs that show raw input buffer

## Root Cause

Safari's IME composition handling in table cells (`<td>` elements) appears to incorrectly maintain both:
1. The raw input buffer being composed
2. The confirmed/composed characters

When composition is confirmed with Space key, Safari fails to properly clear the raw buffer from the DOM in table cells.

## Workarounds

1. **Use div instead of table cells**:
   - Replace `<td>` with `<div>` for editable content if possible
   - Table structure makes IME handling more complex in Safari

2. **Force DOM cleanup after composition**:
   ```javascript
   cell.addEventListener('compositionend', () => {
     setTimeout(() => {
       const text = cell.textContent;
       const cleaned = text.replace(/[a-z]+/g, '');
       cell.textContent = cleaned;
     }, 0);
   });
   ```

3. **Avoid editing directly in table cells**:
   - Use a modal or overlay when user needs to edit table cell content
   - Prevent IME composition in table cell altogether

## References

- [TipTap Issue #7186: IME Pinyin visible in table cells](https://github.com/ueberdosis/tiptap/issues/7186) - GitHub issue report
- [ProseMirror Discuss: IME composing problems in table cells](https://discuss.prosemirror.net/t/ime-composing-problems-on-td-or-th-element-in-safari-browser/4501) - Detailed discussion and workarounds
- [ProseMirror Issue #944: Duplicated characters in Safari with IME](https://github.com/ProseMirror/prosemirror/issues/944) - Related IME duplication issues
