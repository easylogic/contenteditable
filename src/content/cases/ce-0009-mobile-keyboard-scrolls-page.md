---
id: ce-0009
scenarioId: scenario-mobile-keyboard-scroll
locale: en
os: iOS
osVersion: "17.0"
device: Mobile
deviceVersion: iPhone
browser: Safari
browserVersion: "17.0"
keyboard: System virtual keyboard
caseTitle: Virtual keyboard on mobile scrolls contenteditable out of view
tags:
  - mobile
  - keyboard
  - scroll
status: draft
---

### Phenomenon

On mobile devices, when the virtual keyboard appears while focusing a `contenteditable` element,
the page scrolls in a way that moves the caret or the editable region partially out of view.

### Reproduction example

1. Open the page on a mobile device.
2. Scroll so that the editable area is near the bottom of the viewport.
3. Tap inside the editable area to open the virtual keyboard.
4. Try typing and observe the caret position relative to the viewport.

### Observed behavior

- The page scrolls but does not keep the caret fully visible.
- In some cases, the editable area is partially covered by the keyboard.

### Expected behavior

- The caret and surrounding text remain visible while typing, without requiring manual scrolling.

### Notes

- This behavior is sensitive to viewport meta tags, scroll containers, and any custom scroll
  handling logic in the application.


