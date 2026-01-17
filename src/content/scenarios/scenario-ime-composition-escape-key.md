---
id: scenario-ime-composition-escape-key
title: Escape key cancels IME composition unexpectedly
description: "When composing text with an IME in a contenteditable element, pressing Escape may cancel the composition, lose the composed text, or behave inconsistently. This affects multiple languages and can interfere with UI interactions that use Escape for cancellation or closing dialogs."
category: ime
tags:
  - ime
  - composition
  - escape
status: draft
locale: en
---

When composing text with an IME in a `contenteditable` element, pressing Escape may cancel the composition, lose the composed text, or behave inconsistently. This can interfere with UI interactions that use Escape for cancellation or closing dialogs.

## Observed Behavior

1. **Composition cancellation**: Escape key cancels active composition
2. **Text loss**: Composed text is lost when Escape is pressed
3. **Inconsistent behavior**: Escape behavior may differ from native input fields
4. **Event conflicts**: Escape key may trigger both composition cancellation and other UI actions
5. **No recovery**: Lost composition cannot be easily recovered

## Language-Specific Manifestations

This issue manifests across all languages that use IME composition:

- **Korean IME**: Partial syllables may be lost when Escape is pressed
- **Japanese IME**: Incomplete kanji conversions may be lost
- **Chinese IME**: Partial Pinyin or character conversions may be lost
- **Other IMEs**: Similar issues may occur with other languages

## Browser Comparison

- **Chrome/Edge**: Escape may cancel composition
- **Firefox**: May have different Escape key behavior during composition
- **Safari**: Escape key handling during composition can be inconsistent

## Impact

- Users lose their work when pressing Escape during composition
- UI interactions using Escape may conflict with composition
- Workflow is interrupted when composition is cancelled unexpectedly
- User experience is degraded compared to native input fields

## Workaround

Handle Escape key during composition carefully:

```javascript
let isComposing = false;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionend', () => {
  isComposing = false;
});

element.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isComposing) {
    // Option 1: Prevent Escape during composition
    e.preventDefault();
    // Option 2: Allow Escape but warn user
    // Option 3: Commit composition before allowing Escape
    
    // Note: Preventing Escape may interfere with other UI actions
    // Consider the context (e.g., modal dialogs, dropdowns)
  }
});
```

## References

- [W3C UI Events: Composition Events](https://w3c.github.io/uievents/split/composition-events.html) - Official composition events specification
- [MDN: Element keydown event](https://developer.mozilla.org/docs/Web/API/Element/keydown_event) - KeyboardEvent.isComposing documentation
- [W3C Lists: Composition event cancelability](https://lists.w3.org/Archives/Public/public-webapps-github/2023Nov/0539.html) - Discussion on event cancelability
- [Stack Overflow: Why is contenteditable beforeinput event not cancelable?](https://stackoverflow.com/questions/53140803/why-is-contenteditable-beforeinput-event-not-cancelable) - beforeinput cancelability during composition
- [W3C EditContext API Explainer](https://w3c.github.io/editing/docs/EditContext/explainer.html) - Experimental API for better composition control
