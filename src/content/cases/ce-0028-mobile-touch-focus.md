---
id: ce-0028
scenarioId: scenario-mobile-touch-behavior
locale: en
os: iOS
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: Touch events interfere with contenteditable focus on mobile
description: "On iOS Safari, touch events (tap, long-press) on a contenteditable region may not properly focus the element. The virtual keyboard may not appear, or focus may be lost unexpectedly."
tags:
  - mobile
  - touch
  - focus
  - ios
status: draft
---

### Phenomenon

On iOS Safari, touch events (tap, long-press) on a contenteditable region may not properly focus the element. The virtual keyboard may not appear, or focus may be lost unexpectedly.

### Reproduction example

1. Open a contenteditable region on iOS Safari.
2. Tap on the contenteditable area.
3. Observe whether the element receives focus and the keyboard appears.
4. Try long-pressing to select text.

### Observed behavior

- In iOS Safari, tapping may not focus the contenteditable.
- The virtual keyboard may not appear.
- Long-press for text selection may trigger browser context menu instead.
- Focus may be lost when interacting with other page elements.

### Expected behavior

- Tapping should focus the contenteditable and show the virtual keyboard.
- Long-press should allow text selection.
- Focus should be maintained during normal editing operations.

