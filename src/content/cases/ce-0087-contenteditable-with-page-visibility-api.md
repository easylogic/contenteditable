---
id: ce-0087
scenarioId: scenario-page-visibility-api
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Page Visibility API may affect contenteditable during tab switches
description: "When a page with a contenteditable element becomes hidden (tab switch, minimize), the Page Visibility API may affect editing state. Focus may be lost, and composition may be interrupted."
tags:
  - page-visibility-api
  - focus
  - safari
  - macos
status: draft
---

## Phenomenon

When a page with a contenteditable element becomes hidden (tab switch, minimize), the Page Visibility API may affect editing state. Focus may be lost, and composition may be interrupted.

## Reproduction example

1. Create a contenteditable div with active composition (IME).
2. Switch to another tab or minimize the window.
3. Switch back to the original tab.
4. Observe whether composition continues or is interrupted.
5. Check if focus is maintained.

## Observed behavior

- In Safari on macOS, tab switches may interrupt composition.
- Focus may be lost when the page becomes hidden.
- Composition state may not be preserved.
- Editing may be disrupted.

## Expected behavior

- Composition should pause gracefully when the page is hidden.
- Focus should be restored when the page becomes visible.
- Editing state should be preserved across visibility changes.

