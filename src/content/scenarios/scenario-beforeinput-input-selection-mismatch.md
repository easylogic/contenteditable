---
id: scenario-beforeinput-input-selection-mismatch
title: Selection mismatch between beforeinput and input events
description: "The selection (window.getSelection()) in beforeinput events can differ from the selection in corresponding input events. This mismatch can occur during IME composition, text prediction, or when typing adjacent to formatted elements like links. The selection in beforeinput may include adjacent formatted text, while input selection reflects the final cursor position."
category: ime
tags:
  - selection
  - beforeinput
  - input
  - ime
  - composition
  - text-prediction
  - link
  - formatting
status: draft
locale: en
---

The selection (`window.getSelection()`) in `beforeinput` events can differ from the selection in corresponding `input` events. This mismatch can occur during IME composition, text prediction, or when typing adjacent to formatted elements like links. The selection in `beforeinput` may include adjacent formatted text, while `input` selection reflects the final cursor position.

## Problem Overview

When handling input events in `contenteditable` elements, developers often assume that the selection in `beforeinput` matches the selection in `input`. However, this is not always the case:

1. **Selection in `beforeinput`**: May include adjacent formatted elements (links, bold, italic, etc.)
2. **Selection in `input`**: Reflects the final cursor position after DOM changes
3. **Mismatch**: The two selections can have different containers, offsets, or ranges

## Observed Behavior

### Scenario 1: Typing Next to Links

When typing text next to an anchor link:

```javascript
// HTML: <a href="...">Link text</a> [cursor here]

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  
  // beforeinput selection may include the link
  // range.startContainer might be the <a> element
  // range.startOffset and range.endOffset may include link text
});

element.addEventListener('input', (e) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  
  // input selection reflects final cursor position
  // range.startContainer is likely a text node after the link
  // range.startOffset is the position in that text node
});
```

### Scenario 2: During IME Composition

During IME composition, selections can differ:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // beforeinput selection shows where composition will be inserted
    // May include existing composition text
  }
});

element.addEventListener('input', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // input selection shows final cursor position after composition
    // Different from beforeinput selection
  }
});
```

### Scenario 3: Text Prediction (Samsung Keyboard)

With text prediction enabled, selections can be particularly inconsistent:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Selection may include adjacent link text
    // range.startContainer might be link element
    // range includes more than just the insertion point
  }
});

element.addEventListener('input', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Selection reflects actual cursor position
    // Different container and offset from beforeinput
  }
});
```

## Impact

- **Incorrect position tracking**: Handlers that rely on `beforeinput` selection may track wrong positions
- **State synchronization issues**: Application state based on `beforeinput` selection may not match DOM state
- **Link structure corruption**: When selection includes link text, text may be inserted into the link instead of after it
- **Undo/redo inconsistencies**: Undo/redo stacks may record incorrect positions
- **Formatting issues**: Text may inherit wrong formatting when inserted at incorrect position

## Browser Comparison

- **Chrome/Edge**: Generally consistent selections, but mismatches can occur with text prediction or IME
- **Firefox**: May have more frequent selection mismatches
- **Safari**: Selection behavior can be inconsistent, especially on iOS
- **Android Chrome**: Higher likelihood of mismatches, especially with Samsung keyboard text prediction

## Workarounds

### 1. Store and Compare Selections

```javascript
let beforeInputSelection = null;

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    beforeInputSelection = selection.getRangeAt(0).cloneRange();
  }
});

element.addEventListener('input', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const inputSelection = selection.getRangeAt(0).cloneRange();
    
    // Compare selections
    if (beforeInputSelection && !selectionsMatch(beforeInputSelection, inputSelection)) {
      console.warn('Selection mismatch detected');
      // Handle mismatch
      handleSelectionMismatch(beforeInputSelection, inputSelection);
    }
  }
  
  beforeInputSelection = null;
});

function selectionsMatch(range1, range2) {
  if (!range1 || !range2) return false;
  
  return range1.startContainer === range2.startContainer &&
         range1.startOffset === range2.startOffset &&
         range1.endContainer === range2.endContainer &&
         range1.endOffset === range2.endOffset;
}
```

### 2. Normalize Selections

Normalize selections to exclude formatted elements:

```javascript
function normalizeSelection(range) {
  if (!range) return null;
  
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  // Check if selection is inside a formatted element
  const link = container.closest('a');
  const bold = container.closest('b, strong');
  const italic = container.closest('i, em');
  
  // If selection is at the boundary of a formatted element, adjust
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
  
  // If selection is inside formatted element but at end, adjust
  if ((link || bold || italic) && range.collapsed) {
    const element = link || bold || italic;
    if (range.startOffset === element.textContent.length) {
      // At end of formatted element, move to after
      const normalized = document.createRange();
      try {
        normalized.setStartAfter(element);
        normalized.collapse(true);
        return normalized;
      } catch (e) {
        return range;
      }
    }
  }
  
  return range.cloneRange();
}

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const normalized = normalizeSelection(range);
    // Use normalized range for processing
  }
});
```

