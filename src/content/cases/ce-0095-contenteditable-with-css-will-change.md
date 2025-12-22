---
id: ce-0095
scenarioId: scenario-css-will-change
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: CSS will-change may improve or degrade contenteditable performance
description: "When a contenteditable element has CSS will-change property set, performance may be affected. In some cases, it may improve performance by hinting the browser about upcoming changes. In other cases, it may cause unnecessary layer creation and degrade performance."
tags:
  - css-will-change
  - performance
  - chrome
  - macos
status: draft
---

### Phenomenon

When a contenteditable element has CSS `will-change` property set, performance may be affected. In some cases, it may improve performance by hinting the browser about upcoming changes. In other cases, it may degrade performance by creating unnecessary layers.

### Reproduction example

1. Create a contenteditable div with `will-change: contents` or `will-change: transform`.
2. Type text rapidly and measure performance.
3. Try different will-change values.
4. Compare performance with and without will-change.
5. Check memory usage.

### Observed behavior

- In Chrome on macOS, will-change may have mixed effects on performance.
- Some values may improve performance.
- Other values may degrade performance.
- Memory usage may increase.

### Expected behavior

- will-change should provide consistent performance benefits.
- Or, the behavior should be clearly documented.
- Memory usage should remain reasonable.

