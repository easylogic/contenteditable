---
id: ce-0305-beforeinput-not-cancelable-ime-ko
scenarioId: scenario-beforeinput-not-cancelable-ime
locale: ko
os: Windows
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: Korean
caseTitle: beforeinput event not cancelable during IME composition
description: "In Chrome, the beforeinput event is not cancelable when inputType is 'insertCompositionText', preventing interception of IME input during composition."
tags:
  - beforeinput
  - ime
  - composition
  - cancelable
  - chrome
status: draft
---

## Phenomenon

In Chrome, when using IME (Input Method Editor) for languages like Korean, Japanese, or Chinese, the `beforeinput` event fires with `inputType: "insertCompositionText"`, but the event is not cancelable. This prevents developers from intercepting and modifying IME input during composition.

## Reproduction example

1. Create a contenteditable div.
2. Add a `beforeinput` event listener that calls `e.preventDefault()`.
3. Switch to Korean IME.
4. Type Korean characters to trigger composition.
5. Observe that `e.preventDefault()` has no effect and input is still inserted.

## Observed behavior

- **beforeinput event**: Fires with `inputType: "insertCompositionText"` during IME composition.
- **cancelable property**: `e.cancelable` is `false` for composition input.
- **preventDefault()**: Has no effect, input is still inserted.
- **Other inputTypes**: Regular `insertText` events are cancelable.
- **Browser consistency**: This behavior aligns with Input Events Level 2 specification.
- **Composition events**: `compositionstart`, `compositionupdate`, `compositionend` still fire normally.

## Expected behavior

- `beforeinput` events should be cancelable to allow interception of all input types.
- `e.preventDefault()` should prevent IME composition text from being inserted.
- Developers should be able to modify or cancel composition input.

## Analysis

According to the Input Events Level 2 specification, `beforeinput` events with `inputType: "insertCompositionText"` are intentionally non-cancelable. This is to prevent breaking IME composition flow, which relies on specific event sequences and DOM state.

## Workarounds

- Use `compositionupdate` and `compositionend` events to track IME state.
- Modify DOM after `input` event fires (less ideal, may cause flicker).
- Use `getTargetRanges()` from `beforeinput` to inspect what will be inserted.
- Implement custom IME handling that works around the non-cancelable limitation.
- Track composition state manually and apply modifications after composition completes.
