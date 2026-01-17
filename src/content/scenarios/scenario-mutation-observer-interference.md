---
id: scenario-mutation-observer-interference
title: MutationObserver may interfere with contenteditable editing
description: "When a MutationObserver is attached to a contenteditable element or its parent, the observer callbacks may interfere with editing performance. Frequent DOM mutations during typing can trigger many observer callbacks, causing lag or jank."
category: performance
tags:
  - mutation-observer
  - performance
  - editing
  - safari
  - macos
status: draft
locale: en
---

When a MutationObserver is attached to a contenteditable element or its parent, the observer callbacks may interfere with editing performance. Frequent DOM mutations during typing can trigger many observer callbacks, causing lag or jank.

## References

- [Stack Overflow: How to reproduce batched mutations from MutationObserver](https://stackoverflow.com/questions/65722353/how-to-reproduce-batched-mutations-from-mutationobserver-in-contenteditable) - Mutation batching
- [BhojPress: Exploring Observer Patterns in JavaScript](https://bhojpress.com/blogs/libraries-frameworks/exploring-observer-patterns-in-javascript-efficient-techniques-for-dynamic-uis-and-performance-optimization) - Performance optimization
- [Stack Overflow: MutationObserver create infinite loop](https://stackoverflow.com/questions/65484575/mutationobserver-create-infinite-loop-when-i-replace-a-string-with-span-tag) - Observer disconnection patterns
- [LenioLabs: Mutation Observer](https://www.leniolabs.com/software-development/2023/08/23/Mutation-Observer/) - Optimization techniques
- [MoldStud: Maximize DOM performance with MutationObserver](https://moldstud.com/articles/p-maximize-dom-performance-how-to-use-the-mutationobserver-api-for-efficient-updates) - Batching and throttling
- [Dev.to: Tracking changes in the DOM using MutationObserver](https://dev.to/betelgeuseas/tracking-changes-in-the-dom-using-mutationobserver-i8h) - Alternative approaches
