---
id: ce-0558-insertparagraph-preventdefault-composition-broken-safari-japanese
scenarioId: scenario-insertparagraph-preventdefault-composition-broken
locale: en
os: macOS
osVersion: "14.0+"
device: Desktop or Laptop
deviceVersion: Any
browser: Safari
browserVersion: "17.0+"
keyboard: Japanese (IME)
caseTitle: insertParagraph preventDefault breaks Japanese IME composition in Safari
description: "In Safari desktop on macOS, when preventDefault() is called on keydown or beforeinput events for insertParagraph (Enter key), the Japanese IME composition state becomes corrupted. Subsequent Japanese text input fails to trigger proper input events, causing characters to not be inserted or composition to malfunction."
tags:
  - safari
  - macos
  - insertparagraph
  - preventdefault
  - japanese
  - ime
  - composition
  - keydown
  - beforeinput
  - input-event
status: draft
domSteps:
  - label: "Initial state"
    html: '<div contenteditable="true"><p>こんにちは</p></div>'
    description: "User has typed Japanese text"
  - label: "Press Enter with preventDefault"
    html: '<div contenteditable="true"><p>こんにちは</p></div>'
    description: "Enter key is pressed, preventDefault() is called in keydown/beforeinput"
  - label: "Try to type Japanese again"
    html: '<div contenteditable="true"><p>こんにちは</p></div>'
    description: "User tries to type more Japanese characters, but input event doesn't fire properly"
  - label: "Result - characters not inserted"
    html: '<div contenteditable="true"><p>こんにちは</p></div>'
    description: "Japanese characters are not inserted, composition state is broken"
---

## Phenomenon

In Safari desktop on macOS, when `preventDefault()` is called on `keydown` or `beforeinput` events to prevent `insertParagraph` (Enter key), the Japanese IME composition state becomes corrupted. After this occurs, subsequent Japanese text input fails to work correctly. The `input` event may not fire properly, Japanese characters may not be inserted, or the composition state may remain in an inconsistent state.

## Reproduction example

1. Create a contenteditable div and focus it.
2. Add event listeners for `keydown` and/or `beforeinput` that call `e.preventDefault()` when Enter is pressed or `inputType === "insertParagraph"`.
3. Type Japanese text using IME (e.g., "こんにちは").
4. Press Enter key.
5. Observe that `preventDefault()` successfully prevents the paragraph insertion.
6. Try to type more Japanese text (e.g., "ありがとう").
7. Observe that the Japanese characters are not inserted, or the `input` event does not fire properly.

## Observed behavior

- **preventDefault() on insertParagraph**: Successfully prevents paragraph insertion when called in `keydown` or `beforeinput`.
- **Subsequent IME input failure**: After preventing insertParagraph, Japanese IME input stops working.
- **Missing input events**: The `input` event may not fire for subsequent Japanese text input.
- **Composition events**: `compositionstart`, `compositionupdate`, `compositionend` may not fire correctly.
- **Character insertion failure**: Typed Japanese characters do not appear in the contenteditable element.
- **IME state corruption**: The IME composition state becomes inconsistent and cannot recover without blurring and refocusing the element.

## Expected behavior

- `preventDefault()` should prevent paragraph insertion without affecting IME composition state.
- After preventing insertParagraph, subsequent Japanese IME input should continue to work normally.
- The `input` event should fire correctly for all IME input, regardless of whether insertParagraph was previously prevented.
- IME composition state should remain consistent and functional.

## Analysis

This issue occurs because Safari's internal IME composition state management becomes corrupted when `insertParagraph` is prevented. The browser's coordination between paragraph insertion and composition state transitions is disrupted, leaving the IME in an inconsistent state.

According to the Input Events Level 2 specification, composition-related input events are not cancelable, but canceling `insertParagraph` may interfere with the composition lifecycle, especially when Enter is pressed during or after IME composition.

## Workarounds

### Check isComposing before preventing

Only prevent `insertParagraph` when not composing:

```javascript
editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertParagraph' && !e.isComposing) {
    e.preventDefault();
    // Custom paragraph insertion logic
  }
});
```

### Handle Enter in keydown with composition check

```javascript
editor.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault();
    // Custom paragraph insertion
  }
});
```

### Reset IME state if corrupted

If composition state is already corrupted, blur and refocus the element:

```javascript
function resetIMEState(editor) {
  editor.blur();
  setTimeout(() => {
    editor.focus();
  }, 0);
}
```

## Browser Comparison

- **Safari (Desktop macOS)**: This issue occurs. Preventing insertParagraph breaks subsequent Japanese IME input.
- **Chrome**: Needs verification
- **Firefox**: Needs verification
- **Edge**: Needs verification
