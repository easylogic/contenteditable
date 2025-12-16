---
id: ce-0017
scenarioId: scenario-touch-selection-mobile
locale: en
os: iOS
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: Touch selection handles are difficult to use on mobile devices
tags:
  - mobile
  - touch
  - selection
  - ios
status: draft
---

### Phenomenon

On mobile devices, selecting text in a contenteditable region using touch is difficult. The selection handles are small and hard to grab, and the selection range may change unexpectedly when trying to adjust it.

### Reproduction example

1. Open a contenteditable region on a mobile device (iOS Safari).
2. Long-press to start a text selection.
3. Try to adjust the selection by dragging the handles.
4. Observe the difficulty in precisely controlling the selection.

### Observed behavior

- Selection handles are small and difficult to grab with a finger.
- Dragging the handles often results in scrolling the page instead of adjusting the selection.
- The selection may jump to unexpected positions when trying to fine-tune it.
- The selection may be lost when the virtual keyboard appears.

### Expected behavior

- Selection handles should be large enough to easily grab with a finger.
- Dragging handles should adjust the selection without scrolling the page.
- The selection should remain stable and controllable.

