---
id: scenario-ime-composition-scroll
title: Scrolling cancels or interferes with IME composition
description: "When composing text with an IME in a contenteditable element, scrolling (mouse wheel, touch, or programmatic) may cancel the active composition, lose the composed text, or cause the composition UI to be positioned incorrectly. This affects multiple languages and is especially problematic on mobile devices."
category: ime
tags:
  - ime
  - composition
  - scroll
  - mobile
status: draft
---

When composing text with an IME in a `contenteditable` element, scrolling (mouse wheel, touch, or programmatic) may cancel the active composition, lose the composed text, or cause the composition UI to be positioned incorrectly. This is especially problematic on mobile devices where scrolling is common during text input.

## Observed Behavior

1. **Composition cancellation**: Scrolling cancels active composition
2. **Text loss**: Composed text is lost when scroll occurs
3. **UI mispositioning**: IME candidate list or composition UI may be positioned incorrectly after scroll
4. **Focus issues**: Scrolling may cause focus to be lost or changed
5. **Event sequence issues**: The sequence of `scroll`, `compositionend`, and `blur` events may be inconsistent

## Language-Specific Manifestations

This issue manifests across all languages that use IME composition:

- **Korean IME**: Partial syllables may be lost when scrolling
- **Japanese IME**: Incomplete kanji conversions may be lost
- **Chinese IME**: Partial Pinyin or character conversions may be lost
- **Other IMEs**: Similar issues may occur with other languages

## Browser Comparison

- **Chrome/Edge**: Scrolling may cancel composition, especially on mobile
- **Firefox**: May have different scroll behavior during composition
- **Safari**: Scroll handling during composition can be inconsistent, especially on iOS

## Impact

- Users lose their work when accidentally scrolling during composition
- Mobile users are especially affected as scrolling is common during input
- IME UI positioning issues make candidate selection difficult
- User experience is degraded compared to native input fields

## Workaround

Handle scroll events during composition carefully:

```javascript
let isComposing = false;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionend', () => {
  isComposing = false;
});

// Prevent scroll during composition (may not be desirable)
element.addEventListener('wheel', (e) => {
  if (isComposing) {
    // Option 1: Prevent scroll during composition
    // e.preventDefault();
    // Note: This may degrade user experience
    
    // Option 2: Allow scroll but preserve composition
    // This is difficult to implement reliably
  }
}, { passive: false });

// For touch devices
element.addEventListener('touchmove', (e) => {
  if (isComposing) {
    // Similar handling for touch scroll
  }
}, { passive: false });

// Monitor scroll events
element.addEventListener('scroll', () => {
  if (isComposing) {
    // Check if composition UI needs repositioning
    // May need to trigger IME UI update
  }
});
```

