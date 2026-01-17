---
id: ce-0094-contenteditable-with-css-mix-blend-mode
scenarioId: scenario-css-mix-blend-mode
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: CSS mix-blend-mode may affect contenteditable text rendering
description: "When a contenteditable element has CSS mix-blend-mode applied, text rendering may be affected. Text may appear with incorrect colors, selection may not be visible, and caret may not render correctly."
tags:
  - css-mix-blend-mode
  - rendering
  - firefox
  - windows
status: draft
---

## Phenomenon

When a contenteditable element has CSS `mix-blend-mode` applied, text rendering may be affected. Text may appear with incorrect colors, selection may not be visible, and caret may not render correctly.

## Reproduction example

1. Create a contenteditable div with `mix-blend-mode: multiply` over a colored background.
2. Type text and observe color rendering.
3. Select text and observe selection visibility.
4. Observe caret rendering.
5. Compare with a contenteditable without mix-blend-mode.

## Observed behavior

- In Firefox on Windows, mix-blend-mode may affect text rendering.
- Text colors may be incorrect.
- Selection may not be visible.
- Caret may not render correctly.

## Expected behavior

- mix-blend-mode should not affect text readability.
- Selection should be visible.
- Caret should render correctly.

