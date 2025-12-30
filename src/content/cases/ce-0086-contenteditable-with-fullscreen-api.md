---
id: ce-0086
scenarioId: scenario-fullscreen-api
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Fullscreen API may affect contenteditable focus and selection
description: "When a contenteditable element enters or exits fullscreen mode using the Fullscreen API, focus and selection may be lost. The caret position may reset, and editing may be disrupted."
tags:
  - fullscreen-api
  - focus
  - chrome
  - windows
status: draft
---

## Phenomenon

When a contenteditable element enters or exits fullscreen mode using the Fullscreen API, focus and selection may be lost. The caret position may reset, and editing may be disrupted.

## Reproduction example

1. Create a contenteditable div with some selected text.
2. Enter fullscreen mode programmatically.
3. Observe whether focus and selection are maintained.
4. Exit fullscreen mode.
5. Check if focus and selection are restored.

## Observed behavior

- In Chrome on Windows, fullscreen transitions may cause focus loss.
- Selection may be cleared when entering fullscreen.
- Caret position may reset.
- Editing may be disrupted during transition.

## Expected behavior

- Focus and selection should be maintained during fullscreen transitions.
- Caret position should be preserved.
- Editing should continue seamlessly.

