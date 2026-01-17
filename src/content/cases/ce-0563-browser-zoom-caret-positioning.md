---
id: ce-0563-browser-zoom-caret-positioning
scenarioId: scenario-browser-zoom
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: Latest
keyboard: US
caseTitle: Browser zoom causes inaccurate caret positioning in contenteditable
description: "When the browser is zoomed (or content is scaled via CSS transforms), caret position and text selection in contenteditable elements become inaccurate. Clicking at a certain position places the caret elsewhere, and selection highlights may not match the visual selection."
tags:
  - zoom
  - caret
  - selection
  - positioning
  - firefox
status: draft
---

## Phenomenon

When the browser is zoomed (or content is scaled via CSS transforms), caret position and text selection in `contenteditable` elements become inaccurate. Clicking at a certain position places the caret elsewhere, and selection highlights may not match the visual selection.

## Reproduction example

1. Create a contenteditable element with some text
2. Zoom the browser to 150% or 200%
3. Try to click at a specific position in the text
4. Observe that caret appears at a different position than clicked

## Observed behavior

- **Caret position mismatch**: Clicking at a position shows caret elsewhere
- **Selection inaccuracy**: Selection highlights wrong text
- **Caret disappearing**: In Firefox when `transform: scale()` is used, caret becomes invisible
- **Pixel rounding errors**: Sub-pixel rendering causes coordinate calculation issues

## Expected behavior

- Caret position should match click position regardless of zoom level
- Selection should accurately highlight the intended text
- Caret should remain visible at all zoom levels

## Analysis

When the page is zoomed, computed coordinates (mouse clicks, bounding rectangles) end up falling between pixels. Browsers round differently, leading to the visible caret being placed incorrectly. This is especially problematic in Firefox when scaled down.

## Workarounds

- Use `display: inline-block` for contenteditable container
- Add visible `<br>` when empty to prevent Firefox caret invisibility
- Insert zero-width spaces around `contenteditable="false"` elements
- Avoid CSS `transform: scale`, use font-size adjustments instead
- Use `window.visualViewport` API for custom UI calculations
