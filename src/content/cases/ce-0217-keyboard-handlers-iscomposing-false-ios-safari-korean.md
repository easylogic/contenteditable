---
id: ce-0217-keyboard-handlers-iscomposing-false-ios-safari-korean
scenarioId: scenario-keyboard-handlers-during-composition
locale: en
os: iOS
osVersion: "17.0+"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0+"
keyboard: Korean (IME)
caseTitle: isComposing is always false in iOS Safari Korean IME, breaking keyboard handler composition detection
description: "In iOS Safari with Korean IME, isComposing flag is always false in beforeinput and input events, and composition events do not fire. This breaks the standard pattern of detecting composition state to allow browser default behavior for keyboard handlers (Enter, Backspace, Delete). Editors must always allow browser default behavior in iOS Safari."
tags:
  - composition
  - ime
  - beforeinput
  - input
  - isComposing
  - keyboard
  - ios
  - safari
  - korean
status: draft
domSteps:
  - label: "Before"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p>'
    description: "Korean composition in progress"
  - label: "User presses Enter (Bug)"
    html: '<p>Hello </p><p></p>'
    description: "Custom Enter handler prevents default, breaks composition"
  - label: "✅ Expected"
    html: '<p>Hello <span style="text-decoration: underline; background: #fef08a;">한</span></p><p></p>'
    description: "Browser default behavior handles Enter during composition correctly"
---

## Phenomenon

In iOS Safari with Korean IME, the `isComposing` flag is always `false` in `beforeinput` and `input` events, and composition events (`compositionstart`, `compositionupdate`, `compositionend`) do not fire. This breaks the standard pattern of detecting composition state to allow browser default behavior for keyboard handlers (Enter, Backspace, Delete). Editors that override keyboard handlers must always allow browser default behavior in iOS Safari.

## Reproduction example

1. Create a `contenteditable` element with custom keyboard handlers for Enter, Backspace, Delete.
2. Focus the element in iOS Safari (iPhone/iPad).
3. Activate Korean IME.
4. Start composing Korean text (e.g., type "ㅎ" then "ㅏ" then "ㄴ" to compose "한").
5. While composition is active, press Enter, Backspace, or Delete.
6. Observe that `isComposing` is `false` in `beforeinput` events.
7. Observe that composition events do not fire.
8. Custom keyboard handlers think composition is not active and prevent default.
9. This breaks composition behavior.

## Observed behavior

When pressing Enter/Backspace/Delete during Korean composition:

1. **isComposing is always false**:
   - `beforeinput` events have `isComposing: false`
   - `input` events have `isComposing: false`
   - Cannot detect composition state using `isComposing` flag

2. **Composition events do not fire**:
   - `compositionstart` does NOT fire
   - `compositionupdate` does NOT fire
   - `compositionend` does NOT fire
   - Cannot detect composition state using composition events

3. **Custom keyboard handlers break composition**:
   - Handlers check `isComposing` → always `false`
   - Handlers think composition is not active
   - Handlers prevent default and handle keys customly
   - This interferes with browser's composition handling
   - Composition text may be lost or incorrectly handled

4. **Result**:
   - Enter during composition may break composition or insert line break incorrectly
   - Backspace during composition may delete incorrectly
   - Delete during composition may delete incorrectly
   - Composition behavior is broken

## Expected behavior

- `isComposing` flag should accurately reflect composition state
- Composition events should fire during composition
- Custom keyboard handlers should be able to detect composition state
- Browser default behavior should be allowed during composition
- Keyboard handlers should not interfere with composition

## Impact

- **Broken composition**: Custom keyboard handlers interfere with IME composition
- **Lost text**: Composition text may be lost or incorrectly handled
- **Incorrect behavior**: Enter/Backspace/Delete may not work as expected during composition
- **Platform-specific bugs**: Code that works on other browsers fails on iOS Safari
- **IME-specific bugs**: Code that works with other IMEs fails with Korean IME on iOS Safari
- **Editor compatibility**: Editors that rely on `isComposing` or composition events break on iOS Safari

## Browser Comparison

- **iOS Safari (Korean IME)**: `isComposing` is always `false`, composition events do NOT fire
- **iOS Safari (Japanese/Kanji IME)**: `isComposing` is accurate, composition events fire
- **Desktop Safari**: `isComposing` is accurate, composition events fire
- **Chrome/Edge**: `isComposing` is accurate, composition events fire
- **Firefox**: `isComposing` is accurate, composition events fire

## Notes and possible direction for workarounds

- **Always allow browser default in iOS Safari**: Do not prevent default for keyboard handlers in iOS Safari:
  ```javascript
  const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                      /Safari/.test(navigator.userAgent) && 
                      !/Chrome/.test(navigator.userAgent);

  element.addEventListener('beforeinput', (e) => {
    // iOS Safari: Always allow browser default for keyboard handlers
    if (isIOSSafari) {
      if (e.inputType === 'insertParagraph' || 
          e.inputType === 'deleteContentBackward' ||
          e.inputType === 'deleteContentForward') {
        return; // Allow browser default
      }
    }
    
    // Standard browsers: Check isComposing
    if (e.isComposing) {
      return; // Let browser handle it
    }
    
    // Custom keyboard handling
    if (e.inputType === 'insertParagraph') {
      e.preventDefault();
      handleCustomEnter();
    }
  });
  ```

- **Detect iOS Safari Korean IME pattern**: Recognize `deleteContentBackward` + `insertText` pattern:
  ```javascript
  let lastDeleteBackward = null;
  const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                      /Safari/.test(navigator.userAgent) && 
                      !/Chrome/.test(navigator.userAgent);

  element.addEventListener('beforeinput', (e) => {
    if (isIOSSafari) {
      // iOS Safari Korean IME pattern
      if (e.inputType === 'deleteContentBackward') {
        lastDeleteBackward = e;
        return; // Allow browser default
      }
      
      if (e.inputType === 'insertText' && lastDeleteBackward) {
        lastDeleteBackward = null;
        return; // Allow browser default (composition update)
      }
      
      // Conservative: allow browser default for all keyboard handlers
      if (e.inputType === 'insertParagraph' || 
          e.inputType === 'deleteContentBackward' ||
          e.inputType === 'deleteContentForward') {
        return; // Allow browser default
      }
    }
    
    // Standard browsers
    if (e.isComposing) {
      return;
    }
    
    // Custom handling
    // ...
  });
  ```

- **Do not rely on isComposing in iOS Safari**: For iOS Safari Korean IME, do not use `isComposing` flag to detect composition
- **Do not rely on composition events in iOS Safari**: For iOS Safari Korean IME, do not use composition events to detect composition
- **Use platform detection**: Detect iOS Safari and apply special handling
- **Use beforeinput instead of keydown**: `beforeinput` events provide better composition state information than `keydown` events
