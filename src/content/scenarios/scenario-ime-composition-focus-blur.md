---
id: scenario-ime-composition-focus-blur
title: IME composition cancelled or lost when focus changes
description: "When composing text with an IME in a contenteditable element, changing focus (blur) or clicking elsewhere may cancel the composition, lose the composed text, or commit it unexpectedly. This affects multiple languages and can occur when interacting with other UI elements, scrolling, or programmatic focus changes."
category: ime
tags:
  - ime
  - composition
  - focus
  - blur
status: draft
locale: en
---

When composing text with an IME in a `contenteditable` element, changing focus (blur) or clicking elsewhere may cancel the composition, lose the composed text, or commit it unexpectedly. This can occur when interacting with other UI elements, scrolling, or programmatic focus changes.

## Observed Behavior

1. **Composition cancellation**: Composition is cancelled when focus is lost
2. **Text loss**: Composed text may be lost when blur occurs
3. **Unexpected commit**: Composition may be committed unexpectedly when focus changes
4. **Incomplete commit**: Only partial composition may be committed
5. **Event sequence issues**: The sequence of `blur`, `compositionend`, and `input` events may be inconsistent

## Language-Specific Manifestations

This issue manifests across all languages that use IME composition:

- **Korean IME**: Partial syllables may be lost when focus changes
- **Japanese IME**: Incomplete kanji conversions may be lost
- **Chinese IME**: Partial Pinyin or character conversions may be lost
- **Thai/Vietnamese/Hindi/Arabic IMEs**: Combining characters or diacritics may be lost
- **Other IMEs**: Similar issues may occur with other languages

## Browser Comparison

- **Chrome/Edge**: Generally better handling, but composition may still be lost in some cases
- **Firefox**: May have more issues with composition preservation during focus changes
- **Safari**: Composition handling during focus changes can be inconsistent, especially on iOS

## Impact

- Users lose their work when accidentally clicking elsewhere
- Workflow is disrupted when composition is cancelled unexpectedly
- Text may be partially committed, leading to incorrect content
- User experience is degraded compared to native input fields

## Workaround

Monitor focus events and preserve composition state:

```javascript
let compositionState = {
  isActive: false,
  pendingText: '',
  shouldPreserve: false
};

element.addEventListener('compositionstart', () => {
  compositionState.isActive = true;
  compositionState.shouldPreserve = true;
});

element.addEventListener('compositionupdate', (e) => {
  compositionState.pendingText = e.data;
});

element.addEventListener('compositionend', (e) => {
  compositionState.isActive = false;
  compositionState.pendingText = '';
  compositionState.shouldPreserve = false;
});

element.addEventListener('blur', (e) => {
  if (compositionState.isActive && compositionState.shouldPreserve) {
    // Try to preserve composition
    // Note: This is difficult to implement reliably
    // May need to store pending text and restore it
    console.warn('Composition may be lost on blur');
  }
});

// Prevent programmatic focus changes during composition
const originalBlur = HTMLElement.prototype.blur;
HTMLElement.prototype.blur = function() {
  if (this === element && compositionState.isActive) {
    // Optionally delay blur until composition completes
    return;
  }
  originalBlur.call(this);
};
```

