---
id: ce-0049
scenarioId: scenario-ime-ui-positioning
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: Japanese IME
caseTitle: IME candidate window appears in wrong position
tags:
  - ime
  - ui
  - positioning
  - chrome
status: draft
---

### Phenomenon

When using an IME (Input Method Editor) in Chrome on macOS, the candidate window (which shows possible character conversions) may appear in the wrong position relative to the caret. It may be offset or appear far from where the user is typing.

### Reproduction example

1. Create a contenteditable div.
2. Switch to Japanese IME.
3. Start typing Japanese characters.
4. Observe the position of the IME candidate window relative to the caret.

### Observed behavior

- In Chrome on macOS, the IME candidate window may appear in the wrong position.
- It may be offset from the caret location.
- The positioning may be incorrect when the contenteditable is scrolled or positioned.

### Expected behavior

- The IME candidate window should appear near the caret position.
- It should follow the caret as the user types.
- Positioning should be accurate regardless of scroll or layout.

