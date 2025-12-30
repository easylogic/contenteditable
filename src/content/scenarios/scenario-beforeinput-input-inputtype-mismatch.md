---
id: scenario-beforeinput-input-inputtype-mismatch
title: beforeinput and input events have different inputType values
description: "During IME composition or in certain browser/IME combinations, the beforeinput event may have a different inputType than the corresponding input event. For example, beforeinput may fire with insertCompositionText while input fires with deleteContentBackward. This mismatch can cause handlers to misinterpret the actual DOM change and requires storing beforeinput's targetRanges for use in input event handling."
category: ime
tags:
  - ime
  - composition
  - beforeinput
  - input
  - inputtype-mismatch
  - targetranges
status: draft
locale: en
---

During IME composition or in certain browser/IME combinations, the `beforeinput` event may have a different `inputType` than the corresponding `input` event. This mismatch can cause handlers to misinterpret the actual DOM change and requires storing `beforeinput`'s `targetRanges` for use in `input` event handling.

## Observed Behavior

When composing text with an IME, the following mismatch can occur:

1. **beforeinput event** fires with `inputType: 'insertCompositionText'`
   - `e.isComposing === true`
   - `e.getTargetRanges()` returns ranges indicating where composition text will be inserted
   - `e.data` contains the composition text

2. **input event** fires with `inputType: 'deleteContentBackward'` (or other different type)
   - The actual DOM change may be a deletion rather than insertion
   - The `inputType` doesn't match what was indicated in `beforeinput`
   - `e.data` may be `null` or different from `beforeinput.data`

## Impact

- **Misinterpretation of DOM changes**: Handlers that rely on `inputType` to determine what happened will get incorrect information
- **Lost context**: The `targetRanges` from `beforeinput` are crucial for understanding what actually changed, but they're not available in `input` events
- **Incorrect undo/redo**: Undo/redo stacks may record the wrong operation type
- **State synchronization issues**: Application state may become inconsistent with DOM state
- **Event handler logic errors**: Handlers expecting matching `inputType` values will fail

## Browser Comparison

- **Chrome/Edge**: Generally consistent `inputType` between `beforeinput` and `input` during composition
- **Firefox**: May have mismatches in certain IME scenarios
- **Safari**: More likely to have `inputType` mismatches, especially on iOS
- **Mobile browsers**: Higher likelihood of mismatches due to text prediction and IME variations

## Workaround

Store `targetRanges` from `beforeinput` events and use them in `input` event handlers:

```javascript
let lastBeforeInputTargetRanges = null;
let lastBeforeInputType = null;
let lastBeforeInputData = null;

element.addEventListener('beforeinput', (e) => {
  // Store targetRanges, inputType, and data for use in input handler
  lastBeforeInputTargetRanges = e.getTargetRanges?.() || [];
  lastBeforeInputType = e.inputType;
  lastBeforeInputData = e.data;
  
  // Handle beforeinput normally
  if (e.inputType === 'insertCompositionText') {
    // Prepare for composition text insertion
  }
});

element.addEventListener('input', (e) => {
  // Check for inputType mismatch
  if (lastBeforeInputType && e.inputType !== lastBeforeInputType) {
    console.warn('inputType mismatch:', {
      beforeinput: lastBeforeInputType,
      input: e.inputType,
      beforeinputData: lastBeforeInputData,
      inputData: e.data
    });
    
    // Use targetRanges from beforeinput to understand actual change
    if (lastBeforeInputTargetRanges && lastBeforeInputTargetRanges.length > 0) {
      // The targetRanges indicate what was actually changed
      // Process based on targetRanges rather than inputType
      handleActualChange(lastBeforeInputTargetRanges, e);
    }
  } else {
    // Normal case: inputType matches
    handleInput(e);
  }
  
  // Clear stored values after processing
  lastBeforeInputTargetRanges = null;
  lastBeforeInputType = null;
  lastBeforeInputData = null;
});

function handleActualChange(targetRanges, inputEvent) {
  // Reconstruct what actually happened using targetRanges
  for (const range of targetRanges) {
    // Convert StaticRange to Range for inspection
    const actualRange = document.createRange();
    actualRange.setStart(range.startContainer, range.startOffset);
    actualRange.setEnd(range.endContainer, range.endOffset);
    
    // Check what's in the range now vs what was there before
    // This tells you the actual change regardless of inputType
  }
}
```

**Important Notes**:

- `targetRanges` are only available in `beforeinput` events, not in `input` events
- `targetRanges` are `StaticRange` objects that may become invalid after DOM changes
- Always check if ranges are still valid before using them
- Consider comparing DOM state before and after to understand actual changes
- Don't rely solely on `inputType` - always verify with DOM inspection

## Best Practices

1. **Always store targetRanges**: Save `targetRanges` from `beforeinput` for use in `input` handlers
2. **Compare inputType values**: Check if `beforeinput.inputType` matches `input.inputType`
3. **Inspect DOM directly**: When mismatch occurs, inspect DOM state to understand actual change
4. **Handle gracefully**: Don't assume `inputType` is always correct - have fallback logic
5. **Test across browsers**: This issue varies significantly by browser and IME combination
