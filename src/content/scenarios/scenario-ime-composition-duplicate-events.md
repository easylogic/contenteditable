---
id: scenario-ime-composition-duplicate-events
title: IME composition triggers deleteContentBackward and insertText events sequentially in iOS Safari
description: "During Korean IME composition in iOS Safari, each composition update fires both a deleteContentBackward event followed by an insertText event (not insertCompositionText). This sequential firing pattern differs from other browsers where only insertCompositionText fires, and can cause event handlers to execute twice for a single composition update."
category: ime
tags:
  - ime
  - composition
  - beforeinput
  - ios
  - safari
  - duplicate-events
status: draft
---

During Korean IME composition in iOS Safari, each composition update fires both a `deleteContentBackward` event followed by an `insertText` event (not `insertCompositionText`). This sequential firing pattern differs from other browsers where only `insertCompositionText` fires during composition updates, and can cause event handlers to execute twice for a single composition update.

## Observed Behavior

When composing Korean text (e.g., typing "한글"):
1. User types a character that updates the composition
2. `beforeinput` event fires with `inputType: 'deleteContentBackward'` to remove the previous composition text
3. `beforeinput` event fires again with `inputType: 'insertText'` (not `insertCompositionText`) to insert the new composition text
4. Both events have `e.isComposing === true`

## Impact

- Event handlers that process both `deleteContentBackward` and `insertText` will execute twice for each composition update
- This can lead to:
  - Performance issues (double processing)
  - Incorrect undo/redo stack management (two operations instead of one)
  - Duplicate validation or formatting logic execution
  - State synchronization issues
- The fact that `insertText` (not `insertCompositionText`) fires during composition can cause handlers expecting `insertCompositionText` to miss these events

## Browser Comparison

- **iOS Safari**: Fires `deleteContentBackward` followed by `insertText` (not `insertCompositionText`) during composition updates
- **Chrome/Edge**: Fires only `insertCompositionText` during composition updates
- **Firefox**: Behavior varies but generally more consistent with Chrome (fires `insertCompositionText`)

## Workaround

When handling `beforeinput` events during composition in iOS Safari, check if the event is part of a composition sequence and avoid processing `deleteContentBackward` events that are immediately followed by `insertText` events:

```javascript
let lastCompositionDelete = null;

element.addEventListener('beforeinput', (e) => {
  if (e.isComposing) {
    if (e.inputType === 'deleteContentBackward') {
      // Store for potential pairing with insertText
      lastCompositionDelete = e;
      return; // Don't process deleteContentBackward during composition
    }
    
    if (e.inputType === 'insertText') {
      // iOS Safari fires insertText (not insertCompositionText) during composition
      if (lastCompositionDelete) {
        // This insertText is paired with the previous deleteContentBackward
        // Process only the insertText event as a single composition update
        lastCompositionDelete = null;
      }
      // Handle composition text insertion
      // Note: e.data contains the composed text
    }
  }
});
```

**Important**: In iOS Safari, `insertText` (not `insertCompositionText`) fires during composition, so handlers should check for both `insertText` and `insertCompositionText` when handling composition updates.

