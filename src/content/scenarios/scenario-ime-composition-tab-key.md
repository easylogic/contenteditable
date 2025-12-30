---
id: scenario-ime-composition-tab-key
title: Tab key cancels IME composition or causes unexpected navigation
description: "When composing text with an IME in a contenteditable element, pressing Tab may cancel the composition, cause unexpected focus navigation, or commit the composition in an unexpected way. This affects multiple languages and can interfere with keyboard navigation in forms or tables."
category: ime
tags:
  - ime
  - composition
  - tab
  - navigation
status: draft
locale: en
---

When composing text with an IME in a `contenteditable` element, pressing Tab may cancel the composition, cause unexpected focus navigation, or commit the composition in an unexpected way. This can interfere with keyboard navigation in forms, tables, or other interactive elements.

## Observed Behavior

1. **Composition cancellation**: Tab key cancels active composition
2. **Unexpected navigation**: Tab causes focus to move to next element, interrupting composition
3. **Partial commit**: Composition may be partially committed before navigation
4. **Text loss**: Composed text may be lost when Tab is pressed
5. **Event conflicts**: Tab key behavior conflicts with composition handling

## Language-Specific Manifestations

This issue manifests across all languages that use IME composition:

- **Korean IME**: Partial syllables may be lost when Tab is pressed
- **Japanese IME**: Incomplete kanji conversions may be lost
- **Chinese IME**: Partial Pinyin or character conversions may be lost
- **Other IMEs**: Similar issues may occur with other languages

## Browser Comparison

- **Chrome/Edge**: Tab may cancel composition and navigate focus
- **Firefox**: May have different Tab key behavior during composition
- **Safari**: Tab key handling during composition can be inconsistent

## Impact

- Users lose their work when pressing Tab during composition
- Keyboard navigation in forms/tables is disrupted
- Workflow is interrupted when composition is cancelled unexpectedly
- User experience is degraded compared to native input fields

## Workaround

Handle Tab key during composition carefully:

```javascript
let isComposing = false;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionend', () => {
  isComposing = false;
});

element.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && isComposing) {
    // Option 1: Prevent Tab during composition
    e.preventDefault();
    // Option 2: Wait for composition to complete before allowing Tab
    // This requires tracking composition state
    
    // Option 3: Commit composition before allowing Tab
    // This may require IME-specific handling
  }
});

// For table cells or form elements
element.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && isComposing) {
    // Prevent default Tab behavior during composition
    e.preventDefault();
    
    // Optionally commit composition first
    // Then handle Tab navigation manually after composition completes
  }
});
```

