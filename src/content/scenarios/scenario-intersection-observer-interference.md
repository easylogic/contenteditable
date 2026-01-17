---
id: scenario-intersection-observer-interference
title: IntersectionObserver may affect contenteditable visibility detection
description: "When an IntersectionObserver is used to detect when a contenteditable element becomes visible or hidden, the observer may not fire correctly during editing. Changes to content size or position during editing may not trigger intersection updates as expected."
category: other
tags:
  - intersection-observer
  - visibility
  - safari
  - macos
status: draft
locale: en
---

When an IntersectionObserver is used to detect when a contenteditable element becomes visible or hidden, the observer may not fire correctly during editing. Changes to content size or position during editing may not trigger intersection updates as expected.

## References

- [W3C Intersection Observer: Timing element visibility](https://www.w3.org/TR/2019/WD-intersection-observer-20190530/) - IntersectionObserver specification
- [GitHub Gist: WebKit contentEditable focus/blur behavior](https://gist.github.com/1081133/cfb74dde66261a892c5db1726ff97f7edcd3f780) - WebKit bugs
- [Stack Overflow: IntersectionObserver does not intercept elements with display contents](https://stackoverflow.com/questions/72741599/intersectionobserver-does-not-intercept-elements-with-display-contents) - Display issues
- [MDN: Intersection Observer API timing](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API/Timing_element_visibility) - Threshold configuration
