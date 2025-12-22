---
id: ce-0092
scenarioId: scenario-css-filter
locale: en
os: macOS
osVersion: "14.0"
device: Desktop or Laptop
deviceVersion: MacBook Pro
browser: Chrome
browserVersion: "120.0"
keyboard: US
caseTitle: CSS filter may affect contenteditable performance
description: "When a contenteditable element has CSS filters applied (blur, brightness, etc.), editing performance may be degraded. Typing may lag, and selection may be slow to update."
tags:
  - css-filter
  - performance
  - chrome
  - macos
status: draft
---

### Phenomenon

When a contenteditable element has CSS filters applied (blur, brightness, etc.), editing performance may be degraded. Typing may lag, and selection may be slow to update.

### Reproduction example

1. Create a contenteditable div with `filter: blur(2px) brightness(1.2)`.
2. Type text rapidly.
3. Observe typing lag or jank.
4. Try to select text and observe responsiveness.
5. Compare performance with a contenteditable without filters.

### Observed behavior

- In Chrome on macOS, CSS filters may cause performance issues.
- Typing may lag or stutter.
- Selection updates may be slow.
- The UI may become unresponsive during rapid editing.

### Expected behavior

- CSS filters should not significantly impact editing performance.
- Or, filters should be optimized for contenteditable use cases.
- Performance should remain acceptable with filters applied.

