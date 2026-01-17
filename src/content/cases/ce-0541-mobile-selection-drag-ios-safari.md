---
id: ce-0541-mobile-selection-drag-ios-safari
scenarioId: scenario-mobile-selection-drag-to-select
locale: en
os: iOS
osVersion: "16.0+"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "16.0+"
keyboard: Default (English)
caseTitle: Mobile drag-to-selection creates inconsistent ranges
description: "In iOS Safari, drag-to-selection creates selection ranges that don't match the visual selection. The visual selection shows text as selected, but the actual selection range may be empty or point to wrong position. This affects range-based operations like formatting, deletion, and extraction."
tags:
  - mobile
  - selection
  - touch
  - drag-to-select
  - ios
  - safari
  - range-api
  - inconsistent
status: draft
domSteps:
  - label: "Before"
    html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>'
    description: "Sample paragraph for selection testing"
  - label: "Start drag selection"
    html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>'
    description: "User starts dragging from 'ipsum' to 'adipiscing'"
  - label: "Visual selection vs Actual range"
    html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>'
    description: "Visual shows selected text, but range may be empty/wrong"
---

## Phenomenon

In iOS Safari, drag-to-selection creates selection ranges that don't match the visual selection. The visual selection highlights text correctly, but the actual selection range returned by `window.getSelection()` may be empty, collapsed, or point to a different position than what's visually selected.

## Reproduction example

1. Load a page with a `contenteditable` paragraph containing multiple lines of text in iOS Safari.
2. Start dragging to select text from the middle of a word to the middle of another word.
3. Check `window.getSelection().rangeCount` and `window.getSelection().getRangeAt(0)`.
4. Compare the range's start/end positions with the visual selection.
5. Try formatting the selection (e.g., bold) - it may not work or may format wrong text.

## Observed behavior

When dragging to select text on iOS Safari:

1. **Visual selection works**: Text appears highlighted correctly on screen
2. **Range may be empty**: `selection.rangeCount` may be 0 despite visual selection
3. **Range may be collapsed**: `selection.getRangeAt(0).collapsed` may be true despite visual selection
4. **Range may be wrong**: Range boundaries may not match visual selection boundaries
5. **Formatting fails**: Operations based on selection range may fail or affect wrong text
6. **Extraction fails**: Getting selected text may return empty string

### Specific patterns observed:

- **Mid-word selections**: Selecting from middle of one word to middle of another often creates empty ranges
- **Multi-line selections**: Selections spanning multiple lines frequently have incorrect range boundaries
- **Fast dragging**: Rapid drag gestures more likely to create range/visual mismatch
- **Zoom level issues**: At different zoom levels, the mismatch becomes more pronounced

## Expected behavior

- Selection ranges should always match visual selection
- `selection.rangeCount` should be 1 when text is visually selected
- `selection.getRangeAt(0).collapsed` should be false for non-empty selections
- Range boundaries should precisely match visual selection boundaries
- All range-based operations should work correctly with visual selections

## Impact

- **Broken formatting**: Bold, italic, underline operations may fail or affect wrong text
- **Broken extraction**: Getting selected text may return empty or wrong content
- **Broken replacement**: Replacing selected content may fail or replace wrong content
- **Broken deletion**: Deleting selected content may fail or delete wrong content
- **Inconsistent UX**: Users see selection but operations don't work as expected

## Browser Comparison

- **iOS Safari**: High frequency of range/visual selection mismatch
- **Android Chrome**: Generally correct behavior, rare mismatches
- **Desktop Safari**: Correct behavior, matches visual selection
- **Desktop Chrome/Edge**: Correct behavior, matches visual selection
- **Desktop Firefox**: Correct behavior, matches visual selection

## Workarounds

### 1. Touch position validation

```javascript
function getAccurateSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  
  const range = selection.getRangeAt(0);
  
  // Check if range is collapsed when it shouldn't be
  if (range.collapsed) {
    // Try to reconstruct range from touch coordinates
    const touch = lastTouch; // Store from touchend event
    if (touch) {
      const rangeFromTouch = document.caretRangeFromPoint(touch.clientX, touch.clientY);
      if (rangeFromTouch) {
        // Expand to visual selection using heuristics
        return expandToVisualSelection(rangeFromTouch, touch);
      }
    }
  }
  
  return range;
}
```

### 2. Visual selection detection

```javascript
function detectVisualSelection() {
  // Use getComputedStyle to check for user-select properties
  // and compare with actual selection ranges
  const elements = document.querySelectorAll('*');
  const selectedElements = [];
  
  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    const selection = window.getSelection();
    
    if (selection.containsNode(el, true)) {
      selectedElements.push(el);
    }
  });
  
  return selectedElements;
}
```

### 3. Debounced range checking

```javascript
let selectionTimer;

function handleTouchEnd(e) {
  clearTimeout(selectionTimer);
  
  selectionTimer = setTimeout(() => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0 && hasVisualSelection()) {
      // Recreate selection from visual state
      recreateSelectionFromVisual();
    }
  }, 100);
}
```

### 4. Fallback for iOS Safari

```javascript
const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                   /Safari/.test(navigator.userAgent) && 
                   !/Chrome/.test(navigator.userAgent);

function safeSelectionOperation(operation) {
  const selection = window.getSelection();
  
  if (isIOSSafari && selection.rangeCount === 0 && hasVisualSelection()) {
    // iOS Safari special handling
    return operation(getSelectionFromVisual());
  } else {
    return operation(selection);
  }
}
```

## Testing recommendations

1. **Multi-word selections**: Test selections spanning multiple words
2. **Cross-line selections**: Test selections spanning multiple lines
3. **Various speeds**: Test with different drag speeds
4. **Different zoom levels**: Test at various zoom levels
5. **Different text sizes**: Test with different font sizes
6. **Mixed content**: Test with inline elements, formatting, links

## Notes

- This is a long-standing iOS Safari issue
- Apple has not provided official API to resolve this
- Workarounds are heuristic and may not work in all cases
- The issue is more pronounced in complex layouts with CSS transforms
- Mobile browsers generally have less precise selection handling than desktop