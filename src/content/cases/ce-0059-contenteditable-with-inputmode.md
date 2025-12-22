---
id: ce-0059
scenarioId: scenario-inputmode-behavior
locale: en
os: iOS
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: inputmode attribute does not affect virtual keyboard on mobile
description: "The inputmode attribute, which should control the type of virtual keyboard shown on mobile devices, does not work on contenteditable regions in iOS Safari. The keyboard type cannot be controlled."
tags:
  - inputmode
  - mobile
  - keyboard
  - ios
status: draft
---

### Phenomenon

The `inputmode` attribute, which should control the type of virtual keyboard shown on mobile devices, does not work on contenteditable regions in iOS Safari. The keyboard type cannot be controlled.

### Reproduction example

1. Create a contenteditable div with `inputmode="numeric"`.
2. Open the page on iOS Safari.
3. Focus the contenteditable.
4. Observe the type of virtual keyboard that appears.

### Observed behavior

- In iOS Safari, the `inputmode` attribute is ignored on contenteditable.
- The default keyboard always appears.
- Numeric, email, or URL keyboards cannot be triggered.

### Expected behavior

- The `inputmode` attribute should control the virtual keyboard type.
- Numeric, email, URL, and other keyboard types should be available.
- Behavior should match standard input elements.

