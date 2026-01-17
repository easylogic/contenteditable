---
id: ce-0072-contenteditable-with-enterkeyhint
scenarioId: scenario-enterkeyhint-behavior
locale: en
os: Android
osVersion: "14.0"
device: Smartphone
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: enterkeyhint attribute does not work on contenteditable
description: "The enterkeyhint attribute, which controls the label on the Enter key on mobile keyboards, does not work on contenteditable elements. The Enter key label remains the default regardless of the attribute value."
tags:
  - enterkeyhint
  - mobile
  - android
  - chrome
status: draft
---

## Phenomenon

The `enterkeyhint` attribute, which controls the label on the Enter key on mobile keyboards, does not work on contenteditable elements. The Enter key label remains the default regardless of the attribute value.

## Reproduction example

1. Create a contenteditable div with `enterkeyhint="send"` or `enterkeyhint="search"`.
2. On an Android device, focus the contenteditable.
3. Observe the Enter key label on the virtual keyboard.
4. Compare with a standard input element with the same attribute.

## Observed behavior

- In Chrome on Android, `enterkeyhint` is ignored on contenteditable.
- The Enter key always shows the default label.
- No customization is possible.

## Expected behavior

- `enterkeyhint` should work on contenteditable elements.
- The Enter key label should reflect the attribute value.
- Behavior should match standard input elements.

