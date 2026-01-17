---
id: ce-0122-auto-scroll-jarring
scenarioId: scenario-auto-scroll-on-typing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Auto-scroll is abrupt and jarring during rapid typing in Firefox
description: "When typing rapidly near the edges of a contenteditable element in Firefox, the automatic scrolling to keep the cursor visible is abrupt and jarring. The scroll happens suddenly rather than smoothly."
tags:
  - scroll
  - cursor
  - typing
  - firefox
status: draft
---

## Phenomenon

When typing rapidly near the edges of a contenteditable element in Firefox, the automatic scrolling to keep the cursor visible is abrupt and jarring. The scroll happens suddenly rather than smoothly.

## Reproduction example

1. Create a contenteditable element with scrollable content
2. Type text rapidly near the bottom edge
3. Observe scroll behavior

## Observed behavior

- Scroll happens abruptly without smooth animation
- Multiple scroll jumps may occur during rapid typing
- User experience is jarring
- Scroll position may jump unexpectedly

## Expected behavior

- Scroll should be smooth and gradual
- Scroll should happen predictably
- User experience should be pleasant
- Scroll should keep cursor visible without jarring

## Browser Comparison

- **Chrome/Edge**: Generally smoother scrolling
- **Firefox**: More abrupt scrolling (this case)
- **Safari**: Scroll behavior varies

## Notes and possible direction for workarounds

- Implement custom smooth scrolling
- Use `scrollIntoView` with smooth behavior
- Throttle scroll operations during rapid typing
- Use `requestAnimationFrame` for smooth scrolling

