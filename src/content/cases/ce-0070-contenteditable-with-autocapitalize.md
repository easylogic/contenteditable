---
id: ce-0070-contenteditable-with-autocapitalize
scenarioId: scenario-autocapitalize-behavior
locale: en
os: iOS
osVersion: "17.0"
device: iPhone
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: autocapitalize attribute works inconsistently on contenteditable
description: "The autocapitalize attribute, which controls automatic capitalization on mobile keyboards, works inconsistently on contenteditable elements. The behavior may differ from standard input elements."
tags:
  - autocapitalize
  - mobile
  - ios
  - safari
status: draft
---

## Phenomenon

The `autocapitalize` attribute, which controls automatic capitalization on mobile keyboards, works inconsistently on contenteditable elements. The behavior may differ from standard input elements.

## Reproduction example

1. Create a contenteditable div with `autocapitalize="sentences"`.
2. On an iOS device, focus the contenteditable.
3. Type text and observe capitalization behavior.
4. Compare with a standard input element with the same attribute.

## Observed behavior

- In Safari on iOS, `autocapitalize` may not work as expected on contenteditable.
- Capitalization behavior may differ from standard inputs.
- The attribute may be ignored in some cases.

## Expected behavior

- `autocapitalize` should work identically on contenteditable and standard inputs.
- Capitalization should follow the specified mode (sentences, words, characters, none).
- Behavior should be consistent across browsers and devices.

