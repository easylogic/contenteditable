---
id: ce-0053-mobile-selection-handles-overlap
scenarioId: scenario-mobile-touch-behavior
locale: en
os: Android
osVersion: "Ubuntu 22.04"
device: Mobile
deviceVersion: Any
browser: Chrome
browserVersion: "120.0"
keyboard: System virtual keyboard
caseTitle: Selection handles overlap with content on mobile
description: "On Android Chrome, when selecting text in a contenteditable region, the selection handles (grab points for adjusting selection) may overlap with the content, making it difficult to see or interact"
tags:
  - mobile
  - selection
  - handles
  - android
status: draft
---

## Phenomenon

On Android Chrome, when selecting text in a contenteditable region, the selection handles (grab points for adjusting selection) may overlap with the content, making it difficult to see or interact with the selected text.

## Reproduction example

1. Open a contenteditable region on Android Chrome.
2. Long-press to start a text selection.
3. Observe the position of the selection handles.
4. Try to adjust the selection by dragging the handles.

## Observed behavior

- In Android Chrome, selection handles may overlap with content.
- The handles may obscure the selected text.
- It may be difficult to see what is selected.
- Adjusting the selection may be challenging.

## Expected behavior

- Selection handles should not overlap with content.
- They should be positioned clearly and visibly.
- The selected text should remain visible and accessible.

