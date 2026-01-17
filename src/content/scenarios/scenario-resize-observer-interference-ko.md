---
id: scenario-resize-observer-interference-ko
title: ResizeObserver가 contenteditable 편집 중 레이아웃 이동을 유발할 수 있음
description: "ResizeObserver가 contenteditable 요소에 연결되면 콘텐츠 크기가 변경될 때 편집 중에 옵저버가 트리거될 수 있습니다. 이것은 레이아웃 재계산과 시각적 점프를 유발할 수 있으며, 특히 contenteditable이 동적 높이를 가질 때 그렇습니다."
category: performance
tags:
  - resize-observer
  - layout
  - performance
  - chrome
  - windows
status: draft
locale: ko
---

ResizeObserver가 contenteditable 요소에 연결되면 콘텐츠 크기가 변경될 때 편집 중에 옵저버가 트리거될 수 있습니다. 이것은 레이아웃 재계산과 시각적 점프를 유발할 수 있으며, 특히 contenteditable이 동적 높이를 가질 때 그렇습니다.

## 참고 자료

- [MDN: Resize Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API) - ResizeObserver documentation
- [Medium: After MutationObserver, PerformanceObserver, IntersectionObserver](https://medium.com/dev-channel/after-mutationobserver-performanceobserver-and-intersectionobserver-we-have-another-observer-for-2c541bcb531b) - Observer timing
- [BhojPress: Observer patterns in JavaScript](https://bhojpress.com/blogs/libraries-frameworks/exploring-observer-patterns-in-javascript-efficient-techniques-for-dynamic-uis-and-performance-optimization) - Performance optimization
- [Stack Overflow: Dynamically height-adjusted textarea without reflows](https://stackoverflow.com/questions/57965268/possible-to-have-a-dynamically-height-adjusted-textarea-without-constant-reflows) - Layout optimization
- [W3C CSSWG Issue #9560: ResizeObserver loop limit](https://github.com/w3c/csswg-drafts/issues/9560) - Loop limit issues
- [Web.dev: Avoid large complex layouts](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing) - Layout thrashing
- [CSS-Tricks: Content jumping avoid](https://css-tricks.com/content-jumping-avoid/) - Placeholder sizes
- [Reddit: CSS layout quirks](https://www.reddit.com/r/css/comments/s817ya) - Box model issues
