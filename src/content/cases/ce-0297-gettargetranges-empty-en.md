---
id: ce-0297
scenarioId: scenario-gettargetranges-empty
locale: en
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy series)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Korean (IME) - Samsung Keyboard with Text Prediction ON
caseTitle: beforeinput.getTargetRanges() returns empty array with Samsung keyboard text prediction ON
description: "On Android Chrome with Samsung keyboard text prediction enabled, typing text next to a link causes beforeinput event's getTargetRanges() to return an empty array. This makes it impossible to determine the exact text insertion position, requiring fallback to window.getSelection() which may be less accurate."
tags:
  - getTargetRanges
  - beforeinput
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
  - label: "beforeinput event (Bug)"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> </div>'
    description: "beforeinput: getTargetRanges() returns [] (empty array), cannot determine exact insertion position"
  - label: "input event"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> Hello</div>'
    description: "input: Text is inserted but accurate position tracking is difficult"
  - label: "✅ Expected"
    html: '<div contenteditable="true"><a href="https://example.com">Link text</a> Hello</div>'
    description: "Expected: getTargetRanges() should return ranges indicating exact insertion position"
---

## Phenomenon

On Android Chrome with Samsung keyboard text prediction enabled, typing text next to a link in a `contenteditable` element causes `beforeinput` event's `getTargetRanges()` to return an empty array.

## Reproduction example

1. Open Chrome browser on an Android device (Samsung Galaxy series, etc.).
2. Enable text prediction feature in Samsung keyboard.
3. Prepare HTML with an anchor link inside a `contenteditable` element (e.g., `<a href="https://example.com">Link text</a>`).
4. Position the cursor right next to (after) the anchor link.
5. Type text (e.g., "Hello").
6. Check `beforeinput.getTargetRanges()` in the browser console.

## Observed behavior

When typing text next to a link:

1. **beforeinput event**:
   - `e.getTargetRanges()` returns `[]` (empty array)
   - Or `e.getTargetRanges` may be `undefined`
   - Cannot determine exact text insertion position

2. **Fallback required**:
   - Must use `window.getSelection()` but it may be less accurate
   - `window.getSelection()` may include link element

3. **Result**:
   - Difficult to determine exact insertion position
   - Text may be inserted at wrong location
   - Link structure may be corrupted

## Expected behavior

- `getTargetRanges()` should return an array of `StaticRange` objects indicating exact insertion position
- Should provide valid range information, not empty array
- Should return accurate position even when typing next to links

## Impact

- **Cannot determine exact position**: Without `getTargetRanges()`, cannot know exact insertion position
- **Inaccurate fallback**: Must rely on `window.getSelection()` which is less accurate
- **Incorrect insertion position**: Text may be inserted at wrong location
- **Link structure corruption**: Text may be inserted into link instead of after it

## Browser Comparison

- **Android Chrome + Samsung Keyboard (Text Prediction ON)**: This issue occurs
- **Android Chrome + Samsung Keyboard (Text Prediction OFF)**: Works normally
- **Android Chrome + Gboard**: Works normally
- **Chrome 77**: Known bug where `getTargetRanges()` always returned empty array

## Notes and possible direction for workarounds

- **Check for empty array**: Always check if `getTargetRanges()` returns empty array
- **window.getSelection() fallback**: Use `window.getSelection()` when empty array
- **Normalize selection**: Normalize selection when using fallback to exclude link
- **Store DOM state**: Store DOM state when `getTargetRanges()` is unavailable for comparison

## Code example

```javascript
const editor = document.querySelector('div[contenteditable]');

editor.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length === 0) {
    // getTargetRanges() is empty array - use fallback
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).cloneRange();
      
      // Normalize selection (exclude link)
      const normalized = normalizeRangeForLink(range);
      
      // Process with normalized range
      handleInputWithRange(normalized, e);
    }
  } else {
    // getTargetRanges() available
    const staticRange = targetRanges[0];
    // Convert StaticRange to Range for use
    const range = document.createRange();
    range.setStart(staticRange.startContainer, staticRange.startOffset);
    range.setEnd(staticRange.endContainer, staticRange.endOffset);
    
    handleInputWithRange(range, e);
  }
});

function normalizeRangeForLink(range) {
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
  
  return range;
}
```
