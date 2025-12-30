---
id: ce-0212
scenarioId: scenario-ime-composition-keydown-keycode-229
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese (IME)
caseTitle: Duplicate keydown events with keyCode 229 and 13 when pressing Enter during Japanese IME composition
description: "When pressing Enter during Japanese IME composition in a contenteditable element, two keydown events fire: first with keyCode 229 (IME processing), then with keyCode 13 (Enter). This can cause event handlers to execute twice for a single Enter key press."
tags:
  - composition
  - ime
  - enter
  - keydown
  - keycode-229
  - duplicate-events
  - japanese
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">こん</span>'
    description: "Japanese composition in progress"
  - label: "After Enter (Bug)"
    html: 'Hello こん<br><br>'
    description: "Duplicate keydown events cause Enter to be processed twice, creating two line breaks"
  - label: "✅ Expected"
    html: 'Hello こん<br>'
    description: "Expected: Single line break after composition commits"
---

## Phenomenon

When pressing Enter during Japanese IME composition in a `contenteditable` element, two `keydown` events fire sequentially:
1. First event with `keyCode: 229` (indicating IME is processing the input)
2. Second event with `keyCode: 13` (the actual Enter key)

This can cause event handlers listening to `keydown` events to execute twice for a single Enter key press.

## Reproduction example

1. Focus a `contenteditable` element.
2. Activate Japanese IME.
3. Start composing Japanese text (e.g., type "konnichiwa" in romaji to compose "こんにちは").
4. While composition is active (before finalizing kanji conversion), press Enter.
5. Observe `keydown` events in the browser console or event log.

## Observed behavior

When pressing Enter during composition:

1. **First `keydown` event**:
   - `keyCode: 229` (special value indicating IME processing)
   - `key: 'Process'` or similar IME-related value
   - May have `isComposing` property (browser-dependent)
   - The actual key code is not available at this point

2. **Second `keydown` event**:
   - `keyCode: 13` (Enter key)
   - `key: 'Enter'`
   - Occurs after IME processes the input

3. **Result**:
   - Event handlers listening to `keydown` with `keyCode === 13` execute twice
   - This can cause duplicate line breaks, duplicate command execution, or other unintended behavior

## Expected behavior

- Only one `keydown` event should fire for a single Enter key press
- If `keyCode 229` fires, it should be clearly distinguishable from the actual key event
- Event handlers should not need special logic to deduplicate key events during composition
- The `keyCode 229` event should not trigger handlers intended for the actual key

## Impact

This can lead to:

- **Duplicate line breaks**: Enter key handler creates two `<br>` elements instead of one
- **Duplicate command execution**: Keyboard shortcuts or commands execute twice
- **Performance issues**: Event handlers process the same action twice
- **State synchronization issues**: Application state may become inconsistent
- **Unexpected UI behavior**: UI may respond twice to a single user action

## Browser Comparison

- **Chrome/Edge**: Fires `keyCode 229` followed by actual `keyCode 13` during composition
- **Firefox**: May have similar behavior
- **Safari**: Behavior may vary

## Notes and possible direction for workarounds

- **Check for `keyCode 229`**: Ignore `keydown` events with `keyCode 229` during composition:
  ```javascript
  let isComposing = false;
  
  element.addEventListener('compositionstart', () => {
    isComposing = true;
  });
  
  element.addEventListener('compositionend', () => {
    isComposing = false;
  });
  
  element.addEventListener('keydown', (e) => {
    if (isComposing && e.keyCode === 229) {
      // Ignore keyCode 229 events during composition
      return;
    }
    
    // Handle actual key events
    if (e.keyCode === 13) {
      // Handle Enter key
    }
  });
  ```

- **Use `beforeinput` events**: Consider using `beforeinput` events instead of `keydown` when possible, as they provide better composition state information:
  ```javascript
  element.addEventListener('beforeinput', (e) => {
    if (e.isComposing) {
      // Handle composition-related input
      return;
    }
    
    if (e.inputType === 'insertParagraph') {
      // Handle Enter key (line break)
    }
  });
  ```

- **Important**: `keyCode` is deprecated. Consider using `e.key` or `e.code` instead when possible, but note that `keyCode 229` is a special case that may still be relevant for IME handling.

