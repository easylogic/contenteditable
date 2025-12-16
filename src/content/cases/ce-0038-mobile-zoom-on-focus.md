---
id: ce-0038
scenarioId: scenario-mobile-touch-behavior
locale: en
os: iOS
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: Page zooms in when focusing contenteditable on mobile
tags:
  - mobile
  - zoom
  - focus
  - ios
status: draft
---

### Phenomenon

On iOS Safari, when a contenteditable region receives focus, the page may automatically zoom in. This can be disorienting and may cause layout issues.

### Reproduction example

1. Open a page with a contenteditable region on iOS Safari.
2. Ensure the viewport meta tag has `user-scalable=no` or a fixed `width`.
3. Tap on the contenteditable region to focus it.
4. Observe whether the page zooms in.

### Observed behavior

- In iOS Safari, focusing a contenteditable may trigger automatic zoom.
- The zoom level may be unexpected or inappropriate.
- The zoom may persist even after the contenteditable loses focus.

### Expected behavior

- Focusing a contenteditable should not trigger automatic zoom.
- Or, the zoom behavior should be controllable via CSS or meta tags.
- The viewport should remain stable during focus changes.

