---
id: ce-0082
scenarioId: scenario-intersection-observer-interference
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: IntersectionObserver may affect contenteditable visibility detection
description: "When an IntersectionObserver is used to detect when a contenteditable element becomes visible or hidden, the observer may not fire correctly during editing. Changes to content size or position duri"
tags:
  - intersection-observer
  - visibility
  - safari
  - macos
status: draft
---

## Phenomenon

When an IntersectionObserver is used to detect when a contenteditable element becomes visible or hidden, the observer may not fire correctly during editing. Changes to content size or position during editing may not trigger intersection updates as expected.

## Reproduction example

1. Create a contenteditable div that can scroll in and out of view.
2. Attach an IntersectionObserver to detect visibility.
3. Edit content that changes the element's size.
4. Scroll the contenteditable in and out of view.
5. Observe whether intersection callbacks fire correctly.

## Observed behavior

- In Safari on macOS, IntersectionObserver may not update correctly during editing.
- Content size changes may not trigger intersection recalculations.
- Visibility detection may be delayed or incorrect.
- The observer may miss rapid content changes.

## Expected behavior

- IntersectionObserver should work correctly with contenteditable.
- Content changes should trigger intersection recalculations.
- Visibility detection should be accurate and timely.

