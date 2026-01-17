---
id: scenario-gettargetranges-empty
title: getTargetRanges() returns empty array in beforeinput events
description: "The getTargetRanges() method in beforeinput events may return an empty array or undefined in various scenarios, including text prediction, certain IME compositions, or specific browser/device combinations. When getTargetRanges() is unavailable, developers must rely on window.getSelection() as a fallback, but this may be less accurate."
category: ime
tags:
  - getTargetRanges
  - beforeinput
  - targetRanges
  - selection
  - ime
  - composition
  - text-prediction
  - android
status: draft
locale: en
---

The `getTargetRanges()` method in `beforeinput` events may return an empty array or undefined in various scenarios, including text prediction, certain IME compositions, or specific browser/device combinations. When `getTargetRanges()` is unavailable, developers must rely on `window.getSelection()` as a fallback, but this may be less accurate.

## Problem Overview

According to the Input Events specification, `getTargetRanges()` should return an array of `StaticRange` objects representing the DOM ranges that will be affected by the input event. However, in practice, `getTargetRanges()` may return an empty array `[]` or the method may be `undefined` in certain scenarios.

## Observed Behavior

### Scenario 1: Text Prediction (Samsung Keyboard)

When text prediction is enabled on Samsung keyboard:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText') {
    const ranges = e.getTargetRanges?.() || [];
    // ranges is [] (empty array)
    // Cannot determine exact insertion position
  }
});
```

### Scenario 2: Certain IME Compositions

During some IME composition scenarios:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertCompositionText' || 
      e.inputType === 'insertFromComposition') {
    const ranges = e.getTargetRanges?.() || [];
    // ranges may be [] in some browser/IME combinations
  }
});
```

### Scenario 3: Chrome 77 Issue

In Chrome 77, `getTargetRanges()` was reported to consistently return empty arrays:

```javascript
element.addEventListener('beforeinput', (e) => {
  const ranges = e.getTargetRanges?.() || [];
  // In Chrome 77, ranges is always []
  // This was a known bug in that version
});
```

### Scenario 4: Method Not Available

In some browsers or older versions, the method may not exist:

```javascript
element.addEventListener('beforeinput', (e) => {
  if (typeof e.getTargetRanges !== 'function') {
    // Method doesn't exist
    // Must use window.getSelection() instead
  }
});
```

## Impact

- **Cannot determine exact insertion position**: Without `targetRanges`, developers cannot know exactly where text will be inserted
- **Must rely on window.getSelection()**: Fallback to `window.getSelection()` may be less accurate, especially when typing adjacent to formatted elements
- **Incorrect position tracking**: Text may be inserted at wrong locations
- **Link structure corruption**: When typing next to links, text may be inserted into the link instead of after it
- **Formatting issues**: Text may inherit wrong formatting when inserted at incorrect position

## Browser Comparison

- **Chrome 60+**: Generally supports `getTargetRanges()`, but may return empty arrays in certain scenarios (text prediction, some IMEs)
- **Chrome 77**: Known bug where `getTargetRanges()` consistently returned empty arrays
- **Firefox 87+**: Supports `getTargetRanges()`, but behavior may vary
- **Safari**: Supports `getTargetRanges()`, but may return empty arrays in some IME scenarios
- **Android Chrome**: Higher likelihood of empty arrays, especially with Samsung keyboard text prediction

## Workarounds

### 1. Always Check for Empty Arrays

```javascript
element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length === 0) {
    // Fallback to window.getSelection()
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).cloneRange();
      // Use range for processing
      handleInputWithRange(range, e);
    }
  } else {
    // Use targetRanges
    handleInputWithRange(targetRanges[0], e);
  }
});
```

### 2. Feature Detection

Check if `getTargetRanges()` is available and works:

```javascript
function isGetTargetRangesAvailable() {
  // Check if method exists
  if (typeof InputEvent.prototype.getTargetRanges !== 'function') {
    return false;
  }
  
  // Test if it works (may throw in some browsers)
  try {
    const testEvent = new InputEvent('beforeinput', {
      inputType: 'insertText',
      data: 'test'
    });
    const ranges = testEvent.getTargetRanges();
    return Array.isArray(ranges);
  } catch (e) {
    return false;
  }
}

const useGetTargetRanges = isGetTargetRangesAvailable();

element.addEventListener('beforeinput', (e) => {
  if (useGetTargetRanges) {
    const targetRanges = e.getTargetRanges?.() || [];
    if (targetRanges.length > 0) {
      // Use targetRanges
    } else {
      // Fallback
    }
  } else {
    // Always use window.getSelection()
  }
});
```

