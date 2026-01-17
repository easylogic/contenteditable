---
id: ce-0550-ime-composition-events-missing-ios-ko
scenarioId: scenario-ime-composition-events-missing
locale: ko
os: iOS
osVersion: Any
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: Latest
keyboard: Korean
caseTitle: Composition events not triggered in iOS Safari with Korean keyboard
description: "In iOS Safari, composition events (compositionstart, compositionupdate, compositionend) may not fire when using Korean keyboard, making it difficult to detect composition state."
tags:
  - ime
  - composition
  - ios
  - safari
  - korean
  - mobile
status: draft
---

## Phenomenon

In iOS Safari, when using Korean keyboard input, `composition` events may not fire as expected. This makes it difficult to detect when IME composition is active, leading to issues with character handling and event processing.

## Reproduction example

1. Open a contenteditable div in iOS Safari.
2. Switch to Korean keyboard.
3. Type Korean characters (e.g., "안녕하세요").
4. Monitor for `compositionstart`, `compositionupdate`, and `compositionend` events.
5. Observe that these events may not fire or fire inconsistently.

## Observed behavior

- **compositionstart**: May not fire when Korean input begins.
- **compositionupdate**: May not fire during character composition.
- **compositionend**: May not fire when composition completes.
- **beforeinput events**: May fire with `inputType: "insertCompositionText"` but composition events are missing.
- **input events**: Fire normally but without composition context.
- This behavior is specific to iOS Safari and may not occur in other browsers.

## Expected behavior

- `compositionstart` should fire when IME composition begins.
- `compositionupdate` should fire as the composition text changes.
- `compositionend` should fire when composition is committed or cancelled.
- Event sequence should be: `compositionstart` → `compositionupdate` (multiple) → `compositionend` → `input`.

## Analysis

iOS Safari handles IME input differently from desktop browsers. The composition events may be suppressed or handled internally by the browser, making them unavailable to JavaScript event listeners.

## Workarounds

- Rely on `beforeinput` events with `inputType: "insertCompositionText"` to detect composition.
- Use `input` events and track state manually.
- Check for composition state using `document.activeElement` and selection ranges.
- Implement fallback detection mechanisms for iOS Safari.
