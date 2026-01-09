---
id: ce-0214
scenarioId: scenario-ime-insertfromcomposition-targetranges
locale: en
os: macOS
osVersion: "14.0+"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0+"
keyboard: Korean (IME)
caseTitle: insertFromComposition targetRanges should be trusted even when collapsed in Desktop Safari
description: "In Desktop Safari with Korean IME, insertFromComposition fires with targetRanges that may be collapsed but accurately represent the insertion point. Recalculating ranges based on current selection causes incorrect positioning. The targetRanges should be trusted as-is."
tags:
  - composition
  - ime
  - beforeinput
  - insertFromComposition
  - targetRanges
  - desktop
  - safari
  - korean
status: draft
domSteps:
  - label: "Before"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p>'
    description: "Korean composition in progress"
  - label: "beforeinput event"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p>'
    description: "insertFromComposition fires with collapsed targetRanges (accurate insertion point)"
  - label: "After (Bug - recalculated)"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한글</span>글</p>'
    description: "If ranges are recalculated, text is inserted at wrong position"
  - label: "✅ Expected (trust targetRanges)"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한글</span></p>'
    description: "Trusting targetRanges as-is produces correct positioning"
---

## Phenomenon

In Desktop Safari with Korean IME, `insertFromComposition` fires with `targetRanges` that may be collapsed but accurately represent the insertion point. Recalculating ranges based on current selection causes incorrect positioning. The `targetRanges` should be trusted as-is, even when collapsed.

## Reproduction example

1. Focus a `contenteditable` element in Desktop Safari (macOS).
2. Activate Korean IME.
3. Start composing Korean text (e.g., type "ㅎ" then "ㅏ" then "ㄴ" to compose "한").
4. Continue typing to update composition (e.g., type "ㄱ" then "ㅡ" then "ㄹ" to update to "한글").
5. Observe `beforeinput` events with `inputType: 'insertFromComposition'`.
6. Check `getTargetRanges()` - they may be collapsed but represent the correct insertion point.
7. If handlers recalculate ranges based on current selection, text will be inserted at wrong position.

## Observed behavior

When updating Korean composition text:

1. **beforeinput event**:
   - `inputType: 'insertFromComposition'`
   - `isComposing: true`
   - `data: '한글'` (the new composition text)
   - `getTargetRanges()` returns ranges that may be collapsed (`startOffset === endOffset`)
   - The collapsed ranges accurately represent where the composition text should be inserted

2. **If ranges are recalculated**:
   - Handlers that recalculate based on `window.getSelection()` get incorrect position
   - Text may be inserted at wrong location (e.g., duplicated or misplaced)
   - Composition text may appear in unexpected positions

3. **If ranges are trusted as-is**:
   - Text is inserted at correct position
   - Composition updates work correctly
   - No positioning issues occur

## Expected behavior

- `targetRanges` from `insertFromComposition` should be trusted as-is, even when collapsed
- Recalculating ranges based on current selection should NOT be necessary
- The collapsed `targetRanges` accurately represent the insertion point
- Handlers should use `targetRanges` directly without modification

## Impact

- **Incorrect positioning**: Handlers that recalculate collapsed `targetRanges` will insert text at wrong positions
- **Duplicated text**: Text may be inserted multiple times or in wrong locations
- **Composition breakage**: Composition updates may fail or produce incorrect results
- **Platform-specific bugs**: Code that works on other browsers may fail on Desktop Safari

## Browser Comparison

- **Desktop Safari**: `insertFromComposition` fires with accurate collapsed `targetRanges` (trust as-is)
- **iOS Safari (Japanese/Kanji)**: `insertFromComposition` fires with collapsed `targetRanges` that need recalculation
- **iOS Safari (Korean)**: `insertFromComposition` does NOT fire
- **Chrome/Edge**: Generally uses `insertCompositionText` instead of `insertFromComposition`
- **Firefox**: Behavior varies but generally more consistent with Chrome

## Notes and possible direction for workarounds

- **Trust targetRanges as-is**: Do not recalculate collapsed `targetRanges` in Desktop Safari:
  ```javascript
  element.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'insertFromComposition') {
      const targetRanges = e.getTargetRanges?.() || [];
      if (targetRanges.length > 0) {
        // Trust targetRanges even if collapsed
        // Do NOT recalculate based on current selection
        const range = targetRanges[0];
        // Use range.startContainer and range.startOffset directly
        handleCompositionInsertion(range);
      }
    }
  });
  ```

- **Platform detection**: Detect Desktop Safari vs iOS Safari to apply correct strategy:
  ```javascript
  const isDesktopSafari = /Macintosh/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  if (isDesktopSafari && e.inputType === 'insertFromComposition') {
    // Trust targetRanges as-is
  }
  ```

- **Avoid selection-based recalculation**: Do not use `window.getSelection()` to recalculate ranges in Desktop Safari
