---
id: ce-0110
scenarioId: scenario-selection-restoration
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: Text selection is lost after programmatic DOM manipulation
description: "After programmatically manipulating the DOM (e.g., inserting content, applying formatting), the text selection (cursor position) is lost or moved to an incorrect position. This makes it difficult to implement custom editing features."
tags:
  - selection
  - range
  - cursor
  - chrome
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="background: yellow;">World</span>'
    description: "Selected text (World)"
  - label: "After DOM Update (Bug)"
    html: 'Hello <strong>World</strong>'
    description: "After DOM manipulation, selection lost, cursor position unclear"
  - label: "✅ Expected"
    html: 'Hello <strong>World</strong>'
    description: "Expected: Selection restored, cursor at correct position"
---

### Phenomenon

After programmatically manipulating the DOM (e.g., inserting content, applying formatting), the text selection (cursor position) is lost or moved to an incorrect position. This makes it difficult to implement custom editing features.

### Reproduction example

1. Select some text in contenteditable
2. Programmatically insert content or apply formatting
3. Check cursor position

### Observed behavior

- Selection is lost (no cursor visible)
- Or cursor moves to unexpected position
- Selection range becomes invalid
- User loses track of editing position

### Expected behavior

- Selection should be restored after DOM manipulation
- Cursor should be in correct position
- Selection should remain valid
- User should be able to continue editing seamlessly

### Browser Comparison

- **Chrome/Edge**: Selection may be lost (this case)
- **Firefox**: More likely to lose selection
- **Safari**: Selection restoration most unreliable

### Notes and possible direction for workarounds

- Save selection before DOM manipulation
- Restore selection after manipulation
- Use `Range` API to save/restore selection
- Handle invalid selection gracefully
- Use `requestAnimationFrame` for timing

