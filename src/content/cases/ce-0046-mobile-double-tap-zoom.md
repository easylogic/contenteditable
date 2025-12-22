---
id: ce-0046
scenarioId: scenario-mobile-touch-behavior
locale: en
os: iOS
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: Double-tap on contenteditable triggers page zoom
description: "On iOS Safari, double-tapping on a contenteditable region triggers page zoom instead of word selection. This interferes with the expected text editing behavior."
tags:
  - mobile
  - zoom
  - double-tap
  - ios
status: draft
---

### Phenomenon

On iOS Safari, double-tapping on a contenteditable region triggers page zoom instead of word selection. This interferes with the expected text editing behavior.

### Reproduction example

1. Open a page with a contenteditable region on iOS Safari.
2. Double-tap on a word within the contenteditable.
3. Observe whether the page zooms or the word is selected.

### Observed behavior

- In iOS Safari, double-tap triggers page zoom.
- Word selection does not occur as expected.
- The zoom interferes with text editing workflow.

### Expected behavior

- Double-tap should select the word, not zoom the page.
- Or, zoom should be disabled for contenteditable regions.
- Text selection should work as expected on mobile devices.

