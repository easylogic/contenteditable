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
---

When a MutationObserver is attached to a contenteditable element or its parent, the observer callbacks may interfere with editing performance. Frequent DOM mutations during typing can trigger many observer callbacks, causing lag or jank.
