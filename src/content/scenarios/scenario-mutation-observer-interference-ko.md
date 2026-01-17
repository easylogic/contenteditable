---
id: scenario-mutation-observer-interference-ko
title: MutationObserver가 contenteditable 편집을 간섭할 수 있음
description: "MutationObserver가 contenteditable 요소나 그 부모에 연결되면 옵저버 콜백이 편집 성능을 간섭할 수 있습니다. 입력 중 빈번한 DOM 변환이 많은 옵저버 콜백을 트리거하여 지연이나 버벅임을 유발할 수 있습니다."
category: performance
tags:
  - mutation-observer
  - performance
  - editing
  - safari
  - macos
status: draft
locale: ko
---

MutationObserver가 contenteditable 요소나 그 부모에 연결되면 옵저버 콜백이 편집 성능을 간섭할 수 있습니다. 입력 중 빈번한 DOM 변환이 많은 옵저버 콜백을 트리거하여 지연이나 버벅임을 유발할 수 있습니다.

## 참고 자료

- [Stack Overflow: How to reproduce batched mutations from MutationObserver](https://stackoverflow.com/questions/65722353/how-to-reproduce-batched-mutations-from-mutationobserver-in-contenteditable) - Mutation batching
- [BhojPress: Exploring Observer Patterns in JavaScript](https://bhojpress.com/blogs/libraries-frameworks/exploring-observer-patterns-in-javascript-efficient-techniques-for-dynamic-uis-and-performance-optimization) - Performance optimization
- [Stack Overflow: MutationObserver create infinite loop](https://stackoverflow.com/questions/65484575/mutationobserver-create-infinite-loop-when-i-replace-a-string-with-span-tag) - Observer disconnection patterns
- [LenioLabs: Mutation Observer](https://www.leniolabs.com/software-development/2023/08/23/Mutation-Observer/) - Optimization techniques
- [MoldStud: Maximize DOM performance with MutationObserver](https://moldstud.com/articles/p-maximize-dom-performance-how-to-use-the-mutationobserver-api-for-efficient-updates) - Batching and throttling
- [Dev.to: Tracking changes in the DOM using MutationObserver](https://dev.to/betelgeuseas/tracking-changes-in-the-dom-using-mutationobserver-i8h) - Alternative approaches
