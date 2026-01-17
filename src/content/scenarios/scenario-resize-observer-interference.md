---
id: scenario-resize-observer-interference
title: ResizeObserver may cause layout shifts during contenteditable editing
description: "When a ResizeObserver is attached to a contenteditable element, the observer may trigger during editing as content changes size. This can cause layout recalculations and visual jumps, especially when the contenteditable has dynamic height."
category: performance
tags:
  - resize-observer
  - layout
  - performance
  - chrome
  - windows
status: draft
locale: en
---

When a ResizeObserver is attached to a contenteditable element, the observer may trigger during editing as content changes size. This can cause layout recalculations and visual jumps, especially when the contenteditable has dynamic height.

## References

- [MDN: Resize Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API) - ResizeObserver documentation
- [Medium: After MutationObserver, PerformanceObserver, IntersectionObserver](https://medium.com/dev-channel/after-mutationobserver-performanceobserver-and-intersectionobserver-we-have-another-observer-for-2c541bcb531b) - Observer timing
- [BhojPress: Observer patterns in JavaScript](https://bhojpress.com/blogs/libraries-frameworks/exploring-observer-patterns-in-javascript-efficient-techniques-for-dynamic-uis-and-performance-optimization) - Performance optimization
- [Stack Overflow: Dynamically height-adjusted textarea without reflows](https://stackoverflow.com/questions/57965268/possible-to-have-a-dynamically-height-adjusted-textarea-without-constant-reflows) - Layout optimization
- [W3C CSSWG Issue #9560: ResizeObserver loop limit](https://github.com/w3c/csswg-drafts/issues/9560) - Loop limit issues
- [Web.dev: Avoid large complex layouts](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing) - Layout thrashing
- [CSS-Tricks: Content jumping avoid](https://css-tricks.com/content-jumping-avoid/) - Placeholder sizes
- [Reddit: CSS layout quirks](https://www.reddit.com/r/css/comments/s817ya) - Box model issues
