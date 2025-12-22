---
id: ce-0088
scenarioId: scenario-media-query-layout
locale: en
os: iOS
osVersion: "17.0"
device: iPhone
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Media query layout changes may disrupt contenteditable editing
description: "When a page with a contenteditable element responds to media query changes (e.g., orientation change, window resize), the layout changes may disrupt editing. The caret position may jump, and select"
tags:
  - media-query
  - layout
  - mobile
  - ios
  - safari
status: draft
---

### Phenomenon

When a page with a contenteditable element responds to media query changes (e.g., orientation change, window resize), the layout changes may disrupt editing. The caret position may jump, and selection may be lost.

### Reproduction example

1. Create a contenteditable div on a responsive page.
2. Start editing with text selected.
3. Rotate the device or resize the window to trigger media query changes.
4. Observe whether editing continues smoothly.
5. Check if caret position and selection are maintained.

### Observed behavior

- In Safari on iOS, layout changes may disrupt editing.
- Caret position may jump during layout recalculation.
- Selection may be lost.
- The virtual keyboard may close unexpectedly.

### Expected behavior

- Layout changes should not disrupt editing.
- Caret position should be preserved.
- Selection should be maintained.
- Editing should continue seamlessly.

