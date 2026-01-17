---
id: scenario-insertparagraph-preventdefault-composition-broken
title: insertParagraph preventDefault breaks IME composition state in Safari
description: "In Safari desktop, when preventDefault() is called on keydown or beforeinput events for insertParagraph (Enter key), the IME composition state becomes corrupted. Subsequent text input fails to trigger proper input events, causing characters to not be inserted or composition to malfunction."
tags:
  - safari
  - webkit
  - insertparagraph
  - preventdefault
  - ime
  - composition
  - keydown
  - beforeinput
  - input-event
category: ime
status: draft
locale: en
---

## Overview

In Safari desktop, when a developer intercepts the `insertParagraph` action (typically triggered by pressing Enter) by calling `preventDefault()` in either the `keydown` or `beforeinput` event handler, the browser's internal IME (Input Method Editor) composition state becomes corrupted. After this occurs, subsequent text input using IME (Korean, Japanese, Chinese, etc.) fails to work correctly. The `input` event may not fire properly, characters may not be inserted, or the composition state may remain in an inconsistent state.

## Impact

- **IME Input Failure**: After preventing insertParagraph, IME input stops working correctly
- **Missing Input Events**: The `input` event may not fire for subsequent IME input
- **Composition State Corruption**: IME composition state becomes inconsistent
- **Character Loss**: Typed characters may not appear in the contenteditable element
- **User Experience Degradation**: Users cannot continue typing after Enter is prevented

## Technical Details

The issue occurs when:

1. User is typing with IME (Korean, Japanese, Chinese, etc.) in a contenteditable element
2. User presses Enter key, which triggers `insertParagraph`
3. Developer calls `preventDefault()` in `keydown` or `beforeinput` event handler to prevent the paragraph insertion
4. Safari suppresses the default paragraph insertion behavior
5. However, Safari's internal IME composition state management becomes corrupted
6. Subsequent IME input fails to trigger proper `input` events or insert characters correctly

### Event Sequence

The problematic sequence:
1. `keydown` (Enter key) - if `preventDefault()` is called here
2. `beforeinput` (inputType: "insertParagraph") - if `preventDefault()` is called here
3. IME composition state becomes corrupted
4. Next IME input attempt:
   - `compositionstart` may not fire
   - `compositionupdate` may not fire
   - `input` event may not fire
   - Characters may not be inserted

## Browser Comparison

- **Safari (Desktop)**: This issue occurs. Preventing insertParagraph breaks subsequent IME input
- **Chrome**: May have different behavior, needs verification
- **Firefox**: May have different behavior, needs verification
- **Edge**: May have different behavior, needs verification

## Root Cause Analysis

According to research and WebKit bug reports:

1. **Composition Event Overlap**: When Enter is pressed during or after IME composition, Safari needs to handle both the paragraph insertion and composition state transitions. Preventing the paragraph insertion disrupts this coordination.

2. **Internal State Mismatch**: Safari's internal IME state tracking becomes out of sync with the actual DOM state when `insertParagraph` is prevented, especially if there are formatting wrappers or empty nodes.

3. **Event Ordering Issues**: WebKit has known issues with event ordering around composition, where `keydown` that ends a composition session may fire after `compositionend`, or have incorrect `isComposing` values.

4. **Non-cancelable Composition Events**: Composition-related input events (`insertCompositionText`) are not cancelable per spec, but canceling `insertParagraph` may interfere with the composition lifecycle.

## Workarounds

### 1. Check Composition State Before Preventing

Only prevent `insertParagraph` when not composing:

```javascript
editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph') {
    // Only prevent if not currently composing
    if (!e.isComposing) {
      e.preventDefault();
      // Custom paragraph insertion logic
    }
    // If composing, allow default behavior to maintain IME state
  }
});
```

### 2. Handle Enter in keydown with Composition Check

```javascript
editor.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault();
    // Custom paragraph insertion
  }
  // If isComposing is true, let the default behavior proceed
});
```

### 3. Defer Custom Behavior Until After Composition

```javascript
let isComposing = false;

editor.addEventListener('compositionstart', () => {
  isComposing = true;
});

editor.addEventListener('compositionend', () => {
  isComposing = false;
});

editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph' && isComposing) {
    // Don't prevent during composition
    return;
  }
  if (e.inputType === 'insertParagraph') {
    e.preventDefault();
    // Custom logic
  }
});
```

### 4. Manual IME State Reset (Advanced)

If composition state is already corrupted, attempt to reset it:

```javascript
function resetIMEState(editor) {
  // Blur and refocus to reset IME state
  editor.blur();
  setTimeout(() => {
    editor.focus();
    // Clear any lingering composition state
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      selection.removeAllRanges();
      selection.addRange(selection.rangeCount === 0 ? 
        document.createRange() : selection.getRangeAt(0));
    }
  }, 0);
}
```

## Related Cases

- Case IDs will be added as cases are created for specific environment combinations

## References

- [W3C Input Events Level 2 Specification](https://www.w3.org/TR/input-events-2/) - Official specification for insertParagraph inputType
- [WebKit Blog: Enhanced Editing with Input Events](https://webkit.org/blog/7358/enhanced-editing-with-input-events/) - WebKit's implementation details for beforeinput events
- [ProseMirror Issue #944: Duplicated characters in Safari with IME](https://github.com/ProseMirror/prosemirror/issues/944) - Related issue about IME composition state corruption in Safari
- [WebKit Bug 269922: Add API to programmatically manipulate text composition](https://bugs.webkit.org/show_bug.cgi?id=269922) - Request for better composition state control
- [WebKit Bug 67763: Crashes in WebCore::InsertNodeBeforeCommand constructor](https://bugs.webkit.org/show_bug.cgi?id=67763) - InsertParagraph command crash issues
- [WebKit Mailing List: Caret/Predictive Text Bar out of sync](https://lists.webkit.org/pipermail/webkit-unassigned/2023-December/1135698.html) - Selection changes during composition
- [ProseMirror Discuss: IME composing problems in table cells](https://discuss.prosemirror.net/t/ime-composing-problems-on-td-or-th-element-in-safari-browser/4501) - Safari IME composition issues
