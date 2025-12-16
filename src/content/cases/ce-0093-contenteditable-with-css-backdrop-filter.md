---
id: ce-0093
scenarioId: scenario-css-backdrop-filter
locale: en
os: iOS
osVersion: "17.0"
device: iPhone
deviceVersion: Any
browser: Safari
browserVersion: "17.0"
keyboard: US
caseTitle: CSS backdrop-filter may cause rendering issues in contenteditable
tags:
  - css-backdrop-filter
  - rendering
  - mobile
  - ios
  - safari
status: draft
---

### Phenomenon

When a contenteditable element has CSS `backdrop-filter` applied, rendering may be affected. Text may appear blurry, selection may not render correctly, and performance may be degraded, especially on mobile devices.

### Reproduction example

1. Create a contenteditable div with `backdrop-filter: blur(10px)`.
2. Type text and observe rendering quality.
3. Select text and observe selection rendering.
4. Scroll the contenteditable and observe performance.
5. Test on a mobile device.

### Observed behavior

- In Safari on iOS, backdrop-filter may cause rendering issues.
- Text may appear blurry or distorted.
- Selection may not render correctly.
- Performance may be poor, especially on mobile.

### Expected behavior

- backdrop-filter should not affect text rendering quality.
- Selection should render correctly.
- Performance should remain acceptable.

