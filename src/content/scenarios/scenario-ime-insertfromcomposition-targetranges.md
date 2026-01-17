---
id: scenario-ime-insertfromcomposition-targetranges
title: insertFromComposition targetRanges behavior differs across Safari platforms
description: "The insertFromComposition inputType fires with different targetRanges behavior in Desktop Safari vs iOS Safari, requiring different handling strategies. Desktop Safari provides accurate targetRanges even when collapsed, while iOS Safari may provide collapsed ranges that need recalculation. Additionally, iOS Safari Korean IME does not fire insertFromComposition at all."
category: ime
tags:
  - ime
  - composition
  - beforeinput
  - insertFromComposition
  - targetRanges
  - safari
status: draft
locale: en
---

The `insertFromComposition` inputType fires with different `targetRanges` behavior across Safari platforms, requiring platform-specific handling strategies.

## Platform-Specific Behavior

### Desktop Safari
- `insertFromComposition` fires during composition updates for various IMEs including Korean
- `targetRanges` are accurate and should be trusted even when collapsed
- Recalculating ranges based on current selection can cause incorrect positioning
- This applies to Korean IME and other IMEs

### iOS Safari - Japanese/Kanji IME
- `insertFromComposition` fires during Japanese/Kanji composition
- `targetRanges` may be collapsed, requiring recalculation based on current selection
- Recalculation is necessary to correctly position the composition text

### iOS Safari - Korean IME
- `insertFromComposition` does NOT fire at all
- Composition events (`compositionstart`, `compositionupdate`, `compositionend`) do not fire
- Instead, always uses `deleteContentBackward` followed by `insertText` pattern
- This is likely due to iOS Safari using its own input model for Korean IME

## Observed Behavior

### Desktop Safari with Korean IME
1. User types Korean characters during composition
2. `beforeinput` fires with `inputType: 'insertFromComposition'`
3. `targetRanges` may be collapsed but accurately represent the insertion point
4. Recalculating based on current selection causes incorrect positioning
5. Trusting `targetRanges` as-is produces correct behavior

### iOS Safari with Japanese/Kanji IME
1. User types Japanese/Kanji characters during composition
2. `beforeinput` fires with `inputType: 'insertFromComposition'`
3. `targetRanges` are collapsed (startOffset === endOffset)
4. Recalculating based on current selection is necessary
5. Without recalculation, composition text may be inserted at wrong position

### iOS Safari with Korean IME
1. User types Korean characters
2. No `insertFromComposition` events fire
3. No composition events fire
4. Instead, `deleteContentBackward` followed by `insertText` pattern occurs
5. This is a fundamentally different input model

## Impact

- **Incorrect range handling**: Desktop Safari handlers that recalculate collapsed `targetRanges` will position text incorrectly
- **Missing recalculation**: iOS Safari Japanese/Kanji handlers that don't recalculate collapsed `targetRanges` will position text incorrectly
- **Missing event handlers**: iOS Safari Korean handlers expecting `insertFromComposition` will never receive these events
- **Platform-specific code required**: Different handling logic needed for Desktop Safari vs iOS Safari
- **IME-specific code required**: Different handling logic needed for Korean vs Japanese/Kanji on iOS Safari

## Browser Comparison

- **Desktop Safari**: `insertFromComposition` fires with accurate `targetRanges` (trust as-is, even if collapsed)
- **iOS Safari (Japanese/Kanji)**: `insertFromComposition` fires with collapsed `targetRanges` (recalculate needed)
- **iOS Safari (Korean)**: `insertFromComposition` does NOT fire (use `deleteContentBackward` + `insertText` pattern instead)
- **Chrome/Edge**: Generally uses `insertCompositionText` instead of `insertFromComposition`
- **Firefox**: Behavior varies but generally more consistent with Chrome

## Workaround

### Desktop Safari - Trust targetRanges
```javascript
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertFromComposition') {
    const targetRanges = e.getTargetRanges?.() || [];
    if (targetRanges.length > 0) {
      // Trust targetRanges even if collapsed
      // Do NOT recalculate based on current selection
      const range = targetRanges[0];
      // Use range.startContainer and range.startOffset as-is
      handleCompositionInsertion(range);
    }
  }
});
```

### iOS Safari - Japanese/Kanji - Recalculate collapsed ranges
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

### iOS Safari - Korean - Handle deleteContentBackward + insertText pattern
```javascript
let lastCompositionDelete = null;

element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'deleteContentBackward' && e.isComposing) {
    // Store for pairing with insertText
    lastCompositionDelete = e;
    return;
  }
  
  if (e.inputType === 'insertText' && e.isComposing) {
    // iOS Safari Korean IME: insertFromComposition never fires
    // Handle as composition update
    if (lastCompositionDelete) {
      // Process as single composition update
      handleCompositionUpdate(e.data);
      lastCompositionDelete = null;
    }
  }
});
```

**Important**: Platform and IME detection is required to apply the correct handling strategy.

## References

- [ContentEditable Real Error: insertFromComposition targetRanges differences](https://contenteditable.realerror.com/) - Platform-specific behavior documentation
- [WebKit Bug 170416: Support InputEventInit inputType, dataTransfer, isComposing, targetRanges](https://bugs.webkit.org/show_bug.cgi?id=170416) - Input Events API support
- [W3C Input Events Level 2 Specification](https://www.w3.org/TR/input-events-2/) - Official specification for insertFromComposition
