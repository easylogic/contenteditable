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
---

When a ResizeObserver is attached to a contenteditable element, the observer may trigger during editing as content changes size. This can cause layout recalculations and visual jumps, especially when the contenteditable has dynamic height.
