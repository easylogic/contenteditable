---
id: ce-0003
scenarioId: scenario-double-line-break
locale: en
os: macOS
osVersion: "14.0"
device: Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: Pressing Enter inserts two line breaks in contenteditable
description: "In a plain contenteditable element, pressing Enter inserts two visible line breaks instead of one. The resulting DOM contains nested div or br elements that render as an extra blank line."
tags:
  - enter
  - newline
status: draft
domSteps:
  - label: "Before"
    html: 'Hello'
    description: "First line"
  - label: "After Enter (Bug)"
    html: 'Hello<br><br>'
    description: "Single Enter inserts two line breaks"
  - label: "✅ Expected"
    html: 'Hello<br>'
    description: "Expected: Single Enter inserts only one line break"
---

### Phenomenon

In a plain `contenteditable` element, pressing Enter inserts two visible line breaks instead of one.
The resulting DOM contains nested `<div>` or `<br>` elements that render as an extra blank line.

### Reproduction example

1. Focus the editable area.
2. Type a short word on the first line.
3. Press Enter once.
4. Type another word on what appears to be the second line.

### Observed behavior

- The visual gap between the lines is larger than a single line height.
- Inspecting the DOM shows two consecutive block-level containers or a sequence of `<br>` elements
  that corresponds to two line breaks.

### Expected behavior

- Pressing Enter once inserts a single paragraph break.

### Notes and possible direction for workarounds

- Check whether the browser uses `<div>`, `<p>`, or `<br>` to represent paragraph breaks in this
  configuration.
- Adjust CSS line-height and margins to verify whether the effect comes from DOM structure or
  styling.
- For products that must normalize the markup, consider translating the native structure into a
  controlled model (for example, a single `<p>` per line) before storing or diffing the content.


