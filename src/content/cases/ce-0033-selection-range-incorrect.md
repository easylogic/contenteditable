---
id: ce-0033-selection-range-incorrect
scenarioId: scenario-selection-range-accuracy
locale: en
os: Windows
osVersion: "11"
device: Desktop or Laptop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: Selection range is incorrect when selecting across multiple elements
description: "When selecting text that spans across multiple HTML elements (e.g., p, div, span) in a contenteditable region, the selection range may not accurately reflect the visual selection. The getSelection() API may return ranges that do not match what the user sees."
tags:
  - selection
  - range
  - elements
  - edge
status: draft
domSteps:
  - label: "Before"
    html: '<p>First paragraph</p><p>Second paragraph</p>'
    description: "Two paragraphs, selected from middle of first paragraph to middle of second paragraph"
  - label: "Selection Range (Bug)"
    html: '<p>First paragraph</p><p>Second paragraph</p>'
    description: "getSelection() returns incorrect range, mismatches visual selection"
  - label: "✅ Expected"
    html: '<p>First paragraph</p><p>Second paragraph</p>'
    description: "Expected: getSelection() returns accurate range matching visual selection"
---

## Phenomenon

When selecting text that spans across multiple HTML elements (e.g., `<p>`, `<div>`, `<span>`) in a contenteditable region, the selection range may not accurately reflect the visual selection. The `Selection` and `Range` APIs may return incorrect boundaries.

## Reproduction example

1. Create a contenteditable div with nested elements:
   ```html
   <div contenteditable>
     <p>First paragraph</p>
     <p>Second paragraph</p>
   </div>
   ```
2. Select text that spans from the middle of the first paragraph to the middle of the second paragraph.
3. Use JavaScript to inspect the selection range.
4. Observe the reported start and end positions.

## Observed behavior

- In Edge on Windows, the selection range boundaries may not match the visual selection.
- The `Range.startOffset` and `Range.endOffset` may be incorrect.
- Selecting across element boundaries can produce unexpected results.

## Expected behavior

- The selection range should accurately reflect the visual selection.
- Boundaries should be correctly reported even when spanning multiple elements.
- The `Selection` and `Range` APIs should provide consistent, reliable data.