### 3. Normalize Selection When Using Fallback

When using `window.getSelection()` as fallback, normalize it to exclude formatted elements:

```javascript
element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  let range;
  if (targetRanges.length > 0) {
    // Convert StaticRange to Range
    const staticRange = targetRanges[0];
    range = document.createRange();
    range.setStart(staticRange.startContainer, staticRange.startOffset);
    range.setEnd(staticRange.endContainer, staticRange.endOffset);
  } else {
    // Fallback to window.getSelection()
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0).cloneRange();
      // Normalize to exclude formatted elements
      range = normalizeRangeForFormattedElements(range);
    }
  }
  
  if (range) {
    handleInputWithRange(range, e);
  }
});

function normalizeRangeForFormattedElements(range) {
  let container = range.startContainer;
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentElement;
  }
  
  // Check if inside formatted element
  const link = container.closest('a');
  const bold = container.closest('b, strong');
  const italic = container.closest('i, em');
  
  if (link && range.collapsed && range.startContainer === link) {
    // Move to after link
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

### 4. Store DOM State for Comparison

When `getTargetRanges()` is unavailable, store DOM state to compare later:

```javascript
let domState = null;

element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length === 0) {
    // Store DOM state for comparison
    domState = {
      html: element.innerHTML,
      text: element.textContent,
      selection: window.getSelection()?.getRangeAt(0)?.cloneRange()
    };
  }
});

element.addEventListener('input', (e) => {
  if (domState) {
    // Compare DOM state to understand actual change
    const domAfter = {
      html: element.innerHTML,
      text: element.textContent
    };
    
    const actualChange = compareDOM(domState, domAfter);
    handleActualChange(actualChange);
    
    domState = null;
  }
});
```

### 5. Detect Text Prediction and Handle Specially

Detect when text prediction is active and handle specially:

```javascript
function isTextPredictionActive(e) {
  // Heuristics to detect text prediction:
  // 1. insertCompositionText but getTargetRanges() is empty
  // 2. event.data contains full phrases
  // 3. isComposing is true but no actual composition started
  
  if (e.inputType === 'insertCompositionText') {
    const ranges = e.getTargetRanges?.() || [];
    if (ranges.length === 0 && e.data && e.data.length > 1) {
      return true;
    }
  }
  
  return false;
}

element.addEventListener('beforeinput', (e) => {
  const targetRanges = e.getTargetRanges?.() || [];
  
  if (targetRanges.length === 0) {
    if (isTextPredictionActive(e)) {
      // Special handling for text prediction
      handleTextPredictionInput(e);
    } else {
      // Fallback for other cases
      handleInputWithSelectionFallback(e);
    }
  } else {
    // Normal case: use targetRanges
    handleInputWithTargetRanges(targetRanges, e);
  }
});
```

## Best Practices

1. **Always check for empty arrays**: Don't assume `getTargetRanges()` always returns valid ranges
2. **Feature detection**: Check if `getTargetRanges()` is available before using it
3. **Normalize fallback selection**: When using `window.getSelection()`, normalize it to exclude formatted elements
4. **Store DOM state**: When `getTargetRanges()` is unavailable, store DOM state for comparison
5. **Handle gracefully**: Have fallback logic that doesn't depend on `getTargetRanges()`
6. **Test across browsers**: `getTargetRanges()` behavior varies significantly by browser and device
7. **Detect special cases**: Identify text prediction or other special scenarios that may cause empty arrays

## Related Cases

- `ce-0295`: insertCompositionText event and selection mismatch when typing next to a link with Samsung keyboard text prediction ON
- Chrome 77 bug where `getTargetRanges()` consistently returned empty arrays

## References

- [MDN: InputEvent.getTargetRanges()](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/getTargetRanges) - Official documentation
- [Stack Overflow: InputEvent.getTargetRanges always empty](https://stackoverflow.com/questions/58892747/inputevent-gettargetranges-always-empty) - Chrome 77 issue discussion
- [W3C Input Events Level 2 Specification](https://www.w3.org/TR/input-events-2/) - Official specification
- [W3C Input Events Level 1 Specification](https://www.w3.org/TR/2016/WD-input-events-20160928/) - Legacy specification
