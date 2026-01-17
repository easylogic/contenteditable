---
id: scenario-keyboard-handlers-during-composition
title: Keyboard handlers must allow browser default behavior during composition
description: "Editors that override keyboard handlers (Enter, Backspace, Delete) must allow browser default behavior during IME composition. However, iOS Safari does not fire composition events, causing isComposing to always be false. iOS Safari requires special handling to always allow browser default behavior."
category: ime
tags:
  - ime
  - composition
  - keyboard
  - beforeinput
  - input
  - isComposing
  - safari
status: draft
locale: en
---

Editors that override keyboard handlers for keys like Enter, Backspace, and Delete must allow browser default behavior during IME composition. However, iOS Safari does not fire composition events, causing `isComposing` to always be false, which breaks the standard composition detection pattern.

## The Problem

Many editors override keyboard handlers to customize behavior:
- **Enter**: Custom line break handling, block creation
- **Backspace**: Custom deletion logic, block merging
- **Delete**: Custom deletion logic
- **Other keys**: Various custom behaviors

During IME composition, these custom handlers should be bypassed to allow the browser's default composition behavior. The standard approach is to check `isComposing` flag or listen to composition events.

## Platform-Specific Behavior

### Standard Browsers (Chrome, Edge, Firefox, Desktop Safari)
- Composition events (`compositionstart`, `compositionupdate`, `compositionend`) fire normally
- `isComposing` flag in `beforeinput`/`input` events accurately reflects composition state
- Can reliably detect composition state and allow browser default behavior

### iOS Safari
- Composition events do NOT fire for Korean IME
- `isComposing` flag is always `false` in `beforeinput`/`input` events for Korean IME
- Cannot reliably detect composition state using standard methods
- Requires always allowing browser default behavior for keyboard handlers

## Observed Behavior

### Standard Browsers
1. User starts IME composition (e.g., typing Korean characters)
2. `compositionstart` fires → `isComposing = true`
3. User presses Enter/Backspace/Delete during composition
4. `beforeinput` fires with `isComposing: true`
5. Custom keyboard handlers check `isComposing` and allow browser default
6. Browser handles the key press as part of composition
7. `compositionend` fires → `isComposing = false`

### iOS Safari (Korean IME)
1. User starts IME composition (e.g., typing Korean characters)
2. `compositionstart` does NOT fire
3. `isComposing` remains `false` in all events
4. User presses Enter/Backspace/Delete during composition
5. `beforeinput` fires with `isComposing: false`
6. Custom keyboard handlers think composition is not active
7. Custom handlers prevent default and handle the key press
8. This breaks composition behavior

## Impact

- **Broken composition**: Custom keyboard handlers interfere with IME composition
- **Lost text**: Composition text may be lost or incorrectly handled
- **Incorrect behavior**: Enter/Backspace/Delete may not work as expected during composition
- **Platform-specific bugs**: Code that works on other browsers fails on iOS Safari
- **IME-specific bugs**: Code that works with other IMEs fails with Korean IME on iOS Safari

## Browser Comparison

- **Chrome/Edge/Firefox/Desktop Safari**: Composition events fire, `isComposing` is accurate, can detect composition state
- **iOS Safari (Korean IME)**: Composition events do NOT fire, `isComposing` is always `false`, cannot detect composition state
- **iOS Safari (Japanese/Kanji IME)**: Composition events fire, `isComposing` is accurate

## Workaround

### Standard Browsers - Check isComposing
```javascript
let isComposing = false;

element.addEventListener('compositionstart', () => {
  isComposing = true;
});

element.addEventListener('compositionend', () => {
  isComposing = false;
});

element.addEventListener('beforeinput', (e) => {
  // Allow browser default during composition
  if (e.isComposing || isComposing) {
    return; // Let browser handle it
  }
  
  // Custom keyboard handling
  if (e.inputType === 'insertParagraph') {
    e.preventDefault();
    handleCustomEnter();
  } else if (e.inputType === 'deleteContentBackward') {
    e.preventDefault();
    handleCustomBackspace();
  } else if (e.inputType === 'deleteContentForward') {
    e.preventDefault();
    handleCustomDelete();
  }
});
```

### iOS Safari - Always Allow Browser Default
```javascript
const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                    /Safari/.test(navigator.userAgent) && 
                    !/Chrome/.test(navigator.userAgent);

element.addEventListener('beforeinput', (e) => {
  // iOS Safari: Always allow browser default for keyboard handlers
  // because isComposing is always false and composition events don't fire
  if (isIOSSafari) {
    // Detect Korean IME pattern: deleteContentBackward + insertText with isComposing: false
    // This indicates composition is active even though isComposing is false
    if (e.inputType === 'deleteContentBackward' || 
        e.inputType === 'insertText' ||
        e.inputType === 'insertParagraph' ||
        e.inputType === 'deleteContentForward') {
      // Allow browser default - don't prevent default
      return;
    }
  }
  
  // Standard browsers: Check isComposing
  if (e.isComposing || isComposing) {
    return; // Let browser handle it
  }
  
  // Custom keyboard handling for non-composition cases
  if (e.inputType === 'insertParagraph') {
    e.preventDefault();
    handleCustomEnter();
  } else if (e.inputType === 'deleteContentBackward') {
    e.preventDefault();
    handleCustomBackspace();
  } else if (e.inputType === 'deleteContentForward') {
    e.preventDefault();
    handleCustomDelete();
  }
});
```

### Alternative: Detect iOS Safari Korean IME Pattern
```javascript
let lastDeleteBackward = null;
const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                    /Safari/.test(navigator.userAgent) && 
                    !/Chrome/.test(navigator.userAgent);

element.addEventListener('beforeinput', (e) => {
  if (isIOSSafari) {
    // iOS Safari Korean IME pattern: deleteContentBackward followed by insertText
    // Both have isComposing: false, but indicate active composition
    if (e.inputType === 'deleteContentBackward') {
      lastDeleteBackward = e;
      return; // Allow browser default
    }
    
    if (e.inputType === 'insertText' && lastDeleteBackward) {
      // This is part of composition update
      lastDeleteBackward = null;
      return; // Allow browser default
    }
    
    // For Enter/Backspace/Delete during potential composition, allow browser default
    if (e.inputType === 'insertParagraph' || 
        e.inputType === 'deleteContentBackward' ||
        e.inputType === 'deleteContentForward') {
      // Conservative approach: allow browser default
      return;
    }
  }
  
  // Standard browsers: Check isComposing
  if (e.isComposing || isComposing) {
    return;
  }
  
  // Custom keyboard handling
  // ...
});
```

**Important**: 
- Always allow browser default behavior for keyboard handlers in iOS Safari
- Do not rely on `isComposing` flag or composition events in iOS Safari for Korean IME
- Use platform detection to apply the correct strategy
- Consider using `beforeinput` events instead of `keydown` events for better composition state detection

## References

- [Lexical Issue #5841: isComposing always false on iOS Safari Korean IME](https://github.com/facebook/lexical/issues/5841) - iOS Safari Korean IME issues
- [W3C UI Events: Composition events](https://www.w3.org/TR/2016/WD-uievents-20160804/) - Composition event specification
- [WebKit Bug 261764: iOS dictation doesn't trigger composition events](https://bugs.webkit.org/show_bug.cgi?id=261764) - Related dictation issues
- [WebKit Bug 43020: Korean Hangul composition test](https://bugs.webkit.org/show_bug.cgi?id=43020) - Korean IME composition issues
- [Tanishiking: IME event handling](https://tanishiking.github.io/posts/ime-event-handling/) - IME detection heuristics
