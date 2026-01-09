---
id: ce-0215
scenarioId: scenario-ime-insertfromcomposition-targetranges
locale: en
os: iOS
osVersion: "17.0+"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0+"
keyboard: Japanese (IME)
caseTitle: insertFromComposition targetRanges are collapsed and need recalculation in iOS Safari
description: "In iOS Safari with Japanese/Kanji IME, insertFromComposition fires with collapsed targetRanges that do not accurately represent the insertion point. Recalculating ranges based on current selection is necessary to correctly position the composition text."
tags:
  - composition
  - ime
  - beforeinput
  - insertFromComposition
  - targetRanges
  - ios
  - safari
  - japanese
status: draft
domSteps:
  - label: "Before"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">日</span></p>'
    description: "Japanese composition in progress"
  - label: "beforeinput event"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">日</span></p>'
    description: "insertFromComposition fires with collapsed targetRanges (need recalculation)"
  - label: "After (Bug - not recalculated)"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">日</span>本</p>'
    description: "If ranges are not recalculated, text is inserted at wrong position"
  - label: "✅ Expected (recalculated)"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">日本</span></p>'
    description: "Recalculating based on current selection produces correct positioning"
---

## Phenomenon

In iOS Safari with Japanese/Kanji IME, `insertFromComposition` fires with collapsed `targetRanges` that do not accurately represent the insertion point. Recalculating ranges based on current selection is necessary to correctly position the composition text.

## Reproduction example

1. Focus a `contenteditable` element in iOS Safari (iPhone/iPad).
2. Activate Japanese IME.
3. Start composing Japanese/Kanji text (e.g., type "に" then "ほ" then "ん" to compose "日本").
4. Continue typing to update composition or convert to Kanji.
5. Observe `beforeinput` events with `inputType: 'insertFromComposition'`.
6. Check `getTargetRanges()` - they are collapsed (`startOffset === endOffset`) but do not represent the correct insertion point.
7. If handlers trust `targetRanges` as-is, text will be inserted at wrong position.
8. Recalculating based on current selection produces correct positioning.

## Observed behavior

When updating Japanese/Kanji composition text:

1. **beforeinput event**:
   - `inputType: 'insertFromComposition'`
   - `isComposing: true`
   - `data: '日本'` (the new composition text)
   - `getTargetRanges()` returns collapsed ranges (`startOffset === endOffset`)
   - The collapsed ranges do NOT accurately represent where the composition text should be inserted

2. **If ranges are trusted as-is**:
   - Text may be inserted at wrong location
   - Composition text may appear before or after the intended position
   - Composition updates may fail or produce incorrect results

3. **If ranges are recalculated**:
   - Using `window.getSelection()` to get current selection position
   - Recalculating insertion point based on current selection
   - Text is inserted at correct position
   - Composition updates work correctly

## Expected behavior

- `targetRanges` from `insertFromComposition` should accurately represent the insertion point
- If `targetRanges` are collapsed and inaccurate, recalculation should be possible
- Handlers should be able to use current selection to determine correct insertion point
- Composition text should be inserted at the correct position

## Impact

- **Incorrect positioning**: Handlers that trust collapsed `targetRanges` as-is will insert text at wrong positions
- **Composition breakage**: Composition updates may fail or produce incorrect results
- **Platform-specific bugs**: Code that works on Desktop Safari may fail on iOS Safari
- **IME-specific bugs**: Code that works with Korean IME may fail with Japanese/Kanji IME

## Browser Comparison

- **iOS Safari (Japanese/Kanji)**: `insertFromComposition` fires with collapsed `targetRanges` that need recalculation
- **Desktop Safari**: `insertFromComposition` fires with accurate collapsed `targetRanges` (trust as-is)
- **iOS Safari (Korean)**: `insertFromComposition` does NOT fire
- **Chrome/Edge**: Generally uses `insertCompositionText` instead of `insertFromComposition`
- **Firefox**: Behavior varies but generally more consistent with Chrome

## Notes and possible direction for workarounds

- **Recalculate collapsed ranges**: Recalculate based on current selection in iOS Safari:
  ```javascript
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertFromComposition') {
      const targetRanges = e.getTargetRanges?.() || [];
      if (targetRanges.length > 0) {
        const range = targetRanges[0];
        if (range.collapsed) {
          // Recalculate based on current selection
          const selection = window.getSelection();
          const currentRange = selection?.rangeCount ? selection.getRangeAt(0) : null;
          if (currentRange) {
            // Use currentRange instead of targetRanges
            handleCompositionInsertion(currentRange);
          }
        } else {
          // Use targetRanges as-is if not collapsed
          handleCompositionInsertion(range);
        }
      }
    }
  });
  ```

- **Platform and IME detection**: Detect iOS Safari with Japanese/Kanji IME:
  ```javascript
  const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isJapaneseIME = /* detect Japanese IME */;
  
  if (isIOSSafari && isJapaneseIME && e.inputType === 'insertFromComposition') {
    // Recalculate collapsed ranges
  }
  ```

- **Use current selection**: Always use `window.getSelection()` to get accurate position when `targetRanges` are collapsed
