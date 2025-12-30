---
id: ce-0213
scenarioId: scenario-beforeinput-input-inputtype-mismatch
locale: en
os: iOS
osVersion: "17.0"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Korean (IME)
caseTitle: beforeinput fires with insertCompositionText but input fires with deleteContentBackward
description: "During IME composition, beforeinput may fire with inputType 'insertCompositionText' while the corresponding input event fires with 'deleteContentBackward'. This mismatch can occur in various browser/IME combinations, not limited to iOS Safari, and requires storing beforeinput's targetRanges to correctly understand the actual DOM change."
tags:
  - composition
  - ime
  - beforeinput
  - input
  - inputtype-mismatch
  - targetranges
  - ios
  - safari
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "Korean composition in progress"
  - label: "beforeinput event"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "beforeinput fires with inputType: 'insertCompositionText', data: '한글', targetRanges indicate insertion point"
  - label: "input event (Bug)"
    html: 'Hello '
    description: "input fires with inputType: 'deleteContentBackward' (mismatch!), composition text deleted instead of inserted"
  - label: "✅ Expected"
    html: 'Hello 한글'
    description: "Expected: Composition text '한글' inserted, inputType should match beforeinput"
---

## Phenomenon

During IME composition, `beforeinput` may fire with `inputType: 'insertCompositionText'` while the corresponding `input` event fires with `inputType: 'deleteContentBackward'`. This mismatch can occur in various browser/IME combinations, including but not limited to iOS Safari with Korean IME, Firefox with certain IMEs, and other mobile browsers. This mismatch makes it impossible to correctly understand the DOM change using only the `input` event's `inputType`.

## Reproduction example

1. Focus a `contenteditable` element.
2. Activate an IME (Korean, Japanese, Chinese, or other language).
3. Start composing text (e.g., for Korean: type "ㅎ" then "ㅏ" then "ㄴ" to compose "한").
4. Continue typing to update composition (e.g., for Korean: type "ㄱ" then "ㅡ" then "ㄹ" to update to "한글").
5. Observe `beforeinput` and `input` events in the browser console or event log.
6. Check if `beforeinput.inputType` matches `input.inputType` - they may differ.

## Observed behavior

When updating composition text:

1. **beforeinput event**:
   - `inputType: 'insertCompositionText'`
   - `isComposing: true`
   - `data: '한글'` (the new composition text)
   - `getTargetRanges()` returns ranges indicating where the composition text will be inserted
   - The ranges typically include the previous composition text that will be replaced

2. **input event**:
   - `inputType: 'deleteContentBackward'` (mismatch!)
   - `data: null` or empty
   - The actual DOM change may be a deletion rather than the insertion indicated by `beforeinput`
   - The composition text may be deleted instead of updated

3. **Result**:
   - Handlers that rely on `inputType` to determine what happened will misinterpret the change
   - The `targetRanges` from `beforeinput` are lost and not available in `input`
   - Application state may become inconsistent with DOM state

## Expected behavior

- The `input` event's `inputType` should match the `beforeinput` event's `inputType`
- If `beforeinput` fires with `insertCompositionText`, `input` should also have `insertCompositionText`
- The `input.data` should match `beforeinput.data` (or reflect the actual committed text)
- The DOM change should match what was indicated in `beforeinput`

## Impact

This can lead to:

- **Incorrect DOM change detection**: Handlers think a deletion occurred when it was actually an insertion
- **Lost targetRanges context**: The `targetRanges` from `beforeinput` are crucial but not available in `input`
- **Incorrect undo/redo**: Undo/redo stacks record the wrong operation type
- **State synchronization issues**: Application state becomes inconsistent
- **Event handler failures**: Handlers expecting matching `inputType` values fail

## Browser Comparison

- **iOS Safari**: Frequently fires `insertCompositionText` in `beforeinput` but `deleteContentBackward` in `input`, especially with Korean and Japanese IME
- **macOS Safari**: May exhibit similar mismatches, particularly with certain IME combinations
- **Firefox**: May have mismatches in certain IME scenarios, especially on mobile devices
- **Chrome/Edge**: Generally consistent `inputType` between events, but may have edge cases
- **Android Chrome**: Higher likelihood of mismatches due to text prediction and IME variations
- **Mobile browsers**: Generally higher likelihood of mismatches across different IMEs

## Notes and possible direction for workarounds

- **Store targetRanges from beforeinput**: Save `targetRanges` for use in `input` handler:
  ```javascript
  let lastBeforeInputTargetRanges = null;
  let lastBeforeInputType = null;
  
  element.addEventListener('beforeinput', (e) => {
    lastBeforeInputTargetRanges = e.getTargetRanges?.() || [];
    lastBeforeInputType = e.inputType;
  });
  
  element.addEventListener('input', (e) => {
    if (lastBeforeInputType && e.inputType !== lastBeforeInputType) {
      // Mismatch detected - use targetRanges to understand actual change
      if (lastBeforeInputTargetRanges && lastBeforeInputTargetRanges.length > 0) {
        // Process based on targetRanges rather than inputType
        handleActualChange(lastBeforeInputTargetRanges, e);
      }
    }
    lastBeforeInputTargetRanges = null;
    lastBeforeInputType = null;
  });
  ```

- **Compare DOM state**: When mismatch occurs, compare DOM before and after to understand actual change:
  ```javascript
  let domBefore = null;
  
  element.addEventListener('beforeinput', (e) => {
    domBefore = element.innerHTML;
  });
  
  element.addEventListener('input', (e) => {
    const domAfter = element.innerHTML;
    if (lastBeforeInputType && e.inputType !== lastBeforeInputType) {
      // Compare domBefore and domAfter to understand actual change
      const actualChange = compareDOM(domBefore, domAfter);
      handleChange(actualChange);
    }
    domBefore = null;
  });
  ```

- **Don't rely solely on inputType**: Always verify with DOM inspection when handling composition events
- **Handle gracefully**: Have fallback logic that doesn't depend on `inputType` matching
