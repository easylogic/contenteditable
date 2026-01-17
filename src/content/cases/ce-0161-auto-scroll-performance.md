---
id: ce-0161-auto-scroll-performance
scenarioId: scenario-auto-scroll-on-typing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Auto-scroll causes performance issues during rapid typing
description: "When typing rapidly near the edges of a contenteditable element in Chrome, the frequent auto-scrolling causes performance issues. The page becomes laggy and typing feels unresponsive."
tags:
  - scroll
  - performance
  - typing
  - chrome
status: draft
---

## Phenomenon

When typing rapidly near the edges of a contenteditable element in Chrome, the frequent auto-scrolling causes performance issues. The page becomes laggy and typing feels unresponsive.

## Reproduction example

1. Create a contenteditable element with scrollable content
2. Type text rapidly near the bottom edge
3. Observe performance

## Observed behavior

- Page becomes laggy
- Typing feels unresponsive
- Scroll operations are expensive
- Performance degrades significantly

## Expected behavior

- Scrolling should be smooth and performant
- Typing should remain responsive
- Performance should not degrade
- Scroll should be optimized

## Browser Comparison

- **Chrome/Edge**: May have performance issues (this case)
- **Firefox**: Similar performance problems
- **Safari**: Performance varies

## Notes and possible direction for workarounds

- Throttle scroll operations
- Use `requestAnimationFrame` for smooth scrolling
- Debounce scroll calculations
- Optimize scroll performance

