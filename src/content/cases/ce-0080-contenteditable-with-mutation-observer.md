---
id: ce-0080-contenteditable-with-mutation-observer
scenarioId: scenario-mutation-observer-interference
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: MutationObserver may interfere with contenteditable editing
description: "When a MutationObserver is attached to a contenteditable element or its parent, the observer callbacks may interfere with editing performance. Frequent DOM mutations during typing can trigger many"
tags:
  - mutation-observer
  - performance
  - editing
  - safari
  - macos
status: draft
---

## Phenomenon

When a MutationObserver is attached to a contenteditable element or its parent, the observer callbacks may interfere with editing performance. Frequent DOM mutations during typing can trigger many observer callbacks, causing lag or jank.

## Reproduction example

1. Create a contenteditable div.
2. Attach a MutationObserver that logs all mutations.
3. Type text rapidly in the contenteditable.
4. Observe performance and any lag.
5. Compare with typing without the observer.

## Observed behavior

- In Safari on macOS, MutationObserver callbacks can cause performance issues.
- Rapid typing may trigger many mutations and callbacks.
- The UI may lag or become unresponsive.
- Performance degrades with complex observer logic.

## Expected behavior

- MutationObserver should not significantly impact editing performance.
- Or, there should be a way to batch mutations.
- Callbacks should be optimized for contenteditable use cases.

