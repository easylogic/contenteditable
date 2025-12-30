---
id: scenario-virtual-scrolling
title: Virtual scrolling libraries interfere with contenteditable selection
description: "When a contenteditable element is used with virtual scrolling libraries (e.g., for large documents), the virtual scrolling mechanism may interfere with text selection and caret positioning. The selection may be lost when elements are removed from the DOM during scrolling."
category: performance
tags:
  - virtual-scrolling
  - performance
  - selection
  - chrome
  - macos
status: draft
locale: en
---

When a contenteditable element is used with virtual scrolling libraries (e.g., for large documents), the virtual scrolling mechanism may interfere with text selection and caret positioning. The selection may be lost when elements are removed from the DOM during scrolling.
