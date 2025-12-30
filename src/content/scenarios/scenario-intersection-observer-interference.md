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
