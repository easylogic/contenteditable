---
id: scenario-rtl-text-direction-inconsistent
title: RTL text direction and selection behavior inconsistent in contenteditable
description: Right-to-left (RTL) and mixed-direction text in contenteditable causes caret misalignment, scroll failures, and select-all behavior that differs from LTR and from spec.
category: selection
tags:
  - rtl
  - bidi
  - selection
  - scroll
  - caret
status: draft
locale: en
---

## Problem Overview

When `contenteditable` contains RTL (Arabic, Hebrew) or mixed LTR/RTL text, browsers diverge in how they handle caret position, automatic scrolling, selection direction, and Ctrl+A (Select All). Editors that support RTL languages cannot rely on consistent behavior across Blink, WebKit, and Gecko.

## Observed Behavior

- **Scrolling**: In narrow containers with `overflow: auto`, the caret may move outside the visible area; `scrollLeft` is not updated correctly for the logical “end” of RTL text (visually left).
- **Caret placement**: The visual caret can appear several pixels away from the character it belongs to, or disappear when it falls into an incorrect scroll region.
- **Selection direction**: Selection expansion with Shift+Arrow or drag can invert or produce “jagged” ranges in mixed-direction content.
- **Select All**: When non-editable blocks are the first or last child, Ctrl+A may collapse selection in the wrong direction instead of selecting all content (see related scenario).

Code to observe scroll/caret in RTL:

```javascript
const editor = document.querySelector('[contenteditable="true"]');
editor.addEventListener('input', () => {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const containerRect = editor.getBoundingClientRect();
  // In RTL, logical end is on the left; scroll may not follow
  if (rect.left < containerRect.left) {
    editor.scrollLeft += (rect.left - containerRect.left) - 10;
  }
});
```

## Impact

- **RTL editors**: Users cannot see the insertion point in narrow panels or comment boxes.
- **State divergence**: Framework state (React/Vue) can desync from DOM when caret/selection is wrong.
- **Accessibility**: Screen readers and keyboard users depend on correct logical position.

## Browser Comparison

- **Chrome 124+ (Blink)**: Scrolling and caret placement regressions in RTL overflow; visual-to-logical mapping breaks.
- **Safari (WebKit)**: Generally better BiDi consistency; Select All with non-editable blocks still fails.
- **Firefox (Gecko)**: Most stable for RTL; correct mapping of visual offsets to logical indices.

## Solutions

1. **Manual scroll after input** (see code above): Use `getBoundingClientRect()` and adjust `scrollLeft` when the caret leaves the visible area.
2. **Set `dir` explicitly**: Use `dir="rtl"` (or `auto`) on the editable container and blocks so the engine computes BiDi correctly.
3. **Normalize selection after input**: After `input` or `selectionchange`, read `getRangeAt(0)` and optionally collapse to a known-good position if detection heuristics indicate misplacement.

## Best Practices

- Always set `dir` on the contenteditable root when supporting RTL.
- Do not assume `scrollLeft === 0` means “start” in RTL; logical start is on the right.
- Test Select All (Ctrl+A) with non-editable blocks at start/end; use a dedicated handler if needed.

## Related Cases

- [ce-0570](ce-0570-chromium-rtl-scroll-alignment-bug) – Chromium RTL scrolling and caret misalignment

## References

- [Chromium Issue: RTL scrolling broken in contenteditable](https://issues.chromium.org/issues/333630733)
- [W3C I18N: Structural markup and right-to-left text](https://www.w3.org/International/questions/qa-html-dir)
- [MDN: dir attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)
