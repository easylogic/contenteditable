---
id: scenario-select-all-non-editable-block
title: Select All (Ctrl+A) collapses wrong way when non-editable block is first or last child
description: When a contenteditable element has a non-editable block as its first or last child, Ctrl+A (Select All) collapses the selection in the wrong direction instead of selecting all content, breaking WYSIWYG expectations.
category: selection
tags:
  - selection
  - select-all
  - non-editable
  - ctrl-a
  - wysiwyg
status: draft
locale: en
---

## Problem Overview

In contenteditable regions that contain non-editable block elements (e.g. embedded widgets, images, or blocks with `contenteditable="false"`), pressing Ctrl+A (or Cmd+A) is expected to select all content. In Safari, Chrome, and Opera, when the non-editable block is the **first** or **last** child of the contenteditable root, the selection collapses in the opposite direction from that block instead of selecting the entire content. This makes "Select All" unreliable in WYSIWYG editors that mix editable text with non-editable blocks.

## Observed Behavior

- **Setup**: A contenteditable container has at least one block-level child with `contenteditable="false"` (or equivalent) at the start or end.
- **Action**: User presses Ctrl+A (Select All).
- **Expected**: Entire content, including the non-editable block(s), is selected.
- **Actual**: Selection collapses toward the editable side of the non-editable block; the non-editable block and possibly other content are not included in the range.

Example structure:

```html
<div contenteditable="true">
  <div contenteditable="false">[Embedded widget]</div>
  <p>Editable paragraph one.</p>
  <p>Editable paragraph two.</p>
</div>
```

With cursor in the second paragraph, Ctrl+A may select only the two paragraphs and leave the first child (the widget) out, or collapse to a single point instead of a full range.

## Impact

- **WYSIWYG editors**: "Select All" then Delete/Copy does not cover the whole document.
- **Accessibility**: Keyboard-only users cannot reliably select all content to replace or copy.
- **Consistency**: Behavior differs from native text fields and from user expectation.

## Browser Comparison

- **Safari**: Reproduced; still present in Safari 15.5 (2022). Selection collapses in the wrong direction relative to the non-editable block.
- **Chrome / Opera**: Same class of bug; select-all with non-editable first/last child fails.
- **Firefox**: May behave differently; full matrix per version is recommended.

## Solutions

1. **Custom Ctrl+A handler**: Listen for `keydown` (Ctrl+A), prevent default, and programmatically select the entire contenteditable root (e.g. `range.selectNodeContents(editor)`), then `selection.removeAllRanges(); selection.addRange(range)`.
2. **Normalize structure**: Avoid having the only non-editable block as the very first or last child; wrap with an editable block or use a placeholder so the engine’s select-all path includes all nodes.
3. **Fallback for selection range**: After Ctrl+A, check whether the selection covers the full root; if not, run the programmatic select-all logic above.

Example programmatic select-all:

```javascript
editor.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
    e.preventDefault();
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    sel.removeAllRanges();
    sel.addRange(range);
  }
});
```

## Best Practices

- Do not rely on native Ctrl+A when the document has non-editable blocks at the boundaries.
- Implement a keyboard handler for Ctrl+A that explicitly selects the root contents when the editor has mixed editable/non-editable structure.
- Test Select All with non-editable first child, non-editable last child, and both.

## Related Cases

- [ce-0583](ce-0583-select-all-non-editable-block-first-last-child) – Select All fails when non-editable block is first or last child (Safari/Chrome)

## References

- [WebKit Bug 124765: Select all is broken when non-editable block is first/last child](https://bugs.webkit.org/show_bug.cgi?id=124765)
- [MDN: KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
- [Selection API: selectNodeContents](https://developer.mozilla.org/en-US/docs/Web/API/Range/selectNodeContents)
