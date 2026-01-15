---
id: ce-0296
scenarioId: scenario-beforeinput-input-selection-mismatch
locale: en
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy series)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Korean (IME) - Samsung Keyboard with Text Prediction ON
caseTitle: Selection mismatch between beforeinput and input events
description: "On Android Chrome with Samsung keyboard text prediction enabled, typing text next to a link causes the selection in beforeinput event to differ from the selection in input event. beforeinput's selection includes the link element, while input's selection points to the text node after the link."
tags:
  - selection
  - beforeinput
  - input
  - samsung-keyboard
  - text-prediction
  - link
  - android
  - chrome
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    <a href="https://example.com">Link text</a> Type here
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> </div>'
    description: "Cursor positioned after link"
  - label: "beforeinput event"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> </div>'
    description: "beforeinput: selection.startContainer is <a> element, selection includes link text"
  - label: "input event (Bug)"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> Hello</div>'
    description: "input: selection.startContainer is text node after link, different selection from beforeinput"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> Hello</div>'
    description: "Expected: beforeinput and input selections should match"
---

## Phenomenon

On Android Chrome with Samsung keyboard text prediction enabled, typing text next to a link in a `contenteditable` element causes the selection in `beforeinput` event to differ from the selection in `input` event.

## Reproduction example

1. Open Chrome browser on an Android device (Samsung Galaxy series, etc.).
2. Enable text prediction feature in Samsung keyboard.
3. Prepare HTML with an anchor link inside a `contenteditable` element (e.g., `<a href="https://example.com">Link text</a>`).
4. Position the cursor right next to (after) the anchor link.
5. Type text (e.g., "Hello").
6. Observe the selection in `beforeinput` and `input` events in the browser console.

## Observed behavior

When typing text next to a link:

1. **beforeinput event**:
   - `window.getSelection().getRangeAt(0).startContainer` may be the `<a>` element
   - Selection includes link text
   - `startOffset` and `endOffset` are in unexpected format

2. **input event**:
   - `window.getSelection().getRangeAt(0).startContainer` is the text node after the link
   - Selection reflects actual cursor position
   - Different container and offset from `beforeinput` selection

3. **Result**:
   - Selection information stored in `beforeinput` handler cannot be used in `input` handler
   - State synchronization issues occur
   - Position tracking is inaccurate

## Expected behavior

- Selections in `beforeinput` and `input` should match
- Both events should have the same container and offset
- Selection should not include link element but only reflect actual cursor position

## Impact

- **State synchronization issues**: Selection stored in `beforeinput` cannot be used in `input`
- **Incorrect position tracking**: Selection mismatch causes inaccurate position tracking
- **Undo/redo inconsistencies**: Undo/redo stacks may record incorrect positions

## Browser Comparison

- **Android Chrome + Samsung Keyboard (Text Prediction ON)**: This issue occurs
- **Android Chrome + Samsung Keyboard (Text Prediction OFF)**: Works normally
- **Android Chrome + Gboard**: Works normally
- **Other browsers**: Similar issues may occur with other IMEs or text prediction

## Notes and possible direction for workarounds

- **Selection normalization**: Normalize selections in both `beforeinput` and `input` for comparison
- **Store DOM state**: Store DOM state instead of selection for comparison
- **Use getTargetRanges()**: Use `getTargetRanges()` when available (but may also be empty array in this case)

## Code example

```javascript
const editor = document.querySelector('div[contenteditable]');
let beforeInputSelection = null;

editor.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0).cloneRange();
    
    // Normalize selection (exclude link)
    beforeInputSelection = normalizeSelectionForLink(range);
  }
});

editor.addEventListener('input', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0).cloneRange();
    const inputSelection = normalizeSelectionForLink(range);
    
    // Compare selections
    if (beforeInputSelection && !selectionsMatch(beforeInputSelection, inputSelection)) {
      console.warn('Selection mismatch detected');
      // Handle mismatch
    }
  }
  
  beforeInputSelection = null;
});

function normalizeSelectionForLink(range) {
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  const link = container.closest('a');
  if (link && range.startContainer === link) {
    // Adjust to position after link
    const normalized = document.createRange();
    try {
      normalized.setStartAfter(link);
      normalized.collapse(true);
      return normalized;
    } catch (e) {
      return range;
    }
  }
  
  return range.cloneRange();
}

function selectionsMatch(range1, range2) {
  if (!range1 || !range2) return false;
  
  return range1.startContainer === range2.startContainer &&
         range1.startOffset === range2.startOffset;
}
```
