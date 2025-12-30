---
id: ce-0008
scenarioId: scenario-selection-collapse-on-blur
locale: en
os: macOS
osVersion: "Ubuntu 22.04"
device: Laptop
deviceVersion: Any
browser: Safari
browserVersion: "120.0"
keyboard: US
caseTitle: Selection collapses unexpectedly when clicking outside contenteditable
description: "When a range of text is selected inside a contenteditable element, clicking outside the element collapses the selection to a caret position inside the editable region instead of clearing the selection entirely."
tags:
  - selection
  - caret
status: draft
domSteps:
  - label: "Before"
    html: 'Hello <span style="background: #bfdbfe;">World</span> Test'
    description: "Text selected (World highlighted)"
  - label: "After Click Outside (Bug)"
    html: 'Hello World| Test'
    description: "When clicking outside, selection not fully cleared but collapsed to cursor"
  - label: "✅ Expected"
    html: 'Hello World Test'
    description: "Expected: When clicking outside, selection fully cleared"
---

## Phenomenon

When a range of text is selected inside a `contenteditable` element, clicking outside the element
collapses the selection to a caret position inside the editable region instead of clearing the
selection entirely.

## Reproduction example

1. Focus the editable area.
2. Type a few words across multiple lines.
3. Drag to select part of a line or multiple lines.
4. Click outside the editable area, for example on the page background.

## Observed behavior

- The selection collapses to a single caret position inside the editable element.
- The range is not cleared, which can cause confusion for users relying on visual feedback.

## Expected behavior

- The selection is cleared entirely when the element loses focus, or at least behaves similarly to
  native text fields in the same browser and OS combination.

## Notes

- This behavior can affect keyboard shortcuts (for example, copy or delete) if they are bound to
  the selection state.


