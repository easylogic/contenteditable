---
id: ce-0131-auto-scroll-lag-rapid-typing
scenarioId: scenario-auto-scroll-on-typing
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Auto-scroll lags during rapid typing near edges
description: "When typing rapidly near the edges of a contenteditable element in Chrome, the automatic scrolling to keep the cursor visible lags behind the typing. The scroll happens after multiple characters are typed, causing the cursor to go out of view temporarily."
tags:
  - scroll
  - cursor
  - typing
  - performance
  - chrome
status: draft
---

## Phenomenon

When typing rapidly near the edges of a contenteditable element in Chrome, the automatic scrolling to keep the cursor visible lags behind the typing. The scroll happens after multiple characters are typed, causing the cursor to go out of view temporarily.

## Reproduction example

1. Create a contenteditable element with scrollable content
2. Type text rapidly near the bottom edge
3. Observe scroll timing

## Observed behavior

- Scroll happens after multiple characters are typed
- Cursor goes out of view temporarily
- Scroll catches up eventually
- User experience is degraded during rapid typing

## Expected behavior

- Scroll should happen immediately
- Cursor should stay visible
- Scroll should keep up with typing speed
- No lag should be noticeable

## Browser Comparison

- **Chrome/Edge**: Scroll may lag (this case)
- **Firefox**: More likely to lag
- **Safari**: Scroll timing varies

## Notes and possible direction for workarounds

- Implement custom scroll that happens immediately
- Use `requestAnimationFrame` for smooth scrolling
- Throttle scroll operations appropriately
- Check cursor position more frequently

