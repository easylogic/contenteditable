---
id: scenario-ime-composition-paste
title: Paste operation cancels or interferes with IME composition
description: "When composing text with an IME in a contenteditable element, pasting content (Ctrl+V / Cmd+V) may cancel the active composition, lose the composed text, or cause the pasted content to be inserted in an unexpected position. This affects multiple languages."
category: ime
tags:
  - ime
  - composition
  - paste
status: draft
---

When composing text with an IME in a `contenteditable` element, pasting content (Ctrl+V / Cmd+V) may cancel the active composition, lose the composed text, or cause the pasted content to be inserted in an unexpected position.

## Observed Behavior

1. **Composition cancellation**: Paste operation cancels active composition
2. **Text loss**: Composed text is lost when paste occurs
3. **Unexpected insertion**: Pasted content may be inserted in wrong position
4. **Event sequence issues**: The sequence of `paste`, `compositionend`, and `input` events may be inconsistent
5. **Mixed content**: Pasted content and composed text may be mixed incorrectly

## Language-Specific Manifestations

This issue manifests across all languages that use IME composition:

- **Korean IME**: Partial syllables may be lost when paste occurs
- **Japanese IME**: Incomplete kanji conversions may be lost
- **Chinese IME**: Partial Pinyin or character conversions may be lost
- **Other IMEs**: Similar issues may occur with other languages

## Browser Comparison

- **Chrome/Edge**: Paste may cancel composition
- **Firefox**: May have different paste behavior during composition
- **Safari**: Paste handling during composition can be inconsistent

## Impact

- Users lose their work when pasting during composition
- Workflow is disrupted when composition is cancelled unexpectedly
- Pasted content may be inserted incorrectly
- User experience is degraded compared to native input fields

## Workaround

Handle paste events during composition carefully:

```javascript
let isComposing = false;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionend', () => {
  isComposing = false;
});

element.addEventListener('paste', (e) => {
  if (isComposing) {
    // Option 1: Prevent paste during composition
    e.preventDefault();
    // Option 2: Wait for composition to complete, then paste
    // This requires queuing the paste operation
    
    // Option 3: Commit composition first, then allow paste
    // This may require IME-specific handling
  }
});

// Alternative: Use beforeinput event
element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertFromPaste' && isComposing) {
    // Handle paste during composition
    // May need to prevent default and handle manually
  }
});
```

