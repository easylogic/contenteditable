---
id: ce-0071-contenteditable-with-autocorrect
scenarioId: scenario-ime-interaction-patterns
locale: en
os: iOS
osVersion: "17.0"
device: iPhone
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: autocorrect attribute behavior differs on contenteditable
description: "The autocorrect attribute, which controls automatic text correction on mobile keyboards, behaves differently on contenteditable elements compared to standard input elements. The correction suggestions may not appear or may behave inconsistently."
tags:
  - autocorrect
  - mobile
  - ios
  - safari
status: draft
---

## Phenomenon

The `autocorrect` attribute, which controls automatic text correction on mobile keyboards, behaves differently on contenteditable elements compared to standard input elements. The correction suggestions may interfere with editing.

## Reproduction example

1. Create a contenteditable div with `autocorrect="on"` or `autocorrect="off"`.
2. On an iOS device, focus the contenteditable.
3. Type text with intentional misspellings.
4. Observe autocorrect behavior and compare with standard inputs.

## Observed behavior

- In Safari on iOS, `autocorrect` may not respect the attribute value on contenteditable.
- Autocorrect suggestions may appear even when `autocorrect="off"`.
- Behavior may differ from standard input elements.

## Expected behavior

- `autocorrect` should work identically on contenteditable and standard inputs.
- The attribute value should be respected.
- Autocorrect should not interfere with IME composition.

