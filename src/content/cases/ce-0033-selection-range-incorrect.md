---
id: ce-0033-selection-range-incorrect
scenarioId: scenario-selection-range-accuracy
locale: en
os: Windows
osVersion: "11"
device: Desktop
deviceVersion: Any
browser: Edge
browserVersion: "120.0"
keyboard: US
caseTitle: Selection range is incorrect when selecting across multiple elements
description: "When selecting text that spans from one block (e.g., <p>) to another, the getSelection() API in Edge can return a range that visually covers the text but logically starts/ends at the wrong node offsets."
tags: ["selection", "range", "multi-block", "edge"]
status: confirmed
---

## Phenomenon
Selecting across nested block structures causes the `Selection` API to report inconsistent boundaries. Visually, the highlight looks correct, but programmatically, the `anchorNode` or `focusNode` can jump to the parent container instead of the leaf text node.

## Reproduction Steps
1. Create two paragraphs: `<p>One</p><p>Two</p>`.
2. Select from the middle of "One" to the middle of "Two".
3. Call `window.getSelection().getRangeAt(0)`.
4. Observe that `startContainer` might be the parent `div` instead of the first `<p>`.

## Observed Behavior
Edge/Chrome engines sometimes optimize range calculations by collapsing boundaries to the nearest common block, losing the fine-grained text offset.
