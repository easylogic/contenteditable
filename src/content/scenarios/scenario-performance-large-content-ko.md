---
id: scenario-performance-large-content-ko
title: "큰 contenteditable 콘텐츠로 인해 입력이 느려짐"
description: "contenteditable 영역에 많은 양의 콘텐츠(수천 개의 DOM 노드)가 포함되어 있으면 입력이 눈에 띄게 느려집니다. 키를 누르고 문자가 나타나는 사이에 눈에 띄는 지연이 있습니다."
category: performance
tags:
  - performance
  - large-content
  - typing
  - chrome
status: draft
locale: ko
---

contenteditable 영역에 많은 양의 콘텐츠(수천 개의 DOM 노드)가 포함되어 있으면 입력이 눈에 띄게 느려집니다. 키를 누르고 문자가 나타나는 사이에 눈에 띄는 지연이 있습니다.

## 참고 자료

- [Stack Overflow: Editable HTML content is very laggy when large](https://stackoverflow.com/questions/24888187/editable-html-content-is-very-laggy-when-it-is-large) - Performance discussion
- [Reddit: contenteditable performance with large content](https://www.reddit.com/r/webdev/comments/hwkdeg) - Community discussion
- [Microsoft Learn: DOM leaks memory tool - detached elements](https://learn.microsoft.com/en-us/microsoft-edge/devtools/memory-problems/dom-leaks-memory-tool-detached-elements) - Memory leak detection
- [Microsoft Learn: Memory problems](https://learn.microsoft.com/en-us/microsoft-edge/devtools/memory-problems/) - Memory debugging guide
- [Chrome DevTools: Memory problems](https://developer.chrome.com/docs/devtools/memory-problems) - Chrome memory debugging
- [Chrome DevTools: DOM Size insights](https://developer.chrome.com/docs/performance/insights/dom-size) - DOM size optimization
- [MoldStud: DOM manipulation performance tips](https://moldstud.com/articles/p-top-performance-optimization-tips-for-efficient-dom-manipulation-in-javascript) - Performance optimization strategies
