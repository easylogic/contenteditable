---
id: ce-0565-chrome-121-oninput-offset-0
scenarioId: scenario-input-event-missing
locale: en
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Chrome
browserVersion: "121.0.6167.86"
keyboard: US QWERTY
caseTitle: "onInput event missing when typing at offset 0"
description: "In Chrome 121, the input event fails to fire when a character is typed at the very beginning (offset 0) of a block, breaking framework synchronization."
tags: ["input", "events", "regression", "chrome-121", "windows"]
status: confirmed
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">|world</div>'
    description: "Caret is at offset 0, before 'world'"
  - label: "Typing 'H'"
    html: '<div contenteditable="true">H|world</div>'
    description: "'beforeinput' fires with inputType 'insertText', data 'H'. DOM updates, but 'input' event is missing."
  - label: "✅ Expected"
    html: '<div contenteditable="true">H|world</div>'
    description: "Expected: Both 'beforeinput' and 'input' events should fire sequentially."
---

## Phenomenon
In Chrome 121 on Windows, a regression was identified where the `input` event (and consequently React's `onInput`) does not trigger after a `beforeinput` event if the insertion happens at the absolute start of a text node or block (offset 0). This is particularly disruptive for high-level editor frameworks that rely on the `input` event to reconcile their internal model with the DOM.

## Reproduction Steps
1. Create a `contenteditable` container with some text (e.g., "world").
2. Programmatically or manually place the caret at `offset 0` (before "w").
3. Type a single character (e.g., "H").
4. Inspect the event log.

## Observed Behavior
1. **`keydown` event**: Fires normally.
2. **`beforeinput` event**: Fires with `inputType: "insertText"` and `data: "H"`.
3. **DOM Change**: The character "H" is correctly inserted into the DOM by the browser's default behavior.
4. **`input` event**: **MISSING**. 
5. **Result**: Frameworks like Slate or React do not detect the change, leading to a state-DOM mismatch.

## Expected Behavior
The browser should dispatch an `input` event immediately after the DOM has been modified by the `insertText` operation, regardless of the caret's offset.

## Impact
- **Data Loss**: Since `onInput` doesn't fire, the application state is not updated with the new character. If the user continues typing, the whole block might eventually be overwritten or corrupted.
- **Undo/Redo Breakdown**: The undo stack may skip this specific character insertion, making the history inconsistent.
- **Framework Failures**: Core logic in Slate.js and other virtual-model-based editors fails to trigger, stopping all side effects (like syntax highlighting or auto-save).

## Browser Comparison
- **Chrome 120 (and below)**: Works correctly.
- **Chrome 122+**: Fixed.
- **Firefox/Safari**: Works correctly; does not exhibit this regression.

## References & Solutions
### Mitigation: beforeinput Fallback
If you must support Chrome 121, you can use `beforeinput` to manually trigger a reconciliation if the `input` event doesn't follow.

```javascript
let inputExpected = false;

element.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && getSelectionOffset() === 0) {
    inputExpected = true;
    // Set a short timeout to check if 'input' actually fired
    setTimeout(() => {
      if (inputExpected) {
        console.warn('Detected missing input event in Chrome 121. Forcing sync.');
        forceSyncModelWithDOM();
        inputExpected = false;
      }
    }, 10);
  }
});

element.addEventListener('input', (e) => {
  inputExpected = false;
});
```

- [Slate.js GitHub Issue #5668](https://github.com/ianstormtaylor/slate/issues/5668)
- [Chromium Bug 1521404](https://issues.chromium.org/issues/41492025)
