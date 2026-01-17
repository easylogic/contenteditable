---
id: ce-0096-ime-composition-duplicate-events-ios-safari
scenarioId: scenario-ime-composition-duplicate-events
locale: en
os: iOS
osVersion: "17.0"
device: iPhone or iPad
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: Korean (IME)
caseTitle: IME composition triggers deleteContentBackward and insertText events sequentially in iOS Safari
description: "During Korean IME composition in iOS Safari, each composition update fires both a deleteContentBackward event followed by an insertText event (not insertCompositionText). This sequential firing pattern differs from other browsers where only insertCompositionText fires, and can cause event handlers to execute twice for a single composition update."
tags:
  - composition
  - ime
  - beforeinput
  - ios
  - safari
  - duplicate-events
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한</span>'
    description: "Korean composition in progress"
  - label: "After composition update (Bug)"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한글</span>'
    description: "deleteContentBackward + insertText events occur sequentially (double processing)"
  - label: "✅ Expected"
    html: 'Hello <span style="text-decoration: underline; background: #fef08a;">한글</span>'
    description: "Expected: Only insertCompositionText event occurs (single processing)"
---

## Phenomenon

During Korean IME composition in iOS Safari, each composition update fires both a `deleteContentBackward` event followed by an `insertText` event (not `insertCompositionText`). This sequential firing pattern differs from other browsers where only `insertCompositionText` fires during composition updates, and can cause event handlers to execute twice for a single composition update.

## Reproduction example

1. Focus a `contenteditable` element on iOS Safari.
2. Activate Korean IME.
3. Start composing a word (e.g., type "ㅎ" then "ㅏ" then "ㄴ" to compose "한").
4. Observe the `beforeinput` events in the browser console or event log.

## Observed behavior

When composing Korean text (e.g., typing "한글"):
1. User types a character that updates the composition
2. `beforeinput` event fires with `inputType: 'deleteContentBackward'` to remove the previous composition text
3. `beforeinput` event fires again with `inputType: 'insertText'` (not `insertCompositionText`) to insert the new composition text
4. Both events have `e.isComposing === true`
5. Event handlers that process both `deleteContentBackward` and `insertText` will execute twice for each composition update
6. The fact that `insertText` (not `insertCompositionText`) fires during composition can cause handlers expecting `insertCompositionText` to miss these events

## Expected behavior

- During composition updates, only `insertCompositionText` should fire (as in Chrome/Edge)
- If both events fire, they should be treated as a single atomic operation
- Event handlers should not need special logic to deduplicate composition updates
- `insertText` should not fire during active composition (only `insertCompositionText` should)

## Impact

This can lead to:
- Performance issues (double processing)
- Incorrect undo/redo stack management
- Duplicate validation or formatting logic execution
- State synchronization issues

## Browser Comparison

- **iOS Safari**: Fires `deleteContentBackward` followed by `insertText` (not `insertCompositionText`) during composition updates
- **Chrome/Edge**: Fires only `insertCompositionText` during composition updates
- **Firefox**: Behavior varies but generally more consistent with Chrome (fires `insertCompositionText`)

## Notes and possible direction for workarounds

- Check if the event is part of a composition sequence (`e.isComposing === true`)
- Avoid processing `deleteContentBackward` events during composition when they are immediately followed by `insertText`
- Handle `insertText` events during composition (not just `insertCompositionText`) in iOS Safari
- Use a flag to track if a `deleteContentBackward` event was immediately followed by an `insertText` event during composition
- Treat the `deleteContentBackward` + `insertText` pair as a single composition update operation

