---
id: ce-0564-browser-dark-mode-caret-invisible
scenarioId: scenario-browser-dark-mode
locale: en
os: Any
osVersion: Any
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: Latest
keyboard: US
caseTitle: Caret becomes invisible in dark mode
description: "When browser dark mode is enabled, the caret in contenteditable elements may become invisible or poorly visible because it uses currentColor or text color, making it blend with dark backgrounds. Child elements with position: relative can also interfere with caret rendering."
tags:
  - dark-mode
  - caret
  - styling
  - visibility
status: draft
---

## Phenomenon

When browser dark mode is enabled, the caret in `contenteditable` elements may become invisible or poorly visible because it uses `currentColor` or text color, making it blend with dark backgrounds.

## Reproduction example

1. Enable browser dark mode (system dark mode or browser setting)
2. Create a contenteditable element with dark background
3. Focus the element and start typing
4. Observe that caret is invisible or hard to see

## Observed behavior

- **Invisible caret**: Caret uses `currentColor` or text color, making it invisible against dark backgrounds
- **Child element interference**: Elements with `position: relative` can interfere with caret rendering
- **Inline style conflicts**: Browser-injected inline styles may override dark mode CSS
- **Poor contrast**: Default link colors have poor contrast against dark backgrounds

## Expected behavior

- Caret should be visible regardless of color scheme
- Caret color should have sufficient contrast against background
- Dark mode should be properly supported

## Analysis

Without declaring `color-scheme: light dark`, browsers may not know content supports dark mode, so default styles may conflict. The caret color defaults to text color, which may blend with dark backgrounds.

## Workarounds

- Use `color-scheme: light dark` declaration
- Set explicit `caret-color` CSS property
- Avoid `position: relative` on inline child spans
- Override inline styles injected by browser
- Use dark mode media query to define appropriate colors
