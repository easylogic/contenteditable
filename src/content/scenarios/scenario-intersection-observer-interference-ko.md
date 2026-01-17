---
id: scenario-intersection-observer-interference-ko
title: IntersectionObserver가 contenteditable 가시성 감지에 영향을 줄 수 있음
description: "IntersectionObserver를 사용하여 contenteditable 요소가 표시되거나 숨겨지는 시점을 감지할 때, 편집 중에 옵저버가 올바르게 발생하지 않을 수 있습니다. 편집 중 콘텐츠 크기나 위치 변경이 예상대로 교차 업데이트를 트리거하지 않을 수 있습니다."
category: other
tags:
  - intersection-observer
  - visibility
  - safari
  - macos
status: draft
locale: ko
---

IntersectionObserver를 사용하여 contenteditable 요소가 표시되거나 숨겨지는 시점을 감지할 때, 편집 중에 옵저버가 올바르게 발생하지 않을 수 있습니다. 편집 중 콘텐츠 크기나 위치 변경이 예상대로 교차 업데이트를 트리거하지 않을 수 있습니다.

## 참고 자료

- [W3C Intersection Observer: Timing element visibility](https://www.w3.org/TR/2019/WD-intersection-observer-20190530/) - IntersectionObserver specification
- [GitHub Gist: WebKit contentEditable focus/blur behavior](https://gist.github.com/1081133/cfb74dde66261a892c5db1726ff97f7edcd3f780) - WebKit bugs
- [Stack Overflow: IntersectionObserver does not intercept elements with display contents](https://stackoverflow.com/questions/72741599/intersectionobserver-does-not-intercept-elements-with-display-contents) - Display issues
- [MDN: Intersection Observer API timing](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API/Timing_element_visibility) - Threshold configuration
