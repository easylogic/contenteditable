---
id: ce-0149
scenarioId: scenario-selection-restoration
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Firefox
browserVersion: "120.0"
keyboard: US
caseTitle: Selection range becomes invalid after inserting content
description: "When programmatically inserting content (text, elements) into a contenteditable element in Firefox, the selection range becomes invalid. The cursor position is lost and cannot be restored."
tags:
  - selection
  - range
  - insert
  - firefox
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="background: yellow;">World</span>'
    description: "Selected text (World)"
  - label: "After Insert (Bug)"
    html: 'Hello <span style="background: yellow;">World</span> New'
    description: "After programmatic insertion, selection range invalidated, cursor position unclear"
  - label: "✅ Expected"
    html: 'Hello <span style="background: yellow;">World</span> New'
    description: "Expected: Selection range valid, cursor positioned after inserted content"
---

## Phenomenon

When programmatically inserting content (text, elements) into a contenteditable element in Firefox, the selection range becomes invalid. The cursor position is lost and cannot be restored.

## Reproduction example

1. Select some text
2. Programmatically insert content at selection
3. Check selection state

## Observed behavior

- Selection range becomes invalid
- Cursor position is lost
- Cannot continue editing at correct position
- Selection cannot be restored

## Expected behavior

- Selection should remain valid after insertion
- Cursor should be positioned after inserted content
- User should be able to continue editing
- Selection should be restored properly

## Browser Comparison

- **Chrome/Edge**: Selection generally remains valid
- **Firefox**: Selection becomes invalid (this case)
- **Safari**: Selection restoration most unreliable

## Notes and possible direction for workarounds

- Save selection before insertion
- Restore selection after insertion
- Use Range API to maintain valid selection
- Handle invalid selection gracefully