### 3. Use getTargetRanges() When Available

Prefer `getTargetRanges()` from `beforeinput` over `window.getSelection()`:

```javascript
element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length > 0) {
    // Use targetRanges - they're more accurate
    const range = targetRanges[0];
    // Process with targetRanges
  } else {
    // Fallback to window.getSelection() but normalize
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = normalizeSelection(selection.getRangeAt(0));
      // Process with normalized range
    }
  }
});
```

### 4. Compare DOM State

When selections don't match, compare DOM state to understand actual changes:

```javascript
let domState = null;

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  const range = selection && selection.rangeCount > 0 
    ? selection.getRangeAt(0).cloneRange() 
    : null;
  
  domState = {
    html: element.innerHTML,
    text: element.textContent,
    selection: range,
    selectionNormalized: normalizeSelection(range)
  };
});

element.addEventListener('input', (e) => {
  const selection = window.getSelection();
  const range = selection && selection.rangeCount > 0 
    ? selection.getRangeAt(0).cloneRange() 
    : null;
  
  const inputState = {
    html: element.innerHTML,
    text: element.textContent,
    selection: range,
    selectionNormalized: normalizeSelection(range)
  };
  
  // Compare selections
  if (domState && !selectionsMatch(
    domState.selectionNormalized, 
    inputState.selectionNormalized
  )) {
    // Selections don't match - use DOM comparison
    const actualChange = compareDOM(domState, inputState);
    handleActualChange(actualChange);
  }
  
  domState = null;
});
```

### 5. Handle Link-Adjacent Input Specifically

Special handling for typing next to links:

```javascript
function isAdjacentToLink(range) {
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  const link = container.closest('a');
  if (!link) return false;
  
  // Check if cursor is at boundary of link
  if (range.collapsed) {
    if (range.startContainer === link) {
      return true; // Cursor is inside link element
    }
    
    // Check if cursor is immediately after link
    const textNode = range.startContainer;
    if (textNode.nodeType === Node.TEXT_NODE) {
      const parent = textNode.parentElement;
      const linkSibling = link.nextSibling;
      if (linkSibling === parent || linkSibling === textNode) {
        return true;
      }
    }
  }
  
  return false;
}

element.addEventListener('beforeinput', (e) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    
    if (isAdjacentToLink(range)) {
      // Special handling for link-adjacent input
      const normalized = normalizeSelectionForLink(range);
      handleLinkAdjacentInput(normalized, e);
    }
  }
});

function normalizeSelectionForLink(range) {
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  const link = container.closest('a');
  if (link) {
    // Move selection to after link
    const normalized = document.createRange();
    try {
      // Find text node after link
      let afterLink = link.nextSibling;
      while (afterLink && afterLink.nodeType !== Node.TEXT_NODE) {
        afterLink = afterLink.nextSibling;
      }
      
      if (afterLink) {
        normalized.setStart(afterLink, 0);
      } else {
        // Create text node after link
        const textNode = document.createTextNode('');
        link.parentNode.insertBefore(textNode, link.nextSibling);
        normalized.setStart(textNode, 0);
      }
      normalized.collapse(true);
      return normalized;
    } catch (e) {
      return range;
    }
  }
  
  return range.cloneRange();
}
```

## Best Practices

1. **Don't assume selections match**: Always compare `beforeinput` and `input` selections
2. **Normalize selections**: Remove formatted elements from selection ranges when appropriate
3. **Prefer `getTargetRanges()`**: Use `getTargetRanges()` from `beforeinput` when available
4. **Store state**: Save selection state from `beforeinput` for use in `input` handler
5. **Compare DOM**: When selections don't match, compare DOM state to understand actual changes
6. **Handle edge cases**: Special handling for link-adjacent input and formatted elements
7. **Test across browsers**: Selection behavior varies significantly by browser and IME

## Related Cases

- `ce-0295`: insertCompositionText event and selection mismatch when typing next to a link with Samsung keyboard text prediction ON
- General selection issues in IME composition scenarios

## References

- MDN: Selection API - https://developer.mozilla.org/en-US/docs/Web/API/Selection
- MDN: Range API - https://developer.mozilla.org/en-US/docs/Web/API/Range
- W3C Input Events Specification - https://www.w3.org/TR/2016/WD-input-events-20160928/
