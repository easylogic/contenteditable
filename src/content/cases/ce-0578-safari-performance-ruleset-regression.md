---
id: ce-0578
scenarioId: scenario-performance-foundations
locale: en
os: macOS
osVersion: "15.0"
device: Desktop
deviceVersion: Any
browser: Safari
browserVersion: "18.6"
keyboard: Any
caseTitle: "Safari 18.6: Layout thrashing during editing with large stylesheets"
description: "A regression in WebKit's RuleSet building logic causes O(n^2) performance degradation when editing inside a contenteditable container if the page has a large number of attribute-based CSS rules."
tags: ["performance", "safari-18", "css", "regression", "layout-thrashing"]
status: confirmed
domSteps:
  - label: "1. Load Large Stylesheet"
    html: '<style> [class*="attr-"] { color: red; } /* x 20,000 rules */ </style>'
    description: "Install a stylesheet with a massive number of attribute selectors."
  - label: "2. Trigger Mutation"
    html: '<div contenteditable="true" class="editor active">|</div>'
    description: "During typing, the editor framework adds/removes a class to the container (e.g., '.active')."
  - label: "3. Result (Bug)"
    html: '<!-- UI Hangs for >2s -->'
    description: "The browser spends excessive time in AttributeChangeInvalidation as it joins RuleSets inefficiently ($O(n^2)$)."
  - label: "✅ Expected"
    html: '<!-- Instant Update -->'
    description: "Style invalidation should be optimized to avoid blocking the main thread during simple character input."
---

## Phenomenon
Safari 18.6 (and related WebKit builds) introduced a regression where the internal `CSSSelectorList::makeJoining` method creates extreme performance bottlenecks. When a `contenteditable` editor triggers a style change (like adding a `focus` class or a highlight span), the engine attempts to rebuild invalidation sets for attribute selectors. On pages with large CSS frameworks using attribute selectors, this process scales quadratically, causing the UI to freeze during active typing.

## Reproduction Steps
1. Navigate to a page with a very large CSS file (e.g., a complex Tailwind or CSS-in-JS setup with >10,000 attribute rules).
2. Use an editor that dynamically applies classes to the `contenteditable` container or its parents upon focus or input.
3. Observe the latency between a key press and the character appearing on screen.
4. Profile the performance using Safari Web Inspector; look for `AttributeChangeInvalidation` or `RuleSet` building operations.

## Observed Behavior
- **Severe Typing Lag**: The main thread blocks for several hundred milliseconds (or seconds in extreme cases) for every event that modifies the DOM attributes.
- **Micro-Freezes**: Scrolling while the editor has focus also triggers layout invalidations that feel "choppy."

## Impact
- **Non-Performant UX**: Users perceive the application as heavy and unresponsive.
- **Failure in Complex Apps**: High-end CMS or IDE-like web editors become unusable because they rely on heavy CSS themes.

## Browser Comparison
- **Safari 18.6**: Exhibits $O(n^2)$ complexity regression.
- **Chrome / Firefox**: Implement more efficient invalidation bucketing for attribute selectors, maintaining $O(n \log n)$ or better performance.

## References & Solutions
### Mitigation: CSS Rule Flattening
Avoid using deeply nested attribute selectors (e.g., `[class*="..."]`) globally if they are not needed. Flattening rules into simple class names can bypass the expensive joining logic.

- [WebKit Bug #297591: Extremely slow applying a large style](https://bugs.webkit.org/show_bug.cgi?id=297591)
- [WebKit Commit 294191@main (Regression root)](https://github.com/WebKit/WebKit/commit/294191)
