---
id: scenario-ime-composition-number-input
title: Number input during IME composition causes unexpected behavior
description: "When composing text with an IME in a contenteditable element, pressing number keys may trigger IME-specific functions (like candidate selection in Japanese/Chinese IME) instead of inserting numbers, or may cause composition to be cancelled unexpectedly."
category: ime
tags:
  - ime
  - composition
  - number-input
  - candidate-selection
status: draft
locale: en
---

When composing text with an IME in a `contenteditable` element, pressing number keys may trigger IME-specific functions (like candidate selection in Japanese/Chinese IME) instead of inserting numbers, or may cause composition to be cancelled unexpectedly.

## Observed Behavior

1. **Candidate selection**: Number keys may select candidates from the conversion list instead of inserting numbers
2. **Composition cancellation**: Number keys may cancel active composition
3. **Unexpected insertion**: Numbers may be inserted in unexpected positions
4. **Event conflicts**: Number key behavior conflicts with composition handling
5. **Inconsistent behavior**: Behavior may differ from native input fields

## Language-Specific Manifestations

This issue manifests differently across languages:

- **Japanese IME**: Number keys (1-9) are used to select kanji candidates from the conversion list
- **Chinese IME**: Number keys (1-9) are used to select character candidates from the conversion list
- **Korean IME**: Number keys may cancel composition or behave unexpectedly
- **Other IMEs**: Similar issues may occur with other languages

## Browser Comparison

- **Chrome/Edge**: Number keys may trigger candidate selection during conversion
- **Firefox**: May have different number key behavior during composition
- **Safari**: Number key handling during composition can be inconsistent

## Impact

- Users cannot reliably insert numbers during composition
- Number input is blocked when candidate list is active
- Workflow is disrupted when numbers are needed during composition
- User experience is degraded compared to native input fields

## Workaround

Handle number keys during composition carefully:

```javascript
let isComposing = false;
let candidateListActive = false;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionupdate', (e) => {
  // Check if candidate list is likely active
  candidateListActive = e.data && e.data.length > 0;
});

element.addEventListener('keydown', (e) => {
  if (isComposing && candidateListActive) {
    // Number keys during candidate selection
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
      // Option 1: Allow candidate selection (default behavior)
      // Option 2: Prevent and insert number instead
      // e.preventDefault();
      // Then insert number manually after composition completes
    }
  } else if (isComposing && !candidateListActive) {
    // Number keys during composition (no candidate list)
    // May need special handling depending on IME
  }
});

element.addEventListener('compositionend', () => {
  isComposing = false;
  candidateListActive = false;
});
```

## References

- [Microsoft Support: Microsoft Simplified Chinese IME](https://support.microsoft.com/en-au/windows/microsoft-simplified-chinese-ime-9b962a3b-2fa4-4f37-811c-b1886320dd72) - Chinese IME candidate selection
- [Microsoft Support: Microsoft Traditional Chinese IME](https://support.microsoft.com/en-us/windows/microsoft-traditional-chinese-ime-ef596ca5-aff7-4272-b34b-0ac7c2631a38) - Traditional Chinese IME behavior
- [Microsoft Support: Microsoft Japanese IME](https://support.microsoft.com/en-gb/windows/microsoft-japanese-ime-da40471d-6b91-4042-ae8b-713a96476916) - Japanese IME candidate selection
- [Microsoft Learn: Traditional Chinese IME](https://learn.microsoft.com/en-us/globalization/input/traditional-chinese-ime) - IME implementation details
- [Apple Support: Japanese Input Method on Mac](https://support.apple.com/es-us/guide/japanese-input-method/jpim10262/mac) - macOS Japanese IME behavior
